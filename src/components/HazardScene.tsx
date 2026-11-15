import type { HazardClip, HObj } from '../data/hazardClips';

function lerpKeys<T extends number[]>(keys: T[], t: number): number[] {
  if (t <= keys[0][0]) return keys[0].slice(1);
  for (let i = 1; i < keys.length; i++) {
    if (t <= keys[i][0]) {
      const [t0, ...a] = keys[i - 1];
      const [t1, ...b] = keys[i];
      const f = (t - t0) / (t1 - t0 || 1);
      return a.map((v, k) => v + (b[k] - v) * f);
    }
  }
  return keys[keys.length - 1].slice(1);
}

export function egoAt(clip: HazardClip, t: number): number {
  return lerpKeys(clip.ego, t)[0];
}

const EGO_Y = 250;

function Thing({ o, x, y, t }: { o: HObj; x: number; y: number; t: number }) {
  const rot = o.rot ?? 0;
  const brake = o.brakeFrom !== undefined && t >= o.brakeFrom;
  let body;
  switch (o.type) {
    case 'car':
    case 'van':
    case 'icecream':
    case 'tractor': {
      const w = o.type === 'car' ? 32 : o.type === 'tractor' ? 30 : 38;
      const h = o.type === 'car' ? 54 : o.type === 'tractor' ? 44 : 66;
      const fill = o.type === 'icecream' ? '#f499be' : o.type === 'tractor' ? '#00703c' : o.color ?? '#1d70b8';
      body = (
        <g>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="6" fill={fill} stroke="#0b0c0c" strokeWidth="2" />
          <rect x={-w / 2 + 4} y={-h / 2 + 8} width={w - 8} height={h * 0.22} rx="3" fill="#cfe3f3" />
          {brake && <><rect x={-w / 2 + 1} y={h / 2 - 5} width="8" height="5" fill="#ff1a1a" /><rect x={w / 2 - 9} y={h / 2 - 5} width="8" height="5" fill="#ff1a1a" /></>}
          {o.type === 'tractor' && <><rect x={-w / 2 - 5} y={6} width="8" height="18" fill="#0b0c0c" /><rect x={w / 2 - 3} y={6} width="8" height="18" fill="#0b0c0c" /></>}
        </g>
      );
      break;
    }
    case 'bus':
    case 'lorry':
      body = (
        <g>
          <rect x="-23" y="-55" width="46" height="110" rx="4" fill={o.type === 'lorry' ? '#505a5f' : o.color ?? '#d4351c'} stroke="#0b0c0c" strokeWidth="2" />
          <rect x="-19" y="-51" width="38" height="12" fill="#cfe3f3" />
        </g>
      );
      break;
    case 'cyclist':
      body = (<g><rect x="-3" y="-14" width="6" height="28" fill="#0b0c0c" /><circle cx="0" cy="-2" r="7" fill="#ffdd00" stroke="#0b0c0c" strokeWidth="2" /></g>);
      break;
    case 'horse':
      body = (<g><ellipse cx="0" cy="0" rx="9" ry="22" fill="#8b5a2b" stroke="#0b0c0c" strokeWidth="2" /><circle cx="0" cy="2" r="6" fill="#ffdd00" stroke="#0b0c0c" /></g>);
      break;
    case 'pedestrian':
      body = (<g><circle r="7" fill="#f47738" stroke="#0b0c0c" strokeWidth="2" /></g>);
      break;
    case 'child':
      body = (<g><circle r="5" fill="#d53880" stroke="#0b0c0c" strokeWidth="2" /></g>);
      break;
    case 'ball':
      body = <circle r="5" fill="#ffffff" stroke="#d4351c" strokeWidth="3" />;
      break;
    case 'dog':
      body = <ellipse rx="8" ry="4" fill="#6f4e37" stroke="#0b0c0c" strokeWidth="1.5" />;
      break;
    case 'door':
      body = <rect x="-2" y="-12" width="20" height="5" fill="#4c2c92" stroke="#0b0c0c" transform="rotate(25)" />;
      break;
  }
  return (
    <g transform={`translate(${x} ${y})`}>
      <g transform={`rotate(${rot})`}>{body}</g>
      {o.label && (
        <text y={o.type === 'bus' || o.type === 'lorry' ? -62 : -20} textAnchor="middle" fontSize="11" fontFamily="Arial" fontWeight="bold" fill="#fff" stroke="#0b0c0c" strokeWidth="3" paintOrder="stroke">
          {o.label}
        </text>
      )}
    </g>
  );
}

export default function HazardScene({ clip, t }: { clip: HazardClip; t: number }) {
  const ego = egoAt(clip, t);
  const sy = (wy: number) => EGO_Y - (wy - ego);
  const rural = clip.setting === 'rural';
  const dash = ((ego % 40) + 40) % 40;

  return (
    <svg viewBox="0 0 400 300" role="img" aria-label={`Simulated top-down view: ${clip.title}`}>
      <rect width="400" height="300" fill={rural ? '#6b8e4e' : '#b1b4b6'} />
      {!rural && <><rect x="70" width="30" height="300" fill="#d8d8d8" /><rect x="300" width="30" height="300" fill="#d8d8d8" /></>}
      <rect x="100" width="200" height="300" fill="#505a5f" />
      {(clip.sideRoads ?? []).map((r, i) => (
        <rect key={i} x={r.side === 'left' ? 0 : 300} y={sy(r.wy) - 22} width="100" height="44" fill="#505a5f" />
      ))}
      {clip.zebra !== undefined && (
        <g>{Array.from({ length: 10 }, (_, i) => <rect key={i} x={104 + i * 20} y={sy(clip.zebra!) - 14} width="10" height="28" fill="#fff" />)}</g>
      )}
      <line x1="200" x2="200" y1={-40 + dash} y2="340" stroke="#fff" strokeWidth="3" strokeDasharray="20 20" />
      {clip.objects.map((o, i) => {
        if (o.appear !== undefined && t < o.appear) return null;
        const [x, wy] = lerpKeys(o.keys, t);
        const y = sy(wy);
        if (y < -80 || y > 380) return null;
        return <Thing key={i} o={o} x={x} y={y} t={t} />;
      })}
      <g transform={`translate(162 ${EGO_Y})`}>
        <rect x="-16" y="-27" width="32" height="54" rx="6" fill="#ffffff" stroke="#0b0c0c" strokeWidth="3" />
        <rect x="-12" y="-19" width="24" height="11" rx="3" fill="#cfe3f3" />
        <text y="18" textAnchor="middle" fontSize="11" fontFamily="Arial" fontWeight="bold">YOU</text>
      </g>
      <text x="6" y="294" fontSize="10" fontFamily="Arial" fill="#0b0c0c">SIMULATION – not a DVSA clip</text>
    </svg>
  );
}
