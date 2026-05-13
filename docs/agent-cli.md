# Access Free Tools Agent CLI

Last updated: 2026-05-10

`npm run aft -- ...` is the internal command surface for Codex agents working on Access Free Tools. It keeps daily orientation short, repeatable, and proof-based without replacing the existing scripts.

The CLI is for agent support only. It must not publish posts, edit live social content, run ads, store passwords, open browsers, or mark promotion work complete.

## Commands

- `npm run aft -- status`
  - Summarizes brand-code presence, marketing report age, DataForSEO live-or-cached balance, promotion queue counts, indexing gaps, and platform quality reports.
  - Treat `DataForSEO: live ...` as fresh proof. Treat `DataForSEO: cached ...; live check note: ...` as a temporary API/network warning, not a low-balance proof.

- `npm run aft -- marketing`
  - Runs the existing read-only marketing orchestrator and summarizes its 1 to 3 recommended actions.

- `npm run aft -- hostinger`
  - Runs the read-only Hostinger status command and summarizes websites, orders, domains, and any API blockers. Use this before claiming Hostinger or deployment access is broken.

- `npm run aft -- promote-next`
  - Reads `docs/promotion-queue.md` and shows safe promotion candidates plus rows that still need public proof.

- `npm run aft -- indexing-gaps`
  - Reads Search Console and SEO snapshots in `output/` and lists URLs that are unknown, discovered, crawled but not indexed, or otherwise not passing.

- `npm run aft -- usage-summary`
  - Reads the local first-party analytics event log and summarizes visitors, page views, tool-use actions, top tools, and top pages. Use `--days <number>` for a different range.

- `npm run aft -- site-sitemap`
  - Checks built XML sitemap coverage and confirms the public HTML sitemap source exists.

- `npm run aft -- page-seo <slug>`
  - Checks one tool slug for source metadata, FAQ/example counts, related tools, built page metadata, matching guide, and sitemap coverage.

- `npm run aft -- content-score <file>`
  - Checks one content file for generic phrases, agent-facing text, concrete examples, and Access Free Tools links. Medium drafts are matched against the Medium quality report when possible.

- `npm run aft -- proof-check`
  - Finds promotion queue rows that claim a live or done status without visible public proof, and rows intentionally waiting for proof.

Every command supports `--json` for structured agent use. For strict machine parsing, read stdout only or use npm's silent mode:

```powershell
npm run --silent aft -- status --json
```

## Proof Rules

The CLI can summarize proof, but it cannot create proof by itself. Public promotion can only be marked `posted`, `updated`, `done`, or `fixed` when one of these is visible:

- A public URL showing the post or change.
- A public profile or feed view showing the item.
- A screenshot saved in `output/`.
- A generated report proving a non-public action, such as RSS health or sitemap verification.

## Recommended Agent Flow

1. Start with `npm run aft -- status`.
2. Run `npm run aft -- marketing` when choosing SEO, internal-link, content, or promotion work.
3. Run `npm run aft -- hostinger` before Hostinger, DNS, deployment, or hosting-environment claims.
4. Use `npm run aft -- usage-summary` when deciding which tools deserve more internal links, guides, social promotion, or UX improvements.
5. Use `npm run aft -- site-sitemap` after builds or sitemap changes.
6. Use `npm run aft -- page-seo <slug>` before improving a tool page or guide.
7. Use `npm run aft -- content-score <file>` before Medium, Quora, Reddit, or longer promotion copy goes public.
8. Use `npm run aft -- proof-check` before changing promotion queue statuses.

## V1 Choice

This CLI uses Node and Commander because the repo already uses Node scripts. Printing Press remains a future experiment if we later need generated Go CLIs, cached local mirrors, or shared agent-native command packages.
