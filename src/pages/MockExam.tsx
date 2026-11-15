import { useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { setState, useAppData } from '../store/store';
import { QMAP } from '../engine/bank';
import { submitMock } from '../store/actions';
import Options from '../components/Options';
import SignImage from '../components/SignImage';
import { fmtClock } from '../util';
import { DISCLAIMER } from '../components/Layout';

type View = 'question' | 'review' | 'confirm';

export default function MockExam() {
  const data = useAppData();
  const nav = useNavigate();
  const mock = data.activeMock;
  const [now, setNow] = useState(Date.now());
  const [view, setView] = useState<View>('question');
  const [filter, setFilter] = useState<'all' | 'flagged' | 'unanswered'>('all');
  const submitted = useRef(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(t);
  }, []);

  const remaining = mock ? mock.deadline - now : 0;

  useEffect(() => {
    if (mock && remaining <= 0 && !submitted.current) {
      submitted.current = true;
      const id = submitMock(true);
      if (id) nav(`/mock/results/${id}`, { replace: true });
    }
  }, [remaining, mock, nav]);

  useEffect(() => {
    headingRef.current?.focus();
  }, [mock?.current, view]);

  if (!mock) {
    return (
      <div className="govuk-width-container"><main className="govuk-main-wrapper">
        <h1 className="govuk-heading-xl">No mock test in progress</h1>
        <p className="govuk-body"><Link className="govuk-link" to="/mock">Start a mock test</Link> or <Link className="govuk-link" to="/history">view your test history</Link>.</p>
      </main></div>
    );
  }

  const total = mock.answers.length;
  const cur = mock.answers[mock.current];
  const q = QMAP[cur.qid];
  const answeredCount = mock.answers.filter((a) => a.selected.length > 0).length;
  const flaggedCount = mock.answers.filter((a) => a.flagged).length;
  const unanswered = total - answeredCount;

  const update = (fn: (m: NonNullable<typeof mock>) => NonNullable<typeof mock>) =>
    setState((s) => (s.activeMock ? { ...s, activeMock: fn(s.activeMock) } : s));
  const goTo = (i: number) => { update((m) => ({ ...m, current: i })); setView('question'); };
  const toggle = (i: number) => {
    const multi = q.correct.length > 1;
    update((m) => ({
      ...m,
      answers: m.answers.map((a, idx) => {
        if (idx !== m.current) return a;
        if (!multi) return { ...a, selected: a.selected[0] === i ? [] : [i] };
        const has = a.selected.includes(i);
        if (has) return { ...a, selected: a.selected.filter((x) => x !== i) };
        return a.selected.length < q.correct.length ? { ...a, selected: [...a.selected, i] } : a;
      }),
    }));
  };
  const flag = () => update((m) => ({ ...m, answers: m.answers.map((a, idx) => (idx === m.current ? { ...a, flagged: !a.flagged } : a)) }));
  const submit = () => {
    submitted.current = true;
    const id = submitMock(false);
    if (id) nav(`/mock/results/${id}`, { replace: true });
  };

  const low = remaining < 5 * 60 * 1000;

  const grid = (
    <div className="app-qgrid" role="list" aria-label="Question numbers">
      {mock.answers.map((a, i) => {
        if (view === 'review' && filter === 'flagged' && !a.flagged) return null;
        if (view === 'review' && filter === 'unanswered' && a.selected.length) return null;
        return (
          <div role="listitem" key={a.qid} style={{ display: 'contents' }}>
            <button
              type="button"
              className={`${a.selected.length ? 'is-answered' : ''} ${a.flagged ? 'is-flagged' : ''} ${i === mock.current && view === 'question' ? 'is-current' : ''}`}
              onClick={() => goTo(i)}
              aria-label={`Question ${i + 1}${a.selected.length ? ', answered' : ', not answered'}${a.flagged ? ', flagged' : ''}`}
            >
              {i + 1}
            </button>
          </div>
        );
      })}
    </div>
  );

  return (
    <div className="app-exam">
      <div className="app-exam__bar">
        <div className="govuk-width-container">
          <span className="app-exam__title">Mock theory test – practice only</span>
          <span>{answeredCount} of {total} answered</span>
          {data.settings.showTimer ? (
            <span className={`app-timer${low ? ' app-timer--low' : ''}`} role="timer" aria-label={`Time remaining ${fmtClock(remaining)}`}>
              {fmtClock(remaining)}
            </span>
          ) : (
            <span>Timer hidden</span>
          )}
        </div>
      </div>

      <main className="app-exam__body" id="main-content">
        <div className="govuk-width-container">
          {view === 'question' && (
            <div className="app-question">
              <h1 className="govuk-heading-m" tabIndex={-1} ref={headingRef}>
                Question {mock.current + 1} of {total}
                {cur.flagged && <strong className="govuk-tag govuk-tag--orange govuk-!-margin-left-2">Flagged</strong>}
              </h1>
              <p className="app-question__text">{q.text}</p>
              {q.sign && <SignImage id={q.sign} />}
              <Options q={q} selected={cur.selected} onToggle={toggle} />
              <h2 className="govuk-heading-s govuk-!-margin-top-6">Go to a question</h2>
              <div className="app-legend"><span className="l-answered">Answered</span><span className="l-flagged">Flagged</span><span>Not answered</span></div>
              {grid}
            </div>
          )}

          {view === 'review' && (
            <>
              <h1 className="govuk-heading-l" tabIndex={-1} ref={headingRef}>Review your answers</h1>
              <p className="govuk-body">{answeredCount} answered · {unanswered} not answered · {flaggedCount} flagged</p>
              <div className="app-actions">
                <button type="button" className={`govuk-button ${filter === 'all' ? '' : 'govuk-button--secondary'}`} onClick={() => setFilter('all')}>Review all</button>
                <button type="button" className={`govuk-button ${filter === 'unanswered' ? '' : 'govuk-button--secondary'}`} onClick={() => setFilter('unanswered')} disabled={!unanswered}>Review unanswered ({unanswered})</button>
                <button type="button" className={`govuk-button ${filter === 'flagged' ? '' : 'govuk-button--secondary'}`} onClick={() => setFilter('flagged')} disabled={!flaggedCount}>Review flagged ({flaggedCount})</button>
              </div>
              <div className="app-legend"><span className="l-answered">Answered</span><span className="l-flagged">Flagged</span><span>Not answered</span></div>
              {grid}
              <button type="button" className="govuk-button govuk-button--warning" onClick={() => setView('confirm')}>End test and submit</button>
            </>
          )}

          {view === 'confirm' && (
            <>
              <h1 className="govuk-heading-l" tabIndex={-1} ref={headingRef}>Are you sure you want to end the test?</h1>
              {unanswered > 0 && (
                <div className="govuk-warning-text">
                  <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
                  <strong className="govuk-warning-text__text"><span className="govuk-visually-hidden">Warning</span>You have {unanswered} unanswered question{unanswered === 1 ? '' : 's'}. Unanswered questions are marked as wrong.</strong>
                </div>
              )}
              {flaggedCount > 0 && <p className="govuk-body">You have {flaggedCount} flagged question{flaggedCount === 1 ? '' : 's'}.</p>}
              <p className="govuk-body">You cannot change your answers after you submit.</p>
              <div className="app-actions">
                <button type="button" className="govuk-button govuk-button--warning" onClick={submit}>Yes, submit my answers</button>
                <button type="button" className="govuk-button govuk-button--secondary" onClick={() => setView('review')}>No, go back</button>
              </div>
            </>
          )}
        </div>
      </main>

      {view === 'question' && (
        <div className="app-exam__controls">
          <div className="govuk-width-container">
            <button type="button" className="govuk-button govuk-button--secondary" disabled={mock.current === 0} onClick={() => goTo(mock.current - 1)}>Previous</button>
            <button type="button" className="govuk-button govuk-button--secondary" onClick={flag} aria-pressed={cur.flagged}>{cur.flagged ? 'Remove flag' : 'Flag for review'}</button>
            <button type="button" className="govuk-button govuk-button--secondary" onClick={() => { setFilter('all'); setView('review'); }}>Review</button>
            {mock.current < total - 1 ? (
              <button type="button" className="govuk-button" onClick={() => goTo(mock.current + 1)}>Next</button>
            ) : (
              <button type="button" className="govuk-button" onClick={() => { setFilter(unanswered ? 'unanswered' : 'all'); setView('review'); }}>Finish</button>
            )}
          </div>
        </div>
      )}
      <div className="govuk-width-container"><p className="govuk-body-s app-muted govuk-!-margin-top-2">{DISCLAIMER}</p></div>
    </div>
  );
}
