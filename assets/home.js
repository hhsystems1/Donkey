// Home: lesson list with saved progress, scroll reveals.
(function () {
  let done = [];
  try { done = JSON.parse(localStorage.getItem('rs-done') || '[]'); } catch (_) {}
  const arrow = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const check = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12.5 4.5 4.5L19 7.5"/></svg>';
  const list = document.getElementById('lessonList');
  if (list) list.innerHTML = window.LESSONS.map((l, i) => {
    const d = done.includes(l.n);
    return `<li class="rv" style="--rd:${i * 60}ms"><a href="/learn/#${l.n}" class="${d ? 'done' : ''}"><span class="n">0${l.n}</span><div><h3>${l.title}</h3><p>${l.blurb}</p></div><span class="go"><span>${d ? 'Done' : l.mins + ' min'}</span><b>${d ? check : arrow}</b></span></a></li>`;
  }).join('');
  if (done.length && done.length < 6) {
    const next = window.LESSONS.find(l => !done.includes(l.n));
    document.querySelectorAll('a[href="/learn/#1"]').forEach(a => { a.href = '/learn/#' + next.n; if (/Start lesson 1/.test(a.textContent)) a.firstChild.textContent = 'Keep going: lesson ' + next.n + ' '; });
  }
  const els = document.querySelectorAll('.rv');
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) { els.forEach(e => e.classList.add('in')); return; }
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
  els.forEach(e => io.observe(e));
})();
