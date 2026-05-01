# Site Audit: 2026-04-30

This audit records the current local proof after the calculator.net roadmap completion, the post-roadmap expansion, and the cleanup for truthful review wording.

## Current Snapshot

- Built routes: 590 HTML files.
- Canonical tools: 282.
- Intentional alias tool URLs: 4.
- Public tool URLs in the launchpad search data: 286.
- Matching how-to guide pages: 282.
- Tool audit records: 286 total.
- Manual deep-review records: 282.
- Baseline-review records: 0.
- Alias-review records: 4.
- `/tools/index.html` after launchpad limiting: about 357 KB in the production build.

## Improvements Made

- Replaced overbroad generated `deep-reviewed` claims with `baseline-reviewed` records.
- Kept manual deep review reserved for records that were actually hand-written.
- Added a scalable launchpad limit so the first `/tools/` view renders the first 96 tools, then lets users show all tools.
- Limited collection structured data on `/tools/` to the first 100 visible item links while still recording the full item count.
- Made sitemap `lastmod` dynamic so fresh builds do not ship with a stale date.
- Added one-command validation with `npm run check`.
- Added release and manual-review documentation so future batches have a clearer quality gate.
- Expanded Privacy, Terms, Contact, and Advertising Disclosure pages for AdSense and affiliate readiness.
- Added a full-site improvement plan, all-tools review register, QA automation plan, internal link checker, JSON-LD checker, and dependency audit script.
- Expanded the full-site improvement plan into a complete execution standard with priority order, completion truth, deployment rules, analytics rules, new-tool rules, and a clear definition of done for all 286 public tool URLs.
- Manual deep-review total now includes all 282 canonical tools: the original math-foundation tools, priority/risk tools, finance, health, home-project, construction, electrical, weather, science, school, math, statistics, date/time, converter, developer, image, text, random, everyday, final cleanup tools, browser-only AI tools, the competitor Tech & AI batch, the competitor kitchen, recipe and shopping batch, the competitor business and financial-ratio batch, the competitor construction material batch, and the competitor concrete and masonry batch. Batch 12 is now complete.
- The AI tools now self-host OCR worker/core/language assets and the starter MobileBERT text classifier files under `public/ai-models/`, while heavier experimental model tools remain disclosed as possible third-party model downloads until later self-host passes.

## Current Gaps

- No current canonical tool remains `baseline-reviewed`; all 282 canonical tools now have manual deep-review records.
- Future new tools still need the same one-tool-at-a-time review process before they can be called `deep-reviewed`.
- The tools page is lighter now, but a 1000+ tool library will eventually need indexed pagination or server-side search data splitting.
- Production deployment still needs owner-side proof in Hostinger and Google Search Console after each push.
- Affiliate and AdSense placements should wait until account approval, working contact inboxes, CMP setup where required, and disclosure placement are ready.
- Playwright visual smoke tests are planned but not yet added as a project dependency.
- The execution plan is complete for the current 282 canonical tools and 4 alias URLs, but future tools must reopen the manual review queue before release.

## Proof Commands

Run these before release:

```bash
npm run check
```

Optional focused checks:

```bash
npm run audit:site
npm run typecheck
npm run build
npm run check:links
npm run check:structured-data
npm run security:audit
```

## Priority Recommendations

1. Keep future tools on the same build standard: research, tool, FAQ, guide, tests, audit record, preview, and release proof.
2. Keep improving FAQs and blogs for high-value tools before adding new batches.
3. Add production deployment proof after every GitHub push.
4. Keep the launchpad fast as the library grows beyond 500 and 1000 tools.
5. Add monetization only after user trust, disclosures, and account approvals are ready.
