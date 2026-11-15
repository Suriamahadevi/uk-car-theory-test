import { Link } from 'react-router-dom';
import { useAppData } from '../store/store';
import { TOPICS } from '../data/topics';
import { topicProgress, topicStats } from '../engine/bank';
import { ProgressBar } from '../components/Charts';

export default function TopicsPage() {
  const data = useAppData();
  const st = topicStats(data);
  const done = TOPICS.filter((t) => topicProgress(data, t.id, st).complete).length;
  return (
    <>
      <h1 className="govuk-heading-xl">Learn by topic</h1>
      <p className="govuk-body-l">The car theory test covers 14 topic areas. You have completed {done} of 14.</p>
      <p className="govuk-body">
        A topic is marked complete when you have read its revision notes <strong>and</strong> answered at least 80% of its practice questions.
      </p>
      <div className="app-card-grid">
        {TOPICS.map((t) => {
          const p = topicProgress(data, t.id, st);
          const s = st[t.id];
          const weak = s.accuracy !== null && s.accuracy < 0.7;
          return (
            <div key={t.id} className={`app-card${p.complete ? ' app-card--done' : weak ? ' app-card--weak' : ''}`}>
              <h2 className="govuk-heading-s">{t.number}. <Link className="govuk-link" to={`/topics/${t.id}`}>{t.title}</Link></h2>
              <p className="govuk-body-s">{t.summary}</p>
              <div className="app-card__foot">
                <ProgressBar percent={p.percent} green={p.complete} label={`${t.title} progress`} />
                <p className="govuk-body-s govuk-!-margin-bottom-0">
                  {p.complete ? <strong className="govuk-tag govuk-tag--green">Complete</strong> : p.percent > 0 ? <strong className="govuk-tag govuk-tag--blue">In progress</strong> : <strong className="govuk-tag govuk-tag--grey">Not started</strong>}{' '}
                  {s.uniqueAttempted}/{s.total} questions · Accuracy {s.accuracy === null ? '–' : `${Math.round(s.accuracy * 100)}%`}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}
