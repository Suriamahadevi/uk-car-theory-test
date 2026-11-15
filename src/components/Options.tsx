import type { Question } from '../types';
import SignImage from './SignImage';

const KEYS = 'ABCDEF';

export type OptionState = 'none' | 'selected' | 'correct' | 'wrong';

/**
 * Answer options as large, keyboard-accessible buttons. Works for single-answer
 * (radio behaviour) and "mark N answers" (checkbox behaviour) questions.
 */
export default function Options({
  q,
  selected,
  onToggle,
  states,
  disabled,
  marks,
}: {
  q: Question;
  selected: number[];
  onToggle: (i: number) => void;
  states?: OptionState[];
  disabled?: boolean;
  marks?: (string | null)[];
}) {
  const multi = q.correct.length > 1;
  const picture = !!q.optionSigns;
  const items = q.options.map((text, i) => {
    const st = states?.[i] ?? (selected.includes(i) ? 'selected' : 'none');
    const cls = `app-option${multi ? ' is-multi' : ''}${st !== 'none' ? ` is-${st}` : ''}`;
    return (
      <li key={i} style={picture ? { listStyle: 'none' } : undefined}>
        <button
          type="button"
          className={cls}
          role={multi ? 'checkbox' : 'radio'}
          aria-checked={selected.includes(i)}
          disabled={disabled}
          onClick={() => onToggle(i)}
        >
          <span className="app-option__key" aria-hidden="true">{KEYS[i]}</span>
          {picture ? (
            <>
              <SignImage id={q.optionSigns![i]} label={`${text}: road sign`} />
              <span>{text}</span>
            </>
          ) : (
            <span>{text}</span>
          )}
          {marks?.[i] && <span className="app-option__mark">{marks[i]}</span>}
        </button>
      </li>
    );
  });
  return (
    <div role={multi ? 'group' : 'radiogroup'} aria-label="Answer options">
      {multi && (
        <p className="govuk-inset-text app-mt-0">Mark {q.correct.length} answers.</p>
      )}
      <ul className={picture ? 'app-options app-picture-options' : 'app-options'}>{items}</ul>
    </div>
  );
}
