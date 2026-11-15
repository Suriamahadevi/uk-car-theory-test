import { maker } from './make';

/** Questions added in the November 2026 upgrade, including "mark two answers" items. */
const al = maker('alertness', 'Highway Code: Rules for drivers – general advice (rules 148–150)');
const at = maker('attitude', 'Highway Code: General rules and Hierarchy of road users');
const sv = maker('safety-vehicle', 'Highway Code: Annex 6 – Vehicle maintenance, safety and security');
const sm = maker('safety-margins', 'Highway Code: Rule 126 and Driving in adverse weather conditions');
const ha = maker('hazard-awareness', 'Highway Code: Road users requiring extra care / Fitness to drive');
const vu = maker('vulnerable', 'Highway Code: Rules H1–H3 and Road users requiring extra care (rules 204–225)');
const ov = maker('other-vehicles', 'Highway Code: Other road users (rules 220–225)');
const vh = maker('vehicle-handling', 'Highway Code: Driving in adverse weather / General rules');
const mw = maker('motorway', 'Highway Code: Motorways (rules 253–273) and Breakdowns (rules 274–275)');
const rr = maker('rules-of-road', 'Highway Code: Using the road (rules 159–203)');
const sg = maker('signs', 'Highway Code: Road markings and Signals by authorised persons / Know Your Traffic Signs');
const dc = maker('documents', 'GOV.UK: Driving licences, vehicle insurance and penalty points');
const inc = maker('incidents', 'Highway Code: Annex 7 – First aid on the road (updated 22 October 2025)');
const fa = maker('incidents', 'GOV.UK/DVSA: New theory test questions on CPR and defibrillators (13 August 2025); Resuscitation Council UK; Highway Code Annex 7');
const lo = maker('loading', 'Highway Code: Rule 98 / GOV.UK: Towing with a car');

export const extraQuestions = [
  // ------------------------------------------------------------ Alertness
  al('X-AL-01', 'm', 'Which TWO of these are most likely to make you less alert while driving? Mark two answers.', [
    ['Being tired', 'Correct. Tiredness slows reactions and can make you fall asleep.'],
    ['Taking medicine that causes drowsiness', 'Correct. Always check the label and ask a pharmacist.'],
    ['Taking regular breaks', 'Breaks help you stay alert.'],
    ['Keeping the car well ventilated', 'Fresh air helps, though only briefly.'],
  ], [0, 1],
  'Tiredness and some medicines reduce concentration and slow reactions. Plan breaks and check whether medicines affect driving.',
  'Tiredness and drowsy medicines are major causes of poor alertness.',
  undefined, { tags: ['tiredness', 'fitness'] }),

  al('X-AL-02', 'm', 'You want to move into the right-hand lane of a dual carriageway. When should you check your blind spot?', [
    ['After checking your mirrors and before you move across', 'Correct.'],
    ['Only if you hear a horn', 'Too late – you must look before moving.'],
    ['After you have moved into the lane', 'Too late.'],
    ['Never – mirrors are enough', 'Mirrors do not show the blind spot.'],
  ], 0,
  'Check your mirrors, signal, then take a quick look over your shoulder into the blind spot before changing lanes.',
  'Changing lanes: mirrors, signal, blind spot, then move.',
  'A car can sit in your right-hand blind spot on a dual carriageway – it will not show in your door mirror.',
  { tags: ['blind-spot', 'lanes', 'mirrors'] }),

  al('X-AL-03', 'e', 'You are lost and need to check a map or directions. What should you do?', [
    ['Find a safe place to stop before you check', 'Correct.'],
    ['Check it while driving slowly', 'Reading while driving is dangerous.'],
    ['Ask your passenger to steer', 'Never.'],
    ['Check it at the next set of red lights', 'You are still in charge of the car at red lights.'],
  ], 0,
  'Reading directions takes your eyes and mind off the road. Stop somewhere safe and legal first.',
  'Need to read something? Stop safely first.',
  undefined, { tags: ['distraction'] }),

  al('X-AL-04', 'm', 'Why should you check your mirrors before slowing down?', [
    ['To see what is behind and how close it is, so you can slow down safely', 'Correct.'],
    ['To check your hair or appearance', 'Not relevant.'],
    ['Because the law says you must look in the mirror every 5 seconds', 'There is no such rule.'],
    ['To check the passengers', 'Not the purpose.'],
  ], 0,
  'Knowing what is behind helps you decide how firmly to brake and whether to signal or give an arm signal.',
  'Mirrors before any change of speed or direction.',
  undefined, { tags: ['mirrors'] }),

  al('X-AL-05', 'm', 'Is it safe to eat or drink while driving?', [
    ['No – it can distract you, and you could be prosecuted if you are not in proper control', 'Correct.'],
    ['Yes, on motorways only', 'Higher speeds make distraction worse.'],
    ['Yes, as long as you use one hand', 'You still lose control and attention.'],
    ['Yes, if you are tired', 'Not a safe solution.'],
  ], 0,
  'The Highway Code says avoid distractions such as eating and drinking. Stop safely to eat or drink.',
  'Eat and drink only when parked.',
  undefined, { tags: ['distraction'], ref: 'Highway Code: Rule 148' }),

  // ------------------------------------------------------------ Attitude
  at('X-AT-01', 'm', 'A long, heavily laden lorry is taking a long time to overtake you. What should you do?', [
    ['Slow down to let it get past', 'Correct.'],
    ['Speed up so it has to drop back', 'Dangerous and aggressive.'],
    ['Keep exactly the same speed', 'Easing off helps it pass safely.'],
    ['Flash your headlights', 'Not appropriate.'],
  ], 0,
  'Make it easy for vehicles to overtake you. Easing off lets the lorry complete the overtake and pull in safely.',
  'Being overtaken slowly? Ease off.',
  undefined, { tags: ['overtaking', 'large-vehicles'] }),

  at('X-AT-02', 'm', 'Which TWO of these are examples of aggressive driving? Mark two answers.', [
    ['Following another vehicle very closely', 'Correct. Tailgating intimidates and is dangerous.'],
    ['Using the horn to show annoyance', 'Correct. The horn is only to warn others of your presence.'],
    ['Leaving a two-second gap', 'This is safe driving.'],
    ['Letting another driver merge in turn', 'This is considerate driving.'],
  ], [0, 1],
  'Aggressive driving includes tailgating, using the horn or headlights in anger and cutting in. Stay calm and courteous.',
  'Horn = "I am here" only. Never tailgate.',
  undefined, { tags: ['courtesy', 'following-distance', 'horn'] }),

  at('X-AT-03', 'e', 'You are driving at the speed limit. A driver behind wants to overtake. What should you do?', [
    ['Keep a steady speed and let them overtake', 'Correct.'],
    ['Speed up to stop them', 'Never speed up.'],
    ['Move to the centre of the road', 'This is dangerous and obstructive.'],
    ['Brake to warn them', 'Could cause a collision.'],
  ], 0,
  'Do not try to stop others overtaking, even if they are breaking the speed limit. Keep a steady course.',
  'Never obstruct an overtaking vehicle.',
  undefined, { tags: ['overtaking', 'courtesy'] }),

  at('X-AT-04', 'm', 'The amber light is flashing at a pelican crossing and an elderly person is still crossing. The driver behind sounds their horn. What should you do?', [
    ['Wait until the person has finished crossing', 'Correct.'],
    ['Move off because the driver behind is in a hurry', 'Pedestrians on the crossing have priority.'],
    ['Wave the person to hurry up', 'Never hurry pedestrians.'],
    ['Edge forward to show you want to go', 'Intimidating.'],
  ], 0,
  'During flashing amber you must give way to pedestrians on the crossing. Do not let others pressure you.',
  'Pelican flashing amber: people on the crossing go first.',
  undefined, { tags: ['crossings', 'pedestrians'], scenario: true }),

  // ------------------------------------------------------------ Safety and your vehicle
  sv('X-SV-01', 'm', 'The oil pressure warning light comes on while you are driving. What should you do?', [
    ['Stop as soon as it is safe and check the oil level', 'Correct. Low oil pressure can quickly damage the engine.'],
    ['Ignore it until your next service', 'This could cause serious engine damage.'],
    ['Drive faster to reach a garage', 'Dangerous.'],
    ['Switch off the headlights', 'Not related.'],
  ], 0,
  'A warning light means there is a fault. Stop safely and check, or get help. Your handbook explains each light.',
  'Warning light on → stop safely and check.',
  undefined, { tags: ['maintenance', 'faults'] }),

  sv('X-SV-02', 'm', 'Which TWO of these will help reduce harmful emissions? Mark two answers.', [
    ['Planning routes to avoid congestion', 'Correct.'],
    ['Keeping your vehicle well maintained', 'Correct.'],
    ['Leaving a roof box on all year', 'It increases drag and fuel use.'],
    ['Braking and accelerating harshly', 'This wastes fuel.'],
  ], [0, 1],
  'Good planning, smooth driving and regular servicing all reduce fuel use and emissions.',
  'Plan, maintain, drive smoothly.',
  undefined, { tags: ['environment'] }),

  sv('X-SV-03', 'e', 'Must adult passengers wear a seat belt where one is fitted?', [
    ['Yes, unless they are exempt', 'Correct.'],
    ['Only in the front seats', 'Rear passengers must also wear them.'],
    ['Only on motorways', 'The law applies on all roads.'],
    ['No, it is their choice', 'It is a legal requirement.'],
  ], 0,
  'Everyone must wear a seat belt where one is fitted, unless exempt. Adult passengers are responsible for themselves.',
  'Seat belts: everyone, every seat, every journey.',
  undefined, { tags: ['seat-safety'], ref: 'Highway Code: Rules 99–100' }),

  sv('X-SV-04', 'e', 'How should you dispose of an old car battery?', [
    ['Take it to a local authority recycling site or a garage that recycles batteries', 'Correct.'],
    ['Put it in household rubbish', 'Batteries contain harmful acid and metals.'],
    ['Bury it', 'Harmful to the environment.'],
    ['Leave it at the roadside', 'Illegal fly-tipping.'],
  ], 0,
  'Batteries contain acid and heavy metals. Recycle them properly.',
  'Old batteries and oil: recycle safely.',
  undefined, { tags: ['environment'] }),

  sv('X-SV-05', 'm', 'May you leave a parked car unattended with the engine running?', [
    ['No – you must switch off the engine', 'Correct.'],
    ['Yes, for up to five minutes', 'There is no time allowance.'],
    ['Yes, if it is frosty', 'Not allowed – and it is an easy target for thieves.'],
    ['Yes, in a residential street', 'Not allowed.'],
  ], 0,
  'You must not leave a vehicle unattended with the engine running. Switch off the engine and apply the parking brake.',
  'Parking: engine off, parking brake on.',
  undefined, { tags: ['parking', 'security'], ref: 'Highway Code: Rule 123 and Rule 239' }),

  sv('X-SV-06', 'e', 'Why must you keep your windscreen and windows clean?', [
    ['To see clearly and reduce dazzle from lights and sun', 'Correct.'],
    ['To improve fuel economy', 'Not the reason.'],
    ['To pass the MOT only', 'Safety every day is the reason.'],
    ['So other drivers can see your passengers', 'Not the reason.'],
  ], 0,
  'Dirt and smears scatter light and make dazzle much worse, especially at night and in low sun.',
  'Clean glass = clear view.',
  undefined, { tags: ['visibility'] }),

  // ------------------------------------------------------------ Safety margins
  sm('X-SM-01', 'm', 'Which TWO of these will increase your stopping distance? Mark two answers.', [
    ['Wet roads', 'Correct. Stopping distances at least double.'],
    ['Worn tyres', 'Correct. Less tread means less grip.'],
    ['A dry road', 'Dry roads give the best grip.'],
    ['Newly serviced brakes', 'Good brakes help you stop.'],
  ], [0, 1],
  'Wet, icy or loose surfaces, worn tyres or brakes, heavy loads and higher speeds all increase stopping distance.',
  'Speed, surface, tyres, brakes and load affect stopping distance.',
  undefined, { tags: ['stopping-distance', 'tyres', 'weather'] }),

  sm('X-SM-02', 'm', 'How should you check you are leaving a four-second gap on a wet road?', [
    ['Note when the vehicle ahead passes a fixed point, then count to four before you reach it', 'Correct.'],
    ['Leave four car lengths', 'Car lengths do not change with speed.'],
    ['Stay four metres behind', 'Far too close.'],
    ['Wait four seconds at junctions', 'Not related.'],
  ], 0,
  'Time gaps work at any speed. Pick a fixed point such as a bridge or sign and count.',
  'Gaps are measured in seconds, not metres.',
  undefined, { tags: ['following-distance', 'weather'], ruleKey: 'gap-wet-method' }),

  sm('X-SM-03', 'm', 'Why should you drive more slowly at night?', [
    ['You cannot see as far, so you must be able to stop within the distance lit by your headlights', 'Correct.'],
    ['Speed limits are lower at night', 'They are the same.'],
    ['Your engine runs cooler', 'Not relevant.'],
    ['Other drivers expect it', 'Not the reason.'],
  ], 0,
  'Always be able to stop within the distance you can see to be clear. At night that is the reach of your headlights.',
  'Stop within the distance you can see.',
  undefined, { tags: ['night', 'speed'] }),

  sm('X-SM-04', 'h', 'You are approaching a bend on an icy road. What should you do?', [
    ['Slow down on the straight before the bend and steer gently', 'Correct.'],
    ['Brake firmly in the bend', 'This is likely to cause a skid.'],
    ['Accelerate through the bend', 'Harsh acceleration causes skids.'],
    ['Change down to first gear in the bend', 'Sudden changes upset the car.'],
  ], 0,
  'On ice, all actions must be gentle. Get your speed right before the bend, then steer smoothly.',
  'Ice: slow down early, steer gently.',
  undefined, { tags: ['winter', 'bends', 'skids'] }),

  // ------------------------------------------------------------ Hazard awareness
  ha('X-HA-01', 'e', 'You see a "children going to or from school" sign with flashing amber lights below it. What does this mean?', [
    ['Children are likely to be crossing ahead – slow down', 'Correct.'],
    ['The school is closed', 'Not correct.'],
    ['There is a level crossing ahead', 'Not correct.'],
    ['You must stop and wait', 'You must be prepared to stop, but it is not a stop signal.'],
  ], 0,
  'Flashing amber lights below a school sign warn that children are likely to be crossing the road on their way to or from school.',
  'School sign + flashing lights = children crossing now.',
  undefined, { tags: ['children', 'road-signs'] }),

  ha('X-HA-02', 'm', 'You are driving through a busy town centre. Which TWO hazards should you look out for? Mark two answers.', [
    ['Pedestrians stepping into the road', 'Correct.'],
    ['Buses pulling out from stops', 'Correct.'],
    ['Farm animals on the road', 'Less likely in a town centre.'],
    ['Motorway countdown markers', 'Not in a town centre.'],
  ], [0, 1],
  'Town centres have many pedestrians, buses, cyclists, delivery vehicles and junctions. Keep your speed down and scan.',
  'Town driving: expect people and buses.',
  undefined, { tags: ['pedestrians', 'buses'], scenario: true }),

  ha('X-HA-03', 'h', 'On a dual carriageway, a vehicle in the lane next to you has stopped at a zebra crossing. What should you do?', [
    ['Slow down and be ready to stop – someone may be crossing in front of it', 'Correct.'],
    ['Overtake it quickly', 'You must not overtake a vehicle stopped at a crossing.'],
    ['Sound your horn', 'Not appropriate.'],
    ['Change lanes behind it and continue', 'You still must not pass it on the crossing approach.'],
  ], 0,
  'A stopped vehicle may be hiding a pedestrian. You must not overtake a vehicle that has stopped to give way at a crossing.',
  'Never pass a vehicle stopped at a crossing.',
  undefined, { tags: ['crossings', 'pedestrians'], scenario: true }),

  ha('X-HA-04', 'm', 'On a motorway, traffic ahead is slowing down suddenly. What could you do to warn drivers behind?', [
    ['Briefly use your hazard warning lights', 'Correct. Allowed on motorways and unrestricted dual carriageways.'],
    ['Flash your headlights', 'Drivers behind cannot see your headlights.'],
    ['Sound your horn', 'Not effective or appropriate.'],
    ['Switch on your rear fog lights', 'Only for poor visibility.'],
  ], 0,
  'You may use hazard warning lights briefly on motorways or unrestricted dual carriageways to warn drivers behind of a hazard or obstruction ahead.',
  'Sudden queue on a fast road: brief hazard lights.',
  undefined, { tags: ['lights', 'motorway'], ref: 'Highway Code: Rule 116' }),

  ha('X-HA-05', 'm', 'You have just had an upsetting argument and feel angry. What should you do before driving?', [
    ['Calm down before you start driving', 'Correct.'],
    ['Drive fast to release the tension', 'Dangerous.'],
    ['Play loud music', 'Distracting.'],
    ['Drive on a motorway because it is easier', 'Your judgement is still affected.'],
  ], 0,
  'Strong emotions affect concentration and judgement. Wait until you are calm.',
  'Angry or upset? Calm down before you drive.',
  undefined, { tags: ['fitness'] }),

  // ------------------------------------------------------------ Vulnerable road users
  vu('X-VU-01', 'e', 'Which TWO of these road users are most vulnerable at junctions? Mark two answers.', [
    ['Cyclists', 'Correct.'],
    ['Motorcyclists', 'Correct.'],
    ['Lorry drivers', 'Lorries are large and well protected.'],
    ['Bus drivers', 'Buses are large and well protected.'],
  ], [0, 1],
  'Cyclists and motorcyclists are small, easily hidden and unprotected. Look carefully for them at every junction.',
  'Look twice for bikes.',
  undefined, { tags: ['cyclists', 'motorcyclists', 'junctions'] }),

  vu('X-VU-02', 'm', 'You want to overtake a cyclist, but oncoming traffic means you cannot leave at least 1.5 metres. What should you do?', [
    ['Wait behind until it is safe to overtake with enough space', 'Correct.'],
    ['Squeeze past slowly', 'Too close and dangerous.'],
    ['Sound your horn so they move over', 'Not appropriate.'],
    ['Overtake quickly to reduce the time alongside', 'Speed makes it more dangerous.'],
  ], 0,
  'If you cannot give the recommended space, wait behind the cyclist until you can overtake safely.',
  'No room for 1.5 m? Wait.',
  undefined, { tags: ['cyclists', 'overtaking'], ref: 'Highway Code: Rule 163', ruleKey: 'pass-cyclist-wait', scenario: true }),

  vu('X-VU-03', 'm', 'A stationary bus with "school bus" signs is ahead. What should you do?', [
    ['Slow down and watch for children getting off and crossing', 'Correct.'],
    ['Sound your horn as you pass', 'Could startle children.'],
    ['Pass quickly', 'Dangerous.'],
    ['Overtake on the left', 'Never.'],
  ], 0,
  'Children may step out from in front of or behind the bus without looking.',
  'School bus = expect children.',
  undefined, { tags: ['children', 'buses'] }),

  vu('X-VU-04', 'm', 'Two cyclists are riding side by side ahead of you. What does the Highway Code say?', [
    ['Cyclists may ride two abreast; be patient and overtake only when it is safe', 'Correct.'],
    ['Cyclists must always ride in single file', 'Not correct – riding two abreast can be safer in some situations.'],
    ['You may sound your horn to make them single file', 'Not appropriate.'],
    ['You may overtake with less than 1.5 m space', 'The space guidance still applies.'],
  ], 0,
  'Cyclists can ride two abreast and should be aware of drivers behind. Drivers should be patient and overtake only when safe.',
  'Cyclists side by side: be patient.',
  undefined, { tags: ['cyclists'], ref: 'Highway Code: Rule 66 and Rule 163' }),

  vu('X-VU-05', 'e', 'A person with a guide dog is waiting at the kerb. What should you be aware of?', [
    ['They are likely to be blind or partially sighted – be patient and ready to stop', 'Correct.'],
    ['They will always wait for you to pass', 'They may not see you.'],
    ['The dog will stop them crossing in front of you', 'Do not rely on the dog.'],
    ['You should sound your horn so they know you are there', 'This could alarm them.'],
  ], 0,
  'Guide dog users may not be able to see you. Give them time and space.',
  'Guide dog = visually impaired pedestrian.',
  undefined, { tags: ['pedestrians'] }),

  vu('X-VU-06', 'm', 'Why should you not rev your engine or sound your horn near horses?', [
    ['It may frighten the horse', 'Correct.'],
    ['It is illegal on country roads', 'The reason is safety.'],
    ['It wastes fuel', 'Not the main reason.'],
    ['Horses cannot hear engines', 'They can – and may react.'],
  ], 0,
  'Horses can be easily frightened by noise and may move suddenly into your path.',
  'Near horses: slow, quiet, wide.',
  undefined, { tags: ['horses'], ref: 'Highway Code: Rule 215' }),

  // ------------------------------------------------------------ Other types of vehicle
  ov('X-OV-01', 'm', 'Why should you take extra care near cyclists and motorcyclists on roads with tram lines?', [
    ['Their tyres can get caught in the rails, so they may swerve or fall', 'Correct.'],
    ['Trams always give way to them', 'Not correct.'],
    ['They are not allowed near trams', 'They may use these roads.'],
    ['Tram lines make the road surface sticky', 'Rails are slippery, especially when wet.'],
  ], 0,
  'Narrow wheels can get trapped in tram rails, and rails are slippery when wet. Give riders extra room.',
  'Tram rails: expect riders to move to cross them at an angle.',
  undefined, { tags: ['trams', 'cyclists'] }),

  ov('X-OV-02', 'm', 'Which TWO are true about large goods vehicles? Mark two answers.', [
    ['They need more room to turn', 'Correct.'],
    ['They take longer to stop', 'Correct.'],
    ['They can stop more quickly than cars', 'Heavier vehicles usually need more distance.'],
    ['They are never affected by wind', 'They are badly affected by crosswinds.'],
  ], [0, 1],
  'Large vehicles need more space at junctions and roundabouts and take longer to stop. Give them room.',
  'Big vehicle = more space to turn and stop.',
  undefined, { tags: ['large-vehicles'] }),

  ov('X-OV-03', 'e', 'A bus lane sign shows a bus and a bicycle. Who may use the lane during its hours of operation?', [
    ['Buses and cyclists (and any other vehicles shown on the sign)', 'Correct.'],
    ['All cars', 'Not during its hours.'],
    ['Only buses', 'The bicycle symbol means cyclists too.'],
    ['Only taxis', 'Only if a taxi is shown.'],
  ], 0,
  'Bus lane signs show which vehicles can use the lane and when. Other vehicles must keep out during those times.',
  'Read the bus lane sign: who and when.',
  undefined, { tags: ['lanes', 'buses'] }),

  ov('X-OV-04', 'm', 'You are driving an electric car slowly through a car park. Why should you take extra care?', [
    ['Pedestrians may not hear you approaching', 'Correct.'],
    ['Electric cars cannot brake at low speed', 'Not true.'],
    ['Electric cars must use hazard lights in car parks', 'Not a rule.'],
    ['Electric cars are wider than other cars', 'Not the reason.'],
  ], 0,
  'Electric and hybrid vehicles can be very quiet at low speeds, so people may not know you are there.',
  'Quiet vehicles: drive slowly and watch for pedestrians.',
  undefined, { tags: ['pedestrians'] }),

  // ------------------------------------------------------------ Vehicle handling
  vh('X-VH-01', 'm', 'Which TWO situations require you to use headlights during the day? Mark two answers.', [
    ['Heavy rain that seriously reduces visibility', 'Correct.'],
    ['Thick fog', 'Correct.'],
    ['A bright sunny day on the motorway', 'Not required.'],
    ['A well-lit car park', 'Not required.'],
  ], [0, 1],
  'You must use headlights when visibility is seriously reduced, generally when you cannot see more than 100 metres.',
  'Poor visibility = headlights on.',
  undefined, { tags: ['lights', 'weather'], ref: 'Highway Code: Rule 226' }),

  vh('X-VH-02', 'h', 'You need to drive through a flooded section of road. What is the correct technique?', [
    ['Drive slowly in first gear, keeping the engine speed high, then test your brakes afterwards', 'Correct.'],
    ['Drive through as fast as possible', 'This can cause loss of control and engine damage.'],
    ['Drive in top gear with low engine revs', 'The engine may stall.'],
    ['Switch off the engine and coast through', 'Never.'],
  ], 0,
  'If you must drive through water, go slowly in first gear but keep the engine speed high (slipping the clutch) so you do not stall. Test your brakes afterwards.',
  'Floods: slow, first gear, high revs, test brakes.',
  undefined, { tags: ['water', 'brakes'], ref: 'Highway Code: Rule 121' }),

  vh('X-VH-03', 'm', 'Why should you avoid sharp steering on loose gravel?', [
    ['You may lose grip and skid', 'Correct.'],
    ['It damages the steering wheel', 'Not the reason.'],
    ['It makes the engine stall', 'Not the reason.'],
    ['It is illegal', 'The reason is safety.'],
  ], 0,
  'Loose surfaces give less grip. Smooth, gentle steering and braking help you keep control.',
  'Loose surface: gentle inputs.',
  undefined, { tags: ['road-surface', 'skids'] }),

  vh('X-VH-04', 'e', 'You are following another vehicle at night on an unlit road. Which lights should you use?', [
    ['Dipped headlights', 'Correct – main beam would dazzle the driver ahead.'],
    ['Main beam headlights', 'This dazzles the driver in front through their mirrors.'],
    ['Sidelights only', 'Not enough on an unlit road.'],
    ['Front fog lights', 'Only for poor visibility.'],
  ], 0,
  'Use dipped headlights when following another vehicle so you do not dazzle the driver.',
  'Following at night: dip.',
  undefined, { tags: ['lights', 'night'] }),

  // ------------------------------------------------------------ Motorway
  mw('X-MW-01', 'm', 'Which TWO should you do if your car breaks down on a motorway with a hard shoulder? Mark two answers.', [
    ['Switch on your hazard warning lights', 'Correct.'],
    ['Leave the car by the left-hand (nearside) doors', 'Correct.'],
    ['Place a warning triangle 45 metres behind', 'Never on a motorway.'],
    ['Stand behind the car to warn traffic', 'Very dangerous.'],
  ], [0, 1],
  'Pull onto the hard shoulder as far left as possible, switch on hazard lights, leave by the nearside doors and wait behind the barrier.',
  'Hazards on, out on the left, behind the barrier.',
  undefined, { tags: ['breakdown'] }),

  mw('X-MW-02', 'e', 'What is the acceleration lane on a slip road for?', [
    ['Building up your speed to match traffic on the motorway', 'Correct.'],
    ['Overtaking slow vehicles', 'Not its purpose.'],
    ['Stopping to check your map', 'Never stop there except in an emergency or queue.'],
    ['Waiting for a large gap', 'Adjust speed to merge – do not stop unless you must.'],
  ], 0,
  'Use the slip road and acceleration lane to match your speed to the traffic in the left lane before merging.',
  'Slip road: match speed, merge into a safe gap.',
  undefined, { tags: ['joining'] }),

  mw('X-MW-03', 'm', 'When may you stop on the main carriageway of a motorway?', [
    ['In a traffic queue, when signs or signals tell you to, or in an emergency', 'Correct.'],
    ['To pick up a hitchhiker', 'Not allowed.'],
    ['To answer your phone', 'Not allowed.'],
    ['To read a map', 'Not allowed.'],
  ], 0,
  'You must not stop on a motorway except in an emergency, when told to by police, traffic officers or signals, or in queuing traffic.',
  'Motorway stopping = emergency, signals or queue only.',
  undefined, { tags: ['motorway-users', 'signals'] }),

  mw('X-MW-04', 'h', 'On a smart motorway, how do you know the hard shoulder is open as a running lane?', [
    ['A speed limit is shown above it on the overhead gantry', 'Correct. A red X means it is closed.'],
    ['It is always open at night', 'Not correct.'],
    ['Its surface is coloured orange', 'Orange marks emergency areas.'],
    ['Traffic is moving faster in it', 'Not a reliable signal.'],
  ], 0,
  'Only use the hard shoulder as a running lane when a speed limit is displayed above it. A red X or blank sign means you must not use it.',
  'Speed limit shown above it = open. Red X = closed.',
  undefined, { tags: ['smart-motorway', 'hard-shoulder', 'signals'] }),

  mw('X-MW-05', 'm', 'Flashing amber lights on a motorway signal ahead mean what?', [
    ['There is a hazard ahead – slow down and watch for lane changes or a temporary limit', 'Correct.'],
    ['The motorway is ending', 'Not correct.'],
    ['You must leave at the next exit', 'Not unless shown.'],
    ['You may use the hard shoulder', 'Not unless a speed limit is shown above it.'],
  ], 0,
  'Flashing amber lights warn of a hazard such as fog, an incident or lane closures. Adjust your speed.',
  'Flashing amber = hazard ahead.',
  undefined, { tags: ['signals'] }),

  mw('X-MW-06', 'e', 'Which TWO of these must NOT use a motorway? Mark two answers.', [
    ['Cyclists', 'Correct.'],
    ['Pedestrians', 'Correct.'],
    ['Learner car drivers with an approved driving instructor in a dual-control car', 'Allowed since June 2018.'],
    ['Cars towing caravans', 'Allowed, with a 60 mph limit and lane restrictions.'],
  ], [0, 1],
  'Pedestrians, cyclists, horse riders, learner motorcyclists and motorcycles under 50 cc must not use motorways.',
  'No walkers, cyclists, horses or small/learner motorcycles on motorways.',
  undefined, { tags: ['motorway-users'], ruleKey: 'motorway-users-two' }),

  // ------------------------------------------------------------ Rules of the road (incl. roundabouts)
  rr('X-RR-01', 'e', 'You are taking the first exit (turning left) at a roundabout. How should you approach?', [
    ['Signal left and approach in the left-hand lane', 'Correct.'],
    ['Signal right and use the right-hand lane', 'This is for turning right.'],
    ['No signal, any lane', 'Signal and use the correct lane.'],
    ['Signal left in the right-hand lane', 'Wrong lane.'],
  ], 0,
  'For the first exit: signal left, approach in the left lane, and keep to the left on the roundabout.',
  'Left exit: left signal, left lane.',
  undefined, { tags: ['roundabouts'], ref: 'Highway Code: Rule 186' }),

  rr('X-RR-02', 'm', 'You are turning right at a roundabout. What is the correct procedure?', [
    ['Signal right, approach in the right-hand lane, then signal left after passing the exit before the one you want', 'Correct.'],
    ['Signal left and use the left-hand lane', 'This is for turning left.'],
    ['No signals at all', 'Signals help others predict your path.'],
    ['Signal right all the way round and off', 'Change to a left signal before your exit.'],
  ], 0,
  'Turning right: signal right and approach in the right lane, keep to the right on the roundabout, then signal left after passing the exit before yours.',
  'Right at a roundabout: right signal, right lane, left signal to leave.',
  undefined, { tags: ['roundabouts'], ref: 'Highway Code: Rule 186' }),

  rr('X-RR-03', 'm', 'You are going straight ahead at a roundabout (no special markings). How should you signal?', [
    ['No signal on approach; signal left after passing the exit before the one you want', 'Correct.'],
    ['Signal right on approach', 'This suggests you are turning right.'],
    ['Signal left on approach', 'This suggests you are taking the first exit.'],
    ['Use hazard lights', 'Never.'],
  ], 0,
  'Going ahead: normally no signal on approach, select the appropriate lane, then signal left after passing the exit before yours.',
  'Straight on: signal left only when leaving.',
  undefined, { tags: ['roundabouts'], ref: 'Highway Code: Rule 186' }),

  rr('X-RR-04', 'e', 'The traffic lights are green, but the road beyond the junction is blocked by queuing traffic. What should you do?', [
    ['Wait behind the stop line until there is space to clear the junction', 'Correct.'],
    ['Go into the junction because the light is green', 'You would block the junction.'],
    ['Sound your horn at the queue', 'Not appropriate.'],
    ['Drive on the pavement', 'Never.'],
  ], 0,
  'Green means go only if the way is clear. Do not enter a junction unless you can clear it.',
  'Green is not a reason to block a junction.',
  undefined, { tags: ['traffic-lights', 'junctions'] }),

  rr('X-RR-05', 'e', 'Where must you NOT park? Mark two answers.', [
    ['On the zig-zag lines at a pedestrian crossing', 'Correct.'],
    ['Within 10 metres of a junction (unless in an authorised space)', 'Correct.'],
    ['In a marked parking bay', 'This is allowed (follow its rules).'],
    ['In a lay-by', 'Usually allowed.'],
  ], [0, 1],
  'Do not park on zig-zags, within 10 metres of a junction, on bends, near hill brows, or where you would obstruct others.',
  'Parking no-gos: zig-zags, junctions, bends, crossings.',
  undefined, { tags: ['parking', 'crossings'], ref: 'Highway Code: Rule 243' }),

  rr('X-RR-06', 'm', 'When may you overtake on the left?', [
    ['When the vehicle in front is signalling right and turning right, and it is safe', 'Correct.'],
    ['Whenever the left lane is clear', 'Not allowed in normal conditions.'],
    ['When the driver ahead is going slowly', 'Overtake on the right.'],
    ['Never', 'There are some situations where it is allowed.'],
  ], 0,
  'Normally overtake on the right. You may pass on the left when the vehicle ahead is turning right, in one-way streets, or in slow queues where the right lane is slower.',
  'Pass on the left only in the special cases.',
  undefined, { tags: ['overtaking'], ref: 'Highway Code: Rule 163' }),

  rr('X-RR-07', 'e', 'You reach a junction with a STOP sign and a solid white line. The road looks clear. What must you do?', [
    ['Stop at the line, even if the road is clear', 'Correct.'],
    ['Slow down and continue if clear', 'At a STOP sign you must stop.'],
    ['Stop only if traffic is coming', 'You must always stop.'],
    ['Sound your horn and go', 'Not correct.'],
  ], 0,
  'At a STOP sign you must stop at the line and wait until you can enter the road safely.',
  'STOP means stop – every time.',
  undefined, { tags: ['junctions', 'road-signs'] }),

  rr('X-RR-08', 'm', 'You are turning right at a crossroads. An oncoming vehicle is also turning right. What is the usual way to turn?', [
    ['Offside to offside – pass behind each other', 'Correct, unless markings or the layout mean otherwise.'],
    ['Nearside to nearside – pass in front of each other', 'Possible if the layout requires it, but not the usual method.'],
    ['Whoever is bigger goes first', 'Not a rule.'],
    ['Both wait for the other to go', 'This causes delay.'],
  ], 0,
  'Normally turn offside to offside, keeping the other vehicle on your right, so you can see oncoming traffic. Layout or markings may require nearside to nearside – take extra care then.',
  'Opposing right turns: usually offside to offside.',
  undefined, { tags: ['junctions'], ref: 'Highway Code: Rule 181' }),

  rr('X-RR-09', 'm', 'At a level crossing, a train has passed but the red lights keep flashing. What should you do?', [
    ['Keep waiting – another train may be coming', 'Correct.'],
    ['Go, because the train has gone', 'Dangerous.'],
    ['Zig-zag around the barriers', 'Never.'],
    ['Reverse back from the crossing', 'Not necessary – wait.'],
  ], 0,
  'If the lights continue to flash after a train has passed, wait. Another train is approaching.',
  'Lights still flashing = another train.',
  undefined, { tags: ['level-crossings'], ref: 'Highway Code: Rules 291–299' }),

  rr('X-RR-10', 'm', 'You are approaching road works with a contraflow on a dual carriageway. What should you do?', [
    ['Choose the correct lane early and keep to the lower speed limit', 'Correct.'],
    ['Change lanes in the contraflow to find the fastest', 'Avoid changing lanes.'],
    ['Drive close to the vehicle in front to keep traffic moving', 'Keep a safe gap.'],
    ['Ignore the temporary limit if no workers are present', 'Temporary limits must be obeyed.'],
  ], 0,
  'In road works and contraflows, get in lane early, obey temporary speed limits and keep a safe distance.',
  'Road works: early lane choice, obey the limit.',
  undefined, { tags: ['lanes', 'road-works'], ref: 'Highway Code: Rule 288' }),

  // ------------------------------------------------------------ Signs and signals
  sg('X-SG-01', 'e', 'Double broken white lines across the road at a junction mean what?', [
    ['Give way to traffic on the major road', 'Correct.'],
    ['Stop and wait at all times', 'That is a solid line with a STOP sign.'],
    ['No entry', 'Not correct.'],
    ['Bus stop', 'Not correct.'],
  ], 0,
  'Broken white lines across the road mark where you should give way to traffic on the major road.',
  'Broken lines across = give way. Solid line + STOP = stop.',
  undefined, { tags: ['markings', 'junctions'] }),

  sg('X-SG-02', 'm', 'What do double red lines along the edge of the road mean?', [
    ['No stopping at any time (red route)', 'Correct.'],
    ['No waiting during the day only', 'Not correct.'],
    ['Loading only', 'Not correct.'],
    ['Parking for permit holders', 'Not correct.'],
  ], 0,
  'On red routes, double red lines mean no stopping at any time. Single red lines mean no stopping during the times shown.',
  'Double red = no stopping at all.',
  undefined, { tags: ['markings', 'parking'] }),

  sg('X-SG-03', 'm', 'A police officer facing you raises an arm with the palm towards you. What does this mean?', [
    ['Stop', 'Correct.'],
    ['Go ahead', 'Not correct.'],
    ['Turn left', 'Not correct.'],
    ['Speed up', 'Not correct.'],
  ], 0,
  'Police officers and traffic officers can direct traffic. A raised arm with the palm towards you means stop.',
  'You must obey signals given by police and traffic officers.',
  undefined, { tags: ['signals'] }),

  sg('X-SG-04', 'h', 'Above a lane you see a green downward-pointing arrow. What does it mean?', [
    ['The lane is open for you to use', 'Correct.'],
    ['The lane is closed', 'A red cross means closed.'],
    ['Move into the lane on the left', 'A white diagonal arrow means change lane.'],
    ['Leave at the next exit', 'Not correct.'],
  ], 0,
  'Lane control signals: green arrow – lane available; red cross – lane closed; white diagonal arrow – move to the lane shown.',
  'Green arrow = use. Red X = do not use.',
  undefined, { tags: ['signals', 'lanes'] }),

  // ------------------------------------------------------------ Documents
  dc('X-DC-01', 'e', 'Can you drive a friend\'s car?', [
    ['Only if you are insured to drive it', 'Correct.'],
    ['Yes, always, if they agree', 'Agreement is not insurance.'],
    ['Yes, if you have a full licence', 'You still need insurance cover.'],
    ['Only on weekends', 'Not correct.'],
  ], 0,
  'You must be insured to drive any vehicle on the road. Do not assume your own policy covers other cars.',
  'Every car, every driver: insurance first.',
  undefined, { tags: ['insurance'] }),

  dc('X-DC-02', 'm', 'Which TWO must a learner driver have before driving a car on the road? Mark two answers.', [
    ['A valid provisional driving licence', 'Correct.'],
    ['Insurance that covers them as a learner', 'Correct.'],
    ['A theory test pass certificate', 'You do not need to pass the theory test to start learning on the road.'],
    ['A full licence', 'Learners have provisional licences.'],
  ], [0, 1],
  'Learners need a provisional licence, insurance, a qualified supervisor, a roadworthy taxed vehicle and L plates (or D plates in Wales).',
  'Learner: provisional licence + insurance + supervisor + L plates.',
  undefined, { tags: ['learners', 'licence', 'insurance'] }),

  dc('X-DC-03', 'h', 'How long do most penalty points stay on your driving record?', [
    ['4 years from the date of the offence (11 years for some serious offences such as drink driving)', 'Correct.'],
    ['1 year', 'Not correct.'],
    ['Until you renew your licence', 'Not correct.'],
    ['Forever', 'Not correct.'],
  ], 0,
  'Most endorsements stay on your record for 4 years; some, such as drink or drug driving, stay for 11 years.',
  'Most points: 4 years. Drink/drug driving: 11 years.',
  undefined, { tags: ['penalty-points'], ref: 'GOV.UK: Penalty points (endorsements)' }),

  dc('X-DC-04', 'h', 'What is the fixed penalty for driving without insurance?', [
    ['£300 and 6 penalty points (with an unlimited fine and disqualification possible in court)', 'Correct.'],
    ['A warning letter', 'It is a serious offence.'],
    ['£50 and no points', 'Not correct.'],
    ['3 penalty points only', 'Not correct.'],
  ], 0,
  'The police can give a £300 fixed penalty and 6 penalty points. If it goes to court you could get an unlimited fine and be disqualified. The vehicle can also be seized.',
  'No insurance: £300, 6 points – enough to revoke a new licence.',
  undefined, { tags: ['insurance', 'penalty-points'], ref: 'GOV.UK: Vehicle insurance' }),

  dc('X-DC-05', 'e', 'Who is responsible for taxing a vehicle?', [
    ['The registered keeper', 'Correct.'],
    ['The insurance company', 'Not correct.'],
    ['The MOT tester', 'Not correct.'],
    ['The last owner', 'Tax does not transfer.'],
  ], 0,
  'The registered keeper must make sure the vehicle is taxed, or make a SORN if it is kept off the road.',
  'Keeper taxes the vehicle.',
  undefined, { tags: ['tax'] }),

  // ------------------------------------------------------------ Incidents (general)
  inc('X-IN-01', 'm', 'You call 999 after a crash. What information should you give?', [
    ['The exact location, the number of vehicles and the condition of any casualties', 'Correct.'],
    ['Only your name', 'Not enough.'],
    ['The make of your car', 'Not the priority.'],
    ['Whose fault it was', 'Not relevant to the emergency services at this stage.'],
  ], 0,
  'Give the exact location (including direction of travel on a motorway), the number of vehicles involved and casualties\' condition.',
  'Where, how many, how badly hurt.',
  undefined, { tags: ['collisions'] }),

  inc('X-IN-02', 'e', 'You arrive at a crash. Which TWO things should you do first? Mark two answers.', [
    ['Switch on your hazard warning lights to warn other traffic', 'Correct.'],
    ['Switch off the engines of the vehicles involved', 'Correct – this reduces the risk of fire.'],
    ['Move the casualties out of their cars', 'Only if there is further danger.'],
    ['Give casualties a hot drink', 'Never give anything to eat or drink.'],
  ], [0, 1],
  'Deal with danger first: warn other traffic, switch off engines, stop anyone smoking. Then call 999 or 112.',
  'Danger first: hazards on, engines off, no smoking.',
  undefined, { tags: ['collisions', 'first-aid'] }),

  inc('X-IN-03', 'm', 'A casualty is unconscious but breathing normally, and there is no further danger. What does the Highway Code advise?', [
    ['Place them in the recovery position until medical help arrives', 'Correct.'],
    ['Start chest compressions', 'CPR is for someone who is not breathing normally.'],
    ['Give them water', 'Never.'],
    ['Sit them upright and shake them', 'Not correct.'],
  ], 0,
  'If the casualty is unconscious and breathing, place them in the recovery position until help arrives (unless moving them could cause further harm).',
  'Unconscious + breathing = recovery position.',
  undefined, { tags: ['first-aid'] }),

  inc('X-IN-04', 'm', 'A casualty has a piece of glass stuck in a bleeding wound. What should you do?', [
    ['Leave it in place and build padding around it, then apply pressure around it', 'Correct.'],
    ['Pull it out quickly', 'Removing it can make bleeding much worse.'],
    ['Press directly on the glass', 'Do not press on the object.'],
    ['Wash the wound with soap', 'Not the priority.'],
  ], 0,
  'Do not remove anything stuck in a wound. Build padding on either side without pressing on the object, then bandage.',
  'Embedded object: leave it in, pad around.',
  undefined, { tags: ['first-aid'] }),

  inc('X-IN-05', 'm', 'At the scene of a crash, which TWO things should you NOT do? Mark two answers.', [
    ['Give a casualty something to drink', 'Correct – you should not do this. Never give casualties anything to eat or drink.'],
    ["Remove a motorcyclist's helmet when it is not essential", 'Correct – you should not do this. It could worsen a neck or spine injury.'],
    ['Keep casualties warm and reassure them', 'This is something you SHOULD do.'],
    ['Call 999 or 112', 'This is something you SHOULD do.'],
  ], [0, 1],
  "Do not give casualties anything to eat or drink, and do not remove a motorcyclist's helmet unless it is essential. Do keep them warm, reassure them and call for help.",
  'Nothing to drink; helmets stay on unless essential.',
  undefined, { tags: ['first-aid', 'collisions'] }),

  // ------------------------------------------------------------ First aid 2026: CPR and AED
  fa('X-FA-01', 'e', 'Who can use a public access defibrillator (AED)?', [
    ['Everyone', 'Correct. Public access defibrillators are designed to be used by the public.'],
    ['Only trained first aiders', 'No training is needed – it talks you through every step.'],
    ['Only paramedics', 'Anyone can and should use one in an emergency.'],
    ['Only doctors', 'Anyone can use one.'],
  ], 0,
  'Public access defibrillators are designed for anyone to use. When switched on, the machine gives clear spoken instructions.',
  'AED: anyone can use it.',
  undefined, { tags: ['aed', 'cpr', 'first-aid'] }),

  fa('X-FA-02', 'm', 'How far should you press down on an adult\'s chest when giving CPR?', [
    ['5 to 6 centimetres', 'Correct.'],
    ['1 to 2 centimetres', 'Too shallow to pump blood.'],
    ['10 centimetres', 'Too deep.'],
    ['Just enough to feel the ribs', 'Compressions must be hard and fast.'],
  ], 0,
  'For an adult, push hard and fast in the centre of the chest, about 5 to 6 cm deep.',
  'Adult CPR depth: 5–6 cm.',
  undefined, { tags: ['cpr', 'first-aid'], ruleKey: 'cpr-depth' }),

  fa('X-FA-03', 'm', 'How fast should you give chest compressions?', [
    ['About twice a second (100 to 120 a minute)', 'Correct.'],
    ['About once every five seconds', 'Far too slow.'],
    ['As fast as you possibly can, 300 a minute', 'Too fast to be effective.'],
    ['Once every minute', 'Far too slow.'],
  ], 0,
  'The Highway Code says press down hard and fast, about twice a second – that is 100 to 120 compressions a minute.',
  'CPR rate: about 2 a second.',
  'Some people time compressions to the beat of the song "Stayin\' Alive".',
  { tags: ['cpr', 'first-aid'], ruleKey: 'cpr-rate' }),

  fa('X-FA-04', 'e', 'Someone collapses and is not breathing normally. What should you do straight away?', [
    ['Call 999 (on speakerphone) and start CPR', 'Correct.'],
    ['Wait to see if they recover', 'Every minute without CPR reduces their chance of survival.'],
    ['Give them a drink of water', 'Never.'],
    ['Put them in the recovery position and leave them', 'The recovery position is for someone who IS breathing.'],
  ], 0,
  'If someone is unresponsive and not breathing normally, call 999 on speakerphone and start CPR immediately. The call handler can guide you.',
  'Not breathing normally: 999 + CPR.',
  undefined, { tags: ['cpr', 'first-aid'] }),

  fa('X-FA-05', 'm', 'Do you need training to use a public access defibrillator?', [
    ['No – it gives spoken instructions and talks you through what to do', 'Correct.'],
    ['Yes – you must hold a first aid certificate', 'Not required.'],
    ['Yes – only medical staff may use it', 'Not true.'],
    ['Only if the casualty is a child', 'Not true.'],
  ], 0,
  'Public access defibrillators are simple to use and do not require training. Switch it on and follow the instructions.',
  'Switch on and follow the voice.',
  undefined, { tags: ['aed', 'first-aid'] }),

  fa('X-FA-06', 'm', 'Could a defibrillator shock someone who does not need a shock?', [
    ['No – it analyses the heart rhythm and only shocks if it is needed', 'Correct.'],
    ['Yes – so only use it if you are sure', 'Do not hesitate – the machine decides.'],
    ['Yes – it shocks everyone it is attached to', 'Not true.'],
    ['It only works on children', 'Not true.'],
  ], 0,
  'A defibrillator checks the heart rhythm and will only give a shock if and when it is needed. You cannot make things worse by using it on someone in cardiac arrest.',
  'The AED decides whether to shock.',
  undefined, { tags: ['aed', 'first-aid'] }),

  fa('X-FA-07', 'm', 'How can you find the nearest public access defibrillator in an emergency?', [
    ['Call 999 – the call handler can tell you where the nearest registered defibrillator is', 'Correct. Registered defibrillators are listed on the national network (The Circuit).'],
    ['Drive to the nearest hospital to collect one', 'Too slow.'],
    ['You cannot – they are kept locked away from the public', 'Many are accessible to the public.'],
    ['Search social media', 'Not reliable in an emergency.'],
  ], 0,
  'Ambulance call handlers can see registered defibrillators and direct you or a helper to the nearest one.',
  '999 can locate the nearest defib.',
  undefined, { tags: ['aed', 'first-aid'] }),

  fa('X-FA-08', 'm', 'You are giving CPR and someone else is with you. What should you ask them to do?', [
    ['Find a defibrillator (AED) and bring it as quickly as possible', 'Correct.'],
    ['Move the casualty to a car', 'Not appropriate.'],
    ['Take photographs', 'Not appropriate.'],
    ['Give the casualty a drink', 'Never.'],
  ], 0,
  'CPR and early defibrillation together greatly improve survival. Send a helper to find an AED while you continue CPR.',
  'Helper = fetch the AED.',
  undefined, { tags: ['aed', 'cpr', 'first-aid'] }),

  fa('X-FA-09', 'h', 'How should you give chest compressions to an infant (a baby)?', [
    ['Use two fingers in the middle of the chest, pressing down about one third of the chest depth', 'Correct.'],
    ['Use both hands with full body weight', 'Far too forceful.'],
    ['Press on the stomach', 'Compressions go on the chest.'],
    ['Do not attempt CPR on an infant', 'CPR can save an infant\'s life.'],
  ], 0,
  'The Highway Code says: for infants, use two fingers in the middle of the chest and press down about a third of the chest depth.',
  'Infant: two fingers, one third depth.',
  undefined, { tags: ['cpr', 'first-aid', 'children'] }),

  fa('X-FA-10', 'h', 'How does CPR on a child differ from CPR on an adult?', [
    ['You may only need one hand, and you should not press down as far', 'Correct.'],
    ['You must use more force', 'Not correct.'],
    ['Children never need CPR', 'Not correct.'],
    ['You only press once every 10 seconds', 'Not correct.'],
  ], 0,
  'For a child, you may only need one hand and should not press down as far as for an adult.',
  'Child CPR: one hand, less depth.',
  undefined, { tags: ['cpr', 'first-aid', 'children'] }),

  fa('X-FA-11', 'm', 'When should you stop giving CPR?', [
    ['When the casualty starts breathing again or a medical professional takes over', 'Correct.'],
    ['After one minute', 'Far too soon.'],
    ['When you have given 30 compressions', 'Keep going.'],
    ['When the casualty\'s skin turns pink', 'Not a reliable sign.'],
  ], 0,
  'Do not stop until the casualty starts breathing again or a medical professional takes over (or a defibrillator tells you to pause).',
  'Keep going until they breathe or help takes over.',
  undefined, { tags: ['cpr', 'first-aid'] }),

  fa('X-FA-12', 'm', 'After cooling a burn, what can you cover it with?', [
    ['Cling film, if available', 'Correct.'],
    ['Cotton wool', 'Fibres stick to burns.'],
    ['Butter or cream', 'Never put fats or creams on a burn.'],
    ['A tight plaster', 'Not appropriate.'],
  ], 0,
  'Cool the burn for at least 20 minutes, then cover it with cling film if available. Do not remove anything stuck to it.',
  'Burns: 20 minutes cool water, then cling film.',
  undefined, { tags: ['first-aid'], ref: 'Highway Code: Annex 7 (updated 22 October 2025)' }),

  fa('X-FA-13', 'm', 'A defibrillator says it is analysing the heart rhythm. What should you do?', [
    ['Follow the spoken instructions and do not touch the casualty', 'Correct.'],
    ['Keep pressing on the chest', 'The machine will tell you when to continue CPR.'],
    ['Remove the pads', 'Never remove the pads.'],
    ['Switch it off and on again', 'Not correct.'],
  ], 0,
  'Defibrillators tell you when to stand clear and when to continue CPR. Always follow the instructions.',
  'AED analysing: hands off, follow the voice.',
  undefined, { tags: ['aed', 'first-aid'] }),

  fa('X-FA-14', 'e', 'Where should you place your hands for adult chest compressions?', [
    ['In the centre of the chest, with fingers interlocked', 'Correct.'],
    ['On the left side over the heart only', 'Use the centre of the chest.'],
    ['On the stomach', 'Not correct.'],
    ['On the neck', 'Not correct.'],
  ], 0,
  'Interlock your fingers and place them in the centre of the chest, then press down hard and fast.',
  'Hands: centre of the chest.',
  undefined, { tags: ['cpr', 'first-aid'] }),

  // ------------------------------------------------------------ Vehicle loading
  lo('X-LO-01', 'm', 'Which TWO are the driver\'s responsibility when carrying a load? Mark two answers.', [
    ['Making sure the load is secure', 'Correct.'],
    ['Not exceeding the vehicle\'s weight limits', 'Correct.'],
    ['Telling DVLA about each load', 'Not required.'],
    ['Fitting a roof rack for every journey', 'Not required.'],
  ], [0, 1],
  'You must not overload your vehicle and your load must be secure and not stick out dangerously.',
  'Driver: secure load, within weight limits.',
  undefined, { tags: ['load'] }),

  lo('X-LO-02', 'h', 'You passed your car test in 2026. What is the maximum authorised mass (MAM) of trailer you can tow on a car licence?', [
    ['Up to 3,500 kg', 'Correct, as long as the car is allowed to tow it.'],
    ['Up to 750 kg only', 'This was the rule for some drivers before December 2021.'],
    ['Any weight', 'Limits apply.'],
    ['You cannot tow anything', 'You can.'],
  ], 0,
  'Since 16 December 2021, car licence holders can tow trailers up to 3,500 kg MAM. Always check your car\'s towing limits in the handbook.',
  'Car licence: trailers up to 3,500 kg MAM (within the car\'s limits).',
  undefined, { tags: ['towing', 'licence'] }),

  lo('X-LO-03', 'm', 'What does "nose weight" mean when towing?', [
    ['The downward force the trailer coupling puts on the tow ball', 'Correct.'],
    ['The weight of the car\'s engine', 'Not correct.'],
    ['The weight of the front passengers', 'Not correct.'],
    ['The weight of the roof rack', 'Not correct.'],
  ], 0,
  'Nose weight is the downward load on the tow ball. It must be within the limits in your car\'s handbook.',
  'Check nose weight against the handbook.',
  undefined, { tags: ['towing'] }),
];
