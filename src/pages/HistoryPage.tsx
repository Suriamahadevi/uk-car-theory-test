import { Link } from 'react-router-dom';
import PageHead from '../components/PageHead';
import { useAppData } from '../store/store';
import { ScoreChart } from '../components/Charts';
import { PASS_MARK } from '../store/actions';
import { fmtDate, fmtDuration } from '../util';

export default function HistoryPage() {
  const data = useAppData();
  const mocks = [...data.mocks].reverse();
  const hp = [...data.hazard].reverse();
  const learnSessions = new Set(data.attempts.filter((a) => a.mode !== 'mock').map((a) => a.sessionId)).size;

  return (
    <>
      <PageHead eyebrow="Progress" title="Test history" lead="Every result is kept on this device." />
      <p className="govuk-body app-muted">{data.mocks.length} mock tests · {data.hazard.length} hazard perception attempts · {learnSessions} practice and revision sessions · {data.attempts.length} answers recorded.</p>

      <h2 className="govuk-heading-l">Multiple-choice mock tests</h2>
      <ScoreChart label="Mock test scores over time" pass={PASS_MARK} scores={data.mocks.map((m) => ({ score: m.score, date: fmtDate(m.finishedAt, true) }))} />
      {mocks.length === 0 ? (
        <p className="govuk-body">No mock tests yet. <Link className="govuk-link" to="/mock">Take a mock test</Link>.</p>
      ) : (
        <div className="app-table-scroll">
          <table className="govuk-table">
            <caption className="govuk-table__caption govuk-table__caption--s">Newest first</caption>
            <thead className="govuk-table__head"><tr className="govuk-table__row">
              <th className="govuk-table__header">#</th><th className="govuk-table__header">Date</th><th className="govuk-table__header">Score</th><th className="govuk-table__header">Result</th><th className="govuk-table__header">Time taken</th><th className="govuk-table__header">Revised</th><th className="govuk-table__header"><span className="govuk-visually-hidden">Action</span></th>
            </tr></thead>
            <tbody className="govuk-table__body">
              {mocks.map((m, i) => (
                <tr className="govuk-table__row" key={m.id}>
                  <td className="govuk-table__cell">{mocks.length - i}</td>
                  <td className="govuk-table__cell">{fmtDate(m.finishedAt)}</td>
                  <td className="govuk-table__cell">{m.score}/{m.total} ({Math.round((m.score / m.total) * 100)}%)</td>
                  <td className="govuk-table__cell"><strong className={`govuk-tag ${m.passed ? 'govuk-tag--green' : 'govuk-tag--red'}`}>{m.passed ? 'Pass' : 'Fail'}</strong></td>
                  <td className="govuk-table__cell app-nowrap">{fmtDuration(m.durationMs)}</td>
                  <td className="govuk-table__cell">{m.revisionCompleted ? 'Yes' : 'No'}</td>
                  <td className="govuk-table__cell"><Link className="govuk-link" to={`/mock/results/${m.id}`}>Results<span className="govuk-visually-hidden"> for test {mocks.length - i}</span></Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h2 className="govuk-heading-l">Hazard perception practice</h2>
      <ScoreChart label="Hazard perception full-test scores" pass={44} max={75} scores={data.hazard.filter((h) => h.full).map((h) => ({ score: h.score, date: fmtDate(h.at, true) }))} />
      {hp.length === 0 ? (
        <p className="govuk-body">No hazard perception attempts yet. <Link className="govuk-link" to="/hazard">Try hazard perception practice</Link>.</p>
      ) : (
        <div className="app-table-scroll">
          <table className="govuk-table">
            <thead className="govuk-table__head"><tr className="govuk-table__row">
              <th className="govuk-table__header">Date</th><th className="govuk-table__header">Type</th><th className="govuk-table__header">Score</th><th className="govuk-table__header">Result</th>
            </tr></thead>
            <tbody className="govuk-table__body">
              {hp.map((h) => (
                <tr className="govuk-table__row" key={h.id}>
                  <td className="govuk-table__cell">{fmtDate(h.at)}</td>
                  <td className="govuk-table__cell">{h.full ? 'Full simulation (14 clips)' : 'Single clip'}</td>
                  <td className="govuk-table__cell">{h.score}/{h.max}</td>
                  <td className="govuk-table__cell">{h.full ? <strong className={`govuk-tag ${h.passed ? 'govuk-tag--green' : 'govuk-tag--red'}`}>{h.passed ? 'Pass' : 'Fail'}</strong> : '–'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
