# Ride Smart

E-bike safety for riders 7–12, with a parent site.

- `/` home: two doors (rider, parent) and the six-lesson list
- `/learn/#1` … `#6`: lesson player, one card per screen, read out loud
- `/family/`: parent site — landing, readiness check (`/family/check/`), gear guide
  with helmet buying, recall check and state laws (`/family/gear/`), official
  certificate (`/family/certificate/`), printable rider card (`/family/card/`)
- Lesson content lives in `assets/lessons.js`; law and recall data in
  `assets/laws-data.js` and `assets/recalls-data.js`
- Narration: studio recordings where they exist, device voice as fallback.
  Recordings are not stored here — `/rec/*` proxies to the recordings host
  (see `netlify.toml`).
- `legacy/` holds the original single-file course (ages 10–14 version);
  `preview/` holds the hhsdemos #17 snapshot this site was ported from.

Static site, no build step. Deploy the repo root on Netlify.

## Backend — pending (Slice 2)

The parent forms post to `/api/ridesmart` (`/lead`, `/order`, `/cert`, `/click`),
which does not exist in this repo yet. Until it lands, every form shows an
honest "isn't connected yet" message and nothing is sent or charged. The
official certificate is $12 one-time via Stripe once the backend is wired up.
Slice 2 ports the `rs-*` Netlify functions from hhsdemos #17
(commit e06aac8) plus the Stripe/email env vars, then tests a lead and an
order end to end.

## Analytics — decision needed

The course and parent pages promise "no tracking" / "no analytics" in their
FAQ and privacy page. That conflicts with the HHS rule that all sites send
analytics to hhs-core2. Do not add tracking until Brendon decides which
promise wins.
