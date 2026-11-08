// Parent sign-up forms. Posts to /api/ridesmart/lead. Only the parent's details are sent.
(function () {
  const RS = window.RS || { api: '/api/ridesmart' };
  // Fill state dropdowns from the law data.
  document.querySelectorAll('select[data-states]').forEach(sel => {
    Object.keys(window.LAWS || {}).forEach(n => { const o = document.createElement('option'); o.textContent = n; sel.appendChild(o); });
  });
  function bind(f) {
    const msg = f.querySelector('.msg'), btn = f.querySelector('button[type=submit]'), label = btn.textContent;
    f.addEventListener('submit', async e => {
      e.preventDefault(); msg.textContent = ''; msg.classList.remove('err');
      if (!f.checkValidity()) { f.reportValidity(); return; }
      const d = Object.fromEntries(new FormData(f));
      const extra = typeof f.leadExtra === 'function' ? f.leadExtra() : {};
      btn.disabled = true; btn.textContent = 'Sending…';
      try {
        const r = await fetch(RS.api + '/lead', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...d, adult: d.adult === 'on', source: f.dataset.lead, ...extra }) });
        const j = await r.json().catch(() => ({}));
        if (!r.ok) throw new Error(j.error || 'That didn’t send. Please try again in a minute.');
        try { localStorage.setItem('rs-parent', '1'); } catch (_) {}
        const done = f.parentElement.querySelector('.done-box');
        if (done) { f.hidden = true; done.hidden = false; done.querySelectorAll('[data-kid]').forEach(x => x.textContent = d.kid || 'your rider'); done.focus(); }
        else { msg.textContent = 'Sent. Check your inbox.'; btn.hidden = true; }
      } catch (err) { msg.textContent = err.message; msg.classList.add('err'); btn.disabled = false; btn.textContent = label; }
    });
  }
  document.querySelectorAll('form[data-lead]').forEach(bind);
  window.RSForms = bind;
})();
