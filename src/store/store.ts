import { useSyncExternalStore } from 'react';
import type { AppData, Attempt, MistakeEntry } from '../types';
import { LocalStorageRepository, emptyData, normalise, type Repository } from './repository';

const repo: Repository = new LocalStorageRepository();
let state: AppData = repo.load();
const listeners = new Set<() => void>();

export function getState(): AppData {
  return state;
}

export function setState(updater: (s: AppData) => AppData): void {
  state = updater(state);
  repo.save(state);
  listeners.forEach((l) => l());
}

export function subscribe(l: () => void): () => void {
  listeners.add(l);
  return () => listeners.delete(l);
}

// Keep several open tabs in sync.
if (typeof window !== 'undefined') {
  window.addEventListener('storage', () => {
    state = repo.load();
    listeners.forEach((l) => l());
  });
}

export function useAppData(): AppData {
  return useSyncExternalStore(subscribe, getState, getState);
}

export function uid(prefix = 'id'): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}

/** Update the Mistake Book entry for one answered question (pure). */
export function applyToMistakes(
  mistakes: Record<string, MistakeEntry>,
  a: Attempt,
  masteryTarget: number,
): Record<string, MistakeEntry> {
  const existing = mistakes[a.qid];
  if (!a.correct) {
    return {
      ...mistakes,
      [a.qid]: {
        qid: a.qid,
        lastSelected: a.selected,
        timesWrong: (existing?.timesWrong ?? 0) + 1,
        firstWrongAt: existing?.firstWrongAt ?? a.at,
        lastAttemptAt: a.at,
        correctSessions: [],
        mastered: false,
      },
    };
  }
  if (!existing) return mistakes;
  const sessions = existing.correctSessions.includes(a.sessionId)
    ? existing.correctSessions
    : [...existing.correctSessions, a.sessionId];
  return {
    ...mistakes,
    [a.qid]: {
      ...existing,
      lastAttemptAt: a.at,
      correctSessions: sessions,
      mastered: sessions.length >= masteryTarget,
    },
  };
}

/** Record answers (learning, revision or a submitted mock) and update the Mistake Book. */
export function recordAttempts(attempts: Attempt[]): void {
  if (!attempts.length) return;
  setState((s) => {
    let mistakes = s.mistakes;
    for (const a of attempts) mistakes = applyToMistakes(mistakes, a, s.settings.masteryTarget);
    return { ...s, attempts: [...s.attempts, ...attempts], mistakes };
  });
}

export function resetAll(): void {
  repo.clear();
  state = emptyData();
  repo.save(state);
  listeners.forEach((l) => l());
}

export function importData(json: string): void {
  const parsed = normalise(JSON.parse(json));
  setState(() => parsed);
}

export function sameSet(a: number[], b: number[]): boolean {
  if (a.length !== b.length) return false;
  const sa = [...a].sort();
  const sb = [...b].sort();
  return sa.every((v, i) => v === sb[i]);
}
