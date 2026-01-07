# Wishlist — Release Notes & Developer Notes

Date: 2026-01-07

## Features
- Static wishlist UI with 10 sample items (`wishlist/index.html`, `wishlist/styles.css`).
- Persistent reservations using Supabase/Postgres:
  - `public.reservations` table with `item_id`, `reserved_by`, `reserved_at`.
  - RPCs `reserve_item(p_item_id, p_name)` and `release_item(p_item_id)` for atomic operations.
- Frontend client (`wishlist/script.js`) uses Supabase UMD bundle and a publishable anon key for the prototype.
- Offline/preview fallback: when Supabase is unavailable, the page shows a static list.

## Implemented
- Added `wishlist/supabase_setup.sql` containing table and RPC definitions and grant statements.
- Implemented robust Supabase UMD detection and `supabaseClient` creation logic.
- Handled storage/access blocking (Tracking Protection) gracefully; client falls back to static view.
- Deployed to GitHub Pages (`gh-pages`).

## Remaining / To do
1. Run DB migration in Supabase SQL editor
   - Execute `wishlist/supabase_setup.sql` in your Supabase project. If you previously applied policies with incorrect syntax, drop them first.
2. Apply and verify RLS policies
   - Enable RLS on `public.reservations`.
   - Allow `SELECT` to `anon` and grant `EXECUTE` on RPCs to `anon` for the prototype.
   - Deny direct `INSERT`/`DELETE` via `WITH CHECK (false)` policies if you want RPC-only access.
3. Confirm end-to-end behavior
   - Test reserving and releasing items from the deployed page and verify rows in the DB.
4. Optional: add shareable reservation links
   - Current UI prompts for a name; consider adding a copyable share link for reserved items.
5. Security hardening (if production)
   - Replace client-side anon key usage with server-side endpoints or tighten RLS and monitor access.

## Developer / Troubleshooting notes
- File locations:
  - `wishlist/index.html`, `wishlist/styles.css`, `wishlist/script.js`, `wishlist/supabase_setup.sql`.
- Supabase client notes:
  - The CDN UMD may expose different globals; the client detects `window.supabase`, `window.supabaseJs`, or `window.Supabase`.
  - In some browsers Tracking Protection blocks storage access and prevents the UMD from initializing — the client now catches that and shows a static preview.
- Common errors & fixes:
  - "only WITH CHECK expression allowed for INSERT": use `WITH CHECK` when creating INSERT policies.
  - `Identifier 'supabase' has already been declared`: caused by a global name collision; the client now uses `supabaseClient`.

## Documentation suggestions for future development
- Add `docs/` or `wishlist/docs/` with:
  - `migrations/` containing SQL changes and a changelog for DB schema.
  - `README.md` describing local dev, deployment, and how to run SQL in Supabase.
  - `SECURITY.md` with notes about keys and RLS.
  - `CONTRIBUTING.md` with coding/commit style and testing guidance.
- Add a small CI workflow (GitHub Actions) for:
  - Linting/formatting checks on push.
  - Optional: running SQL migrations against a staging Supabase (requires secure secrets).
- Add tests: e2e test for reservation flow (Playwright/Cypress) mocking Supabase or using a test DB.

## Quick commands
- Local preview: `python -m http.server 8000` and open `http://localhost:8000/wishlist/`.
