# GainRatio open-source front door

A static page, live at **`https://open-source.gainratio.com/`**, built to match the
existing site's navy/cream palette and serif headings. No JavaScript, no external
fonts, no analytics, no third-party requests.

## Why `/open-source/` and not `gainratio.dev`

`gainratio.dev` does not resolve (unregistered as of this build), while
`gainratio.com` is the live GainRatio site. Putting the portfolio on the domain
that already has authority is the stronger move; a new TLD can come later if the
open-source work earns its own brand.

## Deploy

Live on Cloudflare Pages as project `gainratio-open-source`, custom domain
`open-source.gainratio.com`.

```sh
npx wrangler pages deploy dist --project-name=gainratio-open-source --branch=main
```

`dist/` contains the deployed `index.html`. The existing `gainratio` project is
direct-upload only (no Git connection), so this is a separate project rather
than a file inside the main site; that keeps the production site untouched.

Do **not** publish it at `gainratio.dev` until that domain is registered and
delegated.

## Add it to the main site

When the `gainratio.com` source is available, add a nav link to
`https://open-source.gainratio.com/` and optionally mirror the page at
`/open-source/`. The canonical URL in `index.html` is the subdomain.

## Preview locally

```sh
python3 -m http.server 8765
# http://127.0.0.1:8765/
```

## Content rules

- Every product card links to a live URL and says only what the product proves.
- No user counts, revenue, or performance numbers that are not measured.
- The verification section describes properties the code enforces; keep it in
  sync with `edgeproc-browser` and `aml-filter` docs.

## Security

See [OSS security review](docs/OSS-SECURITY-REVIEW.md) for repository controls, dependency alerts, workflow permissions, site headers, and residual risks.

## SEO health check

`npm run health` verifies the production portfolio end to end:

- robots.txt and sitemap status
- every sitemap URL returns 200 HTML
- canonical, title, single H1, valid JSON-LD
- Hindi hreflang on AlmaMesh pages

It runs weekly from `.github/workflows/seo-health.yml`.

## Deployment

`npm run build` generates `dist/`; deploy with Cloudflare Pages project `gainratio-open-source`.
