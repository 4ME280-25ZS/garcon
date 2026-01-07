# Release Notes — Wishlist & Vizitka Prototype

Date: 2026-01-07

## Featureset
- Simple one-page business card site (`vizitka/`) — contact info, minimal styling.
- Wishlist prototype (`wishlist/`) with 10 sample items and clean UI.
- Optional persistent reservations backed by Supabase:
  - `reservations` table with `item_id`, `reserved_by`, `reserved_at`.
  - RPC functions `reserve_item(p_item_id, p_name)` and `release_item(p_item_id)` for atomic operations.
  - Frontend calls RPCs via Supabase client (publishable anon key used for prototype).
- Graceful offline/preview mode: if Supabase client is missing, the page shows a static list and explanatory note.
- Deployed to GitHub Pages (branch `gh-pages`) so `wishlist/` and `vizitka/` are publicly accessible.

## What we implemented (done)
- Created initial business card and moved it into `vizitka/`.
- Built static wishlist UI: `wishlist/index.html`, `wishlist/styles.css`, `wishlist/script.js`.
- Added Supabase integration to the client and provided `wishlist/supabase_setup.sql` with table + RPCs.
- Diagnosed and fixed an RLS policy SQL issue (advised correct use of `WITH CHECK` for INSERT policies).
- Fixed client-side issues:
  - Robust detection of Supabase UMD global.
  - Restored rendering when list/buttons disappeared.
  - Added `renderStatic()` fallback so items are visible if Supabase isn't available.
- Committed and pushed all changes to `main` and `main:gh-pages` (Pages updated).

## Remaining tasks / TODOs
1. Run the SQL migration in Supabase SQL editor
   - Open Supabase project and run `wishlist/supabase_setup.sql`.
   - If you previously applied broken policies, run DROP POLICY statements first.
2. Apply correct RLS policies (recommended)
   - Enable RLS on `public.reservations`.
   - Allow `SELECT` to anon and deny direct `INSERT`/`DELETE` with `WITH CHECK (false)` while granting `EXECUTE` on RPCs to `anon` for controlled access.
3. Validate end-to-end behavior
   - Refresh the deployed wishlist, reserve/release items, and confirm rows appear/disappear in Supabase table.
4. Optional security hardening
   - Replace publishable key usage with server-side endpoints or add more restrictive RLS policies if moving beyond prototype.
5. UX polish & features
   - Add copy/share link for reserved items (currently the UI notes URL-hash but this may change when Supabase is used).
   - Improve error messages and loading states.
   - Add unit/e2e tests if needed.
6. Optional automation
   - Add a CI workflow to run migrations against Supabase on push (careful with credentials), or track SQL in migrations folder.

## Quick commands / notes
- To run a local preview: `python -m http.server 8000` from the repo root and open `http://localhost:8000/wishlist/`.
- Supabase SQL file: `wishlist/supabase_setup.sql` (contains table + RPCs + grants).
- Files of interest:
  - `wishlist/index.html` — main page
  - `wishlist/styles.css` — styling
  - `wishlist/script.js` — client logic, Supabase integration, offline fallback
  - `wishlist/supabase_setup.sql` — DB setup + RPCs

## Contact / next steps
If you want, I can:
- run through SQL changes and produce the exact RLS commands to paste into Supabase SQL editor,
- add a CI workflow to apply SQL automatically (requires secure secrets), or
- implement the copy/share link and small UI improvements next.

--
Generated during development session; keep with repository for future reference.
