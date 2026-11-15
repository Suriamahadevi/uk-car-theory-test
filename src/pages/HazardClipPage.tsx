import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { CLIPS, HP_MAX, HP_PASS, type HazardClip } from '../data/hazardClips';
import HazardScene from '../components/HazardScene';
import { scoreClip } from '../engine/hazardScoring';
import { setState, uid } from '../store/store';
import type { HazardClipResult } from '../types';
import NotFound from './NotFound';
import { DISCLAIMER } from '../components/Layout';

export function Timeline({ clip, clicks }: { clip: { duration: number; hazards: { start: number; end: number }[] }; clicks: number[] }) {
  const pct = (t: number) => `${(t / clip.duration) * 100}%`;
  const shades = [1, 0.8, 0.6, 0.42, 0.26]; // success colour, fading with later bands
  return (
    <div>
      <div className="app-hp-timeline" aria-hidden="true">
        {clip.hazards.map((h, hi) =>
          shades.map((c, i) => {
            const band = (h.end - h.start) / 5;
            return <span key={`${hi}-${i}`} className="w" style={{ left: pct(h.start + i * band), width: pct(band), background: 'var(--success)', opacity: c }} />;
          }),
        )}
        {clicks.map((c, i) => <span key={i} className="c" style={{ left: pct(c) }} />)}
      </div>
      <p className="govuk-body-s">Green bands show the scoring window (5 points on the left, down to 1). Black lines show your clicks.</p>
    </div>
  );
}

/** Explain why a hazard scored nothing. */
export function missReason(h: { start: number; end: number }, clicks: number[]): string {
  if (!clicks.length) return 'You did not click at all. Click as soon as you see a hazard start to develop.';
  const early = clicks.filter((c) => c < h.start);
  const late = clicks.filter((c) => c > h.end);
  if (early.length && !late.length) return `Too early: your last click before the window was ${(h.start - Math.max(...early)).toFixed(1)}s before the hazard started to develop. Click again when it starts to develop.`;
  if (late.length && !early.length) return `Too late: your first click was ${(Math.min(...late) - h.end).toFixed(1)}s after the scoring window closed. Look for earlier clues.`;
  return 'Your clicks were either before the hazard developed or after the window closed. Click once at the first clue and again as it develops.';
}

function ClipFeedback({ clip, res }: { clip: HazardClip; res: HazardClipResult }) {
  const { perHazard } = scoreClip(clip.hazards, res.clicks);
  return (
    <div className={`app-feedback app-feedback--${res.score > 0 ? 'correct' : 'wrong'}`}>
      <h3 className="govuk-heading-m app-feedback__title">{clip.title}: {res.score} out of {clip.hazards.length * 5}</h3>
      {res.cheated && (
        <div className="govuk-warning-text"><span className="govuk-warning-text__icon" aria-hidden="true">!</span>
          <strong className="govuk-warning-text__text"><span className="govuk-visually-hidden">Warning</span>Clicking pattern detected – this clip scores zero. In the real test, clicking continuously or in a pattern also scores zero.</strong></div>
      )}
      <Timeline clip={clip} clicks={res.clicks} />
      <ul className="govuk-list govuk-list--bullet">
        {clip.hazards.map((h, i) => (
          <li key={i}><strong>{res.cheated ? 0 : perHazard[i]} points</strong> – {h.what} (window {h.start.toFixed(1)}s to {h.end.toFixed(1)}s){!res.cheated && perHazard[i] === 0 && <><br /><strong className="govuk-tag govuk-tag--red">Missed</strong> {missReason(h, res.clicks)}</>}</li>
        ))}
      </ul>
      <p className="govuk-body"><strong>Lesson:</strong> {clip.lesson}</p>
      <p className="govuk-body-s">Potential hazards in this clip (no points, but watch them): {clip.potential.join('; ')}.</p>
      <p className="govuk-body-s">You clicked {res.clicks.length} time{res.clicks.length === 1 ? '' : 's'}.</p>
    </div>
  );
}

/** Plays one clip; calls onDone with the clicks when it finishes. */
function Player({ clip, captionsDefault, onDone, label }: { clip: HazardClip; captionsDefault: boolean; onDone: (clicks: number[]) => void; label: string }) {
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [clicks, setClicks] = useState<number[]>([]);
  const [captions, setCaptions] = useState(captionsDefault);
  const start = useRef(0);
  const clicksRef = useRef<number[]>([]);
  const raf = useRef(0);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);

  const begin = () => {
    clicksRef.current = [];
    setClicks([]);
    setPlaying(true);
    start.current = performance.now();
    const loop = () => {
      const now = (performance.now() - start.current) / 1000;
      if (now >= clip.duration) {
        setT(clip.duration);
        setPlaying(false);
        onDone(clicksRef.current);
        return;
      }
      setT(now);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  };

  const click = useCallback(() => {
    if (!playing) return;
    const now = (performance.now() - start.current) / 1000;
    clicksRef.current = [...clicksRef.current, now];
    setClicks(clicksRef.current);
  }, [playing]);

  useEffect(() => {
    const key = (e: KeyboardEvent) => {
      if (playing && (e.code === 'Space' || e.code === 'Enter')) { e.preventDefault(); click(); }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [playing, click]);

  const caption = [...clip.captions].reverse().find(([ct]) => t >= ct)?.[1] ?? '';

  return (
    <div>
      <p className="govuk-body govuk-!-font-weight-bold">{label}</p>
      <div className="app-hp-stage" onPointerDown={click} aria-label="Hazard scene. Click, tap, or press space when you see a developing hazard.">
        <HazardScene clip={clip} t={t} />
      </div>
      <div className="app-hp-flags" aria-live="polite">
        {clicks.map((_, i) => <span key={i} className="app-hp-flag" aria-hidden="true" />)}
        <span className="govuk-visually-hidden">{clicks.length} clicks</span>
      </div>
      {captions && <div className="app-hp-caption" aria-live="polite">{playing ? caption : 'Scene descriptions appear here while the clip plays.'}</div>}
      <div className="app-actions govuk-!-margin-top-3">
        {!playing && t === 0 && <button type="button" className="govuk-button" onClick={begin}>Play clip</button>}
        {playing && <button type="button" className="govuk-button govuk-button--warning" onClick={click}>Hazard! (or press space)</button>}
      </div>
      {t === 0 && (
        <div className="govuk-checkboxes govuk-checkboxes--small">
          <div className="govuk-checkboxes__item">
            <input className="govuk-checkboxes__input" id={`cap-${clip.id}`} type="checkbox" checked={captions} onChange={(e) => setCaptions(e.target.checked)} />
            <label className="govuk-label govuk-checkboxes__label" htmlFor={`cap-${clip.id}`}>Show scene descriptions (makes it easier – the real test has no descriptions)</label>
          </div>
        </div>
      )}
    </div>
  );
}

export default function HazardClipPage({ full }: { full?: boolean }) {
  const { id } = useParams();
  const nav = useNavigate();
  const [index, setIndex] = useState(0);
  const [results, setResults] = useState<HazardClipResult[]>([]);
  const [single, setSingle] = useState<HazardClipResult | null>(null);
  const [runKey, setRunKey] = useState(0);
  const [started, setStarted] = useState(false);

  if (!full) {
    const clip = CLIPS.find((c) => c.id === id);
    if (!clip) return <NotFound />;
    const idx = CLIPS.indexOf(clip);
    const done = (clicks: number[]) => {
      const s = scoreClip(clip.hazards, clicks);
      const r: HazardClipResult = { clipId: clip.id, score: s.score, clicks, cheated: s.cheated };
      setSingle(r);
      setState((st) => ({ ...st, hazard: [...st.hazard, { id: uid('hp'), at: Date.now(), full: false, clips: [r], score: s.score, max: clip.hazards.length * 5, passed: s.score > 0 }] }));
    };
    return (
      <>
        <Link to="/hazard" className="govuk-back-link">Hazard perception</Link>
        <span className="govuk-caption-l">Simulated clip {idx + 1} of {CLIPS.length}</span>
        <h1 className="govuk-heading-l">{clip.title}</h1>
        <Player key={`${clip.id}-${runKey}`} clip={clip} captionsDefault onDone={done} label="Click when you see a hazard start to develop." />
        {single && (
          <>
            <ClipFeedback clip={clip} res={single} />
            <div className="app-actions">
              <button type="button" className="govuk-button govuk-button--secondary" onClick={() => { setSingle(null); setRunKey((k) => k + 1); }}>Try this clip again</button>
              {idx < CLIPS.length - 1 && <button type="button" className="govuk-button" onClick={() => { setSingle(null); nav(`/hazard/clip/${CLIPS[idx + 1].id}`); }}>Next clip</button>}
            </div>
          </>
        )}
      </>
    );
  }

  // ---------------- Full 14-clip simulation (distraction-free)
  const finished = results.length === CLIPS.length;
  const total = results.reduce((a, r) => a + r.score, 0);
  const onClipDone = (clicks: number[]) => {
    const clip = CLIPS[index];
    const s = scoreClip(clip.hazards, clicks);
    const next = [...results, { clipId: clip.id, score: s.score, clicks, cheated: s.cheated }];
    setResults(next);
    if (next.length === CLIPS.length) {
      const sc = next.reduce((a, r) => a + r.score, 0);
      setState((st) => ({ ...st, hazard: [...st.hazard, { id: uid('hp'), at: Date.now(), full: true, clips: next, score: sc, max: HP_MAX, passed: sc >= HP_PASS }] }));
    }
  };

  return (
    <div className="app-exam">
      <div className="app-exam__bar"><div className="govuk-width-container">
        <span className="app-exam__title">Hazard perception – simulation</span>
        <span>{finished ? 'Finished' : `Clip ${index + 1} of ${CLIPS.length}`}</span>
      </div></div>
      <main className="app-exam__body" id="main-content"><div className="govuk-width-container">
        {!started ? (
          <>
            <h1 className="govuk-heading-l">Full hazard perception simulation</h1>
            <div className="govuk-warning-text"><span className="govuk-warning-text__icon" aria-hidden="true">!</span>
              <strong className="govuk-warning-text__text"><span className="govuk-visually-hidden">Warning</span>These are simulated diagrams, not real DVSA video clips. Use them to practise timing, then practise with official video clips too.</strong></div>
            <ul className="govuk-list govuk-list--bullet">
              <li>14 clips with 15 developing hazards (one clip has two).</li>
              <li>Up to 5 points per hazard – maximum {HP_MAX}. Pass mark {HP_PASS}.</li>
              <li>You only see your scores at the end, as in the real test.</li>
              <li>Clicking continuously or in a pattern scores zero for that clip.</li>
            </ul>
            <div className="app-actions">
              <button type="button" className="govuk-button" onClick={() => setStarted(true)}>Start</button>
              <Link to="/hazard" className="govuk-button govuk-button--secondary">Cancel</Link>
            </div>
          </>
        ) : !finished ? (
          results.length === index ? (
            <Player key={CLIPS[index].id} clip={CLIPS[index]} captionsDefault={false} onDone={onClipDone} label={`Clip ${index + 1}. Click when you see a developing hazard.`} />
          ) : (
            <>
              <h1 className="govuk-heading-l">Clip {index + 1} finished</h1>
              <button type="button" className="govuk-button" autoFocus onClick={() => setIndex(index + 1)}>Start clip {index + 2}</button>
            </>
          )
        ) : (
          <>
            <div className="govuk-panel" style={{ background: total >= HP_PASS ? 'var(--success)' : 'var(--error)', color: 'var(--on-status)' }}>
              <h1 className="govuk-panel__title">{total >= HP_PASS ? 'Pass' : 'Not passed'}</h1>
              <div className="govuk-panel__body">You scored <strong>{total} out of {HP_MAX}</strong><br />Pass mark: {HP_PASS}</div>
            </div>
            <p className="govuk-body">Remember: this simulation is a guide to timing only.</p>
            {CLIPS.map((c, i) => <ClipFeedback key={c.id} clip={c} res={results[i]} />)}
            <div className="app-actions">
              <Link to="/hazard" className="govuk-button">Back to hazard perception</Link>
              <Link to="/history" className="govuk-button govuk-button--secondary">Test history</Link>
            </div>
          </>
        )}
      </div></main>
      <div className="govuk-width-container"><p className="govuk-body-s app-muted">{DISCLAIMER}</p></div>
    </div>
  );
}
