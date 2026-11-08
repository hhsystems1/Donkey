// Ride Smart lessons. One card per screen. Written for riders 10–14: short, direct, no baby talk.
// Card types: intro, learn, warn, flip, check, sort, spot, quiz, pledge, done.
const IMG = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=70`;
window.LESSONS = [
{
  n: 1, slug: 'gear', title: 'Gear up', blurb: 'Helmet fit, the rest of your kit, and a 30-second bike check.', mins: 5,
  img: IMG('1773521478927-47b76d603a23'), alt: 'A rider in a helmet with a backpack',
  cards: [
    { t: 'intro', title: 'Gear up', body: 'An e-bike is heavier and quicker than a regular bike, so a crash hits harder. Your gear has to keep up. Here is what to wear, how to fit it, and what to check before you roll.' },
    { t: 'learn', kick: 'The helmet', title: 'Fit beats price', pts: [
      ['Find the sticker inside', 'Look for the CPSC label. That is the U.S. safety standard. Some helmets also say NTA 8776, a test done at e-bike speeds.'],
      ['Size it to your head', 'Measure around your head just above your eyebrows. Helmet sizes go by centimeters, not by age.'],
      ['Crashed it? Replace it', 'One hard hit can crush the foam inside, even if the outside looks fine.'] ] },
    { t: 'learn', kick: 'Fit it in 3 moves', title: 'Level. V. Snug.', pts: [
      ['Level', 'Flat on your head, about two fingers above your eyebrows. Not tipped back like a cap.'],
      ['Make a V', 'The side straps meet in a V just under each ear.'],
      ['Snug', 'Buckle it. Only one or two fingers fit under the chin strap. Shake your head: the helmet should not slide.'] ],
      tip: '<b>Quick test:</b> push the helmet up from the front. If it uncovers your forehead, tighten the straps.' },
    { t: 'learn', kick: 'The rest of the kit', title: 'Dress for the fall', pts: [
      ['Gloves', 'Your hands hit first in a fall. Gloves also help your grip.'],
      ['Knee and elbow pads', 'Worth it while you are still learning how the bike handles.'],
      ['Closed shoes', 'Toes covered, grippy soles, laces tucked away from the chain.'],
      ['Something bright', 'A bright or reflective layer makes drivers notice you sooner.'] ] },
    { t: 'learn', kick: 'The bike', title: 'Check it before it checks you', pts: [
      ['Brakes', 'Squeeze both. The bike should stop smoothly. Spongy or squealing means no ride until it is fixed.'],
      ['Tires', 'Squeeze them. Firm is good. Soft means pump them up first.'],
      ['Lights', 'White in front, red in back. On whenever it is dim, foggy or raining.'],
      ['Bell', 'So walkers know you are coming before you get there.'] ] },
    { t: 'warn', kick: 'Battery', title: 'Charging rules', pts: [
      ['Only the bike\'s own charger', 'Never a random charger that happens to fit.'],
      ['Not on a bed or couch, not overnight', 'Charge on a hard floor while someone is awake and nearby.'],
      ['Swollen, cracked or smells weird?', 'Do not touch it. Tell a parent right away.'] ] },
    { t: 'check', kick: 'Try it', title: 'Your pre-ride check', body: 'Tap each one as you would do it before a real ride.', items: [
      ['Helmet level and buckled', 'Two-finger rule'], ['Both brakes squeezed', 'Stops smooth'], ['Tires firm', 'Squeeze test'],
      ['Lights on if it\'s dim', 'White front, red back'], ['Bell works', 'Ring it once'], ['Shoes tied, nothing loose', 'Away from the chain'] ] },
    { t: 'quiz', q: 'When do you check your brakes and helmet?', o: ['Only if something feels off', 'Before every ride, even short ones', 'Once a month'], a: 1, why: 'Every ride. It takes 30 seconds, and a loose strap or soft brake is easy to miss until you need it.' },
    { t: 'quiz', q: 'Your helmet is tipped back like a baseball cap. Now what?', o: ['Ride anyway, it still covers your head', 'Level it and tighten the straps', 'Take it off, it\'s uncomfortable'], a: 1, why: 'Tipped back leaves your forehead open. Level it, make the V under each ear, and snug the buckle.' },
    { t: 'quiz', q: 'Which charging setup is right?', o: ['Overnight on your bed', 'Any charger that fits', 'The bike\'s own charger, someone awake nearby'], a: 2, why: 'E-bike batteries can overheat. The right charger, a hard surface and someone awake keeps it safe.' },
    { t: 'done' } ]
},
{
  n: 2, slug: 'signs', title: 'Signs are clues', blurb: 'Read any sign by its shape and color, and know where bikes belong.', mins: 5,
  img: IMG('1693776471915-54c81fc5b0ad'), alt: 'Blue bike route signs on a pole',
  cards: [
    { t: 'intro', title: 'Signs are clues', body: 'Signs talk without words. Once you know the color and shape code, you can read almost any sign before you are close enough to see the words.' },
    { t: 'learn', kick: 'The code', title: 'Color first, then shape', pts: [
      ['Red', 'Stop, yield, or do not go.'], ['Yellow', 'Warning. Something ahead needs your attention.'],
      ['Blue or green', 'Information: routes, services, where to go.'], ['Eight sides', 'Always a stop sign, even if snow covers the word.'] ] },
    { t: 'flip', kick: 'Tap each sign', title: 'Know these 8', items: [
      ['stop', 'Stop', 'Full stop, foot down. Look left, right, left. Rolling through does not count.'],
      ['yield', 'Yield', 'Slow down and let others go first. Go only when it is clear.'],
      ['dne', 'Do not enter', 'Wrong way. Traffic is coming at you. Turn around.'],
      ['ped', 'Pedestrian crossing', 'People cross here. Slow down and be ready to stop. Walkers go first.'],
      ['oneway', 'One way', 'Traffic only goes the way of the arrow. Never ride against it.'],
      ['lane', 'Bike lane', 'Made for bikes. Ride with the arrows and watch for turning cars.'],
      ['sharrow', 'Sharrow', 'Painted on the road: bikes and cars share this lane. Ride over the arrows, where drivers see you.'],
      ['full', 'Bikes may use full lane', 'You are allowed in the middle of the lane. No need to squeeze into the gutter.'] ] },
    { t: 'learn', kick: 'Where do I ride?', title: 'Ask in this order', pts: [
      ['Bike lane or path?', 'Ride there.'], ['Bike route sign or a sharrow?', 'Share the lane, going with traffic.'],
      ['No signs at all?', 'Right side of the road, same direction as cars, an arm\'s length from parked cars.'],
      ['Sidewalk?', 'Only if your town allows it. Walking speed, walkers first.'] ],
      tip: '<b>Never</b> ride toward traffic, and never weave in and out between parked cars. Drivers cannot see you pop out.' },
    { t: 'quiz', q: 'A red eight-sided sign is covered in snow. What is it?', o: ['A yield sign', 'A stop sign', 'Can\'t tell, keep going'], a: 1, why: 'Only stop signs have eight sides. The shape is the clue when the words are hidden.' },
    { t: 'quiz', q: 'There is no bike lane, but a sharrow is painted on the road. Where do you ride?', o: ['In the gutter at the very edge', 'Over the arrows, in the lane', 'Turn around, bikes aren\'t allowed'], a: 1, why: 'A sharrow means the lane is shared. Riding over the arrows keeps you away from car doors and in drivers\' view.' },
    { t: 'quiz', q: 'At a yield sign, a car is coming. You…', o: ['Let the car go first', 'Speed up and beat it', 'Go if you\'re already moving'], a: 0, why: 'Yield means others go first. Wait until it is clear.' },
    { t: 'done' } ]
},
{
  n: 3, slug: 'road', title: 'Rules of the road', blurb: 'Ride like a driver: with traffic, predictable, and signaling every turn.', mins: 6,
  img: IMG('1772859022889-1a6b1b5fa237'), alt: 'Bike lane arrows painted on a road',
  cards: [
    { t: 'intro', title: 'Rules of the road', body: 'On the road you are a driver, so driver rules apply to you. The big one is be predictable: no surprises for anyone around you.' },
    { t: 'learn', kick: 'The big four', title: 'Ride like a driver', pts: [
      ['Ride with traffic', 'Right side, same direction as cars. Riding toward traffic gives everyone less time to react.'],
      ['Stop means stop', 'Stop signs and red lights apply to bikes. Full stop, look left, right, left, then go.'],
      ['Intersections are the danger zone', 'Most crashes happen where roads cross. Slow down and get eye contact with drivers.'],
      ['Eyes up, phone away', 'Two hands on the bars. No headphones; you need to hear traffic.'] ] },
    { t: 'learn', kick: 'Know your bike', title: 'Every e-bike has a class', pts: [
      ['Class 1: pedal assist', 'The motor helps only while you pedal, up to 20 mph.'],
      ['Class 2: throttle', 'Moves without pedaling, up to 20 mph. Start with a gentle squeeze; throttle power comes on fast.'],
      ['Class 3: fast pedal assist', 'Up to 28 mph. Many states limit it to riders 16 and up, and keep it off sidewalks and paths.'] ],
      tip: '<b>Find your class</b> on the sticker on the frame. Your class decides where you can ride.' },
    { t: 'warn', kick: 'Spot check', title: 'Is it really an e-bike?', pts: [
      ['Working pedals', 'Real pedals you can ride with.'], ['Motor 750 watts or less', 'Check the label or the seller\'s page.'],
      ['A class sticker', 'Class 1, 2 or 3 with its top speed.'] ],
      tip: '<b>No pedals, or more than 750 watts?</b> That is an e-moto. The law treats it like a motorcycle: license, registration, insurance. Not for kids.' },
    { t: 'learn', kick: 'Hand signals', title: 'Your arm is your blinker', pts: [
      ['Left turn', 'Left arm straight out to the side.'], ['Right turn', 'Right arm straight out. Some riders bend the left arm up instead; both are legal.'],
      ['Stopping', 'Left arm bent down, palm facing back.'] ],
      tip: '<b>Signal before you turn,</b> then put both hands back on the bars for the turn itself.' },
    { t: 'quiz', q: 'You\'re about to turn left. What do you do first?', o: ['Turn, then signal', 'Left arm straight out, then turn', 'Wave at the driver behind you'], a: 1, why: 'Signal before you move so drivers can plan around you.' },
    { t: 'quiz', q: 'Stop sign, no cars anywhere. Can you roll through?', o: ['Yes, if you look carefully', 'No, stop fully every time'], a: 1, why: 'A car you didn\'t see is exactly the one that hits you. Full stop, every time.' },
    { t: 'quiz', q: 'Safest way to start on a Class 2 throttle bike?', o: ['Full throttle to get going', 'A gentle, smooth squeeze', 'Throttle while looking down at it'], a: 1, why: 'Throttle power arrives fast. Ease in, eyes up, ready to brake.' },
    { t: 'done' } ]
},
{
  n: 4, slug: 'sidewalks', title: 'Sidewalks and crossings', blurb: 'When you\'re around people walking, you\'re the guest.', mins: 4,
  img: IMG('1763212182624-fff7e84e3c09'), alt: 'Cyclists crossing a busy street at a crosswalk',
  cards: [
    { t: 'intro', title: 'Sidewalks and crossings', body: 'Sidewalks belong to people walking. Many towns ban e-bikes on sidewalks completely, and Class 3 is almost never allowed. Where it is allowed, you are a guest.' },
    { t: 'learn', kick: 'Guest rules', title: 'Slow, polite, ready to walk', pts: [
      ['Walking speed near people', 'Ring early, pass wide, say "on your left."'],
      ['Walk it across', 'At crosswalks, get off and walk. Drivers expect walking speed there.'],
      ['Every driveway is a street', 'Cars back out without seeing you. Slow down and look.'],
      ['Crowded? Walk it', 'Dogs, strollers, wheelchairs and little kids need room and no surprises.'] ] },
    { t: 'sort', kick: 'Safe or not?', title: 'Call it', items: [
      ['Walking your bike across the crosswalk', true, 'Right. In a crosswalk, walking makes you a pedestrian drivers expect.'],
      ['Riding across the crosswalk at full speed', false, 'Drivers turning in don\'t expect something that fast. Walk it.'],
      ['Passing a stroller wide at walking speed after ringing', true, 'Exactly how a guest passes.'],
      ['Rolling past a driveway without looking', false, 'Cars back out blind. Treat every driveway like a street.'],
      ['Weaving through a crowd outside a store', false, 'Too many surprises. Hop off and walk.'],
      ['Hopping off when the sidewalk gets busy', true, 'That\'s what experienced riders do.'] ] },
    { t: 'quiz', q: 'A family with a toddler is ahead on the sidewalk. Best move?', o: ['Ring and zoom past close', 'Slow down, ring early, pass wide or walk', 'Cut across the grass at speed'], a: 1, why: 'Toddlers change direction without warning. Give them space and time.' },
    { t: 'quiz', q: 'Your town bans e-bikes on sidewalks. The road is busy. You…', o: ['Ride the sidewalk anyway, slowly', 'Use the bike lane, or walk the bike on the sidewalk', 'Ride on the road facing traffic'], a: 1, why: 'Walking the bike is always allowed. Riding against traffic never is.' },
    { t: 'done' } ]
},
{
  n: 5, slug: 'parking', title: 'Parking lot smarts', blurb: 'Backing cars, opening doors, and drivers who aren\'t looking for you.', mins: 4,
  img: IMG('1625304664697-30a254733647'), alt: 'An e-bike parked by a road',
  cards: [
    { t: 'intro', title: 'Parking lot smarts', body: 'Parking lots look calm, but they are one of the trickiest places to ride. Cars back up, doors swing open, and drivers are hunting for spots, not watching for bikes.' },
    { t: 'learn', kick: 'Golden rule', title: 'Assume no one sees you', pts: [
      ['White lights on a car = reversing', 'Stop and wait well behind it. Never sneak past.'],
      ['Ride the middle of the lane', 'Not between parked cars, where doors open and people step out.'],
      ['Tall trucks hide you', 'At every corner of the lot, slow down and peek.'],
      ['Follow the arrows', 'Lots have one-way lanes too.'] ] },
    { t: 'spot', kick: 'Find the dangers', title: 'Tap the 5 dangers', items: [
      ['Car with white lights on', true, 'It\'s about to reverse.'], ['Driver\'s door swinging open', true, 'A door can stop you instantly.'],
      ['Runaway shopping cart', true, 'Carts roll into lanes without warning.'], ['Kid running to a car', true, 'Small and fast, hard to see.'],
      ['Big truck blocking the view', true, 'You can\'t see past it, and no one can see you.'], ['Empty bike rack', false, 'That\'s where you want to end up.'] ] },
    { t: 'learn', kick: 'Park it right', title: 'Lock it where it belongs', pts: [
      ['Use the rack', 'No rack? Ask where bikes go.'], ['Never block a path', 'Not doors, ramps, accessible spots, or the sidewalk.'] ] },
    { t: 'quiz', q: 'The car ahead turns on white backup lights. You…', o: ['Speed past before it moves', 'Stop, move aside and wait', 'Ride right behind it'], a: 1, why: 'The driver is looking for cars, not bikes. Give them room and wait.' },
    { t: 'quiz', q: 'Weaving between parked cars is the shortcut. Good idea?', o: ['Yes, it\'s faster', 'No, stay in the driving lane'], a: 1, why: 'Between parked cars, nobody can see you coming and doors can open in your face.' },
    { t: 'done' } ]
},
{
  n: 6, slug: 'finish', title: 'The final check', blurb: 'Nine questions, the pledge, and your certificate.', mins: 6,
  img: IMG('1788494911551-0cf48edf6579'), alt: 'A rider in a helmet on a dirt track',
  cards: [
    { t: 'intro', title: 'The final check', body: 'Nine questions from all five lessons. Miss one and you can try again. Then take the pledge and get your certificate.' },
    { t: 'quiz', q: 'Before every ride you check…', o: ['Helmet, brakes, tires, lights, bell', 'Just the battery', 'Nothing, just go'], a: 0, why: 'Thirty seconds, every ride.' },
    { t: 'quiz', q: 'A triangle sign that says YIELD means…', o: ['Go faster', 'Slow down and let others go first', 'Stop and wait for a green light'], a: 1, why: 'Yield: others first, you go when it\'s clear.' },
    { t: 'quiz', q: 'On the road you ride…', o: ['With traffic, on the right', 'Facing traffic, on the left', 'Down the middle'], a: 0, why: 'Same direction as cars, so drivers see you where they expect you.' },
    { t: 'quiz', q: 'To signal a left turn you…', o: ['Point your right arm up', 'Stick your left arm straight out', 'Just turn'], a: 1, why: 'Left arm out, before the turn.' },
    { t: 'quiz', q: 'People walking on the sidewalk ahead. You…', o: ['Ride fast to get past', 'Slow down, give space, or walk', 'Ring until they move'], a: 1, why: 'Walkers have the right of way on sidewalks.' },
    { t: 'quiz', q: 'White lights on the back of a car mean…', o: ['It\'s reversing, stay clear', 'Safe to pass behind', 'It\'s parked for the night'], a: 0, why: 'White lights = reverse gear.' },
    { t: 'quiz', q: 'Blue sign with a wheelchair and a striped space beside it…', o: ['A good shortcut', 'Reserved accessible parking, never block it', 'Bike parking'], a: 1, why: 'That striped space is for wheelchairs and ramps.' },
    { t: 'quiz', q: 'A driver at the intersection is looking at their phone. You…', o: ['Assume they see you and go', 'Wait for eye contact and a clear road', 'Go behind the car fast'], a: 1, why: 'Never assume a driver sees you.' },
    { t: 'quiz', q: 'What\'s true about Class 3 e-bikes?', o: ['Best class for sidewalks', 'Many states limit them to riders 16+', 'They never need a helmet'], a: 1, why: 'Class 3 goes up to 28 mph, so the rules are stricter.' },
    { t: 'pledge', lines: [
      'I wear my helmet level and buckled, every ride.', 'I check brakes, tires, lights and bell before I roll.',
      'I stop at every stop sign and follow every signal.', 'I ride with traffic, signal my turns and stay predictable.',
      'I slow down for people walking and walk my bike at crossings.', 'I watch for backing cars and opening doors.',
      'I follow my state and town rules for my e-bike class.' ] },
    { t: 'done', final: true } ]
}];
