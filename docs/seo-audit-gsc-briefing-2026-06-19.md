# SEO Audit And GSC Briefing - 2026-06-19

Agent-facing note for SEO, indexing, internal-link, archive, and page-review work. This is internal context, not public copy.

## Sources

- PDF audit supplied by the owner: `C:\Users\chamb\Downloads\Access Free Tools SEO Audit.pdf`
- Extracted PDF text: `output/external-audits/2026-06-18-gsc-audit/access-free-tools-seo-audit-extracted.txt`
- Google Search Console export supplied by the owner: `C:\Users\chamb\Downloads\https___accessfreetools.com_-Performance-on-Search-2026-06-18.zip`
- Full generated analysis: `output/external-audits/2026-06-18-gsc-audit/analysis.md`
- Machine summary and extracts: `output/external-audits/2026-06-18-gsc-audit/gsc-analysis.json`
- Newer enterprise SEO audit supplied by the owner: `C:\Users\chamb\Downloads\AccessFreeTools_Enterprise_SEO_Audit_Report.pdf`
- Enterprise audit agent briefing: `docs/enterprise-seo-audit-agent-briefing-2026-06-19.md`
- Enterprise audit extracted text: `output/pdf/AccessFreeTools_Enterprise_SEO_Audit_Report-extracted.txt`

## Newer Enterprise Audit Addendum

- The newer 73-page enterprise audit is now summarized for agents in `docs/enterprise-seo-audit-agent-briefing-2026-06-19.md`.
- It reports one critical crawler-access concern around hCDN, plus high-priority EEAT/schema/date/programmatic recommendations.
- Current live bot-style probes from this repo did not reproduce the reported hCDN 403; Googlebot, Bingbot, and DuckDuckBot style requests returned HTTP 200 and real page HTML. Treat the hCDN item as a verify-first P0, not as proof to change hosting/WAF rules blindly.
- Some report findings are already stale against current live/repo state, including `/tools/` missing metadata/schema. Use repo commands and fresh production checks as authoritative before acting.
- Completion update from 2026-07-02: the controlled generated tool/blog review lane is complete with 598 approved page review units, 0 remaining, and no active approval gate. The earlier `text-case-converter` blog blocker is historical only. Use `docs/seo-tool-review-queue.md`, `npm run aft -- seo-tool-queue`, and `npm run aft -- proof-check` as the current source of truth.

## GSC Snapshot

- Scope: Web search, Last 3 months export.
- Actual chart range: 2026-05-01 through 2026-06-16.
- Totals: 29 clicks, 18,705 impressions, 0.155% CTR, weighted average position 36.41.
- Export size: 1,000 queries, 572 pages, 164 countries, 3 devices.
- Main read: Access Free Tools has real visibility, but it is still in the early visibility-to-click phase. The next gains should come from cleaner snippets, stronger titles, crawlable discovery paths, and internal links into pages already getting impressions.

## PDF Audit Priorities

1. Reconcile inventory counts from the data layer. The audit found 303 public tool URLs / 299 canonical tools, but category counts disagree across templates, including Calculators 60 vs 61, Finance 84 vs 85, and Developer Tools 16 vs 17.
2. Remove snippet pollution. Repetitive UI text, theme controls, stray symbols, utility labels, and long artwork descriptions should not compete with main content in Google snippets. Use `data-nosnippet` surgically on repetitive chrome and decorative/helper text.
3. Normalize title and meta-description generation. The audit found mixed title patterns such as `| Access Free Tools`, `- Access Free Tools`, and category-in-the-middle variants. Prefer one deterministic SEO metadata factory.
4. Make archives crawlable with plain links. `/tools/` currently exposes only the first 96 of 303 tools before interactive controls. Build crawlable pagination or linked archive pages for `/tools/`, `/blog/`, and oversized categories.
5. Fix template QA drift. The audit specifically called out visible text like `All developer tools tools` and guide-title naming inconsistency.
6. Tighten image metadata. Keep alt text useful and concise, reduce visible caption bloat, keep high-quality `og:image`, and preserve image sitemap coverage.

## GSC Opportunities

- `/tools/` is already important: 3 clicks, 581 impressions, 0.52% CTR, average position 13.84. Treat the master archive as a high-priority SEO surface.
- Tool pages carry most visibility: 248 exported tool-page URLs produced 12,632 impressions but only 15 clicks.
- Blog guides are also visible: 277 guide URLs produced 5,506 impressions but only 6 clicks.
- Desktop has the most impressions, but weak CTR: 14,464 impressions, 14 clicks, 0.10% CTR. Mobile has 4,141 impressions, 15 clicks, 0.36% CTR.
- The United States is the largest exposure market: 11,833 impressions, 10 clicks, 0.08% CTR.

Near-page-one zero-click pages to protect and improve:

- `https://accessfreetools.com/tools/gas-mileage-calculator/` - 308 impressions, position 9.36
- `https://accessfreetools.com/tools/mileage-calculator/` - 222 impressions, position 17.36
- `https://accessfreetools.com/blog/how-to-use-bmr-calculator/` - 163 impressions, position 6.65
- `https://accessfreetools.com/blog/how-to-use-half-life-calculator/` - 119 impressions, position 9.89
- `https://accessfreetools.com/tools/wire-resistance-calculator/` - 115 impressions, position 12.51
- `https://accessfreetools.com/tools/character-counter/` - 108 impressions, position 8.77
- `https://accessfreetools.com/tools/long-division-calculator/` - 103 impressions, position 12.17

High-impression mid-rank pages needing stronger intent match and links:

- `https://accessfreetools.com/tools/sales-tax-calculator/` - 965 impressions, position 26.92
- `https://accessfreetools.com/tools/date-calculator/` - 717 impressions, position 22.69
- `https://accessfreetools.com/tools/ad-revenue-calculator/` - 629 impressions, position 48.87
- `https://accessfreetools.com/tools/matrix-calculator/` - 475 impressions, position 42.89
- `https://accessfreetools.com/tools/fraction-calculator/` - 437 impressions, position 51.89
- `https://accessfreetools.com/tools/triangle-calculator/` - 381 impressions, position 29.83

## Instructions For SEO Agents

- Continue using `node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>` for controlled page-review work.
- Do not mark a page approved from scores alone. Keep using browser proof, Search Console inspection, DataForSEO evidence, local checks, and tracker evidence.
- When reviewing any page, check whether the issue is page-specific or template-wide. If it is template-wide, record it as a sitewide task instead of patching around it one page at a time.
- For pages already ranking positions 6-20 with zero clicks, prioritize title intent, first-screen clarity, meta description, snippet-clean text, concise image metadata, and internal links.
- For high-impression pages ranking positions 20-60, prioritize content depth, examples, related links, hub/category links, and proof that the page answers the query intent before chasing promotion.
- Treat archive crawlability, count reconciliation, snippet cleanup, and SEO metadata normalization as a separate sitewide P0 workstream alongside the current one-page review lane.
