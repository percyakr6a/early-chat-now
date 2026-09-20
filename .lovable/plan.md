# SRF CMC — replica with working registrations

A page-for-page rebuild of the Student Research Forum (CMC) site, same wording and same look, plus real session registration backed by Lovable Cloud.

## Look and feel

- Deep navy backgrounds, bright lime accent, cyan highlight word in the big headline, off-white page sections.
- Oversized tight headlines, small uppercase mono labels ("SRF / CMC / 2026"), thin dividers, big numbered lists (01, 02, 03).
- Scrolling lime ticker under the hero: STUDENT-LED + RESEARCH-ORIENTED + POLITICS-FREE + OPEN TO ALL MBBS BATCHES.
- Header: srf logo mark, "STUDENT RESEARCH FORUM / CMC", nav links, lime "Join a session" button. Footer on every page.
- Faint diagonal lines and large circle outline behind the hero.

## Pages (same content as the original)

1. **Home** — hero "your home-grown research forum.", two buttons, ticker, "Not a lecture. Not a club. A working space." block, "One good question at a time." with the two upcoming sessions, and the closing "Bring the question you keep returning to." invitation.
2. **About** — "Who are we?", the STUDENT LED* / RESEARCH ORIENTED slab, the longer description, the 01 Attend Workshops / 02 Make Research Studies / 03 Publish steps, and "No endless core meetings."
3. **Members** — "Meet the Core.", Core Team 2026 list of 10 entries with initials avatars (Musadiq Kalhoro founding convener, the core heads, and the "To be announced" slots), and the "The title is less important than the work." closing.
4. **Projects** — "Upcoming Projects." with the two session cards: THE BLS PROJECT (7 October, 9:00 AM – 2:00 PM, 25 slots) and Research discourse in journal club (date TBA). Each has a working Register button.
5. **Journal** — "Read closer." with the three posts (How to read a paper in twenty minutes, The question before the question, Research is a team sport) and the "Send us the unfinished version." editorial-desk block.

## Registration (the working part)

- **Sign up / sign in** with email and password on a dedicated page. New members give their name, batch/year and email.
- **Register button** on any session: signed-in users register in one click and see "You're registered"; visitors are asked to sign in first.
- **Slot counting** — the BLS project shows how many of its 25 places are left and closes registration when full.
- **My sessions** — a signed-in member can see what they registered for and cancel.
- **Admin view** for the convener: a private page listing everyone registered for each session, with export as CSV.
- Sessions, journal posts and core-team entries are stored in Lovable Cloud and seeded with the exact content above, so you can edit them later without me.

## Technical notes

- TanStack Start routes: `/`, `/about`, `/members`, `/projects`, `/journal`, `/auth`, `/_authenticated/my-sessions`, `/_authenticated/admin`.
- Design tokens (navy, lime, cyan, off-white, mono label font) defined in `src/styles.css`; no hardcoded colours in components.
- Lovable Cloud tables: `profiles` (name, batch year), `user_roles` + `has_role()` for admin, `sessions`, `session_registrations` (unique per user+session), `journal_posts`, `core_members`. RLS: public read on content tables, users read/write only their own registrations, admins read all. Seed rows shipped in the migration.
- Slot capacity enforced server-side in a server function, not just in the UI.
- Per-route `head()` metadata with distinct titles and descriptions.
