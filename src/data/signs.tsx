import type { ReactElement } from 'react';

/**
 * Simplified drawings of UK road signs, based on the shapes and colours in
 * "Know Your Traffic Signs" (GOV.UK). They are learning illustrations, not exact
 * reproductions.
 */
export type SignCategory = 'warning' | 'prohibitive' | 'mandatory' | 'info' | 'priority';

export interface SignDef {
  id: string;
  name: string;
  meaning: string;
  category: SignCategory;
  look: string;
  tip?: string;
  draw: () => ReactElement;
}

const RED = '#c8102e';
const BLUE = '#1d5aa8';
const BLK = '#0b0c0c';

const tri = (sym: ReactElement) => (
  <>
    <polygon points="50,7 94,86 6,86" fill="#fff" stroke={RED} strokeWidth="8" strokeLinejoin="round" />
    {sym}
  </>
);
const ring = (sym?: ReactElement) => (
  <>
    <circle cx="50" cy="50" r="42" fill="#fff" stroke={RED} strokeWidth="10" />
    {sym}
  </>
);
const blue = (sym: ReactElement) => (
  <>
    <circle cx="50" cy="50" r="46" fill={BLUE} />
    {sym}
  </>
);
const square = (sym: ReactElement) => (
  <>
    <rect x="8" y="8" width="84" height="84" rx="6" fill={BLUE} stroke="#fff" strokeWidth="3" />
    {sym}
  </>
);
const bar = <line x1="22" y1="22" x2="78" y2="78" stroke={RED} strokeWidth="9" />;
const txt = (t: string, size = 38, fill = BLK, y = 63) => (
  <text x="50" y={y} textAnchor="middle" fontFamily="Arial, sans-serif" fontWeight="bold" fontSize={size} fill={fill}>
    {t}
  </text>
);

/** Arc arrow going clockwise from a0 to a1 (degrees). */
function arcArrow(cx: number, cy: number, r: number, a0: number, a1: number, color: string, w = 6) {
  const rad = (d: number) => (d * Math.PI) / 180;
  const p = (a: number) => [cx + r * Math.cos(rad(a)), cy + r * Math.sin(rad(a))];
  const [x0, y0] = p(a0);
  const [x1, y1] = p(a1);
  const tx = -Math.sin(rad(a1));
  const ty = Math.cos(rad(a1));
  const nx = Math.cos(rad(a1));
  const ny = Math.sin(rad(a1));
  const h = w * 1.4;
  const tip = [x1 + tx * h * 1.3, y1 + ty * h * 1.3];
  const l = [x1 + nx * h, y1 + ny * h];
  const rr = [x1 - nx * h, y1 - ny * h];
  return (
    <g key={`${a0}`}>
      <path d={`M${x0} ${y0} A${r} ${r} 0 0 1 ${x1} ${y1}`} stroke={color} strokeWidth={w} fill="none" />
      <polygon points={`${tip[0]},${tip[1]} ${l[0]},${l[1]} ${rr[0]},${rr[1]}`} fill={color} />
    </g>
  );
}

const person = (x: number, y: number, s = 1, color = BLK) => (
  <g transform={`translate(${x} ${y}) scale(${s})`} fill={color} stroke={color} strokeLinecap="round">
    <circle cx="0" cy="-22" r="4.5" stroke="none" />
    <line x1="0" y1="-17" x2="-1" y2="-3" strokeWidth="5" />
    <line x1="-1" y1="-3" x2="-7" y2="10" strokeWidth="4.5" />
    <line x1="-1" y1="-3" x2="6" y2="10" strokeWidth="4.5" />
    <line x1="0" y1="-14" x2="-7" y2="-6" strokeWidth="4" />
    <line x1="0" y1="-14" x2="7" y2="-7" strokeWidth="4" />
  </g>
);
const bike = (color: string) => (
  <g stroke={color} strokeWidth="4" fill="none" strokeLinecap="round">
    <circle cx="32" cy="60" r="11" />
    <circle cx="68" cy="60" r="11" />
    <path d="M32 60 L45 42 L60 42 L68 60 M45 42 L52 60 L60 42 M43 36 L50 36 M58 36 L64 36 L60 42" />
  </g>
);
const carRear = (x: number, color: string) => (
  <g fill={color}>
    <rect x={x} y="44" width="22" height="14" rx="3" />
    <rect x={x + 3} y="36" width="16" height="10" rx="3" />
    <rect x={x + 1} y="57" width="5" height="6" />
    <rect x={x + 16} y="57" width="5" height="6" />
  </g>
);

export const SIGNS: SignDef[] = [
  // ---------- Warning (red triangles)
  { id: 'crossroads', name: 'Crossroads ahead', meaning: 'Crossroads ahead', category: 'warning', look: 'red triangle with a cross (+)',
    draw: () => tri(<g fill={BLK}><rect x="46" y="38" width="8" height="42" /><rect x="30" y="55" width="40" height="8" /></g>) },
  { id: 't-junction', name: 'T-junction ahead', meaning: 'T-junction ahead – the road you are on ends', category: 'warning', look: 'red triangle with a T shape',
    draw: () => tri(<g fill={BLK}><rect x="46" y="50" width="8" height="30" /><rect x="28" y="42" width="44" height="8" /></g>) },
  { id: 'side-road', name: 'Side road on the right', meaning: 'Side road joining from the right ahead', category: 'warning', look: 'red triangle with a vertical line and a branch to the right',
    draw: () => tri(<g fill={BLK}><rect x="43" y="36" width="8" height="44" /><rect x="51" y="54" width="20" height="8" /></g>) },
  { id: 'bend-right', name: 'Bend to the right', meaning: 'Bend to the right ahead', category: 'warning', look: 'red triangle with a line curving right',
    draw: () => tri(<path d="M42 82 L42 60 Q42 44 62 40" stroke={BLK} strokeWidth="8" fill="none" />) },
  { id: 'double-bend', name: 'Double bend, first to the left', meaning: 'Double bend ahead, first to the left', category: 'warning', look: 'red triangle with an S-shaped line',
    draw: () => tri(<path d="M54 82 C54 70 38 70 40 58 C42 48 58 50 56 36" stroke={BLK} strokeWidth="7" fill="none" />) },
  { id: 'roundabout-ahead', name: 'Roundabout ahead', meaning: 'Roundabout ahead', category: 'warning', look: 'red triangle with three arrows in a circle',
    draw: () => tri(<g>{[200, 320, 80].map((a) => arcArrow(50, 62, 13, a, a + 75, BLK, 5))}</g>) },
  { id: 'traffic-signals', name: 'Traffic signals ahead', meaning: 'Traffic signals (traffic lights) ahead', category: 'warning', look: 'red triangle with a set of traffic lights',
    draw: () => tri(<g><rect x="40" y="35" width="20" height="46" rx="3" fill={BLK} /><circle cx="50" cy="44" r="5.5" fill="#e4002b" /><circle cx="50" cy="58" r="5.5" fill="#ffb81c" /><circle cx="50" cy="72" r="5.5" fill="#00a651" /></g>) },
  { id: 'road-narrows', name: 'Road narrows on both sides', meaning: 'Road narrows on both sides ahead', category: 'warning', look: 'red triangle with two lines getting closer together',
    draw: () => tri(<g stroke={BLK} strokeWidth="6" fill="none"><path d="M34 82 L34 66 L44 52 L44 38" /><path d="M66 82 L66 66 L56 52 L56 38" /></g>) },
  // 'Two-way traffic straight ahead' removed in the content audit: the arrow layout could not be verified against Know Your Traffic Signs.
  { id: 'steep-hill-down', name: 'Steep hill downwards', meaning: 'Steep hill downwards (10% gradient)', category: 'warning', look: 'red triangle with a downward slope and "10%"',
    draw: () => tri(<g><path d="M24 58 L76 80 L24 80 Z" fill={BLK} />{txt('10%', 14, BLK, 56)}</g>) },
  { id: 'uneven-road', name: 'Uneven road', meaning: 'Uneven road surface ahead', category: 'warning', look: 'red triangle with a bumpy line',
    draw: () => tri(<g><path d="M22 72 Q31 58 40 72 Q49 58 58 72 Q67 58 76 72" stroke={BLK} strokeWidth="6" fill="none" /><rect x="22" y="76" width="56" height="5" fill={BLK} /></g>) },
  { id: 'pedestrians', name: 'Pedestrians in road ahead', meaning: 'Pedestrians in the road ahead', category: 'warning', look: 'red triangle with one walking person',
    draw: () => tri(person(50, 70, 1.1)) },
  { id: 'children', name: 'Children going to or from school', meaning: 'Children going to or from school or a playground ahead', category: 'warning', look: 'red triangle with two children (one taller)',
    draw: () => tri(<g>{person(42, 70, 1)}{person(60, 72, 0.8)}</g>) },
  { id: 'road-works', name: 'Road works', meaning: 'Road works ahead', category: 'warning', look: 'red triangle with a person digging beside a pile',
    draw: () => tri(<g>{person(44, 70, 1)}<polygon points="56,80 76,80 66,66" fill={BLK} /><line x1="52" y1="62" x2="62" y2="76" stroke={BLK} strokeWidth="3" /></g>) },
  { id: 'other-danger', name: 'Other danger', meaning: 'Other danger – a plate below may say what it is', category: 'warning', look: 'red triangle with an exclamation mark',
    draw: () => tri(<g fill={BLK}><rect x="46" y="36" width="8" height="30" rx="2" /><circle cx="50" cy="75" r="5" /></g>) },
  { id: 'level-crossing-barrier', name: 'Level crossing with barrier or gate', meaning: 'Level crossing with a barrier or gate ahead', category: 'warning', look: 'red triangle with a gate or fence',
    draw: () => tri(<g fill={BLK}><rect x="26" y="52" width="48" height="6" /><rect x="26" y="66" width="48" height="6" /><rect x="30" y="46" width="6" height="34" /><rect x="64" y="46" width="6" height="34" /></g>) },

  // ---------- Priority
  { id: 'stop', name: 'Stop and give way', meaning: 'Stop and give way', category: 'priority', look: 'red octagon with the word STOP',
    tip: 'The only eight-sided sign, so it can be recognised even from behind or covered in snow.',
    draw: () => (<><polygon points="30,4 70,4 96,30 96,70 70,96 30,96 4,70 4,30" fill={RED} stroke="#fff" strokeWidth="3" />{txt('STOP', 28, '#fff', 60)}</>) },
  { id: 'give-way', name: 'Give way to traffic on the major road', meaning: 'Give way to traffic on the major road', category: 'priority', look: 'upside-down red triangle saying GIVE WAY',
    draw: () => (<><polygon points="6,12 94,12 50,92" fill="#fff" stroke={RED} strokeWidth="8" strokeLinejoin="round" />{txt('GIVE', 13, BLK, 36)}{txt('WAY', 13, BLK, 50)}</>) },

  // ---------- Prohibitive (red circles)
  { id: 'speed-20', name: 'Maximum speed 20 mph', meaning: 'Maximum speed limit 20 mph', category: 'prohibitive', look: 'red circle with 20', draw: () => ring(txt('20')) },
  { id: 'speed-30', name: 'Maximum speed 30 mph', meaning: 'Maximum speed limit 30 mph', category: 'prohibitive', look: 'red circle with 30', draw: () => ring(txt('30')) },
  { id: 'speed-40', name: 'Maximum speed 40 mph', meaning: 'Maximum speed limit 40 mph', category: 'prohibitive', look: 'red circle with 40', draw: () => ring(txt('40')) },
  { id: 'speed-50', name: 'Maximum speed 50 mph', meaning: 'Maximum speed limit 50 mph', category: 'prohibitive', look: 'red circle with 50', draw: () => ring(txt('50')) },
  { id: 'no-entry', name: 'No entry for vehicular traffic', meaning: 'No entry for vehicular traffic', category: 'prohibitive', look: 'solid red circle with a white horizontal bar',
    draw: () => (<><circle cx="50" cy="50" r="46" fill={RED} /><rect x="18" y="42" width="64" height="16" fill="#fff" /></>) },
  { id: 'no-right-turn', name: 'No right turn', meaning: 'No right turn', category: 'prohibitive', look: 'red circle with a right-turn arrow crossed out',
    draw: () => ring(<g><path d="M40 80 L40 50 Q40 42 48 42 L60 42" stroke={BLK} strokeWidth="8" fill="none" /><polygon points="58,31 74,42 58,53" fill={BLK} />{bar}</g>) },
  { id: 'no-left-turn', name: 'No left turn', meaning: 'No left turn', category: 'prohibitive', look: 'red circle with a left-turn arrow crossed out',
    draw: () => ring(<g><path d="M60 80 L60 50 Q60 42 52 42 L40 42" stroke={BLK} strokeWidth="8" fill="none" /><polygon points="42,31 26,42 42,53" fill={BLK} />{bar}</g>) },
  { id: 'no-u-turn', name: 'No U-turns', meaning: 'No U-turns', category: 'prohibitive', look: 'red circle with a U-shaped arrow crossed out',
    draw: () => ring(<g><path d="M62 80 L62 46 Q62 32 49 32 Q36 32 36 46 L36 58" stroke={BLK} strokeWidth="7" fill="none" /><polygon points="26,56 46,56 36,70" fill={BLK} />{bar}</g>) },
  { id: 'no-overtaking', name: 'No overtaking', meaning: 'No overtaking', category: 'prohibitive', look: 'red circle with a black car and a red car side by side',
    draw: () => ring(<g>{carRear(24, BLK)}{carRear(54, RED)}</g>) },
  { id: 'no-vehicles', name: 'No vehicles', meaning: 'No vehicles except bicycles being pushed', category: 'prohibitive', look: 'plain red circle with a white centre and nothing inside',
    draw: () => ring() },
  { id: 'no-cycling', name: 'No cycling', meaning: 'No cycling', category: 'prohibitive', look: 'red circle with a bicycle',
    draw: () => ring(bike(BLK)) },
  { id: 'no-pedestrians', name: 'No pedestrians', meaning: 'No pedestrians', category: 'prohibitive', look: 'red circle with a walking person',
    draw: () => ring(person(50, 64, 1.1)) },
  { id: 'national-speed-limit', name: 'National speed limit applies', meaning: 'National speed limit applies', category: 'prohibitive', look: 'white circle with a black diagonal band',
    tip: 'For a car: 60 mph on single carriageways, 70 mph on dual carriageways and motorways.',
    draw: () => (<><circle cx="50" cy="50" r="45" fill="#fff" stroke={BLK} strokeWidth="2" /><line x1="80" y1="20" x2="20" y2="80" stroke={BLK} strokeWidth="14" /></>) },
  { id: 'no-waiting', name: 'No waiting', meaning: 'No waiting', category: 'prohibitive', look: 'blue circle with a red border and one red diagonal line',
    draw: () => (<><circle cx="50" cy="50" r="42" fill={BLUE} stroke={RED} strokeWidth="10" /><line x1="22" y1="22" x2="78" y2="78" stroke={RED} strokeWidth="9" /></>) },
  { id: 'no-stopping', name: 'No stopping (clearway)', meaning: 'No stopping (clearway)', category: 'prohibitive', look: 'blue circle with a red border and a red X',
    draw: () => (<><circle cx="50" cy="50" r="42" fill={BLUE} stroke={RED} strokeWidth="10" /><line x1="22" y1="22" x2="78" y2="78" stroke={RED} strokeWidth="9" /><line x1="78" y1="22" x2="22" y2="78" stroke={RED} strokeWidth="9" /></>) },

  // ---------- Mandatory (blue circles)
  { id: 'ahead-only', name: 'Ahead only', meaning: 'Ahead only', category: 'mandatory', look: 'blue circle with a white arrow pointing straight up',
    draw: () => blue(<g fill="#fff"><rect x="45" y="40" width="10" height="40" /><polygon points="50,18 32,42 68,42" /></g>) },
  { id: 'turn-left-ahead', name: 'Turn left ahead', meaning: 'Turn left ahead', category: 'mandatory', look: 'blue circle with a white arrow bending to the left',
    draw: () => blue(<g><path d="M60 82 L60 52 Q60 42 50 42 L40 42" stroke="#fff" strokeWidth="10" fill="none" /><polygon points="42,28 22,42 42,56" fill="#fff" /></g>) },
  { id: 'keep-left', name: 'Keep left', meaning: 'Keep left', category: 'mandatory', look: 'blue circle with a white arrow pointing diagonally down to the left',
    draw: () => blue(<g><line x1="70" y1="30" x2="40" y2="60" stroke="#fff" strokeWidth="10" /><polygon points="26,74 32,46 54,68" fill="#fff" /></g>) },
  { id: 'mini-roundabout', name: 'Mini-roundabout', meaning: 'Mini-roundabout (roundabout circulation – give way to traffic from the immediate right)', category: 'mandatory', look: 'blue circle with three white arrows going round clockwise',
    tip: 'The arrows go clockwise, because traffic goes clockwise round UK roundabouts.',
    draw: () => blue(<g>{[200, 320, 80].map((a) => arcArrow(50, 50, 22, a, a + 80, '#fff', 7))}</g>) },
  { id: 'min-speed-30', name: 'Minimum speed', meaning: 'Minimum speed 30 mph', category: 'mandatory', look: 'blue circle with a white 30',
    draw: () => blue(txt('30', 38, '#fff')) },
  { id: 'end-min-speed', name: 'End of minimum speed', meaning: 'End of minimum speed', category: 'mandatory', look: 'blue circle with a white 30 and a red diagonal line',
    draw: () => blue(<g>{txt('30', 38, '#fff')}<line x1="80" y1="20" x2="20" y2="80" stroke={RED} strokeWidth="7" /></g>) },
  { id: 'cycles-only', name: 'Route for pedal cycles only', meaning: 'Route to be used by pedal cycles only', category: 'mandatory', look: 'blue circle with a white bicycle',
    draw: () => blue(bike('#fff')) },

  // ---------- Information (rectangles)
  { id: 'one-way', name: 'One-way traffic', meaning: 'One-way traffic', category: 'info', look: 'blue rectangle with a white arrow pointing up',
    tip: 'Note the difference from "Ahead only", which is a blue CIRCLE.',
    draw: () => (<><rect x="24" y="6" width="52" height="88" rx="4" fill={BLUE} stroke="#fff" strokeWidth="3" /><rect x="45" y="36" width="10" height="48" fill="#fff" /><polygon points="50,14 34,38 66,38" fill="#fff" /></>) },
  { id: 'parking', name: 'Parking place', meaning: 'Parking place', category: 'info', look: 'blue square with a white P', draw: () => square(txt('P', 56, '#fff', 70)) },
  { id: 'hospital', name: 'Hospital ahead with A&E', meaning: 'Hospital ahead', category: 'info', look: 'blue square with a white H', draw: () => square(txt('H', 56, '#fff', 70)) },
  { id: 'no-through-road', name: 'No through road', meaning: 'No through road for vehicles', category: 'info', look: 'blue square with a white upright bar topped by a red bar',
    draw: () => square(<g><rect x="44" y="36" width="12" height="48" fill="#fff" /><rect x="26" y="22" width="48" height="14" fill={RED} /></g>) },
  { id: 'countdown', name: 'Countdown markers (motorway exit)', meaning: '300 yards to the next exit (countdown marker)', category: 'info', look: 'blue upright rectangle with three white diagonal bars',
    draw: () => (<><rect x="30" y="4" width="40" height="92" fill={BLUE} />{[22, 48, 74].map((y) => <polygon key={y} points={`30,${y + 8} 70,${y - 6} 70,${y + 2} 30,${y + 16}`} fill="#fff" />)}</>) },
];

export const SIGN_MAP: Record<string, SignDef> = Object.fromEntries(SIGNS.map((s) => [s.id, s]));

export const CATEGORY_LABEL: Record<SignCategory, string> = {
  warning: 'A warning (triangle)',
  prohibitive: 'An order – something you must not do (red circle)',
  mandatory: 'An order – something you must do (blue circle)',
  info: 'Information (rectangle)',
  priority: 'Priority at a junction (stop or give way)',
};
