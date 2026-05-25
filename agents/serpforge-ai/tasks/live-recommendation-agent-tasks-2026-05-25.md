# Live Recommendation Agent Tasks - 2026-05-25

This board turns the latest live audit, Search Console checks, DataForSEO OnPage crawl, and SEO workbench output into agent-owned tasks. It is not a claim that every item is fixed. It tells the main agent what is already proven, what needs proof, and which sub-agent owns the next move.

## Evidence Pack

- Live deploy proof: commit `6ac9aaa` on `codex/all-pages-seo-gsc-refresh` and `main`.
- Live DataForSEO OnPage crawl: `agents/serpforge-ai/reports/dataforseo-sitewide-onpage-live-postcommit-2026-05-25T12-28-24-849Z/summary.md`.
- Search Console sitemap proof: `output/search-console-discovery.json`.
- Search Console URL Inspection proof: `output/search-console-url-inspection.json`.
- Production sitemap proof: `output/production-sitemap-check.json`.
- Wallpaper SEO workbench: `output/seo-agents/wallpaper-calculator/tool/final-judge.md`.
- Wallpaper link audit: `output/seo-agents/wallpaper-calculator/tool/link-audit.md`.
- All-pages human-tone proof: latest `agents/serpforge-ai/reports/serpforge-all-pages-human-tone-report-*.md`.

## Main-Agent Rules

- SERPForge is the main agent. It assigns tasks, checks proof, and keeps task state in `agents/serpforge-ai/`.
- Sub-agents may recommend, draft, verify, and report. They cannot mark `fixed`, `submitted`, `indexed`, `ranked`, `live`, or `done` without the proof listed on the task.
- Tool and blog page tasks still require page-specific DataForSEO evidence before approval.
- Public copy must keep the Access Free Tools voice: smart 14-year-old, practical, specific, no generic SEO or AI filler.
- Do not add content just to beat a crawler score. If a page already answers the job, record `watch` instead of padding it.

## P0 Open Tasks

| status | owner | id | task | evidence | proof gate |
| --- | --- | --- | --- | --- | --- |
| confirmed | Crawl And Indexation Agent | wallpaper-tool-indexing-watch | Keep `/tools/wallpaper-calculator/` in the indexing watch lane. Search Console says `Discovered - currently not indexed`; the matching guide is indexed. Verify canonical, sitemap inclusion, robots access, and internal discovery before claiming a fix. | `output/search-console-url-inspection.json` rows for wallpaper tool and guide. | `npm run search-console:inspect-key-urls`; only mark indexed when URL Inspection returns `PASS` for the tool URL. |
| confirmed | Internal Link And Anchor Agent | wallpaper-contextual-link-cleanup | Improve the wallpaper tool's contextual link score without link stuffing. Add or adjust only reader-useful body links from the matching guide, home-projects category, and home material hub if they help the user choose the next step. | `output/seo-agents/wallpaper-calculator/tool/final-judge.md` blocked on internal links; `link-audit.md` score 82. | `node scripts/seo-agent-workbench.mjs all wallpaper-calculator tool`; target no blocked agent and internal-link score at or above 90. |
| confirmed | Technical Headers Agent | hostinger-html-cache-edge-proof | Investigate Hostinger/hcdn cache behavior because live HTML still returns `Cache-Control: public, max-age=0` while HSTS and canonical redirects are live. Plan edge-cache settings in Hostinger before any production change. | Live HEAD checks from 2026-05-25 showed HSTS and redirects live, but HTML cache max-age remained 0. | Fresh live `curl -I https://accessfreetools.com/` before/after. No owner-facing claim unless the header changes or Hostinger documents the forced behavior. |
| confirmed | Content Depth Agent | dataforseo-low-content-rate-review | Review the 41 DataForSEO low-content-rate rows manually. The crawl found zero low-character pages and zero low-score pages, so the default action is `watch` unless the page is actually weak for readers. | DataForSEO summary: pages 646, lowContentRate 41, lowScorePages 0, brokenPages 0, missingTitle 0, missingDescription 0. | Shortlist pages with real reader gaps, then run page workbench before edits. Do not pad copy for ratio-only crawler signals. |
| confirmed | Metadata And Heading Agent | dataforseo-duplicate-content-groups | Review the 10 duplicate-content groups from DataForSEO. Prioritize natural lookalike calculators that need more distinct examples, formulas, limits, or openings. | `duplicate-content-*.raw.json` files in the postcommit DataForSEO report folder. | For each edited page, run `node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>` and a fresh DataForSEO page/onpage proof before marking done. |
| needs-proof | GSC Sitemap Submission Agent | sitemap-pending-watch | Recheck sitemap processing because `/sitemap.xml` and `/feed.xml` were submitted and pending, while child sitemaps had zero errors and zero warnings. | `output/search-console-discovery.json`. | `npm run search-console:submit-discovery`; keep status as `needs-proof` until pending clears or Search Console reports a clear error. |

## P1 Follow-Up Tasks

| status | owner | id | task | evidence | proof gate |
| --- | --- | --- | --- | --- | --- |
| watch | Technical Headers Agent + Image And Listing UX Agent | soft-performance-budget-review | Review soft warnings from `npm run check`: large local AI model assets, gallery index HTML size, and soft CSS/JS/WASM budgets. These passed current checks, so treat them as performance watch items, not launch blockers. | `npm run check` passed with soft warnings only. | Re-run `npm run check`; open a fix task only when a real user-facing or crawl-facing slowdown is proven. |
| watch | Content Depth Agent | people-first-page-depth | Use Google's people-first content guidance when expanding thin-feeling pages. Add examples, limits, formulas, or decision help only where the page helps a reader finish the job better. | Google Search Central people-first guidance and DataForSEO low-content-rate rows. | Page-specific workbench, human-tone report, and DataForSEO proof for any edited tool/blog page. |
| needs-proof | DataForSEO Market Agent | keyword-planner-dataforseo-crosscheck | Cross-check the Google Keyword Planner priorities with DataForSEO Labs and live SERP evidence before changing titles, headings, or page scope. | `agents/serpforge-ai/tasks/google-keyword-planner-priorities.md`. | `npm run dataforseo:account`; `npm run dataforseo:status`; targeted Labs/SERP output saved under `agents/serpforge-ai/reports/`. |
| needs-proof | Audit Sprint Judge | final-done-reconciliation | Reconcile this live task board against `deep-audit-agent-board.md`, the all-pages queue, and the latest DataForSEO crawl so no page is marked done from sitewide proof alone. | This file, `agents/serpforge-ai/tasks/deep-audit-agent-board.md`, and latest reports. | `npm run serpforge -- deep-audit-sprint`; `npm run serpforge -- all-pages-human-tone-report`; page-specific workbench for blockers. |

## Proven Items

| status | owner | id | proof |
| --- | --- | --- | --- |
| already-fixed | Technical Headers Agent | hsts-live | Live responses include `Strict-Transport-Security: max-age=31536000; includeSubDomains`. |
| already-fixed | Technical Headers Agent | canonical-redirects-live | `/tools/basic-calculator` redirects to `/tools/basic-calculator/`; `www.accessfreetools.com/tools/basic-calculator/` redirects to canonical non-www. |
| already-fixed | DataForSEO Market Agent | postdeploy-onpage-crawl-complete | Fresh paid OnPage crawl finished with 646 pages, 0 broken pages, 0 broken links, 0 non-indexable pages, 0 missing titles, and 0 missing descriptions. |
| already-fixed | GSC Sitemap Submission Agent | sitemap-set-submitted | Search Console owner permission is live; sitemap index, child sitemaps, image sitemap, gallery sitemap, category sitemap, blog sitemap, tools sitemap, pages sitemap, and feed are present with zero reported errors/warnings in the latest discovery output. |
| already-fixed | Smart 14 Voice Editor | all-pages-human-tone-pass | Latest all-pages human-tone report passed 643 public pages and 598 mandatory tool/blog rows. |

## Duplicate-Content Review Groups

The Content Depth Agent should review these before writing. Similarity can be natural when two calculators solve paired jobs, so the first step is diagnosis, not automatic rewriting.

| group | page | similar pages |
| --- | --- | --- |
| 1 | `/blog/how-to-use-amp-hours-to-watt-hours-calculator/` | `/blog/how-to-use-watt-hours-to-amp-hours-calculator/`; `/tools/amp-hours-to-watt-hours-calculator/` |
| 2 | `/blog/how-to-use-amps-to-watts-calculator/` | `/blog/how-to-use-kilowatts-to-amps-calculator/`; `/blog/how-to-use-watts-to-amps-calculator/` |
| 3 | `/blog/how-to-use-annuity-calculator/` | `/blog/how-to-use-future-value-calculator/` |
| 4 | `/blog/how-to-use-army-body-fat-calculator/` | `/blog/how-to-use-estate-tax-calculator/` |
| 5 | `/blog/how-to-use-baluster-calculator/` | `/blog/how-to-use-deck-board-calculator/` |
| 6 | `/blog/how-to-use-bmr-calculator/` | `/blog/how-to-use-calorie-calculator/`; `/blog/how-to-use-tdee-calculator/` |
| 7 | `/blog/how-to-use-body-fat-calculator/` | `/tools/body-type-calculator/` |
| 8 | `/blog/how-to-use-bond-calculator/` | `/tools/bond-calculator/` |
| 9 | `/blog/how-to-use-brick-calculator/` | `/blog/how-to-use-gdp-calculator/`; `/blog/how-to-use-roman-numeral-converter/`; `/blog/how-to-use-time-card-calculator/` |
| 10 | `/blog/how-to-use-business-loan-calculator/` | `/blog/how-to-use-personal-loan-calculator/` |

## Agent Handoff

1. Crawl And Indexation Agent starts with `wallpaper-tool-indexing-watch`.
2. Internal Link And Anchor Agent handles `wallpaper-contextual-link-cleanup`.
3. Technical Headers Agent handles `hostinger-html-cache-edge-proof`.
4. Content Depth Agent and Metadata And Heading Agent split the DataForSEO low-content and duplicate-content reviews.
5. GSC Sitemap Submission Agent reruns sitemap discovery after Google has time to process the latest submission.
6. Audit Sprint Judge blocks `done` until every open task has proof or a written `watch` reason.
