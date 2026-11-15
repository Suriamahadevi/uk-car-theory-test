import { useRef, useState, type KeyboardEvent } from 'react';
import { THEMES, THEME_MAP, DEFAULT_THEME_ID, buildTokens, type Mode } from '../theme/themes';
import { useTheme } from '../theme/ThemeProvider';
import Icon from './Icon';

/**
 * Appearance settings. Hovering or focusing a card previews it (nothing is saved);
 * clicking, Enter or Space applies and saves it. Arrow keys move between cards.
 */
export default function ThemeGallery() {
  const { prefs, setTheme, setMode, reset, preview } = useTheme();
  const [previewing, setPreviewing] = useState<string | null>(null);
  const cards = useRef<(HTMLButtonElement | null)[]>([]);

  const startPreview = (id: string) => { setPreviewing(id); preview(id); };
  const endPreview = () => { setPreviewing(null); preview(null); };

  const onKey = (e: KeyboardEvent, i: number) => {
    const cols = Math.max(1, Math.round((cards.current[0]?.parentElement?.clientWidth ?? 1) / (cards.current[0]?.offsetWidth ?? 1)));
    const moves: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1, ArrowDown: cols, ArrowUp: -cols };
    if (e.key in moves) {
      e.preventDefault();
      const next = Math.min(THEMES.length - 1, Math.max(0, i + moves[e.key]));
      cards.current[next]?.focus();
    } else if (e.key === 'Home' || e.key === 'End') {
      e.preventDefault();
      cards.current[e.key === 'Home' ? 0 : THEMES.length - 1]?.focus();
    } else if (e.key === 'Escape') {
      endPreview();
    }
  };

  const current = THEME_MAP[prefs.themeId];
  const status = previewing && previewing !== prefs.themeId
    ? `Previewing ${THEME_MAP[previewing].name} – select it to keep it`
    : `${current.name}, ${prefs.mode} mode`;

  return (
    <div className="app-appearance">
      <div className="app-appearance__bar">
        <div>
          <h3 className="govuk-heading-s govuk-!-margin-bottom-1">Mode</h3>
          <div className="app-segmented" role="radiogroup" aria-label="Light or dark appearance">
            {(['light', 'dark'] as Mode[]).map((m) => (
              <button
                key={m}
                type="button"
                role="radio"
                aria-checked={prefs.mode === m}
                tabIndex={prefs.mode === m ? 0 : -1}
                className="app-segmented__option"
                onClick={() => setMode(m)}
                onKeyDown={(e) => {
                  if (e.key === 'ArrowRight' || e.key === 'ArrowLeft' || e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const other: Mode = m === 'light' ? 'dark' : 'light';
                    setMode(other);
                    (e.currentTarget.parentElement?.querySelector(`[data-mode="${other}"]`) as HTMLButtonElement | null)?.focus();
                  }
                }}
                data-mode={m}
              >
                {m === 'light' ? 'Light' : 'Dark'}
              </button>
            ))}
          </div>
        </div>
        <button type="button" className="govuk-button govuk-button--secondary govuk-!-margin-bottom-0" onClick={() => { endPreview(); reset(); }} disabled={prefs.themeId === DEFAULT_THEME_ID && prefs.mode === 'light'}>
          Reset to default theme
        </button>
      </div>

      <h3 className="govuk-heading-s govuk-!-margin-bottom-1" id="theme-gallery-label">Colour theme</h3>
      <p className="govuk-body-s app-muted govuk-!-margin-bottom-3" id="theme-gallery-hint">Hover or use the arrow keys to preview. Select a theme to apply it.</p>
      <p className="govuk-visually-hidden" aria-live="polite">{status}</p>
      <div className="app-theme-grid" role="group" aria-labelledby="theme-gallery-label" aria-describedby="theme-gallery-hint" onMouseLeave={endPreview}>
        {THEMES.map((t, i) => {
          const tk = buildTokens(t.id, prefs.mode);
          const selected = prefs.themeId === t.id;
          return (
            <button
              key={t.id}
              ref={(el) => { cards.current[i] = el; }}
              type="button"
              className={`app-theme-card${selected ? ' is-selected' : ''}`}
              aria-pressed={selected}
              aria-label={`${t.name} theme${selected ? ', selected' : ''}`}
              onClick={() => { setTheme(t.id); setPreviewing(null); }}
              onMouseEnter={() => startPreview(t.id)}
              onFocus={() => startPreview(t.id)}
              onBlur={endPreview}
              onKeyDown={(e) => onKey(e, i)}
              data-theme-id={t.id}
            >
              <span className="app-theme-preview" aria-hidden="true" style={{ background: tk.bg }}>
                <span className="app-theme-preview__side" style={{ background: tk['sidebar-bg'] }}>
                  <span style={{ background: tk['sidebar-active-bg'] }} />
                  <span style={{ background: tk['sidebar-muted'] }} />
                  <span style={{ background: tk['sidebar-muted'] }} />
                </span>
                <span className="app-theme-preview__main">
                  <span className="app-theme-preview__hero" style={{ background: tk['strong-bg'] }}>
                    <span style={{ background: tk.accent }} />
                  </span>
                  <span className="app-theme-preview__card" style={{ background: tk.surface, borderColor: tk.line }}>
                    <span style={{ background: tk.text }} />
                    <span className="app-theme-preview__btn" style={{ background: tk.primary }} />
                  </span>
                </span>
              </span>
              <span className="app-theme-card__foot">
                <span className="app-theme-card__name">{t.name}</span>
                {selected && <span className="app-theme-card__selected"><Icon name="check" size={16} /> Selected</span>}
              </span>
              <span className="app-swatches" aria-hidden="true">
                {[t.sidebar, t.primary, t.background, t.accent].map((c, k) => (
                  <span key={k} className="app-swatch" style={{ background: c }} title={['Sidebar', 'Primary', 'Background', 'Accent'][k]} />
                ))}
              </span>
            </button>
          );
        })}
      </div>
      <p className="govuk-body-s app-muted govuk-!-margin-top-3">Every theme meets WCAG AA contrast in light and dark mode. Where a brand colour would be too light for text or white labels, a slightly deeper shade is used automatically. The timed mock exam always uses a neutral, high-contrast layout.</p>
    </div>
  );
}
