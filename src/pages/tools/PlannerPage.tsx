import { Link, useNavigate } from 'react-router-dom';
import PageHead from '../../components/PageHead';
import { setState, useAppData } from '../../store/store';
import { buildPractice, dueMistakes, topicStats, weakTopics } from '../../engine/bank';
import { startMock, startSession } from '../../store/actions';
import { TOPIC_MAP } from '../../data/topics';
import { REVISION_CARDS } from '../../data/revision';
import { CLIPS } from '../../data/hazardClips';
import { dayKey, learningStreak } from '../../engine/progress';
import { DAY } from '../../store/store';

interface Task { id: string; title: string; why: string; action: () => void; actionLabel: string }

export default function PlannerPage() {
  const data = useAppData();
  const nav = useNavigate();
  const today = dayKey(Date.now());
  const ticked = data.plannerDone[today] ?? [];
  const st = topicStats(data);
  const weak = weakTopics(data);
  const due = dueMistakes(data);
  const lastMock = data.mocks[data.mocks.length - 1];
  const mockToday = data.mocks.some((m) => dayKey(m.finishedAt) === today);

  const tasks: Task[] = [];
  if (due.length) {
    tasks.push({ id: 'due', title: `Revise ${due.length} mistake${due.length === 1 ? '' : 's'} due for spaced revision`, why: 'Revising just before you forget makes rules stick.', actionLabel: 'Start revision',
      action: () => { startSession({ title: 'Spaced revision – due today', mode: 'revision', qids: due.map((m) => m.qid), returnTo: '/tools/planner' }); nav('/session'); } });
  }
  for (const t of weak.slice(0, 2)) {
    const acc = st[t].accuracy;
    tasks.push({ id: `weak-${t}`, title: `Practise 15 questions: ${TOPIC_MAP[t].title}`, why: acc === null ? 'You have not practised this topic much yet.' : `Your accuracy here is ${Math.round(acc * 100)}%.`, actionLabel: 'Start practice',
      action: () => { startSession({ title: `${TOPIC_MAP[t].title} – planner`, mode: 'learn', qids: buildPractice(data, { topics: [t], count: 15, difficulty: 'any', prefer: 'smart' }), returnTo: '/tools/planner' }); nav('/session'); } });
  }
  const card = REVISION_CARDS.find((c) => !data.revisionCardsDone[c.id]);
  if (card) tasks.push({ id: `card-${card.id}`, title: `Read the revision card: ${card.title}`, why: 'Short cards cover the most-tested rules.', actionLabel: 'Open revision centre', action: () => nav('/revision') });
  if (!['fa-response', 'fa-drabc', 'fa-cpr', 'fa-aed', 'fa-injuries'].every((id) => data.revisionCardsDone[id])) {
    tasks.push({ id: 'first-aid', title: 'Revise the first aid, CPR and AED module', why: 'DVSA has added CPR and defibrillator questions.', actionLabel: 'Open module', action: () => nav('/first-aid') });
  }
  const tried = new Set(data.hazard.flatMap((h) => h.clips.map((c) => c.clipId)));
  const clip = CLIPS.find((c) => !tried.has(c.id));
  tasks.push(clip
    ? { id: `hp-${clip.id}`, title: `Hazard perception: try clip "${clip.title}"`, why: 'Practise click timing regularly.', actionLabel: 'Open clip', action: () => nav(`/hazard/clip/${clip.id}`) }
    : { id: 'hp-full', title: 'Hazard perception: full 14-clip simulation', why: 'Aim to score well above 44 consistently.', actionLabel: 'Start simulation', action: () => nav('/hazard/test') });
  if (!mockToday && (!lastMock || lastMock.revisionCompleted || Date.now() - lastMock.finishedAt > DAY)) {
    tasks.push({ id: 'mock', title: 'Take a full 50-question mock test', why: lastMock ? `Last score: ${lastMock.score}/50. Aim for 48 or more, repeatedly.` : 'See where you are.', actionLabel: 'Start mock test',
      action: () => { if (!data.activeMock) startMock(); nav('/mock/exam'); } });
  } else if (lastMock && !lastMock.revisionCompleted) {
    tasks.push({ id: 'mock-revise', title: 'Revise the questions you got wrong in your last mock test', why: 'Learn from every mistake before the next mock.', actionLabel: 'View results', action: () => nav(`/mock/results/${lastMock.id}`) });
  }

  const toggle = (id: string) => setState((s) => {
    const list = s.plannerDone[today] ?? [];
    return { ...s, plannerDone: { ...s.plannerDone, [today]: list.includes(id) ? list.filter((x) => x !== id) : [...list, id] } };
  });
  const doneCount = tasks.filter((t) => ticked.includes(t.id)).length;

  return (
    <>
      <Link to="/tools" className="govuk-back-link">Study tools</Link>
      <PageHead eyebrow={new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })} title="Today's plan" lead={`Learning streak: ${learningStreak(data)} day${learningStreak(data) === 1 ? '' : 's'}`} />
      <p className="govuk-body">{doneCount} of {tasks.length} tasks done. The plan updates as you study.</p>
      <ul className="govuk-task-list">
        {tasks.map((t) => {
          const isDone = ticked.includes(t.id);
          return (
            <li className="govuk-task-list__item govuk-task-list__item--with-link" key={t.id}>
              <div className="govuk-task-list__name-and-hint">
                <span className="govuk-body govuk-!-font-weight-bold">{t.title}</span>
                <div className="govuk-task-list__hint">{t.why}</div>
                <div className="app-actions govuk-!-margin-top-2 govuk-!-margin-bottom-0">
                  <button type="button" className="govuk-button govuk-button--secondary govuk-!-margin-bottom-0" onClick={t.action}>{t.actionLabel}</button>
                  <button type="button" className="govuk-button govuk-button--secondary govuk-!-margin-bottom-0" aria-pressed={isDone} onClick={() => toggle(t.id)}>{isDone ? 'Mark as not done' : 'Mark as done'}</button>
                </div>
              </div>
              <div className="govuk-task-list__status">
                {isDone ? <strong className="govuk-tag govuk-tag--green">Done</strong> : <strong className="govuk-tag govuk-tag--blue">To do</strong>}
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
