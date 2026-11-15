import type { Difficulty, Question } from '../types';
import { CATEGORY_LABEL, SIGNS, type SignDef } from '../data/signs';
import { seeded, shuffle } from './random';

/**
 * Rule-based question generation engine.
 *
 * Questions are generated from structured rule data (sign meanings, the Highway Code
 * speed-limit table in rule 124, and the stopping-distance table in rule 126). Because
 * every answer comes straight from that data, the engine never has to guess an answer.
 * Each rule is asked in several wordings; questions that test the same rule share a
 * `ruleKey`, so a single session never includes two versions of the same rule.
 * IDs are deterministic, so attempt history stays attached to the right question.
 */

/** Put the correct answer among distractors in a stable, shuffled order. */
function arrange(id: string, correct: [string, string], distractors: [string, string][]) {
  const rnd = seeded(id);
  const all = shuffle([correct, ...distractors], rnd);
  return {
    options: all.map((o) => o[0]),
    optionNotes: all.map((o) => o[1]),
    correct: [all.indexOf(correct)],
  };
}

function pickDistractors(sign: SignDef, n: number): SignDef[] {
  const rnd = seeded('d-' + sign.id);
  const same = shuffle(SIGNS.filter((s) => s.id !== sign.id && s.category === sign.category), rnd);
  const other = shuffle(SIGNS.filter((s) => s.id !== sign.id && s.category !== sign.category), rnd);
  return [...same.slice(0, 2), ...other].slice(0, n);
}

function signDifficulty(s: SignDef): Difficulty {
  if (['stop', 'give-way', 'no-entry', 'speed-30', 'speed-20', 'ahead-only', 'parking'].includes(s.id)) return 'easy';
  if (['no-waiting', 'no-stopping', 'end-min-speed', 'min-speed-30', 'no-vehicles', 'two-way', 'countdown', 'no-through-road', 'one-way'].includes(s.id)) return 'hard';
  return 'medium';
}

const SIGN_REF = 'Know Your Traffic Signs (GOV.UK) / Highway Code: Traffic signs';

function signQuestions(): Question[] {
  const out: Question[] = [];
  for (const s of SIGNS) {
    const ds = pickDistractors(s, 3);
    const tip = s.tip ? ` ${s.tip}` : '';

    // Variant A – what does this sign mean?
    const idA = `GEN-SIGN-${s.id}-A`;
    const a = arrange(idA, [s.meaning, `Correct. This is the "${s.name}" sign: ${s.look}.`],
      ds.map((d) => [d.meaning, `That sign looks different: ${d.look}.`]));
    out.push({
      id: idA, topic: 'signs', difficulty: signDifficulty(s), kind: 'generated',
      text: 'What does this sign mean?', sign: s.id, ...a,
      explanation: `This sign is a ${s.look}. It means: ${s.meaning}.${tip}`,
      rule: `${s.look} → ${s.meaning}.`,
      source: { kind: 'generated', ref: SIGN_REF }, tags: ['road-signs', s.category], ruleKey: `sign-${s.id}`,
    });

    // Variant B – which sign means …? (picture answers)
    const idB = `GEN-SIGN-${s.id}-B`;
    const rnd = seeded(idB);
    const pics = shuffle([s, ...ds], rnd);
    out.push({
      id: idB, topic: 'signs', difficulty: signDifficulty(s), kind: 'generated',
      text: `Which of these signs means "${s.meaning}"?`,
      options: pics.map((_, i) => `Sign ${'ABCD'[i]}`),
      optionSigns: pics.map((p) => p.id),
      optionNotes: pics.map((p) => (p.id === s.id ? `Correct. ${s.look}.` : `This sign means "${p.meaning}".`)),
      correct: [pics.indexOf(s)],
      explanation: `The "${s.meaning}" sign is a ${s.look}.${tip}`,
      rule: `${s.meaning} = ${s.look}.`,
      source: { kind: 'generated', ref: SIGN_REF }, tags: ['road-signs', s.category], ruleKey: `sign-${s.id}`,
    });

    // Variant C – what type of instruction is this?
    const idC = `GEN-SIGN-${s.id}-C`;
    const cats = Object.entries(CATEGORY_LABEL).filter(([c]) => c !== s.category);
    const c = arrange(idC, [CATEGORY_LABEL[s.category], 'Correct. The shape and colour tell you the type of sign.'],
      shuffle(cats, seeded(idC + 'x')).slice(0, 3).map(([, label]) => [label, 'The shape and colour of this sign do not match this type.']));
    out.push({
      id: idC, topic: 'signs', difficulty: 'medium', kind: 'generated',
      text: 'What type of sign is this?', sign: s.id, ...c,
      explanation: `This is a ${s.look}, meaning "${s.meaning}". Triangles warn, red circles tell you what you must not do, blue circles tell you what you must do, and rectangles give information. STOP and GIVE WAY have their own shapes.`,
      rule: 'Circles command, triangles warn, rectangles inform.',
      source: { kind: 'generated', ref: SIGN_REF }, tags: ['road-signs', 'sign-shapes'], ruleKey: `signtype-${s.id}`,
    });
  }
  return out;
}

// ---------------- Speed limits (Highway Code rule 124)
interface SpeedRow { road: string; roadQ: string; car: number; towing: number }
const ROADS: SpeedRow[] = [
  { road: 'built-up', roadQ: 'a built-up area in England with street lights (unless signs show otherwise)', car: 30, towing: 30 },
  { road: 'single', roadQ: 'a single carriageway where the national speed limit applies', car: 60, towing: 50 },
  { road: 'dual', roadQ: 'a dual carriageway where the national speed limit applies', car: 70, towing: 60 },
  { road: 'motorway', roadQ: 'a motorway', car: 70, towing: 60 },
];
const SPEED_OPTIONS = [20, 30, 40, 50, 60, 70];
const SPEED_REF = 'Highway Code: Rule 124 (speed limits table)';

function speedQuestions(): Question[] {
  const out: Question[] = [];
  for (const r of ROADS) {
    for (const veh of ['car', 'towing'] as const) {
      const limit = r[veh];
      const who = veh === 'car' ? 'a car' : 'a car towing a caravan or trailer';
      const wordings = [
        `What is the national speed limit for ${who} on ${r.roadQ}?`,
        `You are driving ${who} on ${r.roadQ}. No other limit is shown. What is the maximum speed?`,
      ];
      wordings.forEach((text, w) => {
        const id = `GEN-SPEED-${veh}-${r.road}-${w}`;
        const rnd = seeded(id);
        const others = shuffle(SPEED_OPTIONS.filter((v) => v !== limit), rnd).slice(0, 3);
        const row = (v: number) => {
          const matches = ROADS.filter((x) => x.car === v).map((x) => `cars on ${x.road === 'built-up' ? 'built-up roads' : x.road === 'single' ? 'single carriageways' : x.road === 'dual' ? 'dual carriageways' : 'motorways'}`);
          return matches.length ? `${v} mph is the limit for ${matches.join(' and ')} – not this situation.` : `${v} mph is not the national limit here.`;
        };
        const a = arrange(id, [`${limit} mph`, 'Correct.'], others.map((v) => [`${v} mph`, row(v)]));
        out.push({
          id, topic: 'rules-of-road', difficulty: veh === 'towing' ? 'hard' : r.road === 'built-up' ? 'easy' : 'medium', kind: 'generated',
          text, ...a,
          explanation: `For ${who}, the limit on ${r.roadQ} is ${limit} mph. Cars: 30 built-up / 60 single / 70 dual / 70 motorway. Towing: 30 / 50 / 60 / 60.`,
          rule: 'Cars 30-60-70-70. Towing 30-50-60-60. A speed limit is a maximum, not a target.',
          example: r.road === 'built-up' ? 'In Wales, most roads with street lights now default to 20 mph.' : undefined,
          source: { kind: 'generated', ref: SPEED_REF }, tags: ['speed-limits'], ruleKey: `speed-${veh}-${r.road}`,
        });
      });
    }
  }
  out.push({
    id: 'GEN-SPEED-wales-0', topic: 'rules-of-road', difficulty: 'medium', kind: 'generated',
    text: 'In Wales, what is the default speed limit on most restricted roads (roads with street lights) in built-up areas?',
    ...arrange('GEN-SPEED-wales-0', ['20 mph', 'Correct. Wales changed its default from 30 mph to 20 mph in September 2023.'], [
      ['30 mph', 'This is the default in England and Scotland, and on some Welsh roads that are signed 30.'],
      ['40 mph', 'Not a default limit.'], ['15 mph', 'Not a UK limit.']]),
    explanation: 'Since September 2023 the default limit on restricted roads in Wales is 20 mph. Some roads are signed at 30 mph. Always follow the signs.',
    rule: 'Wales default on restricted roads: 20 mph. England and Scotland: 30 mph.',
    source: { kind: 'generated', ref: 'GOV.WALES: Introducing 20mph speed limits' }, tags: ['speed-limits'], ruleKey: 'speed-wales',
  });
  return out;
}

// ---------------- Stopping distances (Highway Code rule 126)
const STOP = [
  { mph: 20, think: 6, brake: 6, total: 12, cars: 3 },
  { mph: 30, think: 9, brake: 14, total: 23, cars: 6 },
  { mph: 40, think: 12, brake: 24, total: 36, cars: 9 },
  { mph: 50, think: 15, brake: 38, total: 53, cars: 13 },
  { mph: 60, think: 18, brake: 55, total: 73, cars: 18 },
  { mph: 70, think: 21, brake: 75, total: 96, cars: 24 },
];
const STOP_REF = 'Highway Code: Rule 126 (typical stopping distances)';

function stoppingQuestions(): Question[] {
  const out: Question[] = [];
  const table = 'Typical stopping distances (dry road, good car): 20 mph 12 m · 30 mph 23 m · 40 mph 36 m · 50 mph 53 m · 60 mph 73 m · 70 mph 96 m.';
  for (const row of STOP) {
    const kinds = [
      { k: 'total', text: [`In good, dry conditions, what is the typical overall stopping distance at ${row.mph} mph?`, `You are driving at ${row.mph} mph on a dry road. Roughly how far will it take you to stop (thinking plus braking)?`] },
      { k: 'think', text: [`What is the typical thinking distance at ${row.mph} mph?`] },
      { k: 'brake', text: [`On a dry road, what is the typical braking distance at ${row.mph} mph?`] },
    ] as const;
    for (const kind of kinds) {
      kind.text.forEach((text, w) => {
        const id = `GEN-STOP-${kind.k}-${row.mph}-${w}`;
        const value = row[kind.k];
        const pool = Array.from(new Set(STOP.map((r) => r[kind.k]).concat(STOP.map((r) => r.total)))).filter((v) => v !== value);
        const rnd = seeded(id);
        const near = pool.sort((a, b) => Math.abs(a - value) - Math.abs(b - value)).slice(0, 5);
        const ds = shuffle(near, rnd).slice(0, 3);
        const note = (v: number) => {
          const t = STOP.find((r) => r.total === v);
          if (t) return `${v} m is the overall stopping distance at ${t.mph} mph.`;
          const th = STOP.find((r) => r.think === v);
          if (th) return `${v} m is the thinking distance at ${th.mph} mph.`;
          const b = STOP.find((r) => r.brake === v);
          if (b) return `${v} m is the braking distance at ${b.mph} mph.`;
          return 'Not the correct figure.';
        };
        const a = arrange(id, [`${value} metres`, 'Correct.'], ds.map((v) => [`${v} metres`, note(v)]));
        out.push({
          id, topic: 'safety-margins', difficulty: kind.k === 'total' && (row.mph === 30 || row.mph === 70) ? 'medium' : 'hard', kind: 'generated',
          text, ...a,
          explanation: `At ${row.mph} mph: thinking ${row.think} m + braking ${row.brake} m = ${row.total} m overall (about ${row.cars} car lengths). ${table}`,
          rule: 'Stopping distance = thinking distance + braking distance. In the wet it at least doubles; on ice it can be ten times greater.',
          example: kind.k === 'think' ? 'Thinking distance is roughly 0.3 m for every 1 mph – it grows if you are tired, distracted or have been drinking.' : undefined,
          source: { kind: 'generated', ref: STOP_REF }, tags: ['stopping-distance'], ruleKey: `stop-${kind.k}-${row.mph}`,
        });
      });
    }
  }
  out.push({
    id: 'GEN-STOP-def-0', topic: 'safety-margins', difficulty: 'easy', kind: 'generated',
    text: 'What makes up the overall stopping distance?',
    ...arrange('GEN-STOP-def-0', ['Thinking distance plus braking distance', 'Correct.'], [
      ['Braking distance only', 'You travel a distance before you even press the brake.'],
      ['Thinking distance only', 'You still need to brake to stop.'],
      ['The two-second gap', 'That is a following gap, not stopping distance.']]),
    explanation: 'Overall stopping distance is the distance travelled while you react (thinking) plus the distance travelled while braking.',
    rule: 'Stopping = Thinking + Braking.', source: { kind: 'generated', ref: STOP_REF }, tags: ['stopping-distance'], ruleKey: 'stop-def',
  });
  out.push({
    id: 'GEN-STOP-tired-0', topic: 'safety-margins', difficulty: 'medium', kind: 'generated',
    text: 'You are tired. Which part of your stopping distance is most likely to increase?',
    ...arrange('GEN-STOP-tired-0', ['Thinking distance', 'Correct. Your reactions are slower.'], [
      ['Braking distance', 'Braking distance depends on speed, road, tyres and brakes.'],
      ['Neither – tiredness has no effect', 'It does have an effect.'],
      ['The distance needed to accelerate', 'Not relevant.']]),
    explanation: 'Tiredness, alcohol, drugs and distractions slow your reactions, increasing thinking distance.',
    rule: 'Slow reactions → longer thinking distance.', source: { kind: 'generated', ref: STOP_REF }, tags: ['stopping-distance', 'tiredness'], ruleKey: 'stop-tired',
  });
  return out;
}

let cache: Question[] | null = null;
export function generatedQuestions(): Question[] {
  if (!cache) cache = [...signQuestions(), ...speedQuestions(), ...stoppingQuestions()];
  return cache;
}
