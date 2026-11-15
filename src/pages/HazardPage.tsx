import { Link, useNavigate } from 'react-router-dom';
import { setState, useAppData } from '../store/store';
import { CLIPS, HP_MAX, HP_PASS } from '../data/hazardClips';
import { buildPractice } from '../engine/bank';
import { startSession } from '../store/actions';
import OwnVideoPractice from '../components/OwnVideoPractice';
import { hazardAverage } from '../engine/progress';
import { useVideoManifest, VIDEO_CATEGORIES } from '../data/hazardVideos';
import Tabs from '../components/Tabs';
import PageHead from '../components/PageHead';
import Icon from '../components/Icon';

function ScoringDiagram() {
  const shades = [1, 0.8, 0.6, 0.42, 0.26];
  return (
    <svg className="app-chart" viewBox="0 0 620 110" role="img" aria-label="Scoring window: clicking early in the window scores 5, then 4, 3, 2, 1. Before or after the window scores 0.">
      <rect x="0" y="30" width="120" height="40" style={{ fill: 'var(--surface-sunken)' }} />
      <text x="60" y="55" textAnchor="middle">0 – too early</text>
      {shades.map((c, i) => (
        <g key={i}>
          <rect x={120 + i * 76} y="30" width="76" height="40" style={{ fill: 'var(--success)', fillOpacity: c, stroke: 'var(--bg)' }} />
          <text x={158 + i * 76} y="55" textAnchor="middle" style={{ fontWeight: 700, fill: i < 2 ? 'var(--on-status)' : 'var(--text)' }}>{5 - i}</text>
        </g>
      ))}
      <rect x="500" y="30" width="120" height="40" style={{ fill: 'var(--surface-sunken)' }} />
      <text x="560" y="55" textAnchor="middle">0 – too late</text>
      <text x="120" y="20">Hazard starts to develop</text>
      <text x="500" y="95" textAnchor="end">Time →</text>
    </svg>
  );
}

function VideoLibrary() {
  const manifest = useVideoManifest();
  if (manifest.status === 'loading') return <p className="govuk-body">Loading the video library…</p>;
  if (manifest.status === 'error') return <p className="govuk-error-message">{manifest.message}</p>;
  const clips = manifest.clips;
  return (
    <>
      {clips.length === 0 && (
        <div className="app-pending govuk-!-margin-bottom-6">
          <span className="app-pending__tag">Pending licensed content</span>
          <h2 className="govuk-heading-m">Real-video clips are being sourced</h2>
          <p className="govuk-body">The video player, click timing, scoring and results are ready. No road footage has been added yet, because every clip must be properly licensed. Until then, use the timing trainer or the official resources below.</p>
        </div>
      )}
      <div className="app-card-grid">
        {VIDEO_CATEGORIES.map((cat) => {
          const inCat = clips.filter((c) => c.category === cat.id);
          return (
            <div className="app-card" key={cat.id}>
              <h3 className="govuk-heading-s">{cat.label}</h3>
              {inCat.length === 0 ? (
                <p className="govuk-body-s app-muted govuk-!-margin-bottom-0">Pending licensed content</p>
              ) : (
                <ul className="govuk-list govuk-!-margin-bottom-0">
                  {inCat.map((c) => <li key={c.id}><Link className="govuk-link" to={`/hazard/video/${c.id}`}>{c.title}</Link></li>)}
                </ul>
              )}
            </div>
          );
        })}
      </div>
      <details className="govuk-details">
        <summary className="govuk-details__summary"><span className="govuk-details__summary-text">Practise with a clip you already own</span></summary>
        <div className="govuk-details__text"><OwnVideoPractice /></div>
      </details>
      <h3 className="govuk-heading-s">Official resources</h3>
      <ul className="govuk-list govuk-list--bullet">
        <li><a className="govuk-link" href="https://www.gov.uk/theory-test/hazard-perception-test" target="_blank" rel="noreferrer">Hazard perception test – GOV.UK (includes an official explanation video)</a></li>
        <li><a className="govuk-link" href="https://www.safedrivingforlife.info/shop/" target="_blank" rel="noreferrer">Official DVSA learning materials with practice clips – Safe Driving for Life (paid)</a></li>
      </ul>
    </>
  );
}

export default function HazardPage() {
  const data = useAppData();
  const nav = useNavigate();
  const fulls = data.hazard.filter((h) => h.full);
  const best = fulls.length ? Math.max(...fulls.map((h) => h.score)) : null;
  const avg = hazardAverage(data);
  const clipBest = (id: string) => {
    const scores = data.hazard.flatMap((h) => h.clips.filter((c) => c.clipId === id).map((c) => c.score));
    return scores.length ? Math.max(...scores) : null;
  };

  const trainer = (
    <>
      <div className="govuk-warning-text">
        <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
        <strong className="govuk-warning-text__text"><span className="govuk-visually-hidden">Warning</span>These are animated simulations for practising click timing. They are not real video clips and not DVSA footage.</strong>
      </div>
      <div className="app-metrics">
        <div className="app-metric"><span className="app-metric__value">{fulls.length}</span><span className="app-metric__label">Full simulations</span></div>
        <div className="app-metric"><span className="app-metric__value">{best ?? '–'}</span><span className="app-metric__label">Best (of {HP_MAX})</span></div>
        <div className="app-metric"><span className="app-metric__value">{avg === null ? '–' : avg.toFixed(0)}</span><span className="app-metric__label">Average · pass {HP_PASS}</span></div>
      </div>
      <div className="app-actions">
        <Link to="/hazard/test" className="govuk-button">Full simulation: 14 clips</Link>
      </div>
      <table className="govuk-table">
        <thead className="govuk-table__head"><tr className="govuk-table__row"><th className="govuk-table__header">Simulated clip</th><th className="govuk-table__header">Hazards</th><th className="govuk-table__header">Best</th></tr></thead>
        <tbody className="govuk-table__body">
          {CLIPS.map((c, i) => {
            const b = clipBest(c.id);
            return (
              <tr className="govuk-table__row" key={c.id}>
                <td className="govuk-table__cell"><Link className="govuk-link" to={`/hazard/clip/${c.id}`}>{i + 1}. {c.title}</Link></td>
                <td className="govuk-table__cell">{c.hazards.length}</td>
                <td className="govuk-table__cell">{b === null ? '–' : `${b}/${c.hazards.length * 5}`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </>
  );

  const how = (
    <>
      <div className="app-metrics">
        <div className="app-metric"><span className="app-metric__value">14</span><span className="app-metric__label">Video clips</span></div>
        <div className="app-metric"><span className="app-metric__value">15</span><span className="app-metric__label">Developing hazards</span></div>
        <div className="app-metric"><span className="app-metric__value">{HP_MAX}</span><span className="app-metric__label">Maximum points</span></div>
        <div className="app-metric"><span className="app-metric__value">{HP_PASS}</span><span className="app-metric__label">Pass mark</span></div>
      </div>
      <h2 className="govuk-heading-s">Potential or developing hazard?</h2>
      <p className="govuk-body"><strong>Potential:</strong> something that could become a problem – a parked car, a junction. No points.<br /><strong>Developing:</strong> something that would make you slow down, stop or steer. This scores.</p>
      <h2 className="govuk-heading-s">When to click</h2>
      <p className="govuk-body">As soon as you see a hazard start to develop. Earlier in the window scores more.</p>
      <ScoringDiagram />
      <h2 className="govuk-heading-s">Why constant clicking scores zero</h2>
      <p className="govuk-body">Clicking continuously or in a pattern scores zero for that clip. One or two well-timed clicks per hazard is enough.</p>
      <div className="app-actions">
        <button type="button" className="govuk-button govuk-button--secondary" onClick={() => { startSession({ title: 'Hazard awareness questions', mode: 'learn', qids: buildPractice(data, { topics: ['hazard-awareness'], count: 15, difficulty: 'any', prefer: 'unseen' }), returnTo: '/hazard' }); nav('/session'); }}>
          Hazard awareness questions
        </button>
        {!data.hazardLessonsDone ? (
          <button type="button" className="govuk-button govuk-button--secondary" onClick={() => setState((s) => ({ ...s, hazardLessonsDone: true }))}>I understand how scoring works</button>
        ) : <strong className="govuk-tag govuk-tag--green">Lessons read</strong>}
      </div>
    </>
  );

  return (
    <>
      <PageHead eyebrow="Test" title="Hazard perception" lead="Spot developing hazards early. Pass mark 44 out of 75." />
      <Tabs label="Hazard perception sections" tabs={[
        { label: 'Video practice', content: <VideoLibrary /> },
        { label: 'Timing trainer', content: trainer },
        { label: 'How it works', content: how },
      ]} />
      <p className="govuk-body"><Link className="govuk-link" to="/history"><Icon name="chart" size={16} /> Score history</Link></p>
    </>
  );
}
