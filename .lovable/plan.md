# Finish the SRF CMC site

Picking up exactly where the build stopped. The five public pages, the look, and the database are already done; what's missing is everything a member actually signs in to.

## What gets built

1. **Sign up / sign in page** — one page where a new member gives their name, batch/year, email and a password, and returning members sign in. New sign-ups get a confirmation email before they can register (say the word if you'd rather people be signed in instantly).
2. **Register buttons start working** — signed-in members register for a session in one click and see "You're registered"; visitors are sent to sign in first. The BLS project shows how many of its 25 places are left and stops accepting people when it's full.
3. **My sessions** — a signed-in member sees what they've registered for and can cancel.
4. **Admin list** — a private page for the convener listing everyone registered for each session, with a "Download CSV" button. You'll need to tell me which email should be the admin so I can grant it.
5. **Fonts and page titles** — load the Archivo and JetBrains Mono fonts, and give every page its own proper title and description instead of the placeholder one.
6. **End-to-end check** — I'll create a test account in the browser, register for a session, watch the slot count drop, cancel, and confirm the admin list and CSV.

## Technical notes

- New routes: `src/routes/auth.tsx` (public), `src/routes/_authenticated/route.tsx` (the managed gate), `src/routes/_authenticated/my-sessions.tsx`, `src/routes/_authenticated/admin.tsx`.
- Auth page uses `supabase.auth.signUp` with `full_name` / `batch_year` in metadata (the existing `handle_new_user` trigger fills `profiles`) and `emailRedirectTo: window.location.origin`.
- Registration UI wires `SessionList` to the existing `registerForSession` / `cancelRegistration` / `getMyRegistrations` server functions via `useServerFn` + React Query; capacity stays enforced server-side.
- Admin page calls `amIAdmin` then `getAllRegistrations`; CSV generated client-side from the returned rows.
- Header sign-in/sign-out affordance already reflects session state; sign-out already cancels and clears the query cache.
- Google font `<link>` tags go in the `__root.tsx` head; per-route `head()` replaces the "Lovable App" placeholder title/description/og tags.
- Admin role granted by inserting an `admin` row in `user_roles` for the chosen account once it exists.
