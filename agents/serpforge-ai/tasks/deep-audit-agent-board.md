# SERPForge Deep Audit Agent Board

Generated source: `agents/serpforge-ai/evidence/SEO_Audit_Report_accessfreetools-2026-05-25.md`

## Rules

- SERPForge is the main coordinator for this audit sprint.
- Sub-agents write reports to `agents/serpforge-ai/reports/` and stable tasks to `agents/serpforge-ai/tasks/`.
- Allowed finding statuses are `confirmed`, `already-fixed`, `needs-proof`, and `rejected-stale`.
- No agent can mark work approved, live, fixed, posted, submitted, indexed, ranked, or done without proof.
- DataForSEO uses account/status gates first, then targeted Labs, live SERP, and OnPage only. Backlinks API is not used.
- Public copy must use the Access Free Tools smart 14-year-old voice: clear, practical, specific, no AI/SEO/internal filler.

## Agent Roster

| agent | lane | file | proof commands |
| --- | --- | --- | --- |
| Main Deep Audit Coordinator | orchestration | `agents/serpforge-ai/agents/main-audit-coordinator.md` | `deep-audit-import`, `deep-audit-agents`, `deep-audit-sprint` |
| Technical Headers Agent | technical | `agents/serpforge-ai/agents/technical-headers-agent.md` | `technical-header-plan`, `npm run check`, `npm run check:production-sitemap` |
| Crawl And Indexation Agent | crawl-indexation | `agents/serpforge-ai/agents/crawl-indexation-agent.md` | `crawl-plan`, `npm run aft -- seo-console`, `npm run search-console:inspect-key-urls` |
| Metadata And Heading Agent | on-page | `agents/serpforge-ai/agents/metadata-heading-agent.md` | `heading-metadata-plan`, `sitewide-seo-audit`, `all-pages-human-tone-report` |
| Content Depth Agent | content-depth | `agents/serpforge-ai/agents/content-depth-agent.md` | `content-depth-plan`, `npm run aft -- semantic-depth`, `npm run aft -- hub-strength` |
| E-E-A-T Trust Agent | trust | `agents/serpforge-ai/agents/eeat-trust-agent.md` | `eeat-author-plan`, `eeat-plan`, `npm run check:structured-data` |
| Image And Listing UX Agent | images-ux | `agents/serpforge-ai/agents/image-listing-ux-agent.md` | `image-alt-audit`, `image-alt-plan`, `image-sitemap-plan`, `gallery-seo-plan` |
| Internal Link And Anchor Agent | internal-links | `agents/serpforge-ai/agents/internal-link-anchor-agent.md` | `npm run aft -- link-helper`, `npm run aft -- hub-strength` |
| Authority And Outreach Agent | authority | `agents/serpforge-ai/agents/authority-outreach-agent.md` | `authority-plan`, `npm run marketing:orchestrate`, `npm run aft -- recognition` |
| Social Discovery Agent | promotion | `agents/serpforge-ai/agents/social-discovery-agent.md` | `social-discovery-plan`, `npm run marketing:orchestrate`, `npm run aft -- proof-check` |
| DataForSEO Market Agent | dataforseo-gsc | `agents/serpforge-ai/agents/dataforseo-market-intelligence-agent.md` | `dataforseo-plan`, `dataforseo-sitewide-audit`, `all-pages-dataforseo` |
| Audit Sprint Judge | final-judge | `agents/serpforge-ai/agents/audit-sprint-judge.md` | `deep-audit-sprint`, `audit-sprint`, `all-pages-human-tone-report` |

## Live Proof Follow-Up Lane - 2026-05-25

Source board: `agents/serpforge-ai/tasks/live-recommendation-agent-tasks-2026-05-25.md`

| status | owner | id | task | proof |
| --- | --- | --- | --- | --- |
| confirmed | Crawl And Indexation Agent | wallpaper-tool-indexing-watch | Keep `/tools/wallpaper-calculator/` in the Search Console indexing watch lane until URL Inspection returns `PASS`. | `npm run search-console:inspect-key-urls`. |
| confirmed | Internal Link And Anchor Agent | wallpaper-contextual-link-cleanup | Fix the wallpaper tool workbench blocker by improving only useful contextual links and anchors. | `node scripts/seo-agent-workbench.mjs all wallpaper-calculator tool`. |
| confirmed | Technical Headers Agent | hostinger-html-cache-edge-proof | Investigate Hostinger/hcdn HTML cache behavior because live HTML still returns `Cache-Control: public, max-age=0`. | Fresh live HEAD response plus Hostinger-side proof before any done claim. |
| confirmed | Content Depth Agent | dataforseo-low-content-rate-review | Review the 41 DataForSEO low-content-rate rows manually and avoid padding pages with no real reader gap. | Fresh DataForSEO report plus page workbench for edited URLs. |
| confirmed | Metadata And Heading Agent | dataforseo-duplicate-content-groups | Review the 10 duplicate-content groups and differentiate only pages with real overlap. | DataForSEO duplicate-content rows plus page-specific workbench. |
| needs-proof | GSC Sitemap Submission Agent | sitemap-pending-watch | Recheck `/sitemap.xml` and `/feed.xml` after Search Console processes the latest submission. | `npm run search-console:submit-discovery`. |

## GSC Performance Lane - 2026-05-26

Source board: `agents/serpforge-ai/tasks/gsc-performance-agent-tasks-2026-05-26.md`

| status | owner | id | task | proof |
| --- | --- | --- | --- | --- |
| confirmed | DataForSEO Market Agent + Search Intent And Keyword Agent | interest-rate-dataforseo-page-sprint | Make `/tools/interest-rate-calculator/` the first GSC-driven sprint because it has 915 impressions, 0 clicks, and a blocked workbench. | `npm run serpforge -- paid-audit-sprint interest-rate-calculator tool`; `node scripts/seo-agent-workbench.mjs all interest-rate-calculator tool`. |
| confirmed | FAQ And Schema Specialist | interest-rate-six-faqs | Add useful visible FAQs for Interest Rate Calculator; current source has 0 FAQs and page score is 81. | `npm run aft -- seo-page-score interest-rate-calculator tool`. |
| confirmed | Metadata And Heading Agent | interest-rate-source-seo-description | Add a source `seoDescription` for Interest Rate Calculator. | `npm run aft -- seo-page-score interest-rate-calculator tool`. |
| needs-proof | Metadata And Heading Agent + Content Depth Agent | near-page-one-ctr-sprint | Review near-page-one GSC pages before lower-rank bulk rewrites. | Page-specific workbench and DataForSEO proof for selected tool/blog pages. |
| needs-proof | Crawl And Indexation Agent | gsc-coverage-url-sample-export | Import Search Console Coverage/Page Indexing URL examples before assigning exact 5xx or 404 fixes. | `npm run search-console:import-coverage` after Coverage CSV export. |
| watch | Crawl And Indexation Agent | legacy-url-search-console-watch | Keep old URL rows as redirect-watch items, not duplicate rebuilds. | Live 301 proof and Search Console inspection for replacement targets. |

## P0 Lane

| status | owner | id | task | proof |
| --- | --- | --- | --- | --- |
| confirmed | Technical Headers Agent | hsts-missing | Add or configure production HSTS after checking Hostinger/CDN ownership, then verify the live header. | technical-header-plan plus live HEAD response. |
| confirmed | Technical Headers Agent | cache-max-age-zero | Plan CDN/static cache rules for built assets and HTML without breaking tool freshness. | technical-header-plan and production header sample. |
| confirmed | Technical Headers Agent | trailing-slash-no-redirect | Add or configure trailing-slash 301 behavior only after checking Astro, Hostinger, and sitemap canonicals. | technical-header-plan and redirect probe for /tools. |
| already-fixed | Crawl And Indexation Agent | sitemap-index-submitted | Keep submitting and verifying the canonical sitemap set through the existing GSC flow. | gsc-submit-sitemaps and check:production-sitemap. |
| needs-proof | Crawl And Indexation Agent | gsc-url-examples | Use Search Console exports and URL Inspection before assigning exact URL fixes. | npm run search-console:inspect-key-urls and npm run aft -- seo-console. |
| confirmed | DataForSEO Market Agent | dataforseo-market-layer | Use Labs, live SERP, and OnPage only; tier depth and stop_crawl_on_match; never use Backlinks API. | dataforseo-plan, all-pages-dataforseo, all-pages-serp-audit, dataforseo-sitewide-audit. |
| confirmed | Audit Sprint Judge | no-fake-done-claims | Block done until build, local SEO, DataForSEO, GSC/Search Console, and human-tone gates pass. | deep-audit-sprint and all-pages-human-tone-report. |

## P1 Lane

| status | owner | id | task | proof |
| --- | --- | --- | --- | --- |
| needs-proof | Metadata And Heading Agent | short-titles | Use sitewide page rows to list exact short titles, then rewrite only page-specific snippets in smart 14-year-old voice. | heading-metadata-plan and sitewide-seo-audit. |
| needs-proof | Metadata And Heading Agent | meta-description-length | Generate a URL-by-URL metadata repair queue from built HTML, not generic category advice. | heading-metadata-plan and all-pages-human-tone-report. |
| needs-proof | Metadata And Heading Agent | blog-listing-h2-overload | Verify heading counts in built HTML and plan a listing card heading hierarchy that is better for scanning. | heading-metadata-plan. |
| needs-proof | Metadata And Heading Agent | tool-h3-depth | Add H3s only when they help examples, mistakes, formulas, or result interpretation. | page SEO workbench for each edited tool/blog page. |
| needs-proof | Content Depth Agent | content-depth-hubs-about-password | Use GSC/DataForSEO evidence to prioritize expansion, then write practical examples and honest limits. | content-depth-plan, semantic-depth, hub-strength. |
| needs-proof | E-E-A-T Trust Agent | ymyl-trust-blocks | Plan reusable trust blocks and schema without overclaiming medical, legal, tax, or safety advice. | eeat-author-plan and structured-data check. |
| needs-proof | Image And Listing UX Agent | listing-images | Plan specific images for homepage, tools, blog, category, and gallery listings without exposing queued or failed-QA art. | image-alt-audit, gallery:qa, images:sitemap-check. |
| already-fixed | Image And Listing UX Agent | image-dimensions | Keep this under QA and only reopen if a built-page check finds missing dimensions. | images:qa and images:sitemap-check. |
| needs-proof | Image And Listing UX Agent | alt-text-specificity | Audit approved tool art and rewrite alt/caption metadata around tool purpose, inputs, outputs, formulas, examples, and guide context. | image-alt-audit and image-alt-plan. |
| needs-proof | Social Discovery Agent | zero-social-presence | Verify current public profile URLs and queue only quality-gated drafts; do not post without approval. | social-discovery-plan and npm run aft -- proof-check. |
| needs-proof | Authority And Outreach Agent | directory-outreach | Prepare targets and drafts only; no submissions, messages, ads, or backlink claims without approval and public proof. | authority-plan. |

## P2 Lane

| status | owner | id | task | proof |
| --- | --- | --- | --- | --- |
| needs-proof | Internal Link And Anchor Agent | anchor-repetition | Use the link helper before editing anchors so useful reader paths stay above raw SEO anchor variation. | npm run aft -- link-helper. |
| rejected-stale | Authority And Outreach Agent | homepage-external-links | Reject as a generic/stale recommendation unless a specific reader-useful citation or partner proof exists. | authority-plan. |
