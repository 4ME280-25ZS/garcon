# Garcon — Project Overview

Small repo with two simple static prototypes deployed on GitHub Pages:

- `vizitka/` — one-page online business card
- `wishlist/` — wishlist prototype with optional Supabase-backed reservations

Quick links
- Landing page: `/` (root `index.html`)
- Vizitka: `/vizitka/`
- Wishlist: `/wishlist/`

Local preview
1. From repo root run:

```bash
python -m http.server 8000
# then open http://localhost:8000/
```

Deployment
- The repository uses `gh-pages` for GitHub Pages. Pushing to `main:gh-pages` updates the site.

Where to look
- `vizitka/` — business card files and `vizitka/release-notes.md`.
- `wishlist/` — wishlist UI, `wishlist/script.js`, `wishlist/supabase_setup.sql`, and `wishlist/release-notes.md`.

If you need me to add CI for deployment or a migration workflow, say the word and I'll prepare a safe GitHub Actions flow.
