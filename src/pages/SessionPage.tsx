import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAppData } from '../store/store';
import { QMAP } from '../engine/bank';
import { answerInSession, endSession, finishSession, setSessionIndex, startMock, startSession } from '../store/actions';
import Options, { type OptionState } from '../components/Options';
import Feedback, { SourceLine } from '../components/Feedback';
import QuestionMedia from '../components/QuestionMedia';
import BookmarkButton from '../components/BookmarkButton';
import { relatedQuestions } from '../engine/bank';
import { ProgressBar } from '../components/Charts';
import { TOPIC_MAP } from '../data/topics';

export default function SessionPage() {
  const data = useAppData();
  const nav = useNavigate();
  const sess = data.activeSession;
  const [pending, setPending] = useState<number[]>([]);

  const qid = sess && sess.index < sess.qids.length ? sess.qids[sess.index] : null;
  useEffect(() => setPending([]), [qid]);

  useEffect(() => {
    if (sess && sess.index >= sess.qids.length) finishSession();
  }, [sess?.index, sess?.qids.length]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!sess) {
    return (
      <>
        <h1 className="govuk-heading-xl">No practice session in progress</h1>
        <p className="govuk-body"><Link className="govuk-link" to="/practice">Start a practice session</Link> or <Link className="govuk-link" to="/mistakes">revise your mistakes</Link>.</p>
      </>
    );
  }

  const total = sess.qids.length;
  const answeredIds = Object.keys(sess.answered);
  const correctCount = answeredIds.filter((id) => {
    const q = QMAP[id];
    const sel = sess.answered[id];
    return q && sel.length === q.correct.length && sel.every((s) => q.correct.includes(s));
  }).length;

  // ---------------- Summary
  if (sess.index >= total) {
    const wrong = answeredIds.filter((id) => {
      const q = QMAP[id];
      const sel = sess.answered[id];
      return !(sel.length === q.correct.length && sel.every((s) => q.correct.includes(s)));
    });
    const skipped = sess.qids.filter((id) => !sess.answered[id]);
    const accuracy = answeredIds.length ? Math.round((correctCount / answeredIds.length) * 100) : 0;
    return (
      <>
        <div className={`govuk-panel ${accuracy >= 86 ? 'govuk-panel--confirmation' : ''}`} style={accuracy >= 86 ? undefined : { background: 'var(--strong-bg)', color: 'var(--on-strong)' }}>
          <h1 className="govuk-panel__title">Session complete</h1>
          <div className="govuk-panel__body">{correctCount} out of {answeredIds.length} correct ({accuracy}%)</div>
        </div>
        <h2 className="govuk-heading-m">{sess.title}</h2>
        <ul className="govuk-list govuk-list--bullet">
          <li>{wrong.length} wrong – saved in your Mistake Book</li>
          {skipped.length > 0 && <li>{skipped.length} skipped</li>}
        </ul>
        {sess.fromMockId && skipped.length === 0 && (
          <div className="govuk-inset-text">You have finished revising the questions you got wrong in that mock test. You are ready for a fresh mock test with new questions.</div>
        )}
        <div className="app-actions">
          {wrong.length > 0 && (
            <button type="button" className="govuk-button" onClick={() => startSession({ title: 'Retry wrong answers', mode: 'revision', qids: wrong, returnTo: sess.returnTo })}>
              Retry the {wrong.length} I got wrong
            </button>
          )}
          {skipped.length > 0 && (
            <button type="button" className="govuk-button govuk-button--secondary" onClick={() => startSession({ title: 'Skipped questions', mode: sess.mode, qids: skipped, returnTo: sess.returnTo })}>
              Answer the {skipped.length} skipped
            </button>
          )}
          {sess.fromMockId && (
            <button type="button" className="govuk-button" onClick={() => { endSession(); startMock(); nav('/mock/exam'); }}>
              Start a fresh mock test
            </button>
          )}
          <button type="button" className="govuk-button govuk-button--secondary" onClick={() => { const to = sess.returnTo ?? '/practice'; endSession(); nav(to); }}>
            Finish
          </button>
        </div>
      </>
    );
  }

  // ---------------- Question
  const q = QMAP[qid!];
  const answered = sess.answered[q.id];
  const multi = q.correct.length > 1;
  const selected = answered ?? pending;

  const onToggle = (i: number) => {
    if (answered) return;
    if (!multi) {
      answerInSession(q.id, [i]);
      return;
    }
    setPending((p) => (p.includes(i) ? p.filter((x) => x !== i) : p.length < q.correct.length ? [...p, i] : p));
  };

  const states: OptionState[] | undefined = answered
    ? q.options.map((_, i) => (q.correct.includes(i) ? 'correct' : answered.includes(i) ? 'wrong' : 'none'))
    : undefined;
  const marks = answered
    ? q.options.map((_, i) => (q.correct.includes(i) ? (answered.includes(i) ? 'Your answer – correct' : 'Correct answer') : answered.includes(i) ? 'Your answer – wrong' : null))
    : undefined;

  return (
    <div className="app-question">
      <span className="govuk-caption-m">{sess.title} · {TOPIC_MAP[q.topic].title}</span>
      <p className="govuk-body govuk-!-margin-bottom-1">Question {sess.index + 1} of {total} · {correctCount} correct so far</p>
      <ProgressBar percent={Math.round((answeredIds.length / total) * 100)} label="Session progress" />

      {q.verify && (
        <div className="app-verify"><strong>Check this rule:</strong> {q.verify}</div>
      )}
      <h1 className="app-question__text">{q.text}</h1>
      <QuestionMedia q={q} />

      <Options q={q} selected={selected} onToggle={onToggle} states={states} marks={marks} disabled={!!answered} />

      {multi && !answered && (
        <button type="button" className="govuk-button" disabled={pending.length !== q.correct.length} onClick={() => answerInSession(q.id, pending)}>
          Check answer
        </button>
      )}

      {answered ? <Feedback q={q} selected={answered} /> : <SourceLine q={q} />}

      {answered && (() => {
        const rel = relatedQuestions(q);
        if (!rel.length) return null;
        return (
          <details className="govuk-details">
            <summary className="govuk-details__summary"><span className="govuk-details__summary-text">Show related questions ({rel.length})</span></summary>
            <div className="govuk-details__text">
            <h2 className="govuk-heading-s govuk-!-margin-bottom-2">Related questions</h2>
            <ul className="govuk-list govuk-list--bullet">{rel.map((r) => <li key={r.id}>{r.text}</li>)}</ul>
            <button type="button" className="govuk-button govuk-button--secondary govuk-!-margin-bottom-0" onClick={() => startSession({ title: 'Related questions', mode: 'learn', qids: rel.map((r) => r.id), returnTo: sess.returnTo })}>
              Practise these related questions
            </button>
            </div>
          </details>
        );
      })()}

      <div className="app-actions">
        <button type="button" className="govuk-button govuk-button--secondary" disabled={sess.index === 0} onClick={() => setSessionIndex(sess.index - 1)}>Previous</button>
        <button type="button" className="govuk-button" onClick={() => setSessionIndex(sess.index + 1)}>
          {sess.index === total - 1 ? 'Finish session' : answered ? 'Next question' : 'Skip'}
        </button>
        <BookmarkButton qid={q.id} />
        <button type="button" className="govuk-button govuk-button--warning" onClick={() => setSessionIndex(total)}>End session now</button>
      </div>
    </div>
  );
}
