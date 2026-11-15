import type { Question } from '../types';
import { maker } from './questions/make';

/**
 * Video case studies. The real car theory test includes a short silent video clip
 * followed by three questions. These are SIMULATED animated scenarios using the
 * hazard-scene engine – not DVSA footage.
 */
export interface CaseStudy {
  id: string;
  title: string;
  clipId: string;
  intro: string;
  questionIds: string[];
  /** ID of a licensed clip in hazard-videos/manifest.json. When present and available, it replaces the simulation. */
  videoId?: string;
}

const ha = maker('hazard-awareness', 'Highway Code: Road users requiring extra care');
const vu = maker('vulnerable', 'Highway Code: Rules H1–H3 and 204–215');
const rr = maker('rules-of-road', 'Highway Code: Using the road');
const ov = maker('other-vehicles', 'Highway Code: Rules 220–225');
const sm = maker('safety-margins', 'Highway Code: Rule 126');

const cs = (q: Question, id: string): Question => ({ ...q, caseStudy: id, kind: 'scenario' });

export const CASE_STUDY_QUESTIONS: Question[] = [
  // ---- CS1: residential street, ball and child (scene hp1)
  cs(ha('CS1-1', 'm', 'In the video, a ball rolls into the road. What is the most likely hazard that follows?', [
    ['A child running out after the ball', 'Correct.'],
    ['A car reversing from a driveway', 'Not shown and not the most likely follow-on.'],
    ['A cyclist overtaking you', 'Not the likely follow-on.'],
    ['A bus pulling out', 'Not shown.'],
  ], 0, 'A ball in the road is a strong clue that a child may follow it.', 'Ball in the road = expect a child.', undefined, { tags: ['children'] }), 'cs1'),
  cs(rr('CS1-2', 'e', 'The video shows a residential street in England with street lights and no speed limit signs. What is the speed limit?', [
    ['30 mph', 'Correct.'],
    ['40 mph', 'Not unless signed.'],
    ['60 mph', 'That is the national limit on single carriageways without street lights.'],
    ['20 mph', 'That is the default in Wales, or where signed.'],
  ], 0, 'In England, roads with street lights are normally 30 mph unless signs show otherwise. Drive slower where children may be about.', 'Street lights, no signs (England) = 30 mph.', undefined, { tags: ['speed-limits'] }), 'cs1'),
  cs(ha('CS1-3', 'm', 'Why should you drive slowly past the parked cars shown in the video?', [
    ['Children or doors could appear from between them with little warning', 'Correct.'],
    ['Parked cars always pull out without looking', 'Not always – but you must be ready.'],
    ['It is illegal to pass parked cars above 10 mph', 'There is no such rule.'],
    ['To read their number plates', 'Not relevant.'],
  ], 0, 'Parked cars hide pedestrians, especially children. Reduce speed and leave room.', 'Parked cars hide hazards.', undefined, { tags: ['parked-cars', 'children'] }), 'cs1'),

  // ---- CS2: bus stop (scene hp2)
  cs(ha('CS2-1', 'm', 'In the video, a bus has stopped at a bus stop. What is the main danger as you approach?', [
    ['Pedestrians stepping out from in front of the bus', 'Correct.'],
    ['The bus reversing', 'Unlikely.'],
    ['The bus using its horn', 'Not a danger.'],
    ['Oil on the road', 'Not shown.'],
  ], 0, 'People leaving a bus often cross in front of or behind it, hidden from you.', 'Stopped bus = hidden pedestrians.', undefined, { tags: ['buses', 'pedestrians'] }), 'cs2'),
  cs(ov('CS2-2', 'e', 'The bus in the video signals right to pull away from the stop. What should you do?', [
    ['Give way to it if it is safe to do so', 'Correct.'],
    ['Speed up to pass it', 'Dangerous.'],
    ['Sound your horn', 'Not appropriate.'],
    ['Overtake it on the left', 'Never.'],
  ], 0, 'Give way to buses signalling to pull out from stops when it is safe.', 'Let buses out when safe.', undefined, { tags: ['buses', 'courtesy'] }), 'cs2'),
  cs(sm('CS2-3', 'h', 'You had to stop suddenly for the pedestrian in the video. What would most likely have increased your stopping distance?', [
    ['Driving faster than the conditions allowed', 'Correct.'],
    ['Having good tyres', 'Good tyres help.'],
    ['Looking well ahead', 'Good observation helps.'],
    ['Driving on a dry road', 'Dry roads give the best grip.'],
  ], 0, 'Speed has the biggest effect on stopping distance. At 30 mph the typical stopping distance is 23 metres.', 'More speed = much longer stopping distance.', undefined, { tags: ['stopping-distance'] }), 'cs2'),

  // ---- CS3: horse rider (scene hp5)
  cs(vu('CS3-1', 'm', 'In the video you catch up with a horse rider. How should you pass?', [
    ['At under 10 mph, leaving at least 2 metres', 'Correct.'],
    ['Quickly, to get past sooner', 'Speed frightens horses.'],
    ['Close to the horse so oncoming traffic can pass', 'Too close.'],
    ['After sounding your horn', 'Never.'],
  ], 0, 'Pass horses slowly (under 10 mph) and wide (at least 2 m), only when safe.', 'Horses: under 10 mph, 2 m.', undefined, { tags: ['horses'] }), 'cs3'),
  cs(vu('CS3-2', 'e', 'Which of these could frighten the horse in the video?', [
    ['Revving your engine', 'Correct.'],
    ['Waiting patiently behind', 'This is the right thing to do.'],
    ['Passing slowly and wide', 'This is correct behaviour.'],
    ['Dipping your headlights', 'Unlikely to frighten a horse.'],
  ], 0, 'Noise such as revving or the horn can startle horses.', 'Near horses: quiet.', undefined, { tags: ['horses'] }), 'cs3'),
  cs(rr('CS3-3', 'm', 'The road in the video is narrow and winding. When may you overtake the horse rider?', [
    ['Only when you can see the road ahead is clear and you can leave enough room', 'Correct.'],
    ['On the next bend', 'Never overtake on a bend.'],
    ['Whenever the rider waves', 'You must still check it is safe yourself.'],
    ['Immediately', 'Only when safe.'],
  ], 0, 'Only overtake when you can see far enough ahead to do it safely and leave enough space.', 'Overtake only with a clear view.', undefined, { tags: ['overtaking', 'rural'] }), 'cs3'),

  // ---- CS4: cyclist and parked car (scene hp4)
  cs(vu('CS4-1', 'm', 'In the video, why does the cyclist move out?', [
    ['To pass the parked car', 'Correct.'],
    ['To turn right', 'Not shown.'],
    ['To race you', 'Not the reason.'],
    ['Because cyclists must ride in the centre', 'Not a rule.'],
  ], 0, 'Cyclists move out to pass parked cars, potholes and drains. Expect it.', 'Expect cyclists to move out round obstructions.', undefined, { tags: ['cyclists'] }), 'cs4'),
  cs(vu('CS4-2', 'e', 'When you overtake the cyclist in the video at up to 30 mph, how much space should you leave?', [
    ['At least 1.5 metres', 'Correct.'],
    ['At least 0.5 metres', 'Too close.'],
    ['At least 1 metre', 'Too close.'],
    ['No particular space', 'Space matters.'],
  ], 0, 'Leave at least 1.5 metres at speeds up to 30 mph, more at higher speeds.', 'Cyclists: 1.5 m.', undefined, { tags: ['cyclists', 'overtaking'] }), 'cs4'),
  cs(vu('CS4-3', 'm', 'If you parked where the parked car is in the video, how should you open your door?', [
    ['Use the hand on the opposite side to the door, so you turn and look behind', 'Correct (the "Dutch Reach").'],
    ['Open it quickly to get out of the way', 'Could hit a cyclist.'],
    ['Open it fully and wait', 'Could hit someone.'],
    ['Only check your interior mirror', 'Not enough.'],
  ], 0, 'The Highway Code recommends opening the door with the far hand to look over your shoulder for cyclists.', 'Dutch Reach.', undefined, { tags: ['cyclists', 'parking'] }), 'cs4'),
];

export const CASE_STUDIES: CaseStudy[] = [
  { id: 'cs1', title: 'Residential street', clipId: 'hp1', intro: 'You are driving along a residential street with cars parked on the left.', questionIds: ['CS1-1', 'CS1-2', 'CS1-3'] },
  { id: 'cs2', title: 'Bus at a bus stop', clipId: 'hp2', intro: 'You are driving through a town towards a bus stop.', questionIds: ['CS2-1', 'CS2-2', 'CS2-3'] },
  { id: 'cs3', title: 'Horse rider on a country lane', clipId: 'hp5', intro: 'You are driving on a narrow country lane.', questionIds: ['CS3-1', 'CS3-2', 'CS3-3'] },
  { id: 'cs4', title: 'Cyclist and a parked car', clipId: 'hp4', intro: 'You are following a cyclist on a town road.', questionIds: ['CS4-1', 'CS4-2', 'CS4-3'] },
];

export const CASE_STUDY_MAP = Object.fromEntries(CASE_STUDIES.map((c) => [c.id, c]));
