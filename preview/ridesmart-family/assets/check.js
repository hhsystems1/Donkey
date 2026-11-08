// Readiness check (lead magnet): rider age and state, seven questions, a plan, then an optional email for the full plan.
(function () {
  const C = (window.RS && window.RS.course) ? '../' + window.RS.course : '../../ridesmart/';
  const Q = [
    { q: 'Does your rider have a helmet that fits?', why: 'Level on the forehead, straps in a V under each ear, snug buckle.', solid: 'Helmet fit', fix: ['Fit the helmet together', 'Lesson 1 · the three helmet checks', C + 'learn/#1/1'], fix2: ['Pick the right helmet', 'If the one you have doesn’t fit', '../gear/#helmet'] },
    { q: 'Does your rider know what class their e-bike is?', why: 'Class 1, 2 or 3 decides where they can ride and the age rules.', solid: 'E-bike class', fix: ['Learn the three e-bike classes', 'Lesson 3 · 2 min', C + 'learn/#3/5'] },
    { q: 'Can they show you the hand signals for left, right and stop?', why: 'Drivers can’t read their mind. Signals tell them.', solid: 'Hand signals', fix: ['Practice hand signals', 'Lesson 3 · 1 min', C + 'learn/#3/10'] },
    { q: 'Do they know what to do at a stop sign and a yield sign?', why: 'Full stop and look left, right, left. Yield means others go first.', solid: 'Signs', fix: ['Learn the signs', 'Lesson 2 · 5 min', C + 'learn/#2'] },
    { q: 'Do you know if e-bikes are allowed on sidewalks where you live?', why: 'Many towns don’t allow it. Your state sets age and helmet rules.', solid: 'Local rules', fix: ['Look up your state’s rules', 'For you · 1 min', '../gear/#laws'], fix2: ['Sidewalks and crossings', 'Lesson 4 · 4 min', C + 'learn/#4'] },
    { q: 'Do you have a safe charging routine?', why: 'The bike’s own charger, someone awake nearby, a hard floor, not overnight.', solid: 'Charging', fix: ['Set up a charging routine', 'For you · 2 min', '../gear/#charging'] },
    { q: 'Do they know what white lights on the back of a car mean?', why: 'It’s backing up. Parking lots are one of the trickiest places to ride.', solid: 'Parking lots', fix: ['Parking lot smarts', 'Lesson 5 · 4 min', C + 'learn/#5'] },
  ];
  const stage = document.getElementById('stage'), segs = document.getElementById('segs'), count = document.getElementById('count');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const ans = [], who = { age: '', state: '' };
  function bar(i) { segs.innerHTML = Q.map((_, k) => `<i class="${k < i ? 'on' : k === i ? 'now' : ''}"></i>`).join(''); count.textContent = i < Q.length ? `${i + 1} of ${Q.length}` : 'Done'; }
  function ask(i) {
    bar(i);
    if (i === 0) {
      const states = Object.keys(window.LAWS || {}).map(n => `<option${n === who.state ? ' selected' : ''}>${esc(n)}</option>`).join('');
      const ages = ['6 or under', '7', '8', '9', '10', '11', '12', '13+'].map(a => `<option${a === who.age ? ' selected' : ''}>${a}</option>`).join('');
      stage.innerHTML = `<div class="card"><p class="kick">Readiness check · 2 minutes</p><h1>Is your rider ready?</h1><p class="body">Seven yes-or-no questions. Sit down with your rider and answer together. You’ll get a plan with only what they’re missing, and your state’s e-bike rules.</p>
        <div class="form-grid" style="margin-top:24px;max-width:520px"><label class="fld">Rider’s age<select id="qAge"><option value="">Choose…</option>${ages}</select></label><label class="fld">Your state<select id="qState"><option value="">Choose…</option>${states}</select></label></div>
        <div class="rc-opts"><button type="button" id="go">Let’s start</button></div></div>`;
      stage.querySelector('#go').onclick = () => { who.age = stage.querySelector('#qAge').value; who.state = stage.querySelector('#qState').value; ans.length = 0; askQ(0); };
      return;
    }
    askQ(i);
  }
  function askQ(i) {
    if (i >= Q.length) return result();
    bar(i); const q = Q[i];
    stage.innerHTML = `<div class="card"><p class="kick">Question ${i + 1} of ${Q.length}</p><p class="rc-q">${esc(q.q)}</p><p class="rc-why">${esc(q.why)}</p><div class="rc-opts"><button type="button" data-v="yes">Yes</button><button type="button" data-v="unsure">Not sure</button><button type="button" data-v="no">No</button></div><button type="button" class="btn btn-ghost" id="bk" style="margin-top:18px;min-height:46px">Back</button></div>`;
    stage.querySelectorAll('[data-v]').forEach(b => b.onclick = () => { ans[i] = b.dataset.v; askQ(i + 1); });
    stage.querySelector('#bk').onclick = () => i ? askQ(i - 1) : ask(0);
    scrollTo(0, 0);
  }
  function result() {
    bar(Q.length);
    const gaps = Q.filter((_, i) => ans[i] !== 'yes'), solid = Q.filter((_, i) => ans[i] === 'yes');
    const steps = gaps.flatMap(q => [q.fix, q.fix2].filter(Boolean));
    steps.push(['Finish the whole course', 'All six lessons, then the certificate', C + 'learn/#1']);
    const pct = Math.round(solid.length / Q.length * 100);
    const L = (window.LAWS || {})[who.state];
    const law = L ? `<div class="why" style="margin-top:22px"><p class="kick" style="margin-bottom:8px">${esc(who.state)} e-bike rules</p><p><b>Age:</b> ${esc(L.age)}</p><p><b>Helmets:</b> ${esc(L.helmet)}</p><p><b>Where to ride:</b> ${esc(L.where)}</p><p style="margin-top:8px;font-size:14px;color:var(--mute)">General information, not legal advice. Your town may have stricter rules.</p></div>` : '';
    const young = who.age === '6 or under', older = who.age === '13+';
    const ageNote = young ? `<p class="body" style="margin-top:18px"><b>A note on age:</b> most e-bikes aren’t made for riders this young. A regular pedal bike or a low-speed electric balance bike is a better start. The lessons still help.</p>` : older ? `<p class="body" style="margin-top:18px"><b>A note on age:</b> Ride Smart is written for 7 to 12. Your rider can still use it as a quick refresher.</p>` : '';
    const head = gaps.length === 0 ? 'Your rider is in great shape.' : gaps.length <= 2 ? 'Almost there.' : 'Here’s where to start.';
    
    stage.innerHTML = `<div class="card rc-res"><p class="kick">Your results</p><h1>${head}</h1><p class="body">${solid.length} of ${Q.length} covered. ${gaps.length ? 'Work through the steps below, in this order.' : 'Do the full course together to lock it in and get the certificate.'}</p><div class="meter" role="img" aria-label="${pct} percent ready"><i style="width:${pct}%"></i></div>
      ${solid.length ? `<p class="kick" style="margin-top:22px">Already solid</p><ul class="solid">${solid.map(q => `<li>${esc(q.solid)}</li>`).join('')}</ul>` : ''}
      <div class="plan"><p class="kick"><i></i>Your plan</p><ol class="plan-steps">${steps.map(([t, d, h], i) => `<li><a href="${h}"><span class="sn">${i + 1}</span><div><b>${esc(t)}</b><small>${esc(d)}</small></div><span class="go">${i === 0 ? 'Start' : 'Go'} ${arrow}</span></a></li>`).join('')}</ol></div>
      ${ageNote}${law}
      <form class="signup" id="planForm" style="margin-top:26px;background:var(--paper2)" novalidate>
        <h3>Email me this plan</h3>
        <p style="color:var(--mute);font-size:15.5px">Plus your state’s rules, a printable pre-ride check card, and the course link to hand your rider.</p>
        <div class="form-grid"><label class="fld">Your email<input name="email" type="email" autocomplete="email" required></label><label class="fld">Rider’s first name <small>(optional)</small><input name="kid" autocomplete="off" maxlength="24"></label></div>
        <label class="check"><input type="checkbox" name="adult" required><span>I’m the parent or guardian, and I’m 18 or older.</span></label>
        <p class="sr"><label>Leave empty <input name="hp" tabindex="-1" autocomplete="off"></label></p>
        <button class="btn btn-ink" type="submit">Email me the plan</button>
        <p class="msg" role="status"></p>
        <p class="note" style="margin-top:0">A few short emails on helmets, pads and picking a bike follow. Unsubscribe anytime. <a href="../privacy/">Privacy</a></p>
      </form>
      <div class="signup done-box" hidden tabindex="-1" style="margin-top:26px;background:var(--paper2)"><p class="kick">Sent</p><h3>Check your inbox.</h3><p>Ready to start? Hand this to your rider:</p><a class="btn btn-ink" href="../go/">Open the course</a></div>
      <button type="button" class="btn btn-ghost" id="again" style="margin-top:18px">Take it again</button></div>`;
    const f = stage.querySelector('#planForm');
    f.dataset.lead = 'quiz';
    f.leadExtra = () => ({ score: solid.length, gaps: gaps.map(q => q.solid), age: who.age, state: who.state });
    window.RSForms && window.RSForms(f);
    stage.querySelector('#again').onclick = () => { ans.length = 0; askQ(0); };
    scrollTo(0, 0);
  }
  ask(0);
})();
