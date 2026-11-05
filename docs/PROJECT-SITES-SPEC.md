# OSS Project Sites — Specification

Status: proposal  
Date: 2026-11-05  
Owner: GainRatio  
Scope: public OSS projects under `github.com/gainratio`, the canonical hub at `open-source.gainratio.com`, optional dedicated project subdomains, and their relationship to the flagship product sites.

Related documents:

- [ATC UX spec](https://github.com/gainratio/agentic-tab-context/blob/main/docs/ATC-UX-SPEC.md)
- [Portfolio SEO health check](../scripts/seo-health.mjs)

---

## 1. Problem

GitHub is a code host, not a search-optimised product surface. A public repo page is indexable, but:

- the title is the repo name, not the query a user searches;
- the description is short and metadata-like;
- README content mixes installation, badges, and maintainer notes;
- Google often ranks the repo for the project name only;
- there is no JSON-LD, sitemap priority, comparison content, or demo;
- GitHub controls the page structure, canonical, and metadata.

The portfolio already has strong intent pages on `almamesh.com`, `edge-reco.com`, and `aml-filter.com`. The OSS projects should have the same crawlable, useful surface — without turning every repo into a separate full application.

## 2. Goals

1. Give every public project a canonical, indexable page that answers **what it does, who it is for, and how to try it**.
2. Make `open-source.gainratio.com` the authoritative project index.
3. Give the highest-intent projects a dedicated docs/demo site on a `gainratio.com` subdomain.
4. Preserve one source of truth for install commands, API examples, and limitations.
5. Keep the deployment and security model consistent with the flagship sites.
6. Be measurable: Search Console impressions, organic clicks, demo usage, GitHub referrals, package downloads.

## 3. Non-goals

- Building a custom SPA for every repository.
- Duplicating the same page across the hub and a subdomain.
- Creating thin “SEO doorway” pages.
- Hosting customer data or production secrets in a public demo.
- Replacing GitHub issues, releases, or code review.
- Buying new domains for each project in phase 1.

## 4. Definitions

| Term | Meaning |
|---|---|
| **Hub** | `open-source.gainratio.com`, the canonical project index and docs home |
| **Project page** | A hub URL such as `/edgeproc-browser/` |
| **Dedicated site** | A subdomain such as `edgeproc.gainratio.com` with docs, examples, and optionally a demo |
| **Flagship site** | `almamesh.com`, `edge-reco.com`, `aml-filter.com` |
| **Demo** | A browser-only, client-side interactive example; no server-side customer data |
| **Source of truth** | The repository README and package metadata; pages must not contradict them |

## 5. Information architecture

### 5.1 Hub (phase 1)

```text
open-source.gainratio.com/
├── /                         # portfolio overview
├── /edgeproc-browser/        # canonical project page
├── /edge-proc/
├── /edgeproc-core/
├── /avow/
├── /privacy-core/
├── /errors/
├── /assay/
├── /agentic-tab-context/
├── /agentic-context-service/
├── /agentic-saga/
├── /ci/
├── /aml-filter/
├── /edge-reco/
├── /almamesh/
├── /sitemap.xml
└── /robots.txt
```

Rules:

- Keep the existing flat `/<slug>/` URLs. Do not introduce `/projects/<slug>/` without 301s.
- Each page is a complete canonical page, not a redirect to GitHub.
- The hub homepage lists every project with a one-line description and a link.
- The hub sitemap contains every project page.
- There is no separate “docs” path in phase 1; the project page is the docs landing page.

### 5.2 Dedicated sites (phase 2)

Only for projects that clear the selection criteria.

```text
edgeproc.gainratio.com/
├── /                 # product/docs landing
├── /docs/            # getting started, concepts, guides
├── /docs/api/        # API reference
├── /examples/        # copyable examples
├── /demo/            # optional browser demo
├── /changelog/
├── /security/
├── /sitemap.xml
└── /robots.txt
```

Rules:

- One subdomain per project, not per package.
- The hub project page remains the high-level overview and links to the dedicated site.
- The dedicated site must not duplicate the hub page copy; it expands into long-tail docs.
- Canonical rules:
  - Hub project page: self-canonical while it is the primary page.
  - Dedicated site home: self-canonical; it is a different page with docs navigation.
  - Never canonical a dedicated doc page to the hub; that hides the docs.
  - If the hub page becomes a pure summary, keep it self-canonical but reduce duplicate prose to a short overview plus links.

### 5.3 Flagship products

Flagship sites remain independent:

- `almamesh.com` — Vedic astrology product and intent pages
- `edge-reco.com` — EdgeReco storefront/demo
- `aml-filter.com` — sanctions screening product

OSS pages link to them where relevant. Do not merge the product and project sites.

## 6. Project tiering

### Tier A — dedicated docs site with demo

Criteria: real search intent, a browser-safe demo, active maintenance, and enough documentation.

| Project | Site | Demo |
|---|---|---|
| `edgeproc-browser` | `browser.gainratio.com` or `edgeproc.gainratio.com` | verified local search |
| `avow` | `avow.gainratio.com` | sign/verify a receipt |
| `privacy-core` | `privacy.gainratio.com` | redact/rehydrate text |
| `assay` | `assay.gainratio.com` | score calculator |

### Tier B — strong hub page only

| Project | Reason |
|---|---|
| `edge-proc` | Python package; docs and examples suffice |
| `edgeproc-core` | library; API docs on hub |
| `errors` | small library; reference page |
| `agentic-tab-context` | developer tool; demo is the extension itself |
| `agentic-saga` | framework/library; docs page |
| `agentic-context-service` | infrastructure; docs page |
| `ci` | internal-ish tooling; hub page |

### Tier C — listing and link only

Projects that are experimental, internal, or not ready for public docs:

- list on the hub
- one-line description
- link to GitHub
- no dedicated site
- no demo

Tiering is reviewed quarterly. A project moves up only when it has:

- a stable release
- a clear user and query
- working examples
- a maintainer who will update the page

## 7. Page requirements

### 7.1 Hub project page

Minimum content:

1. **H1** — the user-facing name, not the repo slug.
2. **One-sentence promise** — what it does and for whom.
3. **Problem** — the specific pain.
4. **How it works** — three to six bullets or a short diagram.
5. **Quickstart** — install and a minimal working example.
6. **API or usage** — two or three real examples.
7. **When not to use it** — limitations and alternatives.
8. **Security / privacy** — what data is handled and where.
9. **License and status** — MIT/Apache, stable/beta/experimental.
10. **Links** — GitHub, package registry, docs, demo, changelog.
11. **FAQ** — three to six actual questions.
12. **Related projects** — internal links to two or three sibling projects.

Target length: **800–1,500 words** of substantive content. Do not pad.

Title pattern:

```text
<Project> — <one-line value> | GainRatio Open Source
```

Examples:

- `@gainratio/browser — Verified local-first data in the browser`
- `avow — Tamper-evident signed receipts for Python`
- `privacy-core — Redact PII before it reaches an LLM`

H1: the project name plus a plain-language descriptor.

### 7.2 Dedicated docs site

Required pages:

- Home: value proposition, install, quickstart, demo CTA
- Docs: concepts, getting started, configuration, deployment
- API reference: generated or manually maintained
- Examples: at least three copyable, runnable examples
- Changelog: release notes with dates
- Security: threat model, reporting, supported versions
- 404 and search

Optional:

- Demo
- Playground
- Benchmarks
- Migration guides
- Comparison pages

Do not create a page for every source file. Group by task.

### 7.3 Metadata

Every indexable page must have:

```html
<title>Unique title ≤ 70 characters</title>
<meta name="description" content="50–160 characters">
<link rel="canonical" href="https://host/path">
<meta name="robots" content="index,follow">
<meta property="og:title" ...>
<meta property="og:description" ...>
<meta property="og:url" ...>
<meta property="og:image" ...>
```

One `<h1>` per page. No keyword stuffing. No duplicate titles across projects.

### 7.4 Structured data

Hub and dedicated project home:

```json
{
  "@context": "https://schema.org",
  "@type": "SoftwareSourceCode",
  "name": "avow",
  "description": "Tamper-evident signed receipts for Python.",
  "codeRepository": "https://github.com/gainratio/avow",
  "programmingLanguage": "Python",
  "license": "https://opensource.org/license/mit",
  "url": "https://open-source.gainratio.com/avow/",
  "sameAs": [
    "https://github.com/gainratio/avow",
    "https://pypi.org/project/avow/"
  ]
}
```

Docs pages may use `TechArticle`. Demos may use `WebApplication`. FAQ pages use `FAQPage` only when the questions are visible on the page.

### 7.5 Sitemaps

- Hub: `https://open-source.gainratio.com/sitemap.xml`
- Each dedicated site: its own `sitemap.xml`
- Include only canonical, indexable, 200-status URLs
- Update `lastmod` when substantive content changes
- Submit each sitemap in GSC under the verified `gainratio.com` domain property
- Submit new URLs through IndexNow

### 7.6 Robots

```text
User-agent: *
Allow: /
Sitemap: https://host/sitemap.xml
```

Do not disallow docs, examples, changelog, or demo pages. Do not rely on `noindex` for duplicate content; use canonicals and distinct content.

## 8. Content source of truth

| Artifact | Source |
|---|---|
| Install command | package metadata |
| Version | release tag / package registry |
| API | source types and tests |
| License | `LICENSE` |
| Security policy | `SECURITY.md` |
| Limitations | maintainer-reviewed |
| Demo behaviour | the deployed demo |

Rules:

- Pages must not claim features that are not in the release.
- Benchmarks must cite the machine, version, and method.
- “Open source” must name the license.
- Never claim “production-ready” without a release and support policy.
- If docs and code disagree, the code wins; file a doc issue.

## 9. Design and UX

### 9.1 Shared design system

Use one small, shared static template:

- system font stack
- one accent colour per project family, or a neutral GainRatio palette
- max content width 720–840px
- code blocks with copy buttons
- sticky docs sidebar on dedicated sites
- visible focus states
- prefers-reduced-motion
- light/dark support where cheap

Do not build 14 different visual identities.

### 9.2 Performance budgets

- HTML + CSS + JS for a docs page: **≤ 100 KB compressed**
- LCP: **< 2.5 s** on a mid-range mobile profile
- CLS: **< 0.1**
- No render-blocking third-party scripts
- Demo code loaded only on the demo page, dynamically
- No analytics script on docs before content is useful

### 9.3 Accessibility

- semantic landmarks
- one H1
- skip link
- keyboard-operable nav and code copy
- 4.5:1 text contrast
- alt text for diagrams
- no autoplay media

## 10. GitHub and package metadata

For every Tier A/B project:

- **GitHub homepage** → canonical project page or dedicated site
- **README first screen** → what it does, install, link to docs/demo
- **Topics** → accurate, not spammy
- **Description** → one sentence with the problem
- **Releases** → link to changelog
- **Package metadata** (`homepage`, `repository`) → project page
- **Social preview** → project-specific OG card

GitHub remains the source and community surface. It should not be the canonical marketing page.

## 11. Cloudflare deployment model

### 11.1 Projects

- Hub: existing Pages project `gainratio-open-source`
- Dedicated site: one Pages project per subdomain, e.g. `avow-docs`
- Flagship sites: existing projects, unchanged

### 11.2 Build

- Hub: `npm run build` in `front-door`, output `dist/`
- Dedicated sites: static generator or plain HTML; no runtime server
- Pin Node version
- Fail the build on broken internal links and missing metadata

### 11.3 Headers

Every site ships:

```text
/*
  X-Content-Type-Options: nosniff
  X-Frame-Options: SAMEORIGIN
  Referrer-Policy: strict-origin-when-cross-origin
  Content-Security-Policy: default-src 'self'; ...
```

- No `unsafe-eval`
- Demo scripts self-hosted
- No third-party scripts without review

### 11.4 Cache

- HTML: short cache or revalidate
- Hashed assets: immutable, one year
- Sitemap/robots: short cache

## 12. Security

### 12.1 Static docs

- No authentication
- No secrets
- No server-side state
- No customer data
- Dependency and build-time supply-chain checks
- No country blocks; allow verified search crawlers
- Do not weaken zone-wide security for SEO. Use path-scoped rules only when proven necessary.

### 12.2 Demos

A demo is allowed only when:

- it runs entirely in the browser
- it accepts synthetic or user-pasted data, never production customer data
- it makes no request containing the user's input to a third party
- it has a visible privacy statement
- it can be removed without breaking the docs

Do not build demos that:

- accept credentials or API keys
- proxy arbitrary URLs
- run server-side code
- persist sensitive data in shared storage
- claim compliance certification

### 12.3 Supply chain

- lockfile committed
- dependency audit in CI
- no postinstall scripts without allowlist
- signed release artifacts where the project supports it
- SECURITY.md in every Tier A/B repo

### 12.4 Cloudflare

- TLS enforced
- WAF managed rules on
- Bot Fight Mode default off for docs; use targeted rules if abuse appears
- Crawler allowlist for verified search bots
- No IP/country allowlist that excludes India or other markets

## 13. Measurement

### 13.1 Per project

- GSC impressions and clicks
- Indexed pages
- Top queries
- Organic landing page
- Outbound clicks to GitHub and package registry
- Demo starts and completions (privacy-respecting, aggregate)
- GitHub referrals
- Package downloads where available

### 13.2 North-star metric

> Qualified organic sessions that reach a project page and then click through to GitHub, a package registry, or a working demo.

### 13.3 Review cadence

- Weekly during launch
- Monthly thereafter
- Remove or merge pages with zero impressions after 90 days
- Promote a project to Tier A only after the hub page shows demand

## 14. Phases

### Phase 0 — Audit and baseline (week 1)

- Confirm every current project page is 200 and in the sitemap
- Add GSC/IndexNow coverage
- Capture baseline impressions and clicks
- Fix broken links and stale screenshots

### Phase 1 — Hub content template (weeks 2–3)

- Rewrite all Tier A/B hub pages to the required sections
- Add JSON-LD and quickstart
- Add cross-links between related projects
- Update GitHub homepages for Tier A/B
- Verify with the portfolio SEO health check

### Phase 2 — Three dedicated sites (weeks 4–7)

Recommended order:

1. `avow` — clear query, easy verifier demo
2. `privacy-core` — clear query, client-side redaction demo
3. `edgeproc-browser` — strongest developer intent, more docs work

For each:

- create Pages project
- shared docs template
- sitemap/robots/JSON-LD
- demo
- GSC submission
- GitHub/package links
- 30-day measurement window

### Phase 3 — Evaluate (weeks 8–10)

- Compare impressions/clicks to baseline
- Keep, improve, or remove each dedicated site
- Do not launch the next subdomain until the previous one has data

### Phase 4 — Scale (quarter 2)

- Add `assay` if the calculator demo earns traffic
- Add remaining projects only when they have a real query and owner
- Automate sitemap/metadata/link checks

## 15. Acceptance criteria

For every page:

- HTTP 200
- one H1
- unique title and description
- self-canonical
- in the sitemap
- valid JSON-LD
- no broken internal links
- mobile viewport
- Lighthouse performance ≥ 90 on the docs page
- no console errors
- GSC sitemap status Success
- IndexNow accepted

For every dedicated site:

- custom domain on Cloudflare Pages
- HTTPS enforced
- sitemap/robots
- 404 page
- security headers
- no third-party trackers
- documented demo privacy
- GitHub homepage updated

For the hub:

- every project has a page
- every page is linked from the home page
- every page links to GitHub and package registry
- sitemap includes all pages
- no duplicate project titles

## 16. Risks

| Risk | Mitigation |
|---|---|
| Thin duplicate pages | Require 800+ words of distinct content and a real query |
| Too many subdomains | Phase 2 limited to three; measure before expanding |
| Content drift | Source-of-truth table; docs checked against release |
| Security regression in demos | Browser-only rule; review checklist; no secrets |
| Maintenance burden | Shared template; generate from repo metadata where possible |
| Cloudflare bot rules blocking crawlers | Crawler allowlist; no global Bot Fight Mode; monitor GSC |
| GitHub and site disagree | GitHub remains code source; page links to release |

## 17. Open decisions

1. Which project gets the first dedicated subdomain after Avow?
2. Do we use a static site generator or plain HTML for dedicated docs?
3. Is `browser.gainratio.com` or `edgeproc.gainratio.com` the right host for the browser runtime?
4. Do we want a shared docs search, or per-site search later?
5. What analytics tool meets the privacy bar without adding a third-party script?
6. Who owns quarterly page review?

## 18. Definition of done

- Every public project has a canonical hub page with real content, metadata, JSON-LD, sitemap entry, and GitHub/package links.
- Three Tier A projects have dedicated docs sites with demos, deployed on Cloudflare, indexed, and measured.
- GitHub homepages and package metadata point at the canonical pages.
- The portfolio SEO health check covers the hub and all dedicated sites.
- A monthly report shows impressions, clicks, demo usage, and GitHub/package referrals.
- No project page is a README paste, a redirect, or a thin doorway.
