# SRF CMC — Site polish round

## Goal
Fix outdated text/metadata, correct small typos, and give the site a branded share image and favicon so shared links look right on WhatsApp, Instagram and X.

## 1. Fix stale page metadata
- `src/routes/index.tsx` head: og:title "SRF CMC — your home-grown research forum" → match the current hero ("introducing a real research culture"); description still mentions "a journal desk" → replace with current positioning (Google Form–based registration, workshops, research paper projects, discourse sessions).
- `src/routes/projects.tsx` head: description mentions "THE BLS PROJECT on 7 October" → update to current titles ("THE CPR PROJECT", curriculum finalising, registration starts by 1 Oct).
- Keep per-route unique titles/descriptions; set og:type and twitter:card where missing.

## 2. Fix typos and stray markup
- `src/routes/about.tsx`: "questionaires" → "questionnaires"; "collabration" → "collaboration".
- `src/routes/projects.tsx` (~line 47): remove the empty `<p>` left from an earlier text edit.

## 3. Branded share image + favicon
- Generate a navy/lime social card (1200×630) with "SRF CMC" and "Student Research Forum / Chandka Medical College" in the site's display style (imagegen, premium tier for text legibility).
- Save to `src/assets/` and wire as `og:image` / `twitter:image` on every content route (/, /about, /members, /projects, /contact) — only because it is served as an absolute URL by the hosting head resolution; if it resolves relative, omit per template rules and fall back to hosting preview.
- Generate a square favicon/mark (the lime "srf" block) and add `<link rel="icon">` in `src/routes/__root.tsx`.

## 4. Verify
- `bunx tsgo --noEmit` clean; Playwright screenshot of home and projects to confirm nothing shifted visually.

## Not in this round (blocked / deferred)
- Real Google Form links: waiting on the user's actual form URLs (buttons currently use a placeholder).
- Project detail pages (`/projects/$slug`) + Projects dropdown: agreed plan for when real projects exist; not buildable from current placeholder content.
- Research Core - Head name: user said "to be decided"; placeholder stays "To be announced" until they choose.
