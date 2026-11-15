import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { DEFAULT_PREFS, applyTheme, loadPrefs, savePrefs, type ThemePrefs } from './storage';
import type { Mode } from './themes';

interface ThemeContextValue {
  /** Saved preference (the single source of truth). */
  prefs: ThemePrefs;
  setTheme: (themeId: string) => void;
  setMode: (mode: Mode) => void;
  reset: () => void;
  /** Temporarily show a theme without saving it; pass null to restore the saved theme. */
  preview: (themeId: string | null) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

/**
 * Applies the theme as CSS custom properties on <html>. Components read colours only
 * through CSS variables, so changing theme causes no React re-render outside the
 * consumers of this context (the Settings gallery).
 */
export function ThemeProvider({ children }: { children: ReactNode }) {
  const [prefs, setPrefs] = useState<ThemePrefs>(loadPrefs);
  const previewing = useRef<string | null>(null);

  // Layout effect so the saved theme is applied before the browser paints.
  useLayoutEffect(() => {
    if (!previewing.current) applyTheme(prefs.themeId, prefs.mode);
  }, [prefs]);
  useEffect(() => savePrefs(prefs), [prefs]);

  // Keep several open tabs in sync.
  useEffect(() => {
    const onStorage = (e: StorageEvent) => { if (e.key === 'ttr-theme') setPrefs(loadPrefs()); };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);

  const setTheme = useCallback((themeId: string) => { previewing.current = null; setPrefs((p) => ({ ...p, themeId })); }, []);
  const setMode = useCallback((mode: Mode) => setPrefs((p) => ({ ...p, mode })), []);
  const reset = useCallback(() => { previewing.current = null; setPrefs({ ...DEFAULT_PREFS }); }, []);
  const prefsRef = useRef(prefs);
  prefsRef.current = prefs;
  const preview = useCallback((themeId: string | null) => {
    previewing.current = themeId;
    const p = prefsRef.current;
    applyTheme(themeId ?? p.themeId, p.mode);
  }, []);

  const value = useMemo(() => ({ prefs, setTheme, setMode, reset, preview }), [prefs, setTheme, setMode, reset, preview]);
  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
}
