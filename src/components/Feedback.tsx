import type { Question } from '../types';
import { TOPIC_MAP } from '../data/topics';
import { sourceLabel } from '../engine/bank';
import Icon from './Icon';

const KEYS = 'ABCDEF';

export function SourceLine({ q }: { q: Question }) {
  return (
    <p className="govuk-body-s app-muted">
      {TOPIC_MAP[q.topic].title} · {q.difficulty} · {sourceLabel(q)}
    </p>
  );
}

/**
 * Feedback with progressive disclosure: the verdict, the correct answer, one short
 * "why" and the rule are always visible; everything else is one click away.
 */
export default function Feedback({ q, selected }: { q: Question; selected: number[] }) {
  const correct = selected.length === q.correct.length && selected.every((s) => q.correct.includes(s));
  const wrongPicked = selected.filter((s) => !q.correct.includes(s));
  const others = q.options.map((_, i) => i).filter((i) => !q.correct.includes(i) && !selected.includes(i));
  const label = (i: number) => (q.optionSigns ? `${KEYS[i]} (${q.options[i]})` : `${KEYS[i]}: ${q.options[i]}`);

  return (
    <div className={`app-feedback app-feedback--${correct ? 'correct' : 'wrong'}`} role="status" aria-live="polite">
      <h2 className="app-feedback__title">
        <Icon name={correct ? 'check' : 'cross'} size={22} />
        {correct ? 'Correct' : selected.length ? 'Incorrect' : 'Not answered'}
      </h2>
      {!correct && (
        <p className="app-feedback__answer"><strong>Correct answer:</strong> {q.correct.map(label).join(', ')}</p>
      )}
      <p className="app-feedback__why">
        <strong>Why {q.correct.length > 1 ? 'these answers are' : 'this answer is'} correct: </strong>
        {q.explanation}
      </p>
      <p className="app-feedback__rule"><strong>Rule to remember:</strong> {q.rule}</p>

      <details className="govuk-details govuk-!-margin-bottom-0">
        <summary className="govuk-details__summary"><span className="govuk-details__summary-text">More detail</span></summary>
        <div className="govuk-details__text">
          {wrongPicked.length > 0 && (
            <>
              <h3 className="govuk-heading-s">Why your answer is wrong</h3>
              <ul className="govuk-list govuk-list--bullet">
                {wrongPicked.map((i) => <li key={i}><strong>{KEYS[i]}</strong> – {q.optionNotes[i]}</li>)}
              </ul>
            </>
          )}
          {others.length > 0 && (
            <>
              <h3 className="govuk-heading-s">Why the other options are wrong</h3>
              <ul className="govuk-list govuk-list--bullet">
                {others.map((i) => <li key={i}><strong>{KEYS[i]}</strong> – {q.optionNotes[i]}</li>)}
              </ul>
            </>
          )}
          {q.example && <p className="govuk-body"><strong>On the road:</strong> {q.example}</p>}
          <h3 className="govuk-heading-s">Source</h3>
          <p className="govuk-body-s">
            {sourceLabel(q)}: {q.source.ref}<br />
            Topic: {TOPIC_MAP[q.topic].title} · Difficulty: {q.difficulty} · Question ID: {q.id}<br />
            AA book reference: not available (no pages of the book have been uploaded).
          </p>
        </div>
      </details>
      {!correct && selected.length > 0 && <p className="govuk-body-s govuk-!-margin-top-3 govuk-!-margin-bottom-0">Saved in your Mistake Book.</p>}
    </div>
  );
}
