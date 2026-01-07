# Instructions — Garcon project

Purpose
- Short reference for developers and maintainers: how to preview, deploy, and manage the `vizitka` and `wishlist` prototypes.

Quick start
- Local preview:

```bash
# from repo root
python -m http.server 8000
# then open http://localhost:8000/
```
- Deploy: push `main:gh-pages` (the repo publishes static files from the `gh-pages` branch).

Key files and locations
- Root: `index.html` — landing page linking to both prototypes.
- `vizitka/` — business card files and `vizitka/release-notes.md`.
- `wishlist/` — wishlist UI, `wishlist/script.js`, `wishlist/supabase_setup.sql`, `wishlist/release-notes.md`, and `wishlist/README.md`.

Wishlist / Supabase setup (step-by-step)
1. Open Supabase project → SQL editor.
2. Run `wishlist/supabase_setup.sql` to create table and RPCs.
3. Recommended RLS policy snippet (use in SQL editor):

```sql
-- enable RLS
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- allow SELECT for anon
DROP POLICY IF EXISTS allow_select ON public.reservations;
CREATE POLICY allow_select ON public.reservations FOR SELECT USING (true);

-- deny direct INSERT (force RPC usage)
DROP POLICY IF EXISTS deny_insert ON public.reservations;
CREATE POLICY deny_insert ON public.reservations FOR INSERT WITH CHECK (false);

-- grant RPC execute and select
GRANT EXECUTE ON FUNCTION public.reserve_item(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.release_item(text) TO anon;
GRANT SELECT ON public.reservations TO anon;
```

4. Test RPCs in SQL editor:

```sql
SELECT public.reserve_item('g1','Test User');
SELECT * FROM public.reservations;
```

Client behavior & troubleshooting
- The frontend uses the Supabase UMD bundle from CDN. The client detects several global names (`window.supabase`, `window.supabaseJs`, `window.Supabase`).
- Tracking Protection or strict privacy settings may block storage access for third-party scripts (the CDN). If blocked, the client falls back to an offline static preview. Check DevTools → Console and Network for `supabase.min.js` and errors.
- Common error notes:
  - "Identifier 'supabase' has already been declared": older global collision — code now uses `supabaseClient`.
  - "only WITH CHECK expression allowed for INSERT": INSERT policies must use `WITH CHECK` (fix SQL policy creation accordingly).

Security notes
- The code uses the Supabase anon (publishable) key in the frontend for prototyping only. Never commit or expose `service_role` keys.
- For production, prefer server-side endpoints or stricter RLS policies.

Developer suggestions
- Keep DB migrations under `wishlist/migrations/` and version them.
- Add a small CI workflow to run linting and optionally deploy to Pages. If running SQL migrations via CI, use a secure staging project and repo secrets carefully.
- Add e2e tests for reservation flow (Playwright/Cypress) — either mock Supabase or use a dedicated test DB.

Where to find help
- See `wishlist/README.md` for more detailed Supabase setup and troubleshooting examples.
- See `vizitka/release-notes.md` and `wishlist/release-notes.md` for feature-specific notes.
