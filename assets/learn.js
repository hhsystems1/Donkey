// Ride Smart lesson player: one card per screen, one Next button, one progress bar.
(function () {
  const L = window.LESSONS, $ = s => document.querySelector(s);
  const stage = $('#stage'), segs = $('#segs'), count = $('#count'), next = $('#next'), back = $('#back'), speakBtn = $('#speak'), bar = $('#bar'), top = $('#lpTop');
  const RM = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const store = { get(k, d) { try { return JSON.parse(localStorage.getItem(k)) ?? d; } catch (_) { return d; } }, set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (_) {} } };
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

  // ---- signs, drawn as SVG ----
  const bike = (c, x = 0, y = 0, k = 1) => `<g transform="translate(${x} ${y}) scale(${k})" fill="none" stroke="${c}" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"><circle cx="30" cy="62" r="12"/><circle cx="70" cy="62" r="12"/><path d="M30 62 44 42h18l8 20M44 42l8 20H30M40 36h10M62 42l-2-8h7"/></g>`;
  const SIGNS = {
    stop: `<svg class="sign" viewBox="0 0 100 100" aria-hidden="true"><path d="M30 2h40l28 28v40L70 98H30L2 70V30z" fill="#fff"/><path d="M31.5 6h37L94 31.5v37L68.5 94h-37L6 68.5v-37z" fill="#d7261e"/><text x="50" y="59" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="25" fill="#fff">STOP</text></svg>`,
    yield: `<svg class="sign" viewBox="0 0 100 100" aria-hidden="true"><path d="M4 10h92L50 94z" fill="#d7261e"/><path d="M22 20h56L50 72z" fill="#fff"/><text x="50" y="38" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="13" fill="#d7261e">YIELD</text></svg>`,
    dne: `<svg class="sign" viewBox="0 0 100 100" aria-hidden="true"><circle cx="50" cy="50" r="46" fill="#d7261e"/><rect x="18" y="42" width="64" height="16" rx="2" fill="#fff"/></svg>`,
    ped: `<svg class="sign" viewBox="0 0 100 100" aria-hidden="true"><path d="M50 3 97 50 50 97 3 50z" fill="#f2c200" stroke="#111" stroke-width="3"/><g fill="none" stroke="#111" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"><circle cx="52" cy="27" r="5" fill="#111"/><path d="M50 37 46 56l-8 14M46 56l10 6 4 10M49 42l-10 8M50 42l11 7"/></g></svg>`,
    oneway: `<svg class="sign" viewBox="0 0 100 100" aria-hidden="true"><rect x="2" y="28" width="96" height="44" rx="4" fill="#111"/><path d="M10 44h50v-8l26 14-26 14v-8H10z" fill="#fff"/><text x="36" y="55" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="11" fill="#111">ONE WAY</text></svg>`,
    lane: `<svg class="sign" viewBox="0 0 100 100" aria-hidden="true"><rect x="14" y="2" width="72" height="96" rx="6" fill="#fff" stroke="#111" stroke-width="3"/>${bike('#111', 20, 4, .6)}<text x="50" y="80" text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="15" fill="#111">LANE</text></svg>`,
    sharrow: `<svg class="sign" viewBox="0 0 100 100" aria-hidden="true"><rect width="100" height="100" rx="10" fill="#4a4e4b"/><path d="M30 26 50 12l20 14M30 42l20-14 20 14" fill="none" stroke="#fff" stroke-width="6" stroke-linejoin="round"/>${bike('#fff', 20, 42, .6)}</svg>`,
    full: `<svg class="sign" viewBox="0 0 100 100" aria-hidden="true"><rect x="14" y="2" width="72" height="96" rx="6" fill="#fff" stroke="#111" stroke-width="3"/>${bike('#111', 23, 0, .54)}<text text-anchor="middle" font-family="Arial,sans-serif" font-weight="900" font-size="10.5" fill="#111"><tspan x="50" y="56">BIKES MAY</tspan><tspan x="50" y="70">USE</tspan><tspan x="50" y="84">FULL LANE</tspan></text></svg>`,
  };

  // ---- narrator: Jo's studio recordings where they exist, otherwise the device's most natural voice ----
  const N = (() => {
    let audio = null, gesture = false, on = store.get('rs-sound', true), token = 0, voice = null;
    const pickVoice = () => {
      const vs = (speechSynthesis?.getVoices() || []).filter(v => /^en(-|_)US/i.test(v.lang));
      voice = vs.find(v => /natural|neural|online/i.test(v.name) && /aria|jenny|ava|guy|emma/i.test(v.name)) || vs.find(v => /samantha|ava|allison|google us english/i.test(v.name)) || vs.find(v => v.localService === false) || vs[0] || null;
    };
    if ('speechSynthesis' in window) { pickVoice(); speechSynthesis.onvoiceschanged = pickVoice; }
    addEventListener('pointerdown', () => { gesture = true; }, { capture: true });
    const stop = () => { token++; if (audio) { audio.pause(); audio = null; } speechSynthesis?.cancel(); speakBtn.setAttribute('aria-pressed', 'false'); };
    const sayOne = (text, t) => new Promise(ok => {
      if (!('speechSynthesis' in window) || t !== token) return ok();
      const u = new SpeechSynthesisUtterance(text); if (voice) u.voice = voice; u.rate = .95; u.pitch = 1.05;
      u.onend = u.onerror = () => ok(); speechSynthesis.speak(u);
    });
    // parts: [{text, el}] spoken in order, highlighting el while it is read
    async function play(src, parts) {
      stop(); const t = token; speakBtn.setAttribute('aria-pressed', 'true');
      if (src) {
        audio = new Audio(src);
        const okd = await new Promise(ok => { audio.onended = () => ok(true); audio.onerror = () => ok(false); audio.play().catch(e => ok(e.name === 'NotAllowedError' ? 'blocked' : false)); });
        if (okd === false && t === token) for (const p of parts) { p.el?.classList.add('reading'); await sayOne(p.text, t); p.el?.classList.remove('reading'); }
      } else for (const p of parts) {
        if (t !== token) break;
        p.el?.classList.add('reading'); await sayOne(p.text, t); p.el?.classList.remove('reading');
      }
      if (t === token) speakBtn.setAttribute('aria-pressed', 'false');
    }
    return {
      stop, play,
      auto(src, parts) { if (on && gesture) play(src, parts); },
      get on() { return on; }, toggle() { on = !on; store.set('rs-sound', on); if (!on) stop(); return on; },
    };
  })();
  let parts = () => [];

  // ---- state ----
  let lesson = null, idx = 0, ready = true, dir = 1, res = {}, onNext = null;

  function route() {
    N.stop();
    const m = location.hash.match(/^#(\d)(?:\/(\d+))?$/);
    const l = m && L.find(x => x.n === +m[1]);
    if (!l) return picker();
    if (lesson !== l) { lesson = l; res = {}; }
    const k = Math.min(+(m[2] || 0), l.cards.length - 1);
    dir = k >= idx ? 1 : -1; idx = k; render();
  }
  function go(k) { location.hash = `#${lesson.n}${k ? '/' + k : ''}`; }

  function picker() {
    lesson = null; bar.hidden = true; top.hidden = true; document.title = 'Lessons · Ride Smart';
    const done = store.get('rs-done', []);
    stage.innerHTML = `<div class="card pick-lesson"><a class="icon-btn" href="../index.html" aria-label="Home" style="margin-bottom:24px"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M15 5l-7 7 7 7"/></svg></a><p class="kick">Ride Smart</p><h1>Pick a lesson</h1><ol class="ll" style="margin-top:28px">${L.map(l => `<li><a href="#${l.n}" class="${done.includes(l.n) ? 'done' : ''}"><span class="n">0${l.n}</span><div><h3>${l.title}</h3><p>${l.blurb}</p></div><span class="go"><b>${arrow}</b></span></a></li>`).join('')}</ol></div>`;
  }

  function render() {
    bar.hidden = false; top.hidden = false;
    const c = lesson.cards[idx], total = lesson.cards.length;
    document.title = `${lesson.title} · Ride Smart`;
    segs.innerHTML = lesson.cards.map((_, i) => `<i class="${i < idx ? 'on' : i === idx ? 'now' : ''}"></i>`).join('');
    count.textContent = `Lesson ${lesson.n}/6`;
    back.style.visibility = idx ? 'visible' : 'hidden';
    ready = true; onNext = null; next.textContent = 'Next'; parts = () => [];
    const el = document.createElement('div'); el.className = 'card' + (dir < 0 ? ' back' : '') + (c.warn ? ' warn' : '');
    (TYPES[c.t] || TYPES.learn)(el, c);
    stage.replaceChildren(el);
    if (idx === total - 1 && c.t !== 'done') next.textContent = 'Finish';
    sync();
    N.auto(c.audio, parts());
    el.querySelector('h1,h2')?.setAttribute('tabindex', '-1');
    if (dir) el.querySelector('h1,h2')?.focus({ preventScroll: true });
    scrollTo(0, 0); requestAnimationFrame(() => scrollTo(0, 0));
  }
  const sync = () => { next.disabled = !ready; };
  const setReady = v => { ready = v; sync(); };
  const P = (sel, el) => [...el.querySelectorAll(sel)].map(e => ({ text: e.textContent.trim(), el: e })).filter(x => x.text);
  const head = c => `${c.kick ? `<p class="kick">${esc(c.kick)}</p>` : ''}<h2>${esc(c.title)}</h2>${c.body ? `<p class="body">${esc(c.body)}</p>` : ''}`;
  const pts = (list) => `<ol class="pts">${list.map(([b, s], i) => `<li data-n="${i + 1}"><div><b>${esc(b)}</b><span>${esc(s)}</span></div></li>`).join('')}</ol>`;

  const TYPES = {
    intro(el, c) {
      el.innerHTML = `<div class="c-img"><img src="${lesson.img}" alt="${esc(lesson.alt)}"></div><p class="kick">Lesson ${lesson.n} of 6 · about ${lesson.mins} min</p><h1>${esc(c.title)}</h1><p class="body">${esc(c.body)}</p><button type="button" class="hear-big"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5 6 9H3v6h3l5 4z"/><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13"/></svg>Tap to listen</button>`;
      el.querySelector('.hear-big').addEventListener('click', () => N.play(c.audio, parts()));
      next.textContent = "Let's go"; parts = () => [{ text: c.say || (c.title + '. ' + c.body) }];
    },
    idea(el, c) {
      el.innerHTML = `<div class="idea-pic${c.warn ? ' warn' : ''}">${(window.ICONS || {})[c.ic] || ''}</div><p class="kick">${esc(c.kick || '')}${c.step ? ` · ${c.step}` : ''}</p><h2>${esc(c.title)}</h2><p class="body">${esc(c.line)}</p>`;
      parts = () => P('h2,.body', el);
    },
    learn(el, c) { el.innerHTML = head(c) + pts(c.pts) + (c.tip ? `<p class="tip">${c.tip}</p>` : ''); },
    warn(el, c) { TYPES.learn(el, c); },
    flip(el, c) {
      let seen = 0;
      parts = () => P('h2', el).concat([{ text: 'Tap each sign to hear what it means.' }]);
      el.innerHTML = head(c) + `<div class="tiles">${c.items.map(([k, n], i) => `<button type="button" class="tile" data-i="${i}" aria-expanded="false">${SIGNS[k] || ''}<b>${esc(n)}</b><small hidden></small><span class="hint">Tap to see</span><span class="ck" aria-hidden="true"></span></button>`).join('')}</div><p class="score" id="sc">0 of ${c.items.length} seen</p>`;
      el.querySelectorAll('.tile').forEach(t => t.addEventListener('click', () => {
        const it = c.items[+t.dataset.i], s = t.querySelector('small');
        if (!t.classList.contains('open')) { seen++; t.classList.add('open'); s.textContent = it[2]; s.hidden = false; t.querySelector('.hint').remove(); t.setAttribute('aria-expanded', 'true'); N.on && N.play(null, [{ text: it[1] + '. ' + it[2] }]); el.querySelector('#sc').textContent = seen === c.items.length ? 'All 8. Nice.' : `${seen} of ${c.items.length} seen`; }
      }));
    },
    check(el, c) {
      let n = 0;
      el.innerHTML = head(c) + `<div class="tiles">${c.items.map(([b, s, ic]) => `<button type="button" class="tile pic" aria-pressed="false"><span class="tpic">${(window.ICONS || {})[ic] || ''}</span><b>${esc(b)}</b>${s ? `<small>${esc(s)}</small>` : ''}<span class="ck" aria-hidden="true"></span></button>`).join('')}</div><p class="score" id="sc">0 of ${c.items.length}</p>`;
      parts = () => P('h2,.body', el);
      el.querySelectorAll('.tile').forEach(t => t.addEventListener('click', () => {
        const on = !t.classList.contains('hit'); t.classList.toggle('hit', on); t.setAttribute('aria-pressed', on); n += on ? 1 : -1;
        if (on && N.on) N.play(null, [{ text: t.querySelector('b').textContent }]);
        el.querySelector('#sc').textContent = n === c.items.length ? (c.done || 'All done!') : `${n} of ${c.items.length}`;
        if (n === c.items.length && N.on) setTimeout(() => N.play(null, [{ text: c.done || 'All done!' }]), 700);
      }));
    },
    sort(el, c) {
      let i = 0, right = 0; setReady(false);
      el.innerHTML = head(c) + `<div class="sort"><p class="q" id="sq"></p><div class="row"><button type="button" class="yes" data-v="1">Safe</button><button type="button" class="no" data-v="0">Not safe</button></div><p class="fb" id="sf"></p><div class="pips">${c.items.map(() => '<i></i>').join('')}</div></div>`;
      const q = el.querySelector('#sq'), fb = el.querySelector('#sf'), pips = el.querySelectorAll('.pips i'), btns = el.querySelectorAll('.row button');
      const show = (first) => { q.textContent = c.items[i][0]; fb.textContent = ''; btns.forEach(b => b.disabled = false); if (!first && N.on) N.play(null, [{ text: c.items[i][0] + '. Safe, or not safe?' }]); };
      parts = () => P('h2', el).concat([{ text: c.items[0][0] + '. Safe, or not safe?' }]);
      btns.forEach(b => b.addEventListener('click', () => {
        const [, safe, why] = c.items[i], ok = (b.dataset.v === '1') === safe;
        btns.forEach(x => x.disabled = true); if (ok) right++;
        pips[i].className = ok ? 'ok' : 'bad';
        fb.innerHTML = `<b>${ok ? 'Right!' : safe ? 'That one is safe.' : 'Not safe.'}</b> ${esc(why)}`; if (N.on) N.play(null, [{ text: fb.textContent }]);
        i++;
        if (i < c.items.length) setTimeout(() => show(false), RM ? 900 : 3200);
        else setTimeout(() => { q.textContent = `${right} of ${c.items.length} right.`; fb.textContent = right === c.items.length ? 'You got them all!' : 'Remember: when in doubt, walk it.'; setReady(true); if (N.on) N.play(null, [{ text: q.textContent + ' ' + fb.textContent }]); }, RM ? 900 : 3200);
      }));
      show(true);
    },
    spot(el, c) {
      const need = c.items.filter(x => x[1]).length; let got = 0; setReady(false);
      parts = () => P('h2', el).concat([{ text: 'Tap the five things that could hurt you.' }]);
      el.innerHTML = head(c) + `<div class="tiles">${c.items.map(([n, , , ic], i) => `<button type="button" class="tile pic" data-i="${i}"><span class="tpic">${(window.ICONS || {})[ic] || ''}</span><b>${esc(n)}</b><small hidden></small><span class="ck" aria-hidden="true"></span></button>`).join('')}</div><p class="score" id="sc">0 of ${need} found</p>`;
      el.querySelectorAll('.tile').forEach(t => t.addEventListener('click', () => {
        const [, bad, why] = c.items[+t.dataset.i], s = t.querySelector('small');
        if (t.classList.contains('hit')) return;
        s.textContent = why; s.hidden = false; if (N.on) N.play(null, [{ text: (bad ? 'Danger! ' : 'Not a danger. ') + why }]);
        if (bad) { t.classList.add('hit'); got++; el.querySelector('#sc').textContent = got === need ? 'All 5 spotted.' : `${got} of ${need} found`; if (got === need) setReady(true); }
        else { t.classList.remove('miss'); void t.offsetWidth; t.classList.add('miss'); }
      }));
    },
    quiz(el, c) {
      setReady(false); let tries = 0; const me = idx;
      const qn = lesson.cards.slice(0, idx + 1).filter(x => x.t === 'quiz').length, qt = lesson.cards.filter(x => x.t === 'quiz').length;
      el.innerHTML = `<p class="kick">Quick check · ${qn} of ${qt}</p><h2 style="font-size:clamp(1.7rem,6vw,2.6rem);text-transform:none;font-stretch:108%;line-height:1.08">${esc(c.q)}</h2><div class="opts">${c.o.map((o, i) => `<button type="button" class="opt" data-i="${i}">${esc(o)}</button>`).join('')}</div><p class="why" hidden></p>`;
      const why = el.querySelector('.why');
      parts = () => [{ text: c.q, el: el.querySelector('h2') }, ...[...el.querySelectorAll('.opt')].map((e, i, a) => ({ text: (i === a.length - 1 ? 'or, ' : '') + e.textContent, el: e }))];
      el.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => {
        const i = +b.dataset.i; tries++;
        if (i === c.a) {
          b.classList.add('right'); el.querySelectorAll('.opt').forEach(x => x.disabled = true);
          if (!(me in res)) res[me] = tries === 1;
          why.innerHTML = `<b>${tries === 1 ? 'Yes!' : 'You got it!'}</b> ${esc(c.why)}`; why.hidden = false; setReady(true); if (N.on) N.play(null, [{ text: why.textContent }]);
        } else { if (!(me in res)) res[me] = false; b.classList.add('wrong'); b.disabled = true; why.innerHTML = '<b>Not that one.</b> Try again.'; why.hidden = false; if (N.on) N.play(null, [{ text: 'Not that one. Try again.' }]); }
      }));
    },
    pledge(el, c) {
      const name = store.get('rs-name', '');
      el.innerHTML = `<p class="kick">Last step</p><h2>The Ride Smart pledge</h2><ol class="pledge">${c.lines.map(x => `<li>${esc(x)}</li>`).join('')}</ol>
        <label class="fld" style="margin-top:26px">Your name for the certificate<input id="nm" autocomplete="given-name" maxlength="40" value="${esc(name)}" placeholder="First and last name"></label>
        <div class="cert"><p class="kick">Certificate</p><p class="nm" id="cn">${esc(name) || 'Your name'}</p><p>completed all six Ride Smart e-bike safety lessons and took the pledge.</p></div>`;
      const nm = el.querySelector('#nm'), cn = el.querySelector('#cn');
      nm.addEventListener('input', () => { cn.textContent = nm.value.trim() || 'Your name'; store.set('rs-name', nm.value.trim()); setReady(!!nm.value.trim()); });
      setReady(!!name); next.textContent = 'I take the pledge'; parts = () => [{ text: 'The Ride Smart pledge. Say it with me.' }, ...P('.pledge li', el), { text: 'Type your name for your certificate.' }];
    },
    done(el, c) {
      const done = store.get('rs-done', []); if (!done.includes(lesson.n)) { done.push(lesson.n); store.set('rs-done', done); }
      const nl = L.find(x => x.n === lesson.n + 1);
      const vals = Object.values(res), score = vals.length ? `<p class="body">${vals.filter(Boolean).length} of ${vals.length} right on the first try.</p>` : '';
      if (c.final) {
        const name = store.get('rs-name', 'Ride Smart rider');
        el.innerHTML = `<p class="kick">Course complete</p><h1 class="done-big">You're ride ready.</h1>${score}<div class="cert"><p class="kick">Certificate</p><p class="nm">${esc(name)}</p><p>completed all six Ride Smart e-bike safety lessons and took the pledge. ${new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p></div><div style="display:flex;flex-wrap:wrap;gap:10px;margin-top:18px"><button type="button" class="btn btn-vis" id="dl">Download certificate</button><a class="btn btn-ghost" href="../parents/">Show your parent the gear list</a></div><p class="note" style="margin-top:18px">Grown-ups: when your rider turns 12, a teen e-bike course is a good next step.</p>`;
        el.querySelector('#dl').addEventListener('click', () => certificate(name));
        parts = () => [{ text: 'You did it! You finished Ride Smart. Download your certificate and show a grown-up.' }];
        next.textContent = 'Back to home'; onNext = () => { location.href = '../index.html'; };
      } else {
        el.innerHTML = `<p class="kick">Lesson ${lesson.n} of 6</p><h1 class="done-big">Done.</h1>${score}${nl ? `<a class="done-next" href="#${nl.n}"><div><small>Up next · ${nl.mins} min</small><b>${nl.title}</b></div><span class="icon-btn" style="background:var(--vis)">${arrow}</span></a>` : ''}`;
        parts = () => [{ text: `Nice work! You finished lesson ${lesson.n}.${nl ? ' Next up: ' + nl.title + '.' : ''}` }];
        next.textContent = nl ? `Lesson ${nl.n}` : 'Home'; onNext = () => { nl ? (location.hash = '#' + nl.n) : (location.href = '../index.html'); };
      }
    },
  };

  function certificate(name) {
    const cv = document.createElement('canvas'); cv.width = 1600; cv.height = 1000; const x = cv.getContext('2d');
    x.fillStyle = '#0f1110'; x.fillRect(0, 0, 1600, 1000);
    x.fillStyle = '#d4ff3f'; x.fillRect(80, 80, 12, 840);
    x.font = '700 30px Inter, sans-serif'; x.fillText('RIDE SMART  ·  CERTIFICATE', 140, 160);
    x.fillStyle = '#f3f1ea'; x.font = '900 120px Archivo, Arial Black, sans-serif';
    let fs = 120; while (x.measureText(name.toUpperCase()).width > 1360 && fs > 50) { fs -= 6; x.font = `900 ${fs}px Archivo, Arial Black, sans-serif`; }
    x.fillText(name.toUpperCase(), 140, 470);
    x.font = '500 40px Inter, sans-serif'; x.fillStyle = '#c9c7bf';
    x.fillText('completed all six Ride Smart e-bike safety lessons', 140, 570);
    x.fillText('and took the Ride Smart pledge.', 140, 625);
    x.fillStyle = '#d4ff3f'; x.font = '700 32px Inter, sans-serif';
    x.fillText(new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), 140, 860);
    const a = document.createElement('a'); a.download = 'ride-smart-certificate.png'; a.href = cv.toDataURL('image/png'); a.click();
  }

  next.addEventListener('click', () => {
    if (!ready || !lesson) return;
    if (onNext) return onNext();
    if (idx < lesson.cards.length - 1) go(idx + 1);
  });
  back.addEventListener('click', () => { if (idx) go(idx - 1); });
  speakBtn.addEventListener('click', () => {
    if (speakBtn.getAttribute('aria-pressed') === 'true') return N.stop();
    if (lesson) N.play(lesson.cards[idx].audio, parts());
  });
  const snd = document.getElementById('sound');
  if (snd) { const lab = () => { snd.textContent = N.on ? 'Sound on' : 'Sound off'; snd.setAttribute('aria-pressed', N.on); }; lab(); snd.addEventListener('click', () => { N.toggle(); lab(); }); }
  addEventListener('keydown', e => {
    if (!lesson || e.target.matches('input,textarea')) return;
    if (e.key === 'ArrowRight' && ready) next.click();
    if (e.key === 'ArrowLeft') back.click();
  });
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
  addEventListener('hashchange', route);
  route();
})();
