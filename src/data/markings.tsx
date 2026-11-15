import type { ReactElement } from 'react';

/** Simplified drawings of UK road markings (Highway Code: Road markings). */
export interface MarkingDef {
  id: string;
  name: string;
  meaning: string;
  draw: () => ReactElement;
}

const W = '#ffffff';
const Y = '#ffdd00';
const R = '#d4351c';
const road = (children: ReactElement) => (
  <>
    <rect width="200" height="100" fill="#505a5f" />
    {children}
  </>
);

export const MARKINGS: MarkingDef[] = [
  { id: 'lane-line', name: 'Lane line (short lines, long gaps)', meaning: 'Lane line – you may cross it when it is safe',
    draw: () => road(<line x1="100" y1="0" x2="100" y2="100" stroke={W} strokeWidth="5" strokeDasharray="12 26" />) },
  { id: 'hazard-line', name: 'Hazard warning line (long lines, short gaps)', meaning: 'Hazard warning line – do not cross unless you can see the road is clear well ahead',
    draw: () => road(<line x1="100" y1="0" x2="100" y2="100" stroke={W} strokeWidth="5" strokeDasharray="34 10" />) },
  { id: 'double-solid-near', name: 'Double white lines, solid line nearest you', meaning: 'You must not cross or straddle the lines, except in the permitted situations',
    draw: () => road(<><line x1="96" y1="0" x2="96" y2="100" stroke={W} strokeWidth="4" strokeDasharray="20 12" /><line x1="106" y1="0" x2="106" y2="100" stroke={W} strokeWidth="4" /><text x="150" y="95" fontSize="11" fill={W} fontFamily="Arial">you →</text></>) },
  { id: 'broken-near', name: 'Double white lines, broken line nearest you', meaning: 'You may cross to overtake if safe, if you can finish before a solid line on your side',
    draw: () => road(<><line x1="96" y1="0" x2="96" y2="100" stroke={W} strokeWidth="4" /><line x1="106" y1="0" x2="106" y2="100" stroke={W} strokeWidth="4" strokeDasharray="20 12" /><text x="150" y="95" fontSize="11" fill={W} fontFamily="Arial">you →</text></>) },
  { id: 'double-yellow', name: 'Double yellow lines at the kerb', meaning: 'No waiting at any time',
    draw: () => road(<><rect x="0" y="0" width="22" height="100" fill="#b1b4b6" /><line x1="30" y1="0" x2="30" y2="100" stroke={Y} strokeWidth="4" /><line x1="40" y1="0" x2="40" y2="100" stroke={Y} strokeWidth="4" /></>) },
  { id: 'single-yellow', name: 'Single yellow line at the kerb', meaning: 'No waiting during the times shown on nearby plates',
    draw: () => road(<><rect x="0" y="0" width="22" height="100" fill="#b1b4b6" /><line x1="32" y1="0" x2="32" y2="100" stroke={Y} strokeWidth="4" /></>) },
  { id: 'double-red', name: 'Double red lines at the kerb', meaning: 'No stopping at any time (red route)',
    draw: () => road(<><rect x="0" y="0" width="22" height="100" fill="#b1b4b6" /><line x1="30" y1="0" x2="30" y2="100" stroke={R} strokeWidth="4" /><line x1="40" y1="0" x2="40" y2="100" stroke={R} strokeWidth="4" /></>) },
  { id: 'give-way-lines', name: 'Double broken white lines across the road', meaning: 'Give way to traffic on the major road',
    draw: () => road(<><line x1="0" y1="40" x2="200" y2="40" stroke={W} strokeWidth="4" strokeDasharray="16 8" /><line x1="0" y1="52" x2="200" y2="52" stroke={W} strokeWidth="4" strokeDasharray="16 8" /><polygon points="100,62 86,90 114,90" fill="none" stroke={W} strokeWidth="3" /></>) },
  { id: 'stop-line', name: 'Single solid white line across the road with STOP painted', meaning: 'Stop line at a STOP sign – you must stop at the line',
    draw: () => road(<><line x1="0" y1="40" x2="200" y2="40" stroke={W} strokeWidth="6" /><text x="100" y="80" textAnchor="middle" fontSize="22" fontWeight="bold" fill={W} fontFamily="Arial">STOP</text></>) },
  { id: 'box-junction', name: 'Yellow criss-cross lines (box junction)', meaning: 'Box junction – do not enter unless your exit is clear (except when turning right and blocked only by oncoming traffic)',
    draw: () => road(<g stroke={Y} strokeWidth="3"><rect x="40" y="10" width="120" height="80" fill="none" />{[0, 30, 60, 90, 120].map((d) => <line key={d} x1={40 + d} y1="10" x2={Math.min(160, 40 + d + 80)} y2={10 + Math.min(80, 120 - d)} />)}{[0, 30, 60, 90, 120].map((d) => <line key={`b${d}`} x1={160 - d} y1="10" x2={Math.max(40, 160 - d - 80)} y2={10 + Math.min(80, 120 - d)} />)}</g>) },
  { id: 'zigzag-white', name: 'White zig-zag lines at the kerb', meaning: 'Pedestrian crossing area – no parking and no overtaking',
    draw: () => road(<polyline points="30,0 40,10 30,20 40,30 30,40 40,50 30,60 40,70 30,80 40,90 30,100" fill="none" stroke={W} strokeWidth="3" />) },
  { id: 'hatched-solid', name: 'Diagonal white stripes bordered by a solid line', meaning: 'Do not enter the area except in an emergency',
    draw: () => road(<g stroke={W} strokeWidth="3"><rect x="70" y="5" width="60" height="90" fill="none" />{[0, 20, 40, 60, 80].map((d) => <line key={d} x1="70" y1={15 + d} x2="130" y2={5 + d} />)}</g>) },
];

export const MARKING_MAP: Record<string, MarkingDef> = Object.fromEntries(MARKINGS.map((m) => [m.id, m]));

export function MarkingImage({ id, small }: { id: string; small?: boolean }) {
  const m = MARKING_MAP[id];
  if (!m) return null;
  return (
    <svg viewBox="0 0 200 100" width={small ? 160 : 240} height={small ? 80 : 120} role="img" aria-label={`Road marking: ${m.name}`} style={{ display: 'block', marginBottom: 20, border: '2px solid #0b0c0c' }}>
      {m.draw()}
    </svg>
  );
}
