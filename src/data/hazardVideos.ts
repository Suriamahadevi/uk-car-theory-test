import { useEffect, useState } from 'react';

/**
 * Real-video hazard perception library.
 *
 * Clips are NOT bundled with the app. They are listed in
 * `public/hazard-videos/manifest.json` and must be properly licensed road footage
 * (see public/hazard-videos/README.md). Until licensed clips are added, the library
 * shows each category as "pending licensed content". The animated clips elsewhere
 * on the site are labelled simulations and are not part of this library.
 */

export const VIDEO_CATEGORIES = [
  { id: 'urban', label: 'Urban roads' },
  { id: 'rural', label: 'Rural roads' },
  { id: 'motorway', label: 'Motorways' },
  { id: 'dual-carriageway', label: 'Dual carriageways' },
  { id: 'junctions', label: 'Junctions' },
  { id: 'roundabouts', label: 'Roundabouts' },
  { id: 'crossings', label: 'Pedestrian crossings' },
  { id: 'parked-vehicles', label: 'Parked vehicles' },
  { id: 'cyclists-motorcyclists', label: 'Cyclists and motorcyclists' },
  { id: 'emergency', label: 'Emergency situations' },
] as const;
export type VideoCategory = (typeof VIDEO_CATEGORIES)[number]['id'];

export interface VideoHazard { start: number; end: number; description: string }

export interface HazardVideo {
  id: string;
  title: string;
  category: VideoCategory;
  /** Path relative to the site base, e.g. "hazard-videos/urban-01.mp4", or an https URL. */
  src: string;
  poster?: string;
  durationSec: number;
  /** One developing hazard per clip (two allowed, as in the real test). */
  hazards: VideoHazard[];
  licence: {
    holder: string;
    licence: string;
    sourceUrl?: string;
    /** Person who checked the hazard timings against the footage. */
    verifiedBy?: string;
    verifiedOn?: string;
  };
  notes?: string;
}

export interface VideoManifest { version: 1; clips: HazardVideo[] }

/** Validate a manifest. Returns a list of problems; empty means valid. */
export function validateManifest(m: unknown): string[] {
  const errors: string[] = [];
  if (!m || typeof m !== 'object') return ['Manifest is not an object'];
  const man = m as Partial<VideoManifest>;
  if (man.version !== 1) errors.push('version must be 1');
  if (!Array.isArray(man.clips)) return [...errors, 'clips must be an array'];
  const ids = new Set<string>();
  const cats = new Set<string>(VIDEO_CATEGORIES.map((c) => c.id));
  man.clips.forEach((c, i) => {
    const at = `clip ${i + 1}${c?.id ? ` (${c.id})` : ''}`;
    if (!c?.id) errors.push(`${at}: missing id`);
    else if (ids.has(c.id)) errors.push(`${at}: duplicate id`);
    else ids.add(c.id);
    if (!c?.title) errors.push(`${at}: missing title`);
    if (!cats.has(c?.category)) errors.push(`${at}: unknown category`);
    if (!c?.src) errors.push(`${at}: missing src`);
    if (!(c?.durationSec > 0)) errors.push(`${at}: durationSec must be positive`);
    if (!Array.isArray(c?.hazards) || c.hazards.length < 1 || c.hazards.length > 2) errors.push(`${at}: needs 1 or 2 hazards`);
    else c.hazards.forEach((h, j) => {
      if (!(h.start >= 0 && h.end > h.start && h.end <= c.durationSec)) errors.push(`${at}: hazard ${j + 1} timing must satisfy 0 ≤ start < end ≤ duration`);
      if (!h.description) errors.push(`${at}: hazard ${j + 1} needs a description`);
    });
    if (c?.hazards?.length === 2 && c.hazards[1].start < c.hazards[0].end) errors.push(`${at}: hazard windows must not overlap`);
    if (!c?.licence?.holder || !c?.licence?.licence) errors.push(`${at}: licence holder and licence terms are required`);
  });
  return errors;
}

export function videoUrl(src: string): string {
  return /^https?:\/\//.test(src) ? src : `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`;
}

/** `published: false` means no manifest is deployed yet (e.g. before licensed clips exist). */
type State = { status: 'loading' } | { status: 'ready'; clips: HazardVideo[]; published: boolean } | { status: 'error'; message: string };

/** Load and validate the video manifest at runtime. Invalid clips are never shown. */
export function useVideoManifest(): State {
  const [state, setState] = useState<State>({ status: 'loading' });
  useEffect(() => {
    let alive = true;
    fetch(videoUrl('hazard-videos/manifest.json'), { cache: 'no-cache' })
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error(`HTTP ${r.status}`))))
      .then((json) => {
        if (!alive) return;
        const problems = validateManifest(json);
        if (problems.length) setState({ status: 'error', message: `The video library is misconfigured: ${problems.slice(0, 3).join('; ')}` });
        else setState({ status: 'ready', clips: (json as VideoManifest).clips, published: true });
      })
      // Missing or unreadable manifest: treat as an empty library rather than an error.
      .catch(() => alive && setState({ status: 'ready', clips: [], published: false }));
    return () => { alive = false; };
  }, []);
  return state;
}
