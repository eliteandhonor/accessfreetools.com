# Access Free Tools

Access Free Tools is a utility website for fast, free browser tools.

The first available tool is a basic calculator. The project is structured so new
calculators, converters, text tools, and everyday utilities can be added through
a shared tool registry and reusable page templates.

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

The production build outputs to `dist`, which is the folder to deploy from
Hostinger's Node.js Web App / GitHub import flow.

## Full Check

Run this before a GitHub push or Hostinger deployment:

```bash
npm run check
```

This runs TypeScript, the site audit tests, and the Astro production build.
For the focused site-content audit only, run:

```bash
npm run audit:site
```

## New Tool Workflow

When creating a new tool, follow this checklist:

1. Research the tool, user intent, current UX expectations, and SEO/FAQ standards.
2. Build the working tool page with real utility behavior.
3. Write researched, useful FAQs that match the tool page and avoid filler questions.
4. Create a matching blog guide for the tool.
5. Give the tool a distinct icon/mark and verify it appears consistently on the Tools page, category pages, related-tool cards, and any homepage/index cards.
6. Use GPT Image for design work when a tool needs a distinctive visual concept, mascot, product-style asset, hero image, or affiliate/product artwork.
7. Add the tool and blog page to navigation/index surfaces and the sitemap.
8. Verify with tests, build, browser interaction, and desktop/mobile screenshots.

## Release Notes

- Use `docs/deployment-checklist.md` before publishing.
- Use `docs/manual-deep-review-plan.md` to track the top manual reviews without overstating generated baseline checks.
- Use `docs/site-audit-2026-04-30.md` as the latest audit snapshot.
