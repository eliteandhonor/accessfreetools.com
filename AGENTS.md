# Access Free Tools Agent Memory

This repo is a long-running utility-site project. Future Codex agents should keep these standing rules.

## SEO Data Sources

- Use Google Search Console for real indexing, click, impression, CTR, and average-position data.
- Use DataForSEO for competitor research, live SERP checks, keyword discovery, and domain/keyword baselines when the task involves SEO research.
- Check `docs/google-search-central-notes.md` before changing indexing, redirect, sitemap, or content-quality SEO logic.
- DataForSEO credentials must stay out of Git. They live in the local Codex MCP config or environment variables.
- Check `docs/dataforseo-knowledgebase-notes.md` before changing SEO automation logic.
- For rank tracking, use priority tiers, `stop_crawl_on_match`, and targeted `depth`/range settings before any broad top-100 SERP crawl.
- Check DataForSEO balance with `npm run dataforseo:account -- -- --min-balance=2`.
- Tell the user to top up when the DataForSEO balance is at or below 2 USD, or when DataForSEO returns billing/account errors.
- Indexing context: an earlier Access Free Tools site existed before this custom Astro site replaced it. Search Console and Bing may temporarily show stale URLs, old quality signals, old crawl paths, and slower re-indexing while search engines reconcile the replacement.

## New Tool Standard

Every new public tool should include:

- A researched, working browser tool.
- Plain-language input explanations, formula/logic notes, examples, mistakes to avoid, and result interpretation.
- Six or more useful FAQs.
- A matching blog guide at `/blog/how-to-use-{slug}/` that uses the actual tool.
- Related tools, category placement, icon mapping, search terms, sitemap coverage, and structured data.
- A truthful audit record. Only mark a tool `deep-reviewed` after the exact tool page, FAQ, examples, blog, formula/logic, privacy/trust wording, and related links have been individually checked.

## Article Writing Standard

- Use `docs/article-writing-agent-standard.md` before drafting or editing blog guides, Medium posts, or longer promotion content.
- Use the Access Free Tools voice: smart 14-year-old clarity, practical examples, plain language, and honest limits.
- Do not copy the personality, voice, or exact style of Neil Patel or any other living writer. Use public SEO lessons only: clear value, useful structure, evidence, examples, and a practical next step.
- Run a small SEO review before public Medium articles: DataForSEO account/status, one main keyword intent, source URL match, and no off-topic terms.
- Run `npm run promotion:medium:quality` before public Medium posts or live Medium edits.
- Medium quality must pass the article reviewer scores: SEO 80+, originality 75+, human interest 75+, and overall 80+.
- Medium posts need a useful branded hero image, alt text, 3-5 focused tags, and canonical/source URL metadata before public posting. Use `npm run promotion:medium:images` or the full quality command to generate/check the image assets.
- Medium live-post lesson from 2026-05-07: do not trust the editor, draft file, or story settings alone. After publishing or editing, open the public Medium URL in the external browser and verify the hero image is visible, image alt text was saved, the title renders as the story H1, section headings render as bold Medium headings, SEO title/description are set in Story Settings, the canonical/source URL is set when available, and the live URL is recorded in `docs/promotion-queue.md`.
- Medium paste lesson from 2026-05-07: plain Markdown can paste into Medium as normal paragraphs, so H2 headings may look unformatted even when the draft file is correct. For live rewrites, paste rich HTML or use Medium's heading controls, then republish and screenshot-check the public article before saying it is fixed.
- Medium visual lesson from 2026-05-08: the wallpaper article hero image had text crossing the calculator artwork. `npm run promotion:medium:quality` now requires Medium hero layout QA, but live Medium posts still require a public-page screenshot check before being marked fixed.
- Medium publishing limit lesson from 2026-05-08: Medium blocked a prepared ad-revenue article with "maximum of two stories in the past 24 hours." If that appears, do not mark the story posted. Leave the prepared draft in Medium, record the block in `docs/promotion-queue.md`, and retry after the 24-hour publish window.

## Competitor Research List

- https://www.calculator.net/sitemap.html
- https://www.inchcalculator.com/sitemap/
- https://calculatorinn.com/sitemap/
- https://www.omnicalc.xyz/sitemap
- https://www.calculatorsoup.com/sitemap.php

## QA And Release

- Use `npm run check` before GitHub updates.
- Use `npm run search-console -- -- --submit-discovery` after major deploys.
- Use `npm run search-console -- -- --inspect-key-urls` to track indexing for important URLs.
- Use `npm run seo:self-evaluate` for the weekly SEO agent report after Search Console data is refreshed.

## Promotion Agent Standard

- Promotion accounts must be created or approved by the user because they involve passwords, identity checks, email/phone verification, CAPTCHA, and platform terms.
- Pinterest Business was created by the user on 2026-05-06 and is the first active promotion channel.
- Medium profile setup is complete at `https://medium.com/@accessfreetools`.
- Reddit was created by the user on 2026-05-07 as `u/accessfreetools`; use `docs/reddit-promotion-agent.md` and run `npm run promotion:reddit:quality` before any Reddit draft is used publicly.
- Never store promotion account passwords in Git, docs, automation prompts, reports, or generated output.
- For promotion account browser work, do not use the in-app Browser Use surface. Use an external browser workflow only, and be explicit when access is blocked.
- Check Codex Chrome control with `npm run automation:chrome-check` before relying on native Chrome-control automation. For `@chrome`, use the Chrome skill and its extension browser runtime; do not wait for a separate `chrome.*` tool namespace. The callable path runs through the generic browser runtime with `agent.browsers.get('extension')`.
- Chrome status note from 2026-05-08: Chrome and Edge both have the Codex extension installed and native host registered. After restarting Codex, the Chrome skill path worked: it listed the live Chrome tabs, found Medium and Pinterest, claimed the Medium tab read-only, verified the live Stories page, and released the tab without closing it. Later the same day, the path was retested from this thread and successfully claimed `https://medium.com/me/stories?tab=posts-published`, confirmed Medium page text, and released the tab without changes.
- Use `docs/promotion-account-launch-kit.md` for Pinterest Business, Reddit, and Medium setup details.
- Use `docs/promotion-queue.md` as the working list of pages to promote and their status.
- Use `docs/promotion-share-kit.md` for safe profile bios, draft posts, and approval checks.
- The agent may draft posts, recommend pages, prepare helpful replies, run SEO checks, submit discovery signals, and report opportunities.
- The agent must not post publicly, send emails, run paid ads, create affiliate placements, or impersonate unrelated users without explicit approval.
- Promotion should be useful first: answer the question, explain the calculation, disclose ownership when linking, and avoid spam tactics.
- Never mark promotion work as `posted`, `updated`, or `done` from a submit button alone. A public URL or profile/feed view must visibly prove the change is live.
