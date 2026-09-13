# Ask And Execution Policy Implementation

Date: 2026-09-06. Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`, branch `codex/gpt6-review-implementation`, HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25` plus uncommitted work. Scope: COR-06, findings PS-03/PS-06. No deployment or release approval.

## Changes

- `src/pages/mcp.ts` now checks the same optional header token and fixed-window quota as REST and Ask before constructing a transport. All MCP POSTs follow this policy, including initialize/list/call. Public HTTP discovery remains public.
- `src/lib/apiHttp.ts` adds `Retry-After` seconds to 429 responses. The existing single-process address-keyed limiter is not a claimed distributed or production per-IP limit.
- `src/lib/askRequest.ts` owns a 30-second provider deadline and 35-second browser deadline. It aborts the fetch and races the full request/body operation even when a transport ignores abort, and removes timers/listeners after settlement.
- `src/lib/askToolRouter.ts` propagates cancellation and distinguishes unavailable routing from unsupported questions. Existing deterministic parsing and prior correctness fixes remain intact.
- `src/pages/api/v1/ask.ts` passes the incoming signal and returns sanitized 504 `ASK_TIMEOUT`, 408 `ASK_CANCELLED`, or 503 `ASK_UNAVAILABLE`, without invented answers or provider-error disclosure.
- `src/components/AskToolChat.tsx` aborts on unmount, ignores late responses, releases loading state on failure, and permits a fresh retry.
- `docs/ask-api-mcp-alpha.md` documents public/beta execution, public discovery, status codes, deadline scope and proxy caveats.

## Proof

Initial new server tests reproduced 14 missing policy/lifetime checks. One additional initial failure was an incorrect mock function name, corrected to the actual `aft_` prefix. All four initial mounted-component cases failed on missing timeout/unmount recovery. A later fixture used exact equality for the existing floating-point percentage result; it was corrected to a 10-decimal comparison, not a production arithmetic change.

At 14:17 AEST, the six focused files passed 561 tests. Two subsequent real-socket cases brought the execution-policy file to 35 passing tests at 14:18 AEST. They use the installed Astro Node request conversion and response writer, fully send the request body, then disconnect the local HTTP client after the provider starts. Both stalled fetch and stalled response-body cases abort upstream and return the internal 408 outcome. This is stronger than a manually aborted Request fixture, but is not a Hostinger proxy test.

The mounted Chromium tests use the actual React component with controlled fetch and timers. They prove deadline failure, late-response isolation, retry success and unmount cleanup for both request/body waits. They do not contact Ollama or production analytics.

Commands:

```text
npm test -- --run tests/api/executionPolicy.test.ts src/components/AskToolChat.lifecycle.test.ts tests/api/askToolRouter.test.ts tests/api/mcp.test.ts tests/api/apiRoutes.test.ts tests/api/numericResults.test.ts
npm test -- --run tests/api/executionPolicy.test.ts
```

Saved initial focused log: `output/project-review-followup/COR-06/focused-tests.log` (561 tests, not a later aggregate). Subsequent independent review found two additional defects: an unread unsuccessful provider response kept its body open, and an MCP batch could amplify one quota unit into many executions. Both received failing regressions before fixes. The deadline helper now aborts its owned controller on rejection while preserving the original error; MCP rejects batch arrays before transport execution. Existing single-request behavior, header authentication and deterministic answers remain intact.

The independent judge's final run passed 542 tests in six files, with two coordinator-owned socket tests intentionally excluded from that command, and recommended COR-06 as evidence-ready. The judge's own file passed 28 tests, including real loopback proof that an unread 503 response body closes promptly. The two coordinator-owned socket tests passed in the combined full-suite unit phase; that suite had a separate SEO-queue timeout, so it was not a full `check` pass. Exact commands and source hashes are in `ask-execution-policy-judge.md`.

After a successful Node 24 / Astro 7 build, `output/project-review-followup/COR-06/run-local-runtime.mjs` ran on an owned loopback-only Astro preview and always stopped it. `local-runtime.json`, generated `2026-09-06T04:31:16.431Z`, records all three commands exiting 0: live-runtime checker (34 tools, parser), Ask audit (four cases, zero issues/warnings), and MCP smoke (three checks, zero issues). This is built local proof with parser routing forced, not a production or real-Ollama result. Final integrated checks are recorded separately.

## Remaining Gates

Independent scoped review and the final integrated full check have passed. The final full check has 1665 tests across 85 files, both TypeScript checks, build, visual/accessibility/asset/schema gates and zero dependency findings. A separate browser smoke run passed 136 cases. See `runtime-evidence-integration-2026-09-06.md` and its exact source snapshot/log references. COR-06 is evidence_ready, not approved for deployment.

Real Hostinger proxy disconnect/address behavior remains unverified. No live-provider latency or load measurement, deployed beta-token verification, or distributed limiter guarantee is claimed. Incoming body-read limits, maximum provider body sizes, and bounded rate-bucket retention remain outside this upstream-deadline fix. Existing unrelated review tasks, actual Clarity capture, real TTS/transcriber inference and device/beta gates remain open. No source commits, public actions, paid requests or new infrastructure.
