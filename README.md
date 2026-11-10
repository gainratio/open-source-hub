# GainRatio Open-Source Hub

Static catalog and project pages for GainRatio's open-source applications and libraries, live at **[open-source.gainratio.com](https://open-source.gainratio.com/)**.

**[Browse the hub at open-source.gainratio.com](https://open-source.gainratio.com/)**. Zero runtime JavaScript, zero external fonts, zero analytics, and zero third-party network requests.

[![Project docs](https://github.com/gainratio/open-source-hub/actions/workflows/docs.yml/badge.svg)](https://github.com/gainratio/open-source-hub/actions/workflows/docs.yml)
[![License](https://img.shields.io/github/license/gainratio/open-source-hub)](LICENSE)

GainRatio ships deterministic, verifiable applications and libraries across browser search, sanctions screening, privacy scrubbing, cryptographic evidence, scoring, and agent harnesses. Rather than scattering docs across fourteen separate repos, this site gives readers and search engines one plain-HTML index linking every live demo, source repository, and package registry entry.

## Try it

1. Open [open-source.gainratio.com](https://open-source.gainratio.com/) to browse all 14 project cards, live browser apps ([edge-reco.com](https://edge-reco.com/), [aml-filter.com](https://aml-filter.com/), [almamesh.com](https://almamesh.com/)), and foundation libraries.
2. Open any project route (for example [`/edge-reco/`](https://open-source.gainratio.com/edge-reco/) or [`/aml-filter/`](https://open-source.gainratio.com/aml-filter/)) to read its problem statement, verification model, and direct install links.
3. Inspect [`/llms.txt`](https://open-source.gainratio.com/llms.txt) and [`/sitemap.xml`](https://open-source.gainratio.com/sitemap.xml) for machine-readable discovery across the full stack.

## Run it yourself

You need Node 22 or newer (no npm dependencies to install — the build and checks use Node's standard library).

```bash
git clone https://github.com/gainratio/open-source-hub
cd open-source-hub
npm run build
python3 -m http.server 8765 --directory dist
```

Open `http://127.0.0.1:8765/`.

## Under the hood (for developers)

- **Pure static HTML + CSS (`index.html`, `<slug>/index.html`, `404.html`).** Every page uses inline CSS with system serif/sans typography matching [gainratio.com](https://gainratio.com/), strict Content Security Policy headers (`default-src 'none'; style-src 'unsafe-inline'; img-src 'self' data:; frame-ancestors 'none'`), and HSTS in [`_headers`](_headers).
- **Offline contract verification (`scripts/check-pages.mjs`).** `npm run check:pages` (also wired as `prebuild`) enforces word-count floors across all 14 project pages, single `<h1>`, skip-link + `<main id="main">` landmarks, duplicate-ID checks, internal route and `#anchor` resolution, canonical tags, JSON-LD (`CollectionPage` + `Organization` `sameAs`) validity, `sitemap.xml` coverage, and `llms.txt` completeness.
- **Scheduled live SEO health check (`scripts/seo-health.mjs`).** `.github/workflows/seo-health.yml` probes the deployed portfolio weekly to verify HTTP 200 status, canonical URLs, JSON-LD, `robots.txt`, `sitemap.xml`, and bilingual `hreflang` tags.
- **Cloudflare Pages deployment (`scripts/build.mjs`, `wrangler.toml`).** `npm run build` validates all pages and copies only deployable static assets into `dist/` for Cloudflare Pages project `gainratio-open-source`.

## Content rules

- Every project card links to a live URL or published repository and states only properties enforced by code and tests.
- Never publish unmeasured user counts, revenue claims, or unverified benchmark numbers.
- Keep cross-domain links aligned with [gainratio.com](https://gainratio.com/) and each downstream project repository.

## More detail

- [OSS security review](docs/OSS-SECURITY-REVIEW.md): repository controls, workflow permissions, HTTP headers, and residual risks.
- [Security policy](SECURITY.md): how to report a vulnerability privately.
- [License](LICENSE): MIT.
