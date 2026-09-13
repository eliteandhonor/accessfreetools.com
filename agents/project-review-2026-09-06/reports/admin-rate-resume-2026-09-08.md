# Admin And Rate-Limit Resume

September 8, 2026. Worktree: `accessfreetools-gpt6-review`, branch
`codex/gpt6-review-implementation`, HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25`
plus preserved local changes. This is local integration evidence, not a release.

## Independent Decisions

- [Admin no-persistence judge](admin-no-persistence-judge.md): local approval of
  explicit token entry and transient credential lifetime. Its 128 tests passed
  across four files, with unchanged source hashes. No browser storage, URL,
  cookie or global token persistence is introduced. This does not provide
  arbitrary same-origin-script isolation or server-side token revocation.
- [Rate-bucket judge](rate-bucket-bounds-judge.md): local approval of the bounded
  limiter. Fresh September 8 reruns pass 25 focused and 64 compatibility tests.
  Each limiter retains at most 4096 keys of at most 256 code units and deletes
  at most 16 expired entries per valid access. Existing quotas are preserved;
  new identities at capacity receive 429 with Retry-After, without evicting
  active identities. This is not distributed rate limiting or proxy validation.

SEC-03 stays in_progress: forwarding-header trust and direct-origin behavior
remain unverified. No auth-origin, DNS, hosting or SMTP change was made.

## Integration Diagnosis

All evidence directories below are under
`output/project-review-followup/SEC-03/integration/`.

| Execution | Result |
| --- | --- |
| `2026-09-06T13-22-25.851Z` | Earlier full gate failed: two test timeouts and four browser teardown-hook timeouts. Retained. |
| `2026-09-08T08-03-44.992Z` | Unchanged default full gate failed: 31 tests failed, 2395 passed and 67 were skipped by four failed setup hooks. All 2145 captured source files were unchanged. |
| `2026-09-08T08-12-39.125Z` | Same full gate, with process-local `VITEST_MAX_WORKERS=4`: 2493/2493 tests in 108 files passed, build and every later gate passed, audit zero. All 2145 files and HEAD unchanged. Completed 08:17:23.878 UTC. |
| `2026-09-08T08-18-02.641Z` | Normal full gate after the configuration change, override removed: 2493/2493 tests in 108 files passed (89.64 seconds), complete gate and zero audit findings. All 2145 files and HEAD unchanged. Completed 08:22:09.205 UTC. |

Installed Vitest 4.1.10 resolves 19 concurrent files on this 20-CPU host when
unconfigured. Several files launch browsers, build fixtures or Git subprocesses.
A read-only resource snapshot recorded about 4.37 GiB free of 63.75 GiB. The
matching-source failure/pass pair supports reducing test-runner contention; it
does not identify or blame another application, or prove every historical
timeout had the same cause. No unrelated process was stopped.

`vitest.config.ts` now caps files at `Math.min(4, availableParallelism())` using
Node's standard API. No assertions, deadlines, retries, isolation settings,
file selection or product code changed for this fix. The deployment checklist
records the cap and prohibits concurrent heavy checks during full verification.
[Vitest's worker setting](https://vitest.dev/config/maxworkers.html) provides the
supported control; the installed source also confirms its environment override.

The final normal `npm run check`, with no environment override, passed. Its
log SHA-256 is `0fcf752d4d5e4be8c334a58b2a7172c789bc1f54d88f7eb17a38cd329a298eae`.
The only source/config difference between the two passing snapshots is
`vitest.config.ts`. The [independent integration judge](admin-rate-integration-judge-2026-09-08.md)
approved this local configuration and completed gate with no required fixes.
Dirty-source release receipts remain unverified even when local checks pass.

The remaining gates validated 674 HTML pages, 1984 JSON-LD blocks, seven articles
at four viewports, 15 key page/viewport pairs, 27 automated accessibility cases,
and lazy AI requests on 665 non-AI pages plus nine AI pages. Existing five soft
image/CSS warnings and 55 unresolved manual accessibility checks are not waived
or described as conformance. Both compile lanes and the dependency audit passed.

## Live And External Boundaries

Fresh `automation:env-check` at 08:03:02.983 UTC is healthy on Node 24.20.0.
Hostinger and DataForSEO credentials work; no paid research was run. At
08:11:26.818 UTC the existing Hostinger API confirmed the same completed Git
build `01a076ca-b9a4-720d-9750-51ede0875ea3`, Node 24, `dist`, and `app.js`.
The security-only checkout remains clean at `b4fffbc4`. No second deployment
occurred. Existing tokens were read in memory, not copied to another checkout.

The newly opened Hostinger tab in the owner's Chrome profile redirected to its
login screen. This replaces the earlier unattached-debugger diagnosis with a
current login gate, not a claim that the hosting account is broken. No login,
challenge bypass, Edge switch or settings change was attempted. Provider records
still do not directly bind the live runtime to a Git SHA. Earlier successful
API/sitemap checks and failed rendered checks remain separately dated evidence.

The transcriber, real-model/browser/privacy/beta gates, production measurement
continuity and full release judgment remain open. Original promotion dirty work
was preserved. No commit, push, purchase, public post, ad activation, indexing
request, or global-memory change follows from this checkpoint.

All parent test/check sessions and independent judge executions have completed.
Campaign structure verification passes for nine agents, nine goals and 29 tasks.
The existing task totals remain unchanged because the open parent contracts
still require their separate production and product evidence.
