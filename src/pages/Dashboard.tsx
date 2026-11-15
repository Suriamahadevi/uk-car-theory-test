import { Link, useNavigate } from 'react-router-dom';
import { useAppData } from '../store/store';
import { buildPractice, dueMistakes, readiness, topicProgress, topicStats, weakTopics } from '../engine/bank';
import { TOPICS, TOPIC_MAP } from '../data/topics';
import { startSession } from '../store/actions';
import { learningStreak } from '../engine/progress';
import { nextMilestone } from '../engine/milestones';
import Icon from '../components/Icon';

export default function Dashboard() {
  const data = useAppData();
  const nav = useNavigate();
  const ts = topicStats(data);
  const isNew = data.attempts.length === 0 && data.mocks.length === 0;
  const nextTopic = TOPICS.find((t) => !topicProgress(data, t.id).complete);
  const open = Object.values(data.mistakes).filter((m) => !m.mastered).length;
  const due = dueMistakes(data).length;
  const latest = data.mocks[data.mocks.length - 1];
  const avg = data.mocks.length ? Math.round(data.mocks.reduce((s, m) => s + m.score, 0) / data.mocks.length) : null;
  const correct = data.attempts.filter((a) => a.correct).length;
  const weak = weakTopics(data).find((t) => ts[t].attempted >= 5 && (ts[t].accuracy ?? 1) < 0.86);
  const ready = readiness(data);
  const milestone = nextMilestone(data);
  const streak = learningStreak(data);

  const quick = () => {
    startSession({ title: '5-minute practice', mode: 'learn', qids: buildPractice(data, { topics: TOPICS.map((t) => t.id), count: 10, difficulty: 'any', prefer: 'smart' }) });
    nav('/session');
  };
  const revise = () => {
    const ids = (due ? dueMistakes(data) : Object.values(data.mistakes).filter((m) => !m.mastered)).map((m) => m.qid);
    if (!ids.length) { nav('/mistakes'); return; }
    startSession({ title: due ? 'Spaced revision – due today' : 'Revise mistakes', mode: 'revision', qids: ids.slice(0, 20), returnTo: '/mistakes' });
    nav('/session');
  };

  return (
    <>
      {data.activeMock && (
        <div className="govuk-notification-banner" role="region" aria-labelledby="resume-title">
          <div className="govuk-notification-banner__header"><h2 className="govuk-notification-banner__title" id="resume-title">Mock test in progress</h2></div>
          <div className="govuk-notification-banner__content">
            <p className="govuk-body govuk-!-margin-bottom-2">The timer is still running.</p>
            <Link className="govuk-notification-banner__link" to="/mock/exam">Return to your mock test</Link>
          </div>
        </div>
      )}

      <section className="app-hero" aria-labelledby="hero-title">
        <p className="app-hero__eyebrow">{isNew ? 'Welcome' : 'Your theory test preparation'}</p>
        <h1 className="app-hero__title" id="hero-title">{isNew ? 'Pass your theory test with confidence' : 'Ready for today’s practice?'}</h1>
        <p className="app-hero__text">
          {isNew
            ? 'Short practice sessions, clear explanations and realistic 50-question mock tests.'
            : latest ? `Latest mock: ${latest.score}/50 · Pass mark 43.` : 'Take a mock test to see where you are.'}
        </p>
        <div className="app-actions govuk-!-margin-bottom-0">
          <Link to="/mock" role="button" className="govuk-button govuk-button--start" draggable="false">
            Start mock test
          </Link>
          {isNew && <button type="button" className="govuk-button govuk-button--secondary" onClick={quick}>Try a 5-minute practice</button>}
        </div>
        {!isNew && <p className="app-hero__meta">Readiness: <strong>{ready.label}</strong> · <Link className="govuk-link" style={{ color: 'var(--on-strong)' }} to="/analytics">See why</Link></p>}
      </section>

      {data.activeSession && !data.activeMock && (
        <p className="govuk-inset-text">Unfinished session: <strong>{data.activeSession.title}</strong>. <Link className="govuk-link" to="/session">Continue</Link></p>
      )}

      <h2 className="govuk-visually-hidden">Next steps</h2>
      <div className="app-tiles">
        <Link className="app-tile" to={nextTopic ? `/topics/${nextTopic.id}` : '/topics'}>
          <span className="app-tile__icon"><Icon name="book" /></span>
          <span className="app-tile__title">Continue learning</span>
          <span className="app-tile__meta">{nextTopic ? nextTopic.title : 'All topics complete'}</span>
        </Link>
        <button type="button" className="app-tile" onClick={revise}>
          <span className="app-tile__icon"><Icon name="alert" /></span>
          <span className="app-tile__title">Revise mistakes</span>
          <span className="app-tile__meta">{due ? `${due} due today` : `${open} to revise`}</span>
        </button>
        <Link className="app-tile" to="/hazard">
          <span className="app-tile__icon"><Icon name="eye" /></span>
          <span className="app-tile__title">Hazard practice</span>
          <span className="app-tile__meta">Click timing and scoring</span>
        </Link>
        <button type="button" className="app-tile" onClick={quick}>
          <span className="app-tile__icon"><Icon name="clock" /></span>
          <span className="app-tile__title">5-minute practice</span>
          <span className="app-tile__meta">10 smart questions</span>
        </button>
      </div>

      {!isNew && (
        <>
          <h2 className="govuk-heading-m">Progress</h2>
          <div className="app-metrics">
            <div className="app-metric"><span className="app-metric__value">{latest ? latest.score : '–'}</span><span className="app-metric__label">Latest mock (of 50)</span></div>
            <div className="app-metric"><span className="app-metric__value">{avg ?? '–'}</span><span className="app-metric__label">Average mock</span></div>
            <div className="app-metric"><span className="app-metric__value">{data.attempts.length ? `${Math.round((correct / data.attempts.length) * 100)}%` : '–'}</span><span className="app-metric__label">Accuracy</span></div>
            <div className="app-metric"><span className="app-metric__value">{streak}</span><span className="app-metric__label">Day streak</span></div>
          </div>
          <div className="app-chips">
            {weak && (
              <Link className="app-chip app-chip--warn" to={`/topics/${weak}`}>
                <span className="app-chip__dot" aria-hidden="true" />Weakest topic: {TOPIC_MAP[weak].title} ({Math.round((ts[weak].accuracy ?? 0) * 100)}%)
              </Link>
            )}
            {milestone && (
              <span className="app-chip app-chip--gold"><span className="app-chip__dot" aria-hidden="true" />Next milestone: {milestone.title} – {milestone.detail.toLowerCase()}</span>
            )}
          </div>
          <p className="govuk-body"><Link className="govuk-link" to="/analytics">View full performance</Link></p>
        </>
      )}

      {isNew && (
        <div className="app-card-grid">
          {[
            ['1. Learn', 'Short notes for all 14 topics, with exam traps.'],
            ['2. Practise', 'Instant feedback. Mistakes are saved and revisited.'],
            ['3. Test', 'Timed 50-question mocks and hazard perception practice.'],
          ].map(([t, d]) => (
            <div className="app-card" key={t}><h3 className="govuk-heading-s">{t}</h3><p className="govuk-body govuk-!-margin-bottom-0">{d}</p></div>
          ))}
        </div>
      )}
    </>
  );
}
