import type { Hazard } from '../data/hazardClips';

/** Points for a click inside a hazard's scoring window: 5 for the first fifth, down to 1. */
export function pointsForClick(h: Hazard, t: number): number {
  if (t < h.start || t > h.end) return 0;
  const band = (h.end - h.start) / 5;
  return Math.max(1, 5 - Math.floor((t - h.start) / band));
}

/**
 * Detect clicking patterns that would score zero in the real test:
 * too many clicks overall, or rapid bursts of clicks.
 */
export function isCheating(clicks: number[]): boolean {
  if (clicks.length > 15) return true;
  const sorted = [...clicks].sort((a, b) => a - b);
  for (let i = 0; i + 4 < sorted.length; i++) if (sorted[i + 4] - sorted[i] <= 3) return true;
  // Regular rhythm: 6+ clicks with almost identical gaps
  if (sorted.length >= 6) {
    const gaps = sorted.slice(1).map((v, i) => v - sorted[i]);
    const avg = gaps.reduce((a, b) => a + b, 0) / gaps.length;
    if (gaps.every((g) => Math.abs(g - avg) < 0.25)) return true;
  }
  return false;
}

export function scoreClip(hazards: Hazard[], clicks: number[]): { score: number; perHazard: number[]; cheated: boolean } {
  const cheated = isCheating(clicks);
  const perHazard = hazards.map((h) => Math.max(0, ...clicks.map((c) => pointsForClick(h, c))));
  return { score: cheated ? 0 : perHazard.reduce((a, b) => a + b, 0), perHazard: cheated ? hazards.map(() => 0) : perHazard, cheated };
}
