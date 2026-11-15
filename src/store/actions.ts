import type { ActiveSession, Attempt, MockResult } from '../types';
import { getState, recordAttempts, setState, sameSet, uid } from './store';
import { QMAP, buildMock } from '../engine/bank';

export const MOCK_QUESTIONS = 50;
export const MOCK_MINUTES = 57;
export const PASS_MARK = 43;

export function startSession(opts: {
  title: string;
  qids: string[];
  mode: ActiveSession['mode'];
  fromMockId?: string;
  returnTo?: string;
}): void {
  const qids = opts.qids.filter((id) => QMAP[id]);
  setState((s) => ({
    ...s,
    activeSession: {
      id: uid('s'),
      title: opts.title,
      mode: opts.mode,
      qids,
      index: 0,
      answered: {},
      startedAt: Date.now(),
      fromMockId: opts.fromMockId,
      returnTo: opts.returnTo,
    },
  }));
}

/** Record an answer in the active learning/revision session (and the Mistake Book). */
export function answerInSession(qid: string, selected: number[]): boolean {
  const s = getState();
  const sess = s.activeSession;
  const q = QMAP[qid];
  if (!sess || !q) return false;
  const correct = sameSet(selected, q.correct);
  if (sess.answered[qid]) return correct; // already answered in this session
  const attempt: Attempt = { qid, selected, correct, at: Date.now(), mode: sess.mode, sessionId: sess.id };
  recordAttempts([attempt]);
  setState((st) => (st.activeSession ? { ...st, activeSession: { ...st.activeSession, answered: { ...st.activeSession.answered, [qid]: selected } } } : st));
  return correct;
}

export function setSessionIndex(i: number): void {
  setState((s) => (s.activeSession ? { ...s, activeSession: { ...s.activeSession, index: i } } : s));
}

export function finishSession(): void {
  setState((s) => {
    const sess = s.activeSession;
    if (!sess) return s;
    // A mock counts as revised only when every revision question has been answered.
    const allAnswered = sess.qids.every((id) => sess.answered[id]);
    const mocks = sess.fromMockId && allAnswered
      ? s.mocks.map((m) => (m.id === sess.fromMockId ? { ...m, revisionCompleted: true } : m))
      : s.mocks;
    return { ...s, mocks };
  });
}

export function endSession(): void {
  setState((s) => ({ ...s, activeSession: null }));
}

export function startMock(): void {
  const s = getState();
  const qids = buildMock(s, MOCK_QUESTIONS);
  const now = Date.now();
  setState((st) => ({
    ...st,
    activeMock: {
      id: uid('mock'),
      startedAt: now,
      deadline: now + MOCK_MINUTES * 60 * 1000,
      answers: qids.map((qid) => ({ qid, selected: [], flagged: false })),
      current: 0,
    },
  }));
}

export function submitMock(timedOut: boolean): string | null {
  const s = getState();
  const m = s.activeMock;
  if (!m) return null;
  const now = Math.min(Date.now(), m.deadline);
  let score = 0;
  const attempts: Attempt[] = [];
  for (const a of m.answers) {
    const q = QMAP[a.qid];
    if (!q) continue;
    const ok = a.selected.length > 0 && sameSet(a.selected, q.correct);
    if (ok) score++;
    if (a.selected.length > 0) attempts.push({ qid: a.qid, selected: a.selected, correct: ok, at: now, mode: 'mock', sessionId: m.id });
  }
  const result: MockResult = {
    id: m.id,
    startedAt: m.startedAt,
    finishedAt: now,
    durationMs: now - m.startedAt,
    answers: m.answers,
    score,
    total: m.answers.length,
    passed: score >= PASS_MARK,
    timedOut,
    revisionCompleted: false,
  };
  setState((st) => ({ ...st, activeMock: null, mocks: [...st.mocks, result] }));
  recordAttempts(attempts);
  return result.id;
}
