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
- JSON-LD parse validation across built HTML.
- Dependency vulnerability audit.

## Current Focused Checks

```bash
npm run audit:site
npm run check:links
npm run check:structured-data
npm run security:audit
```

## Playwright Visual Smoke Lane

Add Playwright visual smoke tests when the project is ready to carry a browser-test dependency. The first smoke pack should cover:

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

## Broken Link Lane

`npm run check:links` checks built internal `href` and `src` paths. Add external link monitoring later for source references and affiliate links, because third-party sites can fail independently of the build.

## Structured Data Lane

`npm run check:structured-data` parses every built JSON-LD block and checks for `@context`. Use Google's Rich Results Test and URL Inspection manually after deployment for production proof.
