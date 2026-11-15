import type { AppData } from '../types';

export function dayKey(ts: number): string {
  const d = new Date(ts);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

export function activeDays(data: AppData): Set<string> {
  const days = new Set<string>();
  for (const a of data.attempts) days.add(dayKey(a.at));
  for (const h of data.hazard) days.add(dayKey(h.at));
  for (const m of data.mocks) days.add(dayKey(m.finishedAt));
  return days;
}

/** Consecutive days with any study activity, ending today (or yesterday if nothing yet today). */
export function learningStreak(data: AppData, now = Date.now()): number {
  const days = activeDays(data);
  let d = new Date(now);
  if (!days.has(dayKey(d.getTime()))) d = new Date(d.getTime() - 86400000);
  let n = 0;
  while (days.has(dayKey(d.getTime()))) {
    n++;
    d = new Date(d.getTime() - 86400000);
  }
  return n;
}

/** Accuracy per day for the last `n` days that had answers. */
export function dailyAccuracy(data: AppData, n = 10): { day: string; accuracy: number; answers: number }[] {
  const m = new Map<string, { c: number; t: number }>();
  for (const a of data.attempts) {
    const k = dayKey(a.at);
    const e = m.get(k) ?? { c: 0, t: 0 };
    e.t++;
    if (a.correct) e.c++;
    m.set(k, e);
  }
  return [...m.entries()].sort(([a], [b]) => (a < b ? -1 : 1)).slice(-n).map(([day, e]) => ({ day, accuracy: e.c / e.t, answers: e.t }));
}

export function hazardAverage(data: AppData): number | null {
  const full = data.hazard.filter((h) => h.full);
  return full.length ? full.reduce((s, h) => s + h.score, 0) / full.length : null;
}
