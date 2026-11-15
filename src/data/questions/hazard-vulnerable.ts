import { maker } from './make';

const ha = maker('hazard-awareness', 'Highway Code: Road users requiring extra care / Fitness to drive');
const vu = maker('vulnerable', 'Highway Code: Hierarchy of road users (H1–H3) and Road users requiring extra care');

export const hazardAwareness = [
  ha('HA-01', 'e', 'A ball bounces into the road ahead from between parked cars. What should you do?', [
    ['Swerve round it and carry on', 'You have not dealt with the most likely hazard – a child chasing it.'],
    ['Slow down and be ready to stop for a child', 'Correct. A child may run out after the ball.'],
    ['Sound your horn and keep going', 'The horn does not make it safe.'],
    ['Accelerate past before anyone appears', 'This increases the danger.'],
  ], 1,
  'A ball in the road often means a child is about to follow it. Slow down and be ready to stop.',
  'Ball in the road = expect a child.',
  'Residential street, school time: a football rolls out from behind a van.',
  { tags: ['children', 'parked-cars'], scenario: true }),

  ha('HA-02', 'e', 'You see an ice-cream van parked on your side of the road ahead. What hazard should you expect?', [
    ['Children running out into the road', 'Correct.'],
    ['The van pulling out quickly', 'Possible, but children are the bigger risk.'],
    ['Loud music', 'This is not the main hazard.'],
    ['Oncoming vehicles overtaking it', 'Possible, but children are the main hazard.'],
  ], 0,
  'Children may run to or from an ice-cream van without looking. Slow down and be ready to stop.',
  'Ice-cream van = children may appear suddenly.',
  undefined,
  { tags: ['children'], scenario: true }),

  ha('HA-03', 'm', 'A bus has stopped at a bus stop on your side of the road. What should you be most aware of?', [
    ['Pedestrians stepping out from in front of the bus', 'Correct.'],
    ['The bus reversing', 'Buses rarely reverse at stops.'],
    ['The bus driver sounding the horn', 'This is not the main hazard.'],
    ['Cyclists using the bus stop', 'This is not the main hazard.'],
  ], 0,
  'Passengers who have just got off may cross in front of or behind the bus, hidden from your view.',
  'Stopped bus = hidden pedestrians.',
  undefined,
  { tags: ['pedestrians', 'buses'], scenario: true }),

  ha('HA-04', 'e', 'Your doctor has prescribed you a new medicine. What should you do before driving?', [
    ['Drive only short distances', 'Even short drives can be dangerous if the medicine affects you.'],
    ['Check with your doctor or pharmacist whether it will affect your driving', 'Correct.'],
    ['Drink a strong coffee to counter any drowsiness', 'Coffee does not cancel out medicine side effects.'],
    ['Drive only at night when it is quieter', 'Night driving can be harder.'],
  ], 1,
  'Some medicines cause drowsiness or affect your judgement. Ask your doctor or pharmacist and read the label before driving.',
  'New medicine? Ask the doctor or pharmacist before you drive.',
  undefined,
  { tags: ['fitness', 'drugs'] }),

  ha('HA-05', 'm', 'How does alcohol affect your driving?', [
    ['It improves your concentration', 'Alcohol reduces concentration.'],
    ['It reduces your coordination and increases your confidence', 'Correct. A dangerous combination.'],
    ['It speeds up your reactions', 'Alcohol slows your reactions.'],
    ['It improves your judgement of speed', 'It makes your judgement worse.'],
  ], 1,
  'Alcohol slows reactions, reduces coordination, impairs judgement of speed and distance, and gives a false sense of confidence.',
  'Alcohol: slower, clumsier, over-confident. The only safe amount is none.',
  undefined,
  { tags: ['fitness', 'alcohol'] }),

  ha('HA-06', 'm', 'You drank alcohol late last night. What should you remember before driving the next morning?', [
    ['A good night\'s sleep removes all alcohol from your body', 'Sleep does not speed up how your body removes alcohol.'],
    ['Alcohol may still be in your blood and affect your driving', 'Correct.'],
    ['A cold shower will make you fit to drive', 'This does not remove alcohol.'],
    ['Coffee will make you safe to drive', 'Coffee does not remove alcohol.'],
  ], 1,
  'Your body removes alcohol slowly. If you drank heavily in the evening, you may still be over the limit the next morning.',
  'The morning after can still be drink driving.',
  undefined,
  { tags: ['fitness', 'alcohol'] }),

  ha('HA-07', 'm', 'Why should you not overtake when approaching a junction?', [
    ['Vehicles may turn in or out of the junction', 'Correct.'],
    ['It is always illegal', 'It is not always illegal, but it is dangerous.'],
    ['The road surface is always slippery there', 'This is not the reason.'],
    ['Junctions have lower speed limits', 'This is not the reason.'],
  ], 0,
  'At junctions, vehicles may emerge or turn across your path, and the driver you are overtaking may be about to turn.',
  'Do not overtake at or approaching junctions.',
  undefined,
  { tags: ['overtaking', 'junctions'] }),

  ha('HA-08', 'm', 'You are driving towards a low, bright sun and are dazzled. What should you do?', [
    ['Slow down and use your sun visor', 'Correct.'],
    ['Speed up to get past the glare quickly', 'Speeding up while unable to see is dangerous.'],
    ['Switch on your fog lights', 'Fog lights do not help with glare.'],
    ['Close one eye', 'This reduces your view.'],
  ], 0,
  'Low sun can make it very hard to see hazards. Slow down, use the visor, and keep the windscreen clean inside and out.',
  'Dazzle from sun: slow down, visor down, clean screen.',
  undefined,
  { tags: ['visibility'] }),

  ha('HA-09', 'm', 'You see mud on the road and a sign showing a farm entrance ahead. What hazard should you expect?', [
    ['Slow-moving farm vehicles pulling out or turning', 'Correct.'],
    ['A level crossing', 'Nothing suggests this.'],
    ['A motorway junction', 'Nothing suggests this.'],
    ['A low bridge', 'Nothing suggests this.'],
  ], 0,
  'Mud on the road suggests farm vehicles are using it. They may be slow, wide or turning, and the mud makes the road slippery.',
  'Read the clues: mud + farm sign = tractors and slippery road.',
  undefined,
  { tags: ['rural'], scenario: true }),

  ha('HA-10', 'e', 'Why should you leave plenty of room when passing parked cars?', [
    ['A door may open or a pedestrian may step out', 'Correct.'],
    ['To avoid scratching your paintwork', 'Safety of people is the main reason.'],
    ['Because parked cars may have their alarms on', 'This is not the reason.'],
    ['To make room for overtaking traffic', 'This is not the reason.'],
  ], 0,
  'Doors may open, children may step out from between cars, and cars may pull out. Leave a door\'s width where you can, and slow down where you cannot.',
  'Passing parked cars: allow a door\'s width or slow down.',
  undefined,
  { tags: ['parked-cars'] }),

  ha('HA-11', 'h', 'You are driving through a town centre. A pedestrian at the kerb is looking at their phone and has not seen you. What should you do?', [
    ['Sound your horn to make them jump back', 'A sudden horn could startle them into the road.'],
    ['Keep going – they should look', 'You have a greater responsibility as a driver.'],
    ['Slow down, cover your brake and be ready to stop', 'Correct.'],
    ['Flash your headlights', 'They may not see this, or may misread it.'],
  ], 2,
  'Distracted pedestrians may step out without looking. Anticipate it: slow down and be ready to stop.',
  'Spot the clues – distracted pedestrians may step out.',
  undefined,
  { tags: ['pedestrians'], scenario: true }),

  ha('HA-12', 'm', 'What is a "developing hazard"?', [
    ['Something that would cause you to change speed or direction', 'Correct. It is a situation that develops and needs you to act.'],
    ['Any parked car on the road', 'A parked car is only a potential hazard unless something develops.'],
    ['A fixed road feature, like a bend', 'A bend is a potential hazard.'],
    ['A hazard that only appears at night', 'Hazards are not defined by time of day.'],
  ], 0,
  'A developing hazard is something that would make you, the driver, take action such as changing speed or direction. This is what scores points in the hazard perception test.',
  'Developing hazard = you would need to slow down, stop or steer.',
  undefined,
  { tags: ['hazard-perception'] }),

  ha('HA-13', 'm', 'You are tired and have a long way still to drive. What is the best thing to do?', [
    ['Stop in a safe place, have a caffeinated drink and take a short nap', 'Correct. This is the Highway Code advice.'],
    ['Turn up the radio and keep going', 'This does not reduce tiredness.'],
    ['Drive faster to get there sooner', 'Speed makes tiredness more dangerous.'],
    ['Open the window and keep going', 'This helps only for a short time.'],
  ], 0,
  'If you feel sleepy, stop in a safe place. Two cups of strong coffee and a short nap of at least 15 minutes is the Highway Code advice.',
  'Sleepy? Safe stop, caffeine, 15-minute nap.',
  undefined,
  { tags: ['tiredness', 'fitness'], ref: 'Highway Code: Fitness to drive (rule 91)' }),

  ha('HA-14', 'h', 'You are approaching a zebra crossing. The view of the crossing is partly blocked by a parked van. What should you do?', [
    ['Keep your speed and look for feet under the van', 'You need to slow down as well.'],
    ['Slow down and be ready to stop for someone stepping out', 'Correct.'],
    ['Sound your horn as you pass', 'This does not make it safe.'],
    ['Overtake the van quickly', 'You must not overtake on the zig-zag lines.'],
  ], 1,
  'A pedestrian could step on to the crossing from behind the van. Slow down and be ready to stop.',
  'Blocked view near a crossing = slow down and be ready.',
  undefined,
  { tags: ['crossings', 'pedestrians'], scenario: true }),

  ha('HA-15', 'm', 'Ahead, a car is waiting to pull out of a side road on the left. The driver is looking the other way. What should you do?', [
    ['Assume they have seen you', 'They may not have.'],
    ['Be ready to slow down or stop in case they pull out', 'Correct.'],
    ['Speed up to pass before they pull out', 'This increases danger.'],
    ['Move to the right without checking', 'Any change of position must be checked first.'],
  ], 1,
  'Never assume another driver has seen you. Be ready to react.',
  'Ask "What if they pull out?" and be ready.',
  undefined,
  { tags: ['junctions'], scenario: true }),
];

export const vulnerable = [
  vu('VU-01', 'e', 'You are overtaking a cyclist on a road with a 30 mph limit. How much space should you leave?', [
    ['At least 0.5 metres', 'Far too close.'],
    ['At least 1 metre', 'Too close under current Highway Code guidance.'],
    ['At least 1.5 metres', 'Correct. Give even more space at higher speeds.'],
    ['It does not matter as long as you are slow', 'Distance matters as well as speed.'],
  ], 2,
  'Leave at least 1.5 metres when overtaking cyclists at speeds of up to 30 mph, and more at higher speeds. Wait behind if you cannot do this safely.',
  'Cyclists: at least 1.5 m (up to 30 mph). More at higher speeds.',
  'On a narrow street with oncoming traffic, wait behind the cyclist until there is room.',
  { tags: ['cyclists', 'overtaking'], ref: 'Highway Code: Rule 163 (Overtaking)', ruleKey: 'pass-cyclist' }),

  vu('VU-02', 'e', 'How should you pass a person riding a horse?', [
    ['At under 10 mph, leaving at least 2 metres', 'Correct.'],
    ['Quickly, so you are past them sooner', 'Speed and noise can frighten horses.'],
    ['Sounding your horn to let them know you are there', 'This could frighten the horse.'],
    ['At any speed, leaving 1 metre', 'Too close.'],
  ], 0,
  'Pass horses at speeds under 10 mph and allow at least 2 metres of space. Do not sound your horn or rev your engine.',
  'Horses: under 10 mph, at least 2 m, quietly.',
  undefined,
  { tags: ['horses', 'overtaking'], ref: 'Highway Code: Rules 163 and 215', ruleKey: 'pass-horse' }),

  vu('VU-03', 'm', 'You are turning left into a side road. A pedestrian is waiting to cross that side road. What should you do?', [
    ['Turn quickly before they step out', 'This is dangerous and against the Highway Code.'],
    ['Give way to the pedestrian', 'Correct. Rule H2 says give way to pedestrians crossing or waiting to cross a road you are turning into.'],
    ['Sound your horn so they wait', 'This is not the correct use of the horn.'],
    ['Wave them across', 'Do not wave people across.'],
  ], 1,
  'At a junction, give way to pedestrians crossing or waiting to cross a road that you are turning into or out of (Rule H2).',
  'Turning into a road: pedestrians waiting to cross have priority.',
  undefined,
  { tags: ['pedestrians', 'junctions', 'hierarchy'], ref: 'Highway Code: Rule H2', scenario: true }),

  vu('VU-04', 'm', 'You see a pedestrian with a white stick that has two red bands on it. What does this mean?', [
    ['The person is deaf', 'A white stick shows a visual impairment.'],
    ['The person is blind', 'A plain white stick usually means blind or partially sighted. The red bands add more.'],
    ['The person is deaf and blind', 'Correct.'],
    ['The person is elderly', 'This is not what the stick means.'],
  ], 2,
  'A white stick with red bands means the person is deaf and blind. They may not see or hear you.',
  'White stick with red bands = deaf and blind.',
  undefined,
  { tags: ['pedestrians'] }),

  vu('VU-05', 'm', 'What is the maximum speed of a powered mobility scooter or powered wheelchair on the road?', [
    ['4 mph', 'This is the limit on the pavement.'],
    ['8 mph', 'Correct.'],
    ['12 mph', 'Too high.'],
    ['15 mph', 'Too high.'],
  ], 1,
  'Class 3 powered wheelchairs and mobility scooters can travel at up to 8 mph on the road. They are slow, so be patient.',
  'Mobility scooters: up to 8 mph on the road.',
  undefined,
  { tags: ['mobility-scooters'] }),

  vu('VU-06', 'e', 'Why should you look carefully for motorcyclists at junctions?', [
    ['They are small and can be hard to see', 'Correct.'],
    ['They always have right of way', 'This is not the reason.'],
    ['They are usually slower than cars', 'They can be faster.'],
    ['They never use indicators', 'This is not true.'],
  ], 0,
  'Motorcycles are narrow and easily hidden behind other vehicles, pillars or street furniture. Look twice.',
  'Think bike. Look twice at junctions.',
  undefined,
  { tags: ['motorcyclists', 'junctions'] }),

  vu('VU-07', 'm', 'A cyclist is in the left-hand lane on a roundabout. What should you do?', [
    ['Expect them to turn left at the next exit', 'Cyclists may stay in the left lane even if continuing round.'],
    ['Give them plenty of room – they may be going right round', 'Correct.'],
    ['Overtake them on the roundabout', 'This could cut them up.'],
    ['Sound your horn to tell them to move', 'This is not appropriate.'],
  ], 1,
  'Cyclists (and horse riders) may keep to the left-hand lane on a roundabout even when going right round. Give them plenty of room.',
  'Cyclists on roundabouts may stay left even when going right.',
  undefined,
  { tags: ['cyclists', 'roundabouts'] }),

  vu('VU-08', 'm', 'At traffic lights there is an advanced stop line with a cycle box. The light is red. Where should you stop?', [
    ['At the first white stop line, behind the cycle box', 'Correct.'],
    ['Inside the cycle box', 'Cars must not enter the box when the light is red.'],
    ['At the second stop line in front of the box', 'That line is for cyclists.'],
    ['Anywhere, as long as cyclists can get past', 'You must stop at the first line.'],
  ], 0,
  'Motorists must stop at the first white line and not enter the cycle area when the signal is red. If you crossed the first line before the signal changed, stop at the second line.',
  'Advanced stop line: stay behind the first line on red.',
  undefined,
  { tags: ['cyclists', 'traffic-lights'] }),

  vu('VU-09', 'm', 'You are driving on a country road with no pavement. A group of people are walking in the road ahead. What should you do?', [
    ['Sound your horn and keep going', 'This is not safe.'],
    ['Pass slowly, leaving at least 2 metres, waiting if necessary', 'Correct.'],
    ['Pass at normal speed but close to the opposite verge', 'You should slow down as well.'],
    ['Flash your headlights to make them move', 'This is not the correct use of headlights.'],
  ], 1,
  'Allow at least 2 metres and pass at low speed when pedestrians are walking in the road. Wait if needed.',
  'Pedestrians in the road: slow, 2 m.',
  undefined,
  { tags: ['pedestrians', 'rural'], ref: 'Highway Code: Rule 163 (Overtaking) and Rules H1–H3' }),

  vu('VU-10', 'm', 'You are turning left at a junction. A cyclist is going straight ahead on your left. What should you do?', [
    ['Turn in front of them – you were indicating', 'Signalling does not give you priority.'],
    ['Give way to the cyclist and do not cut across them', 'Correct. Rule H3.'],
    ['Sound your horn so they slow down', 'This is not correct.'],
    ['Speed up so you turn first', 'This is dangerous.'],
  ], 1,
  'Rule H3: you should not cut across cyclists, horse riders or horse-drawn vehicles going ahead when you are turning into or out of a junction or changing lane.',
  'Do not left-hook cyclists. Wait for them to pass.',
  undefined,
  { tags: ['cyclists', 'junctions', 'hierarchy'], ref: 'Highway Code: Rule H3', scenario: true }),

  vu('VU-11', 'e', 'Older pedestrians are crossing slowly in front of you. What should you do?', [
    ['Be patient and allow them to cross in their own time', 'Correct.'],
    ['Edge forward to hurry them', 'This could frighten or hurt them.'],
    ['Rev your engine', 'This is intimidating.'],
    ['Sound your horn', 'This could startle them.'],
  ], 0,
  'Older people may need more time, may have poor eyesight or hearing, and may not judge your speed well.',
  'Be patient with older and disabled pedestrians.',
  undefined,
  { tags: ['pedestrians'] }),

  vu('VU-12', 'h', 'Why might a motorcyclist or cyclist suddenly swerve?', [
    ['To avoid potholes, drain covers or debris', 'Correct.'],
    ['To make you slow down', 'This is not the usual reason.'],
    ['Because they always ride in the middle of the road', 'This is not true.'],
    ['Because they are about to stop', 'This is not the usual reason.'],
  ], 0,
  'Riders often move to avoid poor surfaces, drain covers, potholes or debris. Leave room for this.',
  'Expect two-wheelers to move around road defects.',
  undefined,
  { tags: ['cyclists', 'motorcyclists'] }),

  vu('VU-13', 'm', 'Which crossings can cyclists ride across?', [
    ['Zebra crossings', 'Cyclists should dismount at zebras (unless a parallel crossing).'],
    ['Pelican crossings', 'Pelicans are for pedestrians.'],
    ['Toucan crossings', 'Correct. "Two can" cross – pedestrians and cyclists.'],
    ['Puffin crossings', 'Puffins are for pedestrians.'],
  ], 2,
  'Toucan crossings are shared by pedestrians and cyclists. Cyclists may also ride across parallel crossings.',
  'Toucan = two can cross (walkers + cyclists).',
  undefined,
  { tags: ['crossings', 'cyclists'] }),

  vu('VU-14', 'm', 'A learner motorcyclist is ahead of you. What should you expect?', [
    ['That they will be very skilled', 'They are still learning.'],
    ['That they may be inexperienced and make mistakes', 'Correct. Give them extra room and be patient.'],
    ['That they will always ride in the centre of the lane', 'Not necessarily.'],
    ['That they will ride on motorways', 'Learner motorcyclists may not use motorways.'],
  ], 1,
  'Learner riders may lack experience in judging hazards. Give them room and be patient.',
  'L plates = expect mistakes, give space.',
  undefined,
  { tags: ['motorcyclists', 'learners'] }),

  vu('VU-15', 'm', 'What should you do when you see a school crossing patrol showing a "Stop – Children" sign?', [
    ['You must stop', 'Correct.'],
    ['Slow down, then continue if the children are not in your path', 'You must stop when signalled.'],
    ['Sound your horn to warn the children', 'This is not correct.'],
    ['Drive on if you are already very close', 'You must stop when the patrol signals.'],
  ], 0,
  'You must stop when a school crossing patrol shows a "Stop – Children" sign.',
  'School crossing patrol sign up = you MUST stop.',
  undefined,
  { tags: ['children', 'crossings'] }),
];
