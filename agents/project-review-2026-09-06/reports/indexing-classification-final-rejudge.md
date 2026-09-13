# EV-03 Final Independent Rejudge

Date: 2026-09-06, Australia/Brisbane.
Worktree: `C:\Users\chamb\OneDrive\Desktop\accessfreetools-gpt6-review`.
Branch / HEAD: `codex/gpt6-review-implementation` / `243d71d1d832b398cba86d5c7fcc70deefa25f25`, plus preserved shared dirty implementation.
Reviewed freeze: the 16:04 Brisbane final section of `agents/project-review-2026-09-06/reports/indexing-classification-judge.md`.

## Decision

**Recommend `evidence_ready` for the bounded local EV-03 implementation. No new blocking finding in this rejudge.** J-EV03-01, J-EV03-02 and J-EV03-03 pass the independent focused checks below. All eight frozen source/test hashes matched before execution. This reviewer made no changes to those fixes or their tests.

Both test commands exited successfully before the coordinator was notified that the integrated full check could start. After that notification, work was limited to source/evidence reads and this new report. No broad suite, full check, build or browser was run by this rejudge.

This recommendation is not campaign approval, page/pilot release permission, production indexing proof, or an analytics-continuity claim. The coordinator owns the integrated full-check result and final acceptance.

## Findings Rechecked

### J-EV03-01: Relative recommendation routes / Closed Locally

Source: `scripts/lib/agent-tools-report.mjs:1565` through the saved marketing-action filter; same-origin route normalization at `:1203`.

The filter considers structured `url`, `target` and `path`, plus absolute and relative references in title/action/reason text. It applies the source-policy exclusion and selected non-recovery route checks before emitting a saved indexing recommendation. The independent judge's original two relative titles produce no saved recovery actions even with an unrelated real gap present.

Three selected actual SEO Console tests additionally exercise relative routes in `title`, `reason` and `path`, including title query/hash variants. Each preserves the unrelated real recovery task while removing intentional TTS noindex and current Kawaii PASS recovery. This is local recommendation correctness, not evidence of a public indexing action.

Confidence: high for the supported relative/absolute recommendation forms exercised. The patch does not add a general natural-language route parser; this review does not require one.

### J-EV03-02: PASS/recovery chronology and CTR independence / Closed Locally

Sources: `scripts/lib/indexing-classification.mjs:24`, `scripts/aft-cli.mjs:493`, `scripts/lib/agent-tools-report.mjs:1057` and its separate Tier A/CTR branches.

The original July-recovery/September-PASS reproduction now yields no indexing recovery in either CLI or SEO Console. Two selected actual-entry-point tests independently verify that the newer PASS's original source path/date are preserved, its older recovery is superseded, and the same route's CTR opportunity remains present.

The executed pure-helper cases verify strictly newer versus equal timestamps, explicitly undated recovery rows without borrowing wrapper dates, and the conservative end-of-Brisbane-data-day boundary. Source review confirms the helper uses the selected exact-route PASS, requires a usable original source path, rejects errors, and requires caller-computed fresh evidence. Inspection selection still merges by original per-record observation date rather than the latest report wrapper. The existing tests for older/stale/future/missing-source/errored PASS and newer selected failures were read, but were not all rerun in this deliberately filtered rejudge.

The new PASS rule is applied only to Tier A indexing recovery. CLI CTR filtering continues to remove intentional exclusions only; SEO Console retains its pre-existing policy/completion gates for CTR, without invoking the new PASS chronology filter. A successful inspection is not blanket evidence that CTR work is complete.

Confidence: high for the reproduced chronology and independent CTR cases; the wider unchanged EV-01 regression set remains the implementer's prior evidence plus the coordinator's integration gate, not a fresh full-suite claim by this reviewer.

### J-EV03-03: Explicit blocked state with empty coverage / Closed Locally

Sources: `scripts/lib/indexing-classification.mjs:20` and `:43`; selector regions `scripts/aft-cli.mjs:313`, `scripts/lib/agent-tools-report.mjs:837`, `scripts/marketing-orchestrator-report.mjs:173`.

The original fresh, source-backed, error-free `BLOCKED_BY_META_TAG`/empty-coverage record is independently classified as `failure` and `observed` by CLI, Link Helper, SEO Console and marketing, retaining the original source/date and block code. The four-consumer control case also preserves an explicit HTTP-header failure with neutral coverage text.

Executed pure-helper cases cover both supported block codes with empty coverage, error/unavailable precedence, PASS precedence and intentional policy exclusion. Source review confirms each selector still requires a usable source path and no error, and still derives observed/historical/not-enough-data from original freshness. Consumer recommendation branches handle non-observed evidence before current failure repair recommendations. This avoids treating a known historical block as current repair authorization.

Confidence: high for the reproduced supported record shapes and retained gating. No claim is made about whether a current production export actually omits coverage prose.

## Safeguards

- PASS case/whitespace and coverage variants remain non-recovery. The independent four-consumer control includes empty coverage; pure-helper tests also cover inconsistent coverage and unavailable-status wording without reviving recovery.
- All six current source-policy noindex routes remain excluded: the TTS tool/guide, RSS/Pinterest feeds, support and HTML sitemap. The helper reads explicit source policy, not expiration fields. Executed controls include expired dates and discovered states; no source policy was changed.
- Unexpected noindex on indexable routes still fails. Error or missing usable evidence is not current repair authorization; original observation/source provenance remains visible.
- Kawaii's current PASS does not revive indexing recovery, while its unrelated CTR opportunity survives. No Kawaii content/artwork or 604-unit historical review-queue mutation occurred.
- The earlier tool-brief call-site fix remains `searchConsoleGaps(createIndexingClassifier())` at `scripts/lib/agent-tools-report.mjs:2222`. It was source-read, not rerun as a broad suite. Coordinator analytics coverage code in that shared file was preserved, not reopened for review.
- Existing workbench evidence remains the earlier specialist's `node scripts/seo-agent-workbench.mjs judge text-to-speech-audiobook-generator tool`. It was not rerun and grants no approval of this patch or pilot release.

## Exact Executed Evidence

All commands used the worktree stated above and installed local dependencies. No execution occurred before the owner's freeze signal.

```powershell
Get-FileHash -Algorithm SHA256 scripts/lib/indexing-classification.mjs,scripts/lib/indexing-classification.test.mjs,scripts/indexing-classification.test.mjs,scripts/lib/agent-tools-report.mjs,scripts/lib/agent-tools-report.test.mjs,scripts/aft-cli.mjs,scripts/marketing-orchestrator-report.mjs,scripts/lib/search-console-inspection-reports.test.mjs | Select-Object Path,Hash | ConvertTo-Json
```

Exit 0. All eight values exactly match the 16:04 freeze, case-insensitive hex comparison:

| File | SHA256 |
| --- | --- |
| `scripts/lib/indexing-classification.mjs` | `f2cbfc9a1dd36647e598b79b8edae8fab6de6e8c3f65bc86b030c612854c5cc7` |
| `scripts/lib/indexing-classification.test.mjs` | `b846f52353ab4e754f4eaa1e0b75fc466b347958ad0adb0a471591e9e1f18754` |
| `scripts/indexing-classification.test.mjs` | `e9067fd697a00f719f09194674258289662c7955b77f8ef7e73765a20217953c` |
| `scripts/lib/agent-tools-report.mjs` | `01f2ddad64ba8fc57d37b0165422dd79a9f459b476aeb97b386424cd2f685a1f` |
| `scripts/lib/agent-tools-report.test.mjs` | `f36b4f5bdf86aa4dce8a24490630666bf357030928dac726eff0b4b782911dd9` |
| `scripts/aft-cli.mjs` | `1ab42a6e8c4b130cacae28928dbbbdf121caf92a81fdc96fa5b18ce69ffd37e7` |
| `scripts/marketing-orchestrator-report.mjs` | `d764bc6f5c53466cd0a67fd15bad3559faecb89fd5bc97cfdeb41fc6eb7c75b2` |
| `scripts/lib/search-console-inspection-reports.test.mjs` | `87157430545e188dc1b3f23d87756d58e7ffa9f3b11f1027a72a28ca3b35ba76` |

```powershell
node --test --test-name-pattern='PASS, every intentional|a known meta/header|relative saved marketing|older performance' agents/project-review-2026-09-06/reports/indexing-classification-judge.test.mjs
```

**4 passed / 0 failed**, exit 0, **3344.8096 ms**. Only the four named independent local cases executed. The broad case whose historical title refers to all 27 agent-tools tests was deliberately excluded, so no full-file child suite, source copy or dependency junction was launched here. Node reports four selected tests, not the implementer's earlier five-case whole-judge result.

The selected judge writes four ignored synthetic evidence files under `output/project-review-followup/EV-03-judge/`: `four-consumer-controls.json`, `missing-coverage-block.json`, `relative-marketing-actions.json`, `older-performance-pass.json`. The last shows empty CLI/console recovery arrays after the newer PASS. The block file records `failure`/`observed` across all four consumers with original synthetic provenance. Temporary fixture source paths in those files refer to disposable fixtures, not real Google observations.

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner scripts/lib/indexing-classification.test.mjs scripts/indexing-classification.test.mjs --testNamePattern='indexing policy classification|newer exact PASS versus recovery chronology|suppresses older recovery after newer PASS while preserving CTR work and original proof|checks relative saved marketing routes' --maxWorkers=1 --reporter=dot
```

**23 passed / 92 skipped by explicit name filter**, 2 files, exit 0. Start **16:08:32 Brisbane**, duration **2.16 s**. This executes the 18 pure policy/chronology cases and five targeted actual-entry-point cases: three relative saved-route cases and two CLI/console chronology-plus-CTR cases. No assertion was changed and no timeout increased. The skipped cases are outside this bounded run, not evidence of 115 executed passes.

Both commands use frozen synthetic time and network-denying child preloads. Entry points read/write disposable OS-temp fixture roots; cleanup validates the absolute temp-root boundary. No real analytics, production/provider endpoint or GSC request was used. All child test processes exited before the coordinator's start-full-check notification.

The implementer's separately reported 254 focused passes and whole-judge 5 passes with a 28-test child were inspected in the freeze report, not independently rerun or added to this review's test totals.

## Scope And Handoff

Inspected the eight frozen paths, the unchanged judge harness, the exact source-policy reader/data and EV-01 merge/freshness helpers, relevant EV-03 consumer regions, and the regenerated synthetic proof JSON. The review followed the existing campaign evidence task, SCP-06 and Search Central/workbench conventions without triggering a research or approval workflow.

Authored only this new file: `agents/project-review-2026-09-06/reports/indexing-classification-final-rejudge.md`. The previous implementation and judge reports, every source/test, coordinator analytics integration, EV-04 fix freeze, source indexation policy, campaign manifests/task boards/worklogs, package/lock and historical queue were not edited. Standard ignored judge output was regenerated by the authorized focused command only.

Remaining gates: coordinator integrated full check and final release judgment. No broad suite, browser, full check, build, install, spend, commit, deployment, public action or production refresh was performed here. No runtime counterexample remains open for the three scoped EV-03 fixes in the independent cases executed. This recommendation is limited to the frozen local implementation and does not assert current Google indexing or authorize release.
