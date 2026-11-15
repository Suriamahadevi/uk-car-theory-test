import { useState } from 'react';
import PageHead from '../components/PageHead';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../store/store';
import { QMAP, dueMistakes, questionStats, weakTopics } from '../engine/bank';
import { startSession } from '../store/actions';
import { TOPICS, TOPIC_MAP } from '../data/topics';
import Feedback from '../components/Feedback';
import QuestionMedia from '../components/QuestionMedia';
import { fmtDate } from '../util';
import type { MistakeEntry, TopicId } from '../types';

const KEYS = 'ABCDEF';

function status(m: MistakeEntry, target: number) {
  if (m.mastered) return <strong className="govuk-tag govuk-tag--green">Mastered</strong>;
  if (m.correctSessions.length > 0) return <strong className="govuk-tag govuk-tag--yellow">Correct in {m.correctSessions.length} of {target} sessions</strong>;
  return <strong className="govuk-tag govuk-tag--red">Needs revision</strong>;
}

function dueText(m: MistakeEntry) {
  if (m.mastered) return 'Mastered – revise occasionally';
  const d = m.nextDue ?? 0;
  if (d <= Date.now()) return 'Due now';
  return `Next revision ${new Date(d).toLocaleDateString('en-GB', { weekday: 'short', day: 'numeric', month: 'short' })}`;
}

export default function MistakesPage() {
  const data = useAppData();
  const nav = useNavigate();
  const [topic, setTopic] = useState<TopicId | ''>('');
  const [filter, setFilter] = useState<'open' | 'due' | 'all' | 'mastered'>('open');
  const target = data.settings.masteryTarget;

  const all = Object.values(data.mistakes).filter((m) => QMAP[m.qid]).sort((a, b) => b.lastAttemptAt - a.lastAttemptAt);
  const open = all.filter((m) => !m.mastered);
  const mastered = all.filter((m) => m.mastered);
  const due = dueMistakes(data);
  const repeat = open.filter((m) => m.timesWrong >= 2);
  const hard = open.filter((m) => QMAP[m.qid].difficulty === 'hard');
  const reactivated = all.filter((m) => (m.reactivations ?? 0) > 0);
  const weak3 = weakTopics(data).slice(0, 3);
  const weakOpen = open.filter((m) => weak3.includes(QMAP[m.qid].topic));

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
  const shown = filter === 'open' ? open : filter === 'due' ? due : filter === 'mastered' ? mastered : all;

  return (
    <>
      <PageHead eyebrow="Progress" title="Mistake Book" lead={`Wrong answers are saved automatically. Mastered after ${target} correct sessions.`} />

      <div className="app-metrics">
        <div className="app-metric"><span className="app-metric__value">{open.length}</span><span className="app-metric__label">Need revision</span></div>
        <div className="app-metric"><span className="app-metric__value">{due.length}</span><span className="app-metric__label">Due today</span></div>
        <div className="app-metric"><span className="app-metric__value">{mastered.length}</span><span className="app-metric__label">Mastered</span></div>
      </div>

      <h2 className="govuk-heading-m">Spaced revision</h2>
      <p className="govuk-body app-muted">Questions return after 1, 3 and 7 days.</p>
      <button type="button" className="govuk-button" disabled={!due.length} onClick={() => go('Spaced revision – due today', due.map((m) => m.qid))}>Revise questions due now ({due.length})</button>

      <details className="govuk-details">
      <summary className="govuk-details__summary"><span className="govuk-details__summary-text">More revision options</span></summary>
      <div className="govuk-details__text">
      <div className="app-actions">
        <button type="button" className="govuk-button govuk-button--secondary" disabled={!open.length} onClick={() => go('Revise all wrong questions', open.map((m) => m.qid))}>Retry all mistakes ({open.length})</button>
        <button type="button" className="govuk-button govuk-button--secondary" disabled={!repeat.length} onClick={() => go('Frequently missed questions', repeat.map((m) => m.qid))}>Frequently missed ({repeat.length})</button>
        <button type="button" className="govuk-button govuk-button--secondary" disabled={!weakOpen.length} onClick={() => go('Mistakes in my weakest topics', weakOpen.map((m) => m.qid))}>Weak topics ({weakOpen.length})</button>
        <button type="button" className="govuk-button govuk-button--secondary" disabled={!hard.length} onClick={() => go('Difficult mistakes', hard.map((m) => m.qid))}>Difficult questions ({hard.length})</button>
        <button type="button" className="govuk-button govuk-button--secondary" disabled={!unanswered.length} onClick={() => go('Unanswered mock questions', unanswered)}>Retry unanswered questions ({unanswered.length})</button>
        <button type="button" className="govuk-button govuk-button--secondary" disabled={!mastered.length} onClick={() => go('Check mastered questions', mastered.map((m) => m.qid))}>Check mastered questions ({mastered.length})</button>
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
      <p className="govuk-body-s app-muted">Also: {reactivated.length} reactivated after mastery · {unanswered.length} left unanswered in mock tests.</p>
      </div>
      </details>

      <h2 className="govuk-heading-m">Saved questions</h2>
      <div className="govuk-radios govuk-radios--small govuk-radios--inline govuk-!-margin-bottom-4">
        {([['open', `Need revision (${open.length})`], ['due', `Due now (${due.length})`], ['mastered', `Mastered (${mastered.length})`], ['all', `All (${all.length})`]] as const).map(([v, l]) => (
          <div className="govuk-radios__item" key={v}>
            <input className="govuk-radios__input" type="radio" id={`mf-${v}`} name="mf" checked={filter === v} onChange={() => setFilter(v)} />
            <label className="govuk-label govuk-radios__label" htmlFor={`mf-${v}`}>{l}</label>
          </div>
        ))}
      </div>
      {all.length === 0 && <p className="govuk-body">No mistakes yet. Questions you answer wrongly will appear here.</p>}
      <p className="govuk-body-s app-muted">Your full answer history is never deleted – mastered questions stay in the book.</p>
      {shown.map((m) => {
        const q = QMAP[m.qid];
        const label = (i: number) => (q.optionSigns ? `Sign ${KEYS[i]}` : q.options[i]);
        return (
          <details className="govuk-details" key={m.qid}>
            <summary className="govuk-details__summary">
              <span className="govuk-details__summary-text">{q.text}</span>
            </summary>
            <div className="govuk-details__text">
              <dl className="govuk-summary-list govuk-summary-list--no-border">
                {([
                  ['Question ID', q.id],
                  ['Topic', TOPIC_MAP[q.topic].title],
                  ['Your wrong answer', m.lastSelected.map(label).join(', ')],
                  ['Correct answer', q.correct.map(label).join(', ')],
                  ['Times wrong', m.timesWrong],
                  ['Times correct since saved', m.correctCount ?? 0],
                  ['Last attempted', fmtDate(m.lastAttemptAt)],
                  ['Spaced revision', dueText(m)],
                  ['Reactivated', m.reactivations ? `${m.reactivations} time(s)` : 'No'],
                ] as [string, string | number][]).map(([k, v]) => (
                  <div className="govuk-summary-list__row" key={k}><dt className="govuk-summary-list__key">{k}</dt><dd className="govuk-summary-list__value">{v}</dd></div>
                ))}
                <div className="govuk-summary-list__row"><dt className="govuk-summary-list__key">Status</dt><dd className="govuk-summary-list__value">{status(m, target)}</dd></div>
              </dl>
              <QuestionMedia q={q} compact />
              <Feedback q={q} selected={m.lastSelected} />
              <button type="button" className="govuk-button govuk-button--secondary" onClick={() => go('Single question retry', [q.id])}>Try this question again</button>
            </div>
          </details>
        );
      })}
    </>
  );
}
