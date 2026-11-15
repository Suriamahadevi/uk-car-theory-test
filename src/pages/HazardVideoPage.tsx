import { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useVideoManifest, videoUrl, VIDEO_CATEGORIES, type HazardVideo } from '../data/hazardVideos';
import { scoreClip } from '../engine/hazardScoring';
import { setState, uid } from '../store/store';
import { Timeline, missReason } from './HazardClipPage';
import PageHead from '../components/PageHead';

type Phase = 'ready' | 'playing' | 'paused' | 'done';

/** Plays a licensed hazard perception video, records clicks and scores them. */
function VideoPlayer({ clip }: { clip: HazardVideo }) {
  const video = useRef<HTMLVideoElement>(null);
  const [mode, setMode] = useState<'learn' | 'test'>('learn');
  const [phase, setPhase] = useState<Phase>('ready');
  const [clicks, setClicks] = useState<number[]>([]);
  const [error, setError] = useState<string | null>(null);
  const clicksRef = useRef<number[]>([]);

  const record = useCallback(() => {
    const v = video.current;
    if (!v || v.paused || v.ended) return;
    clicksRef.current = [...clicksRef.current, v.currentTime];
    setClicks(clicksRef.current);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (phase === 'playing' && (e.code === 'Space' || e.code === 'Enter')) { e.preventDefault(); record(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [phase, record]);

  const start = () => {
    const v = video.current;
    if (!v) return;
    clicksRef.current = [];
    setClicks([]);
    v.currentTime = 0;
    v.play().then(() => setPhase('playing')).catch(() => setError('The video could not be played in this browser.'));
  };
  const finish = () => {
    setPhase('done');
    const s = scoreClip(clip.hazards.map((h) => ({ ...h, what: h.description })), clicksRef.current);
    setState((st) => ({ ...st, hazard: [...st.hazard, { id: uid('hp'), at: Date.now(), full: false, clips: [{ clipId: `video:${clip.id}`, score: s.score, clicks: clicksRef.current, cheated: s.cheated }], score: s.score, max: clip.hazards.length * 5, passed: s.score > 0 }] }));
  };

  const hazards = clip.hazards.map((h) => ({ ...h, what: h.description }));
  const result = phase === 'done' ? scoreClip(hazards, clicks) : null;

  return (
    <>
      {phase === 'ready' && (
        <div className="govuk-radios govuk-radios--small govuk-radios--inline govuk-!-margin-bottom-4">
          {(['learn', 'test'] as const).map((m) => (
            <div className="govuk-radios__item" key={m}>
              <input className="govuk-radios__input" type="radio" id={`mode-${m}`} name="mode" checked={mode === m} onChange={() => setMode(m)} />
              <label className="govuk-label govuk-radios__label" htmlFor={`mode-${m}`}>{m === 'learn' ? 'Learning mode (pause and replay)' : 'Test mode (plays once)'}</label>
            </div>
          ))}
        </div>
      )}
      <div className="app-hp-stage" onPointerDown={record} aria-label="Hazard perception video. Click, tap or press space when you see a developing hazard.">
        <video
          ref={video}
          src={videoUrl(clip.src)}
          poster={clip.poster ? videoUrl(clip.poster) : undefined}
          playsInline
          muted
          preload="auto"
          onEnded={finish}
          onError={() => setError('The video file could not be loaded.')}
        />
      </div>
      {error && <p className="govuk-error-message">{error}</p>}
      <div className="app-hp-flags" aria-live="polite">
        {clicks.map((_, i) => <span key={i} className="app-hp-flag" aria-hidden="true" />)}
        <span className="govuk-visually-hidden">{clicks.length} clicks</span>
      </div>
      <div className="app-actions">
        {phase === 'ready' && <button type="button" className="govuk-button" onClick={start}>Play video</button>}
        {phase === 'playing' && <button type="button" className="govuk-button govuk-button--warning" onClick={record}>Hazard! (or press space)</button>}
        {phase === 'playing' && mode === 'learn' && <button type="button" className="govuk-button govuk-button--secondary" onClick={() => { video.current?.pause(); setPhase('paused'); }}>Pause</button>}
        {phase === 'paused' && <button type="button" className="govuk-button" onClick={() => video.current?.play().then(() => setPhase('playing'))}>Resume</button>}
        {phase === 'done' && mode === 'learn' && <button type="button" className="govuk-button govuk-button--secondary" onClick={() => setPhase('ready')}>Replay</button>}
      </div>

      {result && (
        <div className={`app-feedback app-feedback--${result.score > 0 ? 'correct' : 'wrong'}`}>
          <h2 className="app-feedback__title">{result.score} out of {clip.hazards.length * 5}</h2>
          {result.cheated && <p className="govuk-body">Clicking pattern detected – this clip scores zero, as in the real test.</p>}
          <Timeline clip={{ duration: clip.durationSec, hazards: clip.hazards }} clicks={clicks} />
          <ul className="govuk-list govuk-list--bullet">
            {clip.hazards.map((h, i) => (
              <li key={i}>
                <strong>{result.perHazard[i]} points</strong> – {h.description} ({h.start.toFixed(1)}s to {h.end.toFixed(1)}s)
                {!result.cheated && result.perHazard[i] === 0 && <><br /><strong className="govuk-tag govuk-tag--red">Missed</strong> {missReason(h, clicks)}</>}
                {!result.cheated && result.perHazard[i] > 0 && result.perHazard[i] <= 2 && <><br /><strong className="govuk-tag govuk-tag--yellow">Late</strong> You spotted it, but later than ideal. Look for the earliest clue.</>}
              </li>
            ))}
          </ul>
        </div>
      )}
      <p className="govuk-body-s app-muted">Footage: {clip.licence.holder} · {clip.licence.licence}{clip.licence.verifiedBy ? ` · timings verified by ${clip.licence.verifiedBy}` : ''}</p>
    </>
  );
}

export default function HazardVideoPage() {
  const { id } = useParams();
  const manifest = useVideoManifest();
  const clip = manifest.status === 'ready' ? manifest.clips.find((c) => c.id === id) : undefined;
  const cat = clip ? VIDEO_CATEGORIES.find((c) => c.id === clip.category)?.label : undefined;
  return (
    <>
      <Link to="/hazard" className="govuk-back-link">Hazard perception</Link>
      {manifest.status === 'loading' && <p className="govuk-body">Loading video…</p>}
      {manifest.status === 'error' && <p className="govuk-error-message">{manifest.message}</p>}
      {manifest.status === 'ready' && !clip && (
        <>
          <PageHead title="Video not available" lead="This clip is not in the licensed video library." />
          <Link className="govuk-link" to="/hazard">Back to hazard perception</Link>
        </>
      )}
      {clip && (
        <>
          <PageHead eyebrow={`Video practice · ${cat}`} title={clip.title} lead="Click when a hazard starts to develop." />
          <VideoPlayer clip={clip} />
        </>
      )}
    </>
  );
}
