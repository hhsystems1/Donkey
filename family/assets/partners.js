// Partner form: posts to Netlify Forms without leaving the page.
(function () {
  const f = document.getElementById('partnerForm'); if (!f) return;
  const msg = document.getElementById('partnerMsg');
  f.addEventListener('submit', async e => {
    e.preventDefault(); msg.textContent = '';
    if (!f.checkValidity()) { f.reportValidity(); return; }
    const btn = f.querySelector('button'); btn.disabled = true; btn.textContent = 'Sending…';
    try {
      const r = await fetch(f.getAttribute('action') || location.pathname, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body: new URLSearchParams(new FormData(f)).toString() });
      if (!r.ok) throw 0;
      f.querySelectorAll('.form-grid, button').forEach(x => x.hidden = true); msg.textContent = 'Thanks. We’ll be in touch within two business days.';
    } catch (_) { btn.disabled = false; btn.textContent = 'Get in touch'; msg.textContent = 'That didn’t send. Please try again in a minute.'; }
  });
})();
