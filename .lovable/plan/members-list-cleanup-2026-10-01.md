# Members list cleanup

Two data fixes on the Members page roster (stored in the `core_members` table):

## 1. Remove member no. 12's name
- Slot 12 currently shows **Omar Tunio (OT)** — "RESEARCH CORE - ASSOCIATE 1 / Y1 MBBS".
- Reset it to the placeholder: name "To be announced", initials "—", keeping the role title.

## 2. Fix no. 11's role title alignment
- Slot 11 (**Musawir Shaikh**) currently says "RESEARCH CORE - CO-HEAD / Y3 MBBS" — a duplicate of slot 10 (Kashaf Noor).
- Change slot 11 to **"RESEARCH CORE - ASSOCIATE 1 / Y1 MBBS"** so the research core reads Head → Co-head → Associate, matching the other cores.
- Also trim the stray trailing line break left on slot 12's role title so both rows align with the rest of the list.

## Technical details
- One SQL UPDATE on `public.core_members` (sort_order 11 and 12) via the data tool — no code or schema changes.
- The members page renders from this table, so the preview updates immediately.
