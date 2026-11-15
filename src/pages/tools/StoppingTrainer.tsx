import { useState } from 'react';
import { Link } from 'react-router-dom';
import { StoppingDiagram } from '../RevisionPage';

const TABLE: Record<number, [number, number]> = { 20: [6, 6], 30: [9, 14], 40: [12, 24], 50: [15, 38], 60: [18, 55], 70: [21, 75] };
const SPEEDS = [20, 30, 40, 50, 60, 70];

export default function StoppingTrainer() {
  const [speed, setSpeed] = useState(30);
  const [cond, setCond] = useState<'dry' | 'wet'>('dry');
  const [quizSpeed, setQuizSpeed] = useState(() => SPEEDS[Math.floor(Math.random() * SPEEDS.length)]);
  const [guess, setGuess] = useState('');
  const [result, setResult] = useState<string | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });

  const [think, brake] = TABLE[speed];
  const total = think + brake;
  const shown = cond === 'wet' ? total * 2 : total;
  const max = 192;
  const scale = (v: number) => `${(v / max) * 100}%`;

  const check = () => {
    const g = Number(guess);
    if (!guess || Number.isNaN(g)) { setResult('Enter a number of metres.'); return; }
    const [t, b] = TABLE[quizSpeed];
    const ok = Math.abs(g - (t + b)) <= 2;
    setScore((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
    setResult(`${ok ? 'Correct' : 'Not quite'}: at ${quizSpeed} mph the typical stopping distance is ${t + b} m (thinking ${t} m + braking ${b} m).`);
  };
  const next = () => { setQuizSpeed(SPEEDS[Math.floor(Math.random() * SPEEDS.length)]); setGuess(''); setResult(null); };

  return (
    <>
      <Link to="/tools" className="govuk-back-link">Study tools</Link>
      <h1 className="govuk-heading-xl">Stopping distance trainer</h1>
      <p className="govuk-body">Figures are the typical stopping distances in the Highway Code (rule 126) for a car with good brakes and tyres on a dry road.</p>

      <h2 className="govuk-heading-m">Explore</h2>
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="speed">Speed: {speed} mph</label>
        <input id="speed" type="range" min={20} max={70} step={10} value={speed} onChange={(e) => setSpeed(Number(e.target.value))} style={{ width: '100%', maxWidth: 480 }} />
      </div>
      <div className="govuk-radios govuk-radios--small govuk-radios--inline govuk-!-margin-bottom-4">
        {(['dry', 'wet'] as const).map((c) => (
          <div className="govuk-radios__item" key={c}>
            <input className="govuk-radios__input" type="radio" id={`c-${c}`} name="cond" checked={cond === c} onChange={() => setCond(c)} />
            <label className="govuk-label govuk-radios__label" htmlFor={`c-${c}`}>{c === 'dry' ? 'Dry road' : 'Wet road (at least double)'}</label>
          </div>
        ))}
      </div>
      <div style={{ maxWidth: 640, marginBottom: 10 }} aria-hidden="true">
        <div style={{ display: 'flex', height: 28, background: 'var(--surface-sunken)', borderRadius: 999, overflow: 'hidden' }}>
          <span style={{ width: scale(think), background: 'var(--primary)' }} />
          <span style={{ width: scale(shown - think), background: cond === 'wet' ? 'var(--warning)' : 'var(--error)' }} />
        </div>
      </div>
      <p className="govuk-body-l" aria-live="polite">
        At {speed} mph: thinking <strong>{think} m</strong> + braking <strong>{cond === 'wet' ? `at least ${shown - think}` : brake} m</strong> = <strong>{cond === 'wet' ? `at least ${shown}` : total} m</strong> (about {Math.round(shown / 4)} car lengths).
      </p>
      <p className="govuk-body-s">On ice, braking distances can be up to ten times longer. Thinking distance increases if you are tired, distracted or impaired.</p>

      <h2 className="govuk-heading-m">Thinking vs braking distance</h2>
      <p className="govuk-body">Thinking distance grows in line with speed. Braking distance grows much faster – double the speed and braking distance roughly quadruples.</p>
      <StoppingDiagram />

      <h2 className="govuk-heading-m">Test yourself</h2>
      <p className="govuk-body">Score: {score.right} / {score.total}</p>
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="guess">What is the typical overall stopping distance at {quizSpeed} mph? (metres)</label>
        <input className="govuk-input govuk-input--width-5" id="guess" inputMode="numeric" value={guess} onChange={(e) => setGuess(e.target.value)} onKeyDown={(e) => { if (e.key === 'Enter') check(); }} />
      </div>
      {result && <div className={`app-feedback app-feedback--${result.startsWith('Correct') ? 'correct' : 'wrong'}`} role="status"><p className="govuk-body govuk-!-margin-bottom-0">{result}</p></div>}
      <div className="app-actions">
        <button type="button" className="govuk-button" onClick={check}>Check</button>
        <button type="button" className="govuk-button govuk-button--secondary" onClick={next}>Next speed</button>
      </div>
    </>
  );
}
