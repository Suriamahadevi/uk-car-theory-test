import { useNavigate } from 'react-router-dom';
import { setState, useAppData } from '../store/store';
import { REVISION_CARDS, type RevisionCard } from '../data/revision';
import { ALL_QUESTIONS, questionStats, topicStats } from '../engine/bank';
import { TOPIC_MAP } from '../data/topics';
import { startSession } from '../store/actions';
import { shuffle } from '../engine/random';
import { SIGNS, type SignCategory } from '../data/signs';
import SignImage from '../components/SignImage';
import type { AppData } from '../types';

const STOP = [[20, 6, 6], [30, 9, 14], [40, 12, 24], [50, 15, 38], [60, 18, 55], [70, 21, 75]];

function StoppingDiagram() {
  const scale = 5.2;
  return (
    <svg className="app-chart" viewBox="0 0 620 230" role="img" aria-label="Stopping distances: 20 mph 12 metres, 30 mph 23, 40 mph 36, 50 mph 53, 60 mph 73, 70 mph 96 metres">
      {STOP.map(([mph, t, b], i) => (
        <g key={mph} transform={`translate(0 ${10 + i * 34})`}>
          <text x="0" y="17">{mph} mph</text>
          <rect x="60" y="2" width={t * scale} height="22" fill="#1d70b8" />
          <rect x={60 + t * scale} y="2" width={b * scale} height="22" fill="#d4351c" />
          <text x={66 + (t + b) * scale} y="17" style={{ fontWeight: 700 }}>{t + b} m</text>
        </g>
      ))}
      <g transform="translate(60 218)"><rect width="12" height="10" fill="#1d70b8" /><text x="16" y="9">Thinking distance</text><rect x="150" width="12" height="10" fill="#d4351c" /><text x="166" y="9">Braking distance</text></g>
    </svg>
  );
}

function SpeedTable() {
  const rows = [['Built-up area', '30*', '30*'], ['Single carriageway', '60', '50'], ['Dual carriageway', '70', '60'], ['Motorway', '70', '60']];
  return (
    <table className="govuk-table">
      <caption className="govuk-table__caption govuk-table__caption--s">National speed limits (mph)</caption>
      <thead className="govuk-table__head"><tr className="govuk-table__row"><th className="govuk-table__header">Road</th><th className="govuk-table__header govuk-table__header--numeric">Car</th><th className="govuk-table__header govuk-table__header--numeric">Car towing</th></tr></thead>
      <tbody className="govuk-table__body">{rows.map((r) => <tr className="govuk-table__row" key={r[0]}><th className="govuk-table__header" scope="row">{r[0]}</th><td className="govuk-table__cell govuk-table__cell--numeric">{r[1]}</td><td className="govuk-table__cell govuk-table__cell--numeric">{r[2]}</td></tr>)}</tbody>
      <tfoot><tr><td colSpan={3} className="govuk-body-s">* Unless signs show otherwise. Most restricted roads in Wales default to 20 mph.</td></tr></tfoot>
    </table>
  );
}

function CrossingTable() {
  const rows = [['Zebra', 'Pedestrians', 'Flashing amber beacons, black and white stripes'], ['Pelican', 'Pedestrians', 'Flashing amber phase after red'], ['Puffin', 'Pedestrians', 'Sensors; no flashing amber'], ['Toucan', 'Pedestrians and cyclists', 'Lights; no flashing amber'], ['Equestrian (Pegasus)', 'Horse riders', 'High-level push buttons'], ['Parallel', 'Pedestrians and cyclists', 'Zebra next to a cycle crossing']];
  return (
    <div className="app-table-scroll">
      <table className="govuk-table">
        <thead className="govuk-table__head"><tr className="govuk-table__row"><th className="govuk-table__header">Crossing</th><th className="govuk-table__header">Who uses it</th><th className="govuk-table__header">How to recognise it</th></tr></thead>
        <tbody className="govuk-table__body">{rows.map((r) => <tr className="govuk-table__row" key={r[0]}>{r.map((c, i) => (i === 0 ? <th key={i} className="govuk-table__header" scope="row">{c}</th> : <td key={i} className="govuk-table__cell">{c}</td>))}</tr>)}</tbody>
      </table>
    </div>
  );
}

function StudsDiagram() {
  const lanes = [100, 180, 260];
  return (
    <svg className="app-chart" viewBox="0 0 420 170" role="img" aria-label="Motorway studs: red on the left edge, white between lanes, amber by the central reservation, green at slip roads">
      <rect x="40" y="10" width="320" height="150" fill="#505a5f" />
      <rect x="0" y="10" width="40" height="150" fill="#6b8e4e" />
      <rect x="360" y="10" width="60" height="150" fill="#b1b4b6" />
      {[30, 70, 110, 150].map((y) => (
        <g key={y}>
          <circle cx="58" cy={y} r="6" fill="#d4351c" />
          {lanes.map((x) => <circle key={x} cx={x + 40} cy={y} r="5" fill="#fff" />)}
          <circle cx="345" cy={y} r="6" fill="#ffbf47" />
        </g>
      ))}
      <text x="4" y="24" style={{ fill: '#fff', fontWeight: 700 }}>Left</text>
      <text x="364" y="24" style={{ fontWeight: 700 }}>Central</text>
      <text x="364" y="40" style={{ fontWeight: 700 }}>reservation</text>
      <text x="66" y="168" style={{ fill: '#fff', fontSize: 11 }}>Red</text><text x="150" y="168" style={{ fill: '#fff', fontSize: 11 }}>White</text><text x="320" y="168" style={{ fill: '#fff', fontSize: 11 }}>Amber</text>
    </svg>
  );
}

function LightsDiagram() {
  const steps: [string, string[]][] = [['Red: stop', ['#d4351c', '#333', '#333']], ['Red and amber: stop, get ready', ['#d4351c', '#ffbf47', '#333']], ['Green: go if clear', ['#333', '#333', '#00703c']], ['Amber: stop if safe to', ['#333', '#ffbf47', '#333']]];
  return (
    <svg className="app-chart" viewBox="0 0 600 150" role="img" aria-label="Traffic light sequence: red, red and amber, green, amber, then red again">
      {steps.map(([label, cols], i) => (
        <g key={i} transform={`translate(${20 + i * 148} 0)`}>
          <rect x="30" y="4" width="40" height="110" rx="6" fill="#0b0c0c" />
          {cols.map((c, k) => <circle key={k} cx="50" cy={24 + k * 35} r="13" fill={c} />)}
          <text x="50" y="134" textAnchor="middle" style={{ fontSize: 11 }}>{label.split(':')[0]}</text>
          <text x="50" y="147" textAnchor="middle" style={{ fontSize: 10 }}>{label.split(':')[1]}</text>
        </g>
      ))}
    </svg>
  );
}

function MarkingsDiagram() {
  const rows: [string, React.ReactElement][] = [
    ['Lane line (short lines, long gaps)', <path d="M0 10 H600" stroke="#fff" strokeWidth="5" strokeDasharray="20 40" />],
    ['Hazard warning line (long lines, short gaps)', <path d="M0 10 H600" stroke="#fff" strokeWidth="5" strokeDasharray="60 15" />],
    ['Double white – solid on your side: do not cross', <><path d="M0 4 H600" stroke="#fff" strokeWidth="4" strokeDasharray="40 20" /><path d="M0 16 H600" stroke="#fff" strokeWidth="4" /></>],
    ['Double yellow – no waiting at any time', <><path d="M0 5 H600" stroke="#ffdd00" strokeWidth="4" /><path d="M0 15 H600" stroke="#ffdd00" strokeWidth="4" /></>],
  ];
  return (
    <svg className="app-chart" viewBox="0 0 600 200" role="img" aria-label="Road markings: lane line, hazard warning line, double white lines with solid line nearest, double yellow lines">
      {rows.map(([label, el], i) => (
        <g key={i} transform={`translate(0 ${i * 50})`}>
          <rect x="0" y="0" width="600" height="46" fill="#505a5f" />
          <g transform="translate(0 6)">{el}</g>
          <text x="8" y="40" style={{ fill: '#fff', fontSize: 13 }}>{label}</text>
        </g>
      ))}
    </svg>
  );
}

function SignGallery() {
  const groups: [SignCategory, string][] = [['warning', 'Warning signs'], ['priority', 'Stop and give way'], ['prohibitive', 'Orders – you must NOT'], ['mandatory', 'Orders – you MUST'], ['info', 'Information']];
  return (
    <>
      {groups.map(([cat, title]) => (
        <div key={cat}>
          <h4 className="govuk-heading-s">{title}</h4>
          <div className="app-sign-gallery">
            {SIGNS.filter((s) => s.category === cat).map((s) => (
              <figure key={s.id}><SignImage id={s.id} label={s.meaning} /><figcaption>{s.meaning}</figcaption></figure>
            ))}
          </div>
        </div>
      ))}
    </>
  );
}

const VISUALS = { stopping: StoppingDiagram, speed: SpeedTable, signs: SignGallery, crossings: CrossingTable, studs: StudsDiagram, lights: LightsDiagram, markings: MarkingsDiagram };

function quickQuestions(card: RevisionCard, data: AppData): string[] {
  const st = questionStats(data.attempts);
  const pool = card.qids
    ? card.qids
    : ALL_QUESTIONS.filter((q) => !q.verify && q.tags.some((t) => card.tags!.includes(t))).map((q) => q.id);
  const qs = ALL_QUESTIONS.filter((q) => pool.includes(q.id));
  const ordered = shuffle(qs).sort((a, b) => {
    const sa = st[a.id], sb = st[b.id];
    const score = (s?: { lastCorrect: boolean | null }) => (s?.lastCorrect === false ? 0 : !s ? 1 : 2);
    return score(sa) - score(sb);
  });
  const seen = new Set<string>();
  return ordered.filter((q) => { const k = q.ruleKey ?? q.id; if (seen.has(k)) return false; seen.add(k); return true; }).slice(0, 3).map((q) => q.id);
}

export default function RevisionPage() {
  const data = useAppData();
  const nav = useNavigate();
  const ts = topicStats(data);
  const acc = (c: RevisionCard) => ts[c.topic].accuracy;
  const isWeak = (c: RevisionCard) => { const a = acc(c); return a !== null && a < 0.86; };
  const cards = [...REVISION_CARDS].sort((a, b) => {
    const da = data.revisionCardsDone[a.id] ? 1 : 0, db = data.revisionCardsDone[b.id] ? 1 : 0;
    if (da !== db) return da - db;
    return (acc(a) ?? 0.75) - (acc(b) ?? 0.75);
  });
  const done = REVISION_CARDS.filter((c) => data.revisionCardsDone[c.id]).length;

  const check = (c: RevisionCard) => {
    startSession({ title: `Quick check: ${c.title}`, mode: 'quick', qids: quickQuestions(c, data), returnTo: '/revision' });
    nav('/session');
  };

  return (
    <>
      <h1 className="govuk-heading-xl">Revision centre – exam tomorrow</h1>
      <p className="govuk-body-l">Short revision cards covering the rules that come up most often. Cards for your weakest topics are shown first.</p>
      <p className="govuk-body">{done} of {REVISION_CARDS.length} cards revised. Each card has a 3-question quick check.</p>
      <nav aria-label="Revision cards">
        <ul className="govuk-list">
          {cards.map((c) => (
            <li key={c.id}><a className="govuk-link" href={`#card-${c.id}`} onClick={(e) => { e.preventDefault(); document.getElementById(`card-${c.id}`)?.scrollIntoView(); }}>{c.title}</a>{data.revisionCardsDone[c.id] ? ' ✓' : ''}{isWeak(c) ? ' – weak topic' : ''}</li>
          ))}
        </ul>
      </nav>

      {cards.map((c) => {
        const V = c.visual ? VISUALS[c.visual] : null;
        const doneAt = data.revisionCardsDone[c.id];
        return (
          <section key={c.id} id={`card-${c.id}`} className={`app-revision-card${doneAt ? ' is-done' : isWeak(c) ? ' is-weak' : ''}`}>
            <span className="govuk-caption-m">{TOPIC_MAP[c.topic].title}{isWeak(c) ? ` · your accuracy ${Math.round(acc(c)! * 100)}%` : ''}</span>
            <h2 className="govuk-heading-m">{c.title}</h2>
            <ul className="govuk-list govuk-list--bullet">{c.points.map((p) => <li key={p}>{p}</li>)}</ul>
            <div className="app-trick"><strong>Memory trick:</strong> {c.trick}</div>
            {V && <V />}
            <div className="app-actions">
              <button type="button" className="govuk-button" onClick={() => check(c)}>Quick check (3 questions)</button>
              <button type="button" className="govuk-button govuk-button--secondary" onClick={() => setState((s) => {
                const next = { ...s.revisionCardsDone };
                if (next[c.id]) delete next[c.id]; else next[c.id] = Date.now();
                return { ...s, revisionCardsDone: next };
              })}>
                {doneAt ? 'Mark as not revised' : 'Mark as revised'}
              </button>
            </div>
          </section>
        );
      })}
    </>
  );
}
