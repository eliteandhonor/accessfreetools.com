# July SEO Evidence Recovery Handoff

Updated: 2026-07-12

Use this note with `output/search-console/performance-latest.json` and `output/crawlscout/crawlscout-summary.json`. Do not treat older June blockers or stale `/sitemap/` notes as the active sprint.

## Current Evidence

- Google Search Console Performance export through 2026-07-09: 593 ranking URLs, 24,662 page impressions, 41 clicks, 0.17% page CTR.
- CrawlScout/deindexed sample: 137 not-indexed rows, 127 zero-click rows with impressions, 366 sampled impressions, 4 sampled clicks.
- Bing Webmaster overview through 2026-07-09: 2,097 impressions, 32 clicks, 1.53% CTR. This is useful aggregate trend evidence, not Google or page-level decision evidence.
- Since the July 9 export, Google added 559 page impressions and 2 clicks, Bing added 101 impressions and 3 clicks, and the CrawlScout sample fell by one URL. These are small positive movements, not proof that a specific recovery edit caused the change.
- Local technical proof is clean: production sitemap checked 652 URLs with 0 hard failures, `/sitemap/` is live and noindexed but excluded from XML, and indexing protection has 0 high issues.
- SEO page review queue is complete: `npm run aft -- seo-tool-queue` reports 602 approved page review units and no active gate.

## What This Means

This is an index-selection and CTR recovery sprint, not a sitemap rewrite sprint. The next work should improve internal importance, page differentiation, snippets, and exact-page proof for selected URLs. Do not bulk-noindex guides, remove useful tools from sitemaps, restart old validation clicks, or rewrite sitemap architecture unless fresh evidence shows a current technical fault.

## Priority Pages

Index recovery pages with strong not-indexed signals:

- Tools: `color-contrast-checker`, `reading-level-checker`, `ai-token-cost-calculator`, `calories-burned-calculator`, `big-number-calculator`, `distance-calculator`, `device-battery-life-calculator`, `siding-calculator`, `brick-calculator`, `soil-calculator`.
- Guides and collections: `currency-calculator`, `love-calculator`, `mileage-calculator`, `concrete-calculator`, `deck-stain-calculator`, `lawn-mowing-calculator`, `markdown-table-generator`, `mean-median-mode-range-calculator`, `repayment-calculator`, `right-triangle-calculator`, `rmd-calculator`, `/gallery/converters/`.

The July 12 export still contains pages repaired after Google last crawled them. Do not reopen `color-contrast-checker`, `reading-level-checker`, `ai-token-cost-calculator`, `calories-burned-calculator`, `big-number-calculator`, `distance-calculator`, `device-battery-life-calculator`, `siding-calculator`, `brick-calculator`, `soil-calculator`, `gas-mileage-calculator`, or `currency-calculator` from this aggregate snapshot alone. Preserve their release proof and wait for a fresh crawl.

Monitor-only exact inspection:

- `personal-loan-calculator` tool and guide were both fetched successfully and allowed for indexing, but Google reports `Crawled - currently not indexed`. The current tool and blog workbench judges both pass with zero gaps, so retain and monitor rather than rewriting from aggregate data alone.
- `gas-mileage-calculator` has 315 impressions, 0 clicks, and average position 9.36, but Google last crawled the tool on May 9 and the guide on May 11, before their July 3 updates. Submit discovery and wait for recrawl rather than rewriting the newer pages from stale Google evidence.
- `mileage-calculator` has 248 impressions, 0 clicks, and average position 17.28. Google last crawled the tool on April 30 and the guide on May 12, before their May 31 updates. Keep the current pages, correct only proven linking mistakes, and wait for recrawl.

CTR/ranking pages from the July 9 high-impression zero-click set:

- `interest-rate-calculator`, `sales-tax-calculator`, `ad-revenue-calculator`, `date-calculator`, `fraction-calculator`, `engine-horsepower-calculator`, `markup-calculator`, `area-calculator`, `matrix-calculator`, `golf-handicap-calculator`, `triangle-calculator`, `/blog/`, `gas-mileage-calculator`.

## Agent Rules

- Start with `npm run aft -- status`, `npm run aft -- indexing-gaps`, and the refreshed July 12 reports.
- Use `node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>` for exact page-level claims.
- Use paid DataForSEO only for selected recovery or CTR pages where intent proof is missing.
- After meaningful source changes, deploy on Node 24, then run Search Console discovery and IndexNow.

## 2026-07-10 BMR CTR Sprint

- Exact Search Console page filtering found 182 impressions and 0 clicks for `/blog/how-to-use-bmr-calculator/` from 2026-05-01 through 2026-07-08, at average position 6.8.
- Four visible Mifflin-St Jeor formula-and-source queries accounted for 45 impressions at positions 2.0 to 8.0. Search Console withholds the remaining query text for privacy.
- The guide already had correct formulas, examples, and a PubMed source, but its generic title did not describe that intent and its generated meta description ended in a cut-off `BM...` fragment.
- The July 10 change gives the guide a concise Mifflin-St Jeor title and page-specific description, then moves the women/men formulas, units, original paper details, and PubMed link into an early visible section.
- Baseline evidence: `output/search-console/page-performance-bmr-guide-2026-07-10.json`. Compare the same fixed page and date-length window after Google recrawls; do not claim a CTR gain before new Search Console data exists.

## 2026-07-10 Date Calculator Intent Sprint

- Exact Search Console page filtering found 720 impressions and 0 clicks for `/tools/date-calculator/` from 2026-05-01 through 2026-07-08, at average position 22.6.
- Ten visible 90-days-before-or-after queries accounted for 80 impressions. Those queries ranked from position 5.7 to 10.6, while Google withheld the remaining query text for privacy.
- The tool already performed correct date shifts, but its title emphasized only days between dates. The refresh focuses the tool title on add-or-subtract intent and adds verified 90-day examples, FAQs, aliases, and a matching educational guide section.
- Baseline evidence: `output/search-console/page-performance-date-calculator-tool-2026-07-10.json`. Compare the same fixed page and date-length window after Google recrawls; do not claim a CTR gain before new Search Console data exists.

## 2026-07-10 VA Mortgage Guide Recovery Sprint

- Exact Search Console page filtering found 295 impressions and 0 clicks for `/blog/how-to-use-va-mortgage-calculator/` from 2026-05-01 through 2026-07-08, at average position 35.3.
- Two visible how-to-use-effectively query variants accounted for 43 impressions at positions 13.1 and 18.3. The wider visible query set consistently asks how a VA loan calculator or estimator works.
- Google URL Inspection returned `Crawled - currently not indexed` with a successful fetch. This is classified as `recover`: the URL, canonical, crawl path, and sources remain valid, but the generic finance-guide opening and cut-off description did not make its VA-specific value clear enough.
- The recovery adds a complete description, VA-specific opening and workflow, a current funding-fee chart checkpoint, an affordability boundary, official VA/CFPB comparison steps, and a contextual link from `/free-calculator-resources/`.
- Baseline evidence: `output/search-console/page-performance-va-mortgage-guide-2026-07-10.json` and `output/search-console/url-inspection-va-guide-baseline-2026-07-10.json`. Wait for a new Google crawl before judging the recovery; do not claim indexation or traffic gains from the source change alone.

## 2026-07-10 Color Contrast Checker Recovery Sprint

- Exact Search Console page filtering found 22 impressions and 0 clicks for `/tools/color-contrast-checker/` from 2026-05-01 through 2026-07-08, at average position 3.6. Query text was withheld for privacy.
- Current Google URL Inspection reports `Crawled - currently not indexed` with a successful fetch. June inspection evidence had reported the same URL as submitted and indexed, so this is a current index-selection loss rather than a blocked crawl or a never-discovered page.
- The page still passes its 98-point local SEO score, 100 internal-link score, WCAG formula checks, sitemap checks, and specialist judge. This is classified as `recover` through stronger product value instead of adding more generic text.
- The recovery adds compact native color swatches, a deterministic nearby AA normal-text suggestion for failed pairs, a visible #777777 to #767676 repair example, WCAG 2.2 wording, and official W3C non-text contrast guidance.
- Baseline evidence: `output/search-console/page-performance-color-contrast-checker-tool-2026-07-10.json` and `output/search-console/url-inspection-color-contrast-checker-baseline-2026-07-10.json`. Wait for Google to recrawl before judging indexation or traffic movement.

## 2026-07-10 Reading Level Checker Recovery Sprint

- Exact Search Console filtering found 10 impressions, 1 click, and average position 4.5 for `/tools/reading-level-checker/` from 2026-05-01 through 2026-07-08. The matching guide had 2 impressions, 0 clicks, and average position 3.5. Query text was withheld for privacy.
- Google URL Inspection reports `Crawled - currently not indexed` with a successful fetch for both URLs. The tool and guide remain canonical, useful, and distinct, so both are classified as `recover` rather than merge or noindex.
- The earlier page passed local scores but stopped at grade, ease, and counts. The recovery adds a tested English readability helper, longest-sentence preview, sentences-over-20 count, long-word share, a deterministic revision checklist, exact formula steps, and clearer limits for names, numbers, abbreviations, mixed languages, and accessibility claims.
- The tool and guide now cite current W3C reading-level guidance and the CDC plain-language checklist. The 20-word signal is presented as a review checkpoint, not an automatic failure.
- Baseline evidence: `output/search-console/page-performance-reading-level-checker-tool-2026-07-10.json`, `output/search-console/page-performance-reading-level-checker-guide-2026-07-10.json`, and `output/search-console/url-inspection-reading-level-checker-baseline-2026-07-10.json`. Wait for a new Google crawl before judging recovery.

## 2026-07-10 AI Token Cost Calculator Recovery Sprint

- Exact Search Console filtering found 37 impressions, 0 clicks, and average position 7.2 for `/tools/ai-token-cost-calculator/` from 2026-05-01 through 2026-07-08. The matching guide had 17 impressions, 0 clicks, and average position 10.8. Query text was withheld for privacy.
- Google URL Inspection reports `Crawled - currently not indexed` with a successful fetch for both URLs. June proof recorded both URLs as indexed, so this is a current index-selection loss rather than a crawl or discovery failure.
- Current official OpenAI, Anthropic, and Google documentation separates standard input, cached input, and output billing. The earlier page explained cached pricing but could not calculate it, while current competing calculators increasingly expose cache assumptions.
- The recovery keeps prices user-entered and adds tested, backward-compatible cached-input math across the browser tool and public API: cached input is a subset of total input, uncached/cached/output costs are separate, invalid cache totals are refused, and results include cache-rate difference, per-1,000-request cost, and a $100 request runway.
- Baseline evidence: `output/search-console/page-performance-ai-token-cost-calculator-tool-2026-07-10.json`, `output/search-console/page-performance-ai-token-cost-calculator-guide-2026-07-10.json`, and `output/search-console/url-inspection-ai-token-cost-calculator-baseline-2026-07-10.json`. Wait for a new Google crawl before judging recovery; do not claim indexing or CTR gains from the release alone.

## 2026-07-10 Calories Burned Calculator Recovery Sprint

- Exact Search Console filtering found 16 impressions, 0 clicks, and average position 6.2 for `/tools/calories-burned-calculator/` from 2026-05-01 through 2026-07-08. The matching guide had 73 impressions, 0 clicks, and average position 43.1. CrawlScout reports the tool Not Indexed after July 5.
- Google URL Inspection reports `Crawled - currently not indexed` with a successful fetch for the tool, while the guide is `Submitted and indexed`. This is a tool recovery and differentiation task, not a reason to merge or noindex the indexed guide.
- The old picker mislabeled 3.8 MET as brisk walking and offered only six fixed activities in kilograms. The 2024 Adult Compendium uses 3.8 MET for moderate level walking at 2.8-3.4 mph and 4.8 MET for brisk level walking at 3.5-3.9 mph. The old guide also cited the unrelated Mifflin-St Jeor resting-energy study.
- The recovery adds 20 current Adult Compendium activities, kilograms or pounds, a custom-MET mode, total session and active-above-rest calories, CDC intensity bands, exact formula examples, and source-specific Compendium/CDC citations. The original `calculateCaloriesBurned` helper remains available for existing callers.
- Baseline evidence: `output/search-console/page-performance-calories-burned-calculator-tool-2026-07-10.json`, `output/search-console/page-performance-calories-burned-calculator-guide-2026-07-10.json`, and `output/search-console/url-inspection-calories-burned-calculator-baseline-2026-07-10.json`. Wait for a new Google crawl before judging indexation or CTR movement.

## 2026-07-10 Big Number Calculator Recovery Sprint

- Exact Search Console filtering found 50 impressions, 2 clicks, and average position 13.8 for `/tools/big-number-calculator/` from 2026-05-01 through 2026-07-08. The matching guide had 211 impressions, 0 clicks, and average position 31.7, with visible queries clustered around big number and big integer calculator terms.
- Google URL Inspection reports `Crawled - currently not indexed` with a successful fetch for the tool, while the guide is `Submitted and indexed`. The pair is classified as differentiate: keep the exact calculator query on the tool and move the guide toward BigInt precision, safe-integer, and division-rule intent.
- The existing calculator already handled exact BigInt arithmetic well. The recovery adds raw ungrouped copying for code, left/right digit counts, a quotient/remainder identity check, and the documented BigInt rule for negative division: truncate toward zero and keep the dividend sign on the remainder.
- The guide title and opening now explain why ordinary JavaScript numbers can round beyond `9,007,199,254,740,991`. MDN and the living ECMAScript specification support the safe-integer, division, and remainder claims.
- Baseline evidence: `output/search-console/page-performance-big-number-calculator-tool-2026-07-10.json`, `output/search-console/page-performance-big-number-calculator-guide-2026-07-10.json`, and `output/search-console/url-inspection-big-number-calculator-baseline-2026-07-10.json`. Wait for a new Google crawl before judging the intent split or indexation movement.

## 2026-07-10 Distance Calculator Recovery Sprint

- Exact Search Console filtering found 34 impressions, 0 clicks, and average position 11.6 for `/tools/distance-calculator/` from 2026-05-01 through 2026-07-08. The matching guide had 13 impressions, 0 clicks, and average position 8.5; query rows were privacy-suppressed.
- Google URL Inspection reports `Crawled - currently not indexed` with a successful fetch for the tool, while the guide is `Submitted and indexed`. The same tool passed inspection after its June 27 rebuild, so the July state is an index-selection recovery issue, not a crawl, robots, canonical, or sitemap failure.
- Targeted DataForSEO evidence shows the broad `distance calculator` phrase is dominated by map, driving, walking, and running intent. The pair is classified as differentiate: target `distance between two points` on the 2D tool and use the indexed guide for distance-formula instruction.
- The recovery exposes distance squared and the full square-and-add substitution in the result, adds a non-perfect-square `sqrt(34)` example, leads metadata with the exact coordinate intent, and retitles the guide `Distance Formula Between Two Points`. It does not claim road, route, GPS, latitude/longitude, or 3D support.
- Baseline evidence: `output/search-console/page-performance-distance-calculator-tool-2026-07-10.json`, `output/search-console/page-performance-distance-calculator-guide-2026-07-10.json`, and `output/search-console/url-inspection-distance-calculator-baseline-2026-07-10.json`. Wait for a new Google crawl before judging indexation or CTR movement.

## 2026-07-10 Device Battery Life Calculator Recovery Sprint

- Exact Search Console filtering found 14 impressions, 0 clicks, and average position 11.4 for `/tools/device-battery-life-calculator/` from 2026-05-01 through 2026-07-08. The matching guide had 4 impressions, 0 clicks, and average position 7.0; query rows were privacy-suppressed.
- Google URL Inspection reports `Crawled - currently not indexed` with a successful fetch for both URLs. CrawlScout also reports the tool Not Indexed after June 29, so this is a page-value and intent recovery task rather than a crawl, canonical, robots, or sitemap repair.
- Current search results commonly answer battery-life intent with battery capacity in mAh divided by average load current in mA. The earlier page only converted mAh and voltage into watt-hours before dividing by watts, leaving that common task unsupported.
- The recovery adds tested Load current (mA) and Power draw (W) modes, usable-capacity output, hours and days, duty-cycle guidance, six examples, and a guide that explains when each formula is valid. Texas Instruments guidance supports the limits around average current, usable capacity, load, temperature, discharge behavior, and cutoff conditions.
- Baseline evidence: `output/search-console/page-performance-device-battery-life-calculator-tool-2026-07-10.json`, `output/search-console/page-performance-device-battery-life-calculator-guide-2026-07-10.json`, and `output/search-console/url-inspection-device-battery-life-calculator-baseline-2026-07-10.json`. Wait for a new Google crawl before judging indexation or traffic movement.

## 2026-07-10 Siding Calculator Recovery Sprint

- Exact Search Console filtering found 9 impressions, 0 clicks, and average position 11.9 for `/tools/siding-calculator/` from 2026-05-01 through 2026-07-08. The matching guide had 7 impressions, 0 clicks, and average position 13.7; query rows were privacy-suppressed.
- Google URL Inspection reports `Crawled - currently not indexed` with a successful fetch for both URLs. CrawlScout reports the same tool state after June 29, so this is classified as `recover/differentiate`, not a crawl, robots, canonical, or sitemap repair.
- Targeted DataForSEO evidence still shows 8,100 U.S. searches for `siding calculator`, 4,400 for `vinyl siding calculator`, and 1,600 for `hardie siding calculator`. The earlier copy promised exact siding squares and boxes, but the calculator only returned rounded squares and had no gable-area or box-coverage input.
- The recovery adds tested gable area, exact and rounded siding squares, package coverage, and whole-box results. The guide now owns the measuring-method intent and explains why the Polymeric Exterior Products Association and Lowe's worksheets handle ordinary opening deductions differently.
- Baseline evidence: `output/search-console/page-performance-siding-calculator-tool-2026-07-10.json`, `output/search-console/page-performance-siding-calculator-guide-2026-07-10.json`, and `output/search-console/url-inspection-siding-calculator-baseline-2026-07-10.json`. Wait for a new Google crawl before judging indexation or traffic movement.

## 2026-07-10 Brick Calculator Recovery Sprint

- Exact Search Console filtering found 10 impressions, 0 clicks, and average position 11.5 for `/tools/brick-calculator/` from 2026-05-01 through 2026-07-08. The matching guide had 33 impressions, 0 clicks, and average position 39.2, including visible brick formula, square-foot coverage, wall calculation, and mortar-related queries.
- Google URL Inspection reports the tool as `Crawled - currently not indexed` with a successful fetch, while the guide remains `Submitted and indexed`. The pair is classified as differentiate: recover the calculator around wall-estimating intent and preserve the indexed guide for formula and method questions.
- Targeted DataForSEO evidence shows 8,100 U.S. searches for `brick calculator` and 880 for `brick calculator for wall`. The earlier tool required a precomputed wall area and could not use supplier or Brick Industry Association coverage tables.
- The recovery adds tested Wall dimensions, Known area, and Coverage table modes, explicit opening deductions, base and waste-adjusted counts, bricks-per-square-foot output, and a guide that explains why dimension math and product tables can differ. Mortar quantities remain separate because BIA guidance varies by unit, joint, bedding, hollow brick, collar joints, and correction factors.
- Baseline evidence: `output/search-console/page-performance-brick-calculator-tool-2026-07-10.json`, `output/search-console/page-performance-brick-calculator-guide-2026-07-10.json`, and `output/search-console/url-inspection-brick-calculator-baseline-2026-07-10.json`. Wait for a new Google crawl before judging indexation or traffic movement.

## 2026-07-12 Soil Calculator Recovery Sprint

- Exact Search Console filtering found 17 impressions, 0 clicks, and average position 5.24 for `/tools/soil-calculator/` from 2026-05-01 through 2026-07-09. The matching guide had 3 impressions, 0 clicks, and average position 7.33. Query rows were privacy-suppressed.
- Google URL Inspection reports `Crawled - currently not indexed` with a successful fetch for both URLs. CrawlScout also reports the tool Not Indexed after July 11, so the pair is classified as differentiate and recover rather than a crawl, robots, canonical, or sitemap repair.
- Targeted DataForSEO evidence shows 27,100 U.S. searches for `soil calculator`, 6,600 for `soil calculator raised bed`, and 2,900 for `potting soil calculator`. The earlier calculator required users to precompute bed area and returned only fixed 1.5- and 2-cubic-foot bag counts.
- The recovery adds rectangular-bed, round-bed, and known-area modes; a number-of-beds input; exact bag-label volume; cubic yards, cubic feet, litres, total area, and whole-bag output; and a measurement-focused guide backed by Illinois, Oregon State, and University of Georgia Extension sources.
- Baseline evidence: `output/search-console/page-performance-soil-calculator-tool-2026-07-12.json`, `output/search-console/page-performance-soil-calculator-guide-2026-07-12.json`, and `output/search-console/url-inspection-soil-calculator-baseline-2026-07-12.json`. Wait for a new Google crawl before judging indexation or traffic movement.

## 2026-07-12 Engine Horsepower Query-Recovery Sprint

- Exact Search Console filtering found 628 impressions, 0 clicks, and average position 42.38 for `/tools/engine-horsepower-calculator/` from 2026-05-01 through 2026-07-09. Google reports the page submitted and indexed, with a successful mobile crawl on 2026-07-02 after the prior source modification date.
- Visible queries include `horsepower calculator`, `engine horsepower calculator`, `wheel horsepower calculator`, `hp to whp calculator`, `drivetrain loss calculator`, `rpm to horsepower`, `horsepower to rpm`, and the misleading `300 horsepower to km h` query. This is current-page query evidence, not a stale recrawl case.
- Targeted DataForSEO evidence found 210 U.S. monthly searches for `whp to hp calculator`, 170 for `wheel horsepower calculator`, and 90 for `crank to wheel hp calculator`, all with reported keyword difficulty 0. The paid research cost for the page audits and exact supporting requests was $0.08724, including one rejected multi-task attempt that charged only the first valid task.
- The recovery adds Find HP, Find torque, Find RPM, and Engine / wheel modes; lb-ft and N m support; bidirectional crank/WHP math; visible loss assumptions; and primary-source guide sections explaining why horsepower cannot convert directly to km/h or predict an engine build from parts.
- Baseline evidence: `output/search-console/candidate-engine-horsepower-tool-2026-07-12.json`, `output/search-console/url-inspection-high-impression-candidates-2026-07-12.json`, and `output/dataforseo/engine-horsepower-intent-2026-07-12.json`. Judge movement only after Google recrawls the released page.

## 2026-07-12 Fraction Calculator Query-Recovery Sprint

- Exact Search Console evidence found 662 impressions, 0 clicks, and average position 54.44 for `/tools/fraction-calculator/` from 2026-05-01 through 2026-07-09. Google reports the URL submitted and indexed, with a successful mobile crawl on 2026-06-22 after the prior May 26 update.
- The strongest visible query is `fraction calculator` with 187 impressions. Smaller rows include `fractions calculator`, arithmetic questions, `fraction calculator with steps`, `simplest form`, negative fractions, conversion, and mixed-number wording.
- Targeted DataForSEO evidence reports 368,000 U.S. monthly searches for `fraction calculator`, 18,100 for `mixed fraction calculator`, 9,900 for `decimal to fraction calculator`, and 8,100 for `fraction calculator simplify`. The two related-keyword page audits cost $0.02616 total, and the exact live SERP request cost $0.002.
- The recovery adds Arithmetic, Simplify / convert, and Compare modes; exact text parsing for fractions, mixed numbers, whole numbers, and terminating decimals; LCD steps; percentages and equivalent fractions; cross-product comparison; and a rebuilt guide with OpenStax method sources.
- Baseline evidence: `output/search-console/candidate-fraction-tool-2026-07-12.json`, `output/search-console/url-inspection-high-impression-candidates-2026-07-12.json`, and `output/seo-tool-review/fraction-calculator/tool/dataforseo-paid.json`. Judge movement only after Google recrawls the released page.

## 2026-07-12 Markup Calculator Query-Recovery Sprint

- Exact Search Console evidence found 600 impressions, 0 clicks, and average position 72.05 for `/blog/how-to-use-markup-calculator/` from 2026-05-01 through 2026-07-09. Visible queries include `calculate markup`, `calculate a markup`, `calculate markup and margin`, `calculate margin from markup`, `30 margin to markup`, and `business markup formula`.
- Google reports the guide submitted and indexed, with a successful mobile crawl on 2026-07-09. The current generic guide title, meta description cut off mid-word, and cost-plus-only calculator were therefore current-page gaps, not stale crawl evidence.
- Targeted DataForSEO evidence reports 18,100 U.S. monthly searches for `markup calculator`, 1,600 for `how to calculate markup`, 1,300 for `margin markup calculator`, 320 for `how to calculate selling price using markup percentage`, and 140 for `reverse markup calculator`. The two related-keyword audits cost $0.02616 total.
- The recovery adds tested From markup, From margin, and Check price modes. It calculates selling price from markup or target margin, checks markup and margin from a known cost and price, reports below-cost losses honestly, and rebuilds the guide around the three distinct workflows.
- Baseline evidence: `output/search-console/candidate-markup-guide-2026-07-12.json`, `output/search-console/url-inspection-next-opportunities-2026-07-12.json`, and `output/seo-tool-review/markup-calculator/blog/dataforseo-paid.json`. Judge movement only after Google recrawls the released tool and guide.
