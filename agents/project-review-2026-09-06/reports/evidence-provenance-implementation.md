# EV-01 Evidence Provenance Implementation

Date: 2026-09-06, Australia/Brisbane. Scoped implementation and focused test evidence are ready for review; this is not Release Judge approval, current indexing proof, or permission to activate/release a pilot. No campaign/task/worklog state was changed by this specialist.

## Source And Ownership

- Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review` (R below).
- Branch: `codex/gpt6-review-implementation`.
- HEAD, verified before and after implementation: `243d71d1d832b398cba86d5c7fcc70deefa25f25`. Changes below are uncommitted; HEAD alone does not identify them.
- Existing and concurrent changes to campaign files, packages, product code, promotion code and other agents' reports were preserved. No commits, reverts, installs, global settings, public actions, paid API calls, credential-dependent commands, full builds or full checks were performed.
- Confirmed actual consumer filenames: `scripts/marketing-orchestrator-report.mjs` and `scripts/seo-agent-self-evaluation.mjs`. The shorthand filenames in the request do not exist. Only their inspection-selection/summary functions and required imports were edited.

Edited paths (all relative to R):

1. `scripts/lib/search-console-inspection-reports.mjs`
2. `scripts/lib/search-console-inspection-reports.test.mjs`
3. `scripts/merge-search-console-inspection-reports.mjs`
4. `scripts/lib/new-tool-growth-pilot-report.mjs`
5. `scripts/lib/new-tool-growth-pilot-report.test.mjs`
6. `scripts/marketing-orchestrator-report.mjs`
7. `scripts/seo-agent-self-evaluation.mjs`
8. This report, `agents/project-review-2026-09-06/reports/evidence-provenance-implementation.md`.

## Confirmed Fixes

| Finding | Implementation And Evidence | Confidence / Consequence |
| --- | --- | --- |
| SCP-05: wrappers changed observation origin and aggregate age | `R/scripts/lib/search-console-inspection-reports.mjs:83` preserves explicit per-item source dates/paths, including explicitly invalid/missing values. Only raw runs can supply absent provenance. Merged containers cannot supply missing origins. `:129` derives latestSourceGeneratedAt from selected observations, not container dates. | High, red/green nested merge and disk round-trip fixtures. Repackaging July observations in September cannot claim September inspection evidence. |
| SCP-04: summary-first selection overrode newer per-URL truth | `R/scripts/marketing-orchestrator-report.mjs:170` adapts weekly rows into the shared merger and combines them with raw inspections. `R/scripts/seo-agent-self-evaluation.mjs:107` also uses the shared merger and retains original date/path, errors and age labels. Raw fallback paths are absolute before a summary can move worktrees. | High, tests execute the actual pure functions. Both old unknown/new PASS and old PASS/new failure choose the newer actual observation; partial URL sets survive. Legacy summaries without original dates stay unavailable. |
| SCP-05 / BP-11: pilot ranked wrappers and accepted prelaunch/old evidence | `R/scripts/lib/new-tool-growth-pilot-report.mjs:37` reuses the shared merger. `:84` validates selected sourceGeneratedAt against launch, decision time and the seven-day limit. Missing, malformed, future, prelaunch, stale and failed inspection evidence cannot satisfy discovery/indexing counts. `:224` renders original source date/path and evidence status. | High, dated synthetic readiness fixtures and Markdown assertions. A newer failed/future observation cannot silently fall back to an older PASS to satisfy the pilot gate. |
| Partial refresh deleted canonical-only URLs | `R/scripts/merge-search-console-inspection-reports.mjs:23` includes existing output in the shared merge, even when it is outside the input root. | High, actual CLI subprocess tests with isolated temporary worktree-shaped directories. Repeated partial merges retain older untouched URLs without resetting origin or source age. |

The shared freshness implementation is at `R/scripts/lib/search-console-inspection-reports.mjs:15`. Seven days follows the existing CLI freshness window observed in this checkout; the limit is inclusive. Prelaunch/future dates fail independently of age. The same date check now bounds sitemap and CrawlScout decision evidence, and prevents out-of-window analytics being presented as current usage. Historical checkpoint dates and the existing fourteen-day wait, one-discovered-page threshold, sitemap failure checks and CrawlScout count baseline remain unchanged.

`generatedAt` and `sources` on a merged report remain container metadata, deliberately separate from `sourceGeneratedAt`/`sourcePath` on each URL and `latestSourceGeneratedAt`. Existing origin paths are not rewritten. Equal observation times prefer a known original path over an incomplete wrapper; different known paths are selected in stable lexical order. No verdict preference replaces chronological selection.

## Executed Verification

All commands ran in R unless a test explicitly used its own temporary directory. Runtime: Node `v24.20.0`, installed Vitest `4.1.10`. No dependencies were installed or edited.

Focused command A:

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner scripts/lib/search-console-inspection-reports.test.mjs scripts/lib/new-tool-growth-pilot-report.test.mjs --reporter=dot
```

- Initial RED: 23 failed, 7 passed. These reproduced overwritten origins, wrapper-derived aggregate age, reversed pilot winners, summary precedence and invalid date gates.
- First GREEN after implementation: 30 passed.
- Additional RED after adding canonical-retention and equal-date incomplete-origin regressions: 2 failed, 33 passed.

Focused command B:

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner scripts/lib/search-console-inspection-reports.test.mjs scripts/lib/new-tool-growth-pilot-report.test.mjs scripts/lib/marketing-orchestrator-recommendation.test.mjs --reporter=dot
```

- GREEN after CLI/origin fixes: 42 passed in 3 files.
- Expanded separate-input-root and analyzer coverage: 43 passed in 3 files.
- Raw-origin absolute-path RED, using command A's inspection test file alone: 2 failed, 16 passed.
- Final GREEN after absolute-path fixes: **44 passed in 3 files**, exit 0, 665 ms reported duration. No skipped/disabled tests.

The inspection tests parse the actual marketing/weekly function declarations with installed TypeScript and execute only those pure functions in a VM with the real shared merger. They never import/run either CLI's top-level provider/account/report actions. Merger CLI subprocesses run only against synthetic temporary JSON, exercising repeated merges with same-root and separate-root inputs. Temp fixtures contain no production, account or personal data.

Additional checks: `node --check` on all five changed executable modules passed; focused `git diff --check` passed with only Git's LF-to-CRLF normalization warnings. Read-only investigation used `rg --files`, targeted `rg -n`, `Get-Content`, structured campaign JSON parsing, `git status --short`, `git diff`, `git rev-parse HEAD`, `git branch --show-current`, and `node --version`. Initial guessed tasks-directory and wildcard path searches failed; actual campaign.json task EV-01 and inventoried filenames supplied the source of truth.

## Missing Acceptance And Boundaries

- **Marketing/weekly Markdown provenance remains missing.** Their JSON rows now retain source dates/paths and freshness, and pilot Markdown shows them. The marketing and weekly Markdown renderers are outside the assigned inspection-function ownership; they still omit these fields. Minimal follow-up: their owner adds date/path/freshness to rendered inspection evidence, retains an unavailable/historical distinction in recommendation wording, and verifies both JSON and Markdown using dated fixtures. Existing recommendation wording can still describe historical gaps as current; no whole-orchestrator approval is claimed.
- **Broader BP-11 evidence validity is not complete.** CrawlScout's unchanged aggregate-count gate does not prove unchanged URL membership, and this patch does not validate comparable measurement windows, verified production targets/owner exclusion, or the game pilot. Do not describe the result as proof that no new URLs became affected or as full pilot-release readiness. The designated follow-up owner must supply those contracts and fixtures.
- **No live evidence was refreshed.** Current GSC verdicts, cross-worktree production report inventories, actual sitemap health and production usage remain unverified. Tests use synthetic worktree-shaped inputs, not real report copies. Reports already stripped of original provenance cannot have it reconstructed from wrapper timestamps; raw originals or a fresh authorized inspection are needed.
- **Coordinator/full report integration remains unperformed.** The campaign's full `npm test`, `npm run aft -- indexing-gaps` and `npm run marketing:orchestrate` evidence sequence was not executed under this specialist's focused-test/no-credential-command limits. No full build/check or credential-dependent self-evaluation command was run. Existing unrelated consumer logic, indexation protection (EV-03), report rendering and broader workflows require their owning agents' checks.
- **Release Judge gate remains open.** Passing these tests is local implementation evidence, not a page SEO approval, a publishing decision or a live indexing claim. For a later exact-page SEO review, reference `node scripts/seo-agent-workbench.mjs all json-to-csv-converter tool` and the separate `blog` invocation; neither was run here. The workbench's specialist/evaluator/micro-agent/final-judge process and owner approval remain required.
- No public text/media was prepared or modified. The provenance-hygiene skill was inspected; no private engineering source/report was sent to its service, and no provenance marks or required disclosures were removed. This task preserves evidence provenance.

Read before implementation: root/campaign AGENTS, campaign task EV-01, `reports/search-content-promotion.md`, the relevant BP-11 and evidence sections of `reports/browser-products.md`, the installed TDD skill, `docs/new-tool-growth-pilot.md`, and `docs/marketing-orchestrator.md`. Source inspection also covered package test scripts, the pilot evidence collector, inspection producer references, the marketing recommendation helper and existing freshness-window references. No global campaign/worklog or memory updates were made.
