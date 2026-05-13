# Access Free Tools Agent Memory

This repo is a long-running utility-site project. Future Codex agents should keep these standing rules.

## Brand And Orchestration

- Read `docs/brand-code.md` before writing or editing public page copy, tool explanations, blog guides, Medium posts, Quora answers, Reddit replies, Bluesky posts, Pinterest text, or promotion reports.
- Use `docs/marketing-orchestrator.md` when coordinating SEO, internal-link, content, and promotion agents. The orchestrator owns priority and dedupe; platform agents own platform-specific drafts and proof.
- Run `npm run marketing:orchestrate` when the user asks what marketing, SEO, internal-link, or promotion work should happen next. It is read-only and must not publish, edit live posts, send emails, run ads, or mark work complete.
- Prefer `npm run aft -- status` and `npm run aft -- marketing` for quick daily orientation before digging through large reports. Use `docs/agent-cli.md` for the full internal CLI command list.
- In `npm run aft -- status`, treat `DataForSEO: live ...` as fresh proof and `DataForSEO: cached ...` as fallback-only evidence from saved reports.
- Automation agents should also use `npm run aft -- indexing-gaps` and `npm run aft -- proof-check` before making indexing or promotion-proof claims.
- Use `npm run aft -- usage-summary` when deciding which tools need better internal links, guide improvements, or promotion based on actual anonymous tool-use data. Use `npm run aft -- site-sitemap` after sitemap or discovery changes.
- Use `docs/analytics-dashboard.md` before changing first-party analytics, dashboard access, owner opt-out behavior, or Hostinger analytics setup notes.
- Use `docs/hostinger-api-agent-guide.md` before changing Hostinger API, MCP, deployment, DNS, or hosting automation. Start with `npm run hostinger:status` or `npm run aft -- hostinger`; DNS, billing, domain, VPS, Docker, and deployment writes require explicit approval.
- Run `npm run automation:env-check` before reporting automation environment failures. Use `output/automation-environment.md` to distinguish a real account/site issue from stale memory or a temporary automation network/OAuth problem.
- Never let automation output become reader-facing copy. Public content should follow the brand code and should not include internal instructions such as "this Medium post should" or "agent should".

## SEO Data Sources

- Use Google Search Console for real indexing, click, impression, CTR, and average-position data.
- Use DataForSEO for competitor research, live SERP checks, keyword discovery, and domain/keyword baselines when the task involves SEO research.
- Check `docs/google-search-central-notes.md` before changing indexing, redirect, sitemap, or content-quality SEO logic.
- DataForSEO credentials must stay out of Git. They live in the local Codex MCP config or environment variables.
- Check `docs/dataforseo-knowledgebase-notes.md` before changing SEO automation logic.
- For rank tracking, use priority tiers, `stop_crawl_on_match`, and targeted `depth`/range settings before any broad top-100 SERP crawl.
- Check DataForSEO balance with `npm run dataforseo:account`; its defaults use a 2 USD top-up threshold and 10 USD warning threshold.
- For the scheduled monthly paid OnPage crawl, use `npm run automation:monthly-onpage` instead of manually composing account/status/crawl commands.
- For a non-paid monthly OnPage readiness check, use `npm run automation:monthly-onpage:dry-run` or `node scripts/monthly-onpage-automation.mjs --dry-run`. Do not use ad hoc npm argument forwarding for dry-run checks.
- Tell the user to top up when the DataForSEO balance is at or below 2 USD, or when DataForSEO returns billing/account errors.
- Indexing context: an earlier Access Free Tools site existed before this custom Astro site replaced it. Search Console and Bing may temporarily show stale URLs, old quality signals, old crawl paths, and slower re-indexing while search engines reconcile the replacement.
- Automation dedupe note from 2026-05-09: the standalone `DataForSEO Balance Watch` automation was removed because the daily SEO/promotion review, weekly SEO self-evaluation, monthly OnPage crawl, and deep audit already check balance. Do not recreate a top-up-only automation unless those owner jobs are disabled.

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
- Medium quality must pass the article reviewer scores: SEO 80+, originality 75+, human interest 75+, reader desire 82+, and overall 82+.
- Medium posts need a useful branded hero image, alt text, 3-5 focused tags, and canonical/source URL metadata before public posting. Use `npm run promotion:medium:images` or the full quality command to generate/check the image assets.
- Medium live-post lesson from 2026-05-07: do not trust the editor, draft file, or story settings alone. After publishing or editing, open the public Medium URL in the external browser and verify the hero image is visible, image alt text was saved, the title renders as the story H1, section headings render as bold Medium headings, SEO title/description are set in Story Settings, the canonical/source URL is set when available, and the live URL is recorded in `docs/promotion-queue.md`.
- Medium paste lesson from 2026-05-07: plain Markdown can paste into Medium as normal paragraphs, so H2 headings may look unformatted even when the draft file is correct. For live rewrites, paste rich HTML or use Medium's heading controls, then republish and screenshot-check the public article before saying it is fixed.
- Medium visual lesson from 2026-05-08: the wallpaper article hero image had text crossing the calculator artwork. `npm run promotion:medium:quality` now requires Medium hero layout QA, but live Medium posts still require a public-page screenshot check before being marked fixed.
- Medium publishing limit lesson from 2026-05-08: Medium blocked a prepared ad-revenue article with "maximum of two stories in the past 24 hours." If that appears, do not mark the story posted. Leave the prepared draft in Medium, record the block in `docs/promotion-queue.md`, and retry after the 24-hour publish window.
- Medium reader-quality lesson from 2026-05-10: a mortgage draft was stopped because it sounded generic even though earlier gates passed. Use the `reader-first-article-review` skill and `npm run promotion:medium:quality`; the gate now includes a reader-desire score, concrete opening scene, problem tension, numbered example, payoff, and self-referential filler checks.
- Medium internal-link lesson from 2026-05-10: reader-facing Medium drafts must include a contextual Access Free Tools link before the final CTA and link both the matching tool and guide when those are different URLs. Agent-only text such as "this Medium post should..." must fail the gate.

## Competitor Research List

- https://www.calculator.net/sitemap.html
- https://www.inchcalculator.com/sitemap/
- https://calculatorinn.com/sitemap/
- https://www.omnicalc.xyz/sitemap
- https://www.calculatorsoup.com/sitemap.php

## QA And Release

- Use `npm run check` before GitHub updates.
- Use `npm run search-console:submit-discovery` after major deploys.
- Use `npm run search-console:inspect-key-urls` to track indexing for important URLs.
- Use `npm run seo:self-evaluate` for the weekly SEO agent report after Search Console data is refreshed.

## Promotion Agent Standard

- Promotion accounts must be created or approved by the user because they involve passwords, identity checks, email/phone verification, CAPTCHA, and platform terms.
- Pinterest Business was created by the user on 2026-05-06 and is the first active promotion channel.
- Medium profile setup is complete at `https://medium.com/@accessfreetools`.
- Reddit was created by the user on 2026-05-07 as `u/accessfreetools`; use `docs/reddit-promotion-agent.md` and run `npm run promotion:reddit:quality` before any Reddit draft is used publicly.
- Quora was created by the user on 2026-05-08 with `contact@accessfreetools.com`; use `docs/quora-promotion-agent.md` and run `npm run promotion:quora:quality` before any Quora answer draft is used publicly.
- Quora Space setup lesson from 2026-05-08: do not mark the Space checklist complete until the visible checklist is screenshot/publicly verified. The Space description, custom visuals, and share-to-feed prompt were completed; the invite prompt is intentionally skipped unless there are real followers or explicitly approved contacts. Never bulk-invite or import contacts.
- Quora profile avatar lesson from 2026-05-08: the branded avatar at `public/pinterest/access-free-tools-avatar.png` was uploaded through the profile edit image path and externally verified on the public profile.
- Bluesky is the recommended next organic platform as of 2026-05-08; use `docs/bluesky-promotion-agent.md` and run `npm run promotion:bluesky:quality` before any Bluesky draft is approved. Keep `BLUESKY_HANDLE` and `BLUESKY_APP_PASSWORD` local only, and never mark a Bluesky post live without a visible public post URL.
- DEV Community is the recommended next technical blogging platform as of 2026-05-13, but the first user-created `@accessfreetools` account returned `Forbidden` on `/new` with a suspended/limited-access warning after onboarding. Use `docs/devto-promotion-agent.md`, keep DEV drafts ready, and do not retry public DEV publishing until DEV restores the account or the user approves a clean replacement path. Run `npm run promotion:devto:quality` before any DEV draft or API publish, use it only for developer, AI, browser, Markdown, JSON, encoding, token, API, and productivity topics, keep `DEVTO_API_KEY` local in `.local/devto.env` only, set canonical URLs to Access Free Tools guides, and never mark a DEV article live without a visible public DEV URL.
- Never store promotion account passwords in Git, docs, automation prompts, reports, or generated output.
- For promotion account browser work, do not use the in-app Browser Use surface. Use an external browser workflow only, and be explicit when access is blocked.
- Use the local `chrome-social-promotion` skill for external Chrome promotion work on Medium, Pinterest, Bluesky, Quora, and Quora Spaces. It stores the platform navigation/proof checklist so future agents do not rediscover the same browser steps.
- Check Codex Chrome control with `npm run automation:chrome-check` before relying on native Chrome-control automation. For `@chrome`, use the Chrome skill and its extension browser runtime; do not wait for a separate `chrome.*` tool namespace. The callable path runs through the generic browser runtime with `agent.browsers.get('extension')`.
- Chrome status note from 2026-05-08: Chrome and Edge both have the Codex extension installed and native host registered. After restarting Codex, the Chrome skill path worked: it listed the live Chrome tabs, found Medium and Pinterest, claimed the Medium tab read-only, verified the live Stories page, and released the tab without closing it. Later the same day, the path was retested from this thread and successfully claimed `https://medium.com/me/stories?tab=posts-published`, confirmed Medium page text, and released the tab without changes.
- Chrome status note from 2026-05-10: when multiple Chrome extension backends are listed, use the backend whose `user.openTabs()` returns the user's real logged-in social tabs. Claim tabs with `chromeBrowser.user.claimTab(tabId)` before using Playwright-style locators. Bluesky public posting was verified by opening the public profile and extracting the visible post permalink before updating the queue.
- About page lesson from 2026-05-10: `/about/` should read like the mission page for a growing free utility app website, with balanced visual layout and concrete tool-library goals. Do not let it collapse into a generic SEO/audit process page or duplicate `/why-access-free-tools/`.
- Use `docs/promotion-account-launch-kit.md` for Pinterest Business, Reddit, and Medium setup details.
- Use `docs/promotion-queue.md` as the working list of pages to promote and their status.
- Use `docs/promotion-share-kit.md` for safe profile bios, draft posts, and approval checks.
- The agent may draft posts, recommend pages, prepare helpful replies, run SEO checks, submit discovery signals, and report opportunities.
- The agent must not post publicly, send emails, run paid ads, create affiliate placements, or impersonate unrelated users without explicit approval.
- Promotion should be useful first: answer the question, explain the calculation, disclose ownership when linking, and avoid spam tactics.
- Never mark promotion work as `posted`, `updated`, or `done` from a submit button alone. A public URL or profile/feed view must visibly prove the change is live.
- Automation prompts should avoid overlap: one daily overview owns routine indexing/promotion status, platform agents own platform-specific draft quality, weekly QA owns code/site checks, and monthly OnPage owns paid production crawling.
