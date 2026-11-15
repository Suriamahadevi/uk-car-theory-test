import { DEFAULT_THEME_ID, THEME_MAP, buildTokens, type Mode } from './themes';

/** Theme preferences live in their own localStorage keys so the inline boot script can read them before React loads. */
export const PREFS_KEY = 'ttr-theme';
export const CSS_CACHE_KEY = 'ttr-theme-css';

export interface ThemePrefs { themeId: string; mode: Mode }

export const DEFAULT_PREFS: ThemePrefs = { themeId: DEFAULT_THEME_ID, mode: 'light' };

export function parsePrefs(raw: string | null): ThemePrefs {
  if (!raw) return { ...DEFAULT_PREFS };
  try {
    const p = JSON.parse(raw) as Partial<ThemePrefs>;
    return {
      themeId: p.themeId && THEME_MAP[p.themeId] ? p.themeId : DEFAULT_THEME_ID,
      mode: p.mode === 'dark' ? 'dark' : 'light',
    };
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

export function serialisePrefs(p: ThemePrefs): string {
  return JSON.stringify({ themeId: p.themeId, mode: p.mode });
}

export function loadPrefs(): ThemePrefs {
  try {
    return parsePrefs(window.localStorage.getItem(PREFS_KEY));
  } catch {
    return { ...DEFAULT_PREFS };
  }
}

/** Inline style text for <html> – also cached so index.html can apply it before first paint. */
export function cssText(themeId: string, mode: Mode): string {
  const tk = buildTokens(themeId, mode);
  return Object.entries(tk).map(([k, v]) => `--${k}:${v}`).join(';') + `;color-scheme:${mode}`;
}

export function savePrefs(p: ThemePrefs): void {
  try {
    window.localStorage.setItem(PREFS_KEY, serialisePrefs(p));
    window.localStorage.setItem(CSS_CACHE_KEY, cssText(p.themeId, p.mode));
  } catch {
    /* storage unavailable – theme still applies for this visit */
  }
}

/** Apply a theme's tokens to <html> without saving (used for live preview too). */
export function applyTheme(themeId: string, mode: Mode): void {
  const root = document.documentElement;
  const tk = buildTokens(themeId, mode);
  for (const [k, v] of Object.entries(tk)) root.style.setProperty(`--${k}`, v);
  root.style.colorScheme = mode;
  root.dataset.theme = themeId;
  root.dataset.mode = mode;
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) meta.setAttribute('content', tk['sidebar-bg']);
}
