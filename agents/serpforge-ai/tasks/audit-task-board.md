# SERPForge Audit Task Board

Source audit: `agents/serpforge-ai/evidence/accessfreetools-seo-audit-report-2026-05-24.md`

SERPForge is the main agent. Sub-agents work inside this project folder and write proof reports to `agents/serpforge-ai/reports/`. Public page edits, Search Console claims, paid research claims, and approval claims require proof.

## P0 Tasks

| Lane | Owner | Task | Proof |
| --- | --- | --- | --- |
| Sitewide page SEO | Main Audit Coordinator | Audit every built sitemap URL for title, meta description, H1, canonical, indexability, internal links, image alt coverage, schema, and local tool/blog page score. | `npm run serpforge -- sitewide-seo-audit` |
| Paid sitewide SEO | DataForSEO Market Intelligence Agent | Run DataForSEO OnPage across every public page only after account/status gates pass; keep Labs/SERP checks targeted by tier. | `npm run serpforge -- dataforseo-sitewide-audit` |
| Per-page paid intent ledger | DataForSEO Market Intelligence Agent | Attach DataForSEO Search Intent evidence to every built sitemap page and fail generic above-fold copy before claiming page-by-page SEO completion. | `npm run serpforge -- all-pages-dataforseo` |
| Per-page live SERP audit | DataForSEO Market Intelligence Agent | Use live Google organic SERP evidence for every built sitemap page with tiered depth, stop_crawl_on_match, and no Backlinks API. | `npm run serpforge -- all-pages-serp-audit` |
| Template risk | Template QA Agent | Find copy mismatches such as `tools tools`, non-calculator pages saying calculator, visible theme text, repeated guide phrases, and weak boilerplate. | `npm run serpforge -- template-qa` |
| Alt SEO | Image Alt SEO Agent | Audit approved tool-art alt text and captions for generic mascot/category wording and mismatch with the tool purpose. | `npm run serpforge -- image-alt-audit` |
| Crawl stability | Crawl Stability Agent | Plan checks for 429 risk, static HTML discovery, sitemap index coverage, robots, canonical, and important status codes. | `npm run serpforge -- crawl-plan` |
| Sitemap submission | GSC Sitemap Submission Agent | Submit canonical XML sitemaps and feed through Search Console, or report OAuth/permission blocker without claiming success. | `npm run serpforge -- gsc-submit-sitemaps` |
| Gallery SEO | Gallery SEO Agent | Keep gallery pages indexable only for approved assets and require backlinks to tool/guide pages. | `npm run serpforge -- gallery-seo-plan` |

## P1 Tasks

| Lane | Owner | Task | Proof |
| --- | --- | --- | --- |
| Metadata | Category Metadata Agent | Create category title/meta rewrite tasks for finance, converters, health, developer tools, AI tools, and home projects. | `npm run serpforge -- metadata-plan` |
| Schema | Schema Systems Agent | Plan page-type schema coverage for homepage, category, tool, guide, about, contact, gallery, and image pages. | `npm run serpforge -- schema-plan` |
| EEAT | EEAT Trust Agent | Plan trust blocks for finance, health, tax, electrical, construction, pregnancy, BAC, AI, and password/security tools. | `npm run serpforge -- eeat-plan` |
| Hubs | Topical Hub Agent | Plan the five audit hubs: mortgage/home loan, percentage/ratio, home materials, browser AI, and developer utilities. | `npm run serpforge -- hub-plan` |
| HTML sitemap | HTML Sitemap Agent | Audit `/sitemap/` grouping and coverage for public pages, tools, guides, categories, gallery, images, and future hubs. | `npm run serpforge -- html-sitemap-plan` |

## P2 Tasks

| Lane | Owner | Task | Proof |
| --- | --- | --- | --- |
| Internal links | Anchor Text Agent | Improve contextual anchor text plans for tool-guide-hub relationships. | `npm run serpforge -- audit-sprint` |
| DataForSEO | DataForSEO Market Intelligence Agent | Build targeted paid evidence plans with balance/status gates and no Backlinks API. | `npm run serpforge -- dataforseo-plan` |
| Sprint judge | Audit Sprint Judge | Combine sub-agent outputs into one 30-day sprint plan. | `npm run serpforge -- audit-sprint` |

## Rules

- Use Search Console for indexing and performance truth.
- Use DataForSEO only after account/status gates pass.
- Stop paid sprint at or below 2 USD balance and warn at or below 10 USD.
- Keep galleries indexable only when approved GPT Image art exists.
- Sub-agents can say `ready-for-human-approval`; only the user can approve.
