(function () {
  'use strict';
  var lesson = document.querySelector('.lesson[data-lesson="0"]');
  var body = lesson.querySelector('.lesson-body');
  var data = window.RIDE_GUIDED_STEPS;
  if (!data || !lesson || !body) return;
  var children = Array.from(body.children);
  var video = body.querySelector('.vlaunch');
  var grids2 = Array.from(body.querySelectorAll(':scope > .grid2'));
  var grids3 = Array.from(body.querySelectorAll(':scope > .grid3'));
  var fit = Array.from(grids3[0].children);
  var bikeGear = Array.from(grids3[1].children);
  var mechanical = Array.from(grids2[1].children);
  var dress = document.getElementById('dressGame');
  var checklist = document.getElementById('gearGrid');
  var score = document.getElementById('gearScore');
  var quiz = body.querySelector('.quiz');
  var questions = Array.from(quiz.querySelectorAll('.q'));
  var originalNext = body.querySelector('[data-next]');
  var archive = document.createElement('div');
  archive.hidden = true;
  archive.id = 'guided-original';
  children.forEach(function (child) { archive.appendChild(child); });
  body.appendChild(archive);
  var stage = document.createElement('div');
  stage.className = 'guided-stage';
  var top = document.createElement('div');
  top.className = 'guided-top';
  top.innerHTML = '<div><span>Lesson 1 of 6 · Gear up</span><strong id="guidedStepCount"></strong></div><progress id="guidedProgress" max="15" value="1" aria-label="Lesson 1 step progress"></progress>';
  var panes = [];
  data.forEach(function (step) {
    var pane = document.createElement('section');
    pane.className = 'guided-pane';
    pane.id = 'guided-' + step.id;
    pane.hidden = true;
    var heading = document.createElement('h2');
    heading.id = 'guided-title-' + step.index;
    heading.tabIndex = -1;
    heading.textContent = step.title;
    pane.setAttribute('aria-labelledby', heading.id);
    var intro = document.createElement('p');
    intro.className = 'guided-intro';
    intro.textContent = step.intro;
    pane.append(heading, intro);
    var content = document.createElement('div');
    content.className = 'guided-content';
    pane.appendChild(content);
    stage.appendChild(pane);
    panes.push({ pane: pane, content: content, heading: heading });
  });
  function add(i, node) { if (node) panes[i].content.appendChild(node); }
  function html(i, markup) { panes[i].content.insertAdjacentHTML('beforeend', markup); }
  function detail(i, title, markup) {
    var details = document.createElement('details');
    details.className = 'guided-details';
    var summary = document.createElement('summary'); summary.textContent = title;
    details.appendChild(summary);
    var copy = document.createElement('div'); copy.innerHTML = markup;
    details.appendChild(copy); add(i, details);
  }
  html(0, '<div class="guided-welcome"><img src="/assets/badge-0.webp" alt="" width="110" height="110"><p>You can practice without a bike.<br>For a real ride, do the checks with a grown-up.</p></div>');
  add(0, video);
  if (video) { video.querySelector('small').textContent = '6 short steps with Maya · about 37 seconds · optional video'; }
  html(1, '<div class="guided-label-check"><img src="/course/media/a899b4dc0ec435e7.jpg" alt="An adult helps a child check their helmet fit"><div><strong>Two things to check</strong><p>A certification label for your riding activity.</p><p>A snug fit based on your actual head measurement.</p></div></div>');
  detail(1, 'Tell me more: helmet labels', '<p>In the U.S., bicycle helmets must carry a label certifying compliance with the CPSC bicycle-helmet standard. Some models also carry NTA 8776, an e-bike helmet standard. A label does not guarantee protection in every crash or make a poorly fitting helmet suitable.</p><p>Ask a grown-up or bike shop to help choose the correct helmet. Replace a helmet after a crash according to its manufacturer’s instructions.</p><a href="https://www.cpsc.gov/FAQ/Bicycle-Helmets" target="_blank" rel="noopener">CPSC helmet information ↗</a>');
  fit.forEach(function (card, i) { var h = card.querySelector('h3'); if (h) h.hidden = true; add(i + 2, card); });
  detail(4, 'Tell me more: check the fit', '<p>Measure the head, try on the helmet, and adjust it with a grown-up. It should sit level and snugly, with straps in a V near the ears and a snug chin strap.</p><a href="https://www.nhtsa.gov/document/fitting-your-bike-helmet" target="_blank" rel="noopener">NHTSA helmet-fitting guide ↗</a>');
  add(5, dress);
  detail(5, 'Tell me more: your everyday gear', '<p>Knee and elbow pads, gloves, closed-toe grippy shoes, and bright clothing help make up your riding kit. Choose the right size and follow each product’s instructions.</p>');
  html(6, '<div class="guided-check-list"><p><strong>Light up.</strong> White at the front. Red at the back.</p><p><strong>Reflect.</strong> Keep the bike’s reflectors clean and in place.</p><p><strong>Be heard.</strong> Check that the bell works.</p></div>');
  detail(6, 'Tell me more: lights and signals', '<p>Use lights when visibility is poor, and follow local rules. Reflectors work with lights; they do not replace them. Before passing, slow down and give a friendly audible warning.</p>');
  add(7, mechanical[0]);
  add(8, mechanical[1]);
  add(9, checklist); add(9, score);
  // These are practice selections, not a claim that a real bicycle was inspected.
  checklist.setAttribute('aria-label', 'Practice pre-ride checklist');
  questions.forEach(function (q, i) { add(10 + i, q); });
  var helmetAnswer = questions[2].querySelector('[data-correct="1"]');
  var answerSpeaker = helmetAnswer.querySelector('.opt-listen');
  helmetAnswer.childNodes.forEach(function (node) { if (node.nodeType === 3) node.textContent = ''; });
  helmetAnswer.insertBefore(document.createTextNode('Check the certification label inside with a grown-up'), answerSpeaker);
  var helmetFeedback = questions[2].querySelector('.feedback');
  helmetFeedback.setAttribute('data-good', 'Correct! Check the certification label, the intended riding activity, and the fit with a grown-up.');
  helmetFeedback.setAttribute('data-bad', 'Try again. Color and price do not show certification. Check the label inside.');
  questions[0].querySelector('.feedback').setAttribute('data-good', 'Yes! Check your brakes and helmet before every ride, even a short one.');
  questions[3].querySelector('.feedback').setAttribute('data-good', 'Correct. Use the manufacturer-approved charger, with a grown-up nearby. Never charge while everyone sleeps.');
  html(14, '<div class="guided-success"><span aria-hidden="true">✓</span><p>Helmet fit. Riding gear. Pre-ride checks.<br>You practiced all three.</p></div><p class="guided-small">You can review any step before continuing.</p>');
  add(14, quiz.querySelector('[data-score]'));
  var footer = document.createElement('div');
  footer.className = 'guided-nav';
  footer.innerHTML = '<p id="guidedHint" role="status" aria-live="polite"></p><div><button type="button" id="guidedBack">← Back</button><button type="button" id="guidedNext">Next step →</button></div>';
  body.append(top, stage, footer);
  lesson.classList.add('guided-ready');
  var position = 0, maxVisited = 0;
  try { var saved = JSON.parse(localStorage.getItem('ride-smart-lesson1-step-v1') || 'null'); if (saved && Number.isInteger(saved.step)) position = Math.min(10, Math.max(0, saved.step)); } catch (e) {}
  maxVisited = position;
  var next = document.getElementById('guidedNext');
  var back = document.getElementById('guidedBack');
  var hint = document.getElementById('guidedHint');
  var count = document.getElementById('guidedStepCount');
  var progress = document.getElementById('guidedProgress');
  function allCorrect() { return questions.every(function (q) { return q.getAttribute('data-right') === '1'; }); }
  function gate() {
    var allowed = true, message = '';
    if (position === 5) { var n = dress.querySelectorAll('.dress-btn.on').length; allowed = n === 6; message = allowed ? 'Maya is ready. Nice work!' : 'Find all six pieces of gear. ' + n + ' of 6 selected.'; }
    if (position === 9) { var checked = checklist.querySelectorAll('.gear-btn.checked').length; allowed = checked === 6; message = allowed ? 'Practice check complete. Do the real checks with a grown-up before riding.' : 'Tap all six things you would check. ' + checked + ' of 6 selected.'; score.textContent = 'Practice checklist: ' + checked + ' / 6'; }
    if (position >= 10 && position <= 13) { var q = questions[position - 10]; allowed = q.getAttribute('data-right') === '1'; message = allowed ? 'You got it! Continue when you’re ready.' : (q.getAttribute('data-done') === '1' ? 'Try another answer. You can do this.' : 'Choose an answer to continue.'); }
    if (position === 14) { allowed = allCorrect(); message = allowed ? 'Lesson 1 is ready to complete.' : 'Review the four questions before completing this lesson.'; }
    next.disabled = !allowed;
    hint.textContent = message;
    return allowed;
  }
  function outline() {
    var select = document.getElementById('chapterJump');
    select.replaceChildren();
    data.forEach(function (s, i) { var option = new Option((i + 1) + '. ' + s.title, String(i)); option.disabled = i > maxVisited; select.add(option); });
    select.value = String(position);
  }
  function render(focus) {
    stopNarration(); stopSpeak();
    panes.forEach(function (p, i) { p.pane.hidden = i !== position; });
    count.textContent = 'Step ' + (position + 1) + ' of ' + data.length;
    progress.value = position + 1;
    back.disabled = position === 0;
    next.textContent = position === 14 ? 'Complete lesson →' : position === 0 ? 'Let’s begin →' : 'Next step →';
    maxVisited = Math.max(maxVisited, position);
    outline(); gate();
    try { localStorage.setItem('ride-smart-lesson1-step-v1', JSON.stringify({ step: position })); } catch (e) {}
    if (focus) { panes[position].heading.focus({ preventScroll: true }); lesson.scrollIntoView({ block: 'start', behavior: 'auto' }); }
  }
  next.addEventListener('click', function () { if (!gate()) return; if (position === 14) { originalNext.click(); return; } position++; render(true); });
  back.addEventListener('click', function () { if (position > 0) { position--; render(true); } });
  stage.addEventListener('click', function () { setTimeout(gate, 0); }, true);
  document.getElementById('chapterJump').addEventListener('change', function (e) { if (document.body.classList.contains('guided-mode')) { var i = Number(e.target.value); if (Number.isInteger(i) && i <= maxVisited) { position = i; render(true); } } });
  var readButton = document.getElementById('abReadLesson');
  readButton.addEventListener('click', function (e) {
    if (!document.body.classList.contains('guided-mode')) return;
    e.preventDefault(); e.stopImmediatePropagation();
    var clips = window.GUIDED_NARRATION || {};
    if (clips[position]) { LESSON_NARRATION.guided = clips[position]; playNarration('guided', data[position].voice, readButton); }
    else speak(data[position].voice, readButton);
  }, true);
  function syncMode() {
    var guided = current === 0 && !document.body.classList.contains('family-view');
    document.body.classList.toggle('guided-mode', guided);
    if (guided) { outline(); readButton.lastChild.textContent = ' Hear this step'; }
    else { readButton.lastChild.textContent = ' Hear This Lesson'; }
  }
  var baseShow = showLesson;
  showLesson = function (i) { baseShow(i); history.replaceState(null, '', '#lesson-' + (i + 1)); syncMode(); if (i === 0) render(true); };
  document.getElementById('familyTab').addEventListener('click', syncMode);
  document.getElementById('learnTab').addEventListener('click', syncMode);
  document.querySelectorAll('a[href^="#"]').forEach(function (a) { a.addEventListener('click', function () { queueMicrotask(syncMode); }); });
  var reset = document.querySelector('.reset-progress');
  if (reset) reset.addEventListener('click', function () { if (!done[0] && current === 0 && reset.textContent === 'Progress reset') { position = 0; maxVisited = 0; render(true); } });
  render(false); syncMode();
  document.getElementById('kitBuild').addEventListener('click', function () {
    var result = document.getElementById('kitResult');
    if (!result.querySelector('.kit-guide-link')) result.insertAdjacentHTML('beforeend', '<p class="kit-guide-link"><a href="/gear/">Compare brands in the parent Gear Guide ↗</a></p>');
  });
})();
