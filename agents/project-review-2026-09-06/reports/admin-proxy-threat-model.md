# Admin Storage And Proxy Boundary

Date: 2026-09-06. SEC-03, design lane, in progress. Worktree `codex/gpt6-review-implementation`, HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25` plus uncommitted changes. Exact source, installed-adapter and built-admin hashes and observation time are in `output/project-review-followup/SEC-03/boundary-proof.json`.

This is a scoped threat model, not an incident report or completed mitigation. No live credentials, private browser, traffic flooding, authentication changes, or deployment were used. Independent architecture review is pending: prior specialists stopped at the account usage limit. The coordinator performed sequential source and synthetic runtime passes, not independent approval.

## Overview

The managed Astro 7 / Node 24 application serves public pages, admin shells, header-authenticated aggregate analytics, and report-refresh commands. Media inference is unrelated to this scope. No purchase is required or authorized.

| Surface | Actual boundary and evidence |
| --- | --- |
| Sign-in | `src/pages/admin/index.astro:191` saves the accepted shared token in tab sessionStorage; dashboard clients reuse it in a custom header. |
| Private data | `src/pages/api/analytics/events.ts:93` and `src/pages/api/admin/agent-tools.ts:37` check the token before reads. Agent refresh checks it before work at line 48. Responses are no-store. |
| Public scripts | `src/components/BaseLayout.astro:50` excludes Clarity on private paths. This is not an origin boundary around browser storage. Advertising has separate owner, route and consent controls. |
| API quota | `src/lib/apiHttp.ts:74` uses a per-key window. REST and MCP pass Astro's clientAddress. Beta authentication remains header-only. |
| Contact | `src/pages/api/contact.ts:98` has its own per-key window; line 160 uses clientAddress or submitted email. The probe never invoked this SMTP-capable handler. |
| Analytics identity | `src/lib/siteAnalytics.ts:269` prefers CF, real-IP, first forwarded-for, then clientAddress. That value feeds owner exclusion, hashing and quotas. |
| Adapter | Installed `node_modules/astro/dist/core/app/node.js:52` can accept the first forwarded-for address when a host matches allowedDomains. Host matching does not establish a trusted forwarding peer. |

## Trust Model

Protect the reusable admin credential, private reports, refresh authority, mail capacity, process memory, and measurement integrity. An anonymous visitor does not know the credential. A hostile script executing in the public page's origin would have JavaScript authority there, not permission to read admin data. That scenario requires script execution and a token-bearing tab or related window; no malicious script was observed.

SessionStorage is scoped by origin and tab, not by `/admin/`. Noindex, DOM masks and Infolinks comments do not isolate it. The shared token is not an expiring server session. Clearing this tab's saved copy does not revoke a copied token at the server. No cookie-session expiry or CSRF guarantee is currently claimed.

Hostinger proxy rewriting and direct-origin reachability are unverified. Healthy deployment status and allowedDomains do not prove who overwrites CF, real-IP or forwarded-for headers. The installed adapter also means clientAddress cannot automatically be equated to a verified socket peer.

## Observations And Mitigations

| Priority | Observed behavior / conditional risk | Controls and limits | Proposed bounded response |
| --- | --- | --- | --- |
| P2 | Actual built admin code saved a synthetic credential; a same-origin public fixture read it after navigation. Hostile same-origin script could obtain reusable authority if these prerequisites held. | Private pages omit ads/Clarity. Wrong/query-only credentials are rejected. This is not an unauthenticated API bypass or evidence of theft. | Interim: dedicated admin-only browser profile with owner suppression and analytics opt-out, without public ad browsing. This is operational guidance, not enforced app isolation. Obtain owner approval before changing auth/origins. |
| P2 | API and contact Maps retained 5,001 entries after 5,000 synthetic keys, one elapsed day and a new request. Reusing one key does not evict other expired keys. | Existing per-key quotas work. No production memory exhaustion or attack measured. | Propose one bounded limiter with periodic expiry, finite capacity, preserved live buckets, and a bounded shared overflow bucket with Retry-After. Preserve existing per-key windows/allowances. Owner must approve capacity/overload semantics; test expiration, capacity, new/existing identities and process restarts. |
| P2 | Analytics accepted a supplied CF header ahead of clientAddress. Installed Astro accepted a supplied forwarded address for an allowed host in an offline request. | Production proxy may overwrite these correctly. No forged live request or false exclusion was demonstrated. | First verify proxy rewriting and origin access; then admit only the proven normalized address path. Do not call IP-based exclusion spoof-resistant without that evidence. |

### Authentication Decision

Do not silently replace the token flow with a cookie. HttpOnly stops JavaScript from reading a cookie, but same-origin script may still make authenticated requests and read responses. SameSite and cookie Path do not isolate this same-origin scenario. A cookie-only patch is not a complete PS-H2 fix.

If operational isolation is insufficient, the stronger candidate is a separate admin origin on existing hosting, with a short-lived opaque HttpOnly/Secure/host-only session, expiry, logout revocation, strict origin/CSRF checks for mutations, no permissive credentialed CORS, and no third-party scripts. Verify the existing hosting plan supports it without purchase, then obtain bounded approval for auth/DNS/hosting changes. No write is approved by this report.

Alternatively, keep reusable credentials out of browser storage and require explicit entry for privileged operations while suppressing third-party execution throughout the workflow. That reduces persistence at a convenience cost and still needs window/opener/navigation tests. Neither alternative is implemented or approved here.

## Evidence And Acceptance

`node output/project-review-followup/SEC-03/boundary-proof.mjs` completed in isolated Chromium 151, using actual built admin HTML, synthetic API responses, fictional origins and no network passthrough. One wrong header was rejected, two correct checks passed, same-origin reading succeeded, and clear removed the saved value before subsequent public navigation. Reports store booleans/counts and hashes, not credential values.

Rate probes transpile the real modules and call their own functions with a synthetic clock. The analytics probe extracts its exact function through the TypeScript AST. The adapter probe calls installed createRequestFromNodeRequest with documentation-range addresses. No SMTP, private refresh, real production analytics or external scripts ran.

SEC-03 remains in progress. It needs owner selection, independent review, auth compatibility and missing/wrong/query denial tests, no-store, logout/expiry proof, CSRF tests if cookies are chosen, verified proxy assumptions, and finite bucket memory under capacity/expiry tests. The observation runner intentionally describes unfixed behavior, not acceptance of a mitigation.

Severity calibration: no critical incident or unauthenticated remote compromise is shown. Token disclosure is consequential but conditional; retained buckets do not prove production DoS; proxy spoofability is deployment-dependent. Do not claim hostile traffic or a required architectural rewrite.

Primary references checked September 6: [OWASP HTML5 Security](https://cheatsheetseries.owasp.org/cheatsheets/HTML5_Security_Cheat_Sheet.html), [OWASP Session Management](https://cheatsheetseries.owasp.org/cheatsheets/Session_Management_Cheat_Sheet.html), [OWASP CSRF Prevention](https://cheatsheetseries.owasp.org/cheatsheets/Cross-Site_Request_Forgery_Prevention_Cheat_Sheet.html), [Astro adapter reference](https://docs.astro.build/en/reference/modules/astro-app/). Installed adapter code supports the exact forwarding observation.
