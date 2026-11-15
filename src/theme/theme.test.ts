import { describe, expect, it } from 'vitest';
import { THEMES, buildTokens, contrastReport, DEFAULT_THEME_ID } from './themes';
import { contrast } from './color';
import { parsePrefs, serialisePrefs } from './storage';

describe('theme definitions', () => {
  it('has the 10 requested themes with their exact brand colours', () => {
    expect(THEMES.map((t) => t.name)).toEqual([
      'Midnight Teal', 'Royal Blue', 'Forest Green', 'Burgundy Rose', 'Royal Purple',
      'Ocean Blue', 'Charcoal Gold', 'Sunset Coral', 'Sage Minimal', 'Arctic Ice',
    ]);
    expect(THEMES[0]).toMatchObject({ sidebar: '#102A35', primary: '#167C80', background: '#F2F4F0', accent: '#D6B77A' });
    expect(new Set(THEMES.map((t) => t.id)).size).toBe(10);
  });

  it('uses each theme’s background and sidebar colours unchanged in light mode', () => {
    for (const t of THEMES) {
      const tk = buildTokens(t.id, 'light');
      expect(tk.bg).toBe(t.background);
      expect(tk['sidebar-bg']).toBe(t.sidebar);
    }
  });

  it('produces the same token names in light and dark mode', () => {
    for (const t of THEMES) expect(Object.keys(buildTokens(t.id, 'dark')).sort()).toEqual(Object.keys(buildTokens(t.id, 'light')).sort());
  });
});

describe('WCAG 2.2 AA contrast – every theme, both modes', () => {
  for (const t of THEMES) {
    for (const mode of ['light', 'dark'] as const) {
      it(`${t.name} (${mode})`, () => {
        const failures = contrastReport(t.id, mode).filter((r) => r.ratio < r.min).map((r) => `${r.fg} on ${r.bg}: ${r.ratio.toFixed(2)} < ${r.min}`);
        expect(failures).toEqual([]);
      });
    }
  }

  it('dark mode is a real dark scheme, not an inversion', () => {
    for (const t of THEMES) {
      const d = buildTokens(t.id, 'dark');
      const l = buildTokens(t.id, 'light');
      expect(contrast(d.bg, '#000000')).toBeLessThan(2); // dark background
      expect(d.bg).not.toBe(l.text);
      expect(contrast(d.text, '#ffffff')).toBeLessThan(1.6); // light text
    }
  });
});

describe('theme preference storage', () => {
  it('round-trips and rejects bad data', () => {
    expect(parsePrefs(serialisePrefs({ themeId: 'royal-blue', mode: 'dark' }))).toEqual({ themeId: 'royal-blue', mode: 'dark' });
    expect(parsePrefs('not json')).toEqual({ themeId: DEFAULT_THEME_ID, mode: 'light' });
    expect(parsePrefs(JSON.stringify({ themeId: 'nope', mode: 'purple' }))).toEqual({ themeId: DEFAULT_THEME_ID, mode: 'light' });
    expect(parsePrefs(null)).toEqual({ themeId: DEFAULT_THEME_ID, mode: 'light' });
  });
});
