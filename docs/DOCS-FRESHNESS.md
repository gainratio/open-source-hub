# Project docs freshness — 2026-11-07

Scope: all 14 canonical hub pages, the seven library GitHub homepages, and the first dedicated docs site (`avow.gainratio.com`).

## Verified sources

| Project | Current release | Source of truth | Hub page |
|---|---:|---|---|
| `@gainratio/browser` | 0.4.4 | `edgeproc-browser/package.json`, npm | `/edgeproc-browser/` |
| `edge-proc` | 0.5.1 | `edge-proc` package metadata, PyPI | `/edge-proc/` |
| `edgeproc-core` | 0.4.3 | `edgeproc-core/pyproject.toml`, PyPI | `/edgeproc-core/` |
| `avow` | 0.5.3 | `avow` Python/TypeScript package metadata, PyPI, npm | `/avow/`, `avow.gainratio.com` |
| `@gainratio/privacy-core` | 0.3.2 | `privacy-core/package.json`, npm | `/privacy-core/` |
| `@gainratio/errors` | 0.4.0 | `errors/package.json`, npm | `/errors/` |
| `assay-engine` / `@gainratio/assay` | 0.5.0.dev6 / 0.5.0-dev.6 | `assay/pyproject.toml`, `assay/ts/package.json`, PyPI, npm | `/assay/` |
| `agentic-tab-context` | 0.5.0 | repository package metadata | `/agentic-tab-context/` |
| `agentic-context-service` | 0.1.0 | `pyproject.toml` | `/agentic-context-service/` |
| `agentic-saga` | 0.1.0 | `src/agentic_saga/_version.py` | `/agentic-saga/` |
| `ci` | commit-pinned modules | repository README / Dagger modules | `/ci/` |
| `aml-filter` | 4.0.0 | `frontend/package.json` | `/aml-filter/` |
| `edge-reco` | 0.13.0 | `frontend/package.json` | `/edge-reco/` |
| `almamesh` | application v0.4.0 | `README.md` release status; backend/frontend packages version independently | `/almamesh/` |

## Changes made

- Rewrote all 14 hub pages from thin listings (49–125 words) into project pages of **1,052–1,253 words**.
- Added a problem statement, capabilities, real quickstart, examples, limits, security/data handling where documented, FAQ, and internal links.
- Added valid `SoftwareSourceCode` / `SoftwareApplication` JSON-LD with current versions.
- Updated Avow’s install pin from `0.5.1` to the supported `0.5.3`.
- Pointed seven library GitHub homepages at their canonical hub pages; the three dedicated docs projects now point GitHub at their own sites.
- Added a build gate: `npm run check:pages` fails on thin pages, missing metadata/JSON-LD/canonical, missing sitemap entries, duplicate titles/descriptions, duplicate ids, broken internal links, or missing anchors.
- Avow docs gate now rejects missing in-page and cross-page anchors; the broken `#quickstart` CTA was found and fixed by this check.
- Published three dedicated docs sites:
  - `https://avow.gainratio.com/` — docs, examples, security, changelog, and a browser-side receipt verifier.
  - `https://privacy.gainratio.com/` — docs, examples, security, limits; no fake demo.
  - `https://browser.gainratio.com/` — docs, examples, security, limits; no fake demo.

## Checks

- `node scripts/check-pages.mjs` — root `index.html`, `404.html`, and 14/14 project pages pass, including `dist/` public-artifact allowlist verification.
- `node scripts/seo-health.mjs` — all eight hosts pass (including `avow.gainratio.com`, `privacy.gainratio.com`, and `browser.gainratio.com`, plus HTTP 404 verification on unknown routes); hub sitemap 15/15 URLs.
- Hub: 14/14 pages return 200 with unique titles, one H1, canonical, JSON-LD, skip links, and no mobile overflow; unknown routes return HTTP 404.
- Avow site: `npm run build && npm run check` — 5/5 pages + `404.html` pass; Node WebCrypto + browser verifier confirm a real receipt and reject a tampered or malformed one.
- Avow documented install flow, executed in a clean Python 3.15 virtualenv with `avow[cli]==0.5.3`: `keygen`, `sign`, `verify` all returned ok; a changed payload exited 2 with `avow.payload_hash_mismatch`.
- privacy-core site: `npm run build && npm run check` — 4/4 pages + `404.html` pass; strict per-page CSP (`default-src 'none'`) and HSTS (`includeSubDomains`).
- browser site: `npm run build && npm run check` — 4/4 pages + `404.html` pass; strict per-page CSP (`default-src 'none'`) and HSTS (`includeSubDomains`).
- GSC: hub sitemap **Success, 15 pages**; Avow, privacy-core, and browser sitemaps **Success**.
- IndexNow: hub 15, Avow 5, privacy-core 4, and browser 4 URLs submitted.

## Known source caveats

- `npmjs.com` package pages return HTTP 403 to command-line clients (Cloudflare bot protection). The npm registry API returns 200 and the packages resolve; the links work in a normal browser.
- `almamesh` versions its application release separately from its Python/JavaScript packages; its page says v0.4.0, matching the repository’s release statement.
- `edge-reco` does not print a package version on its hub page; the repository’s package version is 0.13.0.
