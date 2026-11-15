import { maker } from './make';

const sg = maker('signs', 'Highway Code: Traffic signs, Road markings, Signals / Know Your Traffic Signs (GOV.UK)');
const dc = maker('documents', 'Highway Code: Annex 3 (Motor vehicle documentation and learner driver requirements) / GOV.UK');
const inc = maker('incidents', 'Highway Code: Breakdowns and incidents (rules 274–287) / Annex 7 (First aid on the road)');
const lo = maker('loading', 'Highway Code: Rule 98 (Vehicle towing and loading) / GOV.UK towing guidance');

export const signs = [
  sg('SG-01', 'e', 'What do triangular, circular and rectangular signs generally mean?', [
    ['Triangles warn, circles give orders, rectangles inform', 'Correct.'],
    ['Triangles give orders, circles warn, rectangles inform', 'The other way round.'],
    ['Triangles inform, circles warn, rectangles give orders', 'Not correct.'],
    ['All shapes mean the same thing', 'Shape tells you the type of sign.'],
  ], 0,
  'Signs giving orders are mostly circular; warning signs are mostly triangular; information signs are rectangular.',
  'Circles command, triangles warn, rectangles inform.',
  undefined,
  { tags: ['sign-shapes'] }),

  sg('SG-02', 'm', 'What colour are direction signs on motorways?', [
    ['Blue', 'Correct.'],
    ['Green', 'Green is for primary routes.'],
    ['White', 'White is for local and non-primary routes.'],
    ['Brown', 'Brown is for tourist destinations.'],
  ], 0,
  'Motorway signs are blue, primary route signs are green, other routes are white, and tourist signs are brown.',
  'Blue motorway, Green primary, White local, Brown tourist.',
  undefined,
  { tags: ['sign-colours'] }),

  sg('SG-03', 'e', 'What comes after a red traffic light on its own?', [
    ['Red and amber together', 'Correct.'],
    ['Green', 'Red and amber come first.'],
    ['Amber only', 'Amber alone comes before red.'],
    ['Flashing amber', 'Only at pelican crossings.'],
  ], 0,
  'The UK sequence is: Red → Red and Amber → Green → Amber → Red. Red and amber means stop – do not go until green.',
  'Red, Red+Amber, Green, Amber, Red.',
  undefined,
  { tags: ['traffic-lights'], ruleKey: 'light-sequence' }),

  sg('SG-04', 'm', 'What does an amber traffic light on its own mean?', [
    ['Stop, unless you have crossed the stop line or are so close that pulling up might cause a crash', 'Correct.'],
    ['Go if you can make it through', 'Amber means stop.'],
    ['Prepare to move off', 'That is red and amber.'],
    ['Go, but give way to pedestrians', 'Not correct.'],
  ], 0,
  'Amber alone means stop at the stop line. You may go on only if you have already crossed the line or are so close that stopping could cause a collision.',
  'Amber means STOP (unless too close to stop safely).',
  undefined,
  { tags: ['traffic-lights'] }),

  sg('SG-05', 'm', 'There are double white lines along the centre of the road. The line nearest you is broken. What may you do?', [
    ['Cross the lines to overtake if it is safe and you can complete the move before reaching a solid line on your side', 'Correct.'],
    ['Never cross the lines', 'You may cross a broken line if safe.'],
    ['Park on the lines', 'Not allowed.'],
    ['Cross the lines only at night', 'Not correct.'],
  ], 0,
  'When the line nearest you is broken, you may cross it to overtake if it is safe, provided you can complete the manoeuvre before reaching a solid white line on your side.',
  'Broken line on your side = may cross when safe.',
  undefined,
  { tags: ['markings'] }),

  sg('SG-06', 'm', 'What do long white lines with short gaps along the centre of the road mean?', [
    ['A hazard warning line – there is a hazard ahead', 'Correct.'],
    ['A normal lane divider', 'Lane lines have longer gaps.'],
    ['You must not cross', 'Broken lines may be crossed with care.'],
    ['A cycle lane', 'Not correct.'],
  ], 0,
  'Hazard warning lines have long lines and short gaps. Do not cross them unless you can see the road is clear well ahead.',
  'Longer lines, shorter gaps = hazard warning.',
  undefined,
  { tags: ['markings'] }),

  sg('SG-07', 'e', 'What do double yellow lines along the edge of the road mean?', [
    ['No waiting at any time', 'Correct (loading may be allowed – check signs).'],
    ['No waiting during the times shown', 'That is single yellow.'],
    ['No stopping at any time', 'Double red lines mean no stopping.'],
    ['Parking allowed after 6 pm', 'Not correct.'],
  ], 0,
  'Double yellow lines mean no waiting at any time. Single yellow means no waiting during the times shown on nearby plates.',
  'Double yellow = no waiting any time. Single yellow = check the times.',
  undefined,
  { tags: ['markings', 'parking'] }),

  sg('SG-08', 'm', 'Diagonal white stripes (hatching) are bordered by a solid white line. What does this mean?', [
    ['You must not enter the area except in an emergency', 'Correct.'],
    ['You may drive on it to overtake', 'Not with a solid border.'],
    ['It is a parking area', 'Not correct.'],
    ['It is reserved for buses', 'Not correct.'],
  ], 0,
  'Hatched areas separate traffic. With a solid border you must not enter except in an emergency. With a broken border, do not enter unless it is necessary and you can see it is safe.',
  'Solid-bordered hatching: keep out.',
  undefined,
  { tags: ['markings'] }),

  sg('SG-09', 'e', 'A driver ahead holds their right arm straight out of the window. What do they mean?', [
    ['They intend to turn right', 'Correct.'],
    ['They intend to turn left', 'A left turn is shown by a circular motion of the right arm (or left arm out).'],
    ['They want you to overtake', 'Not a recognised signal.'],
    ['They are slowing down', 'Slowing is shown by moving the arm up and down.'],
  ], 0,
  'Arm signals: right arm straight out – turning right; right arm moving up and down – slowing down or stopping; right arm rotating anticlockwise – turning left.',
  'Arm straight out right = right turn.',
  undefined,
  { tags: ['arm-signals'] }),

  sg('SG-10', 'm', 'Flashing red lights at a level crossing, fire station or swing bridge mean what?', [
    ['You must stop', 'Correct.'],
    ['Slow down and proceed with care', 'You must stop.'],
    ['Go if the road is clear', 'You must stop.'],
    ['Give way to traffic on the right', 'Not correct.'],
  ], 0,
  'Alternately flashing red lights mean you MUST stop. At a level crossing, continue to wait if a train passes and the lights keep flashing – another train may be coming.',
  'Flashing red = STOP.',
  undefined,
  { tags: ['level-crossings', 'signals'] }),

  sg('SG-11', 'e', 'What does a green traffic light mean?', [
    ['You may go on if the way is clear', 'Correct.'],
    ['You must go immediately', 'Only go if it is safe.'],
    ['You have priority over everyone', 'Pedestrians crossing still have priority.'],
    ['Speed up to clear the junction', 'Not correct.'],
  ], 0,
  'Green means you may go on if the way is clear. Take care if turning, and give way to pedestrians who are crossing.',
  'Green = go only if clear.',
  undefined,
  { tags: ['traffic-lights'] }),

  sg('SG-12', 'm', 'What are the white zig-zag lines on the approach to a zebra crossing for?', [
    ['To show you must not park or overtake there', 'Correct.'],
    ['To mark a bus stop', 'Not correct.'],
    ['To mark a cycle lane', 'Not correct.'],
    ['To show the road is slippery', 'Not correct.'],
  ], 0,
  'White zig-zags mark the area around a pedestrian crossing where parking and overtaking are not allowed.',
  'White zig-zags = crossing area.',
  undefined,
  { tags: ['crossings', 'markings'] }),
];

export const documents = [
  dc('DC-01', 'e', 'When does a car first need an MOT test in Great Britain?', [
    ['When it is one year old', 'Not correct.'],
    ['When it is three years old', 'Correct.'],
    ['When it is five years old', 'Not correct.'],
    ['Only when it changes owner', 'Not correct.'],
  ], 1,
  'Most cars need their first MOT by the third anniversary of registration, then every year.',
  'MOT: first at 3 years (GB), then yearly.',
  undefined,
  { tags: ['mot'], ruleKey: 'mot-age' }),

  dc('DC-02', 'e', 'What is the minimum insurance cover you must have to drive on public roads?', [
    ['Third party', 'Correct.'],
    ['Third party, fire and theft', 'More than the minimum.'],
    ['Fully comprehensive', 'More than the minimum.'],
    ['Personal injury cover', 'Not the legal minimum.'],
  ], 0,
  'The legal minimum is third-party insurance, which covers injury and damage to others.',
  'Minimum = third party.',
  undefined,
  { tags: ['insurance'] }),

  dc('DC-03', 'm', 'What does the vehicle registration certificate (V5C) show?', [
    ['The registered keeper of the vehicle', 'Correct.'],
    ['That the car has passed its MOT', 'That is the MOT certificate.'],
    ['That the car is insured', 'That is the insurance certificate.'],
    ['The car\'s service history', 'Not correct.'],
  ], 0,
  'The V5C (log book) shows the registered keeper. Tell DVLA if you sell the car, change your address or change the vehicle.',
  'V5C = registered keeper (not necessarily the legal owner).',
  undefined,
  { tags: ['v5c'] }),

  dc('DC-04', 'm', 'A newly qualified driver gets 6 or more penalty points within two years of passing their test. What happens?', [
    ['Their licence is revoked and they must re-apply as a learner and pass again', 'Correct.'],
    ['They pay a fine only', 'Not correct.'],
    ['They must take Pass Plus', 'Not correct.'],
    ['Nothing, unless they reach 12 points', '12 points applies to experienced drivers.'],
  ], 0,
  'Under the New Drivers Act, 6 or more points within two years of passing means your licence is revoked. You must re-apply for a provisional licence and pass both theory and practical tests again.',
  'New driver: 6 points in 2 years = licence revoked.',
  'Using a hand-held phone carries 6 points – enough on its own to lose a new licence.',
  { tags: ['penalty-points', 'new-drivers'] }),

  dc('DC-05', 'e', 'You change your address. Who must you tell?', [
    ['DVLA', 'Correct. Update your licence and V5C.'],
    ['DVSA', 'DVSA runs tests, not licence records.'],
    ['Your local council', 'Not for your licence.'],
    ['The police', 'Not needed.'],
  ], 0,
  'You must tell DVLA when you change your name or address. It is free to update your licence.',
  'Licence changes: tell DVLA.',
  undefined,
  { tags: ['licence'] }),

  dc('DC-06', 'm', 'The police ask to see your documents but you do not have them with you. Within how many days must you produce them at a police station?', [
    ['7 days', 'Correct.'],
    ['14 days', 'Not correct.'],
    ['21 days', 'Not correct.'],
    ['28 days', 'Not correct.'],
  ], 0,
  'If asked, you must produce your driving licence, insurance certificate and MOT certificate (if relevant) at a police station within 7 days.',
  'Produce documents within 7 days.',
  undefined,
  { tags: ['police'] }),

  dc('DC-07', 'm', 'What is a SORN (Statutory Off Road Notification)?', [
    ['A declaration that your vehicle is kept off public roads and is not taxed', 'Correct.'],
    ['A warning from the police', 'Not correct.'],
    ['A document to drive without insurance', 'Not correct.'],
    ['A temporary MOT exemption', 'Not correct.'],
  ], 0,
  'If you keep an untaxed vehicle off public roads, you must make a SORN. You cannot drive it on the road while it has a SORN (except to a pre-booked MOT).',
  'SORN = off the road, untaxed.',
  undefined,
  { tags: ['tax'] }),

  dc('DC-08', 'm', 'You buy a used car. Can you use the previous owner\'s vehicle tax?', [
    ['Yes, it transfers with the car', 'Vehicle tax no longer transfers.'],
    ['No, you must tax the car before driving it', 'Correct.'],
    ['Yes, for the first month only', 'Not correct.'],
    ['Only if you buy from a dealer', 'Not correct.'],
  ], 1,
  'Vehicle tax does not transfer to a new keeper. You must tax the vehicle before you drive it.',
  'New keeper = new tax.',
  undefined,
  { tags: ['tax'] }),

  dc('DC-09', 'e', 'What is Pass Plus?', [
    ['An optional training course for new drivers to gain more experience', 'Correct.'],
    ['A compulsory test after one year', 'It is optional.'],
    ['A type of licence for motorways', 'Not correct.'],
    ['An advanced motorcycle test', 'Not correct.'],
  ], 0,
  'Pass Plus is a voluntary course for newly qualified drivers covering things like motorway, night and all-weather driving. Some insurers offer discounts.',
  'Pass Plus = optional extra training.',
  undefined,
  { tags: ['new-drivers'] }),

  dc('DC-10', 'm', 'Who can supervise a learner car driver?', [
    ['Anyone with a full licence', 'There are age and experience requirements.'],
    ['Someone aged at least 21 who has held a full licence for that type of vehicle for at least 3 years', 'Correct.'],
    ['Someone aged at least 18 who has held a licence for 1 year', 'Not correct.'],
    ['Only an approved driving instructor', 'Others can supervise if they meet the rules.'],
  ], 1,
  'A supervisor must be at least 21, qualified to drive that type of vehicle, and have held a full licence for at least 3 years.',
  'Supervisor: 21+, full licence 3+ years.',
  undefined,
  { tags: ['learners'] }),

  dc('DC-11', 'm', 'What does "excess" mean on an insurance policy?', [
    ['The amount you must pay towards a claim yourself', 'Correct.'],
    ['The maximum the insurer will pay', 'Not correct.'],
    ['Extra cover for passengers', 'Not correct.'],
    ['A penalty for speeding', 'Not correct.'],
  ], 0,
  'The excess is the part of any claim you pay yourself. A higher voluntary excess can lower your premium.',
  'Excess = your share of a claim.',
  undefined,
  { tags: ['insurance'] }),

  dc('DC-12', 'h', 'Your car needs an MOT but the certificate has run out. When may you drive it?', [
    ['Only to a pre-booked MOT test, or to have repairs done for the MOT', 'Correct (it must still be roadworthy and insured).'],
    ['Any time within 30 days of expiry', 'There is no grace period.'],
    ['Only on weekends', 'Not correct.'],
    ['Never, under any circumstances', 'There is an exception.'],
  ], 0,
  'You may drive a car without a current MOT certificate only to a pre-arranged MOT test or to have repairs needed for the MOT. It must still be insured and roadworthy.',
  'No MOT = only to a booked test or MOT repair.',
  undefined,
  { tags: ['mot'] }),

  dc('DC-13', 'm', 'What is the penalty for using a hand-held mobile phone while driving?', [
    ['6 penalty points and a £200 fine', 'Correct.'],
    ['3 penalty points and a £100 fine', 'This was the old penalty before 2017.'],
    ['A warning only', 'Not correct.'],
    ['12 points and automatic ban for all drivers', 'Not correct.'],
  ], 0,
  'You can get 6 penalty points and a £200 fine. New drivers can lose their licence because of the 6-point rule.',
  'Hand-held phone: 6 points + £200.',
  undefined,
  { tags: ['phones', 'penalty-points'], ref: 'GOV.UK: Using a phone, sat nav or other device when driving' }),

  dc('DC-14', 'h', 'In England and Wales, what is the legal alcohol limit for drivers (blood)?', [
    ['80 milligrams of alcohol per 100 millilitres of blood', 'This is the long-standing limit in England, Wales and Northern Ireland.'],
    ['50 milligrams per 100 millilitres of blood', 'This is the limit in Scotland. It has been proposed for England and Wales.'],
    ['20 milligrams per 100 millilitres of blood', 'Not a UK limit for ordinary drivers.'],
    ['100 milligrams per 100 millilitres of blood', 'Not a UK limit.'],
  ], 0,
  'The limit in England, Wales and Northern Ireland has been 80 mg per 100 ml of blood; Scotland\'s is 50 mg. The government consulted in 2026 on lowering the England and Wales limit, so check GOV.UK for the latest position. The safest answer is not to drink at all if you are driving.',
  'Safest rule: do not drink and drive at all.',
  undefined,
  { tags: ['alcohol'], ref: 'GOV.UK: The drink drive limit', verify: 'A 2026 government consultation proposed lowering this limit. Check gov.uk/drink-drive-limit before relying on the figure.' }),
];

export const incidents = [
  inc('IN-01', 'e', 'You arrive first at the scene of a crash. What should you do first?', [
    ['Check for danger, such as other traffic or fire', 'Correct. Make the scene safe before helping casualties.'],
    ['Move the casualties out of their vehicles', 'Do not move them unless there is further danger.'],
    ['Give casualties a drink', 'Never give casualties anything to drink.'],
    ['Leave the scene', 'You should help if you can.'],
  ], 0,
  'First aid follows DR ABC: Danger, Response, Airway, Breathing, Compressions/Circulation. Warn other traffic, switch off engines, no smoking.',
  'DR ABC – Danger first.',
  undefined,
  { tags: ['first-aid'] }),

  inc('IN-02', 'e', 'A motorcyclist has been injured in a crash. When should you remove their helmet?', [
    ['Only if it is essential, for example to keep the airway open', 'Correct.'],
    ['Always, straight away', 'This could cause serious neck injury.'],
    ['To give them a drink', 'Never give drinks.'],
    ['When they ask', 'Only if essential.'],
  ], 0,
  'Do not remove a motorcyclist\'s helmet unless it is essential, because it could worsen a spinal injury.',
  'Helmet stays on unless essential.',
  undefined,
  { tags: ['first-aid', 'motorcyclists'] }),

  inc('IN-03', 'm', 'How long should you cool a burn with clean, cool water?', [
    ['At least 10 minutes', 'Correct (the Highway Code says at least 10 minutes; current NHS advice is up to 20).'],
    ['About 30 seconds', 'Far too short.'],
    ['1 minute', 'Too short.'],
    ['Do not cool burns', 'Cooling is important.'],
  ], 0,
  'Douse a burn with clean, cool water or a non-toxic liquid for at least 10 minutes. Do not remove anything sticking to the burn.',
  'Burns: cool water at least 10 minutes.',
  undefined,
  { tags: ['first-aid'] }),

  inc('IN-04', 'm', 'An adult casualty is not breathing normally. How should you give chest compressions?', [
    ['Press down 5 to 6 cm at a rate of 100 to 120 per minute in the centre of the chest', 'Correct.'],
    ['Press down 1 to 2 cm at 30 per minute', 'Too shallow and too slow.'],
    ['Press down 10 cm at 200 per minute', 'Too deep and too fast.'],
    ['Press on the stomach', 'Compressions go in the centre of the chest.'],
  ], 0,
  'For an adult, place the heel of one hand in the centre of the chest, other hand on top, and press down 5–6 cm at 100–120 compressions per minute.',
  'Adult CPR: 5–6 cm, 100–120 per minute.',
  undefined,
  { tags: ['first-aid', 'cpr'] }),

  inc('IN-05', 'm', 'A casualty is bleeding heavily from a wound. What should you do?', [
    ['Apply firm pressure to the wound', 'Correct.'],
    ['Give them a drink', 'Never.'],
    ['Keep them walking', 'Not appropriate.'],
    ['Wash the wound with soap', 'Not the priority.'],
  ], 0,
  'Press firmly on the wound with a clean pad, without pressing on anything in it, and raise the limb if it is not broken.',
  'Bleeding: firm pressure.',
  undefined,
  { tags: ['first-aid'] }),

  inc('IN-06', 'e', 'On a normal road (not a motorway), where should you place a warning triangle after a breakdown?', [
    ['At least 45 metres behind your vehicle on the same side of the road', 'Correct.'],
    ['On the roof of your car', 'Not correct.'],
    ['10 metres in front of your vehicle', 'Not correct.'],
    ['In the middle of the road', 'Dangerous.'],
  ], 0,
  'Place a warning triangle at least 45 metres behind your broken-down vehicle on the same side of the road, unless it is a motorway.',
  'Triangle: 45 m behind (never on a motorway).',
  undefined,
  { tags: ['warning-triangle', 'breakdown'] }),

  inc('IN-07', 'm', 'You are involved in a collision in which someone is injured. You do not show your insurance certificate at the scene. What must you do?', [
    ['Report it to the police as soon as possible, and within 24 hours', 'Correct.'],
    ['Report it within 7 days', 'Too late.'],
    ['Report it only to your insurer', 'You must also report to the police.'],
    ['Nothing, if the injury is minor', 'You must report it.'],
  ], 0,
  'If anyone is injured and you do not produce your insurance certificate at the time, you must report it to the police as soon as possible, and in any case within 24 hours.',
  'Injury collision, no insurance shown: report to police within 24 hours.',
  undefined,
  { tags: ['collisions'] }),

  inc('IN-08', 'm', 'You break down in a tunnel. What should you do?', [
    ['Switch on hazard lights, switch off the engine, and go to an emergency point to call for help', 'Correct.'],
    ['Stay in your car with the engine running', 'Fumes and fire risk.'],
    ['Walk out of the tunnel the way you came, in the road', 'Dangerous.'],
    ['Try to repair the car', 'Not safe.'],
  ], 0,
  'In a tunnel, switch on hazard lights, switch off the engine, leave the vehicle and go to the nearest emergency point to call for help.',
  'Tunnel breakdown: hazards on, engine off, emergency point.',
  undefined,
  { tags: ['tunnels', 'breakdown'] }),

  inc('IN-09', 'h', 'Your engine catches fire. What should you do?', [
    ['Get everyone out, call the fire service and do not open the bonnet', 'Correct.'],
    ['Open the bonnet to find the cause', 'Opening it feeds the fire with oxygen.'],
    ['Pour water on the engine', 'This may not be safe, especially with fuel or electrics.'],
    ['Keep driving to a garage', 'Very dangerous.'],
  ], 0,
  'Pull over, switch off the engine, get everyone out and well away, and call the fire service. Do not open the bonnet.',
  'Engine fire: out, away, 999. Bonnet stays shut.',
  undefined,
  { tags: ['fire'] }),

  inc('IN-10', 'h', 'Your car stalls on a level crossing and will not restart. What should you do first?', [
    ['Get everyone out of the car and clear of the crossing', 'Correct. Then call the signal operator.'],
    ['Keep trying to start the engine', 'Lives come first.'],
    ['Push the car off', 'Only if there is plenty of time and it is safe after people are clear.'],
    ['Wait for a train driver to stop', 'Trains cannot stop quickly.'],
  ], 0,
  'Get everyone out and clear of the crossing, then use the railway telephone to tell the signal operator. Move the car only if there is time and it is safe.',
  'Stuck on a level crossing: everyone out, then phone the signal operator.',
  undefined,
  { tags: ['level-crossings'], scenario: true }),

  inc('IN-11', 'm', 'A front tyre bursts while you are driving. What should you do?', [
    ['Hold the steering wheel firmly and slow down gradually', 'Correct.'],
    ['Brake hard immediately', 'This could make you lose control.'],
    ['Steer sharply to the hard shoulder', 'Could cause a skid.'],
    ['Accelerate to keep control', 'Not correct.'],
  ], 0,
  'Keep a firm grip on the wheel, ease off the accelerator, and slow down gradually before stopping safely.',
  'Blowout: firm grip, slow gradually.',
  undefined,
  { tags: ['tyres', 'emergencies'] }),

  inc('IN-12', 'e', 'At the scene of a crash, a casualty is in shock. What should you do?', [
    ['Reassure them, keep them warm and stay with them', 'Correct.'],
    ['Give them a hot drink', 'Never give anything to eat or drink.'],
    ['Walk them around to keep them alert', 'Not appropriate.'],
    ['Leave them alone', 'Stay with them.'],
  ], 0,
  'Keep casualties warm and comfortable, reassure them, and do not give them anything to eat or drink.',
  'Shock: reassure, keep warm, nothing to drink.',
  undefined,
  { tags: ['first-aid'] }),

  inc('IN-13', 'm', 'You hit and damage a parked car. The owner cannot be found. What must you do?', [
    ['Report it to the police as soon as possible, within 24 hours', 'Correct.'],
    ['Drive off', 'This is an offence.'],
    ['Tell your insurer only', 'You must also report it to the police.'],
    ['Wait for one hour, then leave', 'You must report it.'],
  ], 0,
  'If you damage a vehicle or property and cannot give your details to the owner, you must report it to the police as soon as possible and within 24 hours.',
  'Cannot find the owner? Report within 24 hours.',
  undefined,
  { tags: ['collisions'] }),

  inc('IN-14', 'm', 'When should you use your hazard warning lights while driving?', [
    ['On a motorway or unrestricted dual carriageway, briefly, to warn drivers behind of a hazard ahead', 'Correct.'],
    ['When parked illegally', 'Never an excuse for illegal parking.'],
    ['To thank another driver', 'Not correct.'],
    ['When driving in heavy rain', 'Use dipped headlights.'],
  ], 0,
  'Use hazard warning lights when stationary to warn you are temporarily obstructing traffic, or briefly on motorways or unrestricted dual carriageways to warn of a hazard ahead.',
  'Hazards: stationary obstruction, or brief warning on fast roads.',
  undefined,
  { tags: ['lights'] }),
];

export const loading = [
  lo('LO-01', 'e', 'Who is responsible for making sure a vehicle is not overloaded?', [
    ['The driver', 'Correct.'],
    ['The owner of the items', 'The driver is responsible.'],
    ['The licensing authority', 'Not correct.'],
    ['The vehicle manufacturer', 'Not correct.'],
  ], 0,
  'The driver is responsible for making sure the vehicle is not overloaded and the load is secure.',
  'Driver = responsible for the load.',
  undefined,
  { tags: ['load'] }),

  lo('LO-02', 'm', 'You fit a loaded roof rack. How will it affect your car?', [
    ['It will increase fuel consumption and may affect handling, especially in wind', 'Correct.'],
    ['It will improve stability', 'Not correct.'],
    ['It will reduce stopping distance', 'Not correct.'],
    ['It will make no difference', 'It does make a difference.'],
  ], 0,
  'A loaded roof rack raises the centre of gravity and increases wind resistance, affecting handling and fuel use.',
  'Roof load: more fuel, more wind effect.',
  undefined,
  { tags: ['roof-rack'] }),

  lo('LO-03', 'm', 'You are carrying a heavy load. What may you need to adjust?', [
    ['Your tyre pressures and headlight aim', 'Correct. Check your handbook.'],
    ['Your seat belt height', 'Not related to load.'],
    ['Your engine oil level', 'Not related to load.'],
    ['Your mirror positions only', 'Not enough.'],
  ], 0,
  'A heavy load may need higher tyre pressures and headlight adjustment so you do not dazzle others.',
  'Heavy load: tyre pressures and headlights.',
  undefined,
  { tags: ['load', 'tyres', 'lights'] }),

  lo('LO-04', 'h', 'Your caravan starts to snake (swerve from side to side). What should you do?', [
    ['Ease off the accelerator slowly', 'Correct.'],
    ['Brake hard', 'This can make it worse.'],
    ['Steer sharply to correct it', 'This can make it worse.'],
    ['Accelerate to pull it straight', 'Dangerous.'],
  ], 0,
  'If a trailer or caravan snakes, ease off the accelerator and reduce speed gently. Do not brake harshly or steer sharply.',
  'Snaking: ease off gently.',
  undefined,
  { tags: ['towing'] }),

  lo('LO-05', 'm', 'Why might you fit a stabiliser to your tow bar?', [
    ['To help reduce snaking and make towing safer', 'Correct. It does not replace good loading.'],
    ['To allow you to tow heavier loads', 'It does not increase limits.'],
    ['To use the right-hand motorway lane', 'Not correct.'],
    ['To avoid needing a breakaway cable', 'Not correct.'],
  ], 0,
  'A stabiliser can help reduce snaking and pitching, but correct loading and safe speed are still essential.',
  'Stabiliser helps – it does not fix bad loading.',
  undefined,
  { tags: ['towing'] }),

  lo('LO-06', 'm', 'How should you load a caravan or trailer?', [
    ['Heavy items low down and near the axle', 'Correct.'],
    ['Heavy items at the very back', 'This causes instability.'],
    ['Heavy items high up', 'This raises the centre of gravity.'],
    ['It does not matter', 'It matters a great deal.'],
  ], 0,
  'Put heavy items low and over the axle, so the load is stable and the nose weight is correct.',
  'Heavy and low, over the axle.',
  undefined,
  { tags: ['towing', 'load'] }),

  lo('LO-07', 'm', 'Where can you find the maximum weight your car can tow?', [
    ['In the vehicle handbook or on the vehicle identification (VIN) plate', 'Correct.'],
    ['On your driving licence', 'Not shown there.'],
    ['On your insurance certificate', 'Not shown there.'],
    ['On the V5C only', 'Use the handbook or VIN plate.'],
  ], 0,
  'Your vehicle handbook or VIN plate shows the maximum towing weight and nose weight.',
  'Towing limits: handbook / VIN plate.',
  undefined,
  { tags: ['towing'] }),

  lo('LO-08', 'h', 'What is a breakaway cable on a trailer for?', [
    ['It applies the trailer brakes if the trailer becomes detached', 'Correct.'],
    ['It powers the trailer lights', 'That is the electrical connector.'],
    ['It stops the trailer snaking', 'That is a stabiliser.'],
    ['It locks the trailer to the car', 'That is the coupling.'],
  ], 0,
  'A breakaway cable applies the trailer\'s brakes if it comes away from the towing vehicle.',
  'Breakaway cable = emergency trailer braking.',
  undefined,
  { tags: ['towing'] }),

  lo('LO-09', 'e', 'You are carrying a dog in your car. What should you do?', [
    ['Make sure it is suitably restrained so it cannot distract you', 'Correct.'],
    ['Let it sit on your lap', 'Dangerous and distracting.'],
    ['Let it put its head out of the window', 'Dangerous.'],
    ['Leave it loose on the back seat', 'It could distract you or be thrown forward.'],
  ], 0,
  'Animals should be suitably restrained so they cannot distract you or be injured, or injure you, if you stop quickly.',
  'Pets: restrained.',
  undefined,
  { tags: ['passengers'], ref: 'Highway Code: Rule 57' }),

  lo('LO-10', 'm', 'How does an overloaded car behave?', [
    ['Its handling is worse and stopping distance longer', 'Correct.'],
    ['It grips the road better', 'Not correct.'],
    ['It uses less fuel', 'Not correct.'],
    ['It accelerates faster', 'Not correct.'],
  ], 0,
  'Overloading affects braking, steering and stability. It can also be illegal.',
  'Overloaded = poorer control and longer stops.',
  undefined,
  { tags: ['load'] }),

  lo('LO-11', 'e', 'Children under 3 travelling in a car must:', [
    ['Use the correct child restraint for their weight or height', 'Correct.'],
    ['Sit on an adult\'s lap', 'Never.'],
    ['Wear an adult seat belt', 'Not suitable.'],
    ['Sit in the front seat only', 'Not correct.'],
  ], 0,
  'Children under 3 must use the correct child restraint. Children must normally use a child seat until they are 12 years old or 135 cm tall, whichever comes first.',
  'Child seats until 12 years or 135 cm.',
  undefined,
  { tags: ['children', 'passengers'], ref: 'Highway Code: Rules 99–102 (Seat belts and child restraints) / GOV.UK child car seats' }),

  lo('LO-12', 'h', 'You are towing a trailer. How will it affect your stopping distance?', [
    ['It will be longer', 'Correct.'],
    ['It will be shorter', 'Not correct.'],
    ['It will be the same', 'Extra weight increases it.'],
    ['It depends only on the trailer lights', 'Not correct.'],
  ], 0,
  'The extra weight increases stopping distance. Leave more room and brake earlier.',
  'Towing = longer stops, more space.',
  undefined,
  { tags: ['towing'] }),
];
