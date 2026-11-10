# GainRatio Open-Source Hub (`open-source.gainratio.com`)

Static HTML/CSS catalog and 14 per-project pages for the GainRatio open-source stack, deployed to Cloudflare Pages (`gainratio-open-source`).

## Commands

```bash
npm run check:pages   # Offline HTML, a11y, internal link, JSON-LD, sitemap, headers & llms.txt check
npm run build         # Runs check:pages (prebuild) and stages clean static output into dist/
npm run health        # Live HTTP + SEO health probe against production domains
```

## Layout

- `index.html` — Root catalog page (`https://open-source.gainratio.com/`).
- `<slug>/index.html` — Individual 700+ word project pages for all 14 GainRatio OSS projects.
- `404.html` — Custom static not-found page (`noindex,follow`).
- `llms.txt`, `sitemap.xml`, `robots.txt`, `_headers` — Crawler, AI-search, and security header artifacts.
- `scripts/check-pages.mjs` — Deterministic offline verification script run in CI (`docs.yml`).
- `scripts/build.mjs` — Copies deployable static files into `dist/`.
- `scripts/seo-health.mjs` — Live production SEO verification run weekly (`seo-health.yml`).

## Invariants

- Zero runtime JavaScript, zero external fonts, zero analytics, and zero third-party requests (`default-src 'none'`).
- Every new or renamed project slug must be updated across `<slug>/index.html`, `index.html`, `sitemap.xml`, `llms.txt`, `scripts/build.mjs`, and `scripts/check-pages.mjs`.
- Every GitHub Actions `uses:` step in `.github/workflows/` must be pinned to a 40-character commit SHA with its exact `# vX.Y.Z` version comment.
