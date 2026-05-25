# GSC Performance Agent Tasks - 2026-05-26

Source export: `agents/serpforge-ai/evidence/gsc-performance-2026-05-26.zip`

Summary report: `agents/serpforge-ai/reports/gsc-performance-export-summary-2026-05-26.md`

## Rules

- Search Console is the truth source for clicks, impressions, CTR, and average position.
- DataForSEO is the market and SERP evidence layer after account/status gates.
- Do not build duplicate pages to chase impressions. Improve the best matching page.
- Tool and blog page fixes need page-specific SEO workbench proof before approval.
- Public wording must be smart 14-year-old: clear, useful, specific, no generic AI or SEO filler.
- Old URLs with Search Console signals stay in redirect-watch unless there is proof the replacement is wrong.

## P0 Tasks

| status | owner | id | task | evidence | done rule |
| --- | --- | --- | --- | --- | --- |
| confirmed | Main Audit Coordinator | gsc-import-2026-05-26 | Keep the latest GSC export as evidence and use it to order SEO sprints. | Source zip in `agents/serpforge-ai/evidence/gsc-performance-2026-05-26.zip`; summary report in `agents/serpforge-ai/reports/`. | Evidence files committed and referenced by coordinator/deep audit boards. |
| confirmed | DataForSEO Market Agent + Search Intent And Keyword Agent | interest-rate-dataforseo-page-sprint | Treat `/tools/interest-rate-calculator/` as the first GSC-driven page sprint. It has the most impressions and no clicks. Use DataForSEO Labs/SERP only after gates. | GSC: 915 impressions, 0 clicks, position 62.76. `paid-audit-sprint interest-rate-calculator tool` passed. | Fresh `npm run serpforge -- paid-audit-sprint interest-rate-calculator tool` plus no final-judge DataForSEO blocker. |
| confirmed | Metadata And Heading Agent | interest-rate-source-seo-description | Add a real source `seoDescription` for the Interest Rate Calculator. It should explain the job plainly: estimate an annual rate from amount, payment, and term. | `npm run aft -- seo-page-score interest-rate-calculator tool` failed: missing `seoDescription`. | `npm run aft -- seo-page-score interest-rate-calculator tool` passes the missing-description issue. |
| confirmed | FAQ And Schema Specialist | interest-rate-six-faqs | Add six or more visible FAQs that answer real interest-rate questions: inputs, APR/rate difference, payment mismatch, estimate limits, finance trust limits, and when to use loan/payment calculators instead. | Page score warning: 0 FAQs; FAQ score 10. | Page score FAQ section improves; workbench final judge has no FAQ/schema blocker. |
| confirmed | Internal Link And Anchor Agent | interest-rate-contextual-links | Improve body links around rate, loan payment, APR, payment calculator, loan calculator, and finance category without link stuffing. | Workbench internal-link score 82; matching guide link exists but descriptive ratio is weak. | `node scripts/seo-agent-workbench.mjs all interest-rate-calculator tool` returns no internal-link blocker and score at or above 90. |
| confirmed | Browser Proof Reviewer | interest-rate-browser-proof | Open the exact Interest Rate Calculator page after edits and save fresh proof. | Workbench final judge blocked browser proof. | Fresh local/browser proof path recorded in the page sprint notes. |
| confirmed | Audit Sprint Judge | interest-rate-final-judge | Block approval until the source edit, FAQ edit, DataForSEO proof, page score, link audit, browser proof, and human-tone checks pass. | Workbench final judge currently blocked with 6 gaps. | `node scripts/seo-agent-workbench.mjs all interest-rate-calculator tool` has no blockers; `npm run check` passes before deployment. |
| needs-proof | Crawl And Indexation Agent | gsc-coverage-url-sample-export | Get a separate Search Console Coverage/Page Indexing export for the reported 5xx, 404, crawled-not-indexed, and discovered-not-indexed samples. The 2026-05-26 performance export does not include those URL examples. | `npm run aft -- seo-console` still asks for URL examples for 3 Google 5xx pages and 1 404 sample. | Run `npm run search-console:import-coverage` after downloading Coverage CSVs, then test each sampled URL live before creating fix tasks. |

## P1 GSC Opportunity Tasks

| status | owner | id | task | evidence | done rule |
| --- | --- | --- | --- | --- | --- |
| needs-proof | Metadata And Heading Agent + Content Depth Agent | near-page-one-ctr-sprint | Review near-page-one pages first because Google is already testing them around positions 8 to 12. Start with gas mileage, half-life, character counter, payback period, heat index guide, insulation guide, and polymeric sand guide. | GSC near-page-one rows in summary report. | For each chosen page: page workbench, page score, DataForSEO proof if tool/blog, and final judge before edits are called ready. |
| needs-proof | Content Depth Agent | high-impression-tool-review | Triage high-impression zero-click tool pages after Interest Rate: matrix, date, target heart rate, area, fraction, sales tax, flooring, oven temperature, triangle, engine horsepower, golf handicap, sand, ad revenue, resistor, horsepower. | GSC pages with 100+ impressions and 0 clicks. | Create page-specific sprint rows; do not mark done from sitewide proof. |
| needs-proof | Metadata And Heading Agent | markup-guide-query-fit | Review `/blog/how-to-use-markup-calculator/` because it has 591 impressions and 0 clicks. Confirm whether it should answer `calculate markup` or whether the matching tool needs stronger routing. | GSC page row and query row `calculate markup`. | Workbench on the guide and matching tool, plus DataForSEO query/SERP proof before rewrite. |
| needs-proof | E-E-A-T Trust Agent | health-and-finance-near-rank-review | Review BMR, heat index, target heart rate, sales tax, interest rate, and payback period with stronger trust wording where needed. | GSC shows health/finance pages getting impressions but mostly no clicks. | No YMYL page is approved without visible limits, useful examples, and schema aligned to visible content. |
| needs-proof | Technical Headers Agent + Metadata And Heading Agent | desktop-serp-underperformance | Desktop has 8,472 impressions, 2 clicks, CTR 0.02%, average position 47.35. Treat this as rank/snippet testing, not as a mobile-only UX issue. | Device export. | For selected pages, compare desktop SERP title/snippet with page title/meta and adjust only where the page intent is clear. |

## P2 Watch Tasks

| status | owner | id | task | evidence | done rule |
| --- | --- | --- | --- | --- | --- |
| watch | Crawl And Indexation Agent | legacy-url-search-console-watch | Keep old URLs in redirect watch: old AdSense article, `/advanced-age-calculator`, `/calculators`, and `/deep-research`. Do not rebuild them unless a redirect target is proven wrong. | GSC export still shows old URLs with impressions/clicks. | Live 301 proof and URL Inspection for the replacement targets after deployment. |
| watch | DataForSEO Market Agent | country-priority-watch | Keep United States as the main DataForSEO location, but note that Australia is converting better in the tiny sample. | Countries export: US 5,759 impressions/3 clicks; Australia 264 impressions/2 clicks. | Only change targeting if future GSC rows show a real pattern, not a 2-click sample. |
| watch | Search Intent And Keyword Agent | off-brand-query-watch | Do not chase off-brand or odd queries just because they show impressions. | Query examples include `joshclarkcalculates` and long formula fragments. | Mark as rejected unless the query maps cleanly to a useful existing tool or guide. |

## First Sprint Order

1. `/tools/interest-rate-calculator/`
2. `/tools/gas-mileage-calculator/`
3. `/blog/how-to-use-half-life-calculator/` and `/tools/half-life-calculator/`
4. `/tools/character-counter/`
5. `/blog/how-to-use-markup-calculator/` plus matching markup tool

The order favors a mix of high impressions, near-page-one chances, and obvious page-score blockers.
