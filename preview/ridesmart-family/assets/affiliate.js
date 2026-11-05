// Affiliate links, all in one place. When a program approves you, paste its link here.
// Until then each button goes to the brand or store page with no tracking.
// Keys match data-aff="..." on the gear page.
window.AFF = {
  'thousand-jr':          { url: '', program: 'Thousand · AvantLink · 10%' },
  'nutcase-little-nutty': { url: '', program: 'Nutcase · AvantLink · 5–10%' },
  'rsp-lazer':            { url: '', program: 'Ready Set Pedal · AvantLink · 3%' },
  'bern-hudson':          { url: '', program: 'No program found yet' },
  '187-junior':           { url: '', program: '187 Killer Pads · Awin' },
  't8-saver':             { url: '', program: 'Triple Eight · Awin · 5%' },
  'rsp-gloves':           { url: '', program: 'Ready Set Pedal · AvantLink · 3%' },
  'woom-bikes':           { url: '', program: 'woom · Awin · up to 10%' },
  'rsp-stacyc':           { url: '', program: 'Ready Set Pedal · AvantLink · 3%' },
  'woom-up':              { url: '', program: 'woom · Awin · up to 10%' },
  'bluejay-wild':         { url: '', program: 'Bluejay · Awin' },
  'himiway-c1':           { url: '', program: 'Himiway · Awin · ~3%' },
  'rsp-ebikes':           { url: '', program: 'Ready Set Pedal · AvantLink · 3%' },
};
(function () {
  document.querySelectorAll('a[data-aff]').forEach(a => {
    const x = window.AFF[a.dataset.aff];
    if (x && x.url) a.href = x.url;
    a.target = '_blank';
    // Count clicks on the parent site only (no personal data). Kids' pages never load this file.
    a.addEventListener('click', () => {
      try { navigator.sendBeacon && navigator.sendBeacon('/api/ridesmart/click', JSON.stringify({ k: a.dataset.aff })); } catch (_) {}
    });
  });
})();
