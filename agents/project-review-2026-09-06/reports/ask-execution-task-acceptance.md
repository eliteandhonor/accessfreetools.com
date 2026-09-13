# COR-06 Independent Local Task Acceptance

Date: 2026-09-06, Australia/Brisbane. Independent Release Judge, COR-06 only.

## Decision

**COR-06: LOCAL APPROVE.** The whole exact local task contract is satisfied on the source fingerprinted below. No remaining task-blocking finding was found after reviewing the implementation, its tests, the retained source-matched full gate, and 27 new independent probes. This is a task acceptance decision, not another evidence-ready recommendation.

This does not approve deployment, production behavior, the entire campaign, or any other task. Existing COR-02 and SEC-01 local approvals were inspected as dependencies, not reissued here. No manifest, board, task state, source, shared test, or worklog was changed. The parent alone owns those records and the separate transcriber investigation.

## Contract And Scope

Read root and campaign AGENTS, correctness and Release Judge task instructions, campaign COR-06, the original PS-03/PS-06 findings, and both `ask-execution-policy-implementation.md` and `ask-execution-policy-judge.md`.

Exact campaign doneRule: "Document shared beta/public policy. Test configured/unset token, wrong/query credentials, discovery, 429 and MCP init/list/call. Mocked stalled request/body aborts by deadline; disconnect cancels upstream; UI recovers. No unsupported production per-IP guarantee."

The original PS-06 explicitly concerns hosted-model request and response-body waits. The missing incoming-upload deadline is a separately documented limit, not a hidden exception to this task. No real model request is required by that finding's acceptance criteria.

Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`.
Branch: `codex/gpt6-review-implementation`.
HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25` plus existing dirty reviewed source.
Baseline `origin/main`: `90d6dcab0580a91ca66382f2414d95e8817469e5`.
Clean-install fixture, read only: `C:/Users/chamb/AppData/Local/Temp/aft-sec01-integration-FHwIkG/worktree`.

## Acceptance Findings

| Exact Requirement | Independent Evidence And Conclusion |
| --- | --- |
| Document shared beta/public policy | PASS. [Policy:120](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/docs/ask-api-mcp-alpha.md:120) explicitly covers public token-unset operation, supported headers, public HTTP metadata, protected MCP initialize/list/call, shared quota, no batches and proxy caveats. Actual handlers call the same [access helper:54](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/apiHttp.ts:54) and [quota helper:74](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/apiHttp.ts:74) before body reads. |
| Configured/unset, missing/wrong/query credentials | PASS. Complete existing 36-case execution-policy file rerun. All three interfaces reject missing/wrong/query-only credentials and accept each supported header; token-unset execution succeeds. New probes make 61 unauthorized attempts per interface, assert zero body reads, then prove all 60 authorized quota units remain available. No provider invocation on these paths. |
| Discovery, 429 and MCP lifecycle | PASS. Real SDK initialize/list/call responses remain compatible. New probes verify public HTTP catalog, schema and OpenAPI while authenticated MCP discovery consumes the shared execution quota. At exhaustion all three interfaces return 429 before body reading; existing tests verify no-store, Retry-After rounding and reset. Missing addresses demonstrably share the unknown bucket; changing caller-supplied forwarding headers does not create another bucket in direct handler calls. This is not a proxy/IP guarantee. |
| Reject execution amplification | PASS. Existing J2 tests rerun without filtering: JSON-RPC arrays, including empty/singleton/invalid arrays, are rejected before MCP server creation. Single requests are parsed once; malformed JSON and SDK Accept/Content-Type failures retain their tested contracts. [MCP boundary:39](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/pages/mcp.ts:39). |
| Bound provider request and response-body waits | PASS. [Deadline helper:4](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askRequest.ts:4) races the whole operation, aborts on interruption/error and removes timers/listeners. [Provider call:449](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:449) uses the helper around fetch AND JSON reading. New exact-boundary probe supplies headers at 29,000 ms, confirms no premature abort at 29,999 ms, then requires sanitized 504 at exactly 30,000 ms. The deadline does not restart after headers. A body completing at 29,999 ms succeeds without a later timeout. |
| Disconnect cancels upstream and late work cannot run | PASS. Existing manual-signal and adapter/socket tests rerun in full. Two new composed tests use the actual Ask handler, Astro Node request conversion/response writer, real client sockets and Node fetch redirected only to a synthetic loopback server. After client disconnect, upstream request/body sockets close and the internal handler result is sanitized 408. Observed closure was 497 ms/request and 31 ms/body, both inside the unchanged 1,500 ms assertion bound. New late-body probes spy on the real deterministic runner and prove no invocation after timeout/cancellation. |
| Error-path cleanup and truthful responses | PASS. Existing J1 real-loopback test again proves an unfinished provider 503 body closes. Body/argument parse failures and rejected provider requests remain sanitized 503, timeout 504, cancellation 408, with no fake run or raw provider error. Helper success/error cleanup tests remain green. [Ask status mapping:24](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/pages/api/v1/ask.ts:24). |
| Actual UI recovery | PASS. Actual React AskToolChat and current global CSS were mounted in isolated Chromium. New tests feed browser requests responses generated by the current actual Ask handler for 400, 401, 408, 429, 503 and 504, at both 390px and 1280px. Every error renders in the polite live region, submit becomes usable, and a subsequent deterministic request displays 180 and removes the old error. The simulated underlying failure is removed before retry; this does not claim retry bypasses a still-configured beta token or exhausted quota. Twelve flows, 24 screenshots, no page errors or horizontal overflow. |
| Exact browser deadline, stale response and unmount | PASS. Two new real-browser request/body fixtures use Playwright's browser clock with the production 35,000 ms constant unchanged. They require no error/abort at 34,999 ms, timeout/abort at 35,000 ms, stale response isolation during retry, successful retry surviving another 35,000 ms, and abort on unmount with no late render. Existing four component lifecycle tests also rerun unchanged. [Component ownership:64](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/AskToolChat.tsx:64). |
| Latest grouped-expression fix and deterministic regression | PASS. All 453 existing Ask router cases rerun. New grouped-chain checks assert 400/no run/no provider in both model-enabled local-router modes, then verify an unrelated ambiguous request still accepts a controlled provider fixture and returns deterministic 180. This directly exercises the current [terminal guard:426](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:426) without rejudging COR-01/02. |

## Fresh Commands And Results

Run from the review worktree:

```powershell
node output/project-review-followup/COR-06-task-judge/run.mjs
```

The runner invokes the following with synthetic environment values, privateEnv mocked, a loopback-only fallback fetch guard, an owned Vite cache, and no installs:

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner --config output/project-review-followup/COR-06-task-judge/vitest.config.mjs --maxWorkers=1 --reporter=verbose --reporter=json --outputFile.json=C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-06-task-judge/2026-09-06T10-25-11.895Z-tests.json
```

Final run began at 10:25:14 UTC / 20:25:14 AEST, Vitest duration 16.38 seconds: **571 passed, 0 failed, 0 skipped/pending, 0 todo, eight files, exit 0**. File counts: API routes 21; Ask router 453; previous independent execution judge 28; execution policy 36; MCP 2; existing UI lifecycle 4; new policy probes 13; new UI probes 14. This is 544 existing tests plus 27 new probes, not a full-suite rerun. No assertion or timeout was weakened, and no test-name filter was used.

The separate 195-case COR-01/02 judge file was inspected and source-matched but intentionally not executed here because its afterAll writes into another worker's frozen output directory. Its cases are NOT included in the 571 count. They are included in the separately retained full gate.

Proof root: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-06-task-judge/`.

- [Final test log](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-06-task-judge/2026-09-06T10-25-11.895Z-tests.log), [structured results](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-06-task-judge/2026-09-06T10-25-11.895Z-tests.json), and [before/after source and runtime receipt](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-06-task-judge/2026-09-06T10-25-11.895Z-run.json).
- [Real request disconnect](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-06-task-judge/loopback-request.json), [real body disconnect](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-06-task-judge/loopback-body.json), and `ui-exact-deadline-{request,body}.json` record the additional lifetime assertions.
- Screenshot inspection confirmed readable error/retry states, no overlapping text, and usable controls in [mobile error](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-06-task-judge/ui-390-504-error.png), [mobile retry](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-06-task-judge/ui-390-504-retry.png), [desktop error](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-06-task-judge/ui-1280-504-error.png), and [desktop retry](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/COR-06-task-judge/ui-1280-504-retry.png). These are mounted-component fixtures, not screenshots of a newly built full Astro page.

## Preserved Failures

Two failed harness runs remain intact; neither is represented as approval evidence:

1. `2026-09-06T10-22-41.591Z-{tests.log,tests.json,run.json}`: 544 tests passed but both new suites failed to import. Judge-owned imports went up four directories instead of three. Corrected only those imports, including the setup mock path. No local `.local/ollama.env` file exists in this worktree; no credential file content was read. External fetch remained forbidden.
2. `2026-09-06T10-23-42.567Z-{tests.log,tests.json,run.json}`: 569 passed, two failed. Both real socket tests had already observed upstream cancellation/closure, then incorrectly called `.json()` on a Response consumed by Astro's writer. The fixture now captures `completed.clone().json()` before passing the original response to the writer. The exact 408 body assertion and 1,500 ms closure bound are unchanged. No production fix or assertion relaxation was made.

Earlier J1/J2 and COR-02 rejection evidence remains untouched in its original owned locations.

## Retained Full Gate And Source Identity

Independently inspected [final full-check report](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/SEC-01/final-2026-09-06T09-57-59.746Z/report.json) and its `full-check.log`, plus the linked clean-install report. The latest full gate completed at 10:02:13.851 UTC: 2,405 tests / 103 files, both typecheck lanes, build and all remaining stages passed, audit zero vulnerabilities. It used two workers in the parent's real detached clean-install fixture. This judge did not rerun or alter that gate.

The gate's 2,506-file source manifest is `output/project-review-followup/SEC-01/recheck-2026-09-06T09-54-01.641Z/source-files.json`, SHA-256 `0591964992eb4eb8576280892a060c19d70026d7131714532876efe7aaa66ee3`. Independently rehashed every manifest file in both trees before and after the fresh tests: fixture drift zero; current tree has 12 later campaign-report/task/bookkeeping differences, none in application source, tests, package/lock or the 27 scoped files. All 27 scoped hashes match the retained full gate and fixture exactly and have zero drift during this review. The complete paths/hashes and all 12 differences are in the final run receipt.

Principal current SHA-256 values:

| File | SHA-256 |
| --- | --- |
| `src/lib/askRequest.ts` | `075565229eb8f23790cbdfe9e49b0e6bd27e33a21980dccb2380e24413a6ea53` |
| `src/lib/askToolRouter.ts` | `b557e7b294f3f5dcf93933c1d7e2f66b1bf80e7c3890bf8c9ca7b8cb8b6aaa52` |
| `src/lib/apiHttp.ts` | `ed324c6cbf709e6601868f11f46c0818b79852bcf0f8b7cedca953b21e577589` |
| `src/pages/api/v1/ask.ts` | `4876289bc029dabde9bd9179a757d724fe3a0dc9ea8dc10433e6791af4e17780` |
| `src/pages/mcp.ts` | `cab9db0063b868c09f2150d92e36bcb19a4b4acce5c54329d5a89ed76f3004ed` |
| `src/components/AskToolChat.tsx` | `c05b3003395ff4b0422a2a0d2adbc06ed0534fbae2d7ca4396816e1ff342e565` |
| `docs/ask-api-mcp-alpha.md` | `524e01b077f815a2b16e38cadd732523fe0df61014543fad8a67f924bfcc906f` |
| `package.json` | `2a1fb51bb2b99978e20f0dd538df02a845796445dcc29f0eb293bc571458f74f` |
| `package-lock.json` | `8a11c438dc8ec46a6d288dc63ecc753d7f7375d20bbc2d55ed2a61f9c47bc48b` |

Fresh runtime: Node v24.20.0, Vitest 4.1.10, Playwright 1.62.0, Astro 7.1.5, Node adapter 11.0.3. Compiler distinction was verified rather than inferred: both current and fixture TypeScript package metadata say 6.0.2, while both loaded compiler APIs return 6.0.3. No compiler lane was rerun against shared dependencies; clean-install and typecheck proof remains the retained detached-fixture gate, not an assumption from the package label.

The full-check receipt deliberately records dirty source, `verified:false` and `releaseApproval:false`. Its successful checks support local acceptance of bound source; they do not authorize deployment. The log's broader manual-accessibility backlog and build-size warning are not being converted into whole-site approval.

## Untested And Intentionally Unperformed

- No `npm run check:live-ask` against production. That command on old production would test the old deployed revision, not this local implementation. The earlier 04:31 UTC `COR-06/local-runtime.json` is explicitly parser-forced local built Astro proof; it is supplementary history, not a fresh grouped-expression or production result. Current acceptance instead uses fresh exact handlers/UI plus the source-matched full gate, as authorized for this local judgment.
- No Hostinger proxy/disconnect/IP validation, deployed beta-token verification, provider availability/latency/load test, distributed/in-flight limit claim, or device/browser matrix beyond local Chromium. These remain live-release or separate-capacity evidence, not unfulfilled local COR-06 requirements.
- No claim of a server-side incoming-upload time deadline, provider-body byte cap, or bounded retention for rate-limit buckets. Existing tests explicitly show incoming-body reads are outside the upstream helper. The original finding distinguishes this from the adapter's byte limit; no general upload-protection approval is granted.
- No new npm install/npm ci, fullcheck, application build, commit, deployment, provider/account/public action, or user media/data use. The esbuild operation was a write:false in-memory component test bundle only. Existing tests were not edited; all new helpers are `.mjs` under the allowed ignored directory.
- Owned new browser instances and loopback servers close in finally; cleanup JSON records disconnected browsers/stopped listeners. All three test runner invocations exited. The final verification receipt checks the last owned test PID and freezes report/helper/proof hashes. No unrelated process was stopped.
- Report hygiene: ASCII text inspection only; no watermark service/network call, rewriting, mark removal or disclosure removal. This private review is not a public-content provenance claim.

**Required COR-06 fixes: none.** Parent may record this exact LOCAL APPROVE decision in its own task state. All other tasks and every deployment/whole-goal gate remain separate.
