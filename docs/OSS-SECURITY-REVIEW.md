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
| Open low dependency alerts | 1: `deepmerge` in EdgeReco’s build-only Workbox/PWA chain; no patched release |
| CodeQL / SARIF analyses | Every repo has at least one analysis |
| Open code-scanning alerts | **0**. EdgeReco’s two high `js/polynomial-redos` findings were fixed; the stale pre-fix alert was dismissed as mitigated. |
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
- secret scanning + push protection
- Dependabot security updates
- private vulnerability reporting
- MIT license and `SECURITY.md`

## Residual risks

- **ATC extension permissions**: the MV3 extension still requests broad host access and does not have a per-origin host-permission consent UI; the per-install IPC token and user-share gate are in place. See the ATC security status.
- **Cloudflare Bot Fight Mode** is off on the GainRatio zone to preserve crawler/API access. The Cloudflare managed ruleset, WAF, proxy, TLS/HSTS, and rate protections remain the primary controls. Revisit with hostname-scoped rules rather than a global toggle.
- **AlmaMesh loopback CSP**: the production CSP intentionally allows `connect-src http://localhost:*` and `http://127.0.0.1:*` so a user can point the app at a local OpenAI-compatible model. This is a documented product capability; it is the only broad CSP allowance beyond the declared remote providers.
- **EdgeReco `deepmerge`**: one low advisory in a build-only Workbox/PWA dependency; no patched release. It is not shipped in the browser runtime.
- **AlmaMesh Nightly E2E**: the original run timed out on an external OpenRouter call; the rerun completed **success**.
- **AML Dependabot PR #255**: merged after the clean Dagger run passed (19m18s), along with a deterministic ordering fix for the concurrent install-key test. Main-branch Dagger passed; production deploy completed (9m37s build/verify/deploy/live-verify). Final Chromium `/screen` check: **25 matches**, signed watchlist synced, 1,361 chunks verified, no signature or console errors.
- **ATC security residuals**: new-client approval and optional per-origin permissions remain open, as recorded in the ATC security status.

## Verification

```text
14/14 repos: branch protection, secret scanning, push protection, Dependabot security updates
0 high/critical dependency alerts
EdgeReco: 0 open code alerts
4/4 sites: Googlebot 200, HSTS, CSP, X-Frame-Options DENY
EdgeReco: 307 tests passed
AlmaMesh Nightly E2E: success after the external-model retry
Avow: clean-venv keygen/sign/verify passed; tamper exits 2
AML: production `/screen` verified in Chromium after the dependency deploy
```

## Site headers

`open-source.gainratio.com`, `avow.gainratio.com`, `privacy.gainratio.com`, and `browser.gainratio.com` all serve:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- page-specific CSP
- Cloudflare proxy enabled
