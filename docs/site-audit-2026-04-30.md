# Site Audit: 2026-04-30

This audit records the current local proof after the calculator.net roadmap completion, the post-roadmap expansion, and the cleanup for truthful review wording.

## Current Snapshot

- Built routes: 491 pages.
- Canonical tools: 234.
- Intentional alias tool URLs: 4.
- Public tool URLs in the launchpad search data: 238.
- Matching how-to guide pages: 234.
- Tool audit records: 238 total.
- Manual deep-review records: 10.
- Baseline-review records: 224.
- Alias-review records: 4.
- `/tools/index.html` after launchpad limiting: about 341 KB in the production build.

## Improvements Made

- Replaced overbroad generated `deep-reviewed` claims with `baseline-reviewed` records.
- Kept manual deep review reserved for records that were actually hand-written.
- Added a scalable launchpad limit so the first `/tools/` view renders the first 96 tools, then lets users show all tools.
- Limited collection structured data on `/tools/` to the first 100 visible item links while still recording the full item count.
- Made sitemap `lastmod` dynamic so fresh builds do not ship with a stale date.
- Added one-command validation with `npm run check`.
- Added release and manual-review documentation so future batches have a clearer quality gate.

## Current Gaps

- Only 10 tools have manual deep-review records. The rest have useful baseline checks, but they still need the slower per-tool manual pass.
- High-risk finance and health tools need source checks from official or primary references before being marked deep-reviewed.
- The tools page is lighter now, but a 1000+ tool library will eventually need indexed pagination or server-side search data splitting.
- Production deployment still needs owner-side proof in Hostinger and Google Search Console after each push.
- Affiliate and AdSense placements should wait until account approval, disclosure wording, and privacy updates are ready.

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
```

## Priority Recommendations

1. Manually deep-review the top 25 tools in `docs/manual-deep-review-plan.md`.
2. Keep improving FAQs and blogs for high-value tools before adding new batches.
3. Add production deployment proof after every GitHub push.
4. Keep the launchpad fast as the library grows beyond 500 and 1000 tools.
5. Add monetization only after user trust, disclosures, and account approvals are ready.
