# GSC Performance Export Summary - 2026-05-26

Source export: `agents/serpforge-ai/evidence/gsc-performance-2026-05-26.zip`

Search Console filter file says:

- Search type: Web
- Date: Last 3 months

The zip contains the standard Search Console CSV files. The chart export contains dated rows from 2026-05-01 through 2026-05-23.

## Totals From Chart

- Clicks: 7
- Impressions: 9,991
- CTR: 0.07%
- Weighted average position: 44.54
- Query rows exported: 1,000
- Page rows exported: 438

## Read This Correctly

This is not mainly a crawl failure. Google is showing Access Free Tools pages, but most pages are too low in the results to earn clicks yet. The job is to improve the pages that already have impressions, not to make duplicate pages.

Google's own Search Console docs define CTR as clicks divided by impressions and average position as the topmost position for a property or page across the results where it appeared. Google also warns that Search Console performance data can be grouped and filtered in ways that change totals, so these export rows should be used as direction, not as a single final scoreboard.

Sources:

- https://support.google.com/webmasters/answer/7042828
- https://support.google.com/webmasters/answer/10268906
- https://developers.google.com/search/docs/fundamentals/creating-helpful-content
- https://developers.google.com/search/docs/crawling-indexing/links-crawlable

## Device Split

| device | clicks | impressions | CTR | position | read |
| --- | ---: | ---: | ---: | ---: | --- |
| Desktop | 2 | 8,472 | 0.02% | 47.35 | Biggest visibility bucket and the weakest CTR/rank mix. |
| Mobile | 5 | 1,495 | 0.33% | 29.09 | Fewer impressions, but better average position and CTR. |
| Tablet | 0 | 24 | 0% | 14.88 | Too small to prioritize. |

## Country Split

| country | clicks | impressions | CTR | position |
| --- | ---: | ---: | ---: | ---: |
| United States | 3 | 5,759 | 0.05% | 45.75 |
| United Kingdom | 0 | 1,072 | 0% | 56.10 |
| Canada | 0 | 605 | 0% | 56.45 |
| Australia | 2 | 264 | 0.76% | 46.22 |
| Vietnam | 0 | 222 | 0% | 28.67 |
| India | 0 | 146 | 0% | 29.44 |

## Highest-Impression Pages

| page | clicks | impressions | CTR | position | first agent move |
| --- | ---: | ---: | ---: | ---: | --- |
| `/tools/interest-rate-calculator/` | 0 | 915 | 0% | 62.76 | P0 page sprint. Missing source `seoDescription`, 0 FAQs, workbench blocked. |
| `/blog/how-to-use-markup-calculator/` | 0 | 591 | 0% | 72.95 | Review query fit and guide/tool differentiation. |
| `/tools/matrix-calculator/` | 0 | 421 | 0% | 43.63 | Review title, examples, and guide links. |
| `/tools/date-calculator/` | 0 | 263 | 0% | 22.58 | Nearer to useful rank; check snippet and intent match. |
| `/tools/target-heart-rate-calculator/` | 0 | 256 | 0% | 54.91 | YMYL health trust and FAQ review. |
| `/tools/area-calculator/` | 0 | 254 | 0% | 55.27 | Formula/example differentiation review. |
| `/tools/fraction-calculator/` | 0 | 239 | 0% | 50.13 | School-study examples and internal route review. |
| `/tools/sales-tax-calculator/` | 0 | 234 | 0% | 37.84 | Tax trust limits and state/use-case examples. |
| `/tools/flooring-calculator/` | 0 | 209 | 0% | 64.33 | Home-project example depth and related links. |
| `/tools/oven-temperature-converter/` | 0 | 202 | 0% | 64.50 | Converter title/meta and example review. |

## Near-Page-One Opportunities

These have average position 8 to 12 and at least 5 impressions. They are better quick-win candidates than position-60 pages because Google is already testing them near page one.

| page | clicks | impressions | CTR | position |
| --- | ---: | ---: | ---: | ---: |
| `/blog/how-to-use-fuel-cost-calculator/` | 0 | 6 | 0% | 8.00 |
| `/free-calculator-resources/` | 0 | 7 | 0% | 8.29 |
| `/blog/how-to-use-heat-index-calculator/` | 0 | 21 | 0% | 8.33 |
| `/tools/payback-period-calculator/` | 0 | 15 | 0% | 8.33 |
| `/blog/how-to-use-insulation-calculator/` | 0 | 20 | 0% | 8.95 |
| `/blog/how-to-use-polymeric-sand-calculator/` | 0 | 23 | 0% | 9.04 |
| `/blog/how-to-use-half-life-calculator/` | 0 | 28 | 0% | 9.11 |
| `/tools/gas-mileage-calculator/` | 0 | 99 | 0% | 9.28 |
| `/tools/half-life-calculator/` | 0 | 31 | 0% | 9.29 |
| `/tools/character-counter/` | 0 | 38 | 0% | 9.32 |

## Legacy URL Signals

Old URLs still appear in the export. They should stay as redirect/indexing watch tasks, not be rebuilt as duplicate pages.

| URL | clicks | impressions | position | action |
| --- | ---: | ---: | ---: | --- |
| `/maximize-your-revenue-the-ultimate-free-google-adsense-earnings-calculator-for-2025` | 1 | 9 | 13.33 | Keep 301 target to `/tools/ad-revenue-calculator/` verified. |
| `/advanced-age-calculator` | 1 | 6 | 12.67 | Keep 301 target to `/tools/age-calculator/` verified. |
| `/calculators` | 0 | 13 | 29.38 | Keep 301 target to `/categories/calculators/` verified. |
| `/deep-research` | 0 | 8 | 10.25 | Keep 301 target to `/categories/ai-tools/` verified. |

## Interest Rate Calculator Proof

The GSC export makes this the first P0 page sprint:

- GSC: 915 impressions, 0 clicks, average position 62.76.
- `node scripts/seo-agent-workbench.mjs all interest-rate-calculator tool`: blocked.
- Workbench gaps: DataForSEO keyword intent, competitor gap, on-page score, internal links, FAQ/schema, browser proof.
- `npm run aft -- seo-page-score interest-rate-calculator tool`: fail, score 81.
- Page score issue: source record is missing `seoDescription`.
- Page score warning: source record has 0 FAQs; new tool standard expects six or more useful FAQs.
- `npm run serpforge -- paid-audit-sprint interest-rate-calculator tool`: pass, DataForSEO gates ok.

## Next Action

Create and run a single P0 page sprint for `/tools/interest-rate-calculator/` before broad edits. The sprint should add useful FAQs, source `seoDescription`, stronger finance-specific title/meta candidates, better contextual links, fresh browser proof, and a final judge rerun. Keep the tone simple and useful, like a smart 14-year-old explaining loans and rates without pretending to be a financial adviser.

## Separate Coverage Proof Needed

`npm run aft -- seo-console` still asks for URL examples for 3 Google 5xx pages and 1 404 sample. This performance export does not contain those coverage samples. The Crawl And Indexation Agent should request or import a Page Indexing/Coverage export with URL examples before assigning any exact 5xx or 404 fixes.
