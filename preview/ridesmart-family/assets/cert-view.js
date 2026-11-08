// Certificate view (owner link from the email) and public verify (ID only).
(function () {
  const RS = window.RS || { api: '/api/ridesmart' };
  const q = new URLSearchParams(location.search), id = q.get('id') || '', t = q.get('t') || '';
  const view = document.getElementById('view'), vf = document.getElementById('verifyForm');
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;');
  const long = v => new Date(v + 'T12:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
  const verifyUrl = location.origin + location.pathname;

  function showVerify(note) {
    view.innerHTML = `<p class="kick mute">Verify</p><h1 class="h-l" style="margin-top:12px">Check a Ride Smart certificate.</h1>${note ? `<p class="lede mute" style="margin-top:14px">${note}</p>` : ''}`;
    vf.hidden = false;
  }
  vf.addEventListener('submit', e => { e.preventDefault(); location.search = '?id=' + encodeURIComponent(document.getElementById('vid').value.trim().toUpperCase()); });

  async function load() {
    if (!id) return showVerify('Enter the ID printed on the certificate.');
    let j;
    try { const r = await fetch(`${RS.api}/cert?id=${encodeURIComponent(id)}${t ? '&t=' + encodeURIComponent(t) : ''}`); j = await r.json(); if (!r.ok) throw new Error(j.error); }
    catch (err) { return showVerify((err && err.message) || 'We couldn’t find that certificate.'); }
    if (!j.kid) {
      view.innerHTML = `<p class="kick mute">Verify</p><h1 class="h-l" style="margin-top:12px">${j.valid ? 'This certificate is real.' : 'Not verified yet.'}</h1><p class="lede mute" style="margin-top:14px">${esc(j.first)} finished the Ride Smart e-bike safety course on ${long(j.done)}. ID ${esc(j.id)}.</p>`;
      return;
    }
    view.innerHTML = `${j.preview ? '<p class="disclose" style="margin-bottom:16px">Preview: payments aren’t connected yet. On the live site this page opens from the certificate email after payment.</p>' : ''}
      <p class="kick mute">Your certificate</p><h1 class="h-l" style="margin-top:12px">${esc(j.kid.split(' ')[0])} is ride ready.</h1>
      <div class="cert-mock" style="margin-top:22px"><small>RIDE SMART · CERTIFICATE</small><p class="nm">${esc(j.kid)}</p><p>completed all six Ride Smart e-bike safety lessons and took the rider pledge.</p><small>ID ${esc(j.id)} · ${long(j.done).toUpperCase()}</small></div>
      <div class="no-print" style="display:flex;flex-wrap:wrap;gap:12px;margin-top:22px"><button class="btn btn-ink" type="button" id="dlCert">Download certificate</button><button class="btn btn-ghost" type="button" id="dlCard">Download rider card</button></div>
      <p class="note no-print">To print: open the downloaded image and print it, or use your browser's Print. Schools can check it at <b>${esc(verifyUrl)}</b> with the ID.</p>`;
    document.getElementById('dlCert').onclick = () => save(cert(j), 'ride-smart-certificate.png');
    document.getElementById('dlCard').onclick = () => save(card(j), 'ride-smart-rider-card.png');
  }

  function fit(x, text, max, size, w, font) { let fs = size; x.font = `${w} ${fs}px ${font}`; while (x.measureText(text).width > max && fs > 20) { fs -= 4; x.font = `${w} ${fs}px ${font}`; } }
  const DISP = 'Archivo, "Arial Black", sans-serif', BODY = 'Inter, Arial, sans-serif';
  function cert(j) {
    const cv = document.createElement('canvas'); cv.width = 2200; cv.height = 1700; const x = cv.getContext('2d');
    x.fillStyle = '#f3f1ea'; x.fillRect(0, 0, 2200, 1700);
    x.fillStyle = '#0f1110'; x.fillRect(0, 0, 2200, 260); x.fillStyle = '#d4ff3f'; x.fillRect(0, 260, 2200, 18);
    x.fillStyle = '#f3f1ea'; x.font = `900 84px ${DISP}`; x.fillText('RIDE SMART', 140, 165);
    x.fillStyle = '#d4ff3f'; x.font = `700 40px ${BODY}`; x.textAlign = 'right'; x.fillText('CERTIFICATE OF COMPLETION', 2060, 155); x.textAlign = 'left';
    x.fillStyle = '#5f645f'; x.font = `600 44px ${BODY}`; x.fillText('This certifies that', 140, 520);
    x.fillStyle = '#0f1110'; fit(x, j.kid.toUpperCase(), 1920, 190, 900, DISP); x.fillText(j.kid.toUpperCase(), 140, 740);
    x.fillStyle = '#2a2e2b'; x.font = `500 52px ${BODY}`;
    x.fillText('completed all six Ride Smart e-bike safety lessons:', 140, 880);
    x.fillText('gear, signs, rules of the road, sidewalks, parking lots', 140, 950);
    x.fillText('and the final check, and took the Ride Smart rider pledge.', 140, 1020);
    x.fillStyle = '#0f1110'; x.fillRect(140, 1320, 760, 4); x.fillRect(1300, 1320, 760, 4);
    x.font = `700 46px ${BODY}`; x.fillText(long(j.done), 140, 1290); x.fillText(j.id, 1300, 1290);
    x.fillStyle = '#5f645f'; x.font = `600 34px ${BODY}`; x.fillText('Completion date', 140, 1380); x.fillText('Certificate ID', 1300, 1380);
    x.font = `500 30px ${BODY}`; x.fillText('Check this certificate at ' + verifyUrl, 140, 1580);
    return cv;
  }
  function card(j) {
    const cv = document.createElement('canvas'); cv.width = 1050; cv.height = 600; const x = cv.getContext('2d');
    x.fillStyle = '#0f1110'; x.fillRect(0, 0, 1050, 600); x.fillStyle = '#d4ff3f'; x.fillRect(0, 0, 18, 600);
    x.fillStyle = '#d4ff3f'; x.font = `700 26px ${BODY}`; x.fillText('RIDE SMART · RIDER CARD', 60, 80);
    x.fillStyle = '#f3f1ea'; fit(x, j.kid.toUpperCase(), 930, 80, 900, DISP); x.fillText(j.kid.toUpperCase(), 60, 190);
    x.fillStyle = '#c9c7bf'; x.font = `500 28px ${BODY}`;
    ['Helmet level, V, snug', 'Brakes and tires checked', 'Ride with traffic, signal turns', 'Walk it through crowds'].forEach((l, i) => x.fillText('✓  ' + l, 60, 270 + i * 50));
    x.fillStyle = '#9aa09a'; x.font = `600 24px ${BODY}`; x.fillText(`${j.id} · ${long(j.done)}`, 60, 560);
    return cv;
  }
  function save(cv, name) { cv.toBlob(b => { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = name; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }); }
  load();
})();
