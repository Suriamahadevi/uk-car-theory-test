import { Link, useNavigate, useParams } from 'react-router-dom';
import { setState, useAppData } from '../store/store';
import { TOPIC_MAP } from '../data/topics';
import { buildPractice, byTopic, COMPLETION_SHARE, questionStats, topicProgress, topicStats } from '../engine/bank';
import { startSession } from '../store/actions';
import Tabs from '../components/Tabs';
import PageHead from '../components/PageHead';
import type { TopicId } from '../types';
import NotFound from './NotFound';

export default function TopicPage() {
  const { id } = useParams();
  const data = useAppData();
  const nav = useNavigate();
  const topic = id ? TOPIC_MAP[id as TopicId] : undefined;
  if (!topic) return <NotFound />;

  const st = topicStats(data);
  const p = topicProgress(data, topic.id, st);
  const s = st[topic.id];
  const qs = byTopic(topic.id);
  const qStats = questionStats(data.attempts);
  const unseen = qs.filter((q) => !qStats[q.id]);
  const scenarios = qs.filter((q) => q.kind === 'scenario');
  const needed = Math.ceil(p.totalRules * COMPLETION_SHARE);

  const go = (title: string, qids: string[]) => {
    if (!qids.length) return;
    startSession({ title, mode: 'learn', qids, returnTo: `/topics/${topic.id}` });
    nav('/session');
  };

  const notes = (
    <>
      {topic.id === 'incidents' && (
        <div className="govuk-inset-text">New for 2026: <Link className="govuk-link" to="/first-aid">First aid, CPR and defibrillator (AED) module</Link>.</div>
      )}
      <ul className="govuk-list govuk-list--bullet">{topic.notes.map((n) => <li key={n}>{n}</li>)}</ul>
      {!p.notesDone ? (
        <button type="button" className="govuk-button" onClick={() => setState((d) => ({ ...d, notesRead: { ...d.notesRead, [topic.id]: Date.now() } }))}>
          I have read these notes
        </button>
      ) : (
        <p className="govuk-body"><strong className="govuk-tag govuk-tag--green">Notes read</strong></p>
      )}
    </>
  );
  const rules = (
    <>
      <h2 className="govuk-heading-s">Important rules</h2>
      <ul className="govuk-list">{topic.keyRules.map((r) => <li key={r}><strong>{r}</strong></li>)}</ul>
      <h2 className="govuk-heading-s">Common exam traps</h2>
      <div className="govuk-warning-text">
        <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
        <div className="govuk-warning-text__text">
          <span className="govuk-visually-hidden">Warning</span>
          <ul className="govuk-list govuk-!-margin-bottom-0">{topic.traps.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </div>
    </>
  );
  const practise = (
    <>
      <p className="govuk-body">{qs.length} questions · {unseen.length} not tried yet</p>
      <div className="app-actions">
        <button type="button" className="govuk-button" onClick={() => go(`${topic.title}: 10 questions`, buildPractice(data, { topics: [topic.id], count: 10, difficulty: 'any', prefer: 'smart' }))}>
          Practise 10 questions
        </button>
        <button type="button" className="govuk-button govuk-button--secondary" disabled={!unseen.length} onClick={() => go(`${topic.title}: all unanswered`, unseen.map((q) => q.id))}>
          All unanswered ({unseen.length})
        </button>
        <button type="button" className="govuk-button govuk-button--secondary" disabled={!scenarios.length} onClick={() => go(`${topic.title}: scenarios`, scenarios.map((q) => q.id))}>
          Scenario questions ({scenarios.length})
        </button>
        <button type="button" className="govuk-button govuk-button--secondary" onClick={() => go(`${topic.title}: hard questions`, buildPractice(data, { topics: [topic.id], count: 10, difficulty: 'hard', prefer: 'unseen' }))} disabled={!qs.some((q) => q.difficulty === 'hard')}>
          Hard questions
        </button>
      </div>
    </>
  );

  return (
    <>
      <Link to="/topics" className="govuk-back-link">All topics</Link>
      <PageHead eyebrow={`Topic ${topic.number} of 14`} title={topic.title} lead={topic.summary} />
      <div className="app-metrics">
        <div className="app-metric"><span className="app-metric__value">{p.percent}%</span><span className="app-metric__label">{p.complete ? 'Complete' : 'Progress'}</span></div>
        <div className="app-metric"><span className="app-metric__value">{p.rulesSeen}/{needed}</span><span className="app-metric__label">Rules practised (target)</span></div>
        <div className="app-metric"><span className="app-metric__value">{s.accuracy === null ? '–' : `${Math.round(s.accuracy * 100)}%`}</span><span className="app-metric__label">Accuracy</span></div>
      </div>
      <Tabs label="Topic sections" initial={p.notesDone ? 2 : 0} tabs={[
        { label: 'Notes', content: notes },
        { label: 'Rules and traps', content: rules },
        { label: 'Practise', content: practise },
      ]} />
    </>
  );
}
