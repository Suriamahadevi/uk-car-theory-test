import { maker } from './make';

const al = maker('alertness', 'Highway Code: Rules for drivers – general advice and Using the road');
const at = maker('attitude', 'Highway Code: Introduction (hierarchy of road users) and General rules');

export const alertness = [
  al('AL-01', 'e', 'Before you make a U-turn in the road, what should you do?', [
    ['Give an arm signal as well as using your indicators', 'Arm signals are not required for a U-turn; the key danger is traffic you have not seen.'],
    ['Signal so that other drivers can slow down for you', 'A signal does not give you priority. You must wait until the road is clear.'],
    ['Look over your shoulder for a final check', 'Correct. A final look covers the blind spot your mirrors cannot show.'],
    ['Select a higher gear than normal', 'A U-turn needs slow, precise control, which a low gear gives.'],
  ], 2,
  'A U-turn takes you across the whole road. Mirrors cannot show your blind spot, so a final look over your shoulder makes sure no cyclist, motorcyclist or car is coming.',
  'Before turning or moving off: mirrors, then a final shoulder check of the blind spot.',
  'A cyclist approaching from behind can be hidden next to your rear pillar until you turn your head.',
  { tags: ['blind-spot', 'manoeuvres'] }),

  al('AL-02', 'e', 'You start to feel tired while driving on a motorway. What should you do?', [
    ['Stop on the hard shoulder and have a sleep', 'The hard shoulder is for emergencies only. Tiredness is not an emergency.'],
    ['Leave the motorway at the next exit and rest', 'Correct. Leave at the next exit or service area and take a proper break.'],
    ['Open the windows and carry on to your destination', 'Fresh air only helps for a very short time. It does not cure tiredness.'],
    ['Increase your speed so the journey ends sooner', 'Driving faster while tired increases the risk of a serious crash.'],
  ], 1,
  'Tiredness slows your reactions and can make you fall asleep at the wheel. Leave the motorway at the next exit or services and rest. A caffeinated drink and a short nap (about 15 minutes) can help.',
  'Tired? Leave at the next exit or services and rest. Never stop on the hard shoulder just to sleep.',
  'You notice you have drifted towards the lane line twice. That is a warning sign – head for the next services.',
  { tags: ['tiredness', 'motorway'] }),

  al('AL-03', 'e', 'On a long journey, how often should you take a break?', [
    ['At least 15 minutes every two hours', 'Correct. This is the advice in the Highway Code.'],
    ['At least 5 minutes every four hours', 'Too short and too far apart to prevent tiredness.'],
    ['Only when you feel tired', 'Tiredness can build up without you noticing. Plan breaks in advance.'],
    ['At least 30 minutes every six hours', 'Six hours without a break is far too long.'],
  ], 0,
  'The Highway Code recommends a break of at least 15 minutes every two hours on long journeys.',
  'Break rule: at least 15 minutes every 2 hours.',
  'On a four-hour drive to Scotland, plan two stops at service areas before you set off.',
  { tags: ['tiredness'] }),

  al('AL-04', 'e', 'Your mobile phone rings while you are driving. What should you do?', [
    ['Answer it quickly and keep the call short', 'Holding a phone while driving is illegal, even for a short call.'],
    ['Pull up on the hard shoulder to answer it', 'You must not use the hard shoulder to make or take calls.'],
    ['Let it ring, then stop in a safe place before you use it', 'Correct. Ignore it and stop safely before checking or calling back.'],
    ['Reduce your speed while you take the call', 'Slowing down does not make it legal or safe to hold a phone.'],
  ], 2,
  'It is illegal to hold a phone or similar device while driving. Even a hands-free call is distracting. Let it go to voicemail, and find a safe and legal place to stop before using the phone.',
  'Never hold a phone while driving. Stop safely and legally first.',
  'Your satnav app shows a message. Leave it until you are parked at the next safe place.',
  { tags: ['phones', 'distraction'] }),

  al('AL-05', 'm', 'Is it safe to use a hands-free phone while you are driving?', [
    ['Yes, as long as you keep both hands on the wheel', 'Hands-free still takes your attention away from the road.'],
    ['No – it is still a distraction and you could be prosecuted if you are not in proper control', 'Correct. Hands-free is legal but distracting. Police can still charge you if your driving suffers.'],
    ['Yes, it is completely safe on motorways', 'Motorway speeds make distraction even more dangerous.'],
    ['Yes, but only when driving below 30 mph', 'There is no speed at which a phone conversation becomes safe.'],
  ], 1,
  'A phone conversation takes mental attention even if your hands are free. Research shows drivers on calls react more slowly. You can be prosecuted for not being in proper control of your vehicle.',
  'Hands-free is legal but not safe. The best option is not to make calls while driving.',
  undefined,
  { tags: ['phones', 'distraction'] }),

  al('AL-06', 'e', 'You are driving at night and are dazzled by the headlights of an oncoming vehicle. What should you do?', [
    ['Flash your headlights at the other driver', 'This could dazzle them too and cause a crash.'],
    ['Slow down or stop', 'Correct. Slow down, or stop if necessary, until your eyes recover.'],
    ['Close your eyes briefly', 'You must never close your eyes while driving.'],
    ['Switch your headlights to main beam', 'That would dazzle the other driver and make things worse.'],
  ], 1,
  'Dazzle makes you temporarily blind. Slow down or stop until you can see properly. Avoid looking directly at the oncoming lights; look towards the left kerb.',
  'Dazzled? Slow down or stop. Never retaliate with main beam.',
  'On an unlit country road, a lorry comes round a bend on full beam – ease off and look to the left edge of the road.',
  { tags: ['night', 'lights'] }),

  al('AL-07', 'e', 'What is a "blind spot" when driving?', [
    ['An area around your car that you cannot see in your mirrors', 'Correct. That is why you check over your shoulder.'],
    ['A dark area of road with no street lights', 'That is just an unlit road, not a blind spot.'],
    ['A part of the windscreen that the wipers miss', 'This is not what "blind spot" means.'],
    ['A bend where you cannot see oncoming traffic', 'That is restricted view, not your vehicle\'s blind spot.'],
  ], 0,
  'Blind spots are areas your mirrors do not cover, mostly to the rear on each side. A cyclist, motorcyclist or car can be hidden there.',
  'Mirrors do not show everything – check blind spots before moving off and changing lanes.',
  'Before moving out from a parked position, look over your right shoulder for a cyclist alongside your car.',
  { tags: ['blind-spot', 'mirrors'] }),

  al('AL-08', 'e', 'What is the correct routine before you change direction?', [
    ['Signal – Mirror – Manoeuvre', 'You must check mirrors before signalling, not after.'],
    ['Manoeuvre – Mirror – Signal', 'This is dangerous and the wrong order.'],
    ['Mirror – Signal – Manoeuvre', 'Correct. Look first, then signal, then act.'],
    ['Mirror – Manoeuvre – Signal', 'Signalling after the manoeuvre gives no warning to others.'],
  ], 2,
  'Mirror–Signal–Manoeuvre (MSM) means: check what is around you, tell others what you plan to do, then do it safely (Position, Speed, Look as part of the manoeuvre).',
  'MSM: Mirror → Signal → Manoeuvre.',
  'Turning left into a side road: check the centre and left mirrors for cyclists, signal left, then slow and turn.',
  { tags: ['mirrors'] }),

  al('AL-09', 'm', 'When is the best time to set up your satnav?', [
    ['While driving slowly in traffic', 'Even slow-moving traffic needs your full attention.'],
    ['When stopped at traffic lights', 'You are still in control of a vehicle in traffic. You could miss the lights changing or a hazard.'],
    ['Before you start your journey', 'Correct. Programme it before you set off.'],
    ['While driving on a quiet road', 'Quiet roads still contain hazards.'],
  ], 2,
  'Setting a satnav takes your eyes and mind away from the road. Do it before you leave, or stop safely to change it.',
  'Set satnav before you set off. Do not adjust it on the move.',
  undefined,
  { tags: ['distraction'] }),

  al('AL-10', 'm', 'You are approaching the brow of a hill on a narrow road. What should you do?', [
    ['Move into the middle of the road to get a better view', 'Oncoming traffic could be just over the hill.'],
    ['Slow down and be ready for hazards you cannot yet see', 'Correct. You cannot see what is over the brow, so slow down.'],
    ['Speed up to get over the hill quickly', 'More speed means less time to react to a hidden hazard.'],
    ['Overtake any slower vehicles before the top', 'Never overtake where you cannot see far enough ahead.'],
  ], 1,
  'Your view is limited at the brow of a hill. There could be a broken-down vehicle, a cyclist or oncoming traffic just over the top.',
  'Never drive faster than you can stop within the distance you can see to be clear.',
  'A tractor could be just over the crest of a narrow country lane.',
  { tags: ['planning'] }),

  al('AL-11', 'm', 'You want to turn right out of a minor road, but a parked van blocks your view to the left. What should you do?', [
    ['Pull out quickly before anything comes', 'You cannot see whether anything is coming. This is very dangerous.'],
    ['Sound your horn and pull out', 'The horn does not give you priority.'],
    ['Edge forward slowly until you can see clearly', 'Correct. Creep and peep until your view is clear.'],
    ['Get your passenger to tell you when it is clear', 'You remain responsible. Your passenger may misjudge it.'],
  ], 2,
  'When your view is blocked at a junction, edge forward slowly and carefully until you can see properly, being ready to stop.',
  'Blocked view at a junction: creep and peep.',
  undefined,
  { tags: ['junctions'], scenario: true }),

  al('AL-12', 'e', 'Why do windscreen pillars need extra care at junctions?', [
    ['They can hide cyclists, motorcyclists and pedestrians', 'Correct. Move your head to look around them.'],
    ['They make the car less stable on corners', 'Pillars do not affect stability.'],
    ['They reflect sunlight into your eyes', 'This is not the main danger.'],
    ['They stop your wipers working properly', 'This is not what the pillars do.'],
  ], 0,
  'The pillars either side of the windscreen create blind spots. A motorcyclist or pedestrian can be hidden behind one. Move your head to look around them.',
  'Look around the windscreen pillars at junctions and roundabouts.',
  'A motorcyclist approaching a roundabout can stay hidden behind your right-hand pillar as you both move.',
  { tags: ['blind-spot', 'junctions'] }),

  al('AL-13', 'e', 'Which of these is most likely to distract you while driving?', [
    ['Checking your mirrors regularly', 'This is good practice, not a distraction.'],
    ['Loud music', 'Correct. Loud music can stop you hearing horns or sirens and takes your attention.'],
    ['Planning well ahead', 'This is good observation.'],
    ['Keeping a safe gap', 'This is good practice.'],
  ], 1,
  'Loud music can distract you and can stop you hearing emergency vehicles, horns or other warnings.',
  'Anything that takes your eyes, hands or mind off driving is a distraction.',
  undefined,
  { tags: ['distraction'] }),

  al('AL-14', 'm', 'You are about to move off. Your car is parked on the left. Which is the last thing you should check?', [
    ['Your interior mirror', 'Mirrors are checked earlier, but they do not show the blind spot.'],
    ['Your right-hand blind spot', 'Correct. A final shoulder check is the last look before moving off.'],
    ['Your fuel gauge', 'This is not a safety check before moving.'],
    ['Your left door mirror', 'Traffic you are joining comes from the right.'],
  ], 1,
  'Before moving off from the left, check your mirrors, then look over your right shoulder to check the blind spot. Signal if it would help other road users.',
  'Moving off: mirrors, signal if needed, final blind-spot check.',
  undefined,
  { tags: ['blind-spot', 'moving-off'] }),

  al('AL-15', 'h', 'You are driving on a busy town road. Which of these shows good alertness?', [
    ['Looking only at the vehicle immediately in front', 'You need to look well ahead, not just at one vehicle.'],
    ['Scanning well ahead and checking mirrors often, so you see hazards early', 'Correct. Early hazard spotting gives you time to react.'],
    ['Driving close to the vehicle ahead so others cannot pull in', 'This leaves no safety margin.'],
    ['Relying on others to keep out of your way', 'You must anticipate what others might do.'],
  ], 1,
  'Good alertness means scanning the whole scene – far ahead, to the sides and behind – so you notice developing hazards early.',
  'Look well ahead, check mirrors regularly, plan early.',
  'Spotting a bus stopping 200 m ahead lets you plan for pedestrians stepping out.',
  { tags: ['planning'] }),
];

export const attitude = [
  at('AT-01', 'e', 'What does "tailgating" mean?', [
    ['Using the rear door of a hatchback car', 'This is not the driving meaning.'],
    ['Reversing into a parking space', 'This is not tailgating.'],
    ['Following another vehicle too closely', 'Correct.'],
    ['Driving with rear fog lights on', 'This is misuse of fog lights, not tailgating.'],
  ], 2,
  'Tailgating means driving too close behind the vehicle in front. If it brakes suddenly, you cannot stop in time.',
  'Keep at least a two-second gap in good conditions.',
  undefined,
  { tags: ['following-distance'] }),

  at('AT-02', 'm', 'A driver is following you very closely. What should you do?', [
    ['Brake sharply to warn them', 'This could cause a rear-end collision.'],
    ['Speed up to get away from them', 'Do not let others pressure you into speeding.'],
    ['Slow down gradually to increase the gap in front of you', 'Correct. More space in front means you can brake more gently if you need to.'],
    ['Move closer to the car ahead', 'This removes your safety margin.'],
  ], 2,
  'If you are being tailgated, increase the gap between you and the vehicle in front. Then if something happens ahead you can slow down gently, giving the tailgater time to react.',
  'Tailgated? Ease off and leave more space ahead. Do not brake-test.',
  'On a dual carriageway, a car sits a metre behind you. Ease off a little so any braking you do is gradual.',
  { tags: ['following-distance'], scenario: true }),

  at('AT-03', 'e', 'When should you flash your headlights at other road users?', [
    ['To show that you are giving way', 'Flashing can be misunderstood and has caused crashes.'],
    ['To let them know that you are there', 'Correct. This is the only proper use.'],
    ['To tell them that they can pull out', 'Never use flashing headlights to signal permission.'],
    ['To warn them of a police speed check', 'This is not a correct use of headlight flashing.'],
  ], 1,
  'The Highway Code says flash your headlights only to let other road users know you are there. Never assume a flash from someone else means it is safe to go.',
  'Headlight flash = "I am here". Nothing else.',
  undefined,
  { tags: ['signals'] }),

  at('AT-04', 'e', 'A pedestrian is waiting to cross at a zebra crossing. What should you do?', [
    ['Wave them across', 'Do not wave pedestrians across; there could be traffic they cannot see.'],
    ['Sound your horn to tell them to cross', 'Using the horn this way is wrong and may alarm them.'],
    ['Give way to them', 'Correct. You should give way to pedestrians waiting to cross a zebra crossing.'],
    ['Drive on, because they have not stepped onto the crossing yet', 'Since 2022, the Highway Code says you should give way to people waiting to cross.'],
  ], 2,
  'The Highway Code (updated 2022) says you should give way to pedestrians waiting to cross at a zebra crossing, and you must give way once they have stepped on to it. Do not wave them across.',
  'Zebra crossing: give way to people waiting; never wave them across.',
  'Slow down early as you approach the flashing amber beacons if someone is standing at the kerb.',
  { tags: ['crossings', 'pedestrians', 'hierarchy'] }),

  at('AT-05', 'm', 'You are being overtaken by another car which then needs to pull back in quickly. What should you do?', [
    ['Speed up so they cannot get in', 'This is aggressive and dangerous.'],
    ['Keep a steady course and slow down if necessary to let them in', 'Correct. Make it easy for them to pull in safely.'],
    ['Flash your headlights to show you are annoyed', 'This is aggressive and could be misunderstood.'],
    ['Sound your horn and brake hard', 'Braking hard could cause a crash behind you.'],
  ], 1,
  'When being overtaken, keep a steady course and do not speed up. If the overtaking driver gets into difficulty, slow down to let them back in safely.',
  'Being overtaken: do not speed up. Drop back if needed.',
  undefined,
  { tags: ['overtaking'] }),

  at('AT-06', 'm', 'You are waiting at a red traffic light. An emergency vehicle with flashing blue lights comes up behind you. What should you do?', [
    ['Drive through the red light to let it pass', 'You must not go through a red light. You could be prosecuted, and it could cause a crash.'],
    ['Stay where you are unless you can move safely and legally out of its way', 'Correct. Do not break the law; help only where it is safe and legal.'],
    ['Mount the pavement immediately', 'This puts pedestrians at risk.'],
    ['Switch your engine off', 'This would not help the emergency vehicle.'],
  ], 1,
  'Help emergency vehicles to pass, but do not break the law (for example by going through a red light or into a bus lane during its hours) or put anyone in danger. Do not brake harshly or mount the kerb.',
  'Help emergency vehicles only when it is safe and legal.',
  undefined,
  { tags: ['emergency-vehicles'], scenario: true }),

  at('AT-07', 'm', 'When must you not use your horn in a built-up area while moving?', [
    ['Between 11.30 pm and 7.00 am, unless another road user poses a danger', 'Correct.'],
    ['Between 10.00 pm and 6.00 am', 'These are not the correct times.'],
    ['At any time during the day', 'You may use it during the day to warn others of your presence.'],
    ['Between midnight and 8.00 am', 'These are not the correct times.'],
  ], 0,
  'You must not use your horn while moving in a built-up area between 11.30 pm and 7.00 am, unless another road user poses a danger. Never use it while stationary, except when another moving vehicle poses a danger.',
  'Horn curfew in built-up areas: 11.30 pm to 7.00 am.',
  undefined,
  { tags: ['horn'] }),

  at('AT-08', 'm', 'You are driving a slow-moving vehicle on a narrow, winding road. A long queue has built up behind you. What should you do?', [
    ['Keep going – it is their problem', 'The Highway Code asks you to let traffic past.'],
    ['Wave them past', 'Waving them past could lead them into danger.'],
    ['Pull in where it is safe to let them overtake', 'Correct.'],
    ['Speed up beyond what is safe', 'Never drive faster than is safe.'],
  ], 2,
  'If you are driving slowly and traffic builds up behind you, pull in where it is safe and let it pass. Do not wave people past – they must decide for themselves.',
  'Slow vehicle with a queue: pull in safely to let traffic pass.',
  undefined,
  { tags: ['courtesy'], scenario: true }),

  at('AT-09', 'e', 'A learner driver stalls at a set of traffic lights in front of you. What should you do?', [
    ['Sound your horn to hurry them', 'This will make them more nervous.'],
    ['Be patient and wait for them to move off', 'Correct.'],
    ['Overtake them immediately', 'Overtaking at a junction is dangerous.'],
    ['Flash your headlights', 'This is unhelpful and may be misread.'],
  ], 1,
  'Learners and new drivers make mistakes. Be patient and give them time.',
  'Be patient with learners and inexperienced drivers.',
  undefined,
  { tags: ['courtesy'] }),

  at('AT-10', 'm', 'A driver pulls out of a side road in front of you, making you brake hard. What should you do?', [
    ['Flash your headlights and sound your horn repeatedly', 'This is aggressive and does not make anything safer.'],
    ['Drive up close behind them to show your anger', 'Tailgating in anger is dangerous.'],
    ['Stay calm and accept that others make mistakes', 'Correct.'],
    ['Overtake and then brake sharply in front of them', 'This is very dangerous and could be an offence.'],
  ], 2,
  'Everyone makes mistakes. Stay calm, do not retaliate, and concentrate on your own driving.',
  'Never react aggressively. Stay calm and keep space.',
  undefined,
  { tags: ['courtesy'], scenario: true }),

  at('AT-11', 'm', 'Under the hierarchy of road users, who has the greatest responsibility to reduce the danger they pose to others?', [
    ['Pedestrians', 'Pedestrians are the most vulnerable, not the most dangerous.'],
    ['Cyclists', 'Cyclists have more responsibility than pedestrians, but less than drivers.'],
    ['Those driving vehicles that can cause the greatest harm', 'Correct. For example, drivers of large vehicles and cars.'],
    ['Everyone has exactly the same responsibility', 'Everyone has some responsibility, but it is greater for those who can do more harm.'],
  ], 2,
  'Rule H1 of the Highway Code: those in charge of vehicles that can cause the greatest harm have the greatest responsibility to take care and reduce danger to others.',
  'Bigger potential harm = bigger responsibility.',
  'As a car driver you should expect, and look out for, pedestrians and cyclists, especially at junctions.',
  { tags: ['hierarchy'], ref: 'Highway Code: Hierarchy of road users (rules H1–H3)' }),

  at('AT-12', 'm', 'You are in slow traffic. One lane is closed ahead and drivers are merging. What is the recommended approach?', [
    ['Merge in turn ("zip merging") when traffic is slow', 'Correct. Use both lanes until the merge point, then take turns.'],
    ['Never let anyone in', 'This causes conflict and delays.'],
    ['Stop in your lane until it is completely empty', 'This causes unnecessary delays.'],
    ['Drive on the hard shoulder to get past', 'This is illegal unless signs direct you to.'],
  ], 0,
  'Where lanes merge and traffic is slow, merging in turn is recommended to keep traffic flowing.',
  'Lane closure in slow traffic: merge in turn.',
  undefined,
  { tags: ['courtesy', 'lanes'] }),

  at('AT-13', 'e', 'You are driving along a road with a bus lane. When can you use it?', [
    ['Any time if you are in a hurry', 'This is illegal.'],
    ['Only outside the operating times shown on the sign', 'Correct. Outside its hours, a bus lane can be used by other traffic.'],
    ['Whenever there are no buses in sight', 'Bus lane rules depend on the times shown, not on whether a bus is visible.'],
    ['When you are overtaking slower cars', 'Bus lanes must not be used for overtaking during operating times.'],
  ], 1,
  'Bus lanes are reserved for the vehicles shown (often buses, cycles and taxis) during the times shown. Outside those times, you may use them. If no times are shown, the lane is in operation 24 hours.',
  'Check the blue bus lane sign for the operating times.',
  undefined,
  { tags: ['lanes'], ref: 'Highway Code: Road users requiring extra care / Lanes' }),

  at('AT-14', 'h', 'You see a vehicle with a flashing green beacon. Who is likely to be driving it?', [
    ['A doctor on an emergency call', 'Correct. Green beacons may be used by doctors on emergency calls.'],
    ['A disabled person', 'Disabled people\'s powered vehicles may use amber beacons.'],
    ['A breakdown recovery driver', 'Recovery vehicles use amber beacons.'],
    ['A police officer in an unmarked car', 'Police use blue lights.'],
  ], 0,
  'Green flashing beacons may be shown by doctors on emergency calls. Give way to them if you can do so safely.',
  'Blue = emergency services. Green = doctor. Amber = slow or special vehicles.',
  undefined,
  { tags: ['emergency-vehicles', 'beacons'] }),
];
