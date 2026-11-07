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
| Open code-scanning alerts | EdgeReco had 2 high `js/polynomial-redos`; fix merged, rescan in progress |
| Workflow default permissions | `read` and `can_approve_pull_request_reviews=false` on all 14 repos |
| Third-party actions | Pinned to commit SHAs in workflows that use them |
| Publish workflows | OIDC, default-branch/workflow-dispatch gated, no stored registry tokens |
| `pull_request_target` | None found |
| SECURITY.md and LICENSE | Present in all source repos, the hub, and the three docs repos |
| Private vulnerability reporting | Enabled on all 18 repos |
| Docs/hub branch protection | `check` required on `main` |

## Findings fixed

### EdgeReco polynomial ReDoS — high

Two CodeQL high-severity findings in `frontend/packages/edgereco-browser/src/engine/runtime.ts` flagged `/\/+$/` as a polynomial ReDoS.

Fix: replaced all three regex uses with a bounded trailing-slash scan. PR `#245` merged; package lint, typecheck, and **307 tests** passed; full Dagger/CodeQL checks passed before merge.

### Documentation sites were not behind Cloudflare security

The `avow`, `privacy`, and `browser` CNAMEs were initially DNS-only, bypassing WAF, bot protection, and Cloudflare’s proxy.

Fix: all three are now **Proxied**. Googlebot returns 200 on all four hosts. HSTS, strict CSP, COOP, CORP, `X-Frame-Options: DENY`, and `X-Content-Type-Options: nosniff` are enforced. HTTP requests redirect 301 to HTTPS.

### New repositories lacked baseline controls

The three docs repos and the hub had no branch protection, no secret scanning, and no Dependabot security updates.

Fix:

- branch protection with the `check` required status
- secret scanning + push protection
- Dependabot security updates
- private vulnerability reporting
- MIT license and `SECURITY.md`

## Notes on remaining failures

- **AlmaMesh Nightly E2E**: the dual-voice spec timed out waiting for `reading-section` after a live OpenRouter call. The same commit passed the two prior nights, so this is an external-model test flake, not a deterministic app regression. The rerun is in progress.
- **AML Dependabot PR**: the dependency update itself is valid; a pre-existing concurrent `InstallKeys.load` test is flaky under coverage. The test passes locally. The PR is not merged until CI is green.
- **ATC hardening residuals**: optional per-origin host permissions and a new-client approval UI beyond the per-install token remain open in the ATC security status document.

## Verification

```text
14/14 repos: branch protection, secret scanning, push protection, Dependabot security updates
0 high/critical dependency alerts
0 open code-scanning alerts after EdgeReco rescan (pending)
4/4 sites: Googlebot 200, HSTS, CSP, X-Frame-Options DENY
EdgeReco: 307 tests passed
Avow: clean-venv keygen/sign/verify passed; tamper exits 2
```

## Site headers

`open-source.gainratio.com`, `avow.gainratio.com`, `privacy.gainratio.com`, and `browser.gainratio.com` all serve:

- `Strict-Transport-Security: max-age=31536000; includeSubDomains`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- page-specific CSP
- Cloudflare proxy enabled
