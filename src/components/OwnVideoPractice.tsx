import { useEffect, useRef, useState } from 'react';
import { pointsForClick } from '../engine/hazardScoring';
import { isCheating } from '../engine/hazardScoring';
import { setState, uid } from '../store/store';

/**
 * Practise click timing with a video file the learner already owns (for example from
 * official DVSA learning materials). The file stays on this device – it is never uploaded.
 * After watching, the learner marks when each hazard began; scoring uses an estimated
 * 5-second window, so results are a guide only.
 */
export default function OwnVideoPractice() {
  const [url, setUrl] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [clicks, setClicks] = useState<number[]>([]);
  const [phase, setPhase] = useState<'idle' | 'watching' | 'marking' | 'done'>('idle');
  const [starts, setStarts] = useState<number[]>([]);
  const video = useRef<HTMLVideoElement>(null);

  useEffect(() => () => { if (url) URL.revokeObjectURL(url); }, [url]);

  const load = (f?: File) => {
    if (!f) return;
    if (url) URL.revokeObjectURL(url);
    setUrl(URL.createObjectURL(f));
    setName(f.name);
    setClicks([]);
    setStarts([]);
    setPhase('watching');
  };
  const click = () => { if (video.current && !video.current.paused) setClicks((c) => [...c, video.current!.currentTime]); };
  const WINDOW = 5;
  const hazards = starts.map((s) => ({ start: s, end: s + WINDOW, what: '' }));
  const cheated = isCheating(clicks);
  const per = hazards.map((h) => (cheated ? 0 : Math.max(0, ...clicks.map((c) => pointsForClick(h, c)))));
  const total = per.reduce((a, b) => a + b, 0);

  const finish = () => {
    setPhase('done');
    setState((s) => ({ ...s, hazard: [...s.hazard, { id: uid('hp'), at: Date.now(), full: false, clips: [{ clipId: `own:${name}`, score: total, clicks, cheated }], score: total, max: hazards.length * 5, passed: total > 0 }] }));
  };

  return (
    <div className="app-revision-card">
      <h3 className="govuk-heading-m">Practise with your own video clip</h3>
      <p className="govuk-body">If you own real hazard perception clips (for example from official DVSA learning materials), you can practise your timing here. The video stays on your device and is never uploaded. No clips are supplied by this site.</p>
      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="own-video">Choose a video file</label>
        <input className="govuk-file-upload" id="own-video" type="file" accept="video/*" onChange={(e) => load(e.target.files?.[0])} />
      </div>
      {url && (
        <>
          <video ref={video} src={url} controls={phase !== 'watching'} style={{ width: '100%', maxWidth: 720, background: '#000' }} onEnded={() => phase === 'watching' && setPhase('marking')} onClick={click} />
          {phase === 'watching' && (
            <div className="app-actions govuk-!-margin-top-2">
              <button type="button" className="govuk-button" onClick={() => video.current?.play()}>Play</button>
              <button type="button" className="govuk-button govuk-button--warning" onClick={click}>Hazard! ({clicks.length})</button>
              <button type="button" className="govuk-button govuk-button--secondary" onClick={() => { video.current?.pause(); setPhase('marking'); }}>I have finished watching</button>
            </div>
          )}
          {phase === 'marking' && (
            <>
              <p className="govuk-body govuk-!-margin-top-2">Now mark when each developing hazard <strong>started</strong>: move the video to that moment (use the controls) and select "Mark hazard start here". Use the answer from your learning materials if it gives one.</p>
              <div className="app-actions">
                <button type="button" className="govuk-button govuk-button--secondary" onClick={() => video.current && setStarts((s) => [...s, video.current!.currentTime].sort((a, b) => a - b))}>Mark hazard start here</button>
                <button type="button" className="govuk-button" disabled={!starts.length} onClick={finish}>Score my clicks</button>
              </div>
              <p className="govuk-body-s">Hazard starts marked: {starts.map((s) => `${s.toFixed(1)}s`).join(', ') || 'none'}</p>
            </>
          )}
          {phase === 'done' && (
            <div className={`app-feedback app-feedback--${total > 0 ? 'correct' : 'wrong'}`}>
              <h4 className="govuk-heading-s">Estimated score: {total} out of {hazards.length * 5}</h4>
              {cheated && <p className="govuk-body">Clicking pattern detected – this would score zero.</p>}
              <ul className="govuk-list govuk-list--bullet">{hazards.map((h, i) => <li key={i}>Hazard at {h.start.toFixed(1)}s: {per[i]} points</li>)}</ul>
              <p className="govuk-body-s">Your clicks: {clicks.map((c) => `${c.toFixed(1)}s`).join(', ') || 'none'}. This is an estimate using a 5-second window – real scoring windows vary by clip.</p>
              <button type="button" className="govuk-button govuk-button--secondary" onClick={() => { setClicks([]); setStarts([]); setPhase('watching'); if (video.current) video.current.currentTime = 0; }}>Try again</button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
