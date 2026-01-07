# Wishlist — Setup & Developer Notes

Date: 2026-01-07

This file documents how to set up, test, and troubleshoot the wishlist prototype.

Files of interest
- `wishlist/index.html` — page UI
- `wishlist/styles.css` — styles
- `wishlist/script.js` — client logic, Supabase integration and offline fallback
- `wishlist/supabase_setup.sql` — DB table and RPCs

1) Database setup (Supabase)
- Open your Supabase project, go to SQL editor, and run `wishlist/supabase_setup.sql`.
- If you previously created policies that caused errors, drop them first.

Recommended RLS policy commands (paste in SQL editor):

```sql
-- enable RLS
ALTER TABLE public.reservations ENABLE ROW LEVEL SECURITY;

-- allow read by anon
DROP POLICY IF EXISTS allow_select ON public.reservations;
CREATE POLICY allow_select ON public.reservations FOR SELECT USING (true);

-- deny direct inserts (force RPC usage) — INSERT policies require WITH CHECK
DROP POLICY IF EXISTS deny_insert ON public.reservations;
CREATE POLICY deny_insert ON public.reservations FOR INSERT WITH CHECK (false);

-- allow exec of RPCs (already in `supabase_setup.sql` but re-run if needed)
GRANT EXECUTE ON FUNCTION public.reserve_item(text, text) TO anon;
GRANT EXECUTE ON FUNCTION public.release_item(text) TO anon;

-- keep SELECT grant for anon
GRANT SELECT ON public.reservations TO anon;
```

2) Test RPCs in SQL editor
- Try reserving via SQL to verify RPC works:

```sql
SELECT public.reserve_item('g1','Test User');
SELECT * FROM public.reservations;
```

3) Client notes & troubleshooting
- The client uses the Supabase UMD bundle from CDN. The script detects different UMD globals (`window.supabase`, `window.supabaseJs`, `window.Supabase`).
- Some browsers or privacy extensions block storage access to third-party scripts; the client catches creation errors and falls back to a static preview.
- If you see `offline` messages or no reservations appear:
  - Check DevTools → Network: does `supabase.min.js` (cdn.jsdelivr.net) load (status 200)?
  - Check DevTools → Console for errors (storage blocked, CORS, or RPC errors).

4) Local preview
- From repo root run:

```bash
python -m http.server 8000
# open http://localhost:8000/wishlist/
```

5) Security notes
- The client uses the Supabase anon (publishable) key for prototype convenience. Do not embed a `service_role` key in frontend code.
- For production, prefer server-side endpoints or stricter RLS rules.

6) Suggested improvements
- Add a small `wishlist/docs/` folder with migration history (`migrations/`) and example SQL snippets.
- Add a `wishlist/README.md` (this file) and keep `wishlist/supabase_setup.sql` under version control.
- Consider adding a CI job to run linting and optionally deploy, and a separate secure workflow for running SQL migrations against a staging DB.
