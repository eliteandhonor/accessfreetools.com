# Access Free Tools

Access Free Tools is a utility website for fast, free browser tools.

The production application uses Astro 7 on Node 24.

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
static assets to `dist/client`. The root `app.js` file imports that built server
entry so Hostinger can detect and start a back-end Node process. A post-build
step also mirrors `dist/client` into `dist` so Hostinger deployments that serve
the build root still have static assets available. It also writes `dist/app.js`
for Hostinger setups that start from the output directory.

Hostinger's Node.js Web App should use `npm run build` as the build command and
`npm run start` as the start command. If Hostinger asks for an entry file, use
`app.js`. If it asks for an output directory, use `dist`.

The contact form posts to the Astro Node `/api/contact` route. Configure the
environment variables listed in `docs/contact-form-environment.md` inside
Hostinger, never in GitHub.

## Full Check

Run this before a GitHub push or Hostinger deployment:

```bash
npm run check
```

This runs TypeScript 7 CLI checks, the TypeScript 6 compatibility check, the site
audit tests, and the Astro production build.
It also checks built internal links, audits built page metadata and canonicals,
validates built JSON-LD semantically, reports performance budgets, verifies AI
model assets stay lazy-loaded away from non-AI pages, and runs a dependency audit.
For the focused site-content audit only, run:

```bash
npm run audit:site
```

Useful focused checks:

```bash
npm run check:site
npm run check:structured-data
npm run check:performance
npm run check:ai-assets
npm run check:external-links
npm run check:production-sitemap
node scripts/dataforseo-account.mjs --min-balance=2
npm run dataforseo:status
npm run dataforseo:status:sandbox
npm run seo:daily
npm run seo:onpage-audit
npm run search-console:submit-discovery
npm run search-console:inspect-key-urls
npm run audit:local
npm run audit:deep
npm run audit:deep:no-paid
npm run seo:self-evaluate
npm run indexnow:verify-key
npm run indexnow:dry-run
npm run promotion:weekly-review
npm run promotion:reddit:quality
npm run test:smoke
```

DataForSEO credentials belong in local environment variables or local Codex
configuration, never in Git. Use the status check before paid research, warn at
`$10`, stop broad paid research at `$5`, and top up before the balance reaches
the `$2` emergency threshold.

Google Search Console OAuth files stay local too. Put the downloaded OAuth
client JSON at `.local/google-search-console-client-secret.json`, set
`GSC_CLIENT_SECRET_PATH`, or pass `--client-secret=...` when running
`npm run search-console`.

For a full evidence run, use `npm run audit:deep`. It writes a dated report under
`output/deep-audit/`, runs the normal local checks, gathers DataForSEO OnPage
evidence, copies Search Console and IndexNow proof when available, captures
desktop/mobile smoke-test screenshots, and keeps raw JSON out of Git.

Bing IndexNow is configured with a public root key file. After a deployment,
submit only the canonical URLs that changed, for example
`npm run indexnow:submit -- --url=https://accessfreetools.com/tools/example/`.
Reserve `npm run indexnow:submit-all` for migrations, large launches, or major
sitemap changes. See `docs/bing-indexnow-setup.md`.

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
- Use `docs/automation-operating-plan.md` for the active 10am Codex automation jobs and their safety limits.
- Use `docs/promotion-account-launch-kit.md`, `docs/promotion-queue.md`, `docs/promotion-share-kit.md`, and `docs/reddit-promotion-agent.md` for safe promotion setup and agent-ready drafts.
- Use `docs/site-audit-2026-04-30.md` as the latest audit snapshot.
