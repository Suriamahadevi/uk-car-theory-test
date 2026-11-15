import { Link, useNavigate, useParams } from 'react-router-dom';
import { setState, useAppData } from '../store/store';
import { TOPIC_MAP } from '../data/topics';
import { buildPractice, byTopic, COMPLETION_SHARE, questionStats, topicProgress, topicStats } from '../engine/bank';
import { startSession } from '../store/actions';
import { ProgressBar } from '../components/Charts';
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
  const needed = Math.ceil(qs.length * COMPLETION_SHARE);

  const go = (title: string, qids: string[]) => {
    if (!qids.length) return;
    startSession({ title, mode: 'learn', qids, returnTo: `/topics/${topic.id}` });
    nav('/session');
  };

  return (
    <>
      <Link to="/topics" className="govuk-back-link">All topics</Link>
      <span className="govuk-caption-l">Topic {topic.number} of 14</span>
      <h1 className="govuk-heading-xl">{topic.title}</h1>
      <p className="govuk-body-l">{topic.summary}</p>

      <ProgressBar percent={p.percent} green={p.complete} label="Topic progress" />
      <ul className="govuk-list">
        <li>{p.notesDone ? '✓' : '○'} Read the revision notes</li>
        <li>{p.practiceDone ? '✓' : '○'} Answer at least {needed} of {qs.length} practice questions ({s.uniqueAttempted} answered so far)</li>
        <li>Accuracy in this topic: <strong>{s.accuracy === null ? 'not attempted yet' : `${Math.round(s.accuracy * 100)}%`}</strong></li>
      </ul>
      {p.complete && (
        <div className="govuk-panel govuk-panel--confirmation govuk-!-margin-bottom-6"><h2 className="govuk-panel__title govuk-!-font-size-27">Topic complete</h2></div>
      )}

      <h2 className="govuk-heading-l">Revision notes</h2>
      <ul className="govuk-list govuk-list--bullet">{topic.notes.map((n) => <li key={n}>{n}</li>)}</ul>

      <h3 className="govuk-heading-m">Important rules</h3>
      <div className="govuk-inset-text">
        <ul className="govuk-list">{topic.keyRules.map((r) => <li key={r}><strong>{r}</strong></li>)}</ul>
      </div>

      <h3 className="govuk-heading-m">Common exam traps</h3>
      <div className="govuk-warning-text">
        <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
        <div className="govuk-warning-text__text">
          <span className="govuk-visually-hidden">Warning</span>
          <ul className="govuk-list govuk-!-margin-bottom-0">{topic.traps.map((t) => <li key={t}>{t}</li>)}</ul>
        </div>
      </div>

      {!p.notesDone ? (
        <button type="button" className="govuk-button" onClick={() => setState((d) => ({ ...d, notesRead: { ...d.notesRead, [topic.id]: Date.now() } }))}>
          I have read these notes
        </button>
      ) : (
        <p className="govuk-body"><strong className="govuk-tag govuk-tag--green">Notes read</strong></p>
      )}

      <h2 className="govuk-heading-l">Practise this topic</h2>
      <p className="govuk-body">
        {qs.length} questions: {qs.filter((q) => q.kind === 'standard').length} written, {scenarios.length} scenario-based, {qs.filter((q) => q.kind === 'generated').length} generated from rule data. {unseen.length} not attempted yet.
      </p>
      <div className="app-actions">
        <button type="button" className="govuk-button" onClick={() => go(`${topic.title}: new questions`, buildPractice(data, { topics: [topic.id], count: 10, difficulty: 'any', prefer: 'unseen' }))}>
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
}
