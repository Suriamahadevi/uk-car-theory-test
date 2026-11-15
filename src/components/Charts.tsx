/** Small dependency-free SVG charts in GOV.UK colours. */

export function ScoreChart({ scores, pass = 43, max = 50, label }: { scores: { score: number; date: string }[]; pass?: number; max?: number; label: string }) {
  if (scores.length === 0) return <p className="govuk-body">No results yet.</p>;
  const W = 640, H = 240, L = 40, R = 16, T = 16, B = 34;
  const iw = W - L - R, ih = H - T - B;
  const x = (i: number) => L + (scores.length === 1 ? iw / 2 : (i * iw) / (scores.length - 1));
  const y = (v: number) => T + ih - (v / max) * ih;
  const path = scores.map((s, i) => `${i ? 'L' : 'M'}${x(i)} ${y(s.score)}`).join(' ');
  const ticks = [0, Math.round(max / 2), pass, max];
  return (
    <figure className="govuk-!-margin-0">
      <svg className="app-chart" viewBox={`0 0 ${W} ${H}`} role="img" aria-label={`${label}. ${scores.map((s, i) => `Test ${i + 1}: ${s.score} out of ${max}`).join('. ')}`}>
        {ticks.map((t) => (
          <g key={t}>
            <line x1={L} x2={W - R} y1={y(t)} y2={y(t)} style={{ stroke: t === pass ? 'var(--success)' : 'var(--line)' }} strokeDasharray={t === pass ? '6 4' : undefined} strokeWidth={t === pass ? 2 : 1} />
            <text x={L - 6} y={y(t) + 4} textAnchor="end">{t}</text>
          </g>
        ))}
        <text x={W - R} y={y(pass) - 6} textAnchor="end" style={{ fill: 'var(--success)', fontWeight: 700 }}>Pass mark {pass}</text>
        <path d={path} style={{ stroke: 'var(--primary)' }} strokeWidth="3" fill="none" strokeLinecap="round" strokeLinejoin="round" />
        {scores.map((s, i) => (
          <g key={i}>
            <circle cx={x(i)} cy={y(s.score)} r="5" style={{ fill: s.score >= pass ? 'var(--success)' : 'var(--error)', stroke: 'var(--surface)' }} strokeWidth="2" />
            {scores.length <= 12 && <text x={x(i)} y={H - 12} textAnchor="middle">{s.date}</text>}
          </g>
        ))}
      </svg>
      <figcaption className="govuk-body-s app-muted">Green dots passed, red dots did not reach the pass mark.</figcaption>
    </figure>
  );
}

export function BarList({ rows }: { rows: { label: string; value: number | null; suffix?: string }[] }) {
  return (
    <div className="app-bars">
      {rows.map((r) => {
        const v = r.value;
        const color = v === null ? 'var(--input-border)' : v >= 0.86 ? 'var(--success)' : v >= 0.7 ? 'var(--warning)' : 'var(--error)';
        return (
          <div className="app-bar-row" key={r.label}>
            <span>{r.label}</span>
            <span className="app-bar" aria-hidden="true"><span style={{ width: `${Math.round((v ?? 0) * 100)}%`, background: color }} /></span>
            <strong>{v === null ? '–' : `${Math.round(v * 100)}%`}</strong>
          </div>
        );
      })}
      <p className="govuk-body-s app-muted">Green: 86% or more (the pass standard). Amber: 70–85%. Red: below 70%. Grey: not attempted. Percentages are shown as text too.</p>
    </div>
  );
}

export function ProgressBar({ percent, green, label }: { percent: number; green?: boolean; label: string }) {
  return (
    <div className={`app-progress${green ? ' app-progress--green' : ''}`} role="progressbar" aria-valuenow={percent} aria-valuemin={0} aria-valuemax={100} aria-label={label}>
      <span style={{ width: `${percent}%` }} />
    </div>
  );
}
