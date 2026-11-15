import type { AppData, Attempt, Question, TopicId } from '../types';
import { alertness, attitude } from '../data/questions/alertness-attitude';
import { safetyVehicle, safetyMargins } from '../data/questions/vehicle-safety-margins';
import { hazardAwareness, vulnerable } from '../data/questions/hazard-vulnerable';
import { otherVehicles, vehicleHandling } from '../data/questions/vehicles-handling';
import { motorway, rulesOfRoad } from '../data/questions/motorway-rules';
import { signs, documents, incidents, loading } from '../data/questions/signs-docs-incidents-loading';
import { generatedQuestions } from './generator';
import { extraQuestions } from '../data/questions/extra';
import { CASE_STUDIES, CASE_STUDY_QUESTIONS } from '../data/caseStudies';
import { TOPICS } from '../data/topics';
import { shuffle } from './random';

export const WRITTEN: Question[] = [
  ...alertness, ...attitude, ...safetyVehicle, ...safetyMargins, ...hazardAwareness, ...vulnerable,
  ...otherVehicles, ...vehicleHandling, ...motorway, ...rulesOfRoad, ...signs, ...documents, ...incidents, ...loading,
  ...extraQuestions, ...CASE_STUDY_QUESTIONS,
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

/** Distinct rules (ruleKey) per topic – used for completion so many generated variants of one rule do not inflate the target. */
const ruleKey = (q: Question) => q.ruleKey ?? q.id;
const TOPIC_RULES: Record<string, Set<string>> = {};
for (const q of ALL_QUESTIONS) (TOPIC_RULES[q.topic] ??= new Set()).add(ruleKey(q));

/** A topic is complete when its notes are marked read AND at least 80% of its distinct rules have been practised. */
export const COMPLETION_SHARE = 0.8;
export function topicProgress(data: AppData, t: TopicId, _stats?: Record<TopicId, TopicStat>) {
  const seenRules = new Set<string>();
  for (const a of data.attempts) {
    const q = QMAP[a.qid];
    if (q && q.topic === t) seenRules.add(ruleKey(q));
  }
  const totalRules = TOPIC_RULES[t]?.size ?? 0;
  const practiceShare = totalRules ? seenRules.size / totalRules : 0;
  const notesDone = !!data.notesRead[t];
  const practiceDone = practiceShare >= COMPLETION_SHARE;
  const percent = Math.round(((notesDone ? 1 : 0) * 20) + Math.min(practiceShare / COMPLETION_SHARE, 1) * 80);
  return { notesDone, practiceDone, complete: notesDone && practiceDone, percent, practiceShare, rulesSeen: seenRules.size, totalRules };
}

/** Topics ordered weakest first (unattempted topics count as weak). */
export function weakTopics(data: AppData): TopicId[] {
  const st = topicStats(data);
  return [...TOPICS]
    .map((t) => ({ id: t.id, acc: st[t.id].accuracy ?? 0.5, n: st[t.id].attempted }))
    .sort((a, b) => a.acc - b.acc || a.n - b.n)
    .map((x) => x.id);
}

/** Tags (concepts) the learner gets wrong most, with miss counts. */
export function missedConcepts(data: AppData): { tag: string; wrong: number; total: number }[] {
  const m = new Map<string, { wrong: number; total: number }>();
  for (const a of data.attempts) {
    const q = QMAP[a.qid];
    if (!q) continue;
    for (const t of q.tags) {
      const e = m.get(t) ?? { wrong: 0, total: 0 };
      e.total++;
      if (!a.correct) e.wrong++;
      m.set(t, e);
    }
  }
  return [...m.entries()].map(([tag, v]) => ({ tag, ...v })).filter((x) => x.wrong > 0).sort((a, b) => b.wrong / b.total - a.wrong / a.total || b.wrong - a.wrong);
}

/** Questions testing related concepts (shared tags) but a different rule. */
export function relatedQuestions(q: Question, n = 3): Question[] {
  const scored = ALL_QUESTIONS.filter((x) => x.id !== q.id && ruleKey(x) !== ruleKey(q) && !x.caseStudy)
    .map((x) => ({ x, s: x.tags.filter((t) => q.tags.includes(t)).length + (x.topic === q.topic ? 0.5 : 0) }))
    .filter((e) => e.s >= 1)
    .sort((a, b) => b.s - a.s || (a.x.id < b.x.id ? -1 : 1));
  return uniqueRules(scored.map((e) => e.x)).slice(0, n);
}

// ---------------------------------------------------------------- selection
/** Remove questions whose ruleKey has already been used, keeping order. */
function uniqueRules(qs: Question[]): Question[] {
  const seen = new Set<string>();
  const out: Question[] = [];
  for (const q of qs) {
    const k = ruleKey(q);
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
  prefer: 'unseen' | 'weak' | 'random' | 'smart';
  scenarioOnly?: boolean;
  tags?: string[];
  multiOnly?: boolean;
}

/** Build a practice set: no duplicate rules, prioritising unseen questions, weak areas or a smart mix. */
export function buildPractice(data: AppData, o: PracticeOptions): string[] {
  const stats = questionStats(data.attempts);
  let pool = ALL_QUESTIONS.filter((q) => o.topics.includes(q.topic));
  if (o.difficulty !== 'any') pool = pool.filter((q) => q.difficulty === o.difficulty);
  if (o.scenarioOnly) pool = pool.filter((q) => q.kind === 'scenario');
  if (o.multiOnly) pool = pool.filter((q) => q.correct.length > 1);
  if (o.tags?.length) pool = pool.filter((q) => q.tags.some((t) => o.tags!.includes(t)));
  const tStats = topicStats(data);
  const missed = new Map(missedConcepts(data).map((c) => [c.tag, c.wrong / c.total]));
  const seenRules = new Set(Object.keys(stats).filter((id) => QMAP[id]).map((id) => ruleKey(QMAP[id])));
  const diffW = { easy: 0, medium: 1, hard: 2 } as const;
  const score = (q: Question) => {
    const s = stats[q.id];
    const r = Math.random();
    if (o.prefer === 'random') return r;
    if (o.prefer === 'unseen') return (s ? 10 + s.attempts : 0) + r * 3;
    const topicAcc = tStats[q.topic].accuracy ?? 0.5;
    if (o.prefer === 'weak') {
      const last = s?.lastCorrect === false ? -20 : s ? 5 : 0;
      return last + topicAcc * 10 + r * 4;
    }
    // smart: weak topics + frequently missed concepts + difficult + previously unseen rules (lower = earlier)
    const conceptMiss = Math.max(0, ...q.tags.map((t) => missed.get(t) ?? 0));
    const unseenRule = seenRules.has(ruleKey(q)) ? 0 : 1;
    const lastWrong = s?.lastCorrect === false ? 1 : 0;
    const recentlyRight = s?.lastCorrect ? 1 : 0;
    return -(4 * (1 - topicAcc) + 5 * conceptMiss + 1.5 * diffW[q.difficulty] + 3 * unseenRule + 6 * lastWrong - 4 * recentlyRight) + r * 3;
  };
  const ordered = pool.map((q) => ({ q, s: score(q) })).sort((a, b) => a.s - b.s).map((x) => x.q);
  return shuffle(uniqueRules(ordered).slice(0, o.count)).map((q) => q.id);
}

/**
 * Build a 50-question mock test: 47 questions across all 14 topics plus one
 * 3-question video case study (simulated). Questions used in previous mock tests are
 * avoided until the bank runs out; verify-flagged questions are excluded.
 */
export function buildMock(data: AppData, total = 50): string[] {
  const usedInMocks = new Map<string, number>();
  for (const m of data.mocks) for (const a of m.answers) usedInMocks.set(a.qid, (usedInMocks.get(a.qid) ?? 0) + 1);
  if (data.activeMock) for (const a of data.activeMock.answers) usedInMocks.set(a.qid, (usedInMocks.get(a.qid) ?? 0) + 1);

  // Case study: the one used least in previous mocks.
  const used = (ids: string[]) => ids.reduce((n, id) => n + (usedInMocks.get(id) ?? 0), 0);
  const cs = shuffle(CASE_STUDIES).sort((a, b) => used(a.questionIds) - used(b.questionIds))[0];
  const csQs = cs ? cs.questionIds.map((id) => QMAP[id]).filter(Boolean) : [];
  const regular = total - csQs.length;

  // Allocation: 3 per topic (42) + the remainder spread over the largest topics.
  const alloc: Record<string, number> = Object.fromEntries(TOPICS.map((t) => [t.id, 3]));
  const extra: TopicId[] = ['signs', 'rules-of-road', 'vulnerable', 'hazard-awareness', 'safety-margins', 'motorway', 'incidents', 'alertness'];
  let left = regular - TOPICS.length * 3;
  for (const t of extra) if (left-- > 0) alloc[t]++;

  const chosen: Question[] = [];
  const usedRules = new Set<string>(csQs.map(ruleKey));
  for (const t of TOPICS) {
    const pool = shuffle(ALL_QUESTIONS.filter((q) => q.topic === t.id && !q.verify && !q.caseStudy))
      .sort((a, b) => (usedInMocks.get(a.id) ?? 0) - (usedInMocks.get(b.id) ?? 0));
    let need = alloc[t.id];
    for (const q of pool) {
      if (need <= 0) break;
      const k = ruleKey(q);
      if (usedRules.has(k)) continue;
      usedRules.add(k);
      chosen.push(q);
      need--;
    }
  }
  // As in the real test, the video case study questions come together at the end.
  return [...shuffle(chosen).map((q) => q.id), ...csQs.map((q) => q.id)];
}

// ---------------------------------------------------------------- spaced revision
export function dueMistakes(data: AppData, now = Date.now()) {
  return Object.values(data.mistakes).filter((m) => QMAP[m.qid] && !m.mastered && (m.nextDue ?? 0) <= now);
}

// ---------------------------------------------------------------- readiness
export interface Readiness {
  level: 'not-ready' | 'building' | 'nearly' | 'ready';
  label: string;
  checks: { label: string; ok: boolean; detail: string }[];
}

/** Evidence-based readiness assessment. It never promises a pass. */
export function readiness(data: AppData): Readiness {
  const last3 = data.mocks.slice(-3);
  const fullHp = data.hazard.filter((h) => h.full).slice(-3);
  const st = topicStats(data);
  const weak = TOPICS.filter((t) => st[t.id].attempted >= 5 && (st[t.id].accuracy ?? 0) < 0.86);
  const untried = TOPICS.filter((t) => st[t.id].attempted < 5);
  const open = Object.values(data.mistakes).filter((m) => !m.mastered).length;
  const checks = [
    { label: 'Last 3 mock tests all 48 or more out of 50', ok: last3.length === 3 && last3.every((m) => m.score >= 48), detail: last3.length ? `Recent scores: ${last3.map((m) => m.score).join(', ')}` : 'No mock tests yet' },
    { label: 'Last 3 mock tests all passed (43 or more)', ok: last3.length === 3 && last3.every((m) => m.score >= 43), detail: `${last3.filter((m) => m.score >= 43).length} of ${last3.length} recent tests passed` },
    { label: 'Hazard perception: last 3 full simulations 50 or more (pass mark 44)', ok: fullHp.length === 3 && fullHp.every((h) => h.score >= 50), detail: fullHp.length ? `Recent: ${fullHp.map((h) => h.score).join(', ')}` : 'No full simulations yet' },
    { label: 'No weak topics (every topic at least 86% accurate)', ok: weak.length === 0 && untried.length === 0, detail: weak.length ? `Weak: ${weak.map((t) => t.title).join(', ')}` : untried.length ? `${untried.length} topics need more practice (at least 5 answers each)` : 'All topics strong' },
    { label: 'Mistake Book under control (10 or fewer open, after 100+ answers)', ok: data.attempts.length >= 100 && open <= 10, detail: `${open} mistakes still need revision · ${data.attempts.length} answers so far` },
  ];
  const passed = checks.filter((c) => c.ok).length;
  const level: Readiness['level'] = passed === 5 ? 'ready' : passed >= 3 ? 'nearly' : passed >= 1 ? 'building' : 'not-ready';
  const label = { ready: 'Consistently test-ready', nearly: 'Nearly ready', building: 'Building up', 'not-ready': 'Not ready yet' }[level];
  return { level, label, checks };
}

export function sourceLabel(q: Question): string {
  if (q.source.kind === 'book') return `AA book${q.source.page ? `, page ${q.source.page}` : ''}`;
  if (q.source.kind === 'generated') return 'Generated from official rule data';
  return 'Written from official guidance';
}
