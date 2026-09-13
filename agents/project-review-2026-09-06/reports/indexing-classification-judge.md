# EV-03 Independent Peer Judge

Date: 2026-09-06, Australia/Brisbane. Recommendation: **not yet evidence_ready**. Three reproducible EV-03 gaps remain; this is not a final approval or campaign status change.

Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`.
Branch: `codex/gpt6-review-implementation`.
HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`, plus shared dirty implementation.

## Remaining Findings

### J-EV03-01 [P2] Relative saved recommendations bypass the no-recovery guard

- Source: `scripts/lib/agent-tools-report.mjs:1553` extracts only absolute URLs from recommendation text, alongside structured `url`/`target`. A relative route appearing in the title/reason is not checked against policy or current PASS observations.
- Independent reproduction: current PASS for `/tools/kawaii-emoji-generator/`, one unrelated real gap, and two saved titles: `Request indexing for /tools/text-to-speech-audiobook-generator/` and `Request indexing for /tools/kawaii-emoji-generator/`. SEO Console emits both as High-priority indexing tasks, despite the first route's intentional noindex and the second's current PASS. The source-level gap classification itself correctly excludes both; the saved-action path reintroduces them.
- Evidence: `output/project-review-followup/EV-03-judge/relative-marketing-actions.json`; judge test at `indexing-classification-judge.test.mjs:107`. Confidence: high, actual entry point, no network.
- Consequence: a saved recommendation can contradict intentional pilot exclusion or revive recovery for an already indexed page. This is a bad local recommendation, not proof of a performed indexing request or production policy change.
- Minimal fix: normalize explicit same-origin relative route references, or require/use structured route targets, before the existing excluded/PASS veto. Preserve the unrelated real recovery candidate.
- Acceptance: relative and absolute forms of those same two saved tasks are suppressed with another gap present; current real recovery tasks remain; no pilot-date activation is introduced.

### J-EV03-02 [P2] Older performance recovery rows override a newer exact PASS

- Sources: `scripts/aft-cli.mjs:500` filters performance recovery rows only for source-policy exclusions. `scripts/lib/agent-tools-report.mjs:1070` / `:1101` likewise do not reconcile those recovery rows with the selected newest per-URL inspection.
- Independent reproduction: September 5 exact PASS (`Indexed, not submitted in sitemap`) for `/tools/kawaii-emoji-generator/`, plus a July 1 performance `tierARecovery` entry explicitly saying `Recover indexing` for the same route. Both CLI and SEO Console report no exact indexing gaps, but CLI still exposes that old recovery row and SEO Console emits `Recover indexing /tools/kawaii-emoji-generator/; Historical recovery sample` as high priority.
- Evidence: `output/project-review-followup/EV-03-judge/older-performance-pass.json`; judge test at `indexing-classification-judge.test.mjs:119`. Confidence: high, actual entry points with fixed observation dates.
- Consequence: the exact inspection lane respects EV-01, but a secondary older recovery input reverses its practical recommendation. This undermines PASS non-recovery and can cause unnecessary Kawaii indexing work.
- Minimal fix: reconcile indexing-recovery recommendations with newer usable exact-URL classifications and observation dates. Suppress older recovery for a newer PASS, retaining provenance. Do not suppress unrelated CTR/content opportunities merely because a page is indexed, and do not let undated/stale PASS evidence erase a genuinely newer failure.
- Acceptance: the reproduced July-recovery/September-PASS case has no recovery recommendation in either consumer; reverse chronological cases preserve newer failures; ordinary CTR work remains independent.

### J-EV03-03 [P2] Explicit indexing blocks become unavailable when coverage wording is absent

- Sources: `scripts/lib/indexing-classification.mjs:28` returns unavailable before checking explicit block state on line 29. The three selectors also require coverage text to make an observation usable: `scripts/aft-cli.mjs:323`, `scripts/lib/agent-tools-report.mjs:836`, `scripts/marketing-orchestrator-report.mjs:180`.
- Independent reproduction: fresh, source-backed, error-free inspection for indexable `/tools/percentage-calculator/`, `indexingState: BLOCKED_BY_META_TAG`, `verdict: NEUTRAL`, and empty `coverageState`. CLI, Link Helper, SEO Console and marketing all classify it `unavailable`, not `failure`. Supplying neutral coverage wording (`Excluded`) with explicit HTTP-header block is correctly classified as failure across all four.
- Evidence: `output/project-review-followup/EV-03-judge/missing-coverage-block.json` and `four-consumer-controls.json`; judge test at `indexing-classification-judge.test.mjs:98`. Confidence: high for the supported input shape; this does not assert that today's production export omitted coverage wording.
- Consequence: known blocking evidence is reduced to generic missing-evidence refresh rather than the required unexpected-indexability-failure review.
- Minimal fix: let a reliable explicit blocked indexingState establish failure without requiring coverage prose. Keep intentional exclusions and PASS precedence, and retain error, source-path and observation-freshness gates; stale/failed observations still must not become current repair authorization.
- Acceptance: fresh explicit meta/header blocks with empty coverage are failure in all four consumers; missing all indexability fields remains unavailable; stale/future/error variants remain non-authorizing.

## Tool-Brief Crash: Independently Verified Closed

The coordinator's initial full-check log at `output/project-review-followup/integration/check-indexing-analytics-initial.log:60` records two actual failures, not a test-fixture mismatch: `TypeError: classify is not a function`, called from `toolSearchConsoleStatus()` at line 2203. This judge inspected the pre-fix call `searchConsoleGaps()` and did not modify it.

During review, the coordinator supplied the minimal source fix at `scripts/lib/agent-tools-report.mjs:2203`: `searchConsoleGaps(createIndexingClassifier())`. No fixture-only repair would have corrected the missing runtime argument.

Independent verification ran the entire unchanged **27-test file**, twice, in disposable source copies with nonempty synthetic inspection reports, not the prior filtered nine-test selection. Both runs passed, including both tool-brief tests. Final run: 15:44:50 Brisbane, **27 passed / 0 skipped**, exit 0, 1.75 seconds. The deterministic inspection fixture ensures an empty ambient report cannot conceal this regression. The existing suite itself still relies on ambient inspections for the two tool briefs; the new judge harness supplies them explicitly.

Verified source SHA-256: `B4B9889A3231AAF07C5DD399D2C7EB2164B71978848451D123590CC7B41BDC52`.
Unchanged existing test SHA-256: `40D3E07A09C8A7CFEDAD00849DAAEBD8E9D952CC70427A9A34089BA673EB36EC`.
Exact full-file output and both hashes: `output/project-review-followup/EV-03-judge/full-agent-tools.txt`.

## Executed Regression Evidence

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner scripts/indexing-classification.test.mjs scripts/lib/indexing-classification.test.mjs scripts/lib/search-console-inspection-reports.test.mjs scripts/evidence-cli.test.mjs scripts/provider-status.test.mjs --reporter=dot
```

Result: **179 passed in 5 files**, exit 0, 15:40:04 Brisbane, 18.25 seconds. Covers the existing four-consumer PASS/noindex/failure fixtures and EV-01 newest-per-URL/provenance tests plus EV-02 saved-provider/current-attempt interactions. No timeout values were raised. This was a focused regression run, not a full check or production refresh.

```powershell
node --test agents/project-review-2026-09-06/reports/indexing-classification-judge.test.mjs
```

Final result: **2 judge cases passed / 3 failed**, exit 1, 5.27 seconds. One passing case executes all 27 existing tests; the other independently verifies PASS case/whitespace/coverage variants, all six intentional noindex routes, and a fresh explicit HTTP-header failure across CLI, Link Helper, SEO Console and marketing. The three failing cases are the findings above, not timing failures.

The full-file child command is `node node_modules/vitest/vitest.mjs run --configLoader runner scripts/lib/agent-tools-report.test.mjs --reporter=verbose`, launched against the disposable source copy with a network-blocking preload. Original test source and assertions are unchanged. Source/docs/scripts are copied into an OS-temp directory; existing dependencies are reused through a removable junction. All report writes, preserved-file test mutations and synthetic analytics fixtures stay in that disposable copy. Real analytics/logs and shared report fixtures are not read or changed by this harness. Cleanup verifies the absolute temp-root boundary and removes the dependency junction before deleting the copy.

The initial integration log's analytics/provider timeouts occurred during the coordinator's full run. This judge did not re-review EV-04, attribute timing conclusively, increase timeouts, change provider behavior, or launch concurrent browsers. The provider-focused regression included above passed. No analytics-consumer expansion was undertaken.

## Scope, Preservation And Recommendation

Reviewed the nine files listed by `indexing-classification-implementation.md`: the classifier and its test, actual-entry-point tests, indexing/provider-interaction regions of agent-tools/CLI/marketing, the legacy report test file (expanded to all 27 tests at the owner's request), the EV-01 inspection-test harness adaptation, and the implementation report. The user-provided integration log was read for the tool-brief failure. Existing EV-01/EV-02 regressions were executed as preservation checks, not expanded into unrelated source reviews.

The original eight source/test hashes matched the specialist's freeze on entry. On final comparison, all nine reviewed files remained unchanged except the coordinator's acknowledged one-line tool-brief call-site fix. This judge authored only this report and its separate judge-only test harness, plus ignored isolated proof output. No implementation, existing test fixture, shared campaign, package/lock, evidence worklog, indexing policy or review queue was edited. No full check, build, install, commit, live/provider action, submission, deployment or spending occurred. All child processes exited.

Existing workbench evidence remains the separate specialist report's `node scripts/seo-agent-workbench.mjs judge text-to-speech-audiobook-generator tool`; it was not rerun and is not approval of this patch or a pilot release.

Recommendation: keep EV-03 short of **evidence_ready** until J-EV03-01/02/03 pass their focused regressions and the current 179-test preservation set plus full 27-test report suite remain green. The tool-brief crash is no longer an open finding. No final approval or campaign status is issued here.

## Authorized Implementation Follow-Up And Recheck

2026-09-06, 16:04 Brisbane (06:04 UTC). This section supersedes the earlier remaining-gap recommendation for the exact source freeze below. The owner subsequently authorized this judge to implement J-EV03-01/02/03. Accordingly, this is a post-fix regression recheck by the implementer, not a new independent approval. Recommendation: **evidence_ready for coordinator integration checking**. All three reproduced local gaps are closed; integrated full check and the coordinator's final judgment remain pending. No campaign status was changed.

### Exact Changes

- J-EV03-01: `scripts/lib/agent-tools-report.mjs:1570` now includes structured `path` and explicit relative route references in saved recommendation text before the existing policy/PASS veto. Actual SEO Console tests cover title, reason and path inputs with query/hash variants. Intentional noindex and current PASS cannot revive recovery; an unrelated real recovery candidate remains.
- J-EV03-02: `scripts/lib/indexing-classification.mjs:24` adds a bounded chronology helper, consumed by CLI performance recovery at `scripts/aft-cli.mjs:493` and SEO Console at `scripts/lib/agent-tools-report.mjs:1057`. Only a strictly newer, fresh, error-free, source-backed exact PASS supersedes the same URL's older indexing-recovery row. Output preserves PASS source/date and the superseded recovery date. A source data day takes precedence over later import time and is conservatively treated as the end of that Brisbane day. Equal/unknown recovery dates and stale, older, future, undated, errored or missing-source PASS do not suppress recovery. CTR opportunities are not filtered by this new rule; newer selected failures remain visible.
- J-EV03-03: `scripts/lib/indexing-classification.mjs:20` recognizes the two explicit meta/header blocked states without requiring coverage prose. CLI, agent-tools and marketing selectors accept those states as usable evidence only with the existing source-path, error and freshness gates. Their output retains the block code. Intentional exclusions and PASS precedence remain unchanged; stale/future/undated/error/missing-source cases remain non-authorizing.
- Durable regressions live in the existing actual-entry test file `scripts/indexing-classification.test.mjs:119`, `:160` and `:216`, with date-boundary/precedence tests in `scripts/lib/indexing-classification.test.mjs`. The EV-01 function-extraction test harness only gained the new helper import and binding in `scripts/lib/search-console-inspection-reports.test.mjs`; existing assertions were not weakened.

### TDD And Final Evidence

Before implementation, the unchanged separate judge reproduced **2 passing / 3 failing cases**, exit 1. Added durable entry-point cases then produced **15 failing / 82 passing tests**, exit 1, 24.42 seconds. After the initial fixes, the entry-point and classifier pair passed **110 tests**, exit 0, 24.46 seconds. Additional chronology-boundary tests and the existing extracted-function harness binding were included before the final run below.

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner scripts/indexing-classification.test.mjs scripts/lib/indexing-classification.test.mjs scripts/lib/search-console-inspection-reports.test.mjs scripts/evidence-cli.test.mjs scripts/provider-status.test.mjs scripts/lib/production-analytics-report.test.mjs --maxWorkers=1 --reporter=dot
```

Final focused result: **254 passed in 6 files**, exit 0, start 15:59:49 Brisbane, 45.52 seconds. Includes EV-01 provenance/newest-observation and EV-02 provider preservation checks, plus the three production analytics regression tests as an integration-preservation check only. Workers were serialized; no timeouts were raised. This is not a full check or an EV-04 re-review.

```powershell
node --test agents/project-review-2026-09-06/reports/indexing-classification-judge.test.mjs
```

Final unchanged-judge result: **5 passed / 0 failed**, exit 0, 5.05 seconds. Its full-file child run independently executed the current unchanged **28-test** agent-tools file: **28 passed / 0 skipped**, exit 0, start 16:02:34 Brisbane, 1.80 seconds. The judge case's historical title still says "27"; the actual full-file output proves 28, with no name filter. Both formerly crashing tool-brief cases and the coordinator's production coverage consumer regressions pass. Updated proof: `output/project-review-followup/EV-03-judge/full-agent-tools.txt`, alongside the four synthetic JSON outputs already listed above. Fixtures remain disposable and network-blocked.

All eight scoped JavaScript files pass `node --check`. Scoped `git diff --check` exits 0 (only existing Windows LF/CRLF advisory warnings). All test processes exited.

### Preserved Coordinator Work

Compared against the captured dirty texts at the start of this authorized fix, the following are byte-for-byte unchanged: `toolSearchConsoleStatus()` including `searchConsoleGaps(createIndexingClassifier())`; the EV-04 coverage import, `analyticsSignals()`, `toolAnalyticsStatus()`, Link Helper analytics recommendation/reason block and analytics report fields; the entire current `scripts/lib/agent-tools-report.test.mjs`; CLI `getDataForSeoBalance()` and marketing `readProviderJson()` / `dataForSeoBalance()`. The unchanged whole-test SHA-256 below also covers both coordinator analytics regression updates.

Seven of the eight owned implementation/test files were edited, solely in the indexing regions and their tests; the eighth, `scripts/lib/agent-tools-report.test.mjs`, was executed but left unchanged. Outside these eight, only this report was appended. The separate judge harness was not changed. Other dirty implementation, EV-01/EV-02 source behavior, analytics regions, indexing policy, package/lock files, campaign manifests and shared worklogs were preserved. No full check, build, install, external network/provider request, real-log read/delete, production action, spend or commit was performed for this fix.

### Frozen Source Scope

Branch and HEAD remain `codex/gpt6-review-implementation` / `243d71d1d832b398cba86d5c7fcc70deefa25f25`; hashes include the preserved shared dirty work. These are the exact eight-file handoff, not a clean-tree assertion.

| File | SHA-256 |
| --- | --- |
| `scripts/lib/indexing-classification.mjs` | `f2cbfc9a1dd36647e598b79b8edae8fab6de6e8c3f65bc86b030c612854c5cc7` |
| `scripts/lib/indexing-classification.test.mjs` | `b846f52353ab4e754f4eaa1e0b75fc466b347958ad0adb0a471591e9e1f18754` |
| `scripts/indexing-classification.test.mjs` | `e9067fd697a00f719f09194674258289662c7955b77f8ef7e73765a20217953c` |
| `scripts/lib/agent-tools-report.mjs` | `01f2ddad64ba8fc57d37b0165422dd79a9f459b476aeb97b386424cd2f685a1f` |
| `scripts/lib/agent-tools-report.test.mjs` | `f36b4f5bdf86aa4dce8a24490630666bf357030928dac726eff0b4b782911dd9` |
| `scripts/aft-cli.mjs` | `1ab42a6e8c4b130cacae28928dbbbdf121caf92a81fdc96fa5b18ce69ffd37e7` |
| `scripts/marketing-orchestrator-report.mjs` | `d764bc6f5c53466cd0a67fd15bad3559faecb89fd5bc97cfdeb41fc6eb7c75b2` |
| `scripts/lib/search-console-inspection-reports.test.mjs` | `87157430545e188dc1b3f23d87756d58e7ffa9f3b11f1027a72a28ca3b35ba76` |

Ready for the coordinator's integrated full check against this freeze. This bounded handoff grants no page/pilot release approval and makes no production indexing or analytics-continuity claim.
