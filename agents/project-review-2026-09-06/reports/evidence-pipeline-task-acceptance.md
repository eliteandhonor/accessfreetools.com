# Evidence Pipeline Task Acceptance

Date: 2026-09-06, Australia/Brisbane. Independent Release Judge. Local task acceptance only.

Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review` (R).
Branch: `codex/gpt6-review-implementation`.
HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`, plus reviewed dirty source.
Local `origin/main`: `90d6dcab0580a91ca66382f2414d95e8817469e5`. No fetch was performed.

## Decisions

| Task | Exact Decision | Bounded Acceptance |
| --- | --- | --- |
| EV-01 | **LOCAL APPROVE** | Newest per-URL observation selection, original date/path preservation through nested merges and explicit multi-worktree ingestion, partial URL retention, and pilot freshness/error/origin gates. Not whole-pilot readiness or approval of every serialized field. The separate block-state loss is assigned to EV-03 below. |
| EV-02 | **LOCAL APPROVE** | Cached observations remain distinct from saved/current attempts; independent daily steps continue after provider failures and expose complete/partial/failed outcomes and genuine current low-balance warnings. Not live provider/account/GSC/scheduler certification. |
| EV-03 | **NOT APPROVE** | A common weekly-report path drops explicit indexing blocks and breaks the otherwise shared four-consumer classification policy. J-EV-TASK-01 below is blocking. |

These are decisions against the exact campaign task contracts, not deployment, page SEO, production-data, campaign, or whole-goal approval. No manifest, board, task state, or worklog was changed. Earlier independent local approvals outside EV-01/02/03 were not reopened.

## Blocking Finding

### J-EV-TASK-01 [P2]: Weekly Serialization Erases Explicit Indexing Blocks

**Task: EV-03. Confidence: high, independently reproduced through actual report/CLI entry points.**

At [seo-agent-self-evaluation.mjs:107](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/seo-agent-self-evaluation.mjs:107), `summarizeInspection` reconstructs each weekly row without `indexingState`. Its usable-evidence test at line 113 also requires coverage prose, unlike the other consumers' support for an explicit `BLOCKED_BY_META_TAG` or `BLOCKED_BY_HTTP_HEADER` without prose.

[Marketing selection:109](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/marketing-orchestrator-report.mjs:109) merges the weekly summary before raw input. The [equal-date/source tie rule:120](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/search-console-inspection-reports.mjs:120) keeps that first, lossy version when both represent the same original observation. Marketing therefore loses the block even while the intact raw report is present. With only weekly evidence, CLI, Link Helper and SEO Console lose it too.

Independent fixture: fresh September 5 observation for `/tools/percentage-calculator/`, verdict `NEUTRAL`, indexing state `BLOCKED_BY_META_TAG`. Both empty coverage and `URL is unknown to Google` were exercised. All four consumers initially return `failure / observed` with the block code. Run the actual weekly entry point with `--skip-dataforseo`, then reread the consumer outputs:

| Coverage | Raw Plus Weekly | Weekly Only |
| --- | --- | --- |
| Empty | Marketing changes to `unavailable / not enough data`; other three retain raw failure. | All four become unavailable and lose the block. |
| URL is unknown to Google | Marketing changes to `recovery / observed`; other three retain raw failure. | All four become recovery and lose the block. |

Original source path/date and freshness survive. This is loss of the observed state, not a newer observation superseding an older one. In the unknown-coverage case, actual marketing Markdown recommends refreshing built-link proof, instead of retaining the explicit robots-block diagnosis. In the empty-coverage case, a known current block becomes missing evidence. No claim is made that a production URL is blocked.

Retained reproduction files:

- [Empty coverage round trip](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/EV-01-03-task-judge/recheck/fixtures/weekly-block-empty/round-trip.json): raw controls, weekly serialization, raw-plus-weekly outputs, and weekly-only outputs.
- [Unknown coverage round trip](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/EV-01-03-task-judge/recheck/fixtures/weekly-block-unknown/round-trip.json): the same four-consumer comparison.
- [Failing independent tests](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/EV-01-03-task-judge/independent-probes-recheck.log): 15 passed, 2 failed, 0 skipped. Both failures remain unfixed.
- [Independent assertions:210](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/EV-01-03-task-judge/independent-probes.mjs:210). Exact child commands, cwd, exit codes and outputs are retained under `R/output/project-review-followup/EV-01-03-task-judge/recheck/commands/`.

**Minimal fix, assigned back to the evidence implementation owner:** preserve `indexingState` in weekly rows; apply the same usable explicit-block rule as the shared consumers; ensure an existing lossy weekly copy cannot outrank an intact raw copy of the identical source/date observation. Keep actual newest-observation ordering, errors, source dates/paths, policy exclusions and PASS precedence unchanged. Do not invent missing historical block codes or infer live page state.

**Required acceptance:** exercise both supported block codes with empty and neutral coverage through actual weekly JSON/Markdown generation, repeated weekly rewrites, raw-plus-weekly consumption, and weekly-only consumption. All four consumers must retain the code and `failure / observed` for fresh valid evidence and route to block diagnosis, not link recovery. Also keep stale/future/error/missing-origin cases non-actionable, every PASS variant non-recovery, and all six intentional exclusions monitor-only. Rerun these failing probes and the unchanged focused suite without filtering or weakening assertions, then obtain independent EV-03 rejudgment.

## Acceptance Evidence

**EV-01:** The seven-file suite covers original-null/missing origins, date boundaries, nested serialization, old-PASS/new-failure and reverse, partial raw/weekly URL sets, repeated summaries, CLI/marketing/weekly presentation and pilot eligibility. New independent disk probes invoke the real merge CLI three times across separate worktree-shaped roots, including a future-dated wrapper, then inspect all four consumers. They retain all three fixture URLs, select the actual newest verdict in both directions, and keep the old URL's July observation date. Seven independent pilot cases cover valid, prelaunch, future, stale, undated, errored and missing-origin observations through nested wrappers. An actual pilot CLI run with a newer error in a second evidence root rejects fallback to the older PASS. All ten EV-01 independent cases pass.

Read the original implementation, evidence-judge-fixes, and batch-two acceptance reports. The earlier batch-two acceptance independently checked the documented real ingestion inventory and canonical selection. Its dated counts are historical evidence, not this run's enumeration or current Google state. The explicit `merge-search-console-inspection-reports.mjs --input-root=... --output=...` ingestion contract remains necessary: these consumers do not magically discover every future worktree copy or arbitrary filename. This bounded approval does not certify CrawlScout membership stability, comparable production measurement windows, or game-pilot decisions.

**EV-02:** The complete provider and package-entry test files were executed, including actual account/status/marketing/status-CLI entry points with mocked transport and actual daily CLI execution with synthetic children. Coverage includes sanitized failure categories, cached age/origin, failed account versus successful service attempts, repeated retained success, stale/missing reports, partial GSC results, independent continuation and balances 0/1/2/5/10/11 with current warning rendering. Four additional independent cases pass: cached low balance plus current saved IP failure and newer service success through CLI/marketing, plus injected thrown exception, timeout-shaped failure, and partial service failure. Every daily case executes all five planned steps; GSC partial results remain partial, self-evaluation continues with `--skip-dataforseo`, and IndexNow receives only `--verify-key`. No paid research or submission is executed. Read provider-status implementation and the resolved J-EV-01 follow-up rejudge; the previous missing current-balance warning remains closed locally.

**EV-03:** The unchanged full indexing-classification files and the new four-consumer control pass: PASS variants including Kawaii are non-recovery; intentional TTS tool/guide, feeds, support and HTML sitemap stay excluded; fresh unexpected HTTP-header blocking with empty prose remains failure. Existing tests cover relative saved marketing actions and newer exact PASS versus older recovery, while preserving independent CTR work. Read the implementation and final rejudge, including J-EV03-01/02/03. Their direct-input fixes remain supported, but the newly tested weekly round trip exposes the blocking gap that those tests did not cover. Passing helper or direct-input tests is not sufficient task approval.

## Executed Commands And Results

All execution was local in R, with serial tests and synthetic evidence roots under the owned ignored directory. The runners replace TEMP/TMP/TMPDIR, HOME/USERPROFILE/CODEX_HOME with owned fixture paths and pass a minimal noncredential environment. Existing entry-point tests mock or deny fetch; new consumer processes deny fetch and Node socket/HTTP connections. Injected daily callbacks never spawn a provider. No browser/server was needed or started; every child process exited.

```powershell
node output/project-review-followup/EV-01-03-task-judge/run-verification.mjs
node output/project-review-followup/EV-01-03-task-judge/run-probes-recheck.mjs
```

The first runner executes these full selected files, without test-name filters:

```powershell
node node_modules/vitest/vitest.mjs run --config output/project-review-followup/EV-01-03-task-judge/vitest.config.mjs --configLoader runner --maxWorkers=1 --reporter=dot
node --test --test-concurrency=1 output/project-review-followup/EV-01-03-task-judge/independent-probes.mjs
```

- Existing suite, 10:21:26Z: **264 passed in 7 files, 0 skipped, exit 0**, 44.02 seconds. Files: inspection merger, growth pilot, indexing classifier, indexing-classification consumer tests, evidence CLI tests, provider status tests, and daily package wiring. [Log](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/EV-01-03-task-judge/focused-existing.log).
- Initial independent harness: **11 passed, 6 failed, 0 skipped, exit 1**. Six cases stopped at marketing's unrelated missing four-channel fixture, before the intended assertions. Preserved [initial log](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/EV-01-03-task-judge/independent-probes.log) and initial fixture/command files. The harness was corrected by adding the existing synthetic `passingPromotionReview(now)` fixture; no assertion, timeout, product source or test was relaxed. No public promotion claim follows from this synthetic input.
- Corrected whole independent file: **15 passed, 2 failed, 0 skipped, exit 1**, 11.32 seconds. Ten EV-01 cases, four EV-02 cases and the direct EV-03 control pass; both weekly-block cases fail. The rerun uses a separate `recheck/` fixture and command tree. Its complete record is [independent-probes-recheck.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/EV-01-03-task-judge/independent-probes-recheck.json). Repeated runs are not added together as extra coverage.

Read-only checks additionally used `rg`, `Get-Content`, structured JSON reads, SHA-256, `git status --short`, `git rev-parse`, `git branch --show-current`, scoped `git diff`, and `git check-ignore`. An initial guessed campaign tasks-directory search failed; the actual evidence tasks file and campaign JSON supplied the contract. No original evidence was overwritten. No TypeScript source exists under this judge's output directory.

## Source Binding

The retained [final check receipt](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/SEC-01/final-2026-09-06T09-57-59.746Z/report.json) and [full-check log](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/SEC-01/final-2026-09-06T09-57-59.746Z/full-check.log) report 2,405 tests in 103 files, final exit 0 and audit 0 vulnerabilities. This judge did not rerun that full check. Its `releaseApproval: false` and dirty-build receipt remain unchanged. Existing accessibility manual-review and bundle warnings are not converted into conformance or release approval.

The referenced 2,506-file source manifest SHA-256 is `0591964992eb4eb8576280892a060c19d70026d7131714532876efe7aaa66ee3`, independently verified against the receipt. This judge compared **211 relevant script/package/policy/queue/guidance/helper files** to both current bytes and the real detached clean-install fixture at `C:/Users/chamb/AppData/Local/Temp/aft-sec01-integration-FHwIkG/worktree`: **zero mismatches**. Before/after hashes and a final post-probe comparison show **zero drift** in those files. This is not a claim that all 2,506 files were independently rehashed here.

Runtime: Node `v24.20.0`, Vitest `4.1.10`. The root TypeScript package metadata says **6.0.2**, but its loaded API reports **6.0.3**; the detached fixture's loaded API also reports **6.0.3**. No install or dependency repair was attempted. Package labels were not used to assert clean-install parity; retained fixture evidence and byte comparisons are separate.

Key current SHA-256 values:

| Path Relative To R | SHA-256 |
| --- | --- |
| `scripts/lib/search-console-inspection-reports.mjs` | `3c1846825d1cb9fc28da4ab45942ea3e353a92ec933831c83f6266529d6504b0` |
| `scripts/lib/new-tool-growth-pilot-report.mjs` | `2b58153d86e5eaf3d76183ccc6083b25e5b6ed4a550e376c408d92a641a5096a` |
| `scripts/seo-agent-self-evaluation.mjs` | `b54bf66c1a3adab035da0b467063d149aac8eb496d14309f90ffd4a4ec5343fd` |
| `scripts/lib/provider-status.mjs` | `16592194b016338b48aa7ee56f91858e9364299bbfb257f0be96e5b1d92bcc1e` |
| `scripts/seo-daily-refresh.mjs` | `3108a64af2af4c0887e87b00e4b1351cdecc1788dd560c18ce5bbf518747ef32` |
| `scripts/lib/indexing-classification.mjs` | `f2cbfc9a1dd36647e598b79b8edae8fab6de6e8c3f65bc86b030c612854c5cc7` |
| `scripts/lib/agent-tools-report.mjs` | `01f2ddad64ba8fc57d37b0165422dd79a9f459b476aeb97b386424cd2f685a1f` |
| `scripts/aft-cli.mjs` | `1ab42a6e8c4b130cacae28928dbbbdf121caf92a81fdc96fa5b18ce69ffd37e7` |
| `scripts/marketing-orchestrator-report.mjs` | `ec9b615e61684a36c39d0f6bea878d9df3e2a38c2384aae83016f4ca870e111f` |
| `src/data/indexationPolicy.ts` | `569a0231d32776d8b58f0591fff543c9d26831c0b1dc44740e6a5c2ed99ae1f3` |
| `docs/seo-tool-review-queue.md` | `20e283174892c1ad2ae1b5098cdac9fddf07933b5a1c6fb25a457141c034e1d2` |

Full current/retained/fixture hashes: [source-hashes-before.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/EV-01-03-task-judge/source-hashes-before.json), [source-hashes-after.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/EV-01-03-task-judge/source-hashes-after.json), and the final recheck JSON above. These are the binding evidence for the dirty worktree, not HEAD alone.

## Untested And Preserved

No actual account/credential inspection, provider call, Google refresh, SEO submission, paid research, production report overwrite, browser/server, build/full check, install, commit, deployment or publishing action occurred. `automation:env-check`, real `seo:daily`, production indexing-protection/sitemap commands, and real report-refresh task commands were intentionally not rerun under this assignment's limits. GSC transport/OAuth, current account balance, actual indexation, scheduler operation, current cross-worktree inventory completeness, browser compatibility and production analytics are untested here. None blocks a bounded EV-01/EV-02 data-correctness decision; none is certified by it.

Only this named report and ignored `R/output/project-review-followup/EV-01-03-task-judge/` were written. Historical 604-unit review history, Kawaii content/assets/canonicals/links, source indexation policy and all parent-owned records remain untouched. Scoped Git diffs for the review queue, indexation policy and smoke-Kawaii guidance are empty. Transcriber work was neither investigated nor modified. The parent owns implementation assignment, state updates and eventual release decisions.

Root/campaign instructions and exact EV task contracts were read. Code-review guidance informed the risk-based review; memory supplied only standing evidence/source-of-truth orientation, not current facts. Provenance-hygiene guidance was inspected: no public copy/media or cleaning operation was requested or performed, no service received private material, and no attribution/disclosure was removed. For later page-specific workbench approval, the relevant existing command is `node scripts/seo-agent-workbench.mjs judge <slug> <tool|blog>` with its specialist/evaluator/micro-agent evidence; it was not run and these infrastructure decisions do not replace it.

## EV-03 Frozen-Fix Rejudge: 2026-09-06

**EV-03: LOCAL APPROVE. J-EV-TASK-01 is closed locally.** This dated addendum supersedes only the earlier EV-03 NOT APPROVE disposition for the newly frozen hashes below. The original finding, failed probes, logs and report text above remain historical evidence. EV-01 and EV-02 prior approvals remain separate and unchanged. No new blocking finding was identified in this bounded rejudge. Confidence: high for the specified local task contract, not current Google/account data or release readiness.

Worktree, branch, HEAD and local `origin/main` remain as stated above. The source changes since this judge's previous snapshot are exactly two executable modules and two parent test files. The parent owns those edits. This judge changed no app source, parent tests, campaign metadata, task state or worklog.

### Source Review And Closure

- [Weekly usable evidence:113](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/seo-agent-self-evaluation.mjs:113) now recognizes the shared explicit-block predicate without requiring coverage prose. [Weekly row:120](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/seo-agent-self-evaluation.mjs:120) retains `indexingState`; [Markdown:419](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/seo-agent-self-evaluation.mjs:419) exposes the code. Original date/path, freshness and error gates remain intact.
- [Duplicate preference:121](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/scripts/lib/search-console-inspection-reports.mjs:121) recovers a populated state from an intact copy only when actual observation times are finite and equal, original source paths are exactly equal and usable, verdict values match, and both copies are error-free. It does not promote a wrapper date or combine different observations. An already populated state is not replaced by another state through this preference.
- The **unchanged original failed probes now pass**. Both empty and unknown coverage retain `BLOCKED_BY_META_TAG`, `failure / observed`, and the original September 5 source timestamp in CLI, Link Helper, SEO Console and marketing, with raw-plus-weekly and weekly-only inputs. The new snapshots are separate from the original failing snapshots.
- The whole parent consumer test file verifies both meta/header codes with both coverage variants, three actual weekly-generation rounds including weekly-only later rounds, all four consumers, retained original provenance, Markdown code visibility and appropriate block-review actions. PASS variants, intentional exclusions, stale/future/error/missing-origin action guards, saved-action filtering and independent CTR behavior remain covered by the full selected files.
- Fourteen additional independent tie/provenance tests pass: intact-copy preference in both orders and nested wrappers; current and candidate error guards; conflicting verdict and current PASS guards; different origins; null/invalid dates; already populated state; strictly newer PASS/error in both orders; existing lexical ordering across origins; and missing merged dates refusing wrapper-time borrowing. These directly check the EV-01 ordering boundary touched by the EV-03 fix.

### Fresh Independent Execution

Evidence directory: [ev03-frozen-2026-09-06T10-42-29.693Z](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/EV-01-03-task-judge/ev03-frozen-2026-09-06T10-42-29.693Z).

```powershell
node output/project-review-followup/EV-01-03-task-judge/run-ev03-frozen-rejudge.mjs
```

This serial runner executed the following, without name filters, skipped cases, altered assertions or increased deadlines:

```powershell
node --test --test-concurrency=1 output/project-review-followup/EV-01-03-task-judge/independent-probes.mjs
node --test --test-concurrency=1 output/project-review-followup/EV-01-03-task-judge/ev03-tie-guards.mjs
node node_modules/vitest/vitest.mjs run --config output/project-review-followup/EV-01-03-task-judge/ev03-rejudge.config.mjs --configLoader runner --maxWorkers=1 --reporter=dot
```

| Execution | Fresh Result | UTC Interval / Duration |
| --- | --- | --- |
| Unchanged independent probe file | 17 passed, 0 failed, 0 skipped; exit 0 | 10:42:30.065Z to 10:42:40.616Z; 10.50 seconds reported |
| Additional independent tie/provenance guards | 14 passed, 0 failed, 0 skipped; exit 0 | 10:42:40.616Z to 10:42:40.727Z; 65.21 ms reported |
| Whole focused contract | 212 passed in 5 files, 0 failed, 0 skipped; exit 0 | 10:42:40.727Z to 10:43:33.767Z; 52.74 seconds reported |

The five whole files are `scripts/lib/search-console-inspection-reports.test.mjs`, `scripts/lib/new-tool-growth-pilot-report.test.mjs`, `scripts/lib/indexing-classification.test.mjs`, `scripts/indexing-classification.test.mjs`, and `scripts/evidence-cli.test.mjs`. EV-02's four existing independent controls ran unchanged as part of the 17-case file; no new EV-02 acceptance decision is issued. Test totals are separate runs, not an enlarged full-suite count.

Exact commands, outcomes and unchanged-file proof: [verification.json](C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review/output/project-review-followup/EV-01-03-task-judge/ev03-frozen-2026-09-06T10-42-29.693Z/verification.json). Logs are `unchanged-independent-probes.log`, `independent-tie-guards.log`, and `whole-focused-contract.log` in that directory. The independent command records and `fixtures/weekly-block-empty/round-trip.json` / `fixtures/weekly-block-unknown/round-trip.json` retain actual consumer output. Fixtures use owned temporary roots and network-denying consumer preloads; all child processes exited. No browser/server was started.

Parent evidence was read and retained separately, not counted as this judge's execution: `R/output/project-review-followup/EV-03-roundtrip-red.log` has 18 failed / 124 passed; `EV-03-roundtrip-green.log` has 142 passed. Their hashes are recorded in this rejudge's baseline. No earlier failed log or fixture was overwritten. A byte-for-byte pre-addendum report copy is retained as `report-before-append.md` in the new evidence directory.

### Frozen Source Identity

Node is `v24.20.0`; Vitest is `4.1.10`. Independently loaded TypeScript APIs report **6.0.3 in both R and the real detached fixture** at `C:/Users/chamb/AppData/Local/Temp/aft-sec01-integration-FHwIkG/worktree`; both package wrappers report **6.0.2**. The runner asserts both identities. No dependency install, repair or shared configuration mutation was performed.

| Frozen File | Current SHA-256 |
| --- | --- |
| `scripts/lib/search-console-inspection-reports.mjs` | `aecc4a9c60dd4cace6a7ed40a615c464a26bc423a662fdccc138b5c72ff23346` |
| `scripts/seo-agent-self-evaluation.mjs` | `97e6c058807ef5a1f665cee55759398264c08f0a610e11170a24ad1403250da7` |
| `scripts/lib/search-console-inspection-reports.test.mjs` | `b1586cc7ff4a73d9f0ada3efbcad68c63aace30fe999a672b6d63fa07bf3ec65` |
| `scripts/indexing-classification.test.mjs` | `eb5dda6037f150c34780b66f5bce505ac6b0ca155acb1cded4c80645a9d59529` |
| Unchanged `independent-probes.mjs` | `b6716a1397760a77ee2122b947f6466c52f90fa3434fa7372eee5e6f62457cdc` |

All **211 watched source/test/package/policy/queue/guidance files remained unchanged during rejudgment**, with zero before/after drift. The other 207 match the previous judge snapshot; exactly the four parent-owned files above changed since that snapshot. Full hashes are retained in the new `source-hashes-before.json` and `source-hashes-after.json`. The unchanged original probe file was separately hashed before/after execution. Source policy, the historical 604-unit queue and smoke-Kawaii guidance still have empty scoped Git diffs. No Kawaii or transcriber work was touched.

The earlier 2,405-test integrated check predates these four changed files and is **not** represented as full-check proof of this correction. The parent is preparing integrated validation separately; current fixture source-byte parity and a new whole-project check were not asserted by this rejudge. No build, install, full check, live/provider/account call, SEO submission, paid action, production report overwrite, publishing or deployment occurred. No current-account or actual indexing state is certified. This closes EV-03's bounded local evidence-pipeline task only; parent metadata and release decisions remain parent-owned.
