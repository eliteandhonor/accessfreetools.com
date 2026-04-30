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

The production build outputs the Node server to `dist/server/entry.mjs` and
static assets to `dist/client`. Hostinger's Node.js Web App should use
`npm run build` as the build command and `npm run start` as the start command.

The contact form sends through Hostinger SMTP from server-side code. Configure
the environment variables listed in `docs/contact-form-environment.md` inside
Hostinger, not in GitHub.

## Full Check

Run this before a GitHub push or Hostinger deployment:

```bash
npm run check
```

This runs TypeScript, the site audit tests, and the Astro production build.
It also checks built internal links, validates built JSON-LD, and runs a dependency
audit.
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
- Use `docs/full-site-improvement-plan.md` and `docs/all-tools-review-register.md` to keep the quality plan scoped to every tool.
- Use `docs/qa-automation-plan.md` to track automated checks and the Playwright smoke-test lane.
- Use `docs/site-audit-2026-04-30.md` as the latest audit snapshot.
