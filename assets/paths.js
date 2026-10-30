// Guided paths: "If you're this parent with this problem, do these three things."
// Shared by the home page chooser and the readiness check.
window.PATHS = [
  { id: 'new', who: 'My kid just got an e-bike', want: 'Get them riding safely this week', steps: [
    ['Fit the helmet and gear together', 'Lesson 1 · 5 min · do it side by side', 'learn/#1'],
    ['Check the bike for recalls', '1 min · brand and model are on the frame', 'parents/#recall'],
    ['Learn the road rules', 'Lessons 2 and 3 · 10 min', 'learn/#2'] ] },
  { id: 'school', who: 'Their school wants a safety course', want: 'Finish the course and get the certificate', steps: [
    ['Do the six lessons in order', 'About 30 min total · progress saves on this device', 'learn/#1'],
    ['Pass the final check and take the pledge', 'Lesson 6 · certificate download at the end', 'learn/#6'],
    ['Check what your state requires', 'Age limits, helmets, where they can ride', 'parents/#laws'] ],
    note: 'Schools set their own rules about which courses they accept. Ask your school before you rely on this certificate.' },
  { id: 'shop', who: 'We’re shopping for a bike or gear', want: 'Buy the right class, helmet and size', steps: [
    ['Understand e-bike classes', 'Class 1, 2 or 3 decides where they can ride', 'learn/#3/5'],
    ['Pick a helmet that fits', 'Measure, check the label, try it on', 'parents/#helmet'],
    ['Build the full gear list', 'Sizes and a budget in one minute', 'parents/#kit'] ] },
  { id: 'rules', who: 'I want to know where they can ride', want: 'Know the law and the safe spots', steps: [
    ['Look up your state', 'Minimum age, helmets, sidewalks and paths', 'parents/#laws'],
    ['Learn what the signs mean', 'Lesson 2 · 5 min', 'learn/#2'],
    ['Sidewalks and crossings', 'Lesson 4 · 4 min', 'learn/#4'] ] },
  { id: 'battery', who: 'I’m worried about the battery', want: 'Charge it safely and spot a bad battery', steps: [
    ['Set up a charging routine', 'Five habits that prevent most battery fires', 'parents/#charging'],
    ['Teach your rider the basics', 'One card in Lesson 1', 'learn/#1/8'],
    ['Check the battery for recalls', 'The code is on the battery sticker', 'parents/#recall'] ] },
  { id: 'unsure', who: 'Not sure where to start', want: 'Find out what your rider already knows', steps: [
    ['Take the 2-minute readiness check', '7 yes-or-no questions, do it with your rider', 'start/'],
    ['Follow the plan it gives you', 'Only the lessons they need first', 'start/'],
    ['Finish the course for the certificate', 'All six lessons', 'learn/#1'] ] },
];
