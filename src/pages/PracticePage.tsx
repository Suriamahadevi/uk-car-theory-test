import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppData } from '../store/store';
import { TOPICS } from '../data/topics';
import { ALL_QUESTIONS, buildPractice, weakTopics } from '../engine/bank';
import { startSession } from '../store/actions';
import type { TopicId } from '../types';
import type { PracticeOptions } from '../engine/bank';

export default function PracticePage() {
  const data = useAppData();
  const nav = useNavigate();
  const [topics, setTopics] = useState<TopicId[]>(TOPICS.map((t) => t.id));
  const [count, setCount] = useState(20);
  const [difficulty, setDifficulty] = useState<PracticeOptions['difficulty']>('any');
  const [prefer, setPrefer] = useState<PracticeOptions['prefer']>('unseen');
  const [scenarioOnly, setScenarioOnly] = useState(false);
  const [error, setError] = useState('');

  const toggle = (t: TopicId) => setTopics((ts) => (ts.includes(t) ? ts.filter((x) => x !== t) : [...ts, t]));

  const start = () => {
    if (!topics.length) { setError('Select at least one topic'); return; }
    const qids = buildPractice(data, { topics, count, difficulty, prefer, scenarioOnly });
    if (!qids.length) { setError('No questions match these choices. Try a different difficulty or more topics.'); return; }
    startSession({ title: 'Practice questions', mode: 'learn', qids });
    nav('/session');
  };

  const quick = (title: string, o: PracticeOptions) => {
    startSession({ title, mode: 'learn', qids: buildPractice(data, o) });
    nav('/session');
  };

  return (
    <>
      <h1 className="govuk-heading-xl">Practice questions</h1>
      <p className="govuk-body-l">Learning mode: you see whether you are right straight away, with a full explanation. Wrong answers are saved to your Mistake Book.</p>
      <p className="govuk-body">The question bank has {ALL_QUESTIONS.length} questions. A session never repeats the same rule twice, and questions you have not seen are offered first.</p>

      <h2 className="govuk-heading-m">Quick start</h2>
      <div className="app-actions">
        <button className="govuk-button" type="button" onClick={() => quick('Mixed practice', { topics: TOPICS.map((t) => t.id), count: 20, difficulty: 'any', prefer: 'unseen' })}>20 mixed questions</button>
        <button className="govuk-button govuk-button--secondary" type="button" onClick={() => quick('Weak topics practice', { topics: weakTopics(data).slice(0, 4), count: 20, difficulty: 'any', prefer: 'weak' })}>Focus on weak topics</button>
        <button className="govuk-button govuk-button--secondary" type="button" onClick={() => quick('Real-life scenarios', { topics: TOPICS.map((t) => t.id), count: 20, difficulty: 'any', prefer: 'unseen', scenarioOnly: true })}>Scenario questions</button>
        <button className="govuk-button govuk-button--secondary" type="button" onClick={() => quick('Difficult questions', { topics: TOPICS.map((t) => t.id), count: 20, difficulty: 'hard', prefer: 'unseen' })}>Difficult questions</button>
      </div>

      <h2 className="govuk-heading-m">Build your own session</h2>
      {error && (
        <div className="govuk-error-summary" role="alert">
          <h2 className="govuk-error-summary__title">There is a problem</h2>
          <div className="govuk-error-summary__body"><ul className="govuk-list govuk-error-summary__list"><li><a href="#topics">{error}</a></li></ul></div>
        </div>
      )}
      <div className={`govuk-form-group${error ? ' govuk-form-group--error' : ''}`}>
        <fieldset className="govuk-fieldset" id="topics">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">Topics</legend>
          <p className="govuk-body">
            <button type="button" className="govuk-button govuk-button--secondary govuk-!-margin-bottom-0 govuk-!-margin-right-2" onClick={() => setTopics(TOPICS.map((t) => t.id))}>Select all</button>
            <button type="button" className="govuk-button govuk-button--secondary govuk-!-margin-bottom-0" onClick={() => setTopics([])}>Clear</button>
          </p>
          <div className="govuk-checkboxes govuk-checkboxes--small">
            {TOPICS.map((t) => (
              <div className="govuk-checkboxes__item" key={t.id}>
                <input className="govuk-checkboxes__input" id={`t-${t.id}`} type="checkbox" checked={topics.includes(t.id)} onChange={() => { toggle(t.id); setError(''); }} />
                <label className="govuk-label govuk-checkboxes__label" htmlFor={`t-${t.id}`}>{t.number}. {t.title}</label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="count">Number of questions</label>
        <select className="govuk-select" id="count" value={count} onChange={(e) => setCount(Number(e.target.value))}>
          {[10, 20, 30, 50].map((n) => <option key={n} value={n}>{n}</option>)}
        </select>
      </div>

      <div className="govuk-form-group">
        <label className="govuk-label govuk-label--s" htmlFor="diff">Difficulty</label>
        <select className="govuk-select" id="diff" value={difficulty} onChange={(e) => setDifficulty(e.target.value as PracticeOptions['difficulty'])}>
          <option value="any">Mixed</option><option value="easy">Easy</option><option value="medium">Medium</option><option value="hard">Difficult</option>
        </select>
      </div>

      <div className="govuk-form-group">
        <fieldset className="govuk-fieldset">
          <legend className="govuk-fieldset__legend govuk-fieldset__legend--s">Which questions first?</legend>
          <div className="govuk-radios govuk-radios--small">
            {([['unseen', 'Questions I have not answered yet'], ['weak', 'My weakest areas and recent mistakes'], ['random', 'Completely random']] as const).map(([v, l]) => (
              <div className="govuk-radios__item" key={v}>
                <input className="govuk-radios__input" id={`p-${v}`} type="radio" name="prefer" checked={prefer === v} onChange={() => setPrefer(v)} />
                <label className="govuk-label govuk-radios__label" htmlFor={`p-${v}`}>{l}</label>
              </div>
            ))}
          </div>
        </fieldset>
      </div>

      <div className="govuk-form-group">
        <div className="govuk-checkboxes govuk-checkboxes--small">
          <div className="govuk-checkboxes__item">
            <input className="govuk-checkboxes__input" id="scen" type="checkbox" checked={scenarioOnly} onChange={(e) => setScenarioOnly(e.target.checked)} />
            <label className="govuk-label govuk-checkboxes__label" htmlFor="scen">Scenario-based questions only</label>
          </div>
        </div>
      </div>

      <button type="button" className="govuk-button" onClick={start}>Start practice</button>
    </>
  );
}
