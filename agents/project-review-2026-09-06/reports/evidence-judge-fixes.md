# EV-01 Evidence Judge Fixes

Date: 2026-09-06, Australia/Brisbane. **Owned source and tests are stable for coordinator integration. Focused EV-01 verification: 85 passed. Two legacy indexing CLI assertions need coordinator follow-up; no full-check, implementation approval, live indexing claim, or pilot activation is claimed.**

## Source And Scope

- Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review` (R below).
- Branch: `codex/gpt6-review-implementation`; observed HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`. These fixes are uncommitted and build on the prior uncommitted EV-01 implementation. HEAD alone does not identify the patch.
- Read root/campaign AGENTS, campaign EV-01 acceptance, `reports/implementation-batch-two-judge.md`, `reports/evidence-provenance-implementation.md`, evidence worklog, relevant campaign report sections, brand/orchestrator/pilot guidance, and scoped source/tests. Shared freshness is the existing seven-day inclusive policy.
- Edited only the five assigned executable modules, the two assigned library test files, new `scripts/evidence-cli.test.mjs`, this report, and an appended evidence worklog entry.
- In `scripts/aft-cli.mjs`, edits are the shared evidence import, inspection selection, freshness counts, indexing recommendation guard, and inspection text output. Existing PR01 promotion imports/functions/authorization changes are preserved. `scripts/aft-cli.test.mjs` was read/tested but not edited.
- No edits to global campaign/task/status files, `safe-cleanup-audit.test.mjs`, browser tests, provider code, merge CLI, promotion helper, packages or dependencies. The coordinator owns cleanup/browser/integration verification.

## Findings Addressed

### J2-04: Indexing CLI Consumer

High confidence from the actual CLI entry point against synthetic files.

- [aft-cli.mjs:336](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/aft-cli.mjs:336) feeds both raw inspection and weekly summary records into the shared per-URL merger. Newest actual observation wins in both PASS-to-failure and failure-to-PASS directions. A partial raw report cannot remove summary-only URLs.
- [search-console-inspection-reports.mjs:93](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/search-console-inspection-reports.mjs:93) recognizes weekly rows as derived observations, never borrowing the weekly wrapper date/path. Explicit null row origins and raw report origins remain null. Missing merged origins remain empty. Repeated merges retain the original provenance.
- CLI row and aggregate freshness use `inspectionEvidenceFreshness`; future observations stay future, not age-zero fresh. Aggregate date is the newest selected observation, not the wrapper generation time. The evidence kind is now `merged-url-inspection`; no other source consumer of the old kind strings was found by scoped search.
- [aft-cli.mjs:422](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/aft-cli.mjs:422) requests refreshed inspections for historical/unavailable rows before recommending page changes or indexing. Errors and incomplete observations remain visible instead of disappearing behind older PASS records. Printed observations include original date, path, freshness and evidence status.
- Actual command coverage: [evidence-cli.test.mjs:69](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/evidence-cli.test.mjs:69).

### J2-05: Pilot Origin Gate

High confidence from direct analyzer and rendered-report fixtures.

- [new-tool-growth-pilot-report.mjs:97](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/new-tool-growth-pilot-report.mjs:97) requires a usable original source path as well as fresh, post-launch, non-error coverage evidence. A recent merged PASS without that path cannot contribute discovery/indexing counts or pass readiness.
- [search-console-inspection-reports.mjs:32](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/search-console-inspection-reports.mjs:32) accepts nonblank string origins without control characters; missing/null/blank/non-string/control-character paths are unavailable. At equal observation times, a usable origin wins over an invalid one. This is structural provenance validation, not a filesystem-existence check or reconstruction of lost evidence.
- Pilot Markdown reports unavailable paths honestly and keeps the observation timestamp/freshness. The readiness issue asks for fresh exact-URL proof instead of asserting that an old Google state is current.
- Negative fixtures cover absent, blank, whitespace, null, number, object, array and NUL-containing origins. A positive file-backed raw record remains gate-eligible through nested JSON round trips: [new-tool-growth-pilot-report.test.mjs:52](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/new-tool-growth-pilot-report.test.mjs:52).

### EV-01: Presentation And Action Consumers

High confidence from actual saved JSON/Markdown and recommendation outputs.

- [marketing-orchestrator-report.mjs:170](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/marketing-orchestrator-report.mjs:170) uses the same raw/weekly merger. Dated old gaps are `historical`; malformed/future/missing-origin/error rows are `not enough data`. Original coverage remains separate from the current-evidence classification.
- [marketing-orchestrator-report.mjs:333](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/marketing-orchestrator-report.mjs:333) routes unsupported observations to an inspection-refresh recommendation even when built-link proof offers a page-edit opportunity. The existing current-state recommendation helper is called only for fresh, usable observations. Fresh submitted-indexing proof retains its recheck behavior.
- [marketing-orchestrator-report.mjs:448](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/marketing-orchestrator-report.mjs:448) adds original dates/paths and freshness/status to Markdown inspection evidence.
- [seo-agent-self-evaluation.mjs:107](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/seo-agent-self-evaluation.mjs:107) merges the prior saved weekly summary with raw input before rewriting that summary. Repeated partial or raw-missing runs no longer discard summary-only URLs or their null/missing origins.
- [seo-agent-self-evaluation.mjs:416](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/seo-agent-self-evaluation.mjs:416) renders saved states with original dates/paths/freshness. The indexing action requests refresh when any selected evidence is historical/unavailable, instead of assuming a current page-quality issue.
- Actual report boundaries: [evidence-cli.test.mjs:155](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/evidence-cli.test.mjs:155) and [evidence-cli.test.mjs:210](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/evidence-cli.test.mjs:210).

## Executed Verification

Runtime observed in test output: Node `v24.20.0`, Vitest `4.1.10`. Commands ran in R; actual report subprocesses used isolated temporary synthetic workspaces, a fixed September 6 clock, a throwing fetch guard, and `--skip-dataforseo` for the weekly command. They did not run against real ignored report data. No evidence-import command, provider refresh, paid call, network request, install, build, full check, deployment or public action was executed.

1. `node node_modules/vitest/vitest.mjs run --configLoader runner scripts/lib/search-console-inspection-reports.test.mjs scripts/lib/new-tool-growth-pilot-report.test.mjs --reporter=dot`: initial RED **15 failed, 39 passed**, then GREEN **54 passed**. One parameterized array fixture was corrected so the array itself, not its first element, is tested as an invalid path.
2. `node node_modules/vitest/vitest.mjs run --configLoader runner scripts/evidence-cli.test.mjs --reporter=dot`: indexing RED **9 failed, 3 passed**, then GREEN **12 passed**. Expanded marketing/weekly RED **12 failed, 12 passed**. The first two harness attempts failed before product assertions because eval-mode argv parsing differed from normal script execution and `process._eval` was read-only. The final harness uses a preload and normal script entry points; those launch errors are not product findings.
3. Final combined command: `node node_modules/vitest/vitest.mjs run --configLoader runner scripts/evidence-cli.test.mjs scripts/lib/search-console-inspection-reports.test.mjs scripts/lib/new-tool-growth-pilot-report.test.mjs scripts/lib/marketing-orchestrator-recommendation.test.mjs --reporter=dot`: **85 passed in 4 files**, exit 0; start 13:22:42 Brisbane, 4.61 seconds reported duration. No skipped/disabled tests in this command. This includes 24 actual CLI/report fixtures, existing merge CLI synthetic subprocesses, pure selector tests and pilot analyzer/renderer tests.
4. Legacy integration probe: `node node_modules/vitest/vitest.mjs run --configLoader runner scripts/aft-cli.test.mjs --testNamePattern="aft CLI indexing gaps" --reporter=dot`: **5 passed, 2 failed, 2 excluded by name filter**, exit 1. Details below. No assertion was weakened or disabled.
5. `node --check` passed on each of the five executable modules. Scoped `git diff --check` passed, with Git LF-to-CRLF normalization warnings only. Source/test hashes below were recorded after final testing. Read-only scope verification used `rg`, `Get-Content`, `git status`, `git diff`, `git rev-parse HEAD`, `git branch --show-current` and `Get-FileHash`.

All owned subprocesses exited. Source/test files are stable; after the coordinator handoff only this report and the evidence worklog were written.

## Coordinator Follow-Up

The unchanged legacy [aft-cli.test.mjs:237](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/aft-cli.test.mjs:237) expects `request-indexing is already submitted for every current gap` from an undated observation. [aft-cli.test.mjs:268](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/aft-cli.test.mjs:268) expects link improvement and discovery submission from another undated observation. Those conflict with the evidence action guard. Minimal follow-up: supply a current raw `generatedAt` in these two fixtures to retain their original fresh-action purpose, or explicitly change their expected action to inspection refresh. The new tests already cover undated/null origins. Do not weaken the guard to satisfy these legacy assertions. This shared test file was outside the assigned edit list and was left unchanged.

The coordinator reported 128 browser smoke checks and 12 masking fixtures completed, with full check waiting for source stability. Those are coordinator-reported results, not this specialist's executions. No further browser, cleanup or full-check work was attempted. The four-channel review was reported as source-policy-only; no real-worktree marketing command was run here.

Remaining gates: reconcile the two legacy fixtures, run coordinator integration/full check, and obtain an independent judge decision against the final source. No global EV-01 status was rewritten. Broader EV-02/EV-03/EV-05 provider truth, aggregate membership/window validation, production analytics, game pilot and source-file existence verification remain outside this patch. No current indexing/demand or complete pilot-release approval is inferred from synthetic evidence.

For later exact-page SEO approval, reference `node scripts/seo-agent-workbench.mjs all json-to-csv-converter tool` and the separate `blog` invocation. Neither was run. Specialist/evaluator/micro-agent/final-judge and owner release gates still apply.

The provenance-hygiene skill was inspected. No public copy/media was prepared, no private engineering material was sent to its network service, and no provenance marks/disclosures were removed.

## Stable Source Fingerprints

SHA-256; paths relative to R. The CLI fingerprint includes the preserved, pre-existing PR01 changes.

| Path | SHA-256 |
| --- | --- |
| `scripts/aft-cli.mjs` | `DF7C12E0804DB2FB974C40569C3397836D2F850F62040524B5F59A9813494C13` |
| `scripts/lib/search-console-inspection-reports.mjs` | `3C1846825D1CB9FC28DA4AB45942EA3E353A92EC933831C83F6266529D6504B0` |
| `scripts/lib/search-console-inspection-reports.test.mjs` | `D845747E796340DA6E7881C19C12423C80CDCA83CBED214EE43A48B9979FB2B8` |
| `scripts/lib/new-tool-growth-pilot-report.mjs` | `2B58153D86E5EAF3D76183CCC6083B25E5B6ED4A550E376C408D92A641A5096A` |
| `scripts/lib/new-tool-growth-pilot-report.test.mjs` | `B846B3BD6C0E1CA60BEF1CB83E67705003F65707A9F9F80F65D9CB66B294C964` |
| `scripts/marketing-orchestrator-report.mjs` | `4BD93776C39FEE78DBF05F698D535B7EF79C8A5801EF383FCBDE7CEC4FA8E24C` |
| `scripts/seo-agent-self-evaluation.mjs` | `B54BF66C1A3ADAB035DA0B467063D149AAC8EB496D14309F90FFD4A4EC5343FD` |
| `scripts/evidence-cli.test.mjs` | `122E6EF5926139247E273CED8BC3A78F23A51056252BEA212AB143C196D623BF` |
