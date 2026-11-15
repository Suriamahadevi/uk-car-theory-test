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

// ---------------------------------------------------------------- upgrade tests
import { normalise } from '../store/repository';
import { readiness, dueMistakes, relatedQuestions } from './bank';
import { CASE_STUDIES } from '../data/caseStudies';

describe('upgrade: question bank quality', () => {
  it('has no duplicate question texts with the same options', () => {
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
    const seen = new Map<string, string>();
    for (const q of ALL_QUESTIONS) {
      const k = [norm(q.text), q.sign ?? '', q.marking ?? '', (q.optionSigns ?? []).join(','), q.options.map(norm).sort().join('|')].join('#');
      expect(seen.has(k), `${q.id} duplicates ${seen.get(k)}`).toBe(false);
      seen.set(k, q.id);
    }
  });
  it('includes multiple-answer questions that say how many to mark', () => {
    const multi = ALL_QUESTIONS.filter((q) => q.correct.length > 1);
    expect(multi.length).toBeGreaterThanOrEqual(15);
    for (const q of multi) expect(q.text, q.id).toMatch(/mark (two|2) answers/i);
  });
  it('has all three difficulty levels in every topic', () => {
    for (const t of TOPICS) {
      const ds = new Set(ALL_QUESTIONS.filter((q) => q.topic === t.id).map((q) => q.difficulty));
      expect(ds.size, t.id).toBe(3);
    }
  });
  it('uses the October 2025 burns guidance (20 minutes)', () => {
    const q = QMAP['IN-03'];
    expect(q.options[q.correct[0]]).toMatch(/20 minutes/);
  });
  it('has CPR and AED questions', () => {
    expect(ALL_QUESTIONS.filter((q) => q.tags.includes('aed')).length).toBeGreaterThanOrEqual(5);
    expect(ALL_QUESTIONS.filter((q) => q.tags.includes('cpr')).length).toBeGreaterThanOrEqual(5);
  });
  it('every case study has 3 existing questions', () => {
    for (const c of CASE_STUDIES) {
      expect(c.questionIds.length).toBe(3);
      for (const id of c.questionIds) expect(QMAP[id]?.caseStudy).toBe(c.id);
    }
  });
  it('related questions share a concept and test a different rule', () => {
    const q = QMAP['VU-01'];
    const rel = relatedQuestions(q);
    expect(rel.length).toBeGreaterThan(0);
    for (const r of rel) expect(r.tags.some((t) => q.tags.includes(t))).toBe(true);
  });
});

describe('upgrade: mock format', () => {
  it('ends with a 3-question video case study, 47 others across 14 topics', () => {
    const qids = buildMock(emptyData());
    expect(qids.length).toBe(50);
    const last3 = qids.slice(-3).map((id) => QMAP[id]);
    expect(new Set(last3.map((q) => q.caseStudy)).size).toBe(1);
    expect(last3[0].caseStudy).toBeTruthy();
    expect(qids.slice(0, 47).some((id) => QMAP[id].caseStudy)).toBe(false);
    expect(new Set(qids.slice(0, 47).map((id) => QMAP[id].topic)).size).toBe(14);
  });
});

describe('upgrade: spaced revision and reactivation', () => {
  it('schedules spaced revision and reactivates mastered questions', () => {
    const DAYMS = 86400000;
    let m = applyToMistakes({}, { qid: 'Y', selected: [1], correct: false, at: 0, mode: 'learn', sessionId: 'a' }, 2);
    expect(m.Y.nextDue).toBe(0);
    m = applyToMistakes(m, { qid: 'Y', selected: [0], correct: true, at: 1000, mode: 'revision', sessionId: 'b' }, 2);
    expect(m.Y.nextDue).toBe(1000 + DAYMS);
    expect(m.Y.correctCount).toBe(1);
    m = applyToMistakes(m, { qid: 'Y', selected: [0], correct: true, at: 2000, mode: 'revision', sessionId: 'c' }, 2);
    expect(m.Y.mastered).toBe(true);
    expect(m.Y.nextDue).toBe(2000 + 3 * DAYMS);
    m = applyToMistakes(m, { qid: 'Y', selected: [2], correct: false, at: 3000, mode: 'mock', sessionId: 'd' }, 2);
    expect(m.Y.mastered).toBe(false);
    expect(m.Y.reactivations).toBe(1);
    expect(m.Y.correctCount).toBe(2);
  });
  it('lists only due, unmastered questions', () => {
    const d = emptyData();
    d.mistakes = applyToMistakes({}, { qid: 'AL-01', selected: [3], correct: false, at: 10, mode: 'learn', sessionId: 'a' }, 2);
    expect(dueMistakes(d, 20).length).toBe(1);
    d.mistakes = applyToMistakes(d.mistakes, { qid: 'AL-01', selected: [2], correct: true, at: 30, mode: 'learn', sessionId: 'b' }, 2);
    expect(dueMistakes(d, 40).length).toBe(0);
  });
});

describe('upgrade: existing saved data is preserved', () => {
  it('migrates old data without losing anything', () => {
    const old = {
      version: 1,
      attempts: [{ qid: 'AL-01', selected: [0], correct: false, at: 5, mode: 'learn', sessionId: 's' }],
      mistakes: { 'AL-01': { qid: 'AL-01', lastSelected: [0], timesWrong: 1, firstWrongAt: 5, lastAttemptAt: 5, correctSessions: [], mastered: false } },
      mocks: [{ id: 'm1', score: 40 }],
      notesRead: { alertness: 1 },
      settings: { masteryTarget: 3 },
    };
    const d = normalise(old);
    expect(d.attempts.length).toBe(1);
    expect(d.mocks.length).toBe(1);
    expect(d.notesRead.alertness).toBe(1);
    expect(d.settings.masteryTarget).toBe(3);
    expect(d.settings.showTimer).toBe(true);
    expect(d.mistakes['AL-01'].correctCount).toBe(0);
    expect(d.mistakes['AL-01'].nextDue).toBe(5);
    expect(d.mistakes['AL-01'].reactivations).toBe(0);
    expect(d.bookmarks).toEqual([]);
  });
});

describe('upgrade: readiness never over-promises', () => {
  it('is not ready with no evidence', () => {
    expect(readiness(emptyData()).level).toBe('not-ready');
  });
});

// ---------------------------------------------------------------- content audit (Phase 3)
describe('content audit: official figures', () => {
  const ans = (id: string) => { const q = QMAP[id]; return q.options[q.correct[0]]; };
  it('stopping distances match Highway Code rule 126 and add up', () => {
    const table: Record<number, [number, number, number]> = { 20: [6, 6, 12], 30: [9, 14, 23], 40: [12, 24, 36], 50: [15, 38, 53], 60: [18, 55, 73], 70: [21, 75, 96] };
    for (const [mph, [t, b, total]] of Object.entries(table)) {
      expect(t + b).toBe(total);
      expect(ans(`GEN-STOP-total-${mph}-0`)).toBe(`${total} metres`);
      expect(ans(`GEN-STOP-think-${mph}-0`)).toBe(`${t} metres`);
      expect(ans(`GEN-STOP-brake-${mph}-0`)).toBe(`${b} metres`);
    }
  });
  it('speed limits match Highway Code rule 124', () => {
    const expected: Record<string, number> = {
      'car-built-up': 30, 'car-single': 60, 'car-dual': 70, 'car-motorway': 70,
      'towing-built-up': 30, 'towing-single': 50, 'towing-dual': 60, 'towing-motorway': 60,
    };
    for (const [k, v] of Object.entries(expected)) for (const w of [0, 1]) expect(ans(`GEN-SPEED-${k}-${w}`)).toBe(`${v} mph`);
  });
  it('does not call the 30 mph built-up limit a "national speed limit"', () => {
    for (const q of ALL_QUESTIONS.filter((x) => x.id.startsWith('GEN-SPEED-car-built-up') || x.id.startsWith('GEN-SPEED-towing-built-up'))) {
      expect(q.text).not.toMatch(/national speed limit for/i);
    }
  });
  it('every question has a source, explanation, rule and a note for every option', () => {
    for (const q of ALL_QUESTIONS) {
      expect(q.source.ref.length, q.id).toBeGreaterThan(5);
      expect(q.explanation.length, q.id).toBeGreaterThan(15);
      for (const n of q.optionNotes) expect(n.trim().length, q.id).toBeGreaterThan(2);
    }
  });
  it('only verify-flagged questions mention a rule under review, and none appear in mocks', () => {
    const flagged = ALL_QUESTIONS.filter((q) => q.verify);
    expect(flagged.map((q) => q.id)).toEqual(['DC-14']);
    for (let i = 0; i < 5; i++) expect(buildMock(emptyData()).includes('DC-14')).toBe(false);
  });
  it('removed the unverified two-way traffic sign', () => {
    expect(ALL_QUESTIONS.some((q) => q.sign === 'two-way' || q.optionSigns?.includes('two-way'))).toBe(false);
  });
});

// ---------------------------------------------------------------- hazard video engine (Phase 4)
import { validateManifest } from '../data/hazardVideos';
import shippedManifest from '../../public/hazard-videos/manifest.json';

describe('hazard video manifest', () => {
  const good = {
    version: 1,
    clips: [{
      id: 'urban-01', title: 'Parked cars', category: 'urban', src: 'hazard-videos/urban-01.mp4', durationSec: 60,
      hazards: [{ start: 30, end: 35, description: 'Child steps out' }],
      licence: { holder: 'Footage Ltd', licence: 'Ref 1' },
    }],
  };
  it('ships an empty, valid manifest (no unlicensed footage)', () => {
    expect(validateManifest(shippedManifest)).toEqual([]);
    expect((shippedManifest as { clips: unknown[] }).clips.length).toBe(0);
  });
  it('accepts a correct clip', () => {
    expect(validateManifest(good)).toEqual([]);
  });
  it('rejects clips without licence details, bad timings or unknown categories', () => {
    const bad = JSON.parse(JSON.stringify(good));
    bad.clips[0].licence = { holder: '', licence: '' };
    bad.clips[0].hazards = [{ start: 50, end: 70, description: 'x' }];
    bad.clips[0].category = 'space';
    const errs = validateManifest(bad);
    expect(errs.some((e) => e.includes('licence'))).toBe(true);
    expect(errs.some((e) => e.includes('timing'))).toBe(true);
    expect(errs.some((e) => e.includes('category'))).toBe(true);
  });
  it('scores clicks against defined hazard timings', () => {
    const hz = [{ start: 30, end: 35, what: '' }];
    expect(scoreClip(hz, [30.4]).score).toBe(5);   // first fifth
    expect(scoreClip(hz, [31.5]).score).toBe(4);
    expect(scoreClip(hz, [34.9]).score).toBe(1);   // last fifth
    expect(scoreClip(hz, [29, 36]).score).toBe(0); // early and late
    expect(scoreClip(hz, [29, 32.1]).score).toBe(3); // best click counts
    const two = [{ start: 10, end: 15, what: '' }, { start: 40, end: 45, what: '' }];
    expect(scoreClip(two, [10.2, 44]).perHazard).toEqual([5, 1]);
  });
});
