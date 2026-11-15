import { useRef, useState } from 'react';
import PageHead from '../components/PageHead';
import { getState, importData, resetAll, setState, useAppData } from '../store/store';
import type { Settings } from '../types';
import Card from '../components/Card';
import ThemeGallery from '../components/ThemeGallery';

export default function SettingsPage() {
  const data = useAppData();
  const fileRef = useRef<HTMLInputElement>(null);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [confirmReset, setConfirmReset] = useState(false);

  const set = <K extends keyof Settings>(k: K, v: Settings[K]) => setState((s) => ({ ...s, settings: { ...s.settings, [k]: v } }));

  const exportData = () => {
    const blob = new Blob([JSON.stringify(getState(), null, 2)], { type: 'application/json' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `theory-test-progress-${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(a.href);
    setMsg({ ok: true, text: 'Your progress file has been downloaded.' });
  };

  const onImport = async (f: File | undefined) => {
    if (!f) return;
    try {
      importData(await f.text());
      setMsg({ ok: true, text: 'Your progress has been imported.' });
    } catch {
      setMsg({ ok: false, text: 'The file could not be read. Choose a progress file exported from this site.' });
    }
    if (fileRef.current) fileRef.current.value = '';
  };

  return (
    <>
      <PageHead eyebrow="Account" title="Settings" lead="Display, revision and your saved data." />
      {msg && (
        <div className={`govuk-notification-banner${msg.ok ? ' govuk-notification-banner--success' : ''}`} role="alert">
          <div className="govuk-notification-banner__header"><h2 className="govuk-notification-banner__title">{msg.ok ? 'Success' : 'Important'}</h2></div>
          <div className="govuk-notification-banner__content"><p className="govuk-notification-banner__heading">{msg.text}</p></div>
        </div>
      )}

      <Card title="Appearance">
        <ThemeGallery />
      </Card>

      <Card title="Display">
      <div className="govuk-checkboxes">
        <div className="govuk-checkboxes__item">
          <input className="govuk-checkboxes__input" id="large" type="checkbox" checked={data.settings.largeText} onChange={(e) => set('largeText', e.target.checked)} />
          <label className="govuk-label govuk-checkboxes__label" htmlFor="large">Larger text</label>
        </div>
        <div className="govuk-checkboxes__item">
          <input className="govuk-checkboxes__input" id="timer" type="checkbox" checked={data.settings.showTimer} onChange={(e) => set('showTimer', e.target.checked)} />
          <label className="govuk-label govuk-checkboxes__label" htmlFor="timer">Show the countdown timer during mock tests</label>
          <div className="govuk-hint govuk-checkboxes__hint">The time limit still applies when the timer is hidden.</div>
        </div>
      </div>
      </Card>

      <Card title="Mistake Book">
      <div className="govuk-form-group">
        <label className="govuk-label" htmlFor="mastery">Correct answers needed (in separate sessions) before a mistake is mastered</label>
        <select className="govuk-select" id="mastery" value={data.settings.masteryTarget} onChange={(e) => set('masteryTarget', Number(e.target.value))}>
          <option value={2}>2</option><option value={3}>3</option><option value={4}>4</option>
        </select>
        <div className="govuk-hint">Changes apply the next time you answer a saved question.</div>
      </div>
      </Card>

      <Card title="Your data">
      <p className="govuk-body">Your progress is saved in this browser on this device only. Nothing is sent to a server. Export a backup to move it to another device.</p>
      <div className="app-actions">
        <button type="button" className="govuk-button govuk-button--secondary" onClick={exportData}>Export my progress</button>
        <button type="button" className="govuk-button govuk-button--secondary" onClick={() => fileRef.current?.click()}>Import progress from a file</button>
        <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={(e) => onImport(e.target.files?.[0])} aria-label="Progress file" />
      </div>
      </Card>

      <Card title="Delete all progress" tone="error">
      {!confirmReset ? (
        <button type="button" className="govuk-button govuk-button--warning" onClick={() => setConfirmReset(true)}>Delete all my progress</button>
      ) : (
        <div className="govuk-warning-text">
          <span className="govuk-warning-text__icon" aria-hidden="true">!</span>
          <div className="govuk-warning-text__text">
            <span className="govuk-visually-hidden">Warning</span>
            This deletes all test history, your Mistake Book and topic progress. It cannot be undone.
            <div className="app-actions govuk-!-margin-top-3">
              <button type="button" className="govuk-button govuk-button--warning" onClick={() => { resetAll(); setConfirmReset(false); setMsg({ ok: true, text: 'All progress has been deleted.' }); }}>Yes, delete everything</button>
              <button type="button" className="govuk-button govuk-button--secondary" onClick={() => setConfirmReset(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
      </Card>
    </>
  );
}
