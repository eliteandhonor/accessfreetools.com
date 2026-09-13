# Search, Content, Promotion, And Evidence Review

Reviewed: 2026-09-06, Australia/Brisbane. Specialist scope only; not an entire-project approval.

Source: `C:/Users/chamb/OneDrive/Desktop/accessfreetools-gpt6-review`, HEAD `90d6dcab0580a91ca66382f2414d95e8817469e5`, branch `codex/gpt6-project-review-sep6`. The supplied fresh origin/main baseline matches this HEAD. Initial tracked diff was empty; the campaign directory was untracked. Only this assigned report was written by this specialist. No application fixes, commits, deployments, publication, indexing submissions, paid API calls, dependency installation, global configuration changes, or spawned agents.

## Findings

All tasks below are **planned**, not implemented or approved. Confidence describes the source defect, not whether a harmful public action has occurred. Owners are proposed assignments for the coordinator, not agents created by this review.

### SCP-01 [P1] Inactive-channel policy is bypassed by public CLI entry points

- Evidence: `package.json:77` exposes `promotion:devto:publish` with both `--publish` and `--confirm-public-post` already supplied. `scripts/devto-promotion-agent.mjs:264` checks only those flags; `:296` calls the publisher, which POSTs a published article at `:239`. No central channel-policy check intervenes. `scripts/lib/promotion-channel-policy.mjs:66` defines DEV as inactive.
- Related active surface: `scripts/aft-cli.mjs:239` hardcodes Medium, Reddit, Bluesky, Quora, and DEV quality outputs. `:1018` builds promotion candidates directly from the unfiltered queue and `:1022` includes `needs approval`; its displayed gate at `:1035` does not retain that approval distinction. No import of the channel policy exists in this CLI. The coordinator observed inactive-channel quality output using current main source.
- Trigger/scope: an old scheduled/manual DEV publish command with valid credentials, or CLI status/promote-next against a queue containing inactive-channel rows. This is not a claim that DEV credentials work or that publication happened.
- Confidence/impact: high. The default npm command bypasses the owner's explicit reactivation boundary, while the front-door CLI continues surfacing prohibited channel work. DEV's `verified-live` also depends only on HTTP success at `:253`, not visible content; keep that retired path disabled rather than repairing public publishing during this campaign.
- Minimal task/owner: **Promotion Policy Agent**, evaluated by **Automation Governance Architect**. Apply the existing policy at every public-action boundary before credentials/network use; derive CLI quality/candidate/proof-follow-up channels from the same policy. Keep approval-needed candidates distinctly draft-only.
- Acceptance: inactive/unknown channels cause zero credential reads and zero network writes even with both publish flags; status/promote-next omit their active-work outputs; site blog, Medium, Bluesky, and Pinterest retain their appropriate gates; `needs approval` never appears as executable permission. Use mocked network tests, not public test posts.

### SCP-02 [P2] A saved DataForSEO balance is labeled live without a live check

- Evidence: `scripts/aft-cli.mjs:249` loads a JSON file; `:253` names its `account` value `liveAccount`; `:260` declares it `live` solely because that field exists. `:958` prints that status. The function checks neither age nor the current environment-check result. `scripts/marketing-orchestrator-report.mjs:191` also falls back to a saved SEO account without carrying its timestamp/status into the balance, and `:536` can issue an unlabeled top-up blocker from it.
- Trigger/scope: the newest account-shaped JSON is several days old while an independent environment check reports an IP restriction. Earlier in this review, the coordinator observed `live 11.02 USD from 2026-09-02T03:43:31.463Z` despite the IP not being whitelisted. An isolated current-source fixture reproduced `status: live` and empty `liveError` from that saved report. The owner subsequently fixed the whitelist and the coordinator obtained a fresh Sep 6 account result of US$10.92; the connection is restored, but this source defect remains.
- Confidence/impact: high. A research agent can mistake cached funds/connectivity for permission/readiness, or escalate a cached low balance as a current billing issue. The amount is a historical snapshot, not a current balance verified by this review.
- Minimal task/owner: **Evidence Freshness Agent**, evaluated by **Reality Checker**. Separate last successful account observation, latest attempt, and report generation. Default disk-only status to cached; attach age and current failed-attempt context without spending or changing the whitelist.
- Acceptance: Sep 2 success plus Sep 6 blocked-IP evidence prints cached balance and blocked current access; no top-up conclusion follows from an IP restriction; missing dates remain undated; only an explicitly performed successful current check may be called live. Test JSON and human-readable status plus marketing output.

### SCP-03 [P2] DataForSEO availability blocks the independent GSC daily refresh

- Evidence: `package.json:120` runs DataForSEO account, DataForSEO status, GSC inspection, and SEO self-evaluation in a single `&&` chain. `scripts/dataforseo-account.mjs:60` handles API failure and `:70` sets exit code 1.
- Trigger/scope: a DataForSEO account/service failure, such as the earlier Sep 6 IP block that the owner has now resolved, when invoking `npm run seo:daily`. The shell stops before `search-console.mjs --inspect-key-urls`, even when GSC credentials are refreshable. This chain was inspected, not executed by the specialist; it is not a current connectivity blocker.
- Confidence/impact: high. The first-party indexing source can remain stale because an unrelated research provider is unavailable. This is a refresh-control defect, not proof of an actual Google indexing regression.
- Minimal task/owner: **SEO Automation Agent**, evaluated by **Reality Checker**. Make the read-only provider refreshes independently report outcomes; when DataForSEO fails, keep paid research blocked while allowing GSC and a partial self-evaluation that explicitly identifies missing DataForSEO evidence. Preserve the existing submission/verification boundaries.
- Acceptance: mocked DataForSEO failure still reaches mocked GSC inspection and produces a partial, dated report; no paid calls or discovery submissions are introduced; GSC failure cannot be replaced by invented indexing states; the final summary retains each failure.

### SCP-04 [P2] Marketing overwrites newer indexing truth with an older weekly summary

- Evidence: `scripts/marketing-orchestrator-report.mjs:169` reads both sources, but `:179` selects the entire SEO summary whenever it has any rows. `:172` and `:184` discard per-observation dates. `scripts/seo-agent-self-evaluation.mjs:106` likewise strips `sourceGeneratedAt`. The daily plan adds its own fresh timestamp at `scripts/marketing-orchestrator-report.mjs:541`; evidence rows at `:61` carry presence, not age.
- Trigger/scope: an older weekly summary says a URL is unknown and a newer exact inspection says PASS. The in-memory fixture returned the old unknown gap. The same ordering can suppress a newly discovered real gap if the old summary says PASS.
- Confidence/impact: high. False recovery/link/promotion recommendations or missed genuine changes, with no usable observation date in the plan. This is independently reproduced; it is not inferred from the coordinator's stale primary-worktree files.
- Minimal task/owner: **Search Evidence Agent**, evaluated by **SEO Specialist**. Preserve observation provenance in summaries and consume the newest valid observation per URL, with explicit fallback/age labels. Prefer reusing existing merger/freshness behavior over another bespoke precedence rule.
- Acceptance: old unknown/new PASS produces no recovery task; old PASS/new non-PASS uses the new state; partial reports preserve other URLs; invalid/missing observations become unavailable, not current; Markdown and JSON expose source date/path. Repackaging a report cannot refresh observation age.

### SCP-05 [P2] Re-merged timestamps can reverse the growth pilot's newest-per-URL decision

- Evidence: `scripts/lib/new-tool-growth-pilot-report.mjs:42` ranks the containing report's `generatedAt`, not `inspection.sourceGeneratedAt`, and `:53` stores the wrapper timestamp as the observation date. Its caller includes merged canonical files at `scripts/new-tool-growth-pilot-report.mjs:92`. Separately, `scripts/lib/search-console-inspection-reports.mjs:103` derives `latestSourceGeneratedAt` from wrapper dates and `:93` overwrites an existing per-item source path. The merger correctly preserves per-item dates at `:83`, but its aggregate provenance is not stable across repeated merges. `scripts/aft-cli.mjs:384` prefers that aggregate date in its evidence banner.
- Trigger/scope: July 20 unknown inspection re-merged on Sep 6 competes with a Sep 2 PASS inspection in another report/worktree. The fixture selected July's unknown state and labeled it Sep 6. Merging the merged file again reported Sep 6 as the latest source date while its sole actual inspection remained July 20, and changed the path to `merged.json`.
- Confidence/impact: high. The growth sequence can be falsely blocked or falsely look discovered depending on which old verdict is repackaged. An evidence banner can look fresh despite no new Google observation. The main merger's normal per-URL winner test does not cover these downstream cases.
- Minimal task/owner: **Search Evidence Agent**, evaluated by **Growth Pilot Judge**. Reuse per-item observation timestamps for pilot selection; retain original source paths separately from container paths; calculate latest observation time from selected observations. Keep the existing pilot release conditions and approval boundary intact.
- Acceptance: nested/repeated merges are idempotent for verdict, observation date, and origin; a newer wrapper cannot beat a newer actual inspection; two worktrees with partial conflicting reports yield consistent winners; banner age is not reset by a report-only run. Existing raw-report tests must continue passing.

### SCP-06 [P2] Recovery reports treat indexed alternatives and intentional noindex pilots as failures

- Evidence: `scripts/lib/agent-tools-report.mjs:829` excludes only the literal phrase `Submitted and indexed`, ignoring `verdict: PASS`. Its downstream loops at `:1331` and `:1547` produce link/indexing actions without consulting indexation policy. `:1005` has only a separate hardcoded `/sitemap/` monitor exception for other signal paths. Marketing's `neutralIndexingItems` at `scripts/marketing-orchestrator-report.mjs:169` also lacks a policy filter for unknown/discovered pilots.
- Trigger/scope: `PASS` with `Indexed, not submitted in sitemap`, or TTS `Excluded by noindex tag` in the saved report; both became Link Helper gaps in the fixture. Unknown TTS became a marketing gap. The TTS tool/guide are intentionally excluded at `src/data/indexationPolicy.ts:41` and `:48`; `docs/tts-audiobook-pilot.md:7` and `:218` require beta evidence and Release Judge review before changing that.
- Confidence/impact: high. Agents can propose links or manual indexing work for already indexed URLs or deliberately held pilots. No actual TTS indexing submission or policy removal was observed.
- Minimal task/owner: **Indexation Protection Agent**, evaluated by **Release Judge**. Classify successful verdicts independently of coverage wording; use the source indexation policy to separate intentional exclusions from recovery tasks across CLI, Link Helper, SEO Console, and marketing. Preserve access for crawlers and users; do not remove noindex to make a report green.
- Acceptance: all PASS coverage variants are non-recovery; TTS tool/guide, feeds, and support remain monitor/excluded; an unexpected noindex on an otherwise indexable page is still reported; expired beta dates alone do not activate pages; Kawaii canonical/indexation/links/art remain unchanged.

### SCP-07 [P2] A two-channel pass can hide failed four-channel evidence

- Evidence: `scripts/marketing-orchestrator-report.mjs:482` constructs quality summaries only for Medium and Bluesky. `:474` reads the four-channel report but never uses its status in recommendation/blocker selection. `:152` considers two passing reports sufficient. `:367` then reports that the weekly review is fresh and all platform quality reports pass. Pinterest issues are not a blocker in this selection path.
- Trigger/scope: fresh passing Medium/Bluesky reports, no higher-priority queue/indexing item, and a failed Pinterest feed or site editorial/combined review. An in-memory fixture with Pinterest `issues: ['feed invalid']` and failed combined-review input returned `No urgent promotion action after weekly review`.
- Confidence/impact: high. Monitoring can go quiet while an approved channel is failing or unreviewed. Passing tests of the central review plan do not validate the downstream orchestrator.
- Minimal task/owner: **Promotion Evidence Agent**, evaluated by **Reality Checker**. Use the four-channel result and channel-specific results with consistent dates and schema checks; distinguish missing, stale, failed, and passed. Do not infer all-channel health from two external-platform reports.
- Acceptance: failure/missing/stale evidence in any required channel blocks the all-pass statement; a future timestamp is not accepted as fresh; a genuinely fresh complete four-channel pass permits monitoring; dry-run plans are never passing quality evidence.

### SCP-08 [P2] Multi-channel queue rows cannot represent channel-specific completion safely

- Evidence: `docs/promotion-queue.md:538` marks `Pinterest, Medium` as `posted`, but its action cell explicitly says the Medium draft is approved and not posted. `scripts/marketing-orchestrator-report.mjs:86` and `scripts/aft-cli.mjs:191` retain one status for that entire row. `scripts/lib/promotion-channel-policy.mjs:87` uses substring matching and first match; filtering at `:103` retains the original unsplit row. Fixture `Medium, Quora` matched Medium and survived as an active row, including Quora in the channel string.
- Trigger/scope: different delivery states for the same page on multiple channels, or an active/inactive channel combination. The current voltage-drop row is a concrete contradictory record, not current authorization to publish its old draft.
- Confidence/impact: high for data ambiguity and filtering behavior. One platform's proof can mask another platform's unfinished state; inactive names can leak through apparently active filtering. Existing single-channel policy tests do not cover this.
- Minimal task/owner: **Promotion Queue Steward**, evaluated by **Evidence Collector**. Require one exact channel per actionable row and key dedupe by channel, canonical destination, and approved content identity. Reconcile the existing mixed row from dated public proof; preserve history and do not automatically promote old prose to approval.
- Acceptance: mixed rows fail validation or are safely split with independently verified status; a Pinterest proof cannot mark Medium posted; `Medium, Quora` cannot authorize Quora work; scheduled/private URLs remain non-public until verified; missing approval remains a blocker.

## Authorship, Sources, And Scheduling Risks

These are bounded assurance/governance follow-ups, not allegations of false authorship, plagiarism, Google penalties, or proven duplicate posts.

- **R1: Citation presence is not primary-source verification.** `scripts/check-editorial-article-quality.mjs:91` reports `primarySources` from the count of external anchors; `:74` scores authenticity from first-person/brand/name occurrences. An isolated fixture with three identical unrelated `https://example.invalid/unrelated` links passed the citation subcheck. The whole fixture still failed quality, and shared writing checks were stubbed: this is not an end-to-end quality-bypass claim. `src/components/EditorialArticleLayout.astro:132` introduces sources as checked primary material and `:143` supplies the same first-person editorial disclosure for every article. **Technical Writer + Evidence Collector** should distinguish automated link-presence checks from a dated, claim-linked source/owner review before the Release Judge relies on it. Acceptance: duplicate/unrelated links cannot be described as verified primary evidence; genuine owner approval and source review remain human/evidence gates; truthful disclosures stay intact. Generic-template similarity alone does not justify rewriting the library.
- **R2: Documented schedule/policy drift needs reconciliation, not automatic action.** `docs/automation-operating-plan.md:14` and `:15` schedule the combined review and Medium specialist together on Wednesday at 10:00, while the combined runner includes Medium quality. The same doc's `:132`, `:134`, and `:139` still gives present-tense instructions for inactive channels. `docs/editorial-content-program.md:33` requires seven-day Medium companion spacing, but its Sep 2 site-release record and `docs/promotion-queue.md:520` record a Sep 2 companion; this may reflect an owner-approved exception absent from the policy. **Automation Governance Architect + Promotion Queue Steward** should compare actual scheduler state and exact approvals, document one quality-run owner/artifact per cadence, and record spacing exceptions explicitly. Acceptance: no duplicated scheduled quality work, inactive instructions clearly historical, public claims independently verified. Actual scheduler configuration and historical approval messages were not read here; there is no confirmed live duplicate-job finding.

## Evidence Reconciliation

Read-only access to other worktrees was restricted to the requested recovery reports. Their checkout HEADs were recorded using `git worktree list --porcelain`; those HEADs are context, not proof that ignored reports were generated from that exact commit.

| Evidence | Recorded timestamp/revision context | What it supports |
| --- | --- | --- |
| `C:/Users/chamb/OneDrive/Desktop/accessfreetools-sep2-seo-recovery/output/search-console/performance-latest.json` | generated `2026-09-02T01:38:22.665Z`; data date Sep 2; period May 31-Aug 30; worktree HEAD `39bfa452ea31f81a3c21fde1f5849f8b763bfa54` | 516 page rows, 83 page clicks, 61,692 page impressions; chart separately has 83 clicks/60,583 impressions. Do not mix page and chart totals. This is a saved GSC export, not current exact URL inspection. |
| Same Sep 2 performance report, Kawaii tool row | same timestamp/period | 32 clicks, 174 impressions, average position 6.33. Protect the existing page/art/intent. These are historical export metrics, not a live ranking claim. |
| `C:/Users/chamb/OneDrive/Desktop/accessfreetools-sep2-seo-recovery/output/crawlscout/crawlscout-summary.json` | generated `2026-09-02T01:38:24.031Z`; same worktree HEAD | 113 non-indexed sample rows and 130 sample impressions. This is a separate provided CrawlScout URL sample, not a complete Google index census. |
| `C:/Users/chamb/OneDrive/Desktop/accessfreetools-aug26-search-recovery/output/search-console-url-inspection.json` | generated `2026-08-26T04:31:28.376Z`; latest recorded source `2026-08-26T04:31:28.373Z`; worktree HEAD `5737eab7f09eca80378bf603df839722ec387549` | 406 merged URL records with mixed older per-URL observation dates. Not fresh Sep 6 inspection evidence. No newer inspection JSON was found in the Sep 2 recovery output inventory. |
| Aug 26 recovery `output/search-console/performance-latest.json` and `output/crawlscout/crawlscout-summary.json` | generated `2026-08-26T03:35:02.270Z` and `2026-08-26T03:35:13.802Z`; above HEAD | Older context only: 572 page rows/80 page clicks/48,275 page impressions; 114 CrawlScout sample rows. Different performance windows are not a controlled before/after comparison. |

Coordinator-provided observations, not rerun by this specialist:

- Latest environment/account update: Hostinger healthy; GSC token refreshable. The owner added the IP to the whitelist, and the coordinator's fresh Sep 6 DataForSEO account check succeeded at US$10.92. The earlier IP restriction is resolved, not a permanent/current blocker. No paid queries were performed. OpenSEO remains not callable.
- Audit source with original dirty checkout as evidence cwd: indexing-gaps saw stale Aug 26 inspection data; a Sep 2 import there showed 113 deindexed rows but zero page impressions/clicks. The fuller Sep 2 recovery report above demonstrates why those zeroes must not be stated as zero site demand. This is an evidence-location/completeness discrepancy; no performance-parser defect was established.
- Downloads currently contains Aug 26 as the newest actual export files; the Sep 2 named attachments are no longer present there. Do not replace the existing Sep 2 normalized reports with Aug 26 data merely because it is now the newest available source file. Preserve the Sep 2 provenance/period; source-archive reproduction is a separate remaining gap.
- proof-check: 91 claims with referenced paths present. That is local artifact/reference presence, not 91 freshly verified live posts.
- Full main check: coordinator reports 565 tests in 68 files passed, quality gates passed before the audit stage failed, and live sitemap check reported 663 OK URLs/zero hard failures. Therefore do not report the entire check as passing. This specialist did not reproduce that failure or the live sitemap check.

Recommended evidence handoff: coordinator records explicit source-code root, evidence root, per-file timestamp, data period, completeness, and revision when known. No report copies or merges across worktrees were written by this specialist. Keep OpenSEO unavailable as a research gap; no invented competitor or keyword evidence.

## Passed Checks And Protected Behavior

- Specialist executed **86 passing tests in 12 files**, in three focused Vitest commands listed below. These are source/helper tests, not production approval and not a replacement for coordinator QA.
- `src/data/discovery.ts` filters static, tool, blog, category, hub, and gallery entries through the policy. `src/pages/sitemap-images.xml.ts` filters image destinations too. `src/components/BaseLayout.astro:25` uses the shared robots policy, and `:53` omits Preferred Sources on noindex articles. TTS exclusions have direct tests. No source-level reason was found to remove those exclusions.
- `src/data/pinterestFeed.ts:884` excludes noindex tools from generated catalog feeds; `:917` exports only RSS-eligible, RSS-ready items, with posted archive separation at `:922`. Manual tool paths are excluded from catalog duplication at `:844`. Feed XML tests passed. This does not prove feed imports or public Pins.
- The ordinary merger test correctly selects the newest raw inspection independently per URL. CLI exact-gap output at `scripts/aft-cli.mjs:344` labels per-record freshness and `:1097` warns that a fresh wrapper does not refresh every URL. Preserve these useful behaviors while fixing other consumers.
- Generated calculator guides identify the organization as author at `src/components/CalculatorGuideArticle.astro:159`, not a fabricated individual credential, and expose audit source links at `:289`. Owner editorials expose source links and AI-assistance disclosure. No blanket authorship/citation rewrite is justified.
- Kawaii, existing smoke-kawaii artwork, the completed historical 604-unit review lane, Node 24, and Astro 7 are protected constraints. No page-completion or current indexation claims were derived from that old lane count.

## Workbench And Goal Routing

Proposed goal groups for the coordinator: **trustworthy evidence selection** (SCP-02 through SCP-06); **enforced four-channel distribution** (SCP-01, SCP-07, SCP-08); **traceable editorial approval and deduped schedules** (R1, R2). Final approval belongs to the Release Judge after implementation evidence. This report does not create global goals or scheduler jobs.

No content rewrite, new keyword target, or new page release is recommended. If the coordinator opens the exact page-policy verification tasks, reference these workbench commands, **not executed here because this specialist writes only its report**:

```powershell
node scripts/seo-agent-workbench.mjs all text-to-speech-audiobook-generator tool
node scripts/seo-agent-workbench.mjs all text-to-speech-audiobook-generator blog
node scripts/seo-agent-workbench.mjs all json-to-csv-converter tool
node scripts/seo-agent-workbench.mjs all json-to-csv-converter blog
node scripts/seo-agent-workbench.mjs all remove-ai-writing-tells-before-publishing editorial
```

Expected reports: `output/seo-agents/<slug>/<page>/plan.json`, `source-evidence.json`, `micro-agent-plan.json`, `link-audit.json`, and `final-judge.json`. These commands provide specialist/evaluator/micro-agent/final-judge scope; their local outputs cannot substitute for missing research, exact browser proof, or human approval. Do not activate a pilot or publish a companion from the existence of these files.

## Inspected Modules And Commands

Owning documents read or searched: root/campaign `AGENTS.md`; `docs/brand-code.md`, `marketing-orchestrator.md`, `recommended-agency-agents.md`, `google-search-central-notes.md`, `dataforseo-knowledgebase-notes.md`, `seo-agent-workbench.md`, `seo-tool-review-workflow.md`, `article-writing-agent-standard.md`, `editorial-content-program.md`, `new-tool-growth-pilot.md`, `tts-audiobook-pilot.md`, `automation-operating-plan.md`, `promotion-queue.md`, `promotion-account-registry.md`, and the Medium guide's cadence references. The global code-review and remove-ai-marks skills were read; audit-only provenance rules were respected. No cleaning/rewrite or media modification was attempted.

Modules inspected: `package.json`; `scripts/aft-cli.mjs`; `search-console.mjs` inspection/submission branches; `merge-search-console-inspection-reports.mjs` references; `dataforseo-account.mjs` failure branch; `seo-agent-self-evaluation.mjs` inspection summary; `marketing-orchestrator-report.mjs`; `four-channel-promotion-review.mjs`; `new-tool-growth-pilot-report.mjs`; `check-editorial-article-quality.mjs`; DEV/Bluesky publisher branches; selected Medium draft/canonical/disclosure definitions; `scripts/lib/{search-console-inspection-reports,promotion-channel-policy,marketing-orchestrator-recommendation,new-tool-growth-pilot-report,indexation-policy-source,agent-tools-report,seo-agent-workbench}.mjs` relevant sections; `src/data/{indexationPolicy,discovery,blogPosts,editorialBlogPosts,pinterestFeed,pinterestFeedXml}.ts`; all XML sitemap routes; `robots.txt.ts`; `BaseLayout`, `EditorialArticleLayout`, and `CalculatorGuideArticle` components; blog source/author references; corresponding focused test files.

Actual focused verification commands, all with audit-worktree cwd and no full build/check:

```powershell
node node_modules/vitest/vitest.mjs run src/data/indexationPolicy.test.ts scripts/lib/indexation-policy-source.test.mjs scripts/lib/search-console-inspection-reports.test.mjs scripts/lib/promotion-channel-policy.test.mjs scripts/lib/marketing-orchestrator-recommendation.test.mjs scripts/lib/new-tool-growth-pilot-report.test.mjs
# 6 files, 25 tests passed
node node_modules/vitest/vitest.mjs run scripts/lib/agent-tools-report.test.mjs scripts/lib/seo-agent-workbench.test.mjs src/data/pinterestFeedXml.test.ts scripts/lib/search-console-performance-import.test.mjs scripts/mobile-seo-audit.test.mjs
# 5 files, 53 tests passed
node node_modules/vitest/vitest.mjs run scripts/aft-cli.test.mjs
# 1 file, 8 tests passed
git status --short
git worktree list --porcelain
git diff --name-only
```

Actual read-only investigation used `rg --files`, `rg -n`, `Get-Content` (including numbered line windows), and `Get-ChildItem -LiteralPath .../output -Recurse -File -Filter *.json` for the Sep 2 recovery report inventory. Initial explicit wildcard path operands in several `rg` commands failed with Windows OS error 123; guessed `BlogLayout.astro`, bracketed blog route, and `toolTrust.ts` paths were absent. Those failures were not treated as application defects; subsequent file inventory and actual component paths supplied the reads.

PowerShell here-string commands piped into `node --input-type=module` performed in-memory reproductions and structured JSON reads, without script files or output reports. Current function declarations were selected with the TypeScript AST and evaluated in `node:vm` to avoid top-level writers/network operations. Functions tested: `neutralIndexingItems`, `chooseRecommendations`, `searchConsoleGaps`, `scoreArticle` (citation subcheck only), `getDataForSeoBalance`, and `platformQualityReports`; pure merger, pilot selection, and channel-policy functions were imported normally. Additional stdin JSON reads extracted recovery-report metadata, aggregate counts, and Kawaii page rows. Fixtures and observed results are specified in the finding bullets; no fixture result describes production state.

Read-only memory lookup searched the registry for inspection/noindex/four-channel/promotion/editorial rules; findings were rechecked against current source rather than relying on old status. No memory was edited.

## External Source Check

- Google's noindex guidance says crawlers must be able to retrieve the page to see the rule. The current allow-crawl plus page-level noindex design should not be replaced with robots blocking to satisfy an audit. [Google noindex documentation](https://developers.google.com/search/docs/crawling-indexing/block-indexing), opened 2026-09-06.
- Helpful-content guidance supports clear sourcing and authorship/process transparency; counting links or first-person words is not equivalent to validating them. [Google helpful-content guidance](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), opened 2026-09-06.
- URL Inspection API documentation was opened to keep inspection distinct from public publication/indexing-request proof. No authenticated call or submission was made. [Google URL Inspection API](https://developers.google.com/webmaster-tools/v1/urlInspection.index/inspect), opened 2026-09-06.

## Unsupported Conclusions And Remaining Coverage

- No current URL-level Google indexing verdicts were fetched. Saved inspection ages remain visible; performance exports and CrawlScout samples cannot replace current GSC inspection.
- No paid market research, OpenSEO project lookup, competitor originality comparison, backlink validation, live social account access, or new publication was performed. OpenSEO is unavailable by the supplied environment context.
- No full build/check, production rendering, sitemap fetch, browser screenshot, physical-device pilot testing, live canonical/source setting verification, or visual artwork review was performed by this specialist. Coordinator results are separately labeled above.
- No actual scheduler TOMLs or global automation settings were read or changed. Documented overlapping schedules do not prove jobs are currently enabled. No global goal/task state was modified.
- No exhaustive article-by-article factual/source-link audit, duplicate-text census, ownership attestation audit, or AI-provenance detector scan was performed. Unsupported media/secret-key detection is not a clean result; no marks or disclosures were removed.
- No claim that a date alone authorizes release, that local scores prove Google quality, that all 91 recorded claims are live, that all 113 CrawlScout sample rows represent the site's complete index state, or that an old 11.02 USD snapshot proves current paid access.
- Minimal implementation tasks should fix evidence/policy control points first, not trigger unsupported public rewrites. All release/public-action permissions remain with the owner and Release Judge.
