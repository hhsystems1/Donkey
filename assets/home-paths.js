// Home page path chooser: pick what brings you here, get a 3-step plan with buttons.
(function () {
  const box = document.getElementById('paths'); if (!box) return;
  const P = window.PATHS, esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const store = { get(k) { try { return localStorage.getItem(k); } catch (_) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (_) {} } };
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const list = box.querySelector('.choices'), plan = box.querySelector('.plan');
  list.innerHTML = P.map(p => `<li><button type="button" class="choice" data-id="${p.id}" aria-pressed="false"><b>${esc(p.who)}</b><span>${esc(p.want)}</span><i aria-hidden="true">${arrow}</i></button></li>`).join('');
  function show(id, scroll) {
    const p = P.find(x => x.id === id); if (!p) return;
    store.set('rs-path', id);
    list.querySelectorAll('.choice').forEach(b => b.setAttribute('aria-pressed', b.dataset.id === id));
    plan.innerHTML = `<p class="kick"><i></i>Your plan</p><h3>${esc(p.want)}</h3><ol class="plan-steps">${p.steps.map(([t, d, h], i) => `<li><a href="${h}"><span class="sn">${i + 1}</span><div><b>${esc(t)}</b><small>${esc(d)}</small></div><span class="go">${i === 0 ? 'Start' : 'Go'} ${arrow}</span></a></li>`).join('')}</ol>${p.note ? `<p class="plan-note">${esc(p.note)}</p>` : ''}`;
    plan.hidden = false; plan.classList.remove('in'); void plan.offsetWidth; plan.classList.add('in');
    if (scroll) plan.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'nearest' });
  }
  list.addEventListener('click', e => { const b = e.target.closest('.choice'); if (b) show(b.dataset.id, true); });
  const saved = store.get('rs-path'); if (saved) show(saved, false);
})();
