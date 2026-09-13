# Rate Bucket Memory Bounds Implementation

Date: 2026-09-06. Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`, branch `codex/gpt6-review-implementation`, HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25` plus existing dirty work and this bounded patch. Source and tests frozen at 13:20 UTC. This is coordinator-authorized implementation evidence, not independent acceptance, deployment proof, or whole SEC-03 approval.

## Changes And Scope

- `src/lib/boundedRateLimiter.ts:1`: one shared pure factory, two independent limiter instances. Hard bounds of 4096 retained buckets and 256 UTF-16 code units per key; no capacity setting or dependency. Non-string, empty, whitespace/control-containing and oversized keys fail closed without coercion or bucket allocation. Invalid clock values also fail closed.
- `src/lib/boundedRateLimiter.ts:23`: nondecreasing logical time preserves insertion/expiry order across wall-clock rollback. Each valid access removes at most 16 expired entries, including direct removal of an expired requested identity. No timer, secondary queue, tombstones maintained by application code, or full-map overflow scan. Denied counters saturate at the allowance.
- `src/lib/boundedRateLimiter.ts:49`: a full limiter rejects a new identity without active eviction, allocating an overflow bucket, or spending an existing identity's remaining quota. Retry-After is the rounded-up earliest remaining expiry, minimum one second. Invalid keys receive a full-window retry value.
- `src/lib/apiHttp.ts:75`: uses the helper, preserving 60 requests per 60 seconds, the prior dirty Retry-After improvement, exact response copy, no-store, metadata caching and header-only beta authentication.
- `src/pages/api/contact.ts:144`: uses a separate helper instance, preserving five messages per 15 minutes, existing clientAddress/submitted-email selection, validation and response copy. Adds Retry-After to 429 responses before SMTP transport creation.
- Added only `src/lib/boundedRateLimiter.test.ts` and `tests/api/rateBucketBounds.test.ts` for focused regressions. No private-admin, analytics identity, other source/tests, packages, deployment configuration, campaign state or worklog edits.

Read root/campaign AGENTS, the security and TDD skills, `docs/ask-api-mcp-alpha.md`, and `agents/project-review-2026-09-06/reports/admin-proxy-threat-model.md`. Public copy was not changed. Inspected the owned source, existing execution-policy tests/routes, Vitest configuration and the pre-existing owned diff.

## Commands And Results

All commands ran from the worktree above. Proof directory: `output/project-review-followup/SEC-03/rate-bucket-bounds/`. The runners retain command arrays, logs and SHA-256-bound source snapshots, and refuse to overwrite an existing phase.

| Command | Actual result |
| --- | --- |
| `node output/project-review-followup/SEC-03/rate-bucket-bounds/run-focused.mjs red` | Exit 1: 7 behavioral failures, 2 passing controls. Both old handlers admitted identity 4097 and invalid keys; contact omitted Retry-After. Original bytes and failures retained under `red/`. |
| `node output/project-review-followup/SEC-03/rate-bucket-bounds/run-focused.mjs green` | Exit 0: 25/25 tests, 2 files. |
| `node output/project-review-followup/SEC-03/rate-bucket-bounds/run-focused.mjs compatibility` | Exit 0: 64/64 existing tests, 2 files. REST/MCP/Ask shared quotas, header-only authorization, no-store, parser/error/deadline/disconnect behavior remain green. |
| `node output/project-review-followup/SEC-03/rate-bucket-bounds/verify.mjs` | Exit 1: two new test-fixture header-union TypeScript errors. Both real fresh-process reset probes passed. Initial diagnostics retained in `typecheck.log` and `verification.json`. |
| `node output/project-review-followup/SEC-03/rate-bucket-bounds/run-focused.mjs green-final` | Exit 0: 25/25 after adding explicit HeadersInit array annotations only. No assertion removed, filtered or weakened. |
| `node output/project-review-followup/SEC-03/rate-bucket-bounds/verify.mjs final` | Exit 0: zero TypeScript diagnostics for the five owned source/test roots and their imports; final hashes match `green-final`. Reuses the successful fresh-process proof only after asserting the limiter source hash is unchanged. |

Vitest invocation uses the repository script's `node node_modules/vitest/vitest.mjs run --configLoader runner`, explicit files, `--maxWorkers=1 --reporter=verbose`. New tests: `tests/api/rateBucketBounds.test.ts src/lib/boundedRateLimiter.test.ts`. Compatibility files: `tests/api/executionPolicy.test.ts tests/api/executionPolicy.judge.test.ts`. Node 24.20.0, Vitest 4.1.10, actual TypeScript API 6.0.3. No skipped tests counted. Final distinct passing tests: 89; reruns are not additional coverage.

Synthetic tests cover exact quota/window boundaries, 4096 retained plus 4096 denied identities, existing first/last quotas, earliest-expiry recovery, maximum 16 deletions per access, one oldest-entry read per full overflow, key bounds/no coercion/no bucket allocation, 10,000 denied attempts with an unchanged finite counter, rollback/non-finite clocks, independent instances, API response contracts, and real contact-handler calls with mocked SMTP. Two distinct Node children directly imported the actual pure TypeScript module; each admitted 60 and five requests respectively before denial, proving fresh-process state starts empty. This is not a deployed worker-restart test.

## Frozen SHA-256

| File | SHA-256 |
| --- | --- |
| `src/lib/apiHttp.ts` | `f102491c0949ec5eb54c752e5f74cedf814f8b91d52dcf66d9f4170556c34a12` |
| `src/pages/api/contact.ts` | `e95619c28f3d1e2b479172922f5a8efb8195ecb000583b68b373f7c0890e5fab` |
| `src/lib/boundedRateLimiter.ts` | `ab1d895b6c3d92fcc2a4f116156f3e393970929959274f908c4cb9657cfe08d3` |
| `src/lib/boundedRateLimiter.test.ts` | `3e3f705734d0d0998044b9c9727f70e4912a5fa39fed8e79cf84eee7032ab3c2` |
| `tests/api/rateBucketBounds.test.ts` | `823c6a950d4e202fd043f876250cd1b2b46467bc1473c0e10c3c8b5e3fd7fbe6` |

Original preserved API/contact hashes: `ed324c6cbf709e6601868f11f46c0818b79852bcf0f8b7cedca953b21e577589` and `7af2ccd829f27588257ac919857249b1efbf54d6b597a79a76578f3c7a6fd9cf`. Original failing test snapshot hash: `a8557b01c97c03d090742d935320ef0e63c2402d492f113c58888a3acf6208c9`. These snapshots remain byte-identical under `red/`; the final test differs only in the header-fixture type annotations.

## Limits And Handoff

Confidence is high for the local bounded-state and preserved-quota behavior covered here. This bounds retained identities, not total request parsing/response allocation or measured process heap bytes. With no traffic, expired entries may remain resident, always within 4096; cleanup resumes on valid access. Backward clock movement conservatively delays expiry until wall time catches up. A full limiter intentionally denies newcomers, so identity flooding can still affect availability within the fixed window. Existing identities retain their allowances.

This remains per-process, resets on process replacement, and is not a distributed quota. Proxy normalization/direct-origin behavior is still unverified and unchanged. No claim of spoof-resistant per-IP identity, independent task approval, or production DoS mitigation completeness. Full check/build, real SMTP, live requests/flooding, production proxy/restart checks and deployment were intentionally not performed. Next step is independent scoped acceptance and the parent-owned aggregate gate; no additional implementation is proposed by this report.

Cleanup: all synchronous test runners and Node children exited; the fresh-process children (PIDs 39220 and 36468) were absent on the final targeted process check. Only a stdout PipeWrap was reported inside each child before exit, with no timer/TCP handle. Existing compatibility tests owned and closed their loopback servers/sockets; their workers exited normally. No browser, background server, external network request, real email, user profile, credential file, install, Git mutation or publishing action was used. No owned resource or source lock remains.
