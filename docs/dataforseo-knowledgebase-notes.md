# DataForSEO Knowledge Base Notes

Reviewed: 2026-05-06

These notes turn useful DataForSEO knowledge-base guidance into operating rules for the Access Free Tools SEO agents. They are not a place for API credentials.

## Sources Reviewed

- DataForSEO Knowledge Base: https://dataforseo.com/knowledgebase
- Budget-Friendly Rank Tracking Strategies with DataForSEO SERP API: https://dataforseo.com/blog/budget-friendly-rank-tracking-strategies-with-dataforseo-serp-api
- DataForSEO OnPage API overview: https://docs.dataforseo.com/v3/on_page-overview/
- Troubleshooting OnPage API: https://dataforseo.com/help-center/troubleshooting-onpage-api
- Crawl a specific page or priority pages with OnPage API: https://dataforseo.com/help-center/crawl-a-specific-page-or-several-pages
- Connecting DataForSEO MCP Server to n8n workflows: https://dataforseo.com/help-center/connecting-dataforseo-mcp-server-to-your-n8n-workflows
- Offset vs offset_token parameters: https://dataforseo.com/help-center/what-is-the-difference-between-the-offset-and-offset_token-parameters

## Rules Added For Our Agents

1. Do not run top-100 SERP checks for every keyword. Classify keywords before paid SERP API calls:
   - Tier A: key money/trust pages, pages with Search Console impressions, recent launches, or pages already near page one. Check deeper only when needed.
   - Tier B: useful but lower-value pages. Check about the top 30 to 50 results.
   - Tier C: long-tail or early ideas. Check the first page only, or skip paid SERP until Search Console shows demand.
2. Use `stop_crawl_on_match` when the only question is whether `accessfreetools.com` appears in the results. Stop once our domain is found instead of paying for deeper pages by default.
3. Use `depth`, `max_crawl_pages`, `offset`, and `limit` deliberately. If Search Console or a previous SERP check suggests we usually rank around positions 20 to 30, inspect that range instead of crawling the whole top 100.
4. Use different refresh frequencies:
   - Tier A: weekly while the site is young or while a page is being improved.
   - Tier B: every two to four weeks.
   - Tier C: monthly or only when Search Console shows impressions.
5. Use DataForSEO OnPage API as an optional monthly production proof crawl, not as a daily replacement for our local checks. Start with a small crawl or priority URL queue before scanning the whole site.
6. OnPage API should be used for issues our local build cannot fully prove from production: duplicate tags, duplicate content, resources, redirect chains, non-indexable pages, waterfall/page-speed signals, and Core Web Vitals-style browser rendering when worth the added cost.
7. If an OnPage crawl fails, check robots.txt, noindex/nofollow tags, first-crawl URL, redirects, DNS, and crawler blocking before rerunning paid scans.
8. MCP and workflow automation are allowed for SEO agents, but DataForSEO credentials must remain in local environment variables or MCP config only. Never write credentials into docs, scripts, reports, or Git.
9. Backlinks API remains off by default because the first access check returned subscription/access denial and the user said backlinks are expensive. Treat backlink research as manual unless the user asks and confirms budget.
10. AI/GEO/LLM visibility research is future work. For now, Google Search Console indexing, Bing/Webmaster signals, helpful content, and normal calculator SEO are the priority.
11. If DataForSEO returns task code `40207`, read the task `status_message` before explaining the blocker. On 2026-05-25 the local API and MCP connector both returned `Access denied. Your IP is not whitelisted`; this is an API Access whitelist issue, not a daily-limit issue.
12. DataForSEO v3 SERP `stop_crawl_on_match` can be paired with `target_search_mode: "any"` and `find_targets_in: ["organic"]` for Google Organic live advanced checks. Do not use undocumented values such as `one_target`.

## Practical Weekly Flow

1. Run `npm run dataforseo:account -- -- --min-balance=2`.
2. Run `npm run dataforseo:status`.
3. Pull Search Console and URL inspection data.
4. Build a short keyword priority list from Search Console and current improvement targets.
5. Use DataForSEO Labs for broad keyword and competitor intelligence.
6. Use SERP API only for the selected priority list, with tiered depth and `stop_crawl_on_match` where appropriate.
7. Save all paid outputs under `output/`.
8. Produce recommendations with evidence, not generic SEO advice.
