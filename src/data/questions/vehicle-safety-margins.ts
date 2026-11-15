import { maker } from './make';

const sv = maker('safety-vehicle', 'Highway Code: Vehicle condition / Annex 6 – Vehicle maintenance, safety and security');
const sm = maker('safety-margins', 'Highway Code: Driving in adverse weather conditions / Rule 126 (stopping distances)');

export const safetyVehicle = [
  sv('SV-01', 'e', 'What is the legal minimum tread depth for car tyres?', [
    ['1 mm', 'Too low – below the legal limit.'],
    ['1.6 mm', 'Correct.'],
    ['2.5 mm', 'This is not the legal limit for cars, though more tread is safer.'],
    ['4 mm', 'This is about the depth of a new-ish tyre, not the legal minimum.'],
  ], 1,
  'Car tyres must have at least 1.6 mm of tread across the central three-quarters of the tread, around the whole circumference.',
  'Tyre tread: 1.6 mm minimum, central ¾, all the way round.',
  'Many drivers replace tyres at 3 mm because grip in the wet falls quickly below that.',
  { tags: ['tyres'], ruleKey: 'tyre-depth' }),

  sv('SV-02', 'e', 'When should you check your tyre pressures?', [
    ['After a long journey', 'Hot tyres give a false high reading.'],
    ['When the tyres are cold', 'Correct.'],
    ['When the car is fully loaded and has been driven', 'Check cold. Adjust for load using the handbook.'],
    ['Only at your MOT', 'Check them regularly – at least weekly or before long journeys.'],
  ], 1,
  'Tyre pressures should be checked when tyres are cold, because warm tyres give a higher reading.',
  'Check tyre pressures cold, regularly, and before long journeys.',
  undefined,
  { tags: ['tyres'] }),

  sv('SV-03', 'm', 'What is the main benefit of an anti-lock braking system (ABS)?', [
    ['It always makes your stopping distance shorter', 'ABS does not always shorten stopping distance – on loose surfaces it can be longer.'],
    ['It lets you keep steering control while braking hard', 'Correct. ABS stops the wheels locking, so you can still steer.'],
    ['It means you can drive closer to the vehicle in front', 'ABS does not change the need for a safe gap.'],
    ['It stops the car skidding on all surfaces', 'ABS cannot overcome the laws of physics on ice or gravel.'],
  ], 1,
  'ABS prevents the wheels from locking under heavy braking, so you can continue to steer. It does not replace safe speed and gaps.',
  'ABS = you can still steer while braking hard. Not a licence to drive closer.',
  undefined,
  { tags: ['brakes', 'abs'] }),

  sv('SV-04', 'e', 'What does a catalytic converter do?', [
    ['Reduces harmful exhaust emissions', 'Correct.'],
    ['Reduces fuel consumption', 'This is not its purpose.'],
    ['Makes the engine quieter', 'That is the silencer.'],
    ['Improves engine power', 'It does not improve power.'],
  ], 0,
  'A catalytic converter reduces the toxic and polluting gases in exhaust fumes.',
  'Catalytic converter = cleaner exhaust gases.',
  undefined,
  { tags: ['environment'] }),

  sv('SV-05', 'm', 'How should a head restraint be adjusted?', [
    ['So that the rigid part is at least as high as your eyes or the top of your ears, and close to your head', 'Correct.'],
    ['As low as possible so it does not block your view', 'A low head restraint can make neck injuries worse.'],
    ['So that it touches your shoulders', 'Too low to protect your neck.'],
    ['Removed completely for comfort', 'It is an important safety feature.'],
  ], 0,
  'A correctly adjusted head restraint reduces the risk of neck injury (whiplash) in a rear-end collision.',
  'Head restraint: top at eye/top-of-ear level, close to your head.',
  undefined,
  { tags: ['seat-safety'] }),

  sv('SV-06', 'm', 'Your steering feels unusually heavy. What is the most likely cause?', [
    ['Under-inflated tyres', 'Correct. Low tyre pressure makes steering heavy.'],
    ['Over-inflated tyres', 'Over-inflation tends to make steering feel lighter.'],
    ['Worn brake pads', 'This affects braking, not steering weight.'],
    ['Too much engine oil', 'This does not affect steering.'],
  ], 0,
  'Low tyre pressure increases the contact with the road and makes steering feel heavy. It also affects braking and increases wear.',
  'Heavy steering? Check tyre pressures first.',
  undefined,
  { tags: ['tyres', 'faults'] }),

  sv('SV-07', 'm', 'Your car pulls to one side when you brake. What should you do?', [
    ['Have the brakes checked as soon as possible', 'Correct. This suggests a brake fault.'],
    ['Pump the brake pedal when braking', 'This does not fix the fault.'],
    ['Change to a lower gear and use the handbrake', 'This is not a safe or proper fix.'],
    ['Ignore it – it is normal for older cars', 'This is a dangerous fault.'],
  ], 0,
  'A car that pulls to one side when braking usually has a brake fault (or uneven tyres). Get it checked as soon as possible.',
  'Pulling when braking = brake fault. Get it checked.',
  undefined,
  { tags: ['brakes', 'faults'] }),

  sv('SV-08', 'e', 'Where must you never fit a rear-facing baby seat?', [
    ['In a rear seat', 'Rear seats are fine.'],
    ['In a front seat protected by an active frontal airbag', 'Correct. The airbag could seriously injure or kill the baby.'],
    ['In a car with rear airbags', 'Side or rear airbags are not the specific danger here.'],
    ['In a car with ISOFIX points', 'ISOFIX is a safe fitting system.'],
  ], 1,
  'Never use a rear-facing baby seat in a seat protected by an active frontal airbag. The airbag inflates with great force.',
  'Rear-facing baby seat + active front airbag = never.',
  undefined,
  { tags: ['children', 'seat-safety'] }),

  sv('SV-09', 'e', 'Who is legally responsible for making sure a child under 14 wears a seat belt or uses a child restraint?', [
    ['The child', 'Children are not legally responsible.'],
    ['The child\'s parent, even if they are not in the car', 'The driver is legally responsible.'],
    ['The driver', 'Correct.'],
    ['The front-seat passenger', 'The driver is responsible.'],
  ], 2,
  'The driver is legally responsible for making sure children under 14 use a seat belt or the correct child restraint.',
  'Under 14: the driver is responsible.',
  undefined,
  { tags: ['children', 'seat-safety'] }),

  sv('SV-10', 'm', 'Why should you not remove the radiator cap when the engine is hot?', [
    ['The coolant is under pressure and can scald you', 'Correct.'],
    ['The engine will stop working', 'This is not the reason.'],
    ['The coolant will freeze', 'Hot coolant does not freeze.'],
    ['It will damage the battery', 'This is not related.'],
  ], 0,
  'Hot coolant is under pressure. Opening the cap can spray boiling liquid. Check coolant when the engine is cold.',
  'Check coolant when cold.',
  undefined,
  { tags: ['maintenance'] }),

  sv('SV-11', 'e', 'How can you reduce the chance of your car being broken into?', [
    ['Leave valuables under a coat on the back seat', 'Thieves will still see something worth checking.'],
    ['Lock it, take the keys and leave nothing valuable on view', 'Correct.'],
    ['Park in a dark, quiet place', 'Well-lit, busy places are safer.'],
    ['Leave a window slightly open for air', 'This makes a break-in easier.'],
  ], 1,
  'Always lock your car, take the keys, and remove or hide valuables. Park in well-lit areas where possible.',
  'Lock it, pocket the keys, hide valuables.',
  undefined,
  { tags: ['security'] }),

  sv('SV-12', 'm', 'What causes "brake fade"?', [
    ['The brakes overheating from continuous use, for example on a long downhill', 'Correct.'],
    ['Water in the brake fluid reservoir', 'This is not the usual cause of fade.'],
    ['Using the handbrake too often', 'This does not cause fade.'],
    ['Driving too slowly', 'Speed itself is not the cause.'],
  ], 0,
  'Brakes lose effectiveness when they overheat. On long downhill stretches use a lower gear so the engine helps slow you.',
  'Long downhill: lower gear, less brake use.',
  undefined,
  { tags: ['brakes'] }),

  sv('SV-13', 'm', 'What is the "Dutch Reach" technique recommended by the Highway Code?', [
    ['Opening your door with the hand on the opposite side to the door', 'Correct. It makes you turn and look behind for cyclists and others.'],
    ['Reaching for the handbrake with your left hand', 'This is not the Dutch Reach.'],
    ['Leaning across the passenger to check the left mirror', 'This is not the Dutch Reach.'],
    ['Opening the boot from inside the car', 'This is not the Dutch Reach.'],
  ], 0,
  'Opening a car door with the hand on the opposite side (for a driver: the left hand) makes you turn your body and look over your shoulder, so you are less likely to hit a passing cyclist or pedestrian.',
  'Open doors with the far hand and look behind first.',
  'Parked on a busy street with a cycle lane: reach across with your left hand and look before opening.',
  { tags: ['cyclists', 'parking'], ref: 'Highway Code: Rule 239 (Waiting and parking)' }),

  sv('SV-14', 'e', 'Which of these will help to reduce fuel consumption?', [
    ['Removing the roof rack when it is not in use', 'Correct. A roof rack increases wind resistance.'],
    ['Driving with under-inflated tyres', 'This increases fuel use.'],
    ['Accelerating harshly', 'This wastes fuel.'],
    ['Leaving the engine running when stopped for long periods', 'This wastes fuel and pollutes.'],
  ], 0,
  'Eco-driving: remove roof racks and boxes when not needed, keep tyres correctly inflated, plan ahead and accelerate and brake smoothly.',
  'Smooth driving + correct tyre pressure + no unnecessary roof rack = lower fuel use.',
  undefined,
  { tags: ['environment'] }),

  sv('SV-15', 'h', 'You notice excessive or uneven wear on one of your tyres. Which of these could cause it?', [
    ['A fault in the suspension', 'Correct. Suspension, steering or wheel-alignment faults can cause uneven wear.'],
    ['A fault in the gearbox', 'Gearbox faults do not usually cause uneven tyre wear.'],
    ['A fault in the exhaust system', 'This does not affect tyre wear.'],
    ['A fault in the engine cooling system', 'This does not affect tyre wear.'],
  ], 0,
  'Uneven tyre wear is often caused by faults in the suspension, braking system or wheel alignment.',
  'Uneven tyre wear → check suspension, brakes and alignment.',
  undefined,
  { tags: ['tyres', 'faults'] }),

  sv('SV-16', 'm', 'Before a journey in frosty weather, what must you do?', [
    ['Clear just a small area of the windscreen to look through', 'You must be able to see clearly through all windows.'],
    ['Clear all windows, mirrors and lights of ice and condensation', 'Correct.'],
    ['Pour boiling water on the windscreen', 'This can crack the glass.'],
    ['Drive with the window down until it clears', 'You must be able to see properly before you set off.'],
  ], 1,
  'Before driving you must be able to see clearly. Clear all windows, mirrors and lights; remove snow from the roof too, because it can fall onto the windscreen.',
  'Clear ALL glass, mirrors and lights before setting off.',
  undefined,
  { tags: ['winter', 'visibility'] }),
];

export const safetyMargins = [
  sm('SM-01', 'e', 'In good, dry conditions, what is the minimum time gap you should leave behind the vehicle in front?', [
    ['One second', 'Too short to react and stop safely.'],
    ['Two seconds', 'Correct.'],
    ['Four seconds', 'This is the gap for wet roads.'],
    ['Ten seconds', 'More than needed in dry conditions (although never wrong to leave more).'],
  ], 1,
  'Leave at least a two-second gap on fast roads in good conditions. Say "Only a fool breaks the two-second rule" as the vehicle ahead passes a fixed point.',
  'Dry: 2 seconds. Wet: at least 4 seconds.',
  undefined,
  { tags: ['following-distance'], ruleKey: 'gap-dry' }),

  sm('SM-02', 'e', 'On a wet road, what time gap should you leave behind the vehicle in front?', [
    ['At least two seconds', 'This is for dry roads.'],
    ['At least three seconds', 'Not enough – the gap should be doubled.'],
    ['At least four seconds', 'Correct. Double the two-second gap.'],
    ['At least one second', 'Far too short.'],
  ], 2,
  'In wet conditions, stopping distances are at least double, so leave at least a four-second gap.',
  'Wet = double the gap = 4 seconds.',
  undefined,
  { tags: ['following-distance', 'weather'], ruleKey: 'gap-wet' }),

  sm('SM-03', 'm', 'How much longer can braking distances be on icy roads?', [
    ['Up to twice as long', 'This is for wet roads.'],
    ['Up to five times as long', 'Ice is worse than this.'],
    ['Up to ten times as long', 'Correct.'],
    ['About the same as on a dry road', 'Ice greatly reduces grip.'],
  ], 2,
  'On icy roads braking distances can be up to ten times greater than on dry roads.',
  'Wet ×2. Ice up to ×10.',
  undefined,
  { tags: ['weather', 'stopping-distance'], ruleKey: 'ice-braking' }),

  sm('SM-04', 'e', 'When should you use your front or rear fog lights?', [
    ['Whenever it is raining', 'Rain alone does not justify fog lights.'],
    ['When visibility is seriously reduced, generally less than 100 metres', 'Correct.'],
    ['At night on unlit roads', 'Use headlights, not fog lights, for normal night driving.'],
    ['Whenever you drive on a motorway', 'Fog lights dazzle and hide brake lights when not needed.'],
  ], 1,
  'Use fog lights only when visibility is seriously reduced – generally when you cannot see for more than 100 metres. Switch them off when visibility improves.',
  'Fog lights: visibility under 100 m. Off again when it clears.',
  undefined,
  { tags: ['lights', 'weather'] }),

  sm('SM-05', 'm', 'How can you avoid wheelspin when driving in snow?', [
    ['Use the highest gear possible', 'Correct. Gentle power in a higher gear helps the tyres grip.'],
    ['Use the lowest gear possible', 'Low gears deliver more turning force and cause wheelspin.'],
    ['Accelerate firmly', 'Harsh acceleration causes wheelspin.'],
    ['Brake harshly then accelerate', 'Harsh inputs cause skids.'],
  ], 0,
  'In snow and ice, use gentle acceleration and the highest gear possible. Move off in second gear if your handbook allows.',
  'Snow: gentle and smooth, highest suitable gear.',
  undefined,
  { tags: ['weather', 'winter'] }),

  sm('SM-06', 'm', 'You are driving in heavy rain and your steering suddenly feels very light. What should you do?', [
    ['Brake firmly to slow down', 'Braking hard while aquaplaning can cause a skid.'],
    ['Steer sharply to find grip', 'Sharp steering can make you lose control.'],
    ['Ease off the accelerator and slow down gradually', 'Correct. You are probably aquaplaning.'],
    ['Accelerate through the water', 'This will make aquaplaning worse.'],
  ], 2,
  'Light steering in heavy rain means your tyres may have lost contact with the road (aquaplaning). Ease off the accelerator and slow down gradually; do not brake or steer harshly.',
  'Aquaplaning: ease off gently. No harsh brake or steer.',
  undefined,
  { tags: ['weather', 'skids'], scenario: true }),

  sm('SM-07', 'm', 'Your car has ABS. On a loose road surface such as gravel, what will your stopping distance be like?', [
    ['It may be longer', 'Correct. ABS can extend stopping distance on loose or slippery surfaces.'],
    ['It will always be shorter', 'This is a common misunderstanding.'],
    ['It will be exactly the same as on dry tarmac', 'Loose surfaces reduce grip.'],
    ['ABS makes stopping distance irrelevant', 'ABS is no substitute for a safe speed.'],
  ], 0,
  'ABS helps you steer while braking but does not guarantee a shorter stop. On loose surfaces stopping distance can be longer.',
  'ABS does not shorten stopping distance on loose surfaces.',
  undefined,
  { tags: ['abs', 'brakes'] }),

  sm('SM-08', 'e', 'On a windy day, which of these road users is most likely to be blown off course?', [
    ['A large saloon car', 'Cars are affected, but much less.'],
    ['A cyclist', 'Correct. Cyclists, motorcyclists, high-sided vehicles and caravans are most affected.'],
    ['A heavy tractor', 'Very heavy vehicles are less affected.'],
    ['A bus with no passengers on a sheltered road', 'Sheltered roads reduce wind effects.'],
  ], 1,
  'Strong winds affect cyclists, motorcyclists, high-sided vehicles and vehicles towing caravans most. Give them extra room.',
  'Windy: extra room for cyclists, motorcyclists and high-sided vehicles.',
  'Passing a gap between buildings or a bridge, a cyclist can be pushed sideways by a gust.',
  { tags: ['weather', 'cyclists'] }),

  sm('SM-09', 'h', 'The rear of your car skids to the right. What should you do?', [
    ['Steer to the left', 'Steering against the skid can make it worse.'],
    ['Steer to the right', 'Correct. Steer into the skid, carefully, to regain control.'],
    ['Brake firmly', 'Harsh braking makes a skid worse.'],
    ['Accelerate hard', 'Harsh acceleration makes a skid worse.'],
  ], 1,
  'If the rear of the car skids to the right, steer carefully to the right to bring the car back into line. Avoid harsh braking or acceleration.',
  'Rear skids right → steer right (into the skid). Gentle inputs.',
  undefined,
  { tags: ['skids'] }),

  sm('SM-10', 'm', 'Driving on a dark winter road, you notice your tyres are making hardly any noise. What does this suggest?', [
    ['The road may be icy', 'Correct. Tyres often go quiet on ice.'],
    ['The tyres need more air', 'Tyre noise does not usually tell you this.'],
    ['The road surface is newly resurfaced', 'Possible, but in cold weather ice is the key danger.'],
    ['Your car\'s suspension is faulty', 'This is not what quiet tyres usually mean.'],
  ], 0,
  'In cold weather, quiet tyres and very light steering can be signs of ice. Slow down gently and avoid harsh braking or steering.',
  'Quiet tyres + light steering in cold weather = possible ice.',
  undefined,
  { tags: ['winter', 'weather'] }),

  sm('SM-11', 'e', 'When must you use dipped headlights during the day?', [
    ['On all roads with street lights', 'This is not the rule.'],
    ['When visibility is seriously reduced', 'Correct.'],
    ['Only on motorways', 'The rule applies on all roads.'],
    ['Only when it is snowing', 'Any condition that seriously reduces visibility applies.'],
  ], 1,
  'You must use headlights when visibility is seriously reduced – generally when you cannot see more than 100 metres.',
  'Poor visibility: dipped headlights so you can see and be seen.',
  undefined,
  { tags: ['lights', 'weather'] }),

  sm('SM-12', 'm', 'Why should you leave extra room when overtaking a motorcyclist on a windy day?', [
    ['The rider may be blown into your path', 'Correct.'],
    ['The rider may stop suddenly', 'This could happen at any time, not specifically in wind.'],
    ['The rider may turn off without warning', 'Not specifically linked to wind.'],
    ['The rider may be travelling faster than normal', 'Wind is the issue, not speed.'],
  ], 0,
  'Crosswinds can blow motorcyclists and cyclists sideways, especially when they come out from shelter.',
  'Wind: extra room when passing two-wheelers.',
  undefined,
  { tags: ['weather', 'motorcyclists'] }),

  sm('SM-13', 'm', 'You are following a lorry on a motorway in heavy rain. Spray makes it hard to see. What should you do?', [
    ['Drop back to increase your distance', 'Correct. This improves your view and stopping distance.'],
    ['Move closer so you are under the spray', 'This makes your view worse and is dangerous.'],
    ['Switch on main beam headlights', 'Main beam will reflect in the spray and can dazzle.'],
    ['Overtake on the left', 'You must not overtake on the left on a motorway except in queues.'],
  ], 0,
  'Large vehicles throw up spray. Drop back to see more and leave at least a four-second gap in the wet.',
  'Spray from lorries: drop back.',
  undefined,
  { tags: ['weather', 'large-vehicles', 'motorway'], scenario: true }),

  sm('SM-14', 'h', 'In which conditions will your overall stopping distance be longest?', [
    ['Dry road, good tyres', 'This gives the shortest stopping distance.'],
    ['Wet road', 'Longer, about double, but not the longest.'],
    ['Icy road', 'Correct. Up to ten times the normal braking distance.'],
    ['Road covered in fallen leaves in summer', 'Leaves are slippery but ice is worse.'],
  ], 2,
  'Ice gives the least grip of all common road conditions. Braking distances can be up to ten times longer.',
  'Ice = longest stopping distances.',
  undefined,
  { tags: ['stopping-distance', 'weather'], ruleKey: 'ice-braking' }),

  sm('SM-15', 'm', 'In fog, what speed should you drive at?', [
    ['A speed that lets you stop within the distance you can see to be clear', 'Correct.'],
    ['The speed limit, as long as you use fog lights', 'Fog lights do not make high speed safe.'],
    ['The same speed as the vehicle in front', 'Following someone else\'s speed may not be safe for you.'],
    ['Very slowly with hazard lights on', 'Hazard lights are not for normal driving in fog.'],
  ], 0,
  'Always be able to stop within the distance you can see to be clear. In fog this may mean driving very slowly.',
  'Drive so you can stop in the distance you can see.',
  undefined,
  { tags: ['weather', 'fog'] }),
];
