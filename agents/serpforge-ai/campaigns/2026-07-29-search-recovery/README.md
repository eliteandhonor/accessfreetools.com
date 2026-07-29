# July 29 Search Recovery Campaign

SERPForge coordinates this evidence-first recovery campaign. Google Search Console is the indexing and Google performance authority. Bing, CrawlScout, OpenSEO, DataForSEO, and local checks provide supporting evidence.

## Source Evidence

- Google: `https___accessfreetools.com_-Performance-on-Search-2026-07-29.zip`
- Bing: `accessfreetools.com_SearchPerformanceOverview_All_7_29_2026.csv`
- CrawlScout sample: `kifx0p91f5-deindexed-2026-07-29.csv`
- Source dates and SHA-256 hashes: ignored reports under `output/search-console/`, `output/bing-webmaster/`, and `output/crawlscout/`

## Rules

- Keep Google chart totals separate from privacy-filtered page and query row totals.
- Treat the CrawlScout file as a supplied URL sample, not a sitewide total.
- Do not rewrite a page before current crawl, index, intent, and workbench evidence supports the change.
- A submit button is not proof. Record visible Search Console confirmation.
- Only the Release and Proof Judge can move a task to `approved`.
- Preserve the completed 604-unit historical SEO queue.

## Status Values

- `planned`: scoped but not started.
- `in_progress`: active work with no complete proof bundle.
- `evidence_ready`: implementation or observation has proof ready for judging.
- `approved`: the Release and Proof Judge verified every done rule.
- `blocked`: a named gate prevents progress.
