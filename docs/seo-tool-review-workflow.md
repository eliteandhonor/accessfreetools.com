# SEO Tool/Page Review Workflow

Use this workflow for the long-lived `codex/seo-tool-blog-review` branch. It reviews one Access Free Tools URL at a time, compares the page with approved competitor evidence, improves weak copy in the Access Free Tools voice, then stops for human approval before the next page starts.

## Required Agents

- SEO Tool Research Agent: gathers local tool, guide, sitemap, Search Console, usage, and built-page evidence.
- Competitor Gap Analyst: scores selected competitor tool, FAQ, and blog pages for useful topic gaps. It never copies wording, examples, or structure.
- Smart 14 Voice Editor: rewrites generic or hard-to-read language into clear, practical, tool-specific copy a smart 14-year-old can understand.
- FAQ And Schema Specialist: checks visible FAQs, answer usefulness, schema alignment, and whether FAQ text is actually on the page.
- Browser Proof Reviewer: opens the exact local or built URL in the internal browser and records layout/readability proof.
- Human Approval Gatekeeper: blocks the next page until approval for the current tool page or blog page is recorded in `docs/seo-tool-review-queue.md`.

## Commands

- `npm run aft -- seo-tool-queue`
- `npm run aft -- seo-tool-research <slug> --page tool`
- `npm run aft -- seo-tool-research <slug> --page blog`
- `npm run aft -- seo-competitor-gap <slug> --page tool --url <competitor-url>`
- `npm run aft -- seo-page-score <slug> --page tool`
- `npm run aft -- seo-page-score <slug> --page blog`
- `npm run aft -- seo-approval-status <slug>`

Generated reports live under `output/seo-tool-review/<slug>/<page>/`.

Some npm versions on Windows consume `--page` and `--url` as npm config. The CLI accepts those commands as written, but the warning-free equivalents are `npm run aft -- seo-tool-research <slug> tool`, `npm run aft -- seo-page-score <slug> blog`, and `npm run aft -- seo-competitor-gap <slug> tool <competitor-url>`.

## Trigger Phrase

When the user says `PAID SEO SPRINT <slug> <tool|blog>`, treat that as approval to run the full one-page workflow for that exact page:

- local research, page score, and browser proof;
- free/open competitor gap checks;
- paid DataForSEO keyword, difficulty, competitor, and SERP evidence for that page only;
- tool-specific copy, FAQ, metadata, internal-link, or calculator improvements;
- verification checks and a fresh in-app browser proof;
- stop at the human approval gate before committing, deploying, or moving to another page.

When the user says `SEO SPRINT <slug> <tool|blog>`, run the same workflow without paid DataForSEO calls unless paid use is approved later in the thread.

## Review Rules

1. Work on `codex/seo-tool-blog-review`.
2. Run `npm run aft -- seo-tool-queue` and choose the next page that is not approved.
3. Run `npm run aft -- seo-tool-research <slug> --page tool|blog`.
4. Open the exact page in the internal browser. Use Playwright only if the internal browser is unavailable.
5. Compare only approved competitor URLs. Default competitor sources are calculator.net, Inch Calculator, CalculatorSoup, CalculatorInn, and OmniCalc.
6. Do not use paid DataForSEO SERP, keyword, or OnPage calls unless the user explicitly approves that paid run.
7. Edit only the current page source, FAQ, metadata, related links, matching guide text, or proof docs.
8. Run `npm run aft -- seo-page-score <slug> --page tool|blog` plus the page-specific checks listed in the research report.
9. Present the exact URL, report paths, browser proof, and diff to the user.
10. Do not move to the next page until that page is approved and recorded in `docs/seo-tool-review-queue.md`.

## Approval Format

Record approvals in `docs/seo-tool-review-queue.md`:

`| slug | page | status | approved by | approved at | proof | notes |`

Allowed statuses are `not-started`, `researching`, `edited`, `waiting-human-approval`, and `approved`.

Tool page approval and blog page approval are separate. A slug is not ready for the next slug until both rows are `approved`.

## Acceptance Checks

- `npm run aft -- page-seo <slug>`
- `npm run aft -- tool-brief <slug>`
- `npm run aft -- content-score <matching guide file>` for blog pages
- `npm run aft -- seo-page-score <slug> --page tool|blog`
- Internal browser snapshot or screenshot for the exact local page
- `npm run check` before larger review milestones, GitHub updates, or branch handoff
