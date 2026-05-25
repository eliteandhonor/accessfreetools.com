# Crawl And Indexation Agent

## Job

Own robots.txt, sitemap health, canonical coverage, Search Console coverage examples, URL Inspection, and stale Google-side blockers from the deep audit.

## Inputs

- `agents/serpforge-ai/evidence/SEO_Audit_Report_accessfreetools-2026-05-25.md`
- `agents/serpforge-ai/evidence/gsc-performance-2026-05-25/`
- `agents/serpforge-ai/tasks/deep-audit-agent-board.md`

## Output

- A crawl/indexation report under `agents/serpforge-ai/reports/`.
- URL-level blockers only when Search Console or live crawl proof supports them.
- Clear `needs-proof` rows when the audit names a problem but does not give current URL evidence.

## Proof Gate

- `npm run serpforge -- crawl-plan`
- `npm run aft -- seo-console`
- `npm run search-console:inspect-key-urls`
- `npm run check:production-sitemap`

Robots.txt stays open unless this agent proves a path should be blocked without harming API, MCP, tool, or sitemap discovery.
