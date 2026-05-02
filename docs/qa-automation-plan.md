# QA Automation Plan

This file turns the quality plan into repeatable checks.

## Current Automated Checks

Run:

```bash
npm run check
```

This now covers:

- TypeScript.
- Vitest formula and site-content tests.
- Astro production build.
- Internal link validation across built HTML.
- Full built-site metadata audit for titles, descriptions, H1s, canonicals, sitemap coverage, social tags, image alt attributes, and affiliate link `rel` handling.
- Semantic JSON-LD validation across built HTML.
- Performance budget reporting for HTML, JavaScript, CSS, JSON, XML, and WASM assets.
- AI lazy-asset validation so non-AI pages do not statically request model files.
- Dependency vulnerability audit.

## Current Focused Checks

```bash
npm run audit:site
npm run check:links
npm run check:site
npm run check:structured-data
npm run check:performance
npm run check:ai-assets
npm run check:external-links
npm run dataforseo:account -- -- --min-balance=2
npm run seo:self-evaluate
npm run test:smoke
npm run security:audit
```

## Playwright Visual Smoke Lane

`npm run test:smoke` builds the site, starts an Astro preview server, and runs desktop and mobile Playwright checks. The first smoke pack covers:

- `/`
- `/tools/`
- `/blog/`
- `/privacy-policy/`
- `/terms/`
- `/advertising-disclosure/`
- `/tools/mortgage-calculator/`
- `/tools/bmi-calculator/`
- `/tools/wallpaper-calculator/`
- `/tools/subnet-calculator/`
- `/tools/password-generator/`

Each smoke test should check:

- No console errors.
- Main heading is visible once.
- Key tool controls are visible.
- No horizontal overflow on mobile.
- Footer wraps normally.
- Theme picker does not cover content.
- Search/filter interactions still work on `/tools/` and `/blog/`.
- AI model files are not requested before the user runs an AI tool.
- Automated accessibility scans do not find serious or critical issues on the representative pages.

## Broken Link Lane

`npm run check:links` checks built internal `href` and `src` paths. `npm run check:external-links` checks unique external source, disclosure, model, and affiliate links as a non-blocking report because third-party sites can fail independently of the build.

## SEO Agent Lane

`npm run dataforseo:account -- -- --min-balance=2` checks the local DataForSEO account without storing credentials in Git. `npm run dataforseo:status` checks the free DataForSEO service-status endpoints before paid research. `npm run seo:self-evaluate` reads the latest Search Console exports, URL inspection report, DataForSEO keyword/domain data, SERP competitors, and related keyword ideas, then writes `output/seo-agent-self-evaluation.md` and `output/seo-agent-self-evaluation.json`.

DataForSEO automation should warn at `$10`, stop broad paid research at `$5`, and only use Sandbox mode for new endpoint-shape tests before paid production calls. Backlinks API is not automated until the account has confirmed access.

Refresh the inputs first:

```bash
npm run search-console -- -- --site=https://accessfreetools.com/
npm run search-console -- -- --inspect-key-urls
npm run seo:self-evaluate
```

## Structured Data Lane

`npm run check:structured-data` parses every built JSON-LD block, checks expected schema types, compares URLs to canonicals, validates breadcrumb/list positions, and checks that key names are visible on the page. Use Google's Rich Results Test and URL Inspection manually after deployment for production proof.

## Performance And AI Asset Lane

`npm run check:performance` reports soft budget warnings and hard budget failures for built pages and assets. `npm run check:ai-assets` verifies that self-hosted AI models and runtime files are not statically requested by ordinary non-AI pages.
