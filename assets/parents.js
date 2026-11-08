// Parent tools: gear list, recall check, state laws. Everything runs in the browser; nothing is sent anywhere.
(function () {
  const $ = s => document.getElementById(s);
  const esc = s => String(s || '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const adult = s => String(s).replace(/\s*\(grown-up job\)/gi, '').replace(/grown-ups?/gi, 'an adult');

  // ---------- gear list ----------
  let budget = 'mid';
  document.querySelectorAll('#kitBudget button').forEach(b => b.addEventListener('click', () => {
    budget = b.dataset.b; document.querySelectorAll('#kitBudget button').forEach(x => x.setAttribute('aria-pressed', x === b));
  }));
  const helmetFor = cm => cm < 52 ? ['Youth S', '48–52 cm'] : cm < 54 ? ['Youth M', '52–54 cm'] : cm < 56 ? ['Youth L', '54–56 cm'] : cm < 58 ? ['Adult S/M', '55–58 cm'] : ['Adult M/L', '57–61 cm'];
  const headEst = age => ({ 10: 53.5, 11: 54, 12: 54.5, 13: 55, 14: 55.5, 15: 56 })[age] || 54.5;
  const padSize = age => age <= 11 ? 'Youth M' : age <= 13 ? 'Youth L' : 'Adult S';
  const PRICES = {
    save: { helmet: [45, 70], pads: [20, 35], gloves: [10, 18], lights: [15, 25], bell: [8, 12], vest: [10, 15] },
    mid: { helmet: [70, 110], pads: [30, 50], gloves: [15, 25], lights: [25, 40], bell: [10, 15], vest: [12, 20] },
    best: { helmet: [110, 160], pads: [45, 70], gloves: [20, 35], lights: [40, 60], bell: [12, 18], vest: [15, 25] },
  };
  const money = r => `$${r[0]}–$${r[1]}`;
  $('kitBuild').addEventListener('click', () => {
    const age = +$('kitAge').value, raw = parseFloat($('kitHead').value), measured = !isNaN(raw), cm = measured ? raw : headEst(age);
    const [hs, hr] = helmetFor(cm), P = PRICES[budget];
    const items = [
      ['Helmet, ' + hs, `Fits ${hr}. ${measured ? `Sized from your ${cm} cm measurement.` : `Estimated from age (about ${cm} cm). Measure to confirm.`} CPSC label required; NTA 8776 recommended for e-bikes.${budget === 'best' ? ' Add a MIPS liner.' : ''}`, P.helmet],
      ['Knee and elbow pads, ' + padSize(age), 'Most sets include both. Firm shells, snug straps.', P.pads],
      ['Gloves, ' + (age <= 11 ? 'Youth M' : 'Youth L'), 'Padded palms. Full-finger for cooler weather.', P.gloves],
      ['Lights, white front and red rear', 'USB-rechargeable sets are easiest. Required after dark in many states.', P.lights],
      ['Bell', 'Loud enough to be heard by people walking.', P.bell],
      ['Bright or reflective layer', 'A vest or jacket with reflective strips.', P.vest],
      ['Closed-toe shoes', 'Grippy soles, laces tucked away. Probably already in the closet.', null],
    ];
    const lo = items.reduce((t, i) => t + (i[2] ? i[2][0] : 0), 0), hi = items.reduce((t, i) => t + (i[2] ? i[2][1] : 0), 0);
    $('kitResult').innerHTML = `<ul class="kit">${items.map(([n, s, p]) => `<li><div><b>${esc(n)}</b><small>${esc(s)}</small></div><span class="pr">${p ? money(p) : '—'}</span></li>`).join('')}</ul><div class="kit-total"><span>Estimated total</span><span>$${lo}–$${hi}</span></div><p class="note">Typical U.S. price ranges as of October 2026, not a specific store. Sizes vary by brand; always try the helmet on.</p>`;
    $('kitResult').scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  });

  // ---------- recall check ----------
  const R = window.RECALLS, norm = s => (s || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  const out = (kind, title, html) => { $('rcResult').innerHTML = `<div class="verdict ${kind}"><h4>${esc(title)}</h4>${html}</div>`; };
  const steps = r => `<p><b>The problem:</b> ${esc(adult(r.hazard))}</p><p><b>What to do:</b></p><ol>${r.steps.map(s => `<li>${esc(adult(s))}</li>`).join('')}</ol><p class="src"><a href="${esc(r.url)}" rel="noopener">${esc(r.urlLabel)}</a></p>`;
  $('rcCheck').addEventListener('click', () => {
    const brand = $('rcBrand').value, modelRaw = $('rcModel').value.trim(), model = norm(modelRaw), batt = norm($('rcBattery').value), y = +$('rcYear').value || null;
    if (!brand && !model && !batt) return out('check', 'Add the brand and model first', '<p>Both are printed on the frame, usually on the down tube or near the seat.</p>');
    if (batt) { const r = R.find(r => r.batteryKeys && r.batteryKeys.includes(batt)); if (r) return out('stop', 'Stop: that battery is under a CPSC warning', `<p>Battery ${esc($('rcBattery').value)} matches <b>${esc(r.title)}</b>.</p>${steps(r)}`); }
    let brandHit = null, hit = null, yearOff = false;
    R.forEach(r => {
      const b = brand && brand !== 'other' ? r.brandKeys.some(k => norm(brand).includes(k)) : r.brandKeys.some(k => model.includes(k));
      if (!b) return; brandHit = brandHit || r;
      if (model && r.models.some(m => model.includes(m))) { hit = r; if (r.years && y && !r.years.includes(y)) yearOff = true; }
    });
    if (hit && !yearOff) return out('stop', 'Stop: this bike is on the recall list', `<p>${esc(modelRaw)} matches <b>${esc(hit.title)}</b>. Affected: ${esc(hit.modelNames)}.</p>${steps(hit)}`);
    if (hit) return out('check', 'Same model, different year', `<p>${esc(modelRaw)} matches <b>${esc(hit.title)}</b>, but ${y} is outside the listed years. Model years are easy to mix up; have a dealer check the serial number.</p><p class="src"><a href="${esc(hit.url)}" rel="noopener">${esc(hit.urlLabel)}</a></p>`);
    if (model.includes('como') && !model.includes('sl') && norm(brand).includes('specialized')) return out('clear', 'Good news: the non-SL Como is not part of this recall', `<p>${esc(R[2].nonSlNote || '')}</p>`);
    if (brandHit) return out('check', 'No match for this model, but the brand has a recall', `<p>${esc(brandHit.brand)} has <b>${esc(brandHit.title)}</b>, covering ${esc(brandHit.modelNames)}. Double-check the exact model name on the frame.</p><p class="src"><a href="${esc(brandHit.url)}" rel="noopener">${esc(brandHit.urlLabel)}</a></p>`);
    out('clear', 'Not on this list', `<p>${modelRaw ? esc(modelRaw) + ' doesn\'t' : 'This bike doesn\'t'} match any of the 6 recalls and warnings checked October 22, 2026. That's good news, not a guarantee. Confirm on <a href="https://www.cpsc.gov/search?search_api_fulltext=e-bike" rel="noopener">CPSC.gov</a>.</p>`);
  });

  // ---------- state laws ----------
  const LAWS = window.LAWS, sel = $('lawState');
  Object.keys(LAWS).forEach(n => { const o = document.createElement('option'); o.textContent = n; sel.appendChild(o); });
  sel.addEventListener('change', () => {
    const L = LAWS[sel.value];
    if (!L) { $('lawResult').innerHTML = ''; return; }
    $('lawResult').innerHTML = `<dl>${[['Class system', L.cls], ['Minimum age', L.age], ['Helmets', L.helmet], ['Where they can ride', L.where], ['License and registration', L.dl]].map(([t, d]) => `<div><dt>${t}</dt><dd>${esc(d)}</dd></div>`).join('')}</dl>${L.advisory ? `<p class="note">Official source: <a href="${esc(L.advisory)}" rel="noopener">state advisory on e-bike rules</a> (bikes over 750 watts are e-motos, not e-bikes).</p>` : ''}<p class="note">Your town, county, school district or HOA can add rules on top of state law, like sidewalk bans or path limits.</p>`;
  });

  // reveal
  document.querySelectorAll('.rv').forEach(e => e.classList.add('in'));
})();
