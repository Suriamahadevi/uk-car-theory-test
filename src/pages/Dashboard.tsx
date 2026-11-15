import { Link, useNavigate } from 'react-router-dom';
import { useAppData } from '../store/store';
import { ALL_QUESTIONS, buildPractice, questionStats, topicProgress, topicStats, weakTopics } from '../engine/bank';
import { TOPICS, TOPIC_MAP } from '../data/topics';
import { BarList, ScoreChart } from '../components/Charts';
import { PASS_MARK, startSession } from '../store/actions';
import { fmtDate } from '../util';

export default function Dashboard() {
  const data = useAppData();
  const nav = useNavigate();
  const mocks = data.mocks;
  const tStats = topicStats(data);
  const qStats = questionStats(data.attempts);
  const totalAttempts = data.attempts.length;
  const correct = data.attempts.filter((a) => a.correct).length;
  const mistakes = Object.values(data.mistakes);
  const mastered = mistakes.filter((m) => m.mastered).length;
  const needRevision = mistakes.length - mastered;
  const weak = weakTopics(data).filter((t) => tStats[t].attempted > 0).slice(0, 3);
  const nextTopic = TOPICS.find((t) => !topicProgress(data, t.id, tStats).complete);

  const practiseWeak = () => {
    const topics = weak.length ? weak : weakTopics(data).slice(0, 3);
    startSession({ title: 'Weak topics practice', mode: 'learn', qids: buildPractice(data, { topics, count: 15, difficulty: 'any', prefer: 'weak' }) });
    nav('/session');
  };
  const reviseMistakes = () => {
    const ids = mistakes.filter((m) => !m.mastered).map((m) => m.qid);
    if (!ids.length) { nav('/mistakes'); return; }
    startSession({ title: 'Revise mistakes', mode: 'revision', qids: ids.slice(0, 30), returnTo: '/mistakes' });
    nav('/session');
  };

  const best = mocks.length ? Math.max(...mocks.map((m) => m.score)) : null;
  const avg = mocks.length ? mocks.reduce((s, m) => s + m.score, 0) / mocks.length : null;
  const latest = mocks.length ? mocks[mocks.length - 1] : null;

  return (
    <>
      <h1 className="govuk-heading-xl">Your theory test preparation</h1>
      <p className="govuk-body-l">Practise all 14 topics, learn from every mistake and take realistic 50-question mock tests.</p>

      {data.activeMock && (
        <div className="govuk-notification-banner" role="region" aria-labelledby="resume-title">
          <div className="govuk-notification-banner__header"><h2 className="govuk-notification-banner__title" id="resume-title">Important</h2></div>
          <div className="govuk-notification-banner__content">
            <p className="govuk-notification-banner__heading">You have a mock test in progress. The timer is still running.</p>
            <Link className="govuk-notification-banner__link" to="/mock/exam">Return to your mock test</Link>
          </div>
        </div>
      )}
      {data.activeSession && !data.activeMock && (
        <div className="govuk-inset-text">
          You have an unfinished practice session: <strong>{data.activeSession.title}</strong>. <Link className="govuk-link" to="/session">Continue it</Link>
        </div>
      )}

      <div className="app-actions">
        <Link to="/mock" role="button" className="govuk-button govuk-button--start" draggable="false">
          Start mock test
          <svg className="govuk-button__start-icon" xmlns="http://www.w3.org/2000/svg" width="17.5" height="19" viewBox="0 0 33 40" aria-hidden="true" focusable="false"><path fill="currentColor" d="M0 0h13l20 20-20 20H0l20-20z" /></svg>
        </Link>
        <Link to={nextTopic ? `/topics/${nextTopic.id}` : '/topics'} role="button" className="govuk-button govuk-button--secondary">Continue learning{nextTopic ? `: ${nextTopic.title}` : ''}</Link>
        <button type="button" className="govuk-button govuk-button--secondary" onClick={reviseMistakes}>Revise mistakes ({needRevision})</button>
        <button type="button" className="govuk-button govuk-button--secondary" onClick={practiseWeak}>Practise weak topics</button>
        <Link to="/hazard" role="button" className="govuk-button govuk-button--secondary">Hazard perception practice</Link>
      </div>

      <h2 className="govuk-heading-l">Your progress</h2>
      <div className="app-stats">
        <div className="app-stat"><span className="app-stat__value">{mocks.length}</span><span className="app-stat__label">Mock tests completed</span></div>
        <div className="app-stat app-stat--green"><span className="app-stat__value">{best ?? '–'}{best !== null && '/50'}</span><span className="app-stat__label">Highest score</span></div>
        <div className="app-stat"><span className="app-stat__value">{avg !== null ? avg.toFixed(1) : '–'}</span><span className="app-stat__label">Average score</span></div>
        <div className={`app-stat ${latest ? (latest.passed ? 'app-stat--green' : 'app-stat--red') : ''}`}><span className="app-stat__value">{latest ? `${latest.score}/50` : '–'}</span><span className="app-stat__label">Latest score</span></div>
        <div className="app-stat"><span className="app-stat__value">{totalAttempts}</span><span className="app-stat__label">Questions attempted ({Object.keys(qStats).length} of {ALL_QUESTIONS.length} different)</span></div>
        <div className="app-stat"><span className="app-stat__value">{totalAttempts ? `${Math.round((correct / totalAttempts) * 100)}%` : '–'}</span><span className="app-stat__label">Overall accuracy</span></div>
        <div className="app-stat app-stat--green"><span className="app-stat__value">{mastered}</span><span className="app-stat__label">Mistakes mastered</span></div>
        <div className="app-stat app-stat--yellow"><span className="app-stat__value">{needRevision}</span><span className="app-stat__label">Still need revision</span></div>
      </div>

      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-half">
          <h2 className="govuk-heading-m">Mock test scores over time</h2>
          <ScoreChart label="Mock test scores" pass={PASS_MARK} scores={mocks.map((m) => ({ score: m.score, date: fmtDate(m.finishedAt, true) }))} />
          {weak.length > 0 && (
            <>
              <h2 className="govuk-heading-m">Topics you get wrong most</h2>
              <ol className="govuk-list govuk-list--number">
                {weak.map((t) => (
                  <li key={t}><Link className="govuk-link" to={`/topics/${t}`}>{TOPIC_MAP[t].title}</Link> – {Math.round((tStats[t].accuracy ?? 0) * 100)}% correct</li>
                ))}
              </ol>
            </>
          )}
        </div>
        <div className="govuk-grid-column-one-half">
          <h2 className="govuk-heading-m">Accuracy by topic</h2>
          <BarList rows={TOPICS.map((t) => ({ label: `${t.number}. ${t.title}`, value: tStats[t.id].accuracy }))} />
        </div>
      </div>

      <h2 className="govuk-heading-m">Recent mock tests</h2>
      {mocks.length === 0 ? (
        <p className="govuk-body">You have not taken a mock test yet. <Link className="govuk-link" to="/mock">Start your first mock test</Link>.</p>
      ) : (
        <div className="app-table-scroll">
          <table className="govuk-table">
            <thead className="govuk-table__head"><tr className="govuk-table__row">
              <th className="govuk-table__header">Date</th><th className="govuk-table__header">Score</th><th className="govuk-table__header">Result</th><th className="govuk-table__header"><span className="govuk-visually-hidden">Action</span></th>
            </tr></thead>
            <tbody className="govuk-table__body">
              {[...mocks].reverse().slice(0, 5).map((m) => (
                <tr className="govuk-table__row" key={m.id}>
                  <td className="govuk-table__cell">{fmtDate(m.finishedAt)}</td>
                  <td className="govuk-table__cell">{m.score}/{m.total}</td>
                  <td className="govuk-table__cell"><strong className={`govuk-tag ${m.passed ? 'govuk-tag--green' : 'govuk-tag--red'}`}>{m.passed ? 'Pass' : 'Fail'}</strong></td>
                  <td className="govuk-table__cell"><Link className="govuk-link" to={`/mock/results/${m.id}`}>View results</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  );
}
