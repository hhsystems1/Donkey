// Readiness check: like a placement test. One question per screen, then a plan with only what's missing.
(function () {
  const Q = [
    { q: 'Does your rider have a helmet that fits?', why: 'Level on the forehead, straps in a V under each ear, snug buckle.', solid: 'Helmet fit', fix: ['Fit the helmet together', 'Lesson 1 · the three helmet checks', '../learn/#1/1'], fix2: ['Pick the right helmet', 'If the one you have doesn’t fit', '../parents/#helmet'] },
    { q: 'Does your rider know what class their e-bike is?', why: 'Class 1, 2 or 3 decides where they can ride and the age rules.', solid: 'E-bike class', fix: ['Learn the three e-bike classes', 'Lesson 3 · 2 min', '../learn/#3/5'] },
    { q: 'Can they show you the hand signals for left, right and stop?', why: 'Drivers can’t read their mind. Signals tell them.', solid: 'Hand signals', fix: ['Practice hand signals', 'Lesson 3 · 1 min', '../learn/#3/10'] },
    { q: 'Do they know what to do at a stop sign and a yield sign?', why: 'Full stop and look left, right, left. Yield means others go first.', solid: 'Signs', fix: ['Learn the signs', 'Lesson 2 · 5 min', '../learn/#2'] },
    { q: 'Do you know if e-bikes are allowed on sidewalks where you live?', why: 'Many towns don’t allow it. Your state sets age and helmet rules.', solid: 'Local rules', fix: ['Look up your state’s rules', 'For you · 1 min', '../parents/#laws'], fix2: ['Sidewalks and crossings', 'Lesson 4 · 4 min', '../learn/#4'] },
    { q: 'Do you have a safe charging routine?', why: 'The bike’s own charger, someone awake nearby, a hard floor, not overnight.', solid: 'Charging', fix: ['Set up a charging routine', 'For you · 2 min', '../parents/#charging'] },
    { q: 'Do they know what white lights on the back of a car mean?', why: 'It’s backing up. Parking lots are one of the trickiest places to ride.', solid: 'Parking lots', fix: ['Parking lot smarts', 'Lesson 5 · 4 min', '../learn/#5'] },
  ];
  const stage = document.getElementById('stage'), segs = document.getElementById('segs'), count = document.getElementById('count');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const ans = [];
  function bar(i) { segs.innerHTML = Q.map((_, k) => `<i class="${k < i ? 'on' : k === i ? 'now' : ''}"></i>`).join(''); count.textContent = i < Q.length ? `${i + 1} of ${Q.length}` : 'Done'; }
  function ask(i) {
    bar(i);
    if (i === 0 && !ans.length) {
      stage.innerHTML = `<div class="card"><p class="kick">Readiness check · 2 minutes</p><h1>What does your rider already know?</h1><p class="body">Seven yes-or-no questions. Sit down with your rider and answer together. You’ll get a plan with only the lessons they need first.</p><div class="rc-opts"><button type="button" id="go">Let’s start</button></div></div>`;
      stage.querySelector('#go').onclick = () => { ans.length = 0; askQ(0); };
      return;
    }
    askQ(i);
  }
  function askQ(i) {
    if (i >= Q.length) return result();
    bar(i); const q = Q[i];
    stage.innerHTML = `<div class="card"><p class="kick">Question ${i + 1} of ${Q.length}</p><p class="rc-q">${esc(q.q)}</p><p class="rc-why">${esc(q.why)}</p><div class="rc-opts"><button type="button" data-v="yes">Yes</button><button type="button" data-v="unsure">Not sure</button><button type="button" data-v="no">No</button></div>${i ? '<button type="button" class="btn btn-ghost" id="bk" style="margin-top:18px;min-height:46px">Back</button>' : ''}</div>`;
    stage.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { ans[i] = b.dataset.v; askQ(i + 1); });
    const bk = stage.querySelector('#bk'); if (bk) bk.onclick = () => askQ(i - 1);
    scrollTo(0, 0);
  }
  function result() {
    bar(Q.length);
    const gaps = Q.filter((_, i) => ans[i] !== 'yes'), solid = Q.filter((_, i) => ans[i] === 'yes');
    const steps = gaps.flatMap(q => [q.fix, q.fix2].filter(Boolean));
    steps.push(['Finish the whole course', 'All six lessons, then the certificate', '../learn/#1']);
    const pct = Math.round(solid.length / Q.length * 100);
    const head = gaps.length === 0 ? 'Your rider is in great shape.' : gaps.length <= 2 ? 'Almost there.' : 'Here’s where to start.';
    try { localStorage.setItem('rs-path', 'unsure'); localStorage.setItem('rs-check', JSON.stringify(ans)); } catch (_) {}
    stage.innerHTML = `<div class="card rc-res"><p class="kick">Your results</p><h1>${head}</h1><p class="body">${solid.length} of ${Q.length} covered. ${gaps.length ? 'Work through the steps below, in this order.' : 'Do the full course together to lock it in and get the certificate.'}</p><div class="meter" role="img" aria-label="${pct} percent ready"><i style="width:${pct}%"></i></div>
      ${solid.length ? `<p class="kick" style="margin-top:22px">Already solid</p><ul class="solid">${solid.map(q => `<li>${esc(q.solid)}</li>`).join('')}</ul>` : ''}
      <div class="plan"><p class="kick"><i></i>Your plan</p><ol class="plan-steps">${steps.map(([t, d, h], i) => `<li><a href="${h}"><span class="sn">${i + 1}</span><div><b>${esc(t)}</b><small>${esc(d)}</small></div><span class="go">${i === 0 ? 'Start' : 'Go'} ${arrow}</span></a></li>`).join('')}</ol></div>
      <button type="button" class="btn btn-ghost" id="again" style="margin-top:18px">Take it again</button></div>`;
    stage.querySelector('#again').onclick = () => { ans.length = 0; askQ(0); };
    scrollTo(0, 0);
  }
  ask(0);
})();
