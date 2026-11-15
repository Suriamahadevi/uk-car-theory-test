import { Link, useNavigate } from 'react-router-dom';
import { setState, useAppData } from '../store/store';
import { CLIPS, HP_MAX, HP_PASS } from '../data/hazardClips';
import { buildPractice } from '../engine/bank';
import { startSession } from '../store/actions';

function ScoringDiagram() {
  const shades = ['#00703c', '#4c9a6a', '#85b894', '#b9d6c0', '#e0eee4'];
  return (
    <svg className="app-chart" viewBox="0 0 620 110" role="img" aria-label="Scoring window: clicking early in the window scores 5, then 4, 3, 2, 1. Before the window or after it scores 0.">
      <rect x="0" y="30" width="120" height="40" fill="#f3f2f1" stroke="#b1b4b6" />
      <text x="60" y="55" textAnchor="middle">0 – too early</text>
      {shades.map((c, i) => (
        <g key={i}>
          <rect x={120 + i * 76} y="30" width="76" height="40" fill={c} stroke="#fff" />
          <text x={158 + i * 76} y="55" textAnchor="middle" style={{ fontWeight: 700, fill: i < 2 ? '#fff' : '#0b0c0c' }}>{5 - i}</text>
        </g>
      ))}
      <rect x="500" y="30" width="120" height="40" fill="#f3f2f1" stroke="#b1b4b6" />
      <text x="560" y="55" textAnchor="middle">0 – too late</text>
      <text x="120" y="20">Hazard starts to develop</text>
      <text x="500" y="95" textAnchor="end">Time →</text>
    </svg>
  );
}

export default function HazardPage() {
  const data = useAppData();
  const nav = useNavigate();
  const fulls = data.hazard.filter((h) => h.full);
  const best = fulls.length ? Math.max(...fulls.map((h) => h.score)) : null;
  const clipBest = (id: string) => {
    const scores = data.hazard.flatMap((h) => h.clips.filter((c) => c.clipId === id).map((c) => c.score));
    return scores.length ? Math.max(...scores) : null;
  };

  return (
    <>
      <h1 className="govuk-heading-xl">Hazard perception</h1>
      <div className="govuk-warning-text">
        <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
        <strong className="govuk-warning-text__text">
          <span className="govuk-visually-hidden">Warning</span>
          The clips on this page are simulations drawn as animated diagrams. They are not real DVSA hazard perception video clips and are not the same as the real test. Use them to learn timing, and also practise with official video clips.
        </strong>
      </div>

      <h2 className="govuk-heading-l">How the real test works</h2>
      <ul className="govuk-list govuk-list--bullet">
        <li>14 video clips showing everyday road scenes, filmed from a driver's point of view.</li>
        <li>15 developing hazards in total – 13 clips have one, and one clip has two.</li>
        <li>Up to 5 points for each developing hazard, so the maximum is {HP_MAX}.</li>
        <li>The pass mark is {HP_PASS} out of {HP_MAX}. You must pass both parts of the theory test at the same sitting.</li>
        <li>You cannot review or change your clicks after a clip ends.</li>
      </ul>

      <h2 className="govuk-heading-m">Potential hazard or developing hazard?</h2>
      <dl className="govuk-summary-list">
        <div className="govuk-summary-list__row"><dt className="govuk-summary-list__key">Potential hazard</dt><dd className="govuk-summary-list__value">Something that <em>could</em> become a problem, for example a parked car, a junction ahead, or a pedestrian on the pavement. It does not score.</dd></div>
        <div className="govuk-summary-list__row"><dt className="govuk-summary-list__key">Developing hazard</dt><dd className="govuk-summary-list__value">Something that is actually developing and <em>would make you take action</em>, such as slowing down, stopping or changing direction. This is what scores points.</dd></div>
      </dl>

      <h2 className="govuk-heading-m">When to click</h2>
      <p className="govuk-body">Click as soon as you see something start to develop into a hazard – for example, the car at the junction starts to move, or the pedestrian turns towards the road. The earlier you click inside the scoring window, the more points you get.</p>
      <ScoringDiagram />
      <p className="govuk-body">Tip: click once when you first notice the clue, and once more as it develops. Two or three well-timed clicks per hazard is sensible.</p>

      <h2 className="govuk-heading-m">Why constant clicking is not allowed</h2>
      <p className="govuk-body">The test checks whether you are really spotting hazards. If you click continuously, very rapidly, or in a regular rhythm, the clip scores zero. This simulation uses a similar rule: more than 15 clicks, 5 clicks within 3 seconds, or clicks at a steady rhythm score zero.</p>

      <h2 className="govuk-heading-l">Practise</h2>
      <div className="app-actions">
        <Link to="/hazard/test" className="govuk-button">Full simulation: 14 clips</Link>
        <button type="button" className="govuk-button govuk-button--secondary" onClick={() => { startSession({ title: 'Hazard awareness questions', mode: 'learn', qids: buildPractice(data, { topics: ['hazard-awareness'], count: 15, difficulty: 'any', prefer: 'unseen' }), returnTo: '/hazard' }); nav('/session'); }}>
          Hazard awareness questions
        </button>
        {!data.hazardLessonsDone ? (
          <button type="button" className="govuk-button govuk-button--secondary" onClick={() => setState((s) => ({ ...s, hazardLessonsDone: true }))}>I understand how scoring works</button>
        ) : <strong className="govuk-tag govuk-tag--green">Lessons read</strong>}
      </div>
      {best !== null && <p className="govuk-body">Best full simulation score: <strong>{best}/{HP_MAX}</strong> ({fulls.length} attempt{fulls.length === 1 ? '' : 's'}).</p>}

      <h3 className="govuk-heading-m">Individual practice clips (with feedback after each)</h3>
      <table className="govuk-table">
        <thead className="govuk-table__head"><tr className="govuk-table__row"><th className="govuk-table__header">Clip</th><th className="govuk-table__header">Hazards</th><th className="govuk-table__header">Best score</th></tr></thead>
        <tbody className="govuk-table__body">
          {CLIPS.map((c, i) => {
            const b = clipBest(c.id);
            return (
              <tr className="govuk-table__row" key={c.id}>
                <td className="govuk-table__cell"><Link className="govuk-link" to={`/hazard/clip/${c.id}`}>{i + 1}. {c.title}</Link></td>
                <td className="govuk-table__cell">{c.hazards.length}</td>
                <td className="govuk-table__cell">{b === null ? 'Not tried' : `${b}/${c.hazards.length * 5}`}</td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <h2 className="govuk-heading-m">Official hazard perception resources</h2>
      <ul className="govuk-list govuk-list--bullet">
        <li><a className="govuk-link" href="https://www.gov.uk/theory-test/hazard-perception-test" target="_blank" rel="noreferrer">Hazard perception test – GOV.UK (includes the official explanation video)</a></li>
        <li><a className="govuk-link" href="https://www.gov.uk/take-practice-theory-test" target="_blank" rel="noreferrer">Free official practice theory test – GOV.UK</a></li>
        <li><a className="govuk-link" href="https://www.safedrivingforlife.info/shop/" target="_blank" rel="noreferrer">Official DVSA learning materials with real practice clips – Safe Driving for Life (paid)</a></li>
      </ul>
    </>
  );
}
