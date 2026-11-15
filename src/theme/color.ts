/** Small colour utilities used to derive accessible theme tokens (WCAG 2.2 contrast maths). */

export type Hex = string;

export function hexToRgb(hex: Hex): [number, number, number] {
  const h = hex.replace('#', '');
  const full = h.length === 3 ? h.split('').map((c) => c + c).join('') : h;
  return [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16)) as [number, number, number];
}

export function rgbToHex([r, g, b]: [number, number, number]): Hex {
  return '#' + [r, g, b].map((v) => Math.round(Math.min(255, Math.max(0, v))).toString(16).padStart(2, '0')).join('');
}

/** Linear mix: t = 0 → a, t = 1 → b. */
export function mix(a: Hex, b: Hex, t: number): Hex {
  const [ar, ag, ab] = hexToRgb(a);
  const [br, bg, bb] = hexToRgb(b);
  return rgbToHex([ar + (br - ar) * t, ag + (bg - ag) * t, ab + (bb - ab) * t]);
}

export function luminance(hex: Hex): number {
  const ch = hexToRgb(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * ch[0] + 0.7152 * ch[1] + 0.0722 * ch[2];
}

export function contrast(a: Hex, b: Hex): number {
  const la = luminance(a);
  const lb = luminance(b);
  return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
}

/**
 * Move `fg` towards black or white (whichever direction increases contrast against
 * every background) until it reaches `target` against all of them.
 */
export function ensureContrast(fg: Hex, bgs: Hex | Hex[], target: number): Hex {
  const list = Array.isArray(bgs) ? bgs : [bgs];
  const ok = (c: Hex) => list.every((b) => contrast(c, b) >= target);
  if (ok(fg)) return fg;
  const bgLum = list.reduce((s, b) => s + luminance(b), 0) / list.length;
  const toward = bgLum > 0.18 ? '#000000' : '#ffffff';
  for (let t = 0.04; t <= 1.0001; t += 0.04) {
    const c = mix(fg, toward, t);
    if (ok(c)) return c;
  }
  return toward;
}

/** Adjust a fill colour until `onColour` text reaches `target` contrast on it. */
export function fillForText(fill: Hex, onColour: Hex, target: number): Hex {
  if (contrast(fill, onColour) >= target) return fill;
  const toward = luminance(onColour) > 0.5 ? '#000000' : '#ffffff';
  for (let t = 0.04; t <= 1.0001; t += 0.04) {
    const c = mix(fill, toward, t);
    if (contrast(c, onColour) >= target) return c;
  }
  return toward;
}

export function rgba(hex: Hex, alpha: number): string {
  const [r, g, b] = hexToRgb(hex);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}
