# Access Free Tools Agent Memory

This repo is a long-running utility-site project. Future Codex agents should keep these standing rules.

## Brand And Orchestration

- Read `docs/brand-code.md` before writing or editing public page copy, tool explanations, blog guides, Medium posts, Quora answers, Reddit replies, Bluesky posts, Pinterest text, or promotion reports.
- Use `docs/marketing-orchestrator.md` when coordinating SEO, internal-link, content, and promotion agents. The orchestrator owns priority and dedupe; platform agents own platform-specific drafts and proof.
- Use `docs/recommended-agency-agents.md` when choosing specialist agent roles from the `msitarzewski/agency-agents` prompt library. Adapt only the agents that fit this repo; local proof gates and standing rules always win.
- Use `docs/seo-tool-review-workflow.md` and `docs/seo-tool-review-queue.md` for the controlled one-page-at-a-time SEO review lane. Tool pages and matching blog pages need separate approval rows before the next page starts; under the Standing Owner Autonomy Directive in `docs/seo-tool-review-workflow.md`, fully proven exact page-level SEO work can be recorded as `user autonomous completion directive`.
- SEO sprint completion note updated 2026-07-13: the generated tool/blog review lane is complete with 604 approved page review units and 0 remaining, including the Four in a Row pilot. If older June audit notes mention a `text-case-converter` blog blocker, treat that as historical and use the current `docs/seo-tool-review-queue.md`, `npm run aft -- seo-tool-queue`, and `npm run aft -- proof-check` output as the source of truth.
- Always use the SEO agent workbench for SEO tasks. When the task mentions SEO, run or reference the relevant `node scripts/seo-agent-workbench.mjs ...` command so each SEO job has a specialist agent, evaluator, micro-agent scope, and final judge before approval claims.
- Use the globally installed OpenSEO MCP server and OpenSEO skills as the default research layer for SEO project setup, keyword research, keyword clustering, competitive landscapes, competitor analysis, and link prospecting. Call `list_projects` first when the OpenSEO project ID is not already proven. OpenSEO supplies research evidence; it does not replace this repo's Search Console source-of-truth rules, paid-call caps, local reports, or SEO workbench approval gate. If OpenSEO is unavailable, report the missing evidence instead of silently substituting stale data.
- Use `docs/search-engine-land-seo-task-board.md` for the current Search Engine Land research-backed SEO task board: indexing protection, AI crawler visibility, hub upgrades, semantic-depth work, recognition tracking, original data assets, FAQ strategy, and promotion quality.
- Run `npm run marketing:orchestrate` when the user asks what marketing, SEO, internal-link, or promotion work should happen next. It is read-only and must not publish, edit live posts, send emails, run ads, or mark work complete.
- Prefer `npm run aft -- status` and `npm run aft -- marketing` for quick daily orientation before digging through large reports. Use `docs/agent-cli.md` for the full internal CLI command list.
- In `npm run aft -- status`, treat `DataForSEO: live ...` as fresh proof and `DataForSEO: cached ...` as fallback-only evidence from saved reports.
- Automation agents should also use `npm run aft -- indexing-gaps` and `npm run aft -- proof-check` before making indexing or promotion-proof claims.
- Use `npm run analytics:production` for real anonymous production usage evidence before deciding which tools need better internal links, guide improvements, or promotion. `npm run aft -- usage-summary` reads the local QA log and must not support production-demand claims. Use `npm run aft -- site-sitemap` after sitemap or discovery changes.
- Use `/admin/agent-tools/` and the `output/agent-tools/` reports for private agent evidence checks. The page is token-protected, noindexed, and can refresh safe report-only checks; it must never publish, submit, spend paid API credits, or edit public content. CLI Ask audit remains the stronger proof when rendered tool-page parity matters.
- Use `docs/smoke-kawaii-image-system.md` before changing tool/guide artwork, gallery pages, image sitemap logic, or image QA. Only GPT Image assets that pass visual QA may be marked `approved`; repeated placeholder art, cropped hair, cropped hands, or cut-off character bodies must stay hidden or rejected.
- Use `npm run aft -- ask-audit`, `npm run aft -- api-ready`, `npm run aft -- mcp-smoke`, `npm run aft -- link-helper`, `npm run aft -- seo-console`, `npm run aft -- seo-tool-queue`, `npm run aft -- seo-tool-research`, `npm run aft -- seo-page-score`, and `npm run aft -- seo-approval-status` for Ask/API/MCP, API expansion, internal-link, SEO fix-console, and controlled tool/page SEO review work. These commands must report missing evidence as `not enough data`, never as a guessed recommendation.
- `npm run aft -- link-helper` preserves the most recent successful built-link snapshot under ignored `output/agent-tools/link-helper/last-built.json` so safe cleanup can remove `dist/` without turning proven links into false zero-link tasks. Link Helper and SEO Console both consume this snapshot. If neither current nor recent saved build proof covers every requested target, rebuild and refresh the report; missing `dist/` is not evidence that a page needs more links.
- Use `docs/analytics-dashboard.md` before changing first-party analytics, dashboard access, owner opt-out behavior, or Hostinger analytics setup notes.
- Use `/admin/` as the private owner entry point for one-time browser token storage before opening `/admin/analytics/` or `/admin/agent-tools/`.
- Use `docs/ask-api-mcp-alpha.md` before changing Ask Access Free Tools, the REST API, MCP endpoint, Ollama settings, API beta tokens, or tool-runner schemas. Exact calculator answers must come from deterministic Access Free Tools code, not model-only math. Production must use the Astro Node routes for Ask/API/MCP; do not recreate PHP fallback routes or duplicated tool data.
- Use `npm run aft -- hub-strength`, `npm run aft -- semantic-depth`, and `npm run aft -- recognition` after hub, priority-depth, or public-recognition changes. These commands keep Search Engine Land-style SEO work proof-based instead of memory-based.
- Use `docs/original-data-asset-plan.md` and `npm run aft -- usage-notes` before proposing public "what people are using" reports from anonymous analytics.
- Use `docs/hostinger-api-agent-guide.md` before changing Hostinger API, MCP, deployment, DNS, or hosting automation. Start with `npm run hostinger:status` or `npm run aft -- hostinger`; `hostinger:status` must confirm the newest build is completed on Node 24 with `dist` and `app.js`, because healthy account lists alone are not deployment proof. DNS, billing, domain, VPS, Docker, and deployment writes require explicit approval.
- Run `npm run automation:env-check` before reporting automation environment failures. Use `output/automation-environment.md` to distinguish a real account/site issue from stale memory or a temporary automation network/OAuth problem.
- Never let automation output become reader-facing copy. Public content should follow the brand code and should not include internal instructions such as "this Medium post should" or "agent should".

## SEO Data Sources

- Use Google Search Console for real indexing, click, impression, CTR, and average-position data.
- When the user provides a Google Coverage CSV export, run `npm run search-console:import-coverage` and use `output/search-console-coverage-export.json` as aggregate evidence. It finds the newest Access Free Tools Coverage export in Downloads; use `node scripts/import-google-coverage-export.mjs --dir="C:\path\to\export"` only when the folder is elsewhere. The export gives issue bucket counts, not exact URL samples, so do not invent affected URLs.
- When the user provides a CrawlScout/deindexed URL CSV export, run `npm run crawlscout:import` for the newest matching file in Downloads, or `node scripts/import-crawlscout-export.mjs --file="C:\path\to\deindexed.csv"` when the file is elsewhere, and use `output/crawlscout/crawlscout-summary.json` as local evidence. This import records the provided URL sample only; do not treat it as a full crawl total unless the export contains full totals.
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
- Approved smoke-kawaii tool and guide images from `docs/smoke-kawaii-image-system.md`, including gallery backlinks and image sitemap coverage. Do not treat queued or draft art as public-ready.
- A truthful audit record. Only mark a tool `deep-reviewed` after the exact tool page, FAQ, examples, blog, formula/logic, privacy/trust wording, and related links have been individually checked.
- FAQs are for real user help, AI/crawler understanding, and conversion clarity, not for chasing FAQ rich results. Never add hidden FAQ text or schema that is not visible on the page.

## Article Writing Standard

- Use `docs/article-writing-agent-standard.md` before drafting or editing blog guides, Medium posts, or longer promotion content.
- Use `docs/writing-quality-system.md` and the installed `clear-technical-writing` skill after factual, brand, reader-first, and Stop Slop review. Run `npm run writing:quality -- --mode=editorial <path>` for public copy and `--mode=technical` for procedures, errors, warnings, and safety text. Clarity warnings are diagnostic; defined hype, false-certainty, public agent text, and em dashes remain hard failures.
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
- Owner channel correction from 2026-08-08: active editorial and promotion channels are limited to the Access Free Tools blog, Medium, Bluesky, and Pinterest. `scripts/lib/promotion-channel-policy.mjs` is the machine-readable source of truth.
- Quora is retired by the owner, Reddit is blocked, LinkedIn is not in use, and Flipboard is unverified/inactive. Do not create tasks, recommendations, scheduled reviews, or public actions for them. Treat older setup notes as history only.
- Other publishing and social platforms, including DEV Community, stay inactive unless the owner explicitly reactivates them.
- Pinterest Business is active at `https://au.pinterest.com/accessfreetools/`.
- Medium is active at `https://medium.com/@accessfreetools`.
- Bluesky is active at `https://bsky.app/profile/accessfreetools.bsky.social`; run `npm run promotion:bluesky:quality` before posting and require a public post URL.
- The Access Free Tools blog is the primary canonical publishing channel. Deploy through Astro 7 on Node 24 and verify the public page before promotion.
- Never store promotion account passwords in Git, docs, automation prompts, reports, or generated output.
- For promotion account browser work, do not use the in-app Browser Use surface. Use an external browser workflow only, and be explicit when access is blocked.
- Use the local `chrome-social-promotion` skill for external Chrome promotion work on Medium, Pinterest, and Bluesky. It stores the platform navigation/proof checklist so future agents do not rediscover the same browser steps.
- Check Codex Chrome control with `npm run automation:chrome-check` before relying on native Chrome-control automation. For `@chrome`, use the Chrome skill and its extension browser runtime; do not wait for a separate `chrome.*` tool namespace. The callable path runs through the generic browser runtime with `agent.browsers.get('extension')`.
- Chrome diagnostic note from 2026-07-13: the current extension is named `ChatGPT` and describes itself as `Control Chrome with ChatGPT.` The diagnostic distinguishes installed, enabled, native-host registered, and actual runtime connectivity. A passing install check does not prove live tab access; follow the Chrome skill recovery flow when `agent.browsers.get('extension')` is unavailable.
- Chrome status note from 2026-05-08: Chrome and Edge both have the Codex extension installed and native host registered. After restarting Codex, the Chrome skill path worked: it listed the live Chrome tabs, found Medium and Pinterest, claimed the Medium tab read-only, verified the live Stories page, and released the tab without closing it. Later the same day, the path was retested from this thread and successfully claimed `https://medium.com/me/stories?tab=posts-published`, confirmed Medium page text, and released the tab without changes.
- Chrome status note from 2026-05-10: when multiple Chrome extension backends are listed, use the backend whose `user.openTabs()` returns the user's real logged-in social tabs. Claim tabs with `chromeBrowser.user.claimTab(tabId)` before using Playwright-style locators. Bluesky public posting was verified by opening the public profile and extracting the visible post permalink before updating the queue.
- About page lesson from 2026-05-10: `/about/` should read like the mission page for a growing free utility app website, with balanced visual layout and concrete tool-library goals. Do not let it collapse into a generic SEO/audit process page or duplicate `/why-access-free-tools/`.
- Use `docs/promotion-account-launch-kit.md` only as historical setup context. Current public work is limited by the four-channel policy.
- Use `docs/promotion-account-registry.md` before creating or updating promotion, directory, backlink, or brand profiles. It is the current source of truth for which accounts are live, blocked, deferred, or still need proof.
- Use `docs/promotion-queue.md` as the working list of pages to promote and their status.
- Use `docs/promotion-share-kit.md` for safe profile bios, draft posts, and approval checks.
- The agent may draft posts, recommend pages, prepare helpful replies, run SEO checks, submit discovery signals, and report opportunities.
- The agent must not post publicly, send emails, run paid ads, create affiliate placements, or impersonate unrelated users without explicit approval.
- Promotion should be useful first: answer the question, explain the calculation, disclose ownership when linking, and avoid spam tactics.
- Never mark promotion work as `posted`, `updated`, or `done` from a submit button alone. A public URL or profile/feed view must visibly prove the change is live.
- Automation prompts should avoid overlap: one daily overview owns routine indexing/promotion status, platform agents own platform-specific draft quality, weekly QA owns code/site checks, and monthly OnPage owns paid production crawling.
