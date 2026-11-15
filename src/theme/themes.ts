import { contrast, ensureContrast, fillForText, mix, rgba, type Hex } from './color';

/**
 * Theme definitions – the single source of truth.
 * Each theme provides four brand colours; every semantic token (light and dark) is
 * derived from them with contrast guarantees (see buildTokens). Components never
 * reference theme colours directly – only the CSS custom properties.
 */
export interface ThemeDef { id: string; name: string; sidebar: Hex; primary: Hex; background: Hex; accent: Hex }

export const THEMES: ThemeDef[] = [
  { id: 'midnight-teal', name: 'Midnight Teal', sidebar: '#102A35', primary: '#167C80', background: '#F2F4F0', accent: '#D6B77A' },
  { id: 'royal-blue', name: 'Royal Blue', sidebar: '#172554', primary: '#2563EB', background: '#EFF6FF', accent: '#F59E0B' },
  { id: 'forest-green', name: 'Forest Green', sidebar: '#173B32', primary: '#25866B', background: '#F1F5F0', accent: '#C5A46D' },
  { id: 'burgundy-rose', name: 'Burgundy Rose', sidebar: '#451A2B', primary: '#A33D59', background: '#FAF3F2', accent: '#D9B58C' },
  { id: 'royal-purple', name: 'Royal Purple', sidebar: '#30204F', primary: '#7655B5', background: '#F5F1FA', accent: '#D9B8FF' },
  { id: 'ocean-blue', name: 'Ocean Blue', sidebar: '#123047', primary: '#168AAD', background: '#EDF7FA', accent: '#F4C66A' },
  { id: 'charcoal-gold', name: 'Charcoal Gold', sidebar: '#252525', primary: '#B08D57', background: '#F5F3EF', accent: '#D7BD8A' },
  { id: 'sunset-coral', name: 'Sunset Coral', sidebar: '#472C36', primary: '#D66A58', background: '#FFF4EE', accent: '#F2B66D' },
  { id: 'sage-minimal', name: 'Sage Minimal', sidebar: '#34483C', primary: '#829B78', background: '#F3F5EF', accent: '#C6AD79' },
  { id: 'arctic-ice', name: 'Arctic Ice', sidebar: '#18344A', primary: '#5799B8', background: '#EFF7FB', accent: '#A9D6E5' },
];

export const DEFAULT_THEME_ID = 'midnight-teal';
export type Mode = 'light' | 'dark';
export const THEME_MAP: Record<string, ThemeDef> = Object.fromEntries(THEMES.map((t) => [t.id, t]));

/** Semantic tokens set as CSS custom properties on <html>. */
export type Tokens = Record<string, string>;

const SUCCESS = '#16834A';
const ERROR = '#D4351C';
const WARNING = '#F0B429';
const FOCUS = '#F0B429';
const WHITE = '#ffffff';

/** Text needs 4.5:1 (we aim a little higher), large/UI 3:1. */
const TEXT = 4.6;
const STRONG = 7;

function lightTokens(t: ThemeDef): Tokens {
  const bg = t.background;
  const surface = WHITE;
  const text = ensureContrast(mix(t.sidebar, '#000000', 0.15), [bg, surface], STRONG);
  const heading = ensureContrast(t.sidebar, [bg, surface], STRONG);
  const muted = ensureContrast(mix(t.sidebar, bg, 0.42), [bg, surface, mix(bg, t.sidebar, 0.06)], TEXT);
  // Primary fill with white label must reach 4.5:1 – some brand colours are darkened slightly.
  const primary = fillForText(t.primary, WHITE, TEXT);
  const primarySoft = mix(t.primary, WHITE, 0.88);
  const accentSoft = mix(t.accent, WHITE, 0.75);
  const sidebarActive = fillForText(t.primary, WHITE, TEXT);
  return {
    'bg': bg,
    'surface': surface,
    'surface-sunken': mix(bg, t.sidebar, 0.06),
    'line': mix(bg, t.sidebar, 0.14),
    'text': text,
    'heading': heading,
    'text-muted': muted,
    'text-secondary': muted,
    'link': ensureContrast(t.primary, [bg, surface, primarySoft], TEXT),
    'link-hover': ensureContrast(mix(t.primary, '#000000', 0.25), [bg, surface], STRONG),
    'primary': primary,
    'primary-hover': mix(primary, '#000000', 0.14),
    'on-primary': WHITE,
    'primary-soft': primarySoft,
    'primary-text': ensureContrast(t.primary, primarySoft, TEXT),
    'secondary-bg': surface,
    'secondary-hover': mix(surface, bg, 0.6),
    'secondary-text': heading,
    'accent': t.accent,
    'accent-soft': accentSoft,
    'accent-text': ensureContrast(mix(t.accent, '#000000', 0.55), accentSoft, TEXT),
    'sidebar-bg': t.sidebar,
    'sidebar-text': ensureContrast(mix(WHITE, t.sidebar, 0.08), t.sidebar, STRONG),
    'sidebar-muted': ensureContrast(mix(WHITE, t.sidebar, 0.32), t.sidebar, TEXT),
    'sidebar-heading': ensureContrast(t.accent, t.sidebar, TEXT),
    'sidebar-hover': rgba(WHITE, 0.08),
    'sidebar-active-bg': sidebarActive,
    'sidebar-active-text': WHITE,
    'strong-bg': t.sidebar,
    'on-strong': ensureContrast(WHITE, t.sidebar, STRONG),
    'on-strong-muted': ensureContrast(mix(WHITE, t.sidebar, 0.22), t.sidebar, TEXT),
    'success': SUCCESS,
    'success-soft': mix(SUCCESS, WHITE, 0.88),
    'success-text': ensureContrast(SUCCESS, [surface, mix(SUCCESS, WHITE, 0.88)], TEXT),
    'error': ERROR,
    'error-soft': mix(ERROR, WHITE, 0.89),
    'error-text': ensureContrast(mix(ERROR, '#000000', 0.2), [surface, mix(ERROR, WHITE, 0.89)], TEXT),
    'warning': WARNING,
    'warning-soft': mix(WARNING, WHITE, 0.82),
    'warning-text': ensureContrast('#6b4a00', mix(WARNING, WHITE, 0.82), TEXT),
    'focus': FOCUS,
    'focus-ring': text,
    'input-bg': surface,
    'input-border': ensureContrast(mix(t.sidebar, bg, 0.5), surface, 3),
    'scrim': rgba(t.sidebar, 0.5),
    'shadow-colour': rgba(t.sidebar, 0.08),
    'shadow-colour-strong': rgba(t.sidebar, 0.14),
    'highlight': rgba(WHITE, 0.85),
    'on-status': WHITE,
    'exam-bg': WHITE,
    'exam-panel': mix(WHITE, t.sidebar, 0.04),
    'exam-border': ensureContrast(mix(t.sidebar, WHITE, 0.5), WHITE, 3),
    'exam-bar-bg': t.sidebar,
    'on-exam-bar': ensureContrast(WHITE, t.sidebar, STRONG),
  };
}

function darkTokens(t: ThemeDef): Tokens {
  // Tinted near-black surfaces built from the sidebar hue – not an inversion.
  const bg = mix(t.sidebar, '#000000', 0.62);
  const surface = mix(t.sidebar, '#000000', 0.42);
  const sunken = mix(t.sidebar, '#000000', 0.72);
  const text = ensureContrast(mix(WHITE, t.background, 0.4), [bg, surface], STRONG);
  const heading = ensureContrast(WHITE, [bg, surface], STRONG);
  const muted = ensureContrast(mix(text, surface, 0.38), [bg, surface, sunken], TEXT);
  // Lighter primary with dark label text.
  const ink = mix(t.sidebar, '#000000', 0.7);
  const primary = fillForText(mix(t.primary, WHITE, 0.12), ink, TEXT);
  const primarySoft = mix(t.primary, bg, 0.72);
  const accentSoft = mix(t.accent, bg, 0.78);
  const successSoft = mix(SUCCESS, bg, 0.72);
  const errorSoft = mix(ERROR, bg, 0.74);
  const warningSoft = mix(WARNING, bg, 0.78);
  const sidebar = mix(t.sidebar, '#000000', 0.38);
  return {
    'bg': bg,
    'surface': surface,
    'surface-sunken': sunken,
    'line': mix(surface, WHITE, 0.14),
    'text': text,
    'heading': heading,
    'text-muted': muted,
    'text-secondary': muted,
    'link': ensureContrast(mix(t.primary, WHITE, 0.35), [bg, surface, primarySoft], TEXT),
    'link-hover': ensureContrast(mix(t.primary, WHITE, 0.6), [bg, surface], STRONG),
    'primary': primary,
    'primary-hover': mix(primary, WHITE, 0.15),
    'on-primary': ink,
    'primary-soft': primarySoft,
    'primary-text': ensureContrast(mix(t.primary, WHITE, 0.45), primarySoft, TEXT),
    'secondary-bg': mix(surface, WHITE, 0.06),
    'secondary-hover': mix(surface, WHITE, 0.12),
    'secondary-text': heading,
    'accent': ensureContrast(t.accent, sidebar, 3),
    'accent-soft': accentSoft,
    'accent-text': ensureContrast(mix(t.accent, WHITE, 0.3), accentSoft, TEXT),
    'sidebar-bg': sidebar,
    'sidebar-text': ensureContrast(mix(WHITE, t.sidebar, 0.08), sidebar, STRONG),
    'sidebar-muted': ensureContrast(mix(WHITE, t.sidebar, 0.35), sidebar, TEXT),
    'sidebar-heading': ensureContrast(t.accent, sidebar, TEXT),
    'sidebar-hover': rgba(WHITE, 0.07),
    'sidebar-active-bg': primary,
    'sidebar-active-text': ink,
    'strong-bg': sidebar,
    'on-strong': ensureContrast(WHITE, sidebar, STRONG),
    'on-strong-muted': ensureContrast(mix(WHITE, t.sidebar, 0.25), sidebar, TEXT),
    'success': SUCCESS,
    'success-soft': successSoft,
    'success-text': ensureContrast(mix(SUCCESS, WHITE, 0.45), [surface, successSoft], TEXT),
    'error': ERROR,
    'error-soft': errorSoft,
    'error-text': ensureContrast(mix(ERROR, WHITE, 0.45), [surface, errorSoft], TEXT),
    'warning': WARNING,
    'warning-soft': warningSoft,
    'warning-text': ensureContrast(mix(WARNING, WHITE, 0.3), warningSoft, TEXT),
    'focus': FOCUS,
    'focus-ring': '#000000',
    'input-bg': sunken,
    'input-border': ensureContrast(mix(surface, WHITE, 0.35), sunken, 3),
    'scrim': rgba('#000000', 0.6),
    'shadow-colour': rgba('#000000', 0.35),
    'shadow-colour-strong': rgba('#000000', 0.5),
    'highlight': rgba(WHITE, 0.05),
    'on-status': WHITE,
    'exam-bg': mix(t.sidebar, '#000000', 0.78),
    'exam-panel': mix(t.sidebar, '#000000', 0.66),
    'exam-border': ensureContrast(mix(WHITE, t.sidebar, 0.5), mix(t.sidebar, '#000000', 0.78), 3),
    'exam-bar-bg': sidebar,
    'on-exam-bar': ensureContrast(WHITE, sidebar, STRONG),
  };
}

const cache = new Map<string, Tokens>();
export function buildTokens(themeId: string, mode: Mode): Tokens {
  const key = `${themeId}:${mode}`;
  const hit = cache.get(key);
  if (hit) return hit;
  const t = THEME_MAP[themeId] ?? THEME_MAP[DEFAULT_THEME_ID];
  const tokens = mode === 'dark' ? darkTokens(t) : lightTokens(t);
  cache.set(key, tokens);
  return tokens;
}

/** Text/background pairs that must meet WCAG AA, used by tests and the gallery. */
export const CONTRAST_PAIRS: [fg: string, bg: string, min: number][] = [
  ['text', 'bg', 4.5], ['text', 'surface', 4.5], ['heading', 'bg', 4.5], ['heading', 'surface', 4.5],
  ['text-muted', 'bg', 4.5], ['text-muted', 'surface', 4.5], ['text-muted', 'surface-sunken', 4.5],
  ['link', 'bg', 4.5], ['link', 'surface', 4.5],
  ['on-primary', 'primary', 4.5], ['primary-text', 'primary-soft', 4.5], ['secondary-text', 'secondary-bg', 4.5],
  ['accent-text', 'accent-soft', 4.5],
  ['sidebar-text', 'sidebar-bg', 4.5], ['sidebar-muted', 'sidebar-bg', 4.5], ['sidebar-heading', 'sidebar-bg', 4.5],
  ['sidebar-active-text', 'sidebar-active-bg', 4.5],
  ['on-strong', 'strong-bg', 4.5], ['on-strong-muted', 'strong-bg', 4.5], ['sidebar-heading', 'strong-bg', 4.5],
  ['on-status', 'success', 4.5], ['on-status', 'error', 4.5],
  ['success-text', 'surface', 4.5], ['success-text', 'success-soft', 4.5],
  ['error-text', 'surface', 4.5], ['error-text', 'error-soft', 4.5],
  ['warning-text', 'warning-soft', 4.5],
  ['text', 'input-bg', 4.5], ['input-border', 'input-bg', 3],
  ['text', 'exam-bg', 4.5], ['on-exam-bar', 'exam-bar-bg', 4.5], ['exam-border', 'exam-bg', 3],
  ['focus', 'bg', 1.5],
];

export function contrastReport(themeId: string, mode: Mode) {
  const tk = buildTokens(themeId, mode);
  return CONTRAST_PAIRS.map(([fg, bg, min]) => ({ fg, bg, min, ratio: contrast(tk[fg], tk[bg]) }));
}
