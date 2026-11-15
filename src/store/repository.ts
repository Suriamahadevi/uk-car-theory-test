import type { AppData } from '../types';

/**
 * Persistence boundary. The app only talks to a Repository, so a server/database
 * implementation can replace LocalStorageRepository later without touching the UI.
 */
export interface Repository {
  load(): AppData;
  save(data: AppData): void;
  clear(): void;
}

const KEY = 'theory-test-ready:v1';

export function emptyData(): AppData {
  return {
    version: 1,
    attempts: [],
    mistakes: {},
    mocks: [],
    activeMock: null,
    activeSession: null,
    notesRead: {},
    revisionCardsDone: {},
    hazard: [],
    hazardLessonsDone: false,
    settings: { autoAdvance: false, showTimer: true, largeText: false, masteryTarget: 2 },
  };
}

/** Fill in any fields missing from older saved data. */
export function normalise(raw: unknown): AppData {
  const base = emptyData();
  if (!raw || typeof raw !== 'object') return base;
  const r = raw as Partial<AppData>;
  return {
    ...base,
    ...r,
    version: 1,
    settings: { ...base.settings, ...(r.settings ?? {}) },
    attempts: Array.isArray(r.attempts) ? r.attempts : [],
    mocks: Array.isArray(r.mocks) ? r.mocks : [],
    hazard: Array.isArray(r.hazard) ? r.hazard : [],
    mistakes: r.mistakes && typeof r.mistakes === 'object' ? r.mistakes : {},
  };
}

export class LocalStorageRepository implements Repository {
  load(): AppData {
    try {
      const txt = window.localStorage.getItem(KEY);
      return txt ? normalise(JSON.parse(txt)) : emptyData();
    } catch {
      return emptyData();
    }
  }
  save(data: AppData): void {
    try {
      window.localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save progress', e);
    }
  }
  clear(): void {
    try {
      window.localStorage.removeItem(KEY);
    } catch {
      /* ignore */
    }
  }
}
