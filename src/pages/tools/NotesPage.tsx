import { Link } from 'react-router-dom';
import { TOPICS } from '../../data/topics';
import { REVISION_CARDS } from '../../data/revision';
import { DISCLAIMER } from '../../components/Layout';

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

/** Build a standalone HTML file of all revision notes for offline use. */
function notesHtml(): string {
  const topics = TOPICS.map((t) => `<h2>${t.number}. ${esc(t.title)}</h2><p><em>${esc(t.summary)}</em></p><ul>${t.notes.map((n) => `<li>${esc(n)}</li>`).join('')}</ul><p><strong>Key rules:</strong> ${t.keyRules.map(esc).join(' · ')}</p><p><strong>Exam traps:</strong> ${t.traps.map(esc).join(' ')}</p>`).join('');
  const cards = REVISION_CARDS.map((c) => `<h3>${esc(c.title)}</h3><ul>${c.points.map((p) => `<li>${esc(p)}</li>`).join('')}</ul><p><strong>Memory trick:</strong> ${esc(c.trick)}</p>`).join('');
  return `<!doctype html><html lang="en-GB"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Theory test revision notes</title><style>body{font-family:Arial,sans-serif;max-width:46em;margin:0 auto;padding:16px;color:#0b0c0c;line-height:1.5}h1{font-size:2rem}h2{border-top:2px solid #0b0c0c;padding-top:12px;margin-top:32px}</style></head><body><h1>UK car theory test – revision notes</h1><p>${esc(DISCLAIMER)}</p>${topics}<h2>Quick revision cards</h2>${cards}</body></html>`;
}

export default function NotesPage() {
  const download = () => {
    const blob = new Blob([notesHtml()], { type: 'text/html' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'theory-test-revision-notes.html';
    a.click();
    URL.revokeObjectURL(a.href);
  };
  return (
    <>
      <Link to="/tools" className="govuk-back-link">Study tools</Link>
      <h1 className="govuk-heading-xl">Offline revision notes</h1>
      <p className="govuk-body">All the notes on one page. Once you have visited this site, it keeps working offline in the same browser. You can also download the notes as a file or print them.</p>
      <div className="app-actions">
        <button type="button" className="govuk-button" onClick={download}>Download notes (HTML file)</button>
        <button type="button" className="govuk-button govuk-button--secondary" onClick={() => window.print()}>Print notes</button>
      </div>
      {TOPICS.map((t) => (
        <section key={t.id}>
          <h2 className="govuk-heading-m">{t.number}. {t.title}</h2>
          <ul className="govuk-list govuk-list--bullet">{t.notes.map((n) => <li key={n}>{n}</li>)}</ul>
          <p className="govuk-body"><strong>Key rules:</strong> {t.keyRules.join(' · ')}</p>
          <p className="govuk-body"><strong>Exam traps:</strong> {t.traps.join(' ')}</p>
        </section>
      ))}
      <h2 className="govuk-heading-l">Quick revision cards</h2>
      {REVISION_CARDS.map((c) => (
        <section key={c.id}>
          <h3 className="govuk-heading-s">{c.title}</h3>
          <ul className="govuk-list govuk-list--bullet">{c.points.map((p) => <li key={p}>{p}</li>)}</ul>
          <p className="govuk-body"><strong>Memory trick:</strong> {c.trick}</p>
        </section>
      ))}
    </>
  );
}
