import type { AppData } from '../types';
import { TOPICS } from '../data/topics';
import { SIGNS } from '../data/signs';
import { topicProgress } from './bank';
import { learningStreak } from './progress';

export interface Milestone { id: string; title: string; detail: string; done: boolean; progress: number }

/** Learning milestones, in the order a learner usually reaches them. */
export function milestones(data: AppData): Milestone[] {
  const answers = data.attempts.length;
  const complete = TOPICS.filter((t) => topicProgress(data, t.id).complete).length;
  const mastered = Object.values(data.mistakes).filter((m) => m.mastered).length;
  const signsKnown = SIGNS.filter((s) => data.revisionCardsDone[`flash-${s.id}`]).length;
  const passed = data.mocks.filter((m) => m.passed).length;
  const best = data.mocks.length ? Math.max(...data.mocks.map((m) => m.score)) : 0;
  const hpBest = Math.max(0, ...data.hazard.filter((h) => h.full).map((h) => h.score));
  const streak = learningStreak(data);
  const m = (id: string, title: string, detail: string, value: number, target: number): Milestone =>
    ({ id, title, detail, done: value >= target, progress: Math.min(1, value / target) });
  return [
    m('first-25', 'First steps', 'Answer 25 practice questions', answers, 25),
    m('first-mock', 'First mock test', 'Complete a 50-question mock test', data.mocks.length, 1),
    m('topic-3', 'Building foundations', 'Complete 3 topics', complete, 3),
    m('signs-20', 'Sign reader', 'Know 20 road signs in flashcards', signsKnown, 20),
    m('mastered-10', 'Learning from mistakes', 'Master 10 questions in your Mistake Book', mastered, 10),
    m('streak-5', 'Consistent learner', 'Study 5 days in a row', streak, 5),
    m('pass-1', 'Pass standard', 'Pass a mock test (43 or more)', passed, 1),
    m('answers-300', 'Well practised', 'Answer 300 questions', answers, 300),
    m('hp-50', 'Sharp eyes', 'Score 50 or more in the full hazard simulation', hpBest, 50),
    m('topics-all', 'Full syllabus', 'Complete all 14 topics', complete, 14),
    m('score-48', 'Test ready', 'Score 48 or more in a mock test', best, 48),
  ];
}

export function nextMilestone(data: AppData): Milestone | undefined {
  return milestones(data).find((x) => !x.done);
}
