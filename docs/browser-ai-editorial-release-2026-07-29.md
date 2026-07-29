# Browser AI Editorial Release Evidence

Date: 2026-07-29

## Release

- URL: `https://accessfreetools.com/blog/browser-ai-vs-local-ai-privacy/`
- Source commit: `fe9b57cf`
- Hostinger deployment: `019fad6c-232f-72fb-bd64-53e6cdbe54f7`
- Runtime: Astro 7 on Node 24
- Build output: `dist`
- Entry file: `app.js`

## Quality Proof

- The editorial SEO workbench returned `ready-for-release` with a 100 internal-link score and zero remaining gaps.
- Stop Slop scored 50/50.
- The full `npm run check` passed with both TypeScript versions, 435 tests, the production build, editorial and visual QA, accessibility, structured data, image QA, secret checks, and zero dependency vulnerabilities.
- Live desktop and 390 px mobile checks confirmed one H1, the canonical URL, indexable default robots behavior, valid `BlogPosting` and breadcrumb schema, official source links, literal hero alt text, and no article overflow or heading overlap.
- The live 1200 x 630 hero uses the approved smoke-kawaii image system.

## Production Proof

- `npm run check:production-sitemap`: 660 OK, 4 redirects, 0 hard failures.
- `npm run check:live-ask`: passed on the Astro Node runtime.
- `npm run aft -- ask-audit`: 4 cases, 0 issues, 0 warnings.
- `npm run aft -- api-ready`: passed with 34 API-ready tools.
- `npm run aft -- mcp-smoke`: 3 checks, 0 issues.

## Discovery Proof

- Search Console accepted the current sitemap submission and removed the old noindexed feed submission.
- Initial exact URL inspection reported the new page as unknown to Google, which is the expected pre-crawl baseline.
- The Search Console UI then confirmed: `URL was added to a priority crawl queue.`
- IndexNow accepted the exact article URL with HTTP 200.
- Ignored local evidence:
  - `output/search-console/browser-ai-url-request-2026-07-29.json`
  - `output/search-console/browser-ai-url-request-2026-07-29.png`
  - `output/indexnow-submission.json`
  - `output/production-sitemap-check.json`

## Follow-Up

- Recheck indexing, impressions, queries, CTR, and first-party engagement after 28 and 56 days.
- Keep `tesseract-js-browser-ocr-image-quality` planned for the next one-row editorial cycle. Do not publish a second editorial article in this release.
