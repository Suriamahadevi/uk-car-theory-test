import type { AppData, Attempt, Question, TopicId } from '../types';
import { alertness, attitude } from '../data/questions/alertness-attitude';
import { safetyVehicle, safetyMargins } from '../data/questions/vehicle-safety-margins';
import { hazardAwareness, vulnerable } from '../data/questions/hazard-vulnerable';
import { otherVehicles, vehicleHandling } from '../data/questions/vehicles-handling';
import { motorway, rulesOfRoad } from '../data/questions/motorway-rules';
import { signs, documents, incidents, loading } from '../data/questions/signs-docs-incidents-loading';
import { generatedQuestions } from './generator';
import { TOPICS } from '../data/topics';
import { shuffle } from './random';

export const WRITTEN: Question[] = [
  ...alertness, ...attitude, ...safetyVehicle, ...safetyMargins, ...hazardAwareness, ...vulnerable,
  ...otherVehicles, ...vehicleHandling, ...motorway, ...rulesOfRoad, ...signs, ...documents, ...incidents, ...loading,
];

export const ALL_QUESTIONS: Question[] = [...WRITTEN, ...generatedQuestions()];
export const QMAP: Record<string, Question> = Object.fromEntries(ALL_QUESTIONS.map((q) => [q.id, q]));

export function byTopic(t: TopicId): Question[] {
  return ALL_QUESTIONS.filter((q) => q.topic === t);
}

// ---------------------------------------------------------------- stats
export interface QStat { attempts: number; correct: number; lastCorrect: boolean | null; lastAt: number }

export function questionStats(attempts: Attempt[]): Record<string, QStat> {
  const m: Record<string, QStat> = {};
  for (const a of attempts) {
    const s = (m[a.qid] ??= { attempts: 0, correct: 0, lastCorrect: null, lastAt: 0 });
    s.attempts++;
    if (a.correct) s.correct++;
    s.lastCorrect = a.correct;
    s.lastAt = a.at;
  }
  return m;
}

export interface TopicStat { topic: TopicId; attempted: number; uniqueAttempted: number; total: number; correct: number; accuracy: number | null }

export function topicStats(data: AppData): Record<TopicId, TopicStat> {
  const qs = questionStats(data.attempts);
  const out = {} as Record<TopicId, TopicStat>;
  for (const t of TOPICS) {
    out[t.id] = { topic: t.id, attempted: 0, uniqueAttempted: 0, total: 0, correct: 0, accuracy: null };
  }
  for (const q of ALL_QUESTIONS) out[q.topic].total++;
  for (const [qid, s] of Object.entries(qs)) {
    const q = QMAP[qid];
    if (!q) continue;
    const t = out[q.topic];
    t.attempted += s.attempts;
    t.correct += s.correct;
    t.uniqueAttempted++;
  }
  for (const t of Object.values(out)) t.accuracy = t.attempted ? t.correct / t.attempted : null;
  return out;
}

/** A topic is complete when its notes are marked read AND at least 80% of its questions have been attempted. */
export const COMPLETION_SHARE = 0.8;
export function topicProgress(data: AppData, t: TopicId, stats = topicStats(data)) {
  const s = stats[t];
  const practiceShare = s.total ? s.uniqueAttempted / s.total : 0;
  const notesDone = !!data.notesRead[t];
  const practiceDone = practiceShare >= COMPLETION_SHARE;
  const percent = Math.round(((notesDone ? 1 : 0) * 20) + Math.min(practiceShare / COMPLETION_SHARE, 1) * 80);
  return { notesDone, practiceDone, complete: notesDone && practiceDone, percent, practiceShare };
}

/** Topics ordered weakest first (unattempted topics count as weak). */
export function weakTopics(data: AppData): TopicId[] {
  const st = topicStats(data);
  return [...TOPICS]
    .map((t) => ({ id: t.id, acc: st[t.id].accuracy ?? 0.5, n: st[t.id].attempted }))
    .sort((a, b) => a.acc - b.acc || a.n - b.n)
    .map((x) => x.id);
}

// ---------------------------------------------------------------- selection
/** Remove questions whose ruleKey has already been used, keeping order. */
function uniqueRules(qs: Question[]): Question[] {
  const seen = new Set<string>();
  const out: Question[] = [];
  for (const q of qs) {
    const k = q.ruleKey ?? q.id;
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(q);
  }
  return out;
}

export interface PracticeOptions {
  topics: TopicId[];
  count: number;
  difficulty: 'any' | 'easy' | 'medium' | 'hard';
  prefer: 'unseen' | 'weak' | 'random';
  scenarioOnly?: boolean;
}

/** Build a practice set: no duplicate rules, prioritising unseen questions or weak areas. */
export function buildPractice(data: AppData, o: PracticeOptions): string[] {
  const stats = questionStats(data.attempts);
  let pool = ALL_QUESTIONS.filter((q) => o.topics.includes(q.topic));
  if (o.difficulty !== 'any') pool = pool.filter((q) => q.difficulty === o.difficulty);
  if (o.scenarioOnly) pool = pool.filter((q) => q.kind === 'scenario');
  const tStats = topicStats(data);
  const score = (q: Question) => {
    const s = stats[q.id];
    const r = Math.random();
    if (o.prefer === 'random') return r;
    if (o.prefer === 'unseen') return (s ? 10 + s.attempts : 0) + r * 3;
    // weak: wrong last time first, then weak topics, then unseen
    const topicAcc = tStats[q.topic].accuracy ?? 0.5;
    const last = s?.lastCorrect === false ? -20 : s ? 5 : 0;
    return last + topicAcc * 10 + r * 4;
  };
  const ordered = pool.map((q) => ({ q, s: score(q) })).sort((a, b) => a.s - b.s).map((x) => x.q);
  return shuffle(uniqueRules(ordered).slice(0, o.count)).map((q) => q.id);
}

/**
 * Build a 50-question mock test covering all 14 topics. Questions used in previous
 * mock tests are avoided until the bank runs out; verify-flagged questions are excluded.
 */
export function buildMock(data: AppData, total = 50): string[] {
  const usedInMocks = new Map<string, number>();
  for (const m of data.mocks) for (const a of m.answers) usedInMocks.set(a.qid, (usedInMocks.get(a.qid) ?? 0) + 1);
  if (data.activeMock) for (const a of data.activeMock.answers) usedInMocks.set(a.qid, (usedInMocks.get(a.qid) ?? 0) + 1);

  // Allocation: 3 per topic (42) + 8 extra spread over the largest topics.
  const alloc: Record<string, number> = Object.fromEntries(TOPICS.map((t) => [t.id, 3]));
  const extra: TopicId[] = ['signs', 'rules-of-road', 'vulnerable', 'hazard-awareness', 'safety-margins', 'motorway', 'incidents', 'alertness'];
  let left = total - TOPICS.length * 3;
  for (const t of extra) if (left-- > 0) alloc[t]++;

  const chosen: Question[] = [];
  const usedRules = new Set<string>();
  for (const t of TOPICS) {
    const pool = shuffle(ALL_QUESTIONS.filter((q) => q.topic === t.id && !q.verify))
      .sort((a, b) => (usedInMocks.get(a.id) ?? 0) - (usedInMocks.get(b.id) ?? 0));
    let need = alloc[t.id];
    for (const q of pool) {
      if (need <= 0) break;
      const k = q.ruleKey ?? q.id;
      if (usedRules.has(k)) continue;
      usedRules.add(k);
      chosen.push(q);
      need--;
    }
  }
  return shuffle(chosen).map((q) => q.id);
}

export function sourceLabel(q: Question): string {
  if (q.source.kind === 'book') return `AA book${q.source.page ? `, page ${q.source.page}` : ''}`;
  if (q.source.kind === 'generated') return 'Generated from official rule data';
  return 'Written from official guidance';
}
