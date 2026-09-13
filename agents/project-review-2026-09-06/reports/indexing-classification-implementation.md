# EV-03 Indexing Classification Implementation

Date: 2026-09-06, Australia/Brisbane. Status: implemented locally, independent Release Judge approval pending. This report does not change campaign/task states or authorize release.

Worktree: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`.
Branch: `codex/gpt6-review-implementation`.
HEAD: `243d71d1d832b398cba86d5c7fcc70deefa25f25`, plus the existing dirty implementation. Git diff against HEAD includes earlier agents' work and is not this specialist's patch alone.

## Scope And Source Review

Read repository AGENTS.md; campaign AGENTS.md and campaign.json; evidence AGENT.md, goal.md, tasks.md, reference.md and worklog.md; search-content-promotion.md SCP-06; Google Search Central notes; SEO workbench conventions; marketing/brand and DataForSEO operating notes. Used the existing TypeScript AST policy reader and EV-01 inspection merger/freshness helpers. No new market research was needed or performed.

Only these nine files were changed by this assignment, relative to the dirty starting worktree:

1. `scripts/lib/indexing-classification.mjs` (new): small shared decision helper using the executing worktree's `src/data/indexationPolicy.ts`, through the existing AST reader. No duplicated noindex route list, date-based activation, source-policy write, or provider logic.
2. `scripts/lib/agent-tools-report.mjs`: indexing selection, Link Helper/SEO Console actions, policy exclusions in CrawlScout/performance recovery reporting, and one policy filter on link recommendations from usage signals. The analytics reader/coverage calculation is unchanged.
3. `scripts/marketing-orchestrator-report.mjs`: indexing classification/filtering, excluded records, failure recommendation and indexing display only. Existing provider and promotion regions retained.
4. `scripts/aft-cli.mjs`: indexing classification, preservation of indexingState, intentional-exclusion output, failure advice and exclusion filtering for the performance recovery sample only. Existing EV-01 provenance and provider-status work retained.
5. `scripts/indexing-classification.test.mjs` (new): 46 actual-entry-point tests with temporary synthetic reports, fixed clock, blocked fetch, and guarded temporary-root cleanup.
6. `scripts/lib/indexing-classification.test.mjs` (new): 13 shared-policy tests, including direct parity with the unchanged TypeScript policy.
7. `scripts/lib/agent-tools-report.test.mjs`: two current-action fixtures now use a current observation date instead of July. Existing request-proof/missing-build assertions were not weakened.
8. `scripts/lib/search-console-inspection-reports.test.mjs`: adapted only the marketing function-extraction harness to the classified result and real classifier. Existing newest-observation/provenance assertions retained.
9. This separate implementation report.

No analytics files, source indexation policy, content, Kawaii assets/canonicals/links, campaign boards/manifests, package/lock files, shared evidence worklog, or memory files were edited by this specialist. No commit, install, build, full check, network/provider refresh, paid call, GSC request, publishing, outreach, or deployment was performed.

## Reproduction And Decision Contract

Confirmed SCP-06 at the dirty starting source: Link Helper used the literal coverage phrase "Submitted and indexed", while CLI/marketing omitted unexpected noindex and admitted unknown/discovered intentional exclusions. Link Helper/SEO Console also did not consume the EV-01 merger. Confidence: high, reproduced through executable entry points, not inferred from a stale production report.

The corrected first reproduction run at 15:19:04 used:

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner scripts/indexing-classification.test.mjs --reporter=dot
```

Exit 1: 22 failures, 6 passes. The preceding initial run had 26 failures; four were fixture-shape mistakes in weekly rows and were corrected before the authoritative reproduction. No implementation was present during either run.

Implemented contract:

- Source-policy `index: false` wins first, including TTS tool/guide, both feeds, support and HTML sitemap. Unknown, discovered, stale, future, missing-source and expired-date observations cannot activate these routes.
- Trimmed, case-insensitive exact PASS is non-recovery regardless of coverage wording, including indexed alternatives, empty coverage and undated records. This is a classification of the saved verdict, not a claim of fresh live indexing.
- Unexpected noindex or blocked meta/header indexingState on an indexable route is a failure. Fresh failures require page-level robots/fetch/canonical review, not link additions or another indexing request.
- Real non-indexed states remain recovery candidates; unavailable evidence requires refresh; historical evidence is not promoted to a current page-edit/submission task.
- All four consumers use the same classifier after EV-01 newest-per-URL selection. Raw/summary partial sets and original observation dates/paths remain intact.
- SEO Console suppresses saved marketing recovery tasks targeting known non-recovery URLs. Policy exclusion also applies to CrawlScout/performance inputs and usage-driven link targets.

Current implementation references: classifier `scripts/lib/indexing-classification.mjs:19`; agent selection `scripts/lib/agent-tools-report.mjs:820`; Link Helper `:1317`; SEO Console `:1508`; saved marketing-action guard `:1549`; marketing classification `scripts/marketing-orchestrator-report.mjs:173`; fresh-failure branch `:341`; CLI selection `scripts/aft-cli.mjs:313`; performance recovery sample `:491`.

## Focused Test Evidence

The first fix passed 52 actual-entry-point and EV-01 CLI tests. Expansion then reproduced two failures: discarded CLI indexingState and a saved marketing action reviving excluded/PASS recovery. Another focused test reproduced policy-excluded performance recovery rows leaking into CLI output. All were fixed after reproduction.

The broader EV-01 suite exposed five failures from its function-extraction harness after the marketing function rename; the harness was updated to the new function contract without changing provenance assertions. The legacy report suite exposed two July-dated fixtures expecting current actions; only those observation dates were corrected.

Final broad focused run, 15:31:00 Brisbane, exit 0, **220 passed in 9 files**, 15.96 seconds:

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner scripts/indexing-classification.test.mjs scripts/lib/indexing-classification.test.mjs scripts/evidence-cli.test.mjs scripts/lib/search-console-inspection-reports.test.mjs scripts/lib/new-tool-growth-pilot-report.test.mjs scripts/lib/indexation-policy-source.test.mjs src/data/indexationPolicy.test.ts scripts/lib/marketing-orchestrator-recommendation.test.mjs scripts/provider-status.test.mjs --reporter=dot | Tee-Object -FilePath output/project-review-followup/EV-03/focused-tests.txt
```

Legacy focused run, 15:29:43 Brisbane, exit 0, **9 passed, 18 intentionally skipped**, 0.627 seconds:

```powershell
node node_modules/vitest/vitest.mjs run --configLoader runner scripts/lib/agent-tools-report.test.mjs --testNamePattern="SEO recovery|SEO console completions|request-indexing|mirrored dist|zero internal links|built-link snapshot|CrawlScout rows" --reporter=dot | Tee-Object -FilePath output/project-review-followup/EV-03/legacy-focused-tests.txt
```

Six separate syntax checks passed, exit 0:

```powershell
node --check scripts/lib/indexing-classification.mjs
node --check scripts/lib/agent-tools-report.mjs
node --check scripts/aft-cli.mjs
node --check scripts/marketing-orchestrator-report.mjs
node --check scripts/indexing-classification.test.mjs
node --check scripts/lib/indexing-classification.test.mjs
git diff --check -- scripts/lib/agent-tools-report.mjs scripts/lib/agent-tools-report.test.mjs scripts/lib/search-console-inspection-reports.test.mjs scripts/aft-cli.mjs scripts/marketing-orchestrator-report.mjs
```

Whitespace check passed; Git emitted only its existing LF-to-CRLF notices. Focused test success is not full integration or deployment approval.

## Local Report And Workbench Evidence

All commands below ran locally, exited 0, and wrote only ignored generated evidence. Relevant reports were regenerated after tests restored their fixtures.

```powershell
node scripts/aft-cli.mjs indexing-gaps | Tee-Object -FilePath output/project-review-followup/EV-03/indexing-gaps.txt
node scripts/aft-cli.mjs indexing-gaps --json | Tee-Object -FilePath output/project-review-followup/EV-03/indexing-gaps.json
node scripts/aft-cli.mjs link-helper | Tee-Object -FilePath output/project-review-followup/EV-03/link-helper.txt
node scripts/marketing-orchestrator-report.mjs | Tee-Object -FilePath output/project-review-followup/EV-03/marketing.txt
node scripts/aft-cli.mjs seo-console | Tee-Object -FilePath output/project-review-followup/EV-03/seo-console.txt
node scripts/indexing-protection-audit.mjs --output-dir=output/project-review-followup/EV-03/indexing-protection | Tee-Object -FilePath output/project-review-followup/EV-03/indexing-protection.txt
node scripts/aft-cli.mjs site-sitemap | Tee-Object -FilePath output/project-review-followup/EV-03/site-sitemap.txt
node scripts/aft-cli.mjs seo-tool-queue | Tee-Object -FilePath output/project-review-followup/EV-03/seo-tool-queue.txt
node scripts/seo-agent-workbench.mjs plan text-to-speech-audiobook-generator tool | Tee-Object -FilePath output/project-review-followup/EV-03/workbench-plan.txt
node scripts/seo-agent-workbench.mjs micro-plan text-to-speech-audiobook-generator tool | Tee-Object -FilePath output/project-review-followup/EV-03/workbench-micro-plan.txt
node scripts/seo-agent-workbench.mjs judge text-to-speech-audiobook-generator tool | Tee-Object -FilePath output/project-review-followup/EV-03/workbench-judge.txt
```

Outcomes:

- Exact inspection classification: 124 saved gaps, 3 fresh and 121 stale; 2 intentional exclusions in the available observations (`/feed.xml`, `/sitemap/`). Latest actual observation remains `2026-09-02T00:52:56.028Z`, not this execution time. The synthetic tests cover the other policy routes; do not infer their live Google state from absent local rows.
- Link Helper: `not enough data`; 659 sitemap URLs; 10 suggestions, with old inspection states requiring refresh. Missing CrawlScout and production analytics evidence remains disclosed. Output: `output/agent-tools/link-helper/latest.json` and `.md`.
- SEO Console: `attention`, not a release verdict. Historical inspection actions remain monitor/refresh; independent existing marketing recommendations and missing-source warnings remain. Output: `output/agent-tools/seo-console/latest.json` and `.md`.
- Marketing: JSON/Markdown generated, policy exclusions separate from gaps; existing provider read remains cached/current-check-not-run. Output: `output/marketing-orchestrator/daily-plan.json` and `.md`. No provider or promotion actions performed.
- Existing-build indexing protection: 673 HTML pages, 0 high issues, 0 warnings. Its unchanged standalone raw Search Console counter still says 126; this includes the two policy-excluded observations and is not the shared consumers' recovery count. That script is outside this assignment's edit scope.
- Existing sitemap: 659 URLs, 304 tools, 311 blogs, 13 categories; HTML sitemap absent from XML, XML index present. No rebuild was performed, so this is evidence about the existing dist only.
- Current historical queue report: 303 tools, 606 approved page units, 0 remaining. This is the live local queue result, not the older 604-unit documentation total. This assignment did not add, reopen or approve any unit; the queue file's starting SHA-256 is unchanged.
- Workbench plan and micro-plan: ready. Final judge: **blocked, six gaps** (source evidence, paid keyword evidence, competitor evidence, page score, tone, browser proof). No gate was lowered and no paid/production proof was pursued. Output: `output/seo-agents/text-to-speech-audiobook-generator/tool/{plan,micro-agent-plan,final-judge}.{json,md}`. These page-level gates are distinct from reviewing this report-policy patch.

Actual saved-report parity assertions passed, output `output/project-review-followup/EV-03/consumer-parity.json`:

```powershell
node --input-type=module -e "import fs from 'node:fs';import assert from 'node:assert/strict';const read=p=>JSON.parse(fs.readFileSync(p,'utf8'));const cli=read('output/project-review-followup/EV-03/indexing-gaps.json');const link=read('output/agent-tools/link-helper/latest.json');const seo=read('output/agent-tools/seo-console/latest.json');const marketing=read('output/marketing-orchestrator/daily-plan.json');const urls=rows=>rows.map(r=>r.url);assert.equal(cli.count,link.sources.searchConsole.gaps.length);assert.deepEqual(urls(seo.indexing.gaps),urls(link.sources.searchConsole.gaps));assert.deepEqual(urls(cli.gaps),urls(seo.indexing.gaps).slice(0,20));assert.deepEqual(urls(marketing.indexingGaps),urls(seo.indexing.gaps).slice(0,10));assert.deepEqual(urls(cli.excluded),urls(marketing.indexingExcluded));assert.deepEqual(urls(cli.excluded),urls(seo.indexing.excluded));console.log(JSON.stringify({status:'pass',savedGaps:cli.count,recordFreshness:cli.inspectionEvidence.recordFreshness,excluded:urls(cli.excluded),latestObservation:cli.inspectionEvidence.generatedAt,linkHelperStatus:link.status,seoConsoleStatus:seo.status,firstMarketingRecommendation:marketing.recommendations[0]?.title},null,2));" | Tee-Object -FilePath output/project-review-followup/EV-03/consumer-parity.json
```

## Preservation And Remaining Gates

Report hygiene was inspected using the installed remove-ai-marks skill's local loopback service. `curl.exe -sf --max-time 3 http://127.0.0.1:8765/health` passed. The following read-only inspection returned `suspicious: false`, zero findings and no Layer A hits; no cleanup or sibling file was needed. No external service received the report.

```powershell
Invoke-RestMethod -Uri http://127.0.0.1:8765/inspect -Method Post -ContentType application/json -Body (@{file=[Convert]::ToBase64String([IO.File]::ReadAllBytes((Resolve-Path agents/project-review-2026-09-06/reports/indexing-classification-implementation.md)));name='indexing-classification-implementation.md'} | ConvertTo-Json -Compress) | ConvertTo-Json -Depth 12 | Tee-Object -FilePath output/project-review-followup/EV-03/report-hygiene.json
```

Starting and final SHA-256 checks matched for `src/data/indexationPolicy.ts`, its tests, `docs/seo-tool-review-queue.md`, `scripts/lib/search-console-inspection-reports.mjs`, `scripts/lib/new-tool-growth-pilot-report.mjs`, `scripts/lib/provider-status.mjs`, `package.json`, and `package-lock.json`. Policy hash: `569A0231D32776D8B58F0591FFF543C9D26831C0B1DC44740E6A5C2ED99AE1F3`. Queue hash: `20E283174892C1AD2AE1B5098CDAC9FDDF07933B5A1C6FB25A457141C034E1D2`. EV-01 merger hash: `3C1846825D1CB9FC28DA4AB45942EA3E353A92EC933831C83F6266529D6504B0`.

Acceptance evidence now covers PASS variants, every explicit excluded route, unexpected noindex/blocked meta indexingState, expiration non-activation, four-consumer parity, old/new verdict transitions, partial sets, original provenance, missing/future observations, persisted marketing recommendations, performance/CrawlScout exclusions, existing request proof and saved-link reuse. Source-level TTS launch policy, Kawaii and historical review approvals remain unchanged.

Next owner: coordinator and independent Release Judge. Review the scoped dirty-worktree changes, reconcile this separate report into campaign evidence, and run the permitted integration/release checks when the shared source is ready. Full npm test/check/build, deployment/browser verification, fresh GSC observations, live indexability, paid evidence, and TTS production beta gates remain deliberately unperformed here. No live indexing improvement, public release, completed promotion, or pilot readiness is claimed. All specialist command sessions have exited. No shared worklog or board write was made.

## Integration Freeze

Source/test write set frozen at `2026-09-06T05:37:30Z` (15:37:30 Brisbane). No source/test edits by this specialist since the final focused run. This section is the only handoff update; EV-04 coverage consumers remain outside this assignment. No further writes are planned.

Saved results re-read at freeze: broad focused suite **220 passed, 9 files, exit 0, 15.96 seconds** at 15:31:00; legacy selection **9 passed, 18 intentionally skipped, exit 0, 0.627 seconds** at 15:29:43. Six syntax checks and scoped whitespace checks passed. Four-consumer saved-report parity passed. Commands and proof paths are above; integration and independent approval remain the coordinator's gates.

Frozen SHA-256 write set, relative to the worktree root:

| File | SHA-256 |
| --- | --- |
| scripts/lib/indexing-classification.mjs | 74DD14D28A53DFFBA97602FDD1346734B129103D2E0B26F5AD80405938315383 |
| scripts/lib/agent-tools-report.mjs | D7AA88330C21C75D64993F0AAB0E56460364B0BC5E6FF07F653D65A37BC8963B |
| scripts/marketing-orchestrator-report.mjs | 0076F4516B269AAB6948D3D44EB8E3B42AE340D84A50C41331D4FE72CCA61D73 |
| scripts/aft-cli.mjs | F3F7FA8F1B8C59DB16ECE87A9DE4092A153CFDFA94840315B2D892EDABB9E3F9 |
| scripts/indexing-classification.test.mjs | 1B2C8A4CD72239B8355D15E51F7EC0EA72C0B8F37A9CD2415D368D266B2EDC5A |
| scripts/lib/indexing-classification.test.mjs | 115A58D48F1CAA67F0AA2F9D59CC9E687AEE4405252E5FA522041F6458C15E1F |
| scripts/lib/agent-tools-report.test.mjs | 40D3E07A09C8A7CFEDAD00849DAAEBD8E9D952CC70427A9A34089BA673EB36EC |
| scripts/lib/search-console-inspection-reports.test.mjs | D713230D0525E246C818B43AA1992F2C11CBD999743F7E962595A94B205B5177 |
