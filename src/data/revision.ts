import type { TopicId } from '../types';

export interface RevisionCard {
  id: string;
  title: string;
  topic: TopicId;
  points: string[];
  trick: string;
  example?: string;
  visual?: 'stopping' | 'speed' | 'signs' | 'crossings' | 'studs' | 'lights' | 'markings';
  tags?: string[];
  qids?: string[];
}

export const REVISION_CARDS: RevisionCard[] = [
  {
    id: 'signs', title: 'Important traffic signs', topic: 'signs', visual: 'signs', tags: ['road-signs', 'sign-shapes'],
    points: ['Red circle: you must NOT. Blue circle: you MUST. Triangle: warning. Rectangle: information.', 'STOP is the only octagon. GIVE WAY is the only upside-down triangle.', 'National speed limit: white circle with a black diagonal band.'],
    trick: 'Circles Command, Triangles Tell you of danger, Rectangles Reveal information.',
  },
  {
    id: 'markings', title: 'Road markings', topic: 'signs', visual: 'markings', tags: ['markings'],
    points: ['Solid white line on your side: do not cross (limited exceptions).', 'Long lines, short gaps: hazard warning line.', 'Double yellow: no waiting at any time. Single yellow: times on the plate.', 'Hatched area with solid border: do not enter except in an emergency.', 'White zig-zags: crossing – no parking or overtaking. Yellow zig-zags: school – keep clear.'],
    trick: 'The more paint, the bigger the warning.',
  },
  {
    id: 'lights', title: 'Traffic light sequence', topic: 'signs', visual: 'lights', tags: ['traffic-lights'],
    points: ['Red → Red + Amber → Green → Amber → Red.', 'Red + Amber: stop – do not move until green.', 'Amber alone: stop unless you have crossed the line or are too close to stop safely.', 'Green filter arrow: you may go that way if clear.'],
    trick: 'Amber never appears alone after red – after red comes red AND amber together.',
  },
  {
    id: 'speed', title: 'Speed limits', topic: 'rules-of-road', visual: 'speed', tags: ['speed-limits'],
    points: ['Cars: 30 built-up, 60 single carriageway, 70 dual carriageway, 70 motorway.', 'Towing a caravan or trailer: 30, 50, 60, 60.', 'Wales: most restricted roads default to 20 mph.', 'A limit is a maximum, not a target.'],
    trick: 'Cars "3-6-7-7". Towing "3-5-6-6".',
  },
  {
    id: 'stopping', title: 'Stopping distances', topic: 'safety-margins', visual: 'stopping', tags: ['stopping-distance'],
    points: ['Stopping distance = thinking distance + braking distance.', 'Thinking distance in metres ≈ speed × 0.3 (20 mph → 6 m, 70 mph → 21 m).', 'Wet: at least double. Ice: up to 10 times.'],
    trick: 'Totals: 12, 23, 36, 53, 73, 96 – "12 to 96, add a bit more every 10 mph". At 70 mph you need almost 100 m – the length of a football pitch.',
  },
  {
    id: 'gap', title: 'Following distance', topic: 'safety-margins', tags: ['following-distance'],
    points: ['Two-second gap in good conditions.', 'At least four seconds in the wet.', 'Up to ten times more on ice.', 'Being tailgated? Increase the gap in front of you.'],
    trick: '"Only a fool breaks the two-second rule" takes two seconds to say.',
  },
  {
    id: 'motorway', title: 'Motorway rules', topic: 'motorway', visual: 'studs', tags: ['motorway-users', 'lanes', 'breakdown', 'smart-motorway', 'studs', 'signals', 'hard-shoulder'],
    points: ['Keep left unless overtaking.', 'Red X: lane closed. Red-ringed speed on a gantry: mandatory.', 'Breakdown: hazard lights, exit left, behind the barrier, call. No warning triangle.', 'Studs: red left, white lanes, amber central reservation, green slip roads.', 'No general minimum speed on UK motorways.'],
    trick: 'Studs: "Red is on the Road edge (left), Amber is by the Armco barrier (right)".',
  },
  {
    id: 'roundabouts', title: 'Roundabouts', topic: 'rules-of-road', tags: ['roundabouts'],
    points: ['Give way to traffic from the right.', 'Traffic goes clockwise – the mini-roundabout sign arrows go clockwise.', 'Cyclists and horse riders may stay in the left lane while going right round.', 'Long vehicles may take two lanes.'],
    trick: 'Look RIGHT, go LEFT (clockwise).',
  },
  {
    id: 'junctions', title: 'Junction priorities', topic: 'rules-of-road', tags: ['junctions'],
    points: ['Give way to pedestrians crossing or waiting to cross the road you are turning into (H2).', 'Do not cut across cyclists going straight ahead (H3).', 'Unmarked crossroads: no one has priority.', 'Box junction: exit must be clear (except turning right blocked by oncoming traffic).', 'Lights not working: treat as an unmarked junction.'],
    trick: 'Turning? People first, then bikes, then you.',
  },
  {
    id: 'crossings', title: 'Pedestrian crossings', topic: 'rules-of-road', visual: 'crossings', tags: ['crossings'],
    points: ['Zebra: give way to people waiting; you must give way once they step on.', 'Pelican: flashing amber – give way to people still crossing.', 'Puffin: sensors, no flashing amber.', 'Toucan: pedestrians and cyclists. Pegasus/equestrian: horse riders.', 'No parking or overtaking on zig-zags.'],
    trick: 'TOUCAN = "two can" cross (walkers and cyclists).',
  },
  {
    id: 'vulnerable', title: 'Vulnerable road users', topic: 'vulnerable', tags: ['cyclists', 'horses', 'pedestrians', 'hierarchy'],
    points: ['Cyclists: at least 1.5 m at up to 30 mph.', 'Horses: under 10 mph, at least 2 m.', 'Pedestrians walking in the road: at least 2 m.', 'White stick with red bands: deaf and blind.', 'Mobility scooters: up to 8 mph on the road.'],
    trick: '1.5 – 2 – 10: cyclist gap, horse gap, horse speed.',
  },
  {
    id: 'emergencies', title: 'Emergencies and first aid', topic: 'incidents', tags: ['first-aid', 'breakdown', 'collisions', 'fire', 'tunnels'],
    points: ['DR ABC: Danger, Response, Airway, Breathing, Compressions.', 'Never give casualties a drink. Do not move them unless there is more danger.', 'Leave motorcyclists\' helmets on unless essential.', 'Burns: cool water at least 10 minutes.', 'CPR (adult): 5–6 cm, 100–120 a minute.', 'Warning triangle: 45 m behind – never on motorways.'],
    trick: '"Doctor ABC" – Danger comes first.',
  },
  {
    id: 'checks', title: 'Vehicle safety checks', topic: 'safety-vehicle', tags: ['tyres', 'brakes', 'seat-safety', 'maintenance'],
    points: ['Tyre tread: 1.6 mm minimum across the central three-quarters.', 'Check tyre pressures when cold.', 'Car pulls when braking: brake fault – get it checked.', 'Head restraint: top level with eyes/ears.', 'Do not open a hot radiator cap.'],
    trick: 'POWDER checks: Petrol, Oil, Water, Damage, Electrics, Rubber (tyres).',
  },
  {
    id: 'documents', title: 'Documents and legal requirements', topic: 'documents', tags: ['mot', 'insurance', 'tax', 'penalty-points', 'licence', 'v5c'],
    points: ['MOT: first at 3 years, then yearly.', 'Minimum insurance: third party.', 'New drivers: 6 points in 2 years = licence revoked.', 'Hand-held phone: 6 points + £200.', 'Tell DVLA about address changes. Tax does not transfer.'],
    trick: '3-year MOT, 6 points, 7 days to show documents.',
  },
  {
    id: 'confused', title: 'Commonly confused rules', topic: 'rules-of-road', qids: ['RR-05', 'RR-06', 'SG-04', 'VU-13', 'MW-07', 'SM-02', 'MW-05', 'VH-09'],
    points: ['Pelican (flashing amber) vs Puffin (no flashing amber).', 'Warning triangle 45 m vs never on motorways.', 'ABS: press firmly and hold – do not pump.', 'One-way: blue rectangle. Ahead only: blue circle.', 'No waiting: one red line. No stopping: red X.', 'Fog lights only under 100 m visibility.'],
    trick: 'If two rules look similar, find the ONE word that is different (flashing, motorway, rectangle).',
  },
];
