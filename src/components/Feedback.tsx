import type { Question } from '../types';
import { TOPIC_MAP } from '../data/topics';
import { sourceLabel } from '../engine/bank';

const KEYS = 'ABCDEF';

export function SourceLine({ q }: { q: Question }) {
  return (
    <p className="govuk-body-s app-muted">
      Topic: {TOPIC_MAP[q.topic].title} · Difficulty: {q.difficulty} · {sourceLabel(q)} – {q.source.ref}
      <br />
      AA book reference: not available (no pages of the book have been uploaded).
    </p>
  );
}

/** Explanation panel shown after answering in learning or revision mode. */
export default function Feedback({ q, selected }: { q: Question; selected: number[] }) {
  const correct = selected.length === q.correct.length && selected.every((s) => q.correct.includes(s));
  const wrongPicked = selected.filter((s) => !q.correct.includes(s));
  const others = q.options.map((_, i) => i).filter((i) => !q.correct.includes(i) && !selected.includes(i));
  const label = (i: number) => (q.optionSigns ? `${KEYS[i]} (${q.options[i]})` : `${KEYS[i]}: ${q.options[i]}`);

  return (
    <div className={`app-feedback app-feedback--${correct ? 'correct' : 'wrong'}`} role="status" aria-live="polite">
      <h2 className="govuk-heading-m app-feedback__title">{correct ? '✓ Correct' : '✗ Incorrect'}</h2>

      {!correct && (
        <>
          <p className="govuk-body">
            <strong>Your answer:</strong> {selected.length ? selected.map(label).join(', ') : 'none'}
            <br />
            <strong>Correct answer:</strong> {q.correct.map(label).join(', ')}
          </p>
          {wrongPicked.length > 0 && (
            <>
              <h3 className="govuk-heading-s">Why your answer is wrong</h3>
              <ul className="govuk-list govuk-list--bullet">
                {wrongPicked.map((i) => (
                  <li key={i}><strong>{KEYS[i]}</strong> – {q.optionNotes[i]}</li>
                ))}
              </ul>
            </>
          )}
        </>
      )}

      <h3 className="govuk-heading-s">Why {q.correct.length > 1 ? 'these answers are' : 'this answer is'} correct</h3>
      <p className="govuk-body">{q.explanation}</p>

      {others.length > 0 && (
        <>
          <h3 className="govuk-heading-s">Why the other options are wrong</h3>
          <ul className="govuk-list govuk-list--bullet">
            {others.map((i) => (
              <li key={i}><strong>{KEYS[i]}</strong> – {q.optionNotes[i]}</li>
            ))}
          </ul>
        </>
      )}

      <div className="govuk-inset-text">
        <strong>Rule to remember:</strong> {q.rule}
      </div>
      {q.example && (
        <p className="govuk-body"><strong>On the road:</strong> {q.example}</p>
      )}
      {!correct && selected.length > 0 && <p className="govuk-body-s"><strong>Saved in your Mistake Book.</strong></p>}
      <SourceLine q={q} />
    </div>
  );
}
