# Append-Only Worklog

## 2026-09-06: Assignment Created

Created from the GPT-6 project review at 90d6dcab0580a91ca66382f2414d95e8817469e5. Read-only specialist findings are in ../../reports/. Assigned tasks: COR-01, COR-02, COR-03, COR-04, COR-05, COR-06. No implementation, publication or deployment has been performed by this assignment. Await task selection and acceptance proof; no approval claimed.

Append later entries with timestamp, task ID, source revision, files changed, exact commands/results, safe evidence paths, blockers and next action. Do not replace earlier entries or put secrets/media/transcripts here.

## 2026-09-06 12:45 +10:00: COR-01 And COR-02 Router Implementation Evidence

Scope: owner-assigned Ask router changes only. Worktree: `C:\Users\chamb\OneDrive\Desktop\accessfreetools-gpt6-review`; branch: `codex/gpt6-review-implementation`. Observed HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`. Historical campaign review baseline: `90d6dcab0580a91ca66382f2414d95e8817469e5`. Changes below are uncommitted. Other agents' existing and concurrent changes were preserved.

Files changed by this assignment:

- `src/lib/askToolRouter.ts`: complete numeric grammar and question matching; terminal clarification errors for recognized but unsupported questions; explicit date routing before arithmetic; shared electrical phase/PF interpretation; metric/imperial/mixed concrete normalization; per-1K/per-1M token-price normalization.
- `tests/api/askToolRouter.test.ts`: 345 focused tests across parser-first, forced-fallback, and local-fallback-enabled modes. The REST harness runs the real Ask handler, router, and deterministic runners in-process. Private environment loading is mocked, and every fetch is mocked. Supported and declined fixtures assert zero provider calls. A separate mocked mortgage fixture preserves model routing for other tools.
- This append-only worklog entry. No calculator, registry, HTTP helper, route, package, or global campaign files were edited by this assignment.

Inspected: campaign AGENTS/task definitions and correctness role/reference/worklog; `reports/correctness.md`; `docs/ask-api-mcp-alpha.md`; `docs/brand-code.md`; router, selected runner schemas/results, private environment/HTTP/Ask handler boundaries, existing registry/API tests, Vitest configuration and starter Ask audit fixtures. Applied the installed TDD skill. No callable subagent orchestration tool was available; independent review remains the Release Judge's responsibility.

### Regression Evidence

- 12:35 RED, before router edits: `npm.cmd test -- tests/api/askToolRouter.test.ts --reporter=dot` exited 1; 211 failed, 53 passed (264 total). Failures reproduced grouped-number truncation, chained-expression and ISO-date arithmetic matches, lost electrical conditions, metric dimensions interpreted as feet, and per-1000 pricing interpreted as per-million pricing.
- Initial implementation run: 252 passed, 12 failed. Two fixture-contract mistakes were then corrected: percentage result uses `amount`, not `value`; amps-to-watts warnings say `qualified advice`, not `electrical code`. Deterministic input/result equality checks were retained.
- 12:39 GREEN: `npm.cmd test -- tests/api/askToolRouter.test.ts src/lib/apiToolRegistry.test.ts tests/api/apiRoutes.test.ts --reporter=dot` exited 0; 297 passed across 3 files.
- 12:40 RED expansion: focused router command exited 1; 52 failed, 278 passed (330 total). Added complete-question bypass cases for averages, absolute values/differences, area, battery, BMI, download and tip routing, plus compatibility checks. This exposed remaining fragment matches and an overly broad fallback guard. The mocked mortgage fixture was subsequently aligned to its existing `annualRatePercent` schema field.
- 12:42 RED expansion: focused router command exited 1; 6 failed, 330 passed (336 total). Demonstrated that a concrete dimension `412` could be split into width/depth and that uppercase-B `MBps` was silently treated as `Mbps`.
- 12:43 RED expansion: focused router command exited 1; 12 failed, 333 passed (345 total). Added compact/spaced chained `x` expressions and malformed compact percentage grouping to prove they could not regain a partial model route.
- 12:44 final GREEN: `npm.cmd test -- tests/api/askToolRouter.test.ts src/lib/apiToolRegistry.test.ts tests/api/apiRoutes.test.ts --reporter=dot` exited 0; **378 passed across 3 files**, 0 failed, 0 skipped; Vitest 4.1.10 reported 721 ms. This includes 345 new router cases and 33 existing registry/REST cases.
- `git diff --check -- src/lib/askToolRouter.ts tests/api/askToolRouter.test.ts` exited 0; only the repository's LF-to-CRLF working-copy advisory appeared. Final scope/status check preserved other agents' changes.

### Acceptance Demonstrated

- `What is 18% of 1,000?` executes with `value: 1000`, returning `amount: 180`. Signed/grouped decimals, leading decimals, scientific notation, and ordinary one-operation examples preserve complete operands. Malformed grouping, residual operators/units, and multiple calculations return HTTP 400 with `ok: false` and no run.
- `How many days between 2026-05-01 and 2026-05-15?` selects `date-calculator` with the complete ISO strings and returns 14 days. Reversed input order also returns 14 days. Invalid dates and unsupported inclusive/business-day conditions decline instead of becoming subtraction.
- The review's 600 W / 120 V question preserves `phase: three-phase` and `powerFactor: 0.8`. DC/single/three-phase, PF percentage/decimal notation, both electrical directions, and compatibility defaults are covered. Conflicting/duplicate phases/PFs and unsupported electrical qualifiers decline.
- The review's 3 by 4 meter, 10 cm slab normalizes length/width to feet and depth to inches for the existing runner. Tests also cover explicit mixed units and waste percentage. Missing/unsupported units or additional construction conditions decline. The documented 10 by 12 slab, 4 inches thick starter retains its legacy feet interpretation; fully unspecified depth is no longer invented.
- The review's per-1000 token question normalizes prices to 2000/8000 USD per million and returns total cost 6000. Per-1K/per-1M aliases, mixed input/output denominators, and the existing 64-dollar starter example are covered. Missing/unsupported denominators, cached-input qualifiers, and extra charges decline.
- Success responses preserve exact runner input/result/answer equality, warnings, assumptions, tool URL, and `no-store`. A deliberately wrong mocked provider response cannot revive any declined fixture in parser-first or local-fallback-enabled mode.

### Remaining Gates And Limits

This is implementation evidence, **not self-approval**. No campaign task state or approval record was changed. Parsing intentionally accepts a bounded grammar, not unrestricted natural language or chained expressions. Additional unsupported qualifiers are declined, not silently estimated. Universal model-interpretation accuracy is not established by these tests.

Per the assignment restrictions, the full test suite, full type/build/check pipeline, browser UI verification, `npm run aft -- ask-audit`, API/MCP audit commands, and live production checks were not run. No output outside owned files was generated, no dependencies were installed, and no commit, deploy, publish, or external model call was made. Tests cover the REST response, not rendered warning/input presentation in the browser. The coordinator must supply the remaining broader/browser/audit evidence and the Release Judge must independently review COR-01/COR-02 before approval.

## 2026-09-06 13:03 +10:00: J2/J4 Judge Fix Evidence And Source Stability

Owner-scoped J2/COR-05 and J4/COR-03 only. Worktree `C:\Users\chamb\OneDrive\Desktop\accessfreetools-gpt6-review`, branch `codex/gpt6-review-implementation`, observed HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25` plus uncommitted changes. Existing workers' patches were preserved.

Changed `src/lib/calculator.ts`, `src/lib/calculator.numeric.test.ts`, `src/lib/apiToolRegistry.ts`, `tests/api/numericResults.test.ts`, and only age/date explanation strings in `src/components/UtilityCalculator.tsx`; added `tests/calendar-convention.spec.ts`. Added `../../reports/correctness-judge-fixes.md` and this append. No edit to coordinator-owned `tests/numeric-regressions.spec.ts`, J1/J3, Clarity, dependencies, campaign manifest/task states, or other unowned source.

J2 now shares the existing bounded APR solver with inverse-rate calculation, checks a finite bracket before bisection, validates payment reconstruction within `max(1e-9, payment * 1e-11)`, and explicitly rejects required annual rates above 19200%. Exact zero-payment equality prevents a small-principal tolerance shortcut from bypassing the bracket. Independent discounted-payment references cover near/at/above-bound inverse rates, zero/nonzero-fee APR, fee-driven boundary crossing, scaled principals and non-finite endpoint errors. J4 browser/API explanation strings now match earlier-to-later single-offset month-end clamping, with total UTC days separate. The leap interval 2024-02-29 to 2025-03-28 remains 1y 0m 28d and 393 elapsed days.

Exact focused command evidence, all AEST:

- 12:58:33 RED: `node node_modules/vitest/vitest.mjs run --configLoader runner src/lib/calculator.numeric.test.ts tests/api/numericResults.test.ts --reporter=dot`, exit 1, 28 failed / 128 passed. Before source edits.
- 12:59:17 expanded RED: same command, exit 1, 34 failed / 128 passed. Six separate zero/nonzero-fee APR failures added before source edits.
- 13:00:24 GREEN: `node node_modules/vitest/vitest.mjs run --configLoader runner src/lib/calculator.numeric.test.ts src/lib/calculator.test.ts tests/api/numericResults.test.ts src/lib/apiToolRegistry.test.ts tests/api/apiRoutes.test.ts tests/api/mcp.test.ts --reporter=dot`, exit 0, 332 passed / six files / no skips.
- 13:01:21 scale RED: `node node_modules/vitest/vitest.mjs run --configLoader runner src/lib/calculator.numeric.test.ts --reporter=dot`, exit 1, 1 failed / 116 passed. Exposed first implementation's zero-rate shortcut for principal `1e-12`; fixed before final green.
- 13:01:33 final GREEN: exact six-file command above, exit 0, **335 passed / six files / no skips**, 658 ms.
- `node node_modules/@playwright/test/cli.js test tests/calendar-convention.spec.ts --list`, exit 0, eight collected desktop/mobile cases. Collection only, not executed browser proof.
- Scoped `git diff --check` on the six source/test paths exited 0 with LF-to-CRLF advisories only. Direct technical writing analysis of 11 changed strings passed with zero warnings/errors; local provenance `/inspect` found zero actionable Layer A marks, so no cleaning occurred.

Exact reproduction outcomes, source references, boundaries, commands and six-file hashes are in `../../reports/correctness-judge-fixes.md`. Combined source/test fingerprint at 13:02:58 AEST: `ed25b060f7ed43a15e0fe40d617522e7fde9c2c7f15fa0f8566a4d62defb82b7` (sorted path/NUL/raw bytes/NUL SHA-256).

Coordinator notified that source is stable, focused tests have finished, and clean `npm ci`/full integration can proceed. No source/test process remains running. Only report/worklog completion followed the stability notification. No installs, full tests/typechecks/builds/checks, preview/dev server, deploy, commit, public action, campaign status edit, or self-approval. Rendered calendar screenshots, finance range-error UI checks, integrated gates, API/MCP reports and independent judge acceptance remain coordinator-owned and unperformed here.

## 2026-09-06 13:20 +10:00: Ask J2-01, J2-02, J2-03 Judge Fixes

Owner-scoped Ask judge follow-up only, under COR-01/COR-02. Worktree `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`; branch `codex/gpt6-review-implementation`; observed HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25` plus uncommitted changes. Root/campaign instructions, exact judge findings and relevant acceptance rules were read. The starting router/test hashes matched the judge's patch. Other workers' edits were preserved; the existing worklog was re-read and unchanged before this append.

Changed only `src/lib/askToolRouter.ts`, `tests/api/askToolRouter.test.ts`, added `../../reports/ask-judge-fixes.md`, and appended this entry. The router now declines U+00D7/U+00F7/U+2212 arithmetic and numeric/closed-operand factorials before punctuation cleanup or provider fallback. Download matching retains original unit case within the complete match and rejects uppercase-B MBps with or without attached digits. No new operators or factorial/byte-speed calculation support were added. Current Ask fixes and all 345 existing tests remain intact; no COR-06 auth/timeout/transport work or task-board/status edits.

Every test run used `node node_modules/vitest/vitest.mjs run --configLoader runner tests/api/askToolRouter.test.ts --reporter=dot` on Node `v24.20.0`, Vitest `4.1.10`:

- 13:16:47 initial RED: exit 1, 53 failed / 391 passed, before router edits.
- 13:17:34 exact-judge RED: exit 1, 55 failed / 392 passed, still before router edits.
- 13:18:01 GREEN: exit 0, 447 passed.
- 13:18:54 absolute-bar factorial RED: exit 1, 3 failed / 450 passed.
- 13:19:09 final GREEN: exit 0, **453 passed**, 0 failed/skipped, 704 ms. Includes 108 added checks across all three router modes, with actual in-process REST execution, private-env/fetch mocks, deliberately partial provider fixtures, exact normalized download inputs/results, and zero provider calls for all new fixtures.

Scoped `git diff --check` exited 0 with the LF-to-CRLF advisory only. In-memory starting-file comparison confirms 12 added/7 removed router lines, 77 added/0 removed test lines, and no other source changes by this worker. The report records exact reproductions, acceptance, commands, line references, and final source/test hashes. Its final hashes are `8D3AD9C111ACF56E9437BB68737516DA080B797A4BE3115ABD3D548B425D6690` (router) and `CA921D567181466D902E53A877336F55134BEE672C995D0847B8ACF0F16AEB4D` (tests).

All test processes exited by approximately 13:19:10 AEST; no owned background process or server remains. No installs, full suites/typechecks/builds/checks, network providers, paid calls, deploys, commits, or public actions. No self-approval. Next action: independent judge review of this narrow patch; broader browser/production/campaign gates remain unperformed here.

## 2026-09-06: Coordinator COR-06 Integration

Implemented shared REST/Ask/MCP execution policy, upstream/browser deadlines, cancellation, retry and sanitized status handling. Independent judge reproduced two additional defects (unread provider error body and MCP batch quota amplification); both were fixed and independently retested. Exact source/test references, red-green results and local socket/adapter limits are in `../../reports/ask-execution-policy-implementation.md` and `../../reports/ask-execution-policy-judge.md`.

The full 1658-test integrated snapshot and 136-case browser smoke passed before a subsequent provider-only warning correction. COR-06 source is unchanged by that correction and the final combined gate is rerunning. Built local Ask/runtime/MCP proof passed with parser forced and the preview stopped; it is not Hostinger or real-provider proof. Task advanced to evidence_ready on the judge's scoped recommendation, not approved or deployed. The later consolidated report records exact final counts/hashes. No live action, paid call, purchase, original-checkout edit or memory change.

## 2026-09-06 18:46 +10:00: Independent COR-03/04/05 Task Re-Judge

Independent Release Judge reviewed the complete COR-03, COR-04 and COR-05 acceptance, not merely the earlier J2/J4/R1 fix subset. Exact report: `../../reports/correctness-numeric-task-rejudge.md`. Worktree `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`, branch `codex/gpt6-review-implementation`, HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25` plus frozen dirty source. The requested `capture-promotion-security-source.mjs --rejudge --compare` returned 121 files, matching HEAD and no drift before/after focused execution.

No remaining blocking numeric defect found. Recommend task-level approval for COR-03, COR-04 and COR-05, including the COR-04 dependency; manifest/task states were not mutated. Calendar convention/reconstruction and current actual REST/MCP nonfinite/null/error contracts passed. Stable forward, inverse-principal, inverse-rate, APR and Canadian consumers were inspected. Fresh independent Vitest execution: 257 numeric/API cases plus five selected existing fixtures passed, maxWorkers=2 and no cache; 130 unrelated existing tests were deliberately filtered, not counted. In-memory probes passed 135 calendar intervals, 120 forward/principal round trips, 240 inverse/APR compositions, 40 underpayment rejections and 30 ceiling checks. Maximum relative payment residual was `3.052891703203788e-14`.

Read retained coordinator smoke evidence (136 passing cases), verified the seven relevant changed source/test files plus smoke log and all 68 numeric/calendar image hashes against the accepted-tests manifest, and visually inspected ten desktop/mobile regions. Historical API-ready/MCP smoke report passes are credited only at their recorded timestamps; fresh handler tests establish current numeric contracts. No new browser/server/report-gate run or current full-check success is claimed.

Only the new report and this append were written. No source/test/config edits, weakened tests, installs, full checks/builds, network/provider/paid/public actions, commits, manifest changes, promotion re-review, original-checkout access or transcriber-worktree changes. All owned processes finished. The parent's current full check is still parent-owned and not assumed passed. Whole campaign, release, deployment, every other COR task and unrelated work are explicitly NOT approved.

## 2026-09-06 18:49 +10:00: Terminal Evidence And Exact Task Approval

Release Judge appended the terminal-evidence decision to `../../reports/correctness-numeric-task-rejudge.md`, preserving all prior wording as historical. Parent reports exit 0 for `output/project-review-followup/integration/check-promotion-corrections.log`; independently read its 2146 passing tests in 99 files, both TypeScript checks, completed build/check stages and zero-vulnerability terminal audit. Fresh read-only frozen-source comparison: 121 files, matching HEAD, no drift. No tests or full check rerun.

**COR-03 APPROVED; COR-04 APPROVED; COR-05 APPROVED**, based on the previously judged exact acceptance and terminal evidence. Coordinator may transcribe `status=approved`, `approvedBy=release-judge`, and report reference `reports/correctness-numeric-task-rejudge.md` for exactly those IDs. Manifest untouched by this judge. No other task or campaign/production/public-action/release/deployment approval is granted; PR-01/PR-02 were not re-judged. Only report/worklog appends were made.

## 2026-09-06: Coordinator Records COR-01/02 Rejudge

Independent judge `../../reports/ask-routing-task-acceptance.md` found a real
COR-02 partial-answer defect in `(2) + (3) * (4)`. Coordinator changed the
terminal calculation classifier to recognize closing grouped delimiters before
existing operators, preventing provider fallback for that unsupported complete
expression. No general expression engine or permitted-tool policy was added.

Judge retained the eight original failures, added grouped-delimiter cases,
and reran 648 no-network tests successfully. Exact local COR-01/02 approvals
are transcribed into the campaign. Full fresh-install integration passes 2,405
tests. Previous rejection, failed integration hook and source hashes remain
recorded; no production or overall Ask approval is claimed.

## 2026-09-06: COR-06 Exact Local Acceptance

Independent judge passed 571 focused tests, including 27 new socket/deadline and
mounted-UI probes. Coordinator transcribed the explicit LOCAL APPROVE decision
for COR-06 only; proof is ../../reports/ask-execution-task-acceptance.md.
Upstream deadlines, error cleanup and retry are proven locally. Production
proxy/token behavior, deployment and whole-goal approval remain separate.
