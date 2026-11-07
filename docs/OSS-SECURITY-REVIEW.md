# OSS security review — 2026-11-07

Scope: all 14 public repositories under `github.com/gainratio`, the hub at `open-source.gainratio.com`, and the three dedicated docs domains.

## Repository controls

| Control | Result |
|---|---|
| Branch protection on `main` | All 14 source repos protected; required checks and one review where configured |
| Secret scanning | Enabled on all 14 source repos and the four new static-site repos |
| Push protection | Enabled on all 14 source repos and the four new static-site repos |
| Dependabot security updates | Enabled on all repos |
| Open high/critical dependency alerts | **0** across all repos |
| Open low/medium dependency alerts | **0** across all repos (`deepmerge` in EdgeReco's build-only Workbox/PWA chain reviewed and dismissed as build-only with no upstream patch) |
| CodeQL / SARIF analyses | Active and passing across all 18 public repos (including `open-source-hub`, `avow-docs`, `browser-docs`, `privacy-docs`) |
| Open code-scanning alerts | **0** across all repos. EdgeReco’s two high `js/polynomial-redos` findings were fixed (`#245`). |
| Workflow default permissions | `read` and `can_approve_pull_request_reviews=false` on all 14 repos |
| Third-party actions | Pinned to commit SHAs in all workflows that use them, including the new docs/hub workflows; `persist-credentials: false` |
| Publish workflows | OIDC, default-branch/workflow-dispatch gated, no stored registry tokens |
| `pull_request_target` | None found |
| SECURITY.md and LICENSE | Present in all source repos, the hub, and the three docs repos |
| Cloudflare Web Analytics | RUM injection disabled to preserve strict CSP and the “no analytics” docs claim |
| Email obfuscation | Decoder is same-origin only; no third-party script |
| Private vulnerability reporting | Enabled on all 18 repos |
| Docs/hub branch protection | `check` required on `main` |

## Findings fixed

### EdgeReco polynomial ReDoS — high

Two CodeQL high-severity findings in `frontend/packages/edgereco-browser/src/engine/runtime.ts` flagged `/\/+$/` as a polynomial ReDoS.

Fix: replaced all three regex uses with a bounded trailing-slash scan. PR `#245` merged; package lint, typecheck, and **307 tests** passed; full Dagger/CodeQL checks passed before merge.

### Documentation sites were not behind Cloudflare security

The `avow`, `privacy`, and `browser` CNAMEs were initially DNS-only, bypassing WAF, bot protection, and Cloudflare’s proxy.

Fix: all three are now **Proxied**. Googlebot returns 200 on all four hosts. HSTS, strict CSP, COOP, CORP, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff` are enforced. HTTP requests redirect 301 to HTTPS.

Cloudflare Web Analytics RUM was injecting `static.cloudflareinsights.com/beacon.min.js`; strict CSP blocked it and produced console errors. RUM is now **disabled** for the zone. Cloudflare email decoding is same-origin only; `privacy.gainratio.com` permits only `script-src 'self'`, not third-party scripts. All three docs sites now load with zero console/CSP errors.

### New repositories lacked baseline controls

The three docs repos and the hub had no branch protection, no secret scanning, and no Dependabot security updates.

Fix:

- branch protection with the `check` required status
- secret scanning + push protection (including `gainratio-site`)
- Dependabot security updates and CodeQL default setup
- private vulnerability reporting
- MIT license and `SECURITY.md`
- explicit public-asset allowlist build (`scripts/build.mjs` -> `dist/`) so `wrangler.toml`, `package.json`, `scripts/*`, `LAUNCH-KIT.md`, and `docs/*` are never deployed to Cloudflare Pages
- dedicated `404.html` (`noindex,follow`) so unknown routes return HTTP 404 instead of soft-404 HTTP 200
- `default-src 'none'` CSP and `Strict-Transport-Security: max-age=31536000; includeSubDomains` across all static docs/hub sites
- Node WebCrypto self-test on `avow-docs` (`assets/verify.js`) verifying Ed25519 signature acceptance and tamper rejection

### Agentic Tab Context (ATC) deep security hardening (`#31`, commit `9d9950f`)

Completed the remaining multi-layer security controls across the daemon, CLI, native host, and browser extension (**637 tests passed** across 38 files):

- **S-03 (Secret & credential redaction)**: Redacts `Authorization: Bearer ...`, `Cookie` / `Set-Cookie`, `sk-...` / `ghp_...` / `AIza...` tokens, OTP / CVV / card-number patterns, and `one-time-code` / `cc-*` autocomplete controls in both `src/daemon/redaction.ts` and `extension/page-agent.js`.
- **S-05 (Untrusted page-content provenance)**: Stamps `provenance: "untrusted-page"` on every `PageState` returned by `inspect` so downstream LLM callers treat DOM text/values as untrusted data.
- **S-09 & S-19 (Upload and screenshot path policy)**: `src/contracts/path-policy.ts` blocks `..` traversal, null bytes, symlink escapes, and sensitive credential/system paths (`.ssh`, `.gnupg`, `.aws`, `.env`, `.npmrc`, `.netrc`, `auth-token`, `state.json`, `/etc`, `/System`) on both `upload` (`ACTION_BLOCKED_SENSITIVE`) and `screenshot` (`INVALID_ARGUMENT`).
- **S-15 (Context retention & TTL pruning)**: Prunes expired persisted contexts (`DEFAULT_CONTEXT_TTL_MS = 24h`, configurable via `ATC_CONTEXT_TTL_MS`) on registry load, creation, and daemon startup.
- **S-18 (Extension ID validation)**: Validates `ATC_EXTENSION_IDS` against Chrome 32-char `[a-p]{32}` and Firefox `addon@domain` / UUID syntax (`src/native/install.ts`) and surfaces `allowedIds` in `atc doctor`.
- **S-24 & S-25 (Log byte caps & socket frame/connection caps)**: Enforces 4 KiB per-entry and 256 KiB per-tab log buffer caps (`SeqLog` and `extension/page-agent-watch.js`), 16 MiB inbound frame limit, and concurrent connection caps (`MAX_ACTIVE_CONNECTIONS = 64`, `MAX_EXTENSION_CONNECTIONS = 16`).

## Residual risks

- **ATC extension host permissions (`S-01`)**: the MV3 extension requests broad host access (`<all_urls>`) so a user can share any open tab on demand without reinstalling; mitigated by the per-tab explicit user-share gate (`S-02`), scheme/domain denylist (`S-06`), per-install IPC auth token (`S-10`), and native-messaging `allowed_origins` pinning (`S-18`).
- **Cloudflare Bot Fight Mode** is off on the GainRatio zone to preserve crawler/API access. The Cloudflare managed ruleset, WAF, proxy, TLS/HSTS, and rate protections remain the primary controls.
- **AlmaMesh loopback CSP**: the production CSP intentionally allows `connect-src http://localhost:*` and `http://127.0.0.1:*` so a user can point the app at a local OpenAI-compatible model. This is a documented product capability; it is the only broad CSP allowance beyond the declared remote providers.

## Verification

```text
18/18 public repos: branch protection, secret scanning, push protection, Dependabot, CodeQL (0 alerts)
0 open Dependabot alerts across all repos (critical/high/medium/low = 0)
0 open CodeQL code-scanning alerts across all repos
4/4 docs & hub sites: allowlisted dist/ deploy, HTTP 404 on unknown routes, Googlebot 200, HSTS+includeSubDomains, default-src 'none' CSP
ATC: 38 test files, 637 tests passed + watched red-run mutation proof on path-policy
EdgeReco: 307 tests passed
AlmaMesh Nightly E2E: success
Avow: clean-venv keygen/sign/verify passed + browser WebCrypto verify.js self-test
AML: production /screen verified in Chromium + 7-day carry-ceiling enforced in Watchlist freshness (#257)
```

## Site headers

`open-source.gainratio.com`, `avow.gainratio.com`, `privacy.gainratio.com`, and `browser.gainratio.com` all serve:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- page-specific CSP
- Cloudflare proxy enabled
