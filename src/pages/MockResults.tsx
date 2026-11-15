import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAppData } from '../store/store';
import { QMAP } from '../engine/bank';
import { PASS_MARK, startMock, startSession } from '../store/actions';
import { TOPICS, TOPIC_MAP } from '../data/topics';
import { BarList } from '../components/Charts';
import Options, { type OptionState } from '../components/Options';
import Feedback from '../components/Feedback';
import QuestionMedia from '../components/QuestionMedia';
import { fmtDate, fmtDuration } from '../util';
import type { TopicId } from '../types';
import NotFound from './NotFound';

export default function MockResults() {
  const { id } = useParams();
  const data = useAppData();
  const nav = useNavigate();
  const [show, setShow] = useState<'wrong' | 'all' | 'unanswered'>('wrong');
  const m = data.mocks.find((x) => x.id === id);
  if (!m) return <NotFound />;

  const rows = m.answers.map((a, i) => {
    const q = QMAP[a.qid];
    const ok = !!q && a.selected.length > 0 && a.selected.length === q.correct.length && a.selected.every((s) => q.correct.includes(s));
    return { a, q, i, ok, unanswered: a.selected.length === 0 };
  }).filter((r) => r.q);
  const wrong = rows.filter((r) => !r.ok && !r.unanswered);
  const unanswered = rows.filter((r) => r.unanswered);
  const byTopic: Partial<Record<TopicId, { n: number; ok: number }>> = {};
  for (const r of rows) {
    const t = (byTopic[r.q.topic] ??= { n: 0, ok: 0 });
    t.n++;
    if (r.ok) t.ok++;
  }
  const list = show === 'all' ? rows : show === 'wrong' ? wrong : unanswered;
  const revisionIds = [...wrong, ...unanswered].map((r) => r.q.id);
  const isLatest = data.mocks[data.mocks.length - 1]?.id === m.id;

  return (
    <>
      <Link to="/history" className="govuk-back-link">Test history</Link>
      <div className="govuk-panel" style={{ background: m.passed ? 'var(--success)' : 'var(--error)', color: 'var(--on-status)' }}>
        <h1 className="govuk-panel__title">{m.passed ? 'Pass' : 'Not passed'}</h1>
        <div className="govuk-panel__body">You scored <strong>{m.score} out of {m.total}</strong> ({Math.round((m.score / m.total) * 100)}%)<br />Pass mark: {PASS_MARK}</div>
      </div>

      <dl className="govuk-summary-list">
        {[
          ['Correct answers', m.score],
          ['Wrong answers', wrong.length],
          ['Unanswered', unanswered.length],
          ['Percentage', `${Math.round((m.score / m.total) * 100)}%`],
          ['Time taken', `${fmtDuration(m.durationMs)}${m.timedOut ? ' (time ran out)' : ''}`],
          ['Date', fmtDate(m.finishedAt)],
        ].map(([k, v]) => (
          <div className="govuk-summary-list__row" key={k as string}>
            <dt className="govuk-summary-list__key">{k}</dt><dd className="govuk-summary-list__value">{v}</dd>
          </div>
        ))}
      </dl>

      <h2 className="govuk-heading-m">What to do next</h2>
      {revisionIds.length > 0 ? (
        <>
          <p className="govuk-body">
            {m.revisionCompleted ? 'You have already revised this test. You can revise it again, or start a fresh mock test.' : `Step 1: revise the ${revisionIds.length} questions you got wrong or left unanswered. Step 2: take a fresh mock test with new questions.`}
          </p>
          <div className="app-actions">
            <button type="button" className="govuk-button" onClick={() => { startSession({ title: 'Mock test revision', mode: 'revision', qids: revisionIds, fromMockId: m.id, returnTo: `/mock/results/${m.id}` }); nav('/session'); }}>
              Revise my {revisionIds.length} incorrect questions
            </button>
            <button type="button" className={`govuk-button ${m.revisionCompleted ? '' : 'govuk-button--secondary'}`} onClick={() => { if (!data.activeMock) startMock(); nav('/mock/exam'); }}>
              {data.activeMock ? 'Return to mock test in progress' : 'Start a fresh mock test'}
            </button>
          </div>
        </>
      ) : (
        <div className="app-actions">
          <button type="button" className="govuk-button" onClick={() => { if (!data.activeMock) startMock(); nav('/mock/exam'); }}>Start a fresh mock test</button>
        </div>
      )}
      {!isLatest && <p className="govuk-body-s app-muted">This is an older test. All your results are kept in Test history.</p>}

      <h2 className="govuk-heading-m">Performance by topic</h2>
      <BarList rows={TOPICS.filter((t) => byTopic[t.id]).map((t) => ({ label: `${t.title} (${byTopic[t.id]!.ok}/${byTopic[t.id]!.n})`, value: byTopic[t.id]!.ok / byTopic[t.id]!.n }))} />

      <h2 className="govuk-heading-m">Question review</h2>
      <div className="govuk-radios govuk-radios--small govuk-radios--inline govuk-!-margin-bottom-4">
        {([['wrong', `Wrong (${wrong.length})`], ['unanswered', `Unanswered (${unanswered.length})`], ['all', `All (${rows.length})`]] as const).map(([v, l]) => (
          <div className="govuk-radios__item" key={v}>
            <input className="govuk-radios__input" type="radio" id={`f-${v}`} name="show" checked={show === v} onChange={() => setShow(v)} />
            <label className="govuk-label govuk-radios__label" htmlFor={`f-${v}`}>{l}</label>
          </div>
        ))}
      </div>
      {list.length === 0 && <p className="govuk-body">Nothing to show here.</p>}
      {list.map(({ a, q, i, ok }) => {
        const states: OptionState[] = q.options.map((_, k) => (q.correct.includes(k) ? 'correct' : a.selected.includes(k) ? 'wrong' : 'none'));
        const marks = q.options.map((_, k) => (q.correct.includes(k) ? (a.selected.includes(k) ? 'Your answer – correct' : 'Correct answer') : a.selected.includes(k) ? 'Your answer – wrong' : null));
        return (
          <details className="govuk-details" key={q.id} open={list.length <= 10}>
            <summary className="govuk-details__summary">
              <span className="govuk-details__summary-text">
                Question {i + 1}: {ok ? '✓ correct' : a.selected.length ? '✗ wrong' : '– not answered'} · {TOPIC_MAP[q.topic].title}
              </span>
            </summary>
            <div className="govuk-details__text app-question">
              <p className="app-question__text">{q.text}</p>
              <QuestionMedia q={q} compact />
              <Options q={q} selected={a.selected} onToggle={() => {}} states={states} marks={marks} disabled />
              <Feedback q={q} selected={a.selected} />
            </div>
          </details>
        );
      })}
    </>
  );
}
