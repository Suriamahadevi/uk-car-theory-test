import { maker } from './make';

const ov = maker('other-vehicles', 'Highway Code: Other road users (rules 220–225)');
const vh = maker('vehicle-handling', 'Highway Code: Driving in adverse weather conditions / General rules');

export const otherVehicles = [
  ov('OV-01', 'm', 'A long lorry ahead is signalling left but is moving out to the right. What should you do?', [
    ['Overtake on the left', 'The lorry will cut across the space you are moving into.'],
    ['Stay well back and let it turn', 'Correct. Long vehicles often swing out to make a turn.'],
    ['Sound your horn to warn the driver', 'The driver knows what they are doing.'],
    ['Overtake on the right quickly', 'You do not know what the lorry will do.'],
  ], 1,
  'Long vehicles may need to move out before turning. Stay back and do not try to pass on the inside.',
  'Big vehicle turning = stay back, give it room.',
  undefined,
  { tags: ['large-vehicles', 'junctions'], scenario: true }),

  ov('OV-02', 'e', 'Why should you keep well back when following a large vehicle?', [
    ['To give yourself a better view of the road ahead', 'Correct.'],
    ['To stop it reversing into you', 'This is not the main reason.'],
    ['Because large vehicles always brake suddenly', 'This is not the main reason.'],
    ['To make it easier to overtake on the left', 'You should not overtake on the left.'],
  ], 0,
  'Staying back improves your view ahead and lets the driver see you in their mirrors.',
  'If you cannot see a lorry\'s mirrors, the driver cannot see you.',
  undefined,
  { tags: ['large-vehicles'] }),

  ov('OV-03', 'm', 'You are following a large vehicle approaching a roundabout. Why might it take up two lanes?', [
    ['It needs the extra room to turn safely', 'Correct.'],
    ['The driver is lost', 'Possible, but not the reason.'],
    ['It is about to break down', 'Not the reason.'],
    ['It is allowed to use all lanes at any time', 'Not the reason.'],
  ], 0,
  'Long vehicles need more room to get round roundabouts and junctions. Hold back and give them space.',
  'Long vehicles may straddle lanes. Hang back.',
  undefined,
  { tags: ['large-vehicles', 'roundabouts'] }),

  ov('OV-04', 'm', 'Why must you take extra care near trams?', [
    ['They cannot steer to avoid you', 'Correct.'],
    ['They are always very slow', 'Trams can move quickly and quietly.'],
    ['They make a lot of noise', 'Trams are often quiet.'],
    ['They always stop at traffic lights', 'Trams have their own signals.'],
  ], 0,
  'Trams follow rails and cannot steer around you. They can also be very quiet.',
  'Trams cannot steer – never block their path.',
  undefined,
  { tags: ['trams'] }),

  ov('OV-05', 'e', 'In a built-up area, a bus is signalling to pull out from a bus stop. What should you do?', [
    ['Speed up to get past it', 'This could be dangerous.'],
    ['Give way to it if it is safe to do so', 'Correct.'],
    ['Flash your headlights to tell it to wait', 'Not appropriate.'],
    ['Sound your horn', 'Not appropriate.'],
  ], 1,
  'The Highway Code asks you to give way to buses signalling to pull out from stops, if it is safe to do so.',
  'Give way to buses pulling out, when safe.',
  undefined,
  { tags: ['buses', 'courtesy'] }),

  ov('OV-06', 'm', 'You see a vehicle with a flashing amber beacon on a dual carriageway. What does it probably mean?', [
    ['It is a slow-moving vehicle', 'Correct.'],
    ['It is a police car', 'Police use blue lights.'],
    ['It is a doctor on call', 'Doctors may use green beacons.'],
    ['It is an ambulance', 'Ambulances use blue lights.'],
  ], 0,
  'Flashing amber beacons warn of slow-moving vehicles, such as gritters, recovery vehicles or powered mobility vehicles on dual carriageways.',
  'Amber beacon = slow vehicle.',
  undefined,
  { tags: ['beacons'] }),

  ov('OV-07', 'm', 'Why should you not overtake a snowplough or gritter?', [
    ['It may throw out snow or grit, and the road ahead may be uncleared', 'Correct.'],
    ['It is illegal to overtake any council vehicle', 'This is not true.'],
    ['It will speed up when you try', 'This is not the reason.'],
    ['It always travels at the speed limit', 'It travels slowly.'],
  ], 0,
  'Snowploughs throw snow out on either side, and the road ahead of the plough is likely to be in worse condition.',
  'Do not overtake snowploughs.',
  undefined,
  { tags: ['winter'] }),

  ov('OV-08', 'm', 'You are in slow traffic. Why should you check carefully for motorcyclists before changing lanes?', [
    ['They may be filtering between the lanes', 'Correct.'],
    ['They always use the hard shoulder', 'They must not, except in an emergency.'],
    ['They are not allowed to change lanes', 'Not true.'],
    ['They must stay in the left lane', 'Not true.'],
  ], 0,
  'Motorcyclists may filter through slow or stationary traffic. Check mirrors and blind spots before changing lanes or opening doors.',
  'Queues: watch for filtering motorcycles.',
  undefined,
  { tags: ['motorcyclists', 'lanes'] }),

  ov('OV-09', 'e', 'Which vehicles are most affected by strong crosswinds?', [
    ['High-sided vehicles', 'Correct.'],
    ['Low sports cars', 'Less affected.'],
    ['Heavy tractors', 'Less affected.'],
    ['Saloon cars', 'Less affected.'],
  ], 0,
  'High-sided vehicles such as lorries and vans, and vehicles towing caravans, are most affected by crosswinds.',
  'Wind affects high-sided vehicles most.',
  undefined,
  { tags: ['weather', 'large-vehicles'] }),

  ov('OV-10', 'm', 'You are about to overtake a lorry. What should you do first?', [
    ['Move close behind it so you can pull out quickly', 'Too close – you cannot see ahead.'],
    ['Keep well back to get a better view of the road ahead', 'Correct.'],
    ['Flash your headlights to tell the driver', 'Not needed.'],
    ['Overtake on the left', 'Not allowed except in specific situations.'],
  ], 1,
  'Hang back so you can see the road ahead before deciding whether it is safe to overtake. Long vehicles take longer to pass.',
  'Overtaking a lorry: stay back, check view, allow extra time.',
  undefined,
  { tags: ['overtaking', 'large-vehicles'] }),

  ov('OV-11', 'h', 'A tractor ahead is driving slowly on a narrow country road. What should you do?', [
    ['Overtake on the next bend', 'Never overtake on a bend.'],
    ['Be patient and only overtake where you can see the road is clear well ahead', 'Correct.'],
    ['Sound your horn to make it pull over', 'Not appropriate.'],
    ['Drive close behind so it speeds up', 'This is intimidating and dangerous.'],
  ], 1,
  'Agricultural vehicles are slow and wide. Wait for a safe, straight stretch with a clear view.',
  'Slow vehicle ahead = patience.',
  undefined,
  { tags: ['rural', 'overtaking'], scenario: true }),

  ov('OV-12', 'm', 'Why may a motorcyclist look over their right shoulder just before turning right?', [
    ['To check for traffic in their blind spot', 'Correct. This is their "lifesaver" check.'],
    ['To signal to you to overtake', 'This is not a signal.'],
    ['Because their mirrors are broken', 'It is a normal safety check.'],
    ['To check their passenger', 'Not the reason.'],
  ], 0,
  'A rider looking over their shoulder is likely to be about to turn or change lane. Expect them to move.',
  'Motorcyclist looking back = about to move.',
  undefined,
  { tags: ['motorcyclists'] }),
];

export const vehicleHandling = [
  vh('VH-01', 'e', 'You are driving down a long, steep hill. What should you do?', [
    ['Select a lower gear to help control your speed', 'Correct. Engine braking helps.'],
    ['Select neutral to save fuel', 'Coasting reduces control.'],
    ['Hold the clutch down', 'This is coasting.'],
    ['Use the brakes continuously', 'This can cause brake fade.'],
  ], 0,
  'A lower gear lets the engine help control your speed, so you do not overheat the brakes.',
  'Downhill = lower gear.',
  undefined,
  { tags: ['hills', 'gears'] }),

  vh('VH-02', 'm', 'Why is coasting (driving in neutral or with the clutch down) dangerous?', [
    ['It reduces your control of the car', 'Correct.'],
    ['It damages the gearbox immediately', 'The main danger is reduced control.'],
    ['It uses more fuel', 'Not the main danger.'],
    ['It makes the engine overheat', 'Not the main danger.'],
  ], 0,
  'Coasting removes engine braking, makes it harder to steer and to select the right gear when needed, and increases speed downhill.',
  'Do not coast.',
  undefined,
  { tags: ['gears'] }),

  vh('VH-03', 'e', 'You have just driven through a ford. What should you do next?', [
    ['Test your brakes', 'Correct. Wet brakes may not work well.'],
    ['Check your tyre pressures', 'Not the immediate priority.'],
    ['Switch on your hazard lights', 'Not needed.'],
    ['Drive fast to dry the car', 'Not safe.'],
  ], 0,
  'Water can make brakes less effective. Test them gently as soon as it is safe.',
  'After water: test your brakes.',
  undefined,
  { tags: ['brakes', 'water'] }),

  vh('VH-04', 'e', 'You are driving at night on an unlit road with main beam on. An oncoming vehicle approaches. What should you do?', [
    ['Keep main beam on', 'This will dazzle the other driver.'],
    ['Dip your headlights', 'Correct.'],
    ['Switch off your lights', 'Dangerous and illegal.'],
    ['Flash your headlights', 'Not appropriate.'],
  ], 1,
  'Dip your headlights so you do not dazzle oncoming drivers or those in front of you.',
  'Dip to avoid dazzling others.',
  undefined,
  { tags: ['lights', 'night'] }),

  vh('VH-05', 'm', 'You are driving on a road with traffic-calming humps. What should you do?', [
    ['Slow down to a suitable speed', 'Correct.'],
    ['Accelerate between humps', 'This defeats the purpose and is dangerous.'],
    ['Drive in the middle of the road to avoid them', 'Not safe.'],
    ['Keep to the speed limit and ignore them', 'Humps mean you should drive slower.'],
  ], 0,
  'Traffic-calming measures are there to slow traffic, often near schools or homes. Keep your speed down throughout.',
  'Traffic calming = slow down and stay slow.',
  undefined,
  { tags: ['speed'] }),

  vh('VH-06', 'm', 'In very hot weather, how might the road surface affect your driving?', [
    ['The surface may soften, affecting grip, steering and braking', 'Correct.'],
    ['The road will always be safer', 'Not true.'],
    ['Your stopping distance will be shorter', 'Not true.'],
    ['It makes no difference', 'It can make a difference.'],
  ], 0,
  'Hot weather can soften tar, reducing grip. After a dry spell, the first rain can make roads especially slippery.',
  'Hot weather and first rain: watch your grip.',
  undefined,
  { tags: ['weather'] }),

  vh('VH-07', 'e', 'You are driving on a road with loose chippings. What should you do?', [
    ['Slow down', 'Correct. Chippings reduce grip and can be thrown up.'],
    ['Speed up to get through quickly', 'This is dangerous.'],
    ['Brake hard', 'This can cause a skid.'],
    ['Drive close to the vehicle in front', 'Chippings can be thrown up.'],
  ], 0,
  'Loose chippings reduce grip and can be thrown up by other vehicles, damaging windscreens.',
  'Loose chippings: slow down, keep back.',
  undefined,
  { tags: ['road-surface'] }),

  vh('VH-08', 'm', 'You park facing downhill on a road with a kerb. What should you do?', [
    ['Turn your steering wheel towards the kerb and apply the parking brake', 'Correct.'],
    ['Turn your steering wheel away from the kerb', 'This is for parking uphill.'],
    ['Leave the car in neutral', 'Select a gear as well.'],
    ['Leave the engine running', 'Never do this when parking.'],
  ], 0,
  'When parking downhill, turn the wheels towards the kerb, apply the parking brake firmly and select reverse gear (in a manual car).',
  'Downhill parking: wheels to kerb, parking brake, reverse gear.',
  undefined,
  { tags: ['parking', 'hills'], ref: 'Highway Code: Rule 252' }),

  vh('VH-09', 'm', 'Your car has ABS. You need to stop in an emergency. What should you do?', [
    ['Brake firmly and keep pressure on the pedal', 'Correct.'],
    ['Pump the brake pedal on and off', 'ABS already does this for you.'],
    ['Brake gently, then use the handbrake', 'Too slow in an emergency.'],
    ['Steer sharply and not brake', 'You need to brake.'],
  ], 0,
  'With ABS, press the brake pedal firmly and keep it pressed. You may feel the pedal vibrate – this is normal.',
  'ABS emergency stop: press firmly and hold.',
  undefined,
  { tags: ['brakes', 'abs'] }),

  vh('VH-10', 'm', 'Where should you do most of your braking for a sharp bend?', [
    ['Before you reach the bend, while travelling in a straight line', 'Correct.'],
    ['In the middle of the bend', 'Braking on a bend can cause a skid.'],
    ['After the bend', 'Too late.'],
    ['Only when you see something in the bend', 'Plan ahead.'],
  ], 0,
  'Brake before the bend while travelling straight. Braking while steering can unsettle the car.',
  'Slow in, smooth out.',
  undefined,
  { tags: ['bends'] }),

  vh('VH-11', 'e', 'When driving in snow, how should you brake?', [
    ['Gently and early', 'Correct.'],
    ['Firmly and late', 'This causes skids.'],
    ['Only with the handbrake', 'Not safe.'],
    ['By switching off the engine', 'Never do this.'],
  ], 0,
  'Brake gently and early in snow and ice, and keep your speed down so you rarely need to brake.',
  'Snow: gentle, early, smooth.',
  undefined,
  { tags: ['winter'] }),

  vh('VH-12', 'h', 'You are driving in fog. The fog clears. What should you do with your fog lights?', [
    ['Switch them off', 'Correct. They can dazzle others and hide brake lights.'],
    ['Leave them on in case the fog returns', 'This dazzles other drivers.'],
    ['Switch the front ones off but keep rear ones on', 'Rear fogs also dazzle and hide brake lights.'],
    ['Leave them on until you park', 'Not correct.'],
  ], 0,
  'You must not use fog lights when visibility is not seriously reduced. Switch them off when the fog clears.',
  'Fog clears → fog lights off.',
  undefined,
  { tags: ['lights', 'fog'] }),
];
