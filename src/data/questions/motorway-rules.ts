import { maker } from './make';

const mw = maker('motorway', 'Highway Code: Motorways (rules 253–273)');
const rr = maker('rules-of-road', 'Highway Code: Using the road (rules 159–203) / Waiting and parking');

export const motorway = [
  mw('MW-01', 'm', 'Which of these must NOT use a motorway?', [
    ['Learner car drivers with an approved driving instructor in a dual-control car', 'Since 2018 this is allowed.'],
    ['Motorcycles under 50 cc', 'Correct.'],
    ['Cars towing caravans', 'Allowed, with lower limits and lane restrictions.'],
    ['Large goods vehicles', 'Allowed.'],
  ], 1,
  'Motorways must not be used by pedestrians, cyclists, horse riders, learner motorcyclists, motorcycles under 50 cc, and certain slow vehicles. Learner car drivers may use them with an approved instructor in a dual-control car.',
  'No motorway for: walkers, cyclists, horses, under-50 cc bikes, learner motorcyclists.',
  undefined,
  { tags: ['motorway-users'] }),

  mw('MW-02', 'e', 'You are joining a motorway from a slip road. What should you do?', [
    ['Give priority to traffic already on the motorway and adjust your speed to fit into a safe gap', 'Correct.'],
    ['Expect motorway traffic to move over for you', 'They may not be able to.'],
    ['Stop at the end of the slip road and wait for a gap', 'Only stop if you have to; build up speed on the slip road.'],
    ['Drive onto the hard shoulder until a gap appears', 'Not allowed.'],
  ], 0,
  'Give priority to traffic already on the motorway. Check for a safe gap and match your speed to the traffic in the left lane.',
  'Joining: give way, match speed, merge into a safe gap.',
  undefined,
  { tags: ['joining'] }),

  mw('MW-03', 'e', 'When can you use the hard shoulder of a motorway?', [
    ['In an emergency, or when signs tell you to', 'Correct.'],
    ['To make a phone call', 'Not allowed.'],
    ['To overtake slow traffic', 'Never.'],
    ['For a rest when you are tired', 'Leave the motorway to rest.'],
  ], 0,
  'The hard shoulder is for emergencies only, unless signs show it is open as a running lane (some smart motorways).',
  'Hard shoulder = emergencies (or when signs open it).',
  undefined,
  { tags: ['hard-shoulder'] }),

  mw('MW-04', 'm', 'Your car breaks down on a motorway with a hard shoulder. You manage to stop on the hard shoulder. What should you do?', [
    ['Stay in the car with the doors locked', 'This is dangerous if a vehicle hits yours.'],
    ['Get out by the left-hand doors, wait behind the safety barrier and call for help', 'Correct.'],
    ['Put a warning triangle behind your car', 'Do not place a warning triangle on a motorway.'],
    ['Try to repair it yourself on the hard shoulder', 'Do not attempt even simple repairs.'],
  ], 1,
  'Switch on hazard lights, get everyone out via the left-hand doors, move well away from traffic behind the barrier if possible, and call for help. Do not attempt repairs.',
  'Hard shoulder breakdown: hazards on, out on the left, behind the barrier, call.',
  undefined,
  { tags: ['breakdown'], ref: 'Highway Code: Breakdowns and incidents (rule 275)', scenario: true }),

  mw('MW-05', 'm', 'Should you place a warning triangle behind your car if you break down on the motorway?', [
    ['Yes, at least 45 metres behind', 'This applies on other roads, not motorways.'],
    ['Yes, at least 100 metres behind', 'Not correct.'],
    ['No, never place one on a motorway', 'Correct. It is too dangerous.'],
    ['Only at night', 'Not correct.'],
  ], 2,
  'Do not attempt to place a warning triangle on a motorway. On other roads, place it at least 45 metres behind if it is safe to do so.',
  'Motorway: no triangle. Other roads: 45 m behind.',
  undefined,
  { tags: ['breakdown', 'warning-triangle'] }),

  mw('MW-06', 'e', 'A red cross is shown above your lane on a motorway gantry. What does it mean?', [
    ['You must not drive in that lane', 'Correct.'],
    ['The lane is for buses only', 'Not correct.'],
    ['The speed limit has ended', 'Not correct.'],
    ['You may use the lane with care', 'You must not use it.'],
  ], 0,
  'A red X means the lane is closed. You must not drive in it. It is an offence to ignore it.',
  'Red X = lane closed. Move out of it safely.',
  undefined,
  { tags: ['signals', 'smart-motorway'] }),

  mw('MW-07', 'm', 'What colour are the reflective studs between the motorway and the central reservation?', [
    ['Red', 'Red studs mark the left edge (hard shoulder side).'],
    ['White', 'White studs mark lane lines.'],
    ['Amber', 'Correct.'],
    ['Green', 'Green studs mark slip roads and lay-bys.'],
  ], 2,
  'Motorway studs: red on the left edge, white between lanes, amber by the central reservation, green at slip roads and lay-bys.',
  'Red left, Amber right (central reservation), White lanes, Green slip roads.',
  'Memory trick: "Red is for the Road edge on the left, Amber is Alongside the barrier."',
  { tags: ['studs'], ruleKey: 'studs' }),

  mw('MW-08', 'h', 'You are towing a caravan on a three-lane motorway. Which lane must you not use?', [
    ['The left-hand lane', 'You can use this.'],
    ['The middle lane', 'You can use this.'],
    ['The right-hand lane', 'Correct. Vehicles towing trailers must not use it on motorways with three or more lanes (unless lanes are closed).'],
    ['You may use any lane', 'There is a restriction.'],
  ], 2,
  'Vehicles towing a trailer or caravan must not use the right-hand lane of a motorway with three or more lanes, unless directed because of lane closures.',
  'Towing on a 3+ lane motorway: never the right-hand lane.',
  undefined,
  { tags: ['towing', 'lanes'] }),

  mw('MW-09', 'm', 'You see countdown markers with three white bars on a blue background. What do they mean?', [
    ['300 yards to the next exit', 'Correct.'],
    ['3 miles to the next exit', 'Not correct.'],
    ['3 lanes ahead', 'Not correct.'],
    ['300 metres to a service area', 'Not correct.'],
  ], 0,
  'Countdown markers show 300, 200 and 100 yards to the next exit. Three bars is 300 yards.',
  'Countdown bars: 3 = 300 yd, 2 = 200 yd, 1 = 100 yd.',
  undefined,
  { tags: ['signs'], sign: 'countdown' }),

  mw('MW-10', 'e', 'You miss your exit on a motorway. What should you do?', [
    ['Reverse along the hard shoulder', 'Never reverse on a motorway.'],
    ['Make a U-turn at the next gap in the central reservation', 'Never do this.'],
    ['Carry on to the next exit', 'Correct.'],
    ['Stop and wait for help', 'Not necessary.'],
  ], 2,
  'You must not reverse, cross the central reservation or drive against traffic. Continue to the next exit.',
  'Missed exit? Next exit.',
  undefined,
  { tags: ['junctions'] }),

  mw('MW-11', 'm', 'On a motorway, when may you overtake on the left?', [
    ['When traffic is moving slowly in queues and the lane on your right is moving more slowly', 'Correct.'],
    ['When the car in front is slow', 'Overtake on the right instead.'],
    ['Whenever the left lane is clear', 'Not allowed.'],
    ['At night only', 'Not correct.'],
  ], 0,
  'Do not overtake on the left except in congested conditions where traffic in your lane is moving faster than the lane on your right.',
  'Overtake on the right. Left only in slow-moving queues.',
  undefined,
  { tags: ['lanes', 'overtaking'] }),

  mw('MW-12', 'm', 'What is the purpose of an emergency area on a smart motorway?', [
    ['A place to stop in an emergency, with an SOS telephone', 'Correct. They are marked with orange surfaces and blue signs.'],
    ['A rest area to take a break', 'Use services for breaks.'],
    ['A place to make phone calls', 'Only for emergencies.'],
    ['A lay-by for overtaking', 'Not correct.'],
  ], 0,
  'Emergency areas on motorways without a permanent hard shoulder are for emergencies. They are marked with blue signs showing an orange SOS telephone symbol.',
  'Emergency areas: emergencies only.',
  undefined,
  { tags: ['smart-motorway', 'breakdown'] }),

  mw('MW-13', 'h', 'Your car develops a problem on a motorway with no hard shoulder and you cannot reach an emergency area or leave the motorway. You have stopped in a live lane. What should you do?', [
    ['Get out and stand behind the car', 'Standing near live traffic is very dangerous.'],
    ['Switch on hazard lights; if you cannot safely get out, stay in the car with your seat belt on and call 999', 'Correct.'],
    ['Try to push the car to the side', 'Very dangerous.'],
    ['Place a warning triangle behind the car', 'Do not on a motorway.'],
  ], 1,
  'If you stop in a live lane, switch on hazard lights. If it is safe, get out via the left side and get behind the barrier. If not, stay in the vehicle with seat belts on and call 999.',
  'Stopped in a live lane: hazards on, 999. Leave only if safe.',
  undefined,
  { tags: ['smart-motorway', 'breakdown'], scenario: true }),

  mw('MW-14', 'e', 'Something falls from your car onto the motorway. What should you do?', [
    ['Stop and go back to collect it', 'Never walk on the carriageway.'],
    ['Stop at an emergency telephone or emergency area and report it', 'Correct.'],
    ['Reverse back to it on the hard shoulder', 'Never reverse on a motorway.'],
    ['Ignore it', 'It is a danger to others – report it.'],
  ], 1,
  'Do not try to remove it yourself. Stop at the next emergency telephone or emergency area and report it, or call 999 if it is a danger.',
  'Never retrieve objects on a motorway.',
  undefined,
  { tags: ['incidents'] }),

  mw('MW-15', 'm', 'A speed limit in a red circle is shown on a motorway gantry above your lane. What does it mean?', [
    ['It is advisory only', 'Speed limits in red circles are mandatory.'],
    ['It is a mandatory speed limit', 'Correct.'],
    ['It applies only to lorries', 'It applies to all vehicles.'],
    ['It is a minimum speed', 'Minimum speeds are on blue circles.'],
  ], 1,
  'A speed limit in a red circle on a gantry is the legal limit for that lane.',
  'Red circle = must obey.',
  undefined,
  { tags: ['signals', 'smart-motorway'] }),

  mw('MW-16', 'm', 'After overtaking on a motorway, what should you do?', [
    ['Stay in the middle lane', 'Lane hogging can be an offence.'],
    ['Return to the left-hand lane when it is safe', 'Correct.'],
    ['Move straight into the hard shoulder', 'Not allowed.'],
    ['Slow down immediately', 'This could cause danger.'],
  ], 1,
  'Keep to the left-hand lane unless overtaking. Return to the left when it is safe and you have passed.',
  'Keep left unless overtaking.',
  undefined,
  { tags: ['lanes'] }),
];

export const rulesOfRoad = [
  rr('RR-01', 'e', 'You are approaching a roundabout. Who should you normally give way to?', [
    ['Traffic from the right', 'Correct.'],
    ['Traffic from the left', 'Not correct.'],
    ['Traffic already in front of you only', 'Not correct.'],
    ['No one – roundabout traffic gives way to you', 'You give way to the right.'],
  ], 0,
  'At roundabouts, give way to traffic approaching from your right unless signs or road markings say otherwise.',
  'Roundabouts: give way to the right.',
  undefined,
  { tags: ['roundabouts'] }),

  rr('RR-02', 'm', 'When may you enter a yellow box junction when your exit is not clear?', [
    ['Never', 'There is one exception.'],
    ['When turning right and you are stopped only by oncoming traffic or other vehicles waiting to turn right', 'Correct.'],
    ['When the lights are green', 'Your exit must still be clear.'],
    ['When turning left', 'Your exit must be clear.'],
  ], 1,
  'You must not enter a box junction unless your exit road is clear. You may wait in the box when you want to turn right and are only stopped by oncoming traffic or vehicles waiting to turn right.',
  'Box junction: exit clear first – except turning right blocked by oncoming traffic.',
  undefined,
  { tags: ['junctions', 'markings'] }),

  rr('RR-03', 'e', 'How close to a junction must you not park?', [
    ['Within 10 metres', 'Correct (except in an authorised parking space).'],
    ['Within 5 metres', 'Too close.'],
    ['Within 20 metres', 'Not the rule.'],
    ['Within 2 metres', 'Too close.'],
  ], 0,
  'Do not stop or park opposite or within 10 metres (32 feet) of a junction, except in an authorised parking space.',
  'Parking: not within 10 m of a junction.',
  undefined,
  { tags: ['parking'], ref: 'Highway Code: Rule 243' }),

  rr('RR-04', 'e', 'What must you not do on the zig-zag lines at a pedestrian crossing?', [
    ['Park, or overtake the moving vehicle nearest the crossing', 'Correct.'],
    ['Drive slowly', 'You should drive slowly.'],
    ['Use your mirrors', 'You should use your mirrors.'],
    ['Use dipped headlights', 'This is fine.'],
  ], 0,
  'You must not park on zig-zags, and you must not overtake the moving vehicle nearest the crossing, or the vehicle that has stopped to give way.',
  'Zig-zags: no parking, no overtaking.',
  undefined,
  { tags: ['crossings', 'markings'] }),

  rr('RR-05', 'm', 'At a pelican crossing the amber light is flashing. What must you do?', [
    ['Give way to pedestrians on the crossing', 'Correct. Go only if the crossing is clear.'],
    ['Stop and wait for green', 'You may go if no one is crossing.'],
    ['Drive on – it is your right of way', 'Pedestrians still on the crossing have priority.'],
    ['Wave pedestrians across', 'Do not wave people across.'],
  ], 0,
  'Flashing amber at a pelican crossing means give way to pedestrians on the crossing, but you may go if it is clear.',
  'Pelican flashing amber: give way to people on the crossing.',
  undefined,
  { tags: ['crossings', 'traffic-lights'] }),

  rr('RR-06', 'm', 'How is a puffin crossing different from a pelican crossing?', [
    ['It has no flashing amber phase; sensors detect pedestrians', 'Correct.'],
    ['It is for horse riders', 'That is an equestrian (Pegasus) crossing.'],
    ['It has flashing amber beacons', 'That is a zebra crossing.'],
    ['It is for cyclists only', 'Not correct.'],
  ], 0,
  'Puffin crossings use sensors to detect pedestrians and keep the lights red until they have crossed. There is no flashing amber phase.',
  'Puffin = sensors, no flashing amber.',
  undefined,
  { tags: ['crossings'] }),

  rr('RR-07', 'm', 'You arrive at an unmarked crossroads. Who has priority?', [
    ['Nobody – take extra care and be prepared to stop', 'Correct.'],
    ['The vehicle on the wider road', 'No road has priority.'],
    ['Vehicles going straight ahead', 'No road has priority.'],
    ['Vehicles coming from the right', 'This applies at roundabouts, not unmarked crossroads.'],
  ], 0,
  'At an unmarked crossroads, no one has priority. Approach slowly, look carefully and be ready to stop.',
  'Unmarked crossroads: no one has priority.',
  undefined,
  { tags: ['junctions'] }),

  rr('RR-08', 'm', 'You want to turn right from a one-way street. Which lane should you normally use?', [
    ['The right-hand lane', 'Correct.'],
    ['The left-hand lane', 'Not correct for turning right.'],
    ['Any lane', 'Choose the lane for your direction.'],
    ['The middle of the road straddling lanes', 'Never straddle lanes.'],
  ], 0,
  'In a one-way street, choose the right-hand lane to turn right, and the left-hand lane to turn left, unless signs or markings show otherwise.',
  'One-way street: right lane to turn right.',
  undefined,
  { tags: ['lanes'] }),

  rr('RR-09', 'm', 'In a one-way street, on which side may you overtake?', [
    ['On either side', 'Correct.'],
    ['Only on the right', 'In one-way streets you may pass on either side.'],
    ['Only on the left', 'Not correct.'],
    ['You may not overtake in a one-way street', 'You may.'],
  ], 0,
  'In one-way streets, traffic may pass on either side. Be extra careful and check both sides.',
  'One-way street: overtake on either side.',
  undefined,
  { tags: ['overtaking'] }),

  rr('RR-10', 'e', 'Why should you not reverse from a side road into a main road?', [
    ['It is dangerous and against Highway Code advice', 'Correct.'],
    ['It damages the clutch', 'Not the reason.'],
    ['It uses more fuel', 'Not the reason.'],
    ['It is only allowed at night', 'Not correct.'],
  ], 0,
  'Never reverse from a side road into a main road. Find a safe place to turn round instead.',
  'Do not reverse into a main road.',
  undefined,
  { tags: ['reversing'] }),

  rr('RR-11', 'h', 'You are parking at night on a road with a 40 mph speed limit. What must you do?', [
    ['Leave your parking lights on', 'Correct. On roads over 30 mph, you must use parking lights.'],
    ['Leave your dipped headlights on', 'Not required.'],
    ['Leave your hazard lights on', 'Not correct.'],
    ['Nothing – lights are not needed', 'They are needed above 30 mph.'],
  ], 0,
  'Cars must display parking lights when parked on a road or lay-by with a speed limit greater than 30 mph.',
  'Night parking above 30 mph: parking lights on.',
  undefined,
  { tags: ['parking', 'lights', 'night'], ref: 'Highway Code: Rule 249' }),

  rr('RR-12', 'm', 'At a mini-roundabout, what should you do?', [
    ['Give way to traffic from the right and avoid driving over the central marking if you can', 'Correct. Large vehicles may have to drive over it.'],
    ['Drive straight over the central marking', 'Avoid it unless you need to.'],
    ['Give way to traffic from the left', 'Give way to the right.'],
    ['Make a U-turn whenever you need', 'U-turns at mini-roundabouts are not encouraged and often unsafe.'],
  ], 0,
  'Treat mini-roundabouts like normal roundabouts: give way to the right. Pass round the central marking unless your vehicle is too large to do so.',
  'Mini-roundabout: give way to the right, go round the centre.',
  undefined,
  { tags: ['roundabouts'] }),

  rr('RR-13', 'h', 'There is a double white line with a solid line nearest to you. When may you cross it?', [
    ['To overtake a slow car', 'Not allowed.'],
    ['To pass a stationary vehicle, or a cyclist, horse or road maintenance vehicle travelling at 10 mph or less, when safe', 'Correct.'],
    ['Never, under any circumstances', 'There are exceptions.'],
    ['When the road ahead is clear', 'A clear road is not an exception.'],
  ], 1,
  'You must not cross or straddle a solid white line on your side, except to turn into a side road or property, pass a stationary vehicle, or overtake a cyclist, horse or road maintenance vehicle travelling at 10 mph or less.',
  'Solid line your side: do not cross except for the listed exceptions.',
  undefined,
  { tags: ['markings', 'overtaking'], ref: 'Highway Code: Rule 129' }),

  rr('RR-14', 'm', 'The traffic lights ahead are not working. What should you do?', [
    ['Treat the junction as unmarked and proceed with great care', 'Correct.'],
    ['Go through, because you have priority', 'No one has priority.'],
    ['Stop and wait for them to work again', 'You may proceed carefully.'],
    ['Sound your horn and drive through', 'Not appropriate.'],
  ], 0,
  'If traffic lights are not working, treat the junction as an unmarked junction and proceed with great care.',
  'Lights out = unmarked junction.',
  undefined,
  { tags: ['traffic-lights', 'junctions'] }),

  rr('RR-15', 'e', 'There is a green filter arrow at traffic lights while the main light is red. What does it mean?', [
    ['You may go in the direction of the arrow if it is safe', 'Correct.'],
    ['You must wait for the main green light', 'Not correct.'],
    ['All traffic may go', 'Only traffic going in the direction of the arrow.'],
    ['The lights are faulty', 'Not correct.'],
  ], 0,
  'A green filter arrow lets you go in the direction shown, even if the main light is not green. Do not use the lane unless you are going that way.',
  'Green arrow = go that way only, if clear.',
  undefined,
  { tags: ['traffic-lights'] }),

  rr('RR-16', 'm', 'Yellow zig-zag lines outside a school say "School – Keep Clear". What does this mean?', [
    ['You must not stop or park on them during the times shown', 'Correct.'],
    ['You may stop briefly to drop children off', 'Not allowed during operating times.'],
    ['You may park if you leave your hazard lights on', 'Not allowed.'],
    ['They apply only to buses', 'They apply to everyone.'],
  ], 0,
  'Yellow zig-zags outside schools must be kept clear during the times shown, so children can be seen when crossing.',
  'School zig-zags: no stopping during the hours shown.',
  undefined,
  { tags: ['children', 'markings', 'parking'] }),

  rr('RR-17', 'h', 'In which situation must you not overtake?', [
    ['On a long, straight road with good visibility', 'This can be suitable.'],
    ['When approaching a pedestrian crossing', 'Correct.'],
    ['On a one-way street', 'You may overtake on either side.'],
    ['On a dual carriageway', 'You may overtake if safe.'],
  ], 1,
  'Do not overtake approaching junctions, bends, hill crests, pedestrian crossings, or where road markings forbid it.',
  'No overtaking at crossings, junctions, bends, hill crests or where lines forbid it.',
  undefined,
  { tags: ['overtaking', 'crossings'] }),

  rr('RR-18', 'e', 'What does a clearway sign (no stopping) mean?', [
    ['You must not stop on the main carriageway, even to pick up or set down passengers', 'Correct.'],
    ['You may stop briefly to drop off passengers', 'Not allowed.'],
    ['You may park outside working hours', 'Not on a clearway.'],
    ['Only buses may stop', 'Not correct.'],
  ], 0,
  'On a clearway you must not stop on the main carriageway at any time, unless in an emergency or in a lay-by.',
  'Clearway: no stopping.',
  undefined,
  { tags: ['parking', 'signs'], sign: 'no-stopping' }),
];
