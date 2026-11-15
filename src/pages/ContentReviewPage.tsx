import { useMemo, useState } from 'react';
import { ALL_QUESTIONS, sourceLabel } from '../engine/bank';
import { TOPICS, TOPIC_MAP } from '../data/topics';
import type { TopicId } from '../types';
import PageHead from '../components/PageHead';
import QuestionMedia from '../components/QuestionMedia';

const KEYS = 'ABCDEF';

/** Read-only content review: browse, search and filter every question with its source. */
export default function ContentReviewPage() {
  const [topic, setTopic] = useState<TopicId | ''>('');
  const [kind, setKind] = useState('');
  const [query, setQuery] = useState('');
  const [flagged, setFlagged] = useState(false);
  const [limit, setLimit] = useState(25);

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    return ALL_QUESTIONS.filter((x) =>
      (!topic || x.topic === topic) &&
      (!kind || x.kind === kind) &&
      (!flagged || !!x.verify) &&
      (!q || x.id.toLowerCase().includes(q) || x.text.toLowerCase().includes(q) || x.source.ref.toLowerCase().includes(q)));
  }, [topic, kind, query, flagged]);

  return (
    <>
      <PageHead eyebrow="Content" title="Content review" lead="Read-only view of every question, its answer and source. Editing and publishing need the planned admin system." />
      <div className="app-metrics">
        <div className="app-metric"><span className="app-metric__value">{ALL_QUESTIONS.length}</span><span className="app-metric__label">Questions</span></div>
        <div className="app-metric"><span className="app-metric__value">{ALL_QUESTIONS.filter((q) => q.kind === 'generated').length}</span><span className="app-metric__label">Generated from rule data</span></div>
        <div className="app-metric"><span className="app-metric__value">{ALL_QUESTIONS.filter((q) => q.verify).length}</span><span className="app-metric__label">Flagged for verification</span></div>
      </div>
      <div className="govuk-grid-row">
        <div className="govuk-grid-column-one-third govuk-form-group">
          <label className="govuk-label govuk-label--s" htmlFor="cr-q">Search</label>
          <input className="govuk-input" id="cr-q" value={query} onChange={(e) => { setQuery(e.target.value); setLimit(25); }} placeholder="ID, text or source" />
        </div>
        <div className="govuk-grid-column-one-third govuk-form-group">
          <label className="govuk-label govuk-label--s" htmlFor="cr-t">Topic</label>
          <select className="govuk-select" id="cr-t" value={topic} onChange={(e) => { setTopic(e.target.value as TopicId); setLimit(25); }}>
            <option value="">All topics</option>
            {TOPICS.map((t) => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
        </div>
        <div className="govuk-grid-column-one-third govuk-form-group">
          <label className="govuk-label govuk-label--s" htmlFor="cr-k">Type</label>
          <select className="govuk-select" id="cr-k" value={kind} onChange={(e) => { setKind(e.target.value); setLimit(25); }}>
            <option value="">All types</option><option value="standard">Written</option><option value="scenario">Scenario / case study</option><option value="generated">Generated</option>
          </select>
        </div>
      </div>
      <div className="govuk-checkboxes govuk-checkboxes--small govuk-!-margin-bottom-4">
        <div className="govuk-checkboxes__item">
          <input className="govuk-checkboxes__input" id="cr-f" type="checkbox" checked={flagged} onChange={(e) => setFlagged(e.target.checked)} />
          <label className="govuk-label govuk-checkboxes__label" htmlFor="cr-f">Only questions flagged for verification</label>
        </div>
      </div>
      <p className="govuk-body" aria-live="polite">{rows.length} matching question{rows.length === 1 ? '' : 's'}</p>
      {rows.slice(0, limit).map((q) => (
        <details className="govuk-details" key={q.id}>
          <summary className="govuk-details__summary"><span className="govuk-details__summary-text">{q.id} – {q.text}</span></summary>
          <div className="govuk-details__text">
            {q.verify && <div className="app-verify"><strong>Flagged:</strong> {q.verify}</div>}
            <QuestionMedia q={q} compact />
            <ol className="govuk-list">
              {q.options.map((o, i) => (
                <li key={i}><strong>{KEYS[i]}{q.correct.includes(i) ? ' ✓' : ''}</strong> {o} <span className="app-muted">– {q.optionNotes[i]}</span></li>
              ))}
            </ol>
            <p className="govuk-body-s"><strong>Explanation:</strong> {q.explanation}<br /><strong>Rule:</strong> {q.rule}</p>
            <p className="govuk-body-s app-muted">{TOPIC_MAP[q.topic].title} · {q.difficulty} · {q.kind} · {sourceLabel(q)}: {q.source.ref}{q.ruleKey ? ` · rule key ${q.ruleKey}` : ''}</p>
          </div>
        </details>
      ))}
      {rows.length > limit && <button type="button" className="govuk-button govuk-button--secondary" onClick={() => setLimit((l) => l + 50)}>Show more</button>}
    </>
  );
}
