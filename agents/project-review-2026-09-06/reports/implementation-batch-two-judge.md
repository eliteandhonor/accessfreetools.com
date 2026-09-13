# Implementation Batch Two Independent Judge

Date: 2026-09-06, Australia/Brisbane. **Verdict: request changes for COR-01/COR-02 and EV-01. No additional confirmed BR-02 regression found. Neither the source review nor the focused passes approve implementation completion, release, indexing, or pilot activation.**

## Scope And State

- Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review` (R below).
- Branch: `codex/gpt6-review-implementation`. Observed HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`. Campaign review baseline: `90d6dcab0580a91ca66382f2414d95e8817469e5`. This review covers the uncommitted implementation, not HEAD alone.
- Read root/campaign instructions, campaign task board and the exact COR-01, COR-02, BR-02 and EV-01 acceptance rules; correctness worklog; browser-runtime TTS and evidence-provenance implementation reports; scoped current diffs and new tests.
- Inspected Ask router and REST test harness; actual TTS component, import/input helpers and lifecycle tests; shared inspection merger, merge CLI, pilot selector/analyzer/tests, marketing and weekly consumers/tests. Read the chapter queue, runner and indexing CLI only to trace scoped behavior across their existing boundaries.
- No COR-06 or BR-03 review, implementation edits, campaign/status edits, dependency installation, full check/build, application server, real model call/download, provider refresh, paid call, publication, or release action.
- Only this report is intentionally edited. Focused existing tests used their own temporary fixtures and an in-memory component bundle. Other agents' dirty files are preserved.
- **Coordinator handoff:** all test and reproduction processes exited before the tests-done notice. Last executable reproduction finished at approximately 13:03 Brisbane time. No further test execution or `node_modules` use occurred after that notice or the subsequent explicit pause. No test/process owned by this review remains active. Results below are pre-install evidence, not clean-install verification.
- **Subsequent coordinator update:** the coordinator reported clean Node 24 `npm ci` complete, 468 installed / 469 audited / 0 vulnerabilities, with no source edits during installation, and issued dependency-use all-clear while starting the full check. These are coordinator-reported results, not independently rerun evidence. This reviewer did not resume tests or dependency use and did not run a concurrent full check/build. Full-check completion is not assumed.

## Findings

### J2-01 [P1] Unicode Chained Arithmetic Still Reaches Unchecked Model Routing

**Scope:** COR-02 acceptance bypass. **Confidence:** high for the parser/fallback path; no assertion about how often a real provider produces a partial call.

**Source:** [askToolRouter.ts:413](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:413), with fallback at [askToolRouter.ts:526](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:526) and model-call acceptance at [askToolRouter.ts:483](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:483).

**Reproduction:** the actual parser, extracted through the TypeScript AST and executed in memory, returns `null` for `What is 2\u00d73\u00d74?` (each `\u00d7` is the multiplication sign). ASCII `2x3x4` is guarded, but neither the accepted grammar nor the terminal guard recognizes the multiplication sign. With model routing enabled, the null route reaches `routeWithOllama`. A mocked response containing `aft_basic_calculator` with `{left: 2, operator: '*', right: 3}` is accepted: correction parses the same question to null, returns the provider route unchanged, and the runner would return 6 for the incomplete expression instead of 24 or a refusal. The null result was executed; the downstream conditional outcome was source-traced, not separately run through REST.

**Consequence:** the exact no-prefix-success property depends on provider behavior again for ordinary mathematical notation. The current regression fixtures cover ASCII operators and compact/spaced `x`, not this route.

**Minimum fix and acceptance:** normalize recognized mathematical operator variants before both matching and terminal classification, or terminally decline them. Add no-network REST fixtures for multiplication/division/minus variants and multi-operation expressions, supplying a deliberately partial provider call. Require either the complete deterministic result or HTTP 400 with no provider call and no successful prefix run, in all existing router modes. This is an input interpretation fix, not a COR-06 timeout/auth change.

### J2-02 [P2] Attached MBps Bypasses The Byte/Bit Unit Check

**Scope:** COR-01 unit-preservation gap in the implemented router. **Confidence:** high; directly reproduced.

**Source:** [askToolRouter.ts:249](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:249) and [askToolRouter.ts:252](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:252).

**Reproduction:** `How long will a 5GB file take to download at 80 MBps?` throws the intended clarification. Removing only the space, `How long will a 5GB file take to download at 80MBps?`, produces `{tool_slug:'download-time-calculator', inputs:{fileSize:5,fileUnit:'GB',speedMbps:80}, confidence:'high'}`. The leading word boundary cannot match between the digit and `M`; the case-folded grammar subsequently accepts it because whitespace is optional.

**Consequence:** 80 megabytes/second becomes 80 megabits/second, giving an estimate eight times too long with the same runner efficiency setting. The uppercase-B regression fixture tests only the spaced spelling.

**Minimum fix and acceptance:** validate the case-sensitive speed unit as part of the complete token match, without requiring whitespace before it. Either reject MBps or convert it explicitly. Test `80MBps`, `80 MBps`, `80Mbps` and `80 Mbps` through the REST harness, asserting normalized inputs and the unit-equivalent result, not merely HTTP success.

### J2-03 [P2] Removing Final Exclamation Marks Silently Drops Factorials

**Scope:** COR-02 leftover-operator acceptance gap. **Confidence:** high for the behavior; factorial interpretation must not be silently dismissed as punctuation.

**Source:** [askToolRouter.ts:195](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:195), before the full arithmetic match at [askToolRouter.ts:386](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/lib/askToolRouter.ts:386).

**Reproduction:** actual parser evaluation of `Calculate 2 + 3!` produces `{left:2,operator:'+',right:3}`. The trailing `!` is removed before the complete-question check, so the runner will answer 5. For the mathematical expression with factorial the result is 8; refusing the ambiguous/unsupported expression would also satisfy the task. This does not request implementation of factorial calculation.

**Consequence:** anchoring the regular expression does not prevent a prefix success when preprocessing has already removed an operator. The existing leftover-operator tests omit factorial notation.

**Minimum fix and acceptance:** do not strip `!` after a numeric operand as unconditional sentence punctuation. Conservatively decline unsupported factorial expressions, and add fixtures with terminal factorials and factorials before a question mark. Assert no successful truncated run in every router mode.

### J2-04 [P2] Indexing CLI Still Replaces Observation Age With Weekly Wrapper Age

**Scope:** EV-01 missing consumer integration, not a newly introduced bug in the unchanged indexing function. **Confidence:** high; actual pure consumer function reproduced in isolation.

**Source:** [aft-cli.mjs:356](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/aft-cli.mjs:356), especially `sourceGeneratedAt: seoGeneratedAt` at line 365 and report-level selection at line 371. The related per-item fallback at [aft-cli.mjs:342](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/aft-cli.mjs:342) also replaces explicitly null origins with the container date.

**Reproduction:** make the raw inspection input unavailable and provide a weekly summary generated on September 6 containing a non-indexed row with `sourceGeneratedAt:'2026-07-20T00:00:00.000Z'` and `sourcePath:'original-july.json'`. Executing the actual `getIndexingGapSnapshot` with in-memory `readJson` fixtures returned the September 6 timestamp on that row, `sourceFreshness:'fresh'`, `sourceAgeDays:0`, and no original path. In addition, any nonempty raw inspection array excludes all summary-only URLs, regardless of per-URL observation times.

**Consequence:** the new weekly summarizer preserves provenance, but `aft indexing-gaps` immediately discards it in its fallback. Consumers can disagree about which observation is current and whether an old gap is fresh. This is directly relevant to EV-01's explicitly named indexing-gaps acceptance command; it cannot be closed by the three updated selection functions alone.

**Minimum fix and acceptance:** adapt raw and weekly rows into the shared per-URL merger, retain original paths/dates and explicit unavailable origins, then use the shared freshness policy. Test raw-missing, partial-raw, old-PASS/new-failure and reverse inputs through the actual CLI selection boundary. A newly generated summary must not freshen its July row or remove unrelated URL evidence.

### J2-05 [P2] A Dated Wrapper With No Original Source Path Can Pass The Pilot Gate

**Scope:** EV-01 missing-provenance acceptance gap. **Confidence:** high; actual analyzer directly reproduced.

**Source:** missing merged origins remain empty at [search-console-inspection-reports.mjs:104](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/search-console-inspection-reports.mjs:104), but eligibility checks only age, error and coverage at [new-tool-growth-pilot-report.mjs:97](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/new-tool-growth-pilot-report.mjs:97).

**Reproduction:** at `now = 2026-09-06T00:00:00.000Z`, supply a `kind:'search-console-url-inspection-merged'` report with one pilot URL, `verdict:'PASS'`, `coverageState:'Submitted and indexed'`, and `sourceGeneratedAt:'2026-09-05T00:00:00.000Z'`, but no per-item `sourcePath`. Supply fresh September 5 sitemap evidence (`checked:659`, `hardFailures:0`) and CrawlScout evidence (`overview.notIndexed:120`). The analyzer returns `nextReleaseReady:true`; the selected item has `sourcePath:''`, `status:'observed'`, `sourceFreshness:'fresh'`, `discovered:true`, and `indexed:true`.

**Consequence:** a copied partial wrapper with irrecoverable origin is promoted from incomplete provenance to gate-satisfying evidence. Its Markdown simultaneously describes the source as `not enough data`. The missing-date tests do not cover a present date with missing original path.

**Minimum fix and acceptance:** require usable original provenance for a merged observation to satisfy the pilot gate. Preserve it as historical/unavailable information when the path is missing, blank or invalid; do not substitute the wrapper path. Raw file-backed reports can obtain origin from their loader. Add a dated-wrapper/missing-origin fixture and a positive raw-origin/nested-round-trip counterpart. This is not a request to infer or reconstruct lost provenance.

## BR-02 Judgment And Acceptance Limits

No additional confirmed regression was found in the assigned TTS patch. Source inspection supports rejection of both pending and active jobs before worker disposal, idempotent chapter settlement, identity-guarded old-worker callbacks, metadata checks before `arrayBuffer`, and import-operation checks at the asynchronous read/module/parser boundaries. The independently executed mounted-component suite supports pre-ready failure/retry, completed MP3 preservation, watchdog/fallback settlement, cancellation, stale-worker rejection, resource cleanup, invalid-file zero-read behavior and delayed TXT publication rejection.

The remaining limitations are not hidden approvals:

- The delayed cancellation/replacement/unmount fixture is TXT-only at [BrowserTtsLifecycle.test.ts:371](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/BrowserTtsLifecycle.test.ts:371). It delays `File.arrayBuffer`, not module loading or the awaited EPUB parser at component lines 987-1000. Those later operation guards look correct in source but lack equivalent mounted race fixtures. Minimum additional coverage: defer a valid EPUB parse, cancel/replace/unmount, resolve it, and assert no stale chapters or import-complete action.
- The fake Worker always constructs and posts successfully at [BrowserTtsLifecycle.test.ts:56](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/src/components/BrowserTtsLifecycle.test.ts:56). Newly added constructor/postMessage catch paths are therefore not exercised by this suite. Add controlled throws for initial load, fallback load and generation, checking queue unlock and single settlement.
- Worker events, watchdog time and tiny MP3 buffers are controlled. The suite proves component/queue behavior, not actual inference, decodable/downloaded audio, device compatibility, memory bounds, real 90-second stalls, production privacy or beta exit. The fake-browser harness fulfills every page request locally and runs no server or real model. Full-size EPUB UI success and real-model verification were not performed here.

## Other Open Acceptance

- Marketing keeps stale rows as `status:'observed'` at [marketing-orchestrator-report.mjs:184](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/marketing-orchestrator-report.mjs:184) and passes the first gap to action selection at line 333 without inspecting its age. The recommendation helper still says a page `is still` in the old state. Weekly Markdown omits original dates/paths at [seo-agent-self-evaluation.mjs:411](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/seo-agent-self-evaluation.mjs:411). This confirms the implementation report's acknowledged presentation/action-consumer gap; preserving provenance in JSON alone is not end-to-end evidence fidelity. Verify dated JSON and Markdown fixtures and request a refresh before actionable current-state claims.
- Existing Ask successes/declines, electrical qualifiers, concrete normalization, token denominators, dates and ASCII arithmetic pass their focused REST fixtures. That supports the implemented examples, not the omitted adversarial inputs above or rendered browser presentation.
- No full campaign acceptance sequence, `aft ask-audit`, `aft indexing-gaps`, marketing orchestration, integrated type/build/check, production evidence refresh, or release gate was run. A later exact-page approval still requires its own SEO workbench lane, for example `node scripts/seo-agent-workbench.mjs all json-to-csv-converter tool` and a separate `blog` invocation; neither command was run here. No current indexing or demand claim is made.

## Executed Evidence

All execution occurred before the coordinator install handoff/pause. Runtime reported Node `v24.20.0`, Vitest `4.1.10`, and Chromium `151.0.7922.34`.

1. `node node_modules/vitest/vitest.mjs run --configLoader runner tests/api/askToolRouter.test.ts src/lib/browserTtsInput.test.ts src/lib/browserTtsImport.test.ts scripts/lib/new-tool-growth-pilot-report.test.mjs --reporter=dot`: **380 passed**, four files, exit 0, 710 ms reported duration, start 13:02:06.
2. `node node_modules/vitest/vitest.mjs run --configLoader runner src/components/BrowserTtsLifecycle.test.ts scripts/lib/search-console-inspection-reports.test.mjs --reporter=dot`: **53 passed**, two files, exit 0, 13.92 s, start 13:02:20. Includes 35 actual mounted-component tests and 18 inspection/consumer tests; no skips. The completed session was polled to exit before handoff.
3. In-memory `node --input-type=module` adversarial probes: TypeScript AST extraction/transpilation of actual router declarations with no imported private environment or provider, direct import of the pure pilot analyzer, and AST extraction of actual pure CLI selection helpers with synthetic `readJson`. Confirmed the exact outputs recorded above; no source/test file was created or changed. The first CLI extraction omitted its `DAY_MS` binding and exited 1 after the earlier parser/pilot probes had completed; the corrected CLI-only extraction exited 0 and reproduced the freshened July row. This harness correction is not a product failure. No real REST/model call was made by these extra probes.
4. Read-only evidence gathering used scoped `git status`, `git diff`, `git rev-parse HEAD`, `rg`, `Get-Content`, structured campaign JSON parsing and SHA-256 file reads. The lightweight memory registry search found no relevant prior review entry and supplied no review evidence.

**Total: 433 focused tests passed across six files before installation.** These are rerun results from this reviewer, distinct from the implementers' larger historical test counts. Detailed command results are in this review's tool transcript; no extra log/artifact was written outside this report. Test execution and all `node_modules` use remain stopped; the later coordinator all-clear did not require another test run for this source-review handoff.

## Source Fingerprints

SHA-256 of the uncommitted principal files read for this review, recorded after testing and before report writing. HEAD alone must not be used to re-identify this patch. Paths are relative to R.

| Path | SHA-256 |
| --- | --- |
| `src/lib/askToolRouter.ts` | `05FB41BA0E5EDCB624DDE91F3F161DCE1B96E5D9F9410F282F4DF5A6672D2826` |
| `tests/api/askToolRouter.test.ts` | `B46ECC49B87AB24C7F8833D95A39748A6051347ED5C8C6277ED9678C0D67A5A9` |
| `src/components/TextToSpeechAudiobookGenerator.tsx` | `C0C9522FB1225AAC334F11BEB6613A857A06404069D06B5A5FB361EEEAB0D8DF` |
| `src/components/BrowserTtsLifecycle.test.ts` | `0857325D7F05B69E82E4477B21B71212470458711DF705D0B13E49C045562F39` |
| `src/lib/browserTtsInput.ts` | `D62C4E20C3A92985CEC8270461D2F5E6FD2733351FF17B5C967ADD92CB997567` |
| `src/lib/browserTtsImport.ts` | `2B1E7F1905A8A2C522C6B1D541D7EADCD2544E4AC91C5D1641BDC82212D80AD0` |
| `scripts/lib/search-console-inspection-reports.mjs` | `E9B9DFDDC6B84E051B99B34F6498EB2566A8D920E24F0BCF2FC075E8F364AA50` |
| `scripts/lib/new-tool-growth-pilot-report.mjs` | `A55561A79A854BA643FC236B437E111EEFEF68DC001535E16808F9FE7D16BE35` |
| `scripts/marketing-orchestrator-report.mjs` | `82BF34B1C42972BE840A4456F576253B368C3345EC26BA6561AE8D93F3E4EA80` |
| `scripts/seo-agent-self-evaluation.mjs` | `943E557C2C980270F2F7C4E9F45ADECB090595D401BB9F1A175256762BEFD02B` |
| `scripts/aft-cli.mjs` | `47C6239B7D994E8E4BC702BED46399681AA8F59BE18B6C33927E580E227832C6` |

No task is marked approved or complete by this report. Resolve the findings, supply the missing selected-task acceptance evidence, then obtain a fresh independent judgment against the resulting exact source.
