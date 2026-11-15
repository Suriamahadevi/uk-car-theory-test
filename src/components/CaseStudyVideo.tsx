import { useEffect, useRef, useState } from 'react';
import { CASE_STUDY_MAP } from '../data/caseStudies';
import { CLIPS } from '../data/hazardClips';
import HazardScene from './HazardScene';
import { useVideoManifest, videoUrl } from '../data/hazardVideos';

/** Silent, replayable animated scenario for case-study questions (a simulation, not DVSA footage). */
export default function CaseStudyVideo({ caseId }: { caseId: string }) {
  const cs = CASE_STUDY_MAP[caseId];
  const clip = CLIPS.find((c) => c.id === cs?.clipId);
  const [t, setT] = useState(0);
  const [playing, setPlaying] = useState(false);
  const raf = useRef(0);
  const manifest = useVideoManifest();
  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  const real = cs?.videoId && manifest.status === 'ready' ? manifest.clips.find((c) => c.id === cs.videoId) : undefined;
  if (real) {
    return (
      <div className="govuk-!-margin-bottom-6">
        <p className="govuk-body govuk-!-margin-bottom-2"><strong>Video case study:</strong> {cs.title}</p>
        <div className="app-hp-stage" style={{ cursor: 'default', maxWidth: 560 }}>
          <video src={videoUrl(real.src)} controls muted playsInline preload="auto" />
        </div>
      </div>
    );
  }
  if (!cs || !clip) return null;

  const play = () => {
    cancelAnimationFrame(raf.current);
    const start = performance.now();
    setPlaying(true);
    const loop = () => {
      const now = (performance.now() - start) / 1000;
      if (now >= clip.duration) { setT(clip.duration); setPlaying(false); return; }
      setT(now);
      raf.current = requestAnimationFrame(loop);
    };
    raf.current = requestAnimationFrame(loop);
  };

  return (
    <div className="govuk-!-margin-bottom-6">
      <p className="govuk-body govuk-!-margin-bottom-2"><strong className="govuk-tag govuk-tag--purple">Video scenario (simulation)</strong> {cs.title} – {cs.intro}</p>
      <div className="app-hp-stage app-case-stage" style={{ cursor: 'default', maxWidth: 480 }}>
        <HazardScene clip={clip} t={t} />
      </div>
      <button type="button" className="govuk-button govuk-button--secondary govuk-!-margin-top-2 govuk-!-margin-bottom-0" onClick={play} disabled={playing}>
        {t === 0 ? 'Play video' : playing ? 'Playing…' : 'Replay video'}
      </button>
      <p className="govuk-body-s app-muted govuk-!-margin-top-1">Silent animated scenario. In the real test you watch a short filmed clip.</p>
    </div>
  );
}
