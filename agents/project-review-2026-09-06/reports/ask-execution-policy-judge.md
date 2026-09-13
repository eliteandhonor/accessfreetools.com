# COR-06 Independent Execution Policy Review

## Residual Findings

No concrete residual blocker found in the scoped COR-06 implementation after the final focused rejudge. J1 and J2 were independently reproduced before their coordinator-owned fixes and now pass. The production and incoming-body limits below remain explicit, not silently treated as verified.

## Resolved During Review

### J1 [P2]: Unread provider error-body lifetime, fixed and independently retested

- Location: `src/lib/askToolRouter.ts:463`, with cleanup at `src/lib/askRequest.ts:30`.
- Confidence: high; reproduced offline against the actual Ask POST and router.
- Original defect: a non-2xx fetch response threw `AskUnavailableError` immediately, before consuming or cancelling its body. The deadline helper then cleared its timer and detached the caller-abort listener without aborting its controller. A provider sending error headers but stalling its body could therefore outlive both the response and the upstream deadline; later caller disconnection could no longer reach that fetch through the removed listener.
- Original reproduction: `tests/api/executionPolicy.judge.test.ts:64` supplies a real Web Response with status 503 and an unfinished ReadableStream. Before the fix, Ask returned sanitized 503/ASK_UNAVAILABLE and had zero timers, but the fetch signal was not aborted and the stream's cancel callback had not run. The test explicitly cancels its synthetic stream in finally.
- Consequence: an error-path upstream connection/body can remain outstanding beyond the 30-second bound. This is a resource-lifetime defect, not evidence of production connection exhaustion or a leaked credential.
- Applied by coordinator: `src/lib/askRequest.ts:30` catches exceptional settlement, calls `controller.abort()`, then rethrows the original error before finally removing its timer/listeners. There is no cleanup await. Calling abort again does not overwrite an already-aborted controller's timeout/cancellation reason.
- Independent rejudge: the original J1 repro now passes. Additional synchronous/asynchronous failure checks retain the identical original Error, abort owned work, and remove timers and parent listeners. Success remains un-aborted and detached from subsequent parent abort. Existing 503, 504, 408, late-response, parser, and UI checks pass.
- Real unread-body proof: `tests/api/executionPolicy.judge.test.ts:324` starts a loopback-only HTTP server, sends 503 headers plus an unfinished body, and uses Node's real fetch behind an explicit fixed-loopback remap of the mocked provider URL. Actual Ask POST returns the exact sanitized 503/ASK_UNAVAILABLE response, the fetch signal aborts, and the upstream response emits close within the 1500 ms assertion bound. No real provider, DNS lookup, secret, or public endpoint is used. Server sockets and listener are closed in finally. This validates local fetch cleanup, not Hostinger proxy behavior.
- J1 is closed locally. The strengthened judge file has 28 passing tests; no failing regression remains.

### J2 [P2]: MCP batch amplification, fixed and independently retested

- Location: `src/pages/mcp.ts:42` and `src/pages/mcp.ts:53`.
- Confidence: high; reproduced offline through the actual SDK transport and deterministic runner.
- Original defect: the route charged one quota unit and passed the untouched body to a transport that accepts JSON-RPC arrays. Installed SDK code at `node_modules/@modelcontextprotocol/sdk/dist/esm/server/webStandardStreamableHttp.js:499` parses every array entry and dispatches all of them at line 593. There was no route-level batch policy or execution-count cap.
- Original reproduction: `tests/api/executionPolicy.judge.test.ts:81` first makes 59 accepted REST executions from one synthetic address, then sends one 61-call MCP batch. Before the coordinator's fix, all 61 results succeeded; the next single MCP call returned 429. Thus 120 deterministic executions fit in 60 admitted HTTP requests. No model or external network was used.
- Original consequence: callers could multiply work per admission relative to REST/Ask. This did not bypass the beta token, and the documented 60 HTTP-request window was literally enforced. The issue was execution-policy parity and batch amplification, not an allegation that 61 HTTP requests were accepted. The existing Astro adapter's 131072-byte request-body limit bounds payload size but is not a batch execution policy.
- Applied by coordinator: `src/pages/mcp.ts:45` reads the body once, returns sanitized 400/-32700 for parse failure, rejects arrays at line 51 with 400/-32600 before creating a server, and supplies `{ parsedBody }` to the SDK at line 64. The installed transport's declaration explicitly supports this option. `docs/ask-api-mcp-alpha.md:135` now states one RPC message per POST.
- Independent rejudge at 14:26: J2 and the coordinator's batch regression PASS. Added judge tests prove empty, single-entry, multi-entry, and invalid-entry arrays never construct the MCP server. Missing/wrong authentication remains before body parsing and quota; initialize/list/single-call and shared 429 coverage still pass. J2 is closed locally, not a residual blocker.
- Malformed-body coverage: seven empty/invalid JSON or invalid JSON-RPC body shapes return JSON-RPC 400/-32700 with no-store and no body sentinel. Incoming read rejection is sanitized before server creation. A valid single call reads JSON exactly once. Valid-JSON requests with unacceptable Accept or Content-Type still receive SDK 406/415. Invalid JSON now fails before SDK header validation; this changes validation order but does not bypass authentication or admit tool execution. These checks do not establish an MCP input-body deadline.

## Verdict

Recommend `evidence_ready` for the scoped COR-06 implementation evidence at the final fingerprinted snapshot. Both findings are independently verified fixed; no concrete residual blocker remains in the reviewed scope. This is not implementation approval, dependency approval, or production readiness: the coordinator still owns COR-02/SEC-01 reconciliation and typing/release gates. No manifest or task state was changed, and no `approved` claim is made. Hostinger proxy disconnect/IP handling and live release checks remain unverified.

## Scope And Source

- Worktree: `C:\Users\chamb\OneDrive\Desktop\accessfreetools-gpt6-review`.
- Branch: `codex/gpt6-review-implementation`; HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25` with existing uncommitted implementation and concurrent specialist changes.
- Review date: 2026-09-06, Australia/Brisbane. Node v24.20.0; Vitest 4.1.10; installed Astro 7.1.5 and Node adapter 11.0.3.
- Read root and campaign AGENTS, correctness task instructions, and COR-06's campaign doneRule: shared beta/public policy; configured/unset/wrong/query credentials, discovery/429/MCP lifecycle; bounded stalled provider request/body, upstream cancellation, UI recovery; no unsupported production per-IP claim.
- Application review: `src/lib/askRequest.ts`; lifecycle additions only in `src/lib/askToolRouter.ts`; `src/pages/api/v1/ask.ts`; `src/pages/mcp.ts`; Retry-After change only in `src/lib/apiHttp.ts`; `src/components/AskToolChat.tsx`; `docs/ask-api-mcp-alpha.md`.
- Test review: `tests/api/executionPolicy.test.ts`, `src/components/AskToolChat.lifecycle.test.ts`; existing API/MCP route tests and parser regressions for compatibility. Read-only supporting inspection: MCP server, tool-runner error boundaries, Astro configuration and installed adapter/SDK implementations. No new parser review or parser edits.
- Judge-owned writes only: this report and NEW `tests/api/executionPolicy.judge.test.ts`. Its initial two red regressions were independently reproduced; after both coordinator fixes and extra coverage, all 28 tests pass. Existing tests and all application/manifest/worklog files remain owned by their authors. Fingerprint comparison confirms only `askRequest.ts` changed among the previously reviewed application/docs files during the J1 rejudge.

## Verification

Commands ran from the review worktree, directly through the installed Vitest CLI. Counts overlap and must not be added together.

1. `node node_modules/vitest/vitest.mjs run tests/api/executionPolicy.test.ts tests/api/askToolRouter.test.ts src/components/AskToolChat.lifecycle.test.ts`
   - PASS: 490 tests, 3 files, before the coordinator added real-socket tests and the additional batch regression. Includes all 453 existing parser regressions and all 4 UI lifecycle tests.
2. `node node_modules/vitest/vitest.mjs run tests/api/executionPolicy.judge.test.ts`
   - FAIL: J1 and J2 reproduced; 7 other tests passed, 9 total. This did not use a real HTTP connection.
3. `node node_modules/vitest/vitest.mjs run tests/api/apiRoutes.test.ts tests/api/mcp.test.ts tests/api/askToolRouter.test.ts src/components/AskToolChat.lifecycle.test.ts`
   - PASS: 480 tests, 4 files. Public metadata, deterministic calls, initialization/listing, parser preservation, and browser lifecycle coverage.
4. `node node_modules/vitest/vitest.mjs run tests/api/executionPolicy.test.ts tests/api/executionPolicy.judge.test.ts tests/api/askToolRouter.test.ts tests/api/apiRoutes.test.ts tests/api/mcp.test.ts src/components/AskToolChat.lifecycle.test.ts -t '^(?!.*Astro Node socket disconnect).*$'`
   - FAIL at 14:22:14: 520 passed, 3 failed, 2 intentionally skipped, 525 collected. Failures: J1, J2, and the coordinator's newly added batch-rejection test. These are two defects, not three independent findings. All 453 parser tests and all 4 UI lifecycle tests still pass.
   - Explicitly skipped the two coordinator-added local HTTP socket tests to preserve this assignment's no-network boundary. Their source was inspected, not independently executed here.
5. Repeated command 4 after the coordinator's MCP fix and 15 additional judge checks.
   - FAIL at 14:26:14: **537 passed, 1 failed, 2 intentionally skipped, 540 collected**. Only J1 fails. All batch/malformed-body/single-read checks pass, alongside all 453 parser regressions and all 4 actual React lifecycle tests. Judge-owned file: 23 passed, 1 failed, 24 total.
6. `node node_modules/vitest/vitest.mjs run tests/api/executionPolicy.judge.test.ts` after the helper fix and four additional checks.
   - PASS at 14:31:03: 28 tests. Includes original J1/J2 regressions, original-error preservation, success cleanup, and the unread-error-body socket probe; the coordinator requested loopback proof within owner-authorized local testing.
7. Repeated command 4 against the final helper fix and strengthened judge file.
   - **PASS at 14:31:44: 542 passed, 2 intentionally skipped, 544 collected, 6 files passed.** All 453 parser tests and all 4 UI lifecycle tests remain green. Only the two coordinator-owned Astro socket-disconnect tests are excluded; the new unread-body loopback proof is included and passes.

Read-only commands also included `git status --short --branch`, `git rev-parse HEAD`, scoped `git diff`/`git diff --numstat`, `node --version`, `rg`/`rg --files`, PowerShell `Get-Content`/JSON reads and `Get-FileHash`. No full check, full build, install, typecheck, commit, dev server, live Ask audit, real provider request, paid call, public action, or production change was performed by this judge. The initial review was entirely offline; the coordinator requested loopback proof within owner-authorized local testing, so the final rejudge includes one bounded loopback-only HTTP fixture. No new direct owner reply authorized that fixture. No outbound/provider network was used. The existing UI test performs an in-memory esbuild harness bundle, not an application build, and aborts browser network routes. No reviewer-owned background process remains.

### Coordinator Evidence Update

- Coordinator-reported focused result: 588 passing tests across seven files, before the judge's final four added tests. Coordinator-reported first full-suite attempt: 1654 passed and two unrelated failures, with no COR-06 failure. These broader results were not rerun or independently audited by this judge; they do not change the separately recorded 542-pass focused rejudge or establish a full-suite pass.
- Inspected saved artifact: `output/project-review-followup/COR-06/local-runtime.json`, generated `2026-09-06T04:31:16.431Z`, explicitly scoped to local built Astro preview with parser forced, not production. Its three command outcomes have exit code 0: runtime check reports `ok: true`, 34 tools and parser routing; Ask audit reports four cases and zero issues; MCP smoke reports three checks and zero issues. The artifact records `serverStopped: true` and an `@astrojs/node` local-server log. This is inspection of coordinator-generated evidence, not a judge-run build or runtime audit, and does not prove Hostinger proxy behavior.
- This precision update changed only this report. No source, test, manifest, or approval change; the coordinator reports no further COR-06 source changes.

## Passing Checks And Limits

- No missing-auth execution bypass was found in the reviewed routes. Both supported token headers work; unset-token interfaces remain intentionally public; wrong, missing, and query credentials are rejected. MCP initialize/list/call are gated. HTTP discovery remains public. Unauthorized batch requests are rejected before reading JSON and do not exhaust quota.
- The ordinary shared fixed window works across REST/MCP/Ask. The judge tested Retry-After rounding at 59999 milliseconds (1 second remaining) and reset at 60000 milliseconds. Rejected authentication does not spend quota. These are in-process synthetic-address results, not proof of trusted production client IPs.
- Provider request and response-body stalls settle at the configured deadline; cancellation and already-aborted callers do not produce a fake result. Successful completion removes timer/listener resources. An error while parsing provider JSON or its tool arguments is sanitized to ASK_UNAVAILABLE with no synthetic private sentinel in the response.
- A provider response arriving after timeout does not trigger JSON reading or a late tool answer. Same-turn body completion/caller cancellation settled once as AbortError. React tests exercise the actual component in headless Chromium: request and body stalls, retry, stale-answer rejection, unmount abort, and deadline cleanup pass without page errors. This is not a production browser/proxy acceptance test or a measured wall-clock 35-second soak.
- Installed Astro semantics were inspected directly: `createRequestFromNodeRequest` passes an AbortController signal into Request; `wireAbortController` listens to socket `close` (node.js lines 110-147), and `writeResponse` cleans that listener on response finish/close (lines 148-169). A judge test uses a real unconnected Node Socket/IncomingMessage and the installed adapter, then emits events: request completion does not abort; socket close aborts Ask/upstream and cleans listeners. No socket connect/listen or network I/O occurs in that test.
- Coordinator addition: two tests now open local HTTP sockets, call the installed adapter plus actual Ask POST/writeResponse, and destroy the client only after the mocked upstream has started, for both request and body phases. Their implementation was read. The coordinator subsequently reported a 36-test run with one batch-regression failure; this is coordinator-reported evidence, not an independently rerun socket result or an inspected full execution log. Local socket success still does not prove Hostinger proxy disconnect propagation.
- Incoming body boundary: `src/pages/api/v1/ask.ts:15` awaits the caller's JSON before entering the provider deadline. The judge's unfinished Web Request stream remains pending past 35001 milliseconds and signal abort, with no upstream call and no timer; finishing that synthetic stream then produces 408. This is a recorded coverage/contract limit, not an additional regression finding: the document specifically promises an upstream deadline. It does not establish a server end-to-end body-read timeout, and a synthetic stream is not proof that a real disconnected Node upload stays open. CPU-bound JSON parsing is likewise not preemptible by a timer.
- Existing rate-bucket retention/identity trust, distributed limiting, production adapter/proxy topology, maximum provider response sizes, remote provider semantics, load/memory measurements, full typing/build gates, and live release checks are unverified here. The docs correctly reserve proxy cancellation and per-IP claims for release evidence. No OCR/provider-owned file or unrelated dirty change was modified.

## Source Fingerprints

SHA-256 refreshed after the final 14:31 rejudge; uncommitted files require these fingerprints as well as HEAD. Concurrent updates after this snapshot require a rejudge. The original red batch reproduction used MCP SHA-256 `21AE2A54429744788721740E1414351B5275A98FF637EA2B6088E76340869847`; the original red unread-body reproduction used helper SHA-256 `1CE0646964F5190E9BB5D3F19B0801A3B802FAA984598F387D4C94BEAE9DC03C`. The table identifies the corrected files.

| Path | SHA-256 |
| --- | --- |
| src/lib/askRequest.ts | 075565229EB8F23790CBDFE9E49B0E6BD27E33A21980DCCB2380E24413A6EA53 |
| src/lib/askToolRouter.ts | EB32A4B86BF1336816C275F9AB30C59CC4F6131583AAC98BEBF49FB836D4741D |
| src/lib/apiHttp.ts | ED324C6CBF709E6601868F11F46C0818B79852BCF0F8B7CEDCA953B21E577589 |
| src/pages/api/v1/ask.ts | 4876289BC029DABDE9BD9179A757D724FE3A0DC9EA8DC10433E6791AF4E17780 |
| src/pages/mcp.ts | CAB9DB0063B868C09F2150D92E36BCB19A4B4ACCE5C54329D5A89ED76F3004ED |
| src/components/AskToolChat.tsx | C05B3003395FF4B0422A2A0D2ADBC06ED0534FBAE2D7CA4396816E1FF342E565 |
| docs/ask-api-mcp-alpha.md | 524E01B077F815A2B16E38CADD732523FE0DF61014543FAD8A67F924BFCC906F |
| tests/api/executionPolicy.test.ts | D9A5E7F559D1E8B72FBB9BB0C02362F6EB6F6AFEBC9D1A4C94735A358657E299 |
| src/components/AskToolChat.lifecycle.test.ts | 973865F47E72F839467D7B4FA132904155D4607537E54415F01B2FE9B604ADEF |
| tests/api/executionPolicy.judge.test.ts | 705EBBB9C4193CE21E4CEB84DD24697923941FF1729720669067D0529791154B |
