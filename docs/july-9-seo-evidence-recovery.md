# July 9 SEO Evidence Recovery Handoff

Updated: 2026-07-10

Use this note with `output/search-console/performance-latest.json` and `output/crawlscout/crawlscout-summary.json`. Do not treat older June blockers or stale `/sitemap/` notes as the active sprint.

## Current Evidence

- Google Search Console Performance export: 591 ranking URLs, 24,103 page impressions, 39 clicks, 0.16% page CTR.
- CrawlScout/deindexed sample: 138 not-indexed rows, 127 zero-click rows with impressions, 440 sampled impressions, 5 sampled clicks.
- Bing Webmaster overview: 1,996 impressions, 29 clicks, 1.45% CTR. This is useful trend evidence, not page-level decision evidence.
- Local technical proof is clean: production sitemap checked 651 URLs with 0 hard failures, XML sitemap excludes `/sitemap/`, and indexing protection has 0 high issues.
- SEO page review queue is complete: `npm run aft -- seo-tool-queue` reports 602 approved page review units and no active gate.

## What This Means

This is an index-selection and CTR recovery sprint, not a sitemap rewrite sprint. The next work should improve internal importance, page differentiation, snippets, and exact-page proof for selected URLs. Do not bulk-noindex guides, remove useful tools from sitemaps, restart old validation clicks, or rewrite sitemap architecture unless fresh evidence shows a current technical fault.

## Priority Pages

Index recovery pages with strong not-indexed signals:

- Tools: `color-contrast-checker`, `reading-level-checker`, `ai-token-cost-calculator`, `calories-burned-calculator`, `big-number-calculator`, `distance-calculator`, `device-battery-life-calculator`, `siding-calculator`, `brick-calculator`, `soil-calculator`.
- Guides and collections: `currency-calculator`, `love-calculator`, `mileage-calculator`, `concrete-calculator`, `deck-stain-calculator`, `lawn-mowing-calculator`, `markdown-table-generator`, `mean-median-mode-range-calculator`, `repayment-calculator`, `right-triangle-calculator`, `rmd-calculator`, `/gallery/converters/`.

Monitor-only exact inspection:

- `personal-loan-calculator` tool and guide were both fetched successfully and allowed for indexing, but Google reports `Crawled - currently not indexed`. The current tool and blog workbench judges both pass with zero gaps, so retain and monitor rather than rewriting from aggregate data alone.

CTR/ranking pages from the July 9 high-impression zero-click set:

- `interest-rate-calculator`, `sales-tax-calculator`, `ad-revenue-calculator`, `date-calculator`, `fraction-calculator`, `engine-horsepower-calculator`, `markup-calculator`, `area-calculator`, `matrix-calculator`, `golf-handicap-calculator`, `triangle-calculator`, `/blog/`, `gas-mileage-calculator`.

## Agent Rules

- Start with `npm run aft -- status`, `npm run aft -- indexing-gaps`, and the two imported July 9 reports.
- Use `node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>` for exact page-level claims.
- Use paid DataForSEO only for selected recovery or CTR pages where intent proof is missing.
- After meaningful source changes, deploy on Node 24, then run Search Console discovery and IndexNow.

## 2026-07-10 BMR CTR Sprint

- Exact Search Console page filtering found 182 impressions and 0 clicks for `/blog/how-to-use-bmr-calculator/` from 2026-05-01 through 2026-07-08, at average position 6.8.
- Four visible Mifflin-St Jeor formula-and-source queries accounted for 45 impressions at positions 2.0 to 8.0. Search Console withholds the remaining query text for privacy.
- The guide already had correct formulas, examples, and a PubMed source, but its generic title did not describe that intent and its generated meta description ended in a cut-off `BM...` fragment.
- The July 10 change gives the guide a concise Mifflin-St Jeor title and page-specific description, then moves the women/men formulas, units, original paper details, and PubMed link into an early visible section.
- Baseline evidence: `output/search-console/page-performance-bmr-guide-2026-07-10.json`. Compare the same fixed page and date-length window after Google recrawls; do not claim a CTR gain before new Search Console data exists.
