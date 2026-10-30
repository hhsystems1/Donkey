# Ride Smart

E-bike safety for riders 10–14, with a parent section.

- `/` home: two doors (rider, parent) and the six-lesson list
- `/learn/#1` … `#6`: lesson player, one card per screen
- `/parents/`: helmet buying, gear list, recall check, state laws, charging
- Lesson content lives in `assets/lessons.js`; law and recall data in `assets/laws-data.js` and `assets/recalls-data.js`
- `legacy/` holds the original single-file course

Static site, no build step. Deploy the repo root on Netlify.
