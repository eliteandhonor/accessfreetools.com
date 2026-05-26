# SERPForge AI Worklog

## 2026-05-24 - Workspace Created

- Created a dedicated repo-local workspace for the SERPForge AI SEO persona.
- Captured the requested topology, ruleset, decision stack, and response behavior in `AGENTS.md`.
- Connected SERPForge work to the existing Access Free Tools brand code, SEO operating system, marketing orchestrator, and SEO workbench.
- Verified the SEO workbench entry point responds with usage:
  `node scripts/seo-agent-workbench.mjs <plan|sources|micro-plan|links|judge|all> <slug> <tool|blog>`.

## 2026-05-24 - Tool Access Added

- Added `npm run serpforge -- toolbox` for the SERPForge tool inventory.
- Added `npm run serpforge -- orientation` for read-only status, evidence, queue, indexing, and proof checks.
- Added `npm run serpforge -- page <slug> <tool|blog>` for the page-specific proof chain.
- Added `npm run serpforge -- sources <slug> <tool|blog>` for source-evidence collection before a full review.

## 2026-05-24 - Agent Team And Expanded CLI

- Added individual SERPForge agent role files under `agents/`.
- Added opportunity, technical, brief, CTR, validate, competitor, and Lighthouse CLI commands.
- Selected Lighthouse CLI through `npx` as the external lab SEO/page-experience checker.

## 2026-05-24 - Audit Main/Sub-Agent Workflow

- Imported the external SEO audit into SERPForge evidence.
- Added the shared audit task board under `tasks/`.
- Added main/sub-agent role files for audit lanes, DataForSEO, gallery SEO, image alt SEO, HTML sitemap, image sitemap, and GSC sitemap submission.
- Added audit, sitemap, DataForSEO, gallery, and alt SEO CLI lanes to `npm run serpforge`.

## 2026-05-25 - Live Recommendations Converted To Agent Tasks

- Added `agents/serpforge-ai/tasks/live-recommendation-agent-tasks-2026-05-25.md`.
- Open follow-up tasks now cover wallpaper Search Console indexing, wallpaper internal-link workbench blocker, Hostinger HTML cache header proof, DataForSEO low-content-rate review, DataForSEO duplicate-content groups, sitemap pending watch, and soft performance budget review.
- Proven items are separated from open recommendations: HSTS live, canonical redirects live, DataForSEO postdeploy crawl complete, sitemap set submitted, and all-pages human-tone report passed.
- Main coordinator and deep audit board now point to the live follow-up task board.

## 2026-05-26 - Search Console Performance Export Imported

- Saved the latest Search Console performance export as `agents/serpforge-ai/evidence/gsc-performance-2026-05-26.zip`.
- Added `agents/serpforge-ai/reports/gsc-performance-export-summary-2026-05-26.md`.
- Added `agents/serpforge-ai/tasks/gsc-performance-agent-tasks-2026-05-26.md`.
- Made `/tools/interest-rate-calculator/` the first GSC-driven page sprint because it has 915 impressions, 0 clicks, missing source `seoDescription`, 0 FAQs, page score 81, and a blocked SEO workbench.

## 2026-05-26 - Interest Rate Page Sprint Cleared

- Removed public internal-review wording from all tool pages and guide source sections, including the "Reviewed tool page", "Last checked", and "Useful references" copy shown in the live screenshot.
- Added Interest Rate Calculator source SEO description, specific input explanations, concrete example interpretation, APR/payment/loan contextual links, and visible FAQs.
- Ran DataForSEO gates and paid page evidence for `/tools/interest-rate-calculator/`; proof now lives at `output/seo-tool-review/interest-rate-calculator/tool/dataforseo-paid.md`.
- Saved browser/visual proof for the exact local page and confirmed the bad public-review phrases are absent.
- Final page agent judge now reports `ready-for-human-approval` with 0 gaps for `/tools/interest-rate-calculator/`.

## 2026-05-26 - Gas Mileage Page Sprint Cleared

- Added Gas Mileage Calculator input explanations, clearer worked-example interpretation, and extra visible FAQs for full-tank measurement, MPG vs fuel-used outputs, and when to use Fuel Cost instead.
- Ran DataForSEO paid page evidence and competitor gap proof for `/tools/gas-mileage-calculator/`.
- Saved internal-browser DOM proof and visual proof at `output/seo-tool-review/gas-mileage-calculator/tool/`.
- Final page agent judge now reports `ready-for-human-approval` with 0 gaps for `/tools/gas-mileage-calculator/`.

## 2026-05-26 - Half-Life Tool And Guide Sprint Cleared

- Reviewed `/tools/half-life-calculator/` and `/blog/how-to-use-half-life-calculator/` as a paired sprint using web source checks, competitor gap evidence, DataForSEO paid evidence, browser proof, and the SERPForge final judges.
- Updated the Half-Life tool description, example labels, worked-example results, related tools, double-check FAQ, and art alt/caption text.
- Expanded the Half-Life guide with a quick answer, stronger safety limits for caffeine/medicine/radiation examples, full FAQ coverage, current EPA/NRC/OpenStax references, and a 2026-05-26 modified date.
- Removed hidden paid POST retries from the DataForSEO helper path after sub-agent review flagged cost risk; reran the paid sprint successfully with the safer no-retry command path.
- Final page agent judges now report `ready-for-human-approval` with 0 gaps for both Half-Life pages.
- Deployed main commit `66d05b5` through Hostinger Node build `019e61bd-c53b-73b4-b685-c2edaea2366c`; live Ask, production sitemap, full GSC sitemap submission, live HTML proof, live browser screenshots, and post-deploy DataForSEO page evidence all passed.

## 2026-05-26 - Character Counter Tool And Guide Sprint Cleared

- Reviewed `/tools/character-counter/` and `/blog/how-to-use-character-counter/` as a paired sprint using current Google Search Central and MDN source checks, competitor gap evidence, DataForSEO paid evidence, browser proof, and SERPForge final judges.
- Updated the Character Counter tool copy for text-specific intent: characters, no-space count, words, lines, and UTF-8 bytes; removed generic calculator wording from non-calculator tool and guide templates.
- Corrected the example result for `Meeting moved to 2:30 PM. Bring notes.` to `38 characters and 8 words`, added an emoji/UTF-8 byte example, and clarified Unicode code-point limits.
- Repaired Character Counter tool and guide image alt/caption source data so the artwork describes the visible text box, count blocks, line count, and UTF-8 byte blocks.
- Final page agent judges now report `ready-for-human-approval` with 0 gaps for both Character Counter pages; `npm run check` passed before deployment.
- Deployed main commit `24e24ed` through Hostinger Node build `019e61e1-2fb1-7312-82b1-cdada33f40d7`; live Ask, production sitemap, full GSC sitemap submission, live HTML proof, live browser screenshots, and post-deploy DataForSEO page evidence all passed.

## 2026-05-26 - Markup Tool And Guide Sprint Cleared

- Reviewed `/tools/markup-calculator/` and `/blog/how-to-use-markup-calculator/` as a paired sprint using OpenStax and Google source checks, CalculatorSoup and Omni competitor gap evidence, DataForSEO paid evidence, browser proof, and SERPForge final judges.
- Updated the Markup tool with exact result examples, clearer cost-plus formula wording, a source `seoTitle`, six source FAQs, and fee, packaging, target-margin, and demand caveats in smart-14 wording.
- Tightened the matching guide around the $30 cost and 50% markup example, including $45 selling price, $1,500 batch profit, and 33.33% margin without treating markup and margin as the same thing.
- Repaired Markup tool and guide image alt/caption source data so the artwork describes unit cost, markup percent, selling price, profit, and margin cards.
- Fixed the SEO agent evidence extractor so generated finance FAQs count correctly for finance factory-list pages; final page agent judges now report `ready-for-human-approval` with 0 gaps for both Markup pages.
- Deployed main commit `61cbace` through Hostinger Node build `019e61f7-634a-73cd-8a45-af21a90c9a12`; live Ask, production sitemap, full GSC sitemap submission, live DOM proof, live browser screenshots, and post-deploy DataForSEO page evidence all passed.

## 2026-05-26 - Payback Period Tool And Guide Sprint Cleared

- Reviewed `/tools/payback-period-calculator/` and `/blog/how-to-use-payback-period-calculator/` as a paired sprint using current OpenStax and Google source checks, Calculator.net and CalcMastery competitor gap evidence, DataForSEO paid evidence, built-browser proof, and SERPForge final judges.
- Added a Payback Period source `seoTitle` and `seoDescription`, exact example outcomes, input explanations, six extra FAQs, and sharper simple-payback limits around discounted payback, uneven cash flows, resale value, and cash earned after recovery.
- Tightened the matching guide around the $15,000 cost and $3,600 yearly savings example, including 4.17-year payback, $13,800 simple net after 8 years, horizon formula wording, and ROI/IRR/Present Value routing.
- Repaired Payback Period tool and guide image alt/caption source data so the artwork describes initial cost, annual cash flow, payback years, net after horizon, and the timeline/payback point.
- Final page agent judges now report `ready-for-human-approval` with 0 gaps for both Payback Period pages; `npm run check` passed before deployment.
- Deployed main commit `3dc1ca5` through Hostinger Node build `019e620d-898b-733e-adc4-0dc7515d03f8`; live Ask, production sitemap, full GSC sitemap submission, live DOM proof, live browser screenshots, and post-deploy DataForSEO page evidence all passed.

## 2026-05-26 - Heat Index Tool And Guide Sprint Cleared And Deployed

- Reviewed `/tools/heat-index-calculator/` and `/blog/how-to-use-heat-index-calculator/` as a paired sprint using current NWS/NOAA, CDC, Google Search Central, Calculator.net, and DataForSEO evidence.
- Updated the Heat Index tool with source `seoTitle` and `seoDescription`, exact 90 F/70%, 95 F/35%, and 100 F/55% examples, heat-risk limits, direct-sun wording, Celsius/wind-speed FAQs, and practical heat-illness caution language.
- Expanded the matching guide with example sanity checks, direct-sun and local-advisory limits, CDC heat-health context, and clearer routing back to the tool and related pages.
- Repaired Heat Index tool and guide image alt/caption source data so the artwork describes temperature, relative humidity, heat index, Celsius result, and the guide's chart-style walkthrough.
- Fresh built-browser proof confirms the public internal-review wording is absent and the new examples, FAQ/schema, modified date, and smart-14 wording render.
- Final page agent judges now report `ready-for-human-approval` with 0 gaps for both Heat Index pages; page scores are 100/100 and post-edit DataForSEO paid evidence passed.
- Deployed main commit `83a5934` through Hostinger Node build `019e6223-33bb-7280-a66d-2b778c41ffd7`; live Ask, production sitemap retry, full GSC sitemap submission, live DOM proof, live browser screenshots, and post-deploy DataForSEO page evidence all passed.

## 2026-05-26 - Insulation Tool And Guide Sprint Cleared And Deployed

- Reviewed `/tools/insulation-calculator/` and `/blog/how-to-use-insulation-calculator/` as a paired sprint using current ENERGY STAR, FTC, DOE, Google Search Central, Tallyard competitor, and DataForSEO evidence.
- Updated the Insulation tool with source `seoTitle` and `seoDescription`, square-foot/wall/attic/ceiling aliases, exact 25/28/14 pack examples, product-label coverage FAQs, and clearer R-value limits.
- Expanded the matching guide with a 1,200 square foot attic / 28 packs walkthrough, a product-label coverage warning, ENERGY STAR/FTC source context, and clearer quantity-vs-R-value wording.
- Repaired Insulation tool and guide image alt/caption source data so the artwork describes area, openings, coverage per pack, waste, R-value, and pack-count cards.
- Fresh built-browser proof confirms the public internal-review wording is absent and the new examples, FAQ/schema, modified date, and smart-14 wording render.
- Final page agent judges now report `ready-for-human-approval` with 0 gaps for both Insulation pages; page scores are 100/100 and post-edit DataForSEO paid evidence passed.
- Deployed main commit `b460f73` through Hostinger Node build `019e6234-665b-7106-855c-e3dd52682945`; live Ask retry, production sitemap retry, full GSC sitemap submission, live DOM proof, live browser screenshots, and post-deploy DataForSEO page evidence all passed.

## 2026-05-26 - Polymeric Sand Tool And Guide Sprint Cleared And Deployed

- Reviewed `/tools/polymeric-sand-calculator/` and `/blog/how-to-use-polymeric-sand-calculator/` as a paired sprint using current Google Search Central, Sakrete, QUIKRETE, Inch Calculator competitor, GSC near-page-one data, and DataForSEO evidence.
- Updated the Polymeric Sand tool with source SEO metadata, square-foot/paver/flagstone/50 lb bag aliases, exact 1.72 ft3 / 4 bag and 1.46 ft3 / 4 bag examples, product-label coverage FAQs, and clearer planning-estimate limits.
- Expanded the matching guide with a 200 square foot patio walkthrough, a 50 lb bag/product-label section, flagstone and old-joint cautions, and dry-paver/watering/cleanup limits.
- Repaired Polymeric Sand tool and guide image alt/caption source data so the artwork describes paver joints, flagstone joints, sand buckets, joint width/depth, coverage cards, and bag count.
- Cleaned low-risk generic guide template copy flagged by the sub-agent, including “calculator assumptions”, “Use this guide as a short walkthrough”, and non-specific calculator/resource wording.
- Fresh built-browser proof confirms the public internal-review wording is absent and the new paver/flagstone/bag-label phrases, FAQ/schema, modified date, and smart-14 wording render.
- Final page agent judges now report `ready-for-human-approval` with 0 gaps for both Polymeric Sand pages; page scores are 100/100 and post-edit DataForSEO paid evidence passed.
- Deployed main commit `11bc45b` through Hostinger Node build `019e6255-3154-7081-84ca-21ec3c1e5d56`; live Ask, production sitemap, full GSC sitemap submission, live DOM proof, live browser screenshots, and post-deploy DataForSEO page evidence all passed.

## 2026-05-26 - Fuel Cost Tool And Guide Sprint Cleared And Deployed

- Reviewed `/tools/fuel-cost-calculator/` and `/blog/how-to-use-fuel-cost-calculator/` as the next GSC near-page-one page pair using current EPA, EIA, IRS, Google Search Central, competitor, and DataForSEO evidence.
- Updated the Fuel Cost tool with source SEO metadata, gas/trip/road-trip aliases, input explanations for one-way miles, MPG, pump price, and round trip, plus fuel-specific FAQs for live gas prices, real MPG, IRS mileage rates, tolls, parking, wear, and cost per mile.
- Expanded the matching guide with a 120-mile road trip walkthrough, 240 total miles, 8.57 gallons, $32.14 fuel-only cost, 13.4 cents per mile, real-MPG limits, and mileage-reimbursement separation.
- Repaired Fuel Cost tool and guide image alt/caption source data so the artwork describes a gas pump, route line, MPG gauge, gallons, trip cost, and cost-per-mile cards.
- Removed the shared "Start with the result card" template line after browser proof caught it on the exact Fuel Cost pages.
- Fresh built-browser proof confirms the public internal-review wording is absent and the new fuel-specific phrases, FAQ/schema, modified date, and smart-14 wording render.
- Final page agent judges now report `ready-for-human-approval` with 0 gaps for both Fuel Cost pages; page scores are 100/100 and post-edit DataForSEO paid evidence passed.
- Deployed main commit `5f7e202` through Hostinger Node build `019e626e-3ad3-72be-b6de-839dee0e72f2`; live Ask, production sitemap, full GSC sitemap submission, live DOM proof, live browser screenshots, and post-deploy DataForSEO page evidence all passed.

## 2026-05-26 - Matrix Tool And Guide Sprint Cleared And Deployed

- Reviewed `/tools/matrix-calculator/` and `/blog/how-to-use-matrix-calculator/` as the next high-impression GSC page pair using current OpenStax, Google Search Central, competitor, and DataForSEO evidence.
- Updated the Matrix tool with clearer 2x2/3x3 metadata, aliases, exact addition/multiplication/determinant examples, stronger FAQ depth, and calculator UI input tips that explain same-size add/subtract, row-by-column multiplication, and Matrix A-only modes.
- Rewrote the matching guide as `Matrix Calculator Guide` with specific 2x2 examples, multiplication-order cautions, determinant/transpose notes, source links, and page-specific intro text instead of free-tool boilerplate.
- Repaired Matrix tool and guide image alt/caption source data so the artwork describes the actual glowing matrix cells, 2x2/3x3 grids, row/column dots, and mascot pointing at the grid.
- Fresh Playwright browser proof confirms the public internal-review wording is absent and the new Matrix examples, FAQ/schema, modified date, and smart-14 wording render.
- Final page agent judges now report `ready-for-human-approval` with 0 gaps for both Matrix pages; page scores are 98/100 and 97/100, post-edit DataForSEO paid evidence passed, and `npm run check` passed.
- Deployed main commit `ecb0475` through Hostinger Node build `019e6283-dea2-7086-91bd-3df43f154e20`; live Ask retry, production sitemap, full GSC sitemap submission, live DOM proof, live browser screenshots, and post-deploy DataForSEO page evidence all passed.

## 2026-05-26 - Date Tool And Guide Sprint Cleared And Deployed

- Reviewed `/tools/date-calculator/` and `/blog/how-to-use-date-calculator/` as the next high-impression GSC page pair using current MDN, ISO, Google Search Central, competitor, and DataForSEO evidence.
- Updated the Date tool with days-between-dates metadata, aliases, exact 15-day, 45-day, and month-end-clamp examples, input explanations, and eight visible FAQs covering start-date counting, business days, holidays, month-end clamping, privacy, and limits.
- Rewrote the matching guide as `Date Calculator Guide` with specific calendar examples, YYYY-MM-DD input guidance, start-date counting, month-end clamping, and a clear "when this is not enough" section.
- Repaired Date tool and guide image alt/caption source data so the artwork describes the actual calendar grids, add/subtract controls, arrows, date blocks, and guide timeline.
- Fresh Playwright browser proof caught and removed the generic "dates, times, grades, dimensions" fallback instructions from the Date tool page; rebuilt proof confirms that generic copy is absent.
- Final page agent judges now report `ready-for-human-approval` with 0 gaps for both Date pages; page scores are 100/100 and 100/100, post-edit DataForSEO paid evidence passed, and `npm run check` passed.
- Deployed main commit `df3c191` through Hostinger Node build `019e629a-e2c5-71ab-aea9-8e1b775b47e6`; live Ask retry, production sitemap retry, full GSC sitemap submission, live DOM proof, live browser screenshots, and post-deploy DataForSEO page evidence all passed.

## 2026-05-26 - Target Heart Rate Tool And Guide Sprint Cleared And Deployed

- Reviewed `/tools/target-heart-rate-calculator/` and `/blog/how-to-use-target-heart-rate-calculator/` as the next GSC high-impression health page pair using current AHA, CDC, Mayo Clinic, Johns Hopkins, Calculator.net competitor, GSC, and DataForSEO evidence.
- Updated the Target Heart Rate tool with bpm-specific metadata, exact 93-157 bpm, 85-119 bpm, and 125-167 bpm heart-rate-reserve examples, target-specific instructions, and health/symptom/medication/pregnancy cautions.
- Expanded the matching guide around age, effort range, resting pulse, heart-rate reserve, perceived effort, and when not to chase a number.
- Repaired Target Heart Rate tool and guide image alt/caption source data so the artwork describes the actual gauge, zone bar, pulse line, water bottle, and running shoe.
- Fixed the SEO agent source extractors so health factory tools are scored with generated SEO titles, descriptions, and visible FAQs instead of false 0-FAQ warnings.
- Fresh Playwright browser proof confirms the public generic health instructions, placeholder `Target bpm range`, Mifflin-St Jeor source mismatch, and rough `showing estimate exercise` alt phrasing are absent.
- Final page agent judges now report `ready-for-human-approval` with 0 gaps for both Target Heart Rate pages; page scores are 100/100 and 100/100, post-edit DataForSEO paid evidence passed.
- Deployed main commit `d6c7637` through Hostinger Node build `019e62bb-26fd-714d-885b-f727eba99410`; live Ask, production sitemap, full GSC sitemap submission from the OAuth-enabled worktree, live DOM proof, live browser screenshots, and post-deploy DataForSEO page evidence all passed.

## 2026-05-26 - Area Tool And Guide Sprint Cleared For Deploy

- Reviewed `/tools/area-calculator/` and `/blog/how-to-use-area-calculator/` as the next high-impression GSC page pair using current OpenStax, NIST, Google Search Central, Inch Calculator competitor, GSC, and DataForSEO evidence.
- Updated the Area tool with shape-specific metadata, rectangle/triangle/circle/trapezoid examples, square-unit wording, radius/diameter and base/height FAQs, odd-shape splitting guidance, and specific Area instructions.
- Rewrote the matching guide around choosing the right flat shape, keeping square units straight, checking a 12 ft by 8 ft room, checking an 8/14/5 trapezoid bed, and using source links without generic SEO filler.
- Repaired Area tool and guide image alt/caption source data so the artwork describes the visible glowing rectangle and floating shape pieces instead of generic mascot/category text.
- Fresh Playwright browser proof confirms the public internal-review wording is absent and the new 96 ft^2, 55 ft^2, square-unit, OpenStax, NIST, and shape-specific guidance renders.
- Final page agent judges now report `ready-for-human-approval` with 0 gaps for both Area pages; page scores are 98/100 and 98/100, post-edit DataForSEO paid evidence passed, and `npm run check` passed.
- Commit, deploy, live proof, sitemap submission, and post-deploy DataForSEO are the remaining gates before the Area sprint can be called live.
