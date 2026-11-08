// Certificate order page. The course sends riders here with #n=Name&d=YYYY-MM-DD (the hash never reaches the server).
(function () {
  const RS = window.RS || { api: '/api/ridesmart', price: '$12' };
  const h = new URLSearchParams(location.hash.slice(1));
  const f = document.getElementById('orderForm'), nm = document.getElementById('kidName'), dt = document.getElementById('doneDate');
  const mockName = document.getElementById('mockName'), mockDate = document.getElementById('mockDate');
  const fmt = v => { const d = v ? new Date(v + 'T12:00:00') : null; return d && !isNaN(d) ? d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).toUpperCase() : 'COMPLETION DATE'; };
  nm.value = h.get('n') || ''; dt.value = /^\d{4}-\d{2}-\d{2}$/.test(h.get('d') || '') ? h.get('d') : new Date().toISOString().slice(0, 10);
  const sync = () => { mockName.textContent = nm.value.trim() || 'Your rider'; mockDate.textContent = fmt(dt.value); };
  nm.addEventListener('input', sync); dt.addEventListener('input', sync); sync();
  if (h.get('n') || h.get('d')) history.replaceState(null, '', location.pathname + '#order');
  const msg = f.querySelector('.msg'), btn = document.getElementById('buyBtn'), label = btn.textContent;
  f.addEventListener('submit', async e => {
    e.preventDefault(); msg.textContent = ''; msg.classList.remove('err');
    if (!f.checkValidity()) { f.reportValidity(); return; }
    const d = Object.fromEntries(new FormData(f));
    btn.disabled = true; btn.textContent = 'One moment…';
    try {
      const r = await fetch(RS.api + '/order', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...d, adult: d.adult === 'on' }) });
      const j = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(j.error || 'That didn’t go through. Please try again in a minute.');
      if (j.preview) { msg.textContent = 'Payments aren’t connected yet, so this preview opens the certificate directly.'; setTimeout(() => location.href = j.redirect, 1200); }
      else location.href = j.redirect;
    } catch (err) { msg.textContent = err.message; msg.classList.add('err'); btn.disabled = false; btn.textContent = label; }
  });
})();
