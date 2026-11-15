import { Link, useNavigate } from 'react-router-dom';
import { useAppData } from '../../store/store';
import { ALL_QUESTIONS, QMAP, buildPractice, missedConcepts, readiness, topicStats } from '../../engine/bank';
import { startSession, PASS_MARK } from '../../store/actions';
import { TOPICS } from '../../data/topics';
import { BarList, ProgressBar, ScoreChart } from '../../components/Charts';
import { dailyAccuracy, hazardAverage, learningStreak } from '../../engine/progress';
import { milestones } from '../../engine/milestones';
import Tabs from '../../components/Tabs';
import PageHead from '../../components/PageHead';
import { fmtDate } from '../../util';

export default function AnalyticsPage() {
  const data = useAppData();
  const nav = useNavigate();
  const st = topicStats(data);
  const ready = readiness(data);
  const concepts = missedConcepts(data).slice(0, 12);
  const days = dailyAccuracy(data, 14);
  const hpAvg = hazardAverage(data);
  const ms = milestones(data);
  const readyColour = { ready: 'var(--success)', nearly: 'var(--teal)', building: 'var(--warning)', 'not-ready': 'var(--error)' }[ready.level];
  const byDiff = (['easy', 'medium', 'hard'] as const).map((d) => {
    const as = data.attempts.filter((a) => QMAP[a.qid]?.difficulty === d);
    return { label: d[0].toUpperCase() + d.slice(1), value: as.length ? as.filter((a) => a.correct).length / as.length : null };
  });
  const practiseTag = (tag: string) => {
    startSession({ title: `Concept: ${tag.replace(/-/g, ' ')}`, mode: 'learn', qids: buildPractice(data, { topics: TOPICS.map((t) => t.id), count: 10, difficulty: 'any', prefer: 'smart', tags: [tag] }), returnTo: '/analytics' });
    nav('/session');
  };

  const overview = (
    <>
      <div className="app-readiness" style={{ borderLeftColor: readyColour }}>
        <h2 className="govuk-heading-m govuk-!-margin-bottom-2">Readiness: {ready.label}</h2>
        <p className="govuk-body-s app-muted">Based on consistent recent performance. No practice platform can guarantee a pass.</p>
        <ul className="app-status-list">
          {ready.checks.map((c) => (
            <li key={c.label}>
              <strong className={`govuk-tag ${c.ok ? 'govuk-tag--green' : 'govuk-tag--grey'}`}>{c.ok ? 'Met' : 'Not yet'}</strong>
              <span>{c.label}<br /><span className="govuk-body-s app-muted">{c.detail}</span></span>
            </li>
          ))}
        </ul>
      </div>
      <div className="app-metrics">
        <div className="app-metric"><span className="app-metric__value">{data.mocks.length}</span><span className="app-metric__label">Mock tests</span></div>
        <div className="app-metric"><span className="app-metric__value">{data.mocks.length ? Math.max(...data.mocks.map((m) => m.score)) : '–'}</span><span className="app-metric__label">Highest mock</span></div>
        <div className="app-metric"><span className="app-metric__value">{hpAvg === null ? '–' : hpAvg.toFixed(0)}</span><span className="app-metric__label">Hazard average /75</span></div>
        <div className="app-metric"><span className="app-metric__value">{learningStreak(data)}</span><span className="app-metric__label">Day streak</span></div>
      </div>
      <h2 className="govuk-heading-m">Mock scores</h2>
      <ScoreChart label="Mock test scores" pass={PASS_MARK} scores={data.mocks.map((m) => ({ score: m.score, date: fmtDate(m.finishedAt, true) }))} />
      <h2 className="govuk-heading-m">Readiness trend</h2>
      {days.length ? <BarList rows={days.map((d) => ({ label: `${new Date(d.day).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} (${d.answers})`, value: d.accuracy }))} /> : <p className="govuk-body">Answer some questions to see your daily accuracy.</p>}
    </>
  );

  const topics = (
    <>
      <BarList rows={[...TOPICS].sort((a, b) => (st[a.id].accuracy ?? 2) - (st[b.id].accuracy ?? 2)).map((t) => ({ label: `${t.title} (${st[t.id].attempted})`, value: st[t.id].accuracy }))} />
      <h2 className="govuk-heading-m">By difficulty</h2>
      <BarList rows={byDiff} />
    </>
  );

  const conceptTab = concepts.length === 0 ? <p className="govuk-body">No missed concepts yet.</p> : (
    <div className="app-table-scroll">
      <table className="govuk-table">
        <thead className="govuk-table__head"><tr className="govuk-table__row"><th className="govuk-table__header">Concept</th><th className="govuk-table__header govuk-table__header--numeric">Wrong</th><th className="govuk-table__header govuk-table__header--numeric">Accuracy</th><th className="govuk-table__header"><span className="govuk-visually-hidden">Action</span></th></tr></thead>
        <tbody className="govuk-table__body">
          {concepts.map((c) => (
            <tr className="govuk-table__row" key={c.tag}>
              <td className="govuk-table__cell">{c.tag.replace(/-/g, ' ')}</td>
              <td className="govuk-table__cell govuk-table__cell--numeric">{c.wrong}</td>
              <td className="govuk-table__cell govuk-table__cell--numeric">{Math.round((1 - c.wrong / c.total) * 100)}%</td>
              <td className="govuk-table__cell"><button type="button" className="govuk-button govuk-button--secondary govuk-!-margin-bottom-0" onClick={() => practiseTag(c.tag)}>Practise<span className="govuk-visually-hidden"> {c.tag}</span></button></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const milestoneTab = (
    <ul className="app-status-list">
      {ms.map((m) => (
        <li key={m.id} style={{ display: 'block' }}>
          <strong>{m.done ? '✓ ' : ''}{m.title}</strong> <span className="app-muted">– {m.detail}</span>
          <ProgressBar percent={Math.round(m.progress * 100)} green={m.done} label={`${m.title} progress`} />
        </li>
      ))}
    </ul>
  );

  return (
    <>
      <PageHead eyebrow="Progress" title="Performance" lead={`Based on ${data.attempts.length} answers to ${new Set(data.attempts.map((a) => a.qid)).size} of ${ALL_QUESTIONS.length} questions.`} />
      <Tabs label="Performance sections" tabs={[
        { label: 'Overview', content: overview },
        { label: 'Topics', content: topics },
        { label: 'Missed concepts', content: conceptTab },
        { label: 'Milestones', content: milestoneTab },
      ]} />
      <p className="govuk-body"><Link className="govuk-link" to="/history">Full test history</Link></p>
    </>
  );
}
