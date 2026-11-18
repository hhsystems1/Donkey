// Ride Smart lessons for riders 7–12. One idea per card, a big picture on every card, narration on every card.
// Lesson 1 follows Jo's approved guided steps word for word and plays her studio recordings.
// Card types: intro, idea, flip, check, sort, spot, quiz, pledge, done.
// "learn" cards are shorthand: each point [title, line, icon] becomes its own idea card.
const IMG = id => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=1400&q=70`;
const REC = n => `../rec/guided-step-${n}.mp3`; // proxied to Jo's recordings on the Oct 30 deploy (see netlify.toml)
window.LESSONS = [
{
  n: 1, slug: 'gear', title: 'Gear up', blurb: 'Helmet fit, the rest of your gear, and a bike check.', mins: 5,
  img: IMG('1773521478927-47b76d603a23'), alt: 'A rider in a helmet with a backpack',
  cards: [
    { t: 'intro', title: 'Let’s get ready together', body: 'You’ll practice three helmet checks, help Maya gear up, and try a quick quiz. One small step at a time.', say: 'Welcome to Gear Up! We’ll practice three helmet checks, help Maya dress for a ride, and answer four questions. You can practice without a bike. Before a real ride, work with a grown-up.' },
    { t: 'idea', ic: 'label', kick: 'Helmet', title: 'Find the label. Check the fit.', line: 'Ask a grown-up to help you find the helmet’s certification label and choose the correct size.', audio: REC(1) },
    { t: 'idea', ic: 'level', kick: 'Helmet check 1', title: 'Keep your helmet level', line: 'The front sits low on your forehead, about one or two finger-widths above your eyebrows.', audio: REC(2) },
    { t: 'idea', ic: 'vstrap', kick: 'Helmet check 2', title: 'Make a V by each ear', line: 'The side straps meet just below and slightly in front of your ears.', audio: REC(3) },
    { t: 'idea', ic: 'buckle', kick: 'Helmet check 3', title: 'Buckle. Snug. Gentle shake.', line: 'Only one or two fingers fit under the chin strap. The helmet stays put when you shake.', audio: REC(4) },
    { t: 'check', kick: 'Game', title: 'Help Maya gear up', body: 'Tap all six pieces of gear to get Maya ready.', audio: REC(5), items: [
      ['Helmet', '', 'helmet'], ['Knee pads', '', 'pads'], ['Elbow pads', '', 'pads'], ['Gloves', '', 'gloves'], ['Shoes', '', 'shoe'], ['Bright clothes', '', 'bright'] ], done: 'Maya is ready. Nice work!' },
    { t: 'idea', ic: 'light', kick: 'Your bike', title: 'Be seen. Be heard.', line: 'White light in front, red light in back, clean reflectors, and a working bell.', audio: REC(6) },
    { t: 'idea', ic: 'brake', kick: 'Your bike', title: 'Check before you roll', line: 'Ask a grown-up to check the brakes and tires before a ride.', audio: REC(7) },
    { t: 'idea', ic: 'plug', warn: true, kick: 'Battery', title: 'Charging is a grown-up job', line: 'Use the bike’s own charger. Stay nearby while it charges. Never charge while sleeping.', audio: REC(8) },
    { t: 'check', kick: 'Practice', title: 'Practice the pre-ride check', body: 'Tap each thing you would check with a grown-up before a real ride.', audio: REC(9), items: [
      ['Helmet', 'Level and buckled', 'helmet'], ['Brakes', 'Both stop smoothly', 'brake'], ['Bell', 'Ring it once', 'bell'],
      ['Shoes', 'Tied, nothing loose', 'shoe'], ['Battery', 'Charged the safe way', 'plug'], ['Bright clothes or lights', 'Easy to see', 'light'] ], done: 'Ready to roll.' },
    { t: 'quiz', q: 'When should you check your brakes and helmet?', o: ['Only when something feels broken', 'Before every ride', 'Once a year'], a: 1, why: 'Every ride, even short ones.', audio: REC(10) },
    { t: 'quiz', q: 'Your helmet is tipped back like a baseball cap. What do you do?', o: ['Ride anyway', 'Take it off', 'Level it and fix the straps with a grown-up'], a: 2, why: 'Tipped back leaves your forehead open. Level it and snug the straps.', audio: REC(11) },
    { t: 'quiz', q: 'What helps a grown-up check a helmet?', o: ['Its color', 'The label inside', 'Its price'], a: 1, why: 'The certification label is the proof. Color and price don’t tell you.', audio: REC(12) },
    { t: 'quiz', q: 'Which is the right charging plan?', o: ['Overnight on a bed', 'Any charger', 'The bike’s own charger, with a grown-up awake nearby'], a: 2, why: 'The right charger and a grown-up nearby keeps the battery safe.', audio: REC(13) },
    { t: 'done', audio: REC(14) } ]
},
{
  n: 2, slug: 'signs', title: 'Signs are clues', blurb: 'Read any sign by its color and shape, and know where bikes belong.', mins: 5,
  img: IMG('1693776471915-54c81fc5b0ad'), alt: 'Blue bike route signs on a pole',
  cards: [
    { t: 'intro', title: 'Signs are clues', body: 'Signs talk without words. Learn the color and shape code and you can read a sign before you can even see the words.' },
    { t: 'learn', kick: 'The code', pts: [
      ['Red means stop', 'Stop, yield, or do not go.', 'red'], ['Yellow means careful', 'Something ahead needs your attention.', 'yellow'],
      ['Blue means help', 'Information, like routes and where to go.', 'blue'], ['Eight sides is always STOP', 'Even if snow covers the word.', 'octagon'] ] },
    { t: 'flip', kick: 'Tap each sign', title: 'Know these 8', items: [
      ['stop', 'Stop', 'Full stop, foot down. Look left, right, left. Rolling through does not count.'],
      ['yield', 'Yield', 'Slow down and let others go first. Go only when it is clear.'],
      ['dne', 'Do not enter', 'Wrong way. Traffic is coming at you. Turn around.'],
      ['ped', 'People crossing', 'People cross here. Slow down and be ready to stop. Walkers go first.'],
      ['oneway', 'One way', 'Traffic only goes the way of the arrow. Never ride against it.'],
      ['lane', 'Bike lane', 'Made for bikes. Ride the way the arrows point and watch for turning cars.'],
      ['sharrow', 'Sharrow', 'Bikes and cars share this lane. Ride over the arrows, where drivers see you.'],
      ['full', 'Bikes may use full lane', 'You are allowed in the middle of the lane. No squeezing into the gutter.'] ] },
    { t: 'learn', kick: 'Where do I ride?', pts: [
      ['Bike lane or path? Ride there.', 'That space is made for you.', 'bike'], ['Sharrow or bike route sign?', 'Share the lane, going the same way as cars.', 'arrows'],
      ['No signs at all?', 'Right side of the road, same way as cars, away from parked car doors.', 'road'],
      ['Sidewalk?', 'Only if your town allows it. Go walking speed. Walkers first.', 'walkbike'] ] },
    { t: 'quiz', q: 'A red sign with eight sides is covered in snow. What is it?', o: ['A yield sign', 'A stop sign', 'Can’t tell, keep going'], a: 1, why: 'Only stop signs have eight sides.' },
    { t: 'quiz', q: 'A sharrow is painted on the road. Where do you ride?', o: ['In the gutter at the edge', 'Over the arrows, in the lane', 'Turn around'], a: 1, why: 'A sharrow means share the lane. Riding over the arrows keeps you away from car doors.' },
    { t: 'quiz', q: 'At a yield sign, a car is coming. You…', o: ['Let the car go first', 'Speed up and beat it', 'Keep going'], a: 0, why: 'Yield means others go first.' },
    { t: 'done' } ]
},
{
  n: 3, slug: 'road', title: 'Rules of the road', blurb: 'Ride with traffic, stop all the way, and signal every turn.', mins: 6,
  img: IMG('1772859022889-1a6b1b5fa237'), alt: 'Bike lane arrows painted on a road',
  cards: [
    { t: 'intro', title: 'Rules of the road', body: 'On the road, you follow driver rules too. The big idea: be predictable. No surprises for anyone around you.' },
    { t: 'learn', kick: 'Ride like a driver', pts: [
      ['Ride with traffic', 'Right side, same direction as the cars.', 'road'], ['Stop means stop', 'Stop all the way. Look left, right, left.', 'stop'],
      ['Corners are the danger zone', 'Slow down and look drivers in the eye.', 'eyes'], ['Eyes up, phone away', 'Two hands on the bars, no headphones.', 'nophone'] ] },
    { t: 'learn', kick: 'Every e-bike has a class', pts: [
      ['Class 1', 'The motor helps only while you pedal. Up to 20 mph.', 'num1'],
      ['Class 2', 'Has a throttle, so it can go without pedaling. Up to 20 mph. Squeeze it gently.', 'num2'],
      ['Class 3', 'Up to 28 mph. Often only for riders 16 and up.', 'num3'],
      ['Find your class', 'Look for the sticker on the frame with a grown-up.', 'sticker'] ] },
    { t: 'idea', ic: 'nomoto', warn: true, kick: 'Spot check', title: 'No pedals? Not an e-bike.', line: 'A bike with no pedals, or a motor over 750 watts, counts as a motorcycle. It is not for kids. Ask a grown-up to check.' },
    { t: 'learn', kick: 'Hand signals', pts: [
      ['Turning left', 'Left arm straight out.', 'armleft'], ['Turning right', 'Right arm straight out.', 'armright'],
      ['Stopping', 'Left arm bent down, palm back.', 'armstop'] ] },
    { t: 'quiz', q: 'You’re about to turn left. What do you do first?', o: ['Turn, then signal', 'Left arm out, then turn', 'Wave at the driver'], a: 1, why: 'Signal first so drivers know what you’ll do.' },
    { t: 'quiz', q: 'Stop sign and no cars around. Can you roll through?', o: ['Yes, if I look', 'No, stop all the way'], a: 1, why: 'Stop all the way, every time.' },
    { t: 'quiz', q: 'Best way to start on a throttle bike?', o: ['Full power', 'A gentle, smooth squeeze', 'Look down at the throttle'], a: 1, why: 'Throttle power comes on fast. Start gently with your eyes up.' },
    { t: 'done' } ]
},
{
  n: 4, slug: 'sidewalks', title: 'Sidewalks and crossings', blurb: 'Around people walking, you go slow and give space.', mins: 4,
  img: IMG('1763212182624-fff7e84e3c09'), alt: 'Cyclists crossing a busy street at a crosswalk',
  cards: [
    { t: 'intro', title: 'Sidewalks and crossings', body: 'Sidewalks belong to people walking. Many towns don’t allow e-bikes on sidewalks at all. Where they do, you go slow and let walkers go first.' },
    { t: 'learn', kick: 'Sidewalk rules', pts: [
      ['Walking speed near people', 'Ring your bell early and pass wide.', 'bell'], ['Walk it across', 'At crosswalks, get off and walk your bike.', 'stripes'],
      ['Every driveway is a street', 'Cars back out without seeing you. Slow down and look.', 'house'], ['Crowded? Walk it.', 'Give dogs, strollers and little kids lots of room.', 'crowd'] ] },
    { t: 'sort', kick: 'Safe or not?', title: 'You decide', items: [
      ['Walking your bike across the crosswalk', true, 'Drivers expect walkers in a crosswalk.'],
      ['Riding across the crosswalk really fast', false, 'Drivers don’t expect something that fast. Walk it.'],
      ['Ringing early and passing a stroller slowly and wide', true, 'That’s how to share the sidewalk.'],
      ['Rolling past a driveway without looking', false, 'Cars back out. Look every time.'],
      ['Weaving through a crowd', false, 'Too many surprises. Hop off and walk.'],
      ['Getting off when the sidewalk gets busy', true, 'That’s what smart riders do.'] ] },
    { t: 'quiz', q: 'A family with a little kid is ahead on the sidewalk. Best move?', o: ['Zoom past close', 'Slow down, ring early, pass wide or walk', 'Ride fast on the grass'], a: 1, why: 'Little kids can step in front of you without warning.' },
    { t: 'quiz', q: 'The safest way across a crosswalk is…', o: ['Walk your bike across', 'Ride fast', 'Ride without looking'], a: 0, why: 'Walking makes you easy for drivers to expect.' },
    { t: 'done' } ]
},
{
  n: 5, slug: 'parking', title: 'Parking lot smarts', blurb: 'Backing cars, opening doors, and drivers who can’t see you.', mins: 4,
  img: IMG('1625304664697-30a254733647'), alt: 'An e-bike parked by a road',
  cards: [
    { t: 'intro', title: 'Parking lot smarts', body: 'Parking lots look calm, but they’re tricky. Cars back up, doors swing open, and drivers are looking for a spot, not for bikes.' },
    { t: 'learn', kick: 'Assume no one sees you', pts: [
      ['White lights mean backing up', 'Stop and wait. Never sneak behind it.', 'carback'], ['Stay out from between cars', 'Doors open and people step out.', 'door'],
      ['Big trucks hide you', 'Slow down and peek at every corner.', 'truck'], ['Follow the arrows', 'Parking lots have one-way lanes too.', 'arrows'] ] },
    { t: 'spot', kick: 'Find the dangers', title: 'Tap the 5 dangers', items: [
      ['Car with white lights on', true, 'It’s about to back up.', 'carback'], ['Car door swinging open', true, 'A door can stop you fast.', 'door'],
      ['Rolling shopping cart', true, 'Carts roll without warning.', 'cart'], ['Kid running to a car', true, 'Small and fast, hard to see.', 'crowd'],
      ['Big truck blocking the view', true, 'Nobody can see around it.', 'truck'], ['Empty bike rack', false, 'That’s where you want to go.', 'rack'] ] },
    { t: 'idea', ic: 'rack', kick: 'Park it right', title: 'Use the bike rack', line: 'Never block doors, ramps, special parking spots, or the sidewalk.' },
    { t: 'quiz', q: 'The car ahead turns on white backup lights. You…', o: ['Speed past', 'Stop, move aside and wait', 'Ride right behind it'], a: 1, why: 'The driver is looking for cars, not bikes.' },
    { t: 'quiz', q: 'Is weaving between parked cars a good shortcut?', o: ['Yes, it’s faster', 'No, stay in the driving lane'], a: 1, why: 'Between parked cars, no one can see you coming.' },
    { t: 'done' } ]
},
{
  n: 6, slug: 'finish', title: 'The big finish', blurb: 'Nine questions, the pledge, and your certificate.', mins: 6,
  img: IMG('1788494911551-0cf48edf6579'), alt: 'A rider in a helmet on a dirt track',
  cards: [
    { t: 'intro', title: 'The big finish', body: 'Nine questions from all five lessons. Miss one? Try again. Then say the pledge and get your certificate.' },
    { t: 'quiz', q: 'Before every ride you check…', o: ['Helmet, brakes, tires, lights and bell', 'Just the battery', 'Nothing'], a: 0, why: 'A quick check, every ride.' },
    { t: 'quiz', q: 'A triangle sign that says YIELD means…', o: ['Go faster', 'Slow down and let others go first', 'Stop forever'], a: 1, why: 'Others go first. You go when it’s clear.' },
    { t: 'quiz', q: 'On the road you ride…', o: ['With traffic, on the right', 'Facing traffic, on the left', 'Down the middle'], a: 0, why: 'Same way as the cars.' },
    { t: 'quiz', q: 'To signal a left turn you…', o: ['Point your right arm up', 'Stick your left arm straight out', 'Just turn'], a: 1, why: 'Left arm out, before you turn.' },
    { t: 'quiz', q: 'People are walking on the sidewalk ahead. You…', o: ['Ride fast to get past', 'Slow down, give space, or walk', 'Ring until they move'], a: 1, why: 'Walkers go first on sidewalks.' },
    { t: 'quiz', q: 'White lights on the back of a car mean…', o: ['It’s backing up, stay clear', 'Safe to pass behind', 'It’s parked'], a: 0, why: 'White lights mean reverse.' },
    { t: 'quiz', q: 'A blue sign with a wheelchair and stripes beside it…', o: ['A good shortcut', 'Saved for people who need it, never block it', 'Bike parking'], a: 1, why: 'That space is for wheelchairs and ramps.' },
    { t: 'quiz', q: 'A driver at the corner is looking at their phone. You…', o: ['Go, they probably see you', 'Wait for eye contact and a clear road', 'Zip behind the car'], a: 1, why: 'Never guess that a driver sees you.' },
    { t: 'quiz', q: 'What’s true about Class 3 e-bikes?', o: ['Best for sidewalks', 'Often only for riders 16 and up', 'No helmet needed'], a: 1, why: 'Class 3 goes up to 28 mph, so the rules are stricter.' },
    { t: 'pledge', lines: [
      'I wear my helmet level and buckled, every ride.', 'I check my brakes, tires, lights and bell before I roll.',
      'I stop at every stop sign and follow every signal.', 'I ride with traffic and signal my turns.',
      'I slow down for people walking and walk my bike at crossings.', 'I watch for backing cars and opening doors.',
      'I follow my town’s rules and ride with a grown-up’s OK.' ] },
    { t: 'done', final: true } ]
}];
// expand "learn" shorthand into one idea card per point
window.LESSONS.forEach(l => {
  l.cards = l.cards.flatMap(c => c.t !== 'learn' ? [c] : c.pts.map(([title, line, ic], i) => ({ t: 'idea', ic, kick: c.kick, title, line, step: `${i + 1} of ${c.pts.length}` })));
});
