import { describe, expect, it } from 'vitest';
import { ALL_QUESTIONS, buildMock, buildPractice, QMAP } from './bank';
import { emptyData } from '../store/repository';
import { applyToMistakes } from '../store/store';
import { scoreClip, pointsForClick, isCheating } from './hazardScoring';
import { CLIPS } from '../data/hazardClips';
import { TOPICS } from '../data/topics';
import { SIGN_MAP } from '../data/signs';
import type { AppData, MockResult } from '../types';

describe('question bank integrity', () => {
  it('has unique IDs', () => {
    const ids = ALL_QUESTIONS.map((q) => q.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('every question is well formed', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.options.length, q.id).toBeGreaterThanOrEqual(2);
      expect(q.optionNotes.length, q.id).toBe(q.options.length);
      expect(new Set(q.options).size, `${q.id} duplicate options`).toBe(q.options.length);
      expect(q.correct.length, q.id).toBeGreaterThan(0);
      for (const c of q.correct) expect(c >= 0 && c < q.options.length, q.id).toBe(true);
      expect(q.explanation.length, q.id).toBeGreaterThan(10);
      expect(q.rule.length, q.id).toBeGreaterThan(3);
      expect(q.source.ref.length, q.id).toBeGreaterThan(3);
      expect(q.source.kind, q.id).not.toBe('book'); // no book pages were provided
      if (q.sign) expect(SIGN_MAP[q.sign], q.id).toBeDefined();
      if (q.optionSigns) for (const s of q.optionSigns) expect(SIGN_MAP[s], q.id).toBeDefined();
    }
  });

  it('every topic has questions', () => {
    for (const t of TOPICS) {
      const n = ALL_QUESTIONS.filter((q) => q.topic === t.id).length;
      expect(n, t.id).toBeGreaterThanOrEqual(12);
    }
  });
});

function fakeMock(_data: AppData, qids: string[], id: string): MockResult {
  return { id, startedAt: 0, finishedAt: 1, durationMs: 1, answers: qids.map((qid) => ({ qid, selected: [], flagged: false })), score: 0, total: qids.length, passed: false, timedOut: false, revisionCompleted: false };
}

describe('mock test generation', () => {
  it('builds 50 unique questions across all 14 topics, without verify-flagged items', () => {
    const qids = buildMock(emptyData());
    expect(qids.length).toBe(50);
    expect(new Set(qids).size).toBe(50);
    const topics = new Set(qids.map((id) => QMAP[id].topic));
    expect(topics.size).toBe(14);
    expect(qids.some((id) => QMAP[id].verify)).toBe(false);
    const rules = qids.map((id) => QMAP[id].ruleKey ?? id);
    expect(new Set(rules).size).toBe(50);
  });

  it('a second mock test avoids the questions from the first', () => {
    const data = emptyData();
    const first = buildMock(data);
    data.mocks.push(fakeMock(data, first, 'm1'));
    const second = buildMock(data);
    const overlap = second.filter((id) => first.includes(id));
    expect(overlap.length).toBe(0);
  });
});

describe('practice sessions', () => {
  it('never repeats a rule within a session', () => {
    const qids = buildPractice(emptyData(), { topics: TOPICS.map((t) => t.id), count: 50, difficulty: 'any', prefer: 'random' });
    const rules = qids.map((id) => QMAP[id].ruleKey ?? id);
    expect(new Set(rules).size).toBe(qids.length);
  });
});

describe('Mistake Book mastery', () => {
  it('requires correct answers in separate sessions', () => {
    let m = applyToMistakes({}, { qid: 'X', selected: [1], correct: false, at: 1, mode: 'learn', sessionId: 'a' }, 2);
    expect(m.X.timesWrong).toBe(1);
    m = applyToMistakes(m, { qid: 'X', selected: [0], correct: true, at: 2, mode: 'revision', sessionId: 'b' }, 2);
    expect(m.X.mastered).toBe(false);
    m = applyToMistakes(m, { qid: 'X', selected: [0], correct: true, at: 3, mode: 'revision', sessionId: 'b' }, 2);
    expect(m.X.mastered).toBe(false); // same session does not count twice
    m = applyToMistakes(m, { qid: 'X', selected: [0], correct: true, at: 4, mode: 'revision', sessionId: 'c' }, 2);
    expect(m.X.mastered).toBe(true);
    m = applyToMistakes(m, { qid: 'X', selected: [2], correct: false, at: 5, mode: 'mock', sessionId: 'd' }, 2);
    expect(m.X.mastered).toBe(false);
    expect(m.X.timesWrong).toBe(2);
  });
});

describe('hazard perception scoring', () => {
  it('has 14 clips and 15 hazards (max 75)', () => {
    expect(CLIPS.length).toBe(14);
    expect(CLIPS.reduce((a, c) => a + c.hazards.length, 0)).toBe(15);
  });
  it('scores 5 down to 1 across the window', () => {
    const h = { start: 10, end: 15, what: '' };
    expect(pointsForClick(h, 9.9)).toBe(0);
    expect(pointsForClick(h, 10.1)).toBe(5);
    expect(pointsForClick(h, 14.9)).toBe(1);
    expect(pointsForClick(h, 15.1)).toBe(0);
  });
  it('gives zero for rapid clicking', () => {
    expect(isCheating([1, 1.5, 2, 2.5, 3])).toBe(true);
    expect(scoreClip([{ start: 1, end: 6, what: '' }], [1, 1.5, 2, 2.5, 3]).score).toBe(0);
    expect(isCheating([3, 8])).toBe(false);
  });
});
