# Independent Rate Bucket Bounds Judgment

Date: 2026-09-08. Reviewer: independent release-judge sidecar, not the implementation author. Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`. Campaign-reported baseline: `243d71d1d832b398cba86d5c7fcc70deefa25f25`, branch `codex/gpt6-review-implementation`, plus preserved dirty work. Git was not accessed; the exact reviewed candidate is identified by the source hashes below, not by an assertion that the baseline commit contains this patch.

## Decision

**Approved for the bounded rate-bucket implementation scope only.** No actionable correctness, performance, or security-regression finding was identified in the three owned source files and two focused test files. Confidence is high for the specified local fixed-window behavior, retained-entry bounds, and caller compatibility. There is no required remediation task within this scope.

This is not whole SEC-03 approval, proxy-trust validation, distributed-quota approval, production capacity certification, permission to deploy, or approval of the parent integration gate. No campaign/task status was changed. The parent owns the full check and release decision.

## Inspected Scope

- Read root `AGENTS.md`, campaign `AGENTS.md` and `campaign.json`, and `reports/rate-bucket-bounds-implementation.md`, `reports/admin-proxy-threat-model.md`, and `reports/owner-defaults-and-security-deployment.md` before judging the patch.
- Reviewed `src/lib/boundedRateLimiter.ts`, `src/lib/apiHttp.ts`, `src/pages/api/contact.ts`, `src/lib/boundedRateLimiter.test.ts`, and `tests/api/rateBucketBounds.test.ts` line by line. Compared both callers with their preserved pre-implementation snapshots without Git.
- Read the two existing compatibility test files, `vitest.config.ts`, saved red/green/compatibility/typecheck/fresh-process evidence, and the installed Vitest/Vite runner behavior needed for an isolated rerun. Compatibility results are used to assess regression risk, not to approve unrelated implementation work.
- The owner-selected contract is 4096 retained buckets per independent limiter, 256 UTF-16 code units per key, at most 16 expired deletions per valid access, unchanged allowances/windows, fail-closed 429 with Retry-After, and no active eviction or overflow bucket.

## Acceptance Reasoning

| Criterion | Independent judgment and references |
| --- | --- |
| Retained state | `src/lib/boundedRateLimiter.ts:1`, `:16`, `:49`, and `:54` enforce finite bucket/key bounds before insertion. Invalid keys are rejected without string coercion or retained allocation. There is one Map per factory instance, with no timer, secondary queue, or application-maintained tombstone collection. |
| Exact quotas | `src/lib/boundedRateLimiter.ts:27` expires at `resetAt <= now`; `:41` admits only while the counter is below the allowance. Denials do not increment or refresh the counter. API remains 60/60 seconds at `src/lib/apiHttp.ts:4`; contact remains 5/15 minutes at `src/pages/api/contact.ts:16`. |
| Expiry order | At `src/lib/boundedRateLimiter.ts:23`, logical time cannot decrease. All entries share one fixed window, and renewed entries are deleted before reinsertion, so insertion order remains expiry order. Accessing an active bucket does not reorder it. Cleanup cannot delete an active requested bucket. |
| Cleanup work | `src/lib/boundedRateLimiter.ts:25` through `:39` counts direct requested-key expiry toward the same 16-deletion budget. It performs at most 17 iterator next calls, including the terminating probe. The full-active overflow path probes only the oldest entry rather than explicitly scanning the Map. This bounds application-level operations, not engine-internal Map work or GC latency. |
| Capacity denial | `src/lib/boundedRateLimiter.ts:49` denies new identities without inserting or evicting anything. If cleanup removed an expired entry, size is already below capacity; therefore the full-capacity branch's oldest entry exists and is active. Existing identities retain their unused allowance. |
| Retry-After | `src/lib/boundedRateLimiter.ts:46` uses an exhausted identity's expiry; `:51` uses the earliest retained expiry for a full-map newcomer. Both round upward to at least one second. Invalid keys/time return the full-window retry value and cannot poison logical time. |
| API compatibility | `src/lib/apiHttp.ts:55` retains header-only beta authentication; `:75` adapts the helper's null/seconds result to the existing 429 body, no-store and Retry-After contract. Metadata caching and unrelated API behavior were not changed by this bounded patch. |
| Contact boundary | `src/pages/api/contact.ts:145` preserves clientAddress and lowercased submitted-email fallback. Denial at `:147` precedes SMTP configuration at `:152` and transport creation at `:157`. Response copy, validation flow and success behavior are unchanged; Retry-After is added to 429. |
| Regression coverage | `src/lib/boundedRateLimiter.test.ts:15`, `:32`, `:45`, `:55`, `:72`, `:94`, and `:103` exercise saturation, no coercion/allocation, counter saturation, cleanup budget, expiry order, rollback and invalid clocks. `tests/api/rateBucketBounds.test.ts:43` and `:115` exercise both real caller modules, including capacity recovery and mocked-SMTP denial. |

## Fresh Independent Evidence

Evidence directory: `output/project-review-followup/SEC-03/rate-bucket-bounds-judge/2026-09-08T08-09-39Z/`. The directory label was reserved before execution; actual run times are below. Root `.gitignore:12` ignores `output`. The runner refuses a second run over the same proof, preserves snapshots, and writes new evidence files exclusively. No earlier evidence was overwritten.

Executed from the worktree:

```powershell
& 'C:\Program Files\nodejs\node.exe' output/project-review-followup/SEC-03/rate-bucket-bounds-judge/2026-09-08T08-09-39Z/run-judge.mjs
```

The runner used the installed `startVitest('test', explicitFiles, options, viteOverrides)` API with repository configuration loaded through `configLoader: 'runner'`, `run: true`, `watch: false`, `maxWorkers: 1`, and `fileParallelism: false`. No test or hook timeout was increased, no assertion was changed, and no selected test was skipped. Runtime-only Vite overrides set `envDir: false` and an evidence-local cache directory; no source/configuration file was edited. Each child received only selected Windows runtime environment variables plus test-mode settings, without inherited application credentials. Private environment access and SMTP are mocked by the tests. Existing compatibility socket fixtures use loopback only; no external request, live SMTP, or browser was used.

| Run | UTC start / child close | Result |
| --- | --- | --- |
| Focused: `tests/api/rateBucketBounds.test.ts` and `src/lib/boundedRateLimiter.test.ts` | 08:12:10.619 / 08:12:11.833 | 25/25 passed, 2 files, exit 0; Vitest duration 740 ms. |
| Compatibility: `tests/api/executionPolicy.test.ts` and `tests/api/executionPolicy.judge.test.ts` | 08:12:11.835 / 08:12:15.165 | 64/64 passed, 2 files, exit 0; Vitest duration 2.98 s. |

Node: 24.20.0. Vitest: 4.1.10. Total: **89 distinct passing tests**, zero failed/pending/todo tests in these groups. The compatibility run started only after the focused child closed. Both stderr logs are empty. Machine-readable per-test results, invocation parameters, command arrays, exit codes, timestamps, source snapshots and hashes are saved in the evidence directory.

`summary.json` SHA-256: `cf40df5a75818eadbb753cf714b689ac9a2419bac3c7d1c3b63c536ce9529111`. A separate read-only hash check verified all 12 result/log artifacts against that summary with zero mismatches. Ten inputs, including both compatibility tests, repository test config and package/lock files, were hashed before, between and after execution with zero drift. The five frozen candidate files also match the earlier saved snapshot bytes.

## Candidate SHA-256

| File | SHA-256 |
| --- | --- |
| `src/lib/boundedRateLimiter.ts` | `ab1d895b6c3d92fcc2a4f116156f3e393970929959274f908c4cb9657cfe08d3` |
| `src/lib/apiHttp.ts` | `f102491c0949ec5eb54c752e5f74cedf814f8b91d52dcf66d9f4170556c34a12` |
| `src/pages/api/contact.ts` | `e95619c28f3d1e2b479172922f5a8efb8195ecb000583b68b373f7c0890e5fab` |
| `src/lib/boundedRateLimiter.test.ts` | `3e3f705734d0d0998044b9c9727f70e4912a5fa39fed8e79cf84eee7032ab3c2` |
| `tests/api/rateBucketBounds.test.ts` | `823c6a950d4e202fd043f876250cd1b2b46467bc1473c0e10c3c8b5e3fd7fbe6` |

## Preserved Evidence And Limits

- Earlier implementation evidence remains under `output/project-review-followup/SEC-03/rate-bucket-bounds/`. Read-only inspection confirmed the red run's seven failures/two controls, the later passing runs, and that the final integration-test edit added only explicit header-array type annotations. The initial two TypeScript errors remain recorded. The saved final scoped typecheck reports zero diagnostics, and two prior real Node children admitted their exact fresh-process quotas with the same helper hash. Neither typechecking nor those fresh-process probes was rerun by this judge; deployed worker replacement is untested.
- The parent reported a full `npm run check` exit 1 with multiple five-second test timeouts and browser cleanup timeouts under unconstrained workers. Those failures were not deleted, reclassified as passes, or independently diagnosed here. Resource contention is not proven as their sole cause by these focused passes. The parent's subsequent unchanged-source, bounded-worker full check is a separate gate and is not accepted by this report.
- Retained entry/key counts are bounded; total process heap, engine-internal Map allocation, request-body parsing, response allocation, GC pauses and sustained-load latency were not measured. No-traffic expiry can leave up to 4096 stale entries until valid access resumes. Invalid access need not trigger cleanup. Clock rollback conservatively delays recovery until wall time catches up; the logical-clock Retry-After is not a guarantee of recovery after a wall-clock correction.
- Rejecting newcomers at capacity deliberately permits availability impact from identity churn within a window. Per-process resets, multi-worker/distributed quotas, forwarded-header trust, direct-origin behavior, production traffic, real SMTP and broader admin/security concerns remain outside this acceptance. No architecture rewrite or additional implementation task is required by the evidence in this bounded scope.

## Cleanup And Handoff

Both Vitest contexts completed `close()`. Their immediate close snapshots still show PipeWrap/ProcessWrap types during shutdown; they are not claimed as zero-handle snapshots. The supervising runner then observed normal child close with exit 0 for PIDs 28100 and 37256, and the runner PID 30128 exited 0. At 08:12:51.080 UTC a targeted local `Get-CimInstance Win32_Process` query for these three PIDs and their direct children returned zero remaining processes. There is no retained judge test process, server, browser, or source lock.

The parent was explicitly signaled immediately after both test groups finished, before report writing, that its bounded-worker full integration could begin. No further tests were run after that signal. Only this report was manually edited afterward; earlier failures and all frozen source/test/configuration files remain untouched. No Git operation, deployment, public action, credential-file access or unrelated worktree mutation was performed.
