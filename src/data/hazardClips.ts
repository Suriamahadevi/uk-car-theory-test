/**
 * SIMULATED hazard perception clips. These are animated top-down diagrams, not
 * real DVSA video clips. They teach timing: click when a hazard starts to DEVELOP.
 *
 * World coordinates: x across the road (left pavement 70–100, our lane 100–200,
 * oncoming lane 200–300, right pavement 300–330). wy is distance along the road;
 * larger wy = further ahead. The camera car's position over time is `ego`.
 */
export type ObjType = 'car' | 'van' | 'bus' | 'lorry' | 'cyclist' | 'pedestrian' | 'child' | 'ball' | 'horse' | 'dog' | 'tractor' | 'icecream' | 'door';

export interface HObj {
  type: ObjType;
  color?: string;
  label?: string;
  /** [time s, x, wy]; linear interpolation, held before first/after last key. */
  keys: [number, number, number][];
  /** Rotation in degrees (90 = facing across the road). */
  rot?: number;
  /** Show brake lights from this time. */
  brakeFrom?: number;
  /** Hidden before this time. */
  appear?: number;
}

export interface Hazard { start: number; end: number; what: string }

export interface HazardClip {
  id: string;
  title: string;
  setting: 'town' | 'rural';
  duration: number;
  ego: [number, number][];
  objects: HObj[];
  sideRoads?: { wy: number; side: 'left' | 'right' }[];
  zebra?: number;
  hazards: Hazard[];
  captions: [number, string][];
  potential: string[];
  lesson: string;
}

const P = (x: number, wy: number, type: ObjType = 'car', color?: string, label?: string): HObj => ({ type, color, label, keys: [[0, x, wy]] });

export const CLIPS: HazardClip[] = [
  {
    id: 'hp1', title: 'Residential street with parked cars', setting: 'town', duration: 18,
    ego: [[0, 0], [7, 210], [11, 270], [18, 330]],
    objects: [
      { type: 'child', label: 'Child', keys: [[0, 78, 400], [8, 78, 400], [9.5, 112, 402], [12, 170, 404], [14, 260, 406]] },
      { type: 'ball', keys: [[0, 88, 395], [6.5, 88, 395], [8, 180, 398], [9.5, 290, 400]], appear: 6.5 },
      P(118, 150, 'car', '#4c2c92'), P(118, 240, 'van', '#fff'), P(118, 330, 'car', '#28a197'), P(118, 450, 'car', '#b58840'),
    ],
    hazards: [{ start: 6.6, end: 11, what: 'A ball rolls out from between parked cars – a child is likely to follow it.' }],
    captions: [[0, 'Quiet residential street. Cars parked on the left.'], [6.6, 'A ball rolls into the road from between the parked cars.'], [8.2, 'A child runs out after the ball.']],
    potential: ['Parked cars hiding pedestrians', 'Car doors opening'],
    lesson: 'The ball is the first clue. Click as soon as it appears – do not wait for the child.',
  },
  {
    id: 'hp2', title: 'Bus stopped at a bus stop', setting: 'town', duration: 18,
    ego: [[0, 0], [8, 220], [12, 260], [18, 330]],
    objects: [
      { type: 'pedestrian', label: 'Pedestrian', keys: [[0, 130, 350], [7, 130, 350], [8, 140, 368], [10, 200, 370], [13, 300, 372]] },
      { type: 'bus', color: '#d4351c', label: 'Bus', keys: [[0, 126, 300]] },
      P(250, 700, 'car', '#1d70b8'),
    ],
    hazards: [{ start: 7.2, end: 11.5, what: 'A pedestrian steps out from in front of the stationary bus.' }],
    captions: [[0, 'Town road. A bus is stopped at a bus stop on the left.'], [7.2, 'Someone walks out from in front of the bus.']],
    potential: ['Bus pulling away', 'Passengers crossing behind or in front of the bus'],
    lesson: 'A stopped bus hides people. Click as soon as the pedestrian appears and starts to cross.',
  },
  {
    id: 'hp3', title: 'Car emerging from a side road', setting: 'town', duration: 17,
    ego: [[0, 0], [8, 240], [11.5, 290], [17, 380]],
    sideRoads: [{ wy: 430, side: 'left' }],
    objects: [
      { type: 'car', color: '#00703c', label: 'Car', rot: 90, keys: [[0, 60, 425], [8.5, 72, 425], [10, 130, 438], [11, 150, 470], [17, 150, 700]] },
      P(250, 900, 'car', '#505a5f'),
    ],
    hazards: [{ start: 8.4, end: 12.5, what: 'The car at the junction starts to pull out into your path.' }],
    captions: [[0, 'A side road joins from the left ahead. A car is waiting at the junction.'], [8.4, 'The car begins to move out of the junction.']],
    potential: ['Car waiting at the junction (potential)', 'Pedestrians crossing the side road'],
    lesson: 'The waiting car is only a potential hazard. Click when it starts to move.',
  },
  {
    id: 'hp4', title: 'Cyclist passing a parked car', setting: 'town', duration: 18,
    ego: [[0, 0], [9, 225], [13, 270], [18, 340]],
    objects: [
      { type: 'cyclist', label: 'Cyclist', keys: [[0, 125, 200], [9, 125, 335], [11, 170, 365], [15, 175, 425], [18, 130, 470]] },
      P(120, 410, 'car', '#912b88'),
    ],
    hazards: [{ start: 9, end: 13, what: 'The cyclist moves out to pass the parked car, into your path.' }],
    captions: [[0, 'A cyclist is riding ahead, near the kerb. There is a parked car further on.'], [9, 'The cyclist moves out to go round the parked car.']],
    potential: ['Cyclist ahead', 'Parked car'],
    lesson: 'Expect cyclists to move out around obstructions. Click as they begin to pull out.',
  },
  {
    id: 'hp5', title: 'Horse rider on a country lane', setting: 'rural', duration: 18,
    ego: [[0, 0], [9, 270], [13, 320], [18, 370]],
    objects: [
      { type: 'horse', label: 'Horse rider', keys: [[0, 130, 380], [18, 130, 470]], appear: 5 },
    ],
    hazards: [{ start: 8.6, end: 12.6, what: 'You are closing quickly on a horse rider and must slow right down to pass safely.' }],
    captions: [[0, 'Narrow country lane with no pavement.'], [5, 'A horse rider comes into view ahead, going the same way.'], [8.6, 'You are catching up quickly with the horse.']],
    potential: ['Bends hiding oncoming traffic', 'Animals in the road'],
    lesson: 'The horse becomes a developing hazard when you need to slow down to pass at under 10 mph, leaving 2 m.',
  },
  {
    id: 'hp6', title: 'Pedestrian approaching a zebra crossing', setting: 'town', duration: 16,
    ego: [[0, 0], [6, 180], [10, 230], [12, 236], [16, 300]],
    zebra: 350,
    objects: [
      { type: 'pedestrian', label: 'Pedestrian', keys: [[0, 85, 260], [6, 85, 345], [7.5, 88, 350], [8.5, 110, 350], [12, 290, 350]] },
    ],
    hazards: [{ start: 6, end: 10, what: 'A pedestrian reaches the zebra crossing and is about to step on to it.' }],
    captions: [[0, 'A zebra crossing is ahead. A person is walking along the left pavement.'], [6, 'The person reaches the crossing and turns to cross.']],
    potential: ['Pedestrians near the crossing', 'Parked car reducing your view'],
    lesson: 'Give way to people waiting at a zebra crossing. Click when they reach the kerb and turn to cross.',
  },
  {
    id: 'hp7', title: 'Oncoming lorry and parked cars', setting: 'town', duration: 17,
    ego: [[0, 0], [7, 200], [10.5, 240], [14, 245], [17, 320]],
    objects: [
      P(122, 330, 'car', '#1d70b8'), P(122, 400, 'van', '#fff'), P(122, 470, 'car', '#d4351c'),
      { type: 'lorry', label: 'Lorry', keys: [[0, 250, 700], [17, 250, 0]] },
    ],
    hazards: [{ start: 6.8, end: 10.8, what: 'A lorry is coming towards you through the narrow gap – you must hold back.' }],
    captions: [[0, 'Cars are parked on your side of the road ahead.'], [6.8, 'A large lorry approaches from the other direction. There is not enough room for both of you.']],
    potential: ['Parked cars narrowing the road', 'Doors opening'],
    lesson: 'The obstruction is on your side, so you give way. Click when the oncoming lorry means you must slow.',
  },
  {
    id: 'hp8', title: 'Car ahead slows to turn', setting: 'town', duration: 17,
    ego: [[0, 0], [8, 240], [11, 280], [14, 290], [17, 340]],
    sideRoads: [{ wy: 430, side: 'right' }],
    objects: [
      { type: 'car', color: '#00703c', label: 'Car ahead', brakeFrom: 7.8, keys: [[0, 150, 150], [8, 150, 390], [10, 150, 410], [13, 160, 412], [15, 260, 440], [17, 360, 445]] },
    ],
    hazards: [{ start: 7.8, end: 11.8, what: 'The car in front brakes and slows to turn right.' }],
    captions: [[0, 'You are following a car along a town road.'], [7.8, 'Its brake lights come on and it slows to turn right.']],
    potential: ['Side road on the right', 'Vehicle ahead'],
    lesson: 'Brake lights ahead mean you will need to slow down – click when they come on.',
  },
  {
    id: 'hp9', title: 'Parked car door opens', setting: 'town', duration: 16,
    ego: [[0, 0], [7.5, 220], [11, 265], [16, 330]],
    objects: [
      P(120, 380, 'car', '#4c2c92', 'Parked car'),
      { type: 'door', appear: 7.3, keys: [[0, 142, 392]] },
      { type: 'pedestrian', appear: 8.5, keys: [[0, 150, 392], [8.5, 150, 392], [12, 150, 392]] },
    ],
    hazards: [{ start: 7.3, end: 11.3, what: 'The driver\'s door of the parked car opens into the road.' }],
    captions: [[0, 'A car is parked on the left. Someone is sitting in the driver\'s seat.'], [7.3, 'The driver\'s door opens.']],
    potential: ['Occupied parked car (clue)', 'Pedestrians between cars'],
    lesson: 'An occupied parked car is a clue. Click when the door actually opens.',
  },
  {
    id: 'hp10', title: 'Dog off its lead', setting: 'town', duration: 16,
    ego: [[0, 0], [8.5, 250], [12, 290], [16, 340]],
    objects: [
      { type: 'pedestrian', label: 'Dog walker', keys: [[0, 84, 380], [16, 84, 420]] },
      { type: 'dog', label: 'Dog', keys: [[0, 90, 395], [8.3, 90, 412], [9.5, 150, 418], [11, 240, 422], [13, 320, 424]] },
    ],
    hazards: [{ start: 8.3, end: 12.3, what: 'The dog runs off the pavement into the road.' }],
    captions: [[0, 'A person is walking a dog that is not on a lead.'], [8.3, 'The dog runs into the road.']],
    potential: ['Animal not on a lead'],
    lesson: 'Animals are unpredictable. Click as soon as the dog leaves the pavement.',
  },
  {
    id: 'hp11', title: 'Reversing car and pedestrian (two hazards)', setting: 'town', duration: 22,
    ego: [[0, 0], [5, 140], [8, 170], [10, 175], [14, 280], [17, 310], [22, 380]],
    objects: [
      { type: 'car', color: '#b58840', label: 'Reversing car', rot: 90, brakeFrom: 0, keys: [[0, 50, 300], [4.6, 50, 300], [7, 120, 300], [9.5, 120, 300], [11, 170, 330], [14, 170, 600]] },
      P(118, 430, 'car', '#1d70b8'), P(118, 490, 'van', '#fff'),
      { type: 'pedestrian', label: 'Pedestrian', keys: [[0, 80, 455], [13.6, 80, 455], [15, 140, 457], [17, 240, 459], [19, 320, 461]] },
    ],
    hazards: [
      { start: 4.6, end: 8.6, what: 'A car starts to reverse out of a driveway into the road.' },
      { start: 13.6, end: 17.4, what: 'A pedestrian steps out between parked vehicles.' },
    ],
    captions: [[0, 'Residential road with driveways on the left.'], [4.6, 'A car begins reversing out of a driveway.'], [10, 'The car drives off. Vehicles are parked further ahead.'], [13.6, 'A person steps out between the parked vehicles.']],
    potential: ['Driveways', 'Parked vehicles'],
    lesson: 'One clip in the real test has two hazards. Keep watching after the first one.',
  },
  {
    id: 'hp12', title: 'Tractor leaving a field', setting: 'rural', duration: 18,
    ego: [[0, 0], [8, 260], [12, 310], [18, 360]],
    objects: [
      { type: 'tractor', label: 'Tractor', rot: -90, keys: [[0, 345, 430], [7.6, 335, 430], [10, 270, 435], [12, 180, 450], [18, 160, 510]] },
    ],
    hazards: [{ start: 7.6, end: 11.6, what: 'A tractor pulls out of a field entrance into the road.' }],
    captions: [[0, 'Country road. There is mud on the road and a field gate on the right.'], [7.6, 'A tractor starts to pull out of the field.']],
    potential: ['Mud on the road (clue)', 'Field entrance'],
    lesson: 'Mud and a gateway are clues. The hazard develops when the tractor moves.',
  },
  {
    id: 'hp13', title: 'Ice-cream van', setting: 'town', duration: 17,
    ego: [[0, 0], [7.5, 220], [11, 260], [17, 340]],
    objects: [
      { type: 'icecream', label: 'Ice-cream van', keys: [[0, 278, 420]] },
      { type: 'child', label: 'Child', keys: [[0, 82, 410], [7.2, 82, 410], [8.5, 130, 412], [10, 210, 414], [11, 250, 416]] },
    ],
    hazards: [{ start: 7.2, end: 11.2, what: 'A child runs across the road towards the ice-cream van.' }],
    captions: [[0, 'An ice-cream van is parked on the right. A child is on the left pavement.'], [7.2, 'The child runs into the road towards the van.']],
    potential: ['Ice-cream van (clue)', 'Children nearby'],
    lesson: 'An ice-cream van is a strong clue. Click when the child steps off the kerb.',
  },
  {
    id: 'hp14', title: 'Oncoming car overtakes a cyclist', setting: 'rural', duration: 17,
    ego: [[0, 0], [7, 210], [10.5, 250], [17, 330]],
    objects: [
      { type: 'cyclist', label: 'Cyclist', keys: [[0, 280, 460], [17, 280, 290]] },
      { type: 'car', color: '#d4351c', label: 'Oncoming car', rot: 180, keys: [[0, 260, 700], [6.6, 260, 420], [8, 205, 385], [10, 205, 330], [12, 260, 290], [17, 260, 100]] },
    ],
    hazards: [{ start: 6.6, end: 10.6, what: 'An oncoming car pulls out to overtake the cyclist, into your half of the road.' }],
    captions: [[0, 'Country road. A cyclist is coming towards you with a car behind it.'], [6.6, 'The car pulls out to overtake the cyclist.']],
    potential: ['Oncoming cyclist', 'Vehicle that may overtake'],
    lesson: 'Watch what other road users might do. Click when the car starts moving out.',
  },
];

export const HP_MAX = 75;
export const HP_PASS = 44;
