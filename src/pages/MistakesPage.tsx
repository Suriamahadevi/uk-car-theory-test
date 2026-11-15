import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../store/store';
import { QMAP, questionStats } from '../engine/bank';
import { startSession } from '../store/actions';
import { TOPICS, TOPIC_MAP } from '../data/topics';
import Feedback from '../components/Feedback';
import SignImage from '../components/SignImage';
import { fmtDate } from '../util';
import type { MistakeEntry, TopicId } from '../types';

const KEYS = 'ABCDEF';

function status(m: MistakeEntry, target: number) {
  if (m.mastered) return <strong className="govuk-tag govuk-tag--green">Mastered</strong>;
  if (m.correctSessions.length > 0) return <strong className="govuk-tag govuk-tag--yellow">Correct {m.correctSessions.length} of {target}</strong>;
  return <strong className="govuk-tag govuk-tag--red">Needs revision</strong>;
}

export default function MistakesPage() {
  const data = useAppData();
  const nav = useNavigate();
  const [topic, setTopic] = useState<TopicId | ''>('');
  const [filter, setFilter] = useState<'open' | 'all' | 'mastered'>('open');
  const target = data.settings.masteryTarget;

  const all = Object.values(data.mistakes).filter((m) => QMAP[m.qid]).sort((a, b) => b.lastAttemptAt - a.lastAttemptAt);
  const open = all.filter((m) => !m.mastered);
  const mastered = all.filter((m) => m.mastered);
  const repeat = open.filter((m) => m.timesWrong >= 2);
  const hard = open.filter((m) => QMAP[m.qid].difficulty === 'hard');

  // Questions left unanswered in a mock test and not attempted since.
  const qs = questionStats(data.attempts);
  const unansweredSet = new Map<string, number>();
  for (const mk of data.mocks) for (const a of mk.answers) if (a.selected.length === 0) unansweredSet.set(a.qid, mk.finishedAt);
  const unanswered = [...unansweredSet.entries()].filter(([qid, at]) => QMAP[qid] && !(qs[qid] && qs[qid].lastAt > at)).map(([qid]) => qid);

  const go = (title: string, ids: string[]) => {
    if (!ids.length) return;
    startSession({ title, mode: 'revision', qids: ids, returnTo: '/mistakes' });
    nav('/session');
  };
  const byTopicOpen = topic ? open.filter((m) => QMAP[m.qid].topic === topic) : [];
  const shown = filter === 'open' ? open : filter === 'mastered' ? mastered : all;

  return (
    <>
      <h1 className="govuk-heading-xl">Mistake Book</h1>
      <p className="govuk-body-l">Every question you get wrong is saved here automatically. A question is marked as mastered after you answer it correctly in {target} separate sessions.</p>

      <div className="app-stats">
        <div className="app-stat app-stat--red"><span className="app-stat__value">{open.length}</span><span className="app-stat__label">Need revision</span></div>
        <div className="app-stat app-stat--yellow"><span className="app-stat__value">{repeat.length}</span><span className="app-stat__label">Wrong 2 or more times</span></div>
        <div className="app-stat app-stat--green"><span className="app-stat__value">{mastered.length}</span><span className="app-stat__label">Mastered</span></div>
        <div className="app-stat"><span className="app-stat__value">{unanswered.length}</span><span className="app-stat__label">Left unanswered in mock tests</span></div>
      </div>

      <h2 className="govuk-heading-m">Revision sessions</h2>
      <div className="app-actions">
        <button type="button" className="govuk-button" disabled={!open.length} onClick={() => go('Revise all wrong questions', open.map((m) => m.qid))}>Revise all wrong questions ({open.length})</button>
        <button type="button" className="govuk-button govuk-button--secondary" disabled={!unanswered.length} onClick={() => go('Unanswered mock questions', unanswered)}>Retry unanswered questions ({unanswered.length})</button>
        <button type="button" className="govuk-button govuk-button--secondary" disabled={!repeat.length} onClick={() => go('Repeated mistakes', repeat.map((m) => m.qid))}>Wrong more than once ({repeat.length})</button>
        <button type="button" className="govuk-button govuk-button--secondary" disabled={!hard.length} onClick={() => go('Difficult mistakes', hard.map((m) => m.qid))}>Difficult questions only ({hard.length})</button>
      </div>
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="topic-select">Revise mistakes from one topic</label>
        <select className="govuk-select govuk-!-margin-right-2" id="topic-select" value={topic} onChange={(e) => setTopic(e.target.value as TopicId)}>
          <option value="">Choose a topic</option>
          {TOPICS.map((t) => {
            const n = open.filter((m) => QMAP[m.qid].topic === t.id).length;
            return <option key={t.id} value={t.id}>{t.title} ({n})</option>;
          })}
        </select>
        <button type="button" className="govuk-button govuk-button--secondary govuk-!-margin-bottom-0" disabled={!byTopicOpen.length} onClick={() => go(`Mistakes: ${TOPIC_MAP[topic as TopicId].title}`, byTopicOpen.map((m) => m.qid))}>
          Revise this topic
        </button>
      </div>

      <h2 className="govuk-heading-m">Saved questions</h2>
      <div className="govuk-radios govuk-radios--small govuk-radios--inline govuk-!-margin-bottom-4">
        {([['open', `Need revision (${open.length})`], ['mastered', `Mastered (${mastered.length})`], ['all', `All (${all.length})`]] as const).map(([v, l]) => (
          <div className="govuk-radios__item" key={v}>
            <input className="govuk-radios__input" type="radio" id={`mf-${v}`} name="mf" checked={filter === v} onChange={() => setFilter(v)} />
            <label className="govuk-label govuk-radios__label" htmlFor={`mf-${v}`}>{l}</label>
          </div>
        ))}
      </div>
      {all.length === 0 && <p className="govuk-body">No mistakes yet. Questions you answer wrongly will appear here.</p>}
      {shown.map((m) => {
        const q = QMAP[m.qid];
        const sel = m.lastSelected.map((i) => (q.optionSigns ? `Sign ${KEYS[i]}` : q.options[i])).join(', ');
        return (
          <details className="govuk-details" key={m.qid}>
            <summary className="govuk-details__summary">
              <span className="govuk-details__summary-text">{q.text}</span>
            </summary>
            <div className="govuk-details__text">
              <dl className="govuk-summary-list govuk-summary-list--no-border">
                <div className="govuk-summary-list__row"><dt className="govuk-summary-list__key">Topic</dt><dd className="govuk-summary-list__value">{TOPIC_MAP[q.topic].title}</dd></div>
                <div className="govuk-summary-list__row"><dt className="govuk-summary-list__key">Your wrong answer</dt><dd className="govuk-summary-list__value">{sel}</dd></div>
                <div className="govuk-summary-list__row"><dt className="govuk-summary-list__key">Correct answer</dt><dd className="govuk-summary-list__value">{q.correct.map((i) => (q.optionSigns ? `Sign ${KEYS[i]}` : q.options[i])).join(', ')}</dd></div>
                <div className="govuk-summary-list__row"><dt className="govuk-summary-list__key">Times wrong</dt><dd className="govuk-summary-list__value">{m.timesWrong}</dd></div>
                <div className="govuk-summary-list__row"><dt className="govuk-summary-list__key">Last attempted</dt><dd className="govuk-summary-list__value">{fmtDate(m.lastAttemptAt)}</dd></div>
                <div className="govuk-summary-list__row"><dt className="govuk-summary-list__key">Status</dt><dd className="govuk-summary-list__value">{status(m, target)}</dd></div>
              </dl>
              {q.sign && <SignImage id={q.sign} small />}
              <Feedback q={q} selected={m.lastSelected} />
              <button type="button" className="govuk-button govuk-button--secondary" onClick={() => go('Single question retry', [q.id])}>Try this question again</button>
            </div>
          </details>
        );
      })}
    </>
  );
}
