# Search Engine Land SEO Task Board

Last updated: 2026-07-13

This board converts the Search Engine Land research pass into concrete Access Free Tools tasks. It is for Codex agents working on SEO, indexing, AI visibility, content quality, internal links, analytics, and promotion.

## Sources Reviewed

- `https://searchengineland.com/`
- `https://searchengineland.com/feed`
- `https://searchengineland.com/soft-404s-indexing-issues-traffic-collapse-477116`
- `https://searchengineland.com/google-to-no-longer-support-faq-rich-results-476957`
- `https://searchengineland.com/guide/optimize-for-ai-crawlers`
- `https://searchengineland.com/guide/ai-crawler-tools-software`
- `https://searchengineland.com/vibe-coding-seo-advantage-477069`
- `https://searchengineland.com/guide/entity-first-content-optimization`
- `https://searchengineland.com/guide/semantic-depth`

## Core Lessons For Access Free Tools

1. Indexing and crawl health are the first priority because an older version of the site existed before the current Astro build.
2. FAQs still matter for humans and AI understanding, but FAQ rich results should not be treated as the goal.
3. Important page content must be visible in the initial HTML because AI crawlers may not execute JavaScript.
4. Interactive tools are a real SEO advantage when the tool answers the task before the article starts.
5. Brand recognition, mentions, and useful external profiles matter more as AI search systems decide what sources to cite.
6. Large content libraries can become weak if pages feel copied, thin, or generic.
7. Each tool should behave like a clear entity: one topic, one purpose, matching title/H1/schema/category/internal links.

## Task Board

### P0. Indexing Protection System

Status: v1 implemented on 2026-05-13 with `npm run audit:indexing-protection` and `npm run aft -- indexing-protection`.

Goal: catch soft 404s, stale redirects, old URLs, canonical problems, and thin-but-indexable pages before Google or Bing treat them as low quality.

Tasks:

- Add or extend a local indexing audit that checks built pages for status intent, canonical match, sitemap inclusion, noindex mistakes, empty main content, duplicate titles, duplicate descriptions, and suspiciously low text.
- Add legacy URL checks for known old paths such as `/calculators`, `/deep-research`, `/advanced-age-calculator`, and old AdSense/ad-revenue article paths.
- Compare local sitemap URLs against saved Search Console and Bing/CrawlScout discovery reports.
- Flag pages that are "discovered but not indexed," "crawled but not indexed," or "unknown to Google" in the latest saved Search Console snapshot.

Proof required:

- A report under `output/indexing-protection/`.
- Zero high-severity local issues.
- Known redirects still return the expected destination.
- Priority indexing gaps are listed with target internal-link fixes.

Useful commands:

- `npm run aft -- indexing-gaps`
- `npm run aft -- indexing-protection`
- `npm run search-console:inspect-key-urls`
- `npm run audit:indexing-protection`
- `npm run audit:deep:no-paid:fast`
- `npm run check:site`
- `npm run check:links`

### P0. AI Crawler Visibility Audit

Status: v1 implemented on 2026-05-13 with `npm run audit:ai-crawler` and `npm run aft -- ai-crawler`. This v1 checks built initial HTML as a non-JS crawler simulation; live production user-agent fetches can be added later if we need separate production bot proof.

Goal: make sure Google, GPTBot-style crawlers, Claude-style crawlers, Perplexity-style crawlers, and simple non-JS fetchers can see the page purpose, useful explanation, internal links, and trust wording.

Tasks:

- Create an audit that checks priority pages as crawler-like, non-JS initial HTML.
- Confirm initial HTML contains H1, meta description, canonical, visible tool explanation, FAQs or help text, related links, category breadcrumbs, and important disclaimers.
- Confirm non-AI pages do not load AI model assets upfront.
- Confirm AI pages clearly say browser-side tools do not upload user input to Access Free Tools and may download model files unless self-hosted.

Priority pages:

- `/`
- `/tools/`
- `/blog/`
- `/why-access-free-tools/`
- `/categories/calculators/`
- `/categories/ai-tools/`
- `/tools/basic-calculator/`
- `/tools/mortgage-calculator/`
- `/tools/bmi-calculator/`
- `/tools/image-to-text-ocr-tool/`
- `/tools/json-formatter/`
- `/tools/watts-to-amps-calculator/`

Proof required:

- A report under `output/ai-crawler-visibility/`.
- Clear pass/fail by page.
- No critical page depends on client JavaScript for its explanation or internal links.

Useful commands:

- `npm run aft -- ai-crawler`
- `npm run audit:ai-crawler`
- `npm run check:ai-assets`
- `npm run check:structured-data`
- `npm run check:site`

### P0. Top Hub Upgrade Pass

Status: v1 implemented on 2026-05-13. `/tools/` now points people toward major discovery hubs, priority calculators, AI tools, and guide entry points. Category hubs now include priority guide blocks for finance, health, home projects, and AI, plus stronger intent links for calculators, finance, AI, developer, converter, and text-tool discovery. Proof: `npm run audit:hubs` and `npm run aft -- hub-strength` both report 9/9 hubs passed.

Goal: make the major hubs stronger because category hubs help users, Google, AI crawlers, and internal linking.

Tasks:

- Improve `/tools/` as the central free utility library page without making it heavy or generic.
- Improve `/categories/calculators/` for calculator discovery and internal links to the highest-value calculators.
- Improve `/categories/ai-tools/` with privacy-first browser AI wording and clear model/download limits.
- Review finance, health, home-project, developer, and conversion category pages for useful intro text and internal links.
- Make sure each hub links to priority guides where the guide adds real explanation.

Proof required:

- Before/after page text review.
- Internal-link count and anchor quality check.
- `npm run check` passes.
- Screenshots for desktop and mobile if visual layout changes.

Useful commands:

- `npm run audit:hubs`
- `npm run aft -- hub-strength`
- `npm run aft -- page-seo tools`
- `npm run aft -- site-sitemap`
- `npm run check`

### P1. Semantic Depth Upgrade For Priority Tools

Status: first priority batch implemented on 2026-05-13. Mortgage, Loan, BMI, Calorie, Income Tax, Salary, Watts to Amps, Wallpaper, Image to Text OCR, and Prompt Token Estimator all passed the built-page semantic depth audit. Fixes from the audit clarified BMI medical limits, Salary pay period wording, and OCR image quality wording. Proof: `npm run audit:semantic-depth` and `npm run aft -- semantic-depth` both report 10/10 priority tools passed.

Goal: upgrade priority tool pages so they answer the real user problem, not only the formula.

Tasks:

- Pick tools in this order: finance, health, pregnancy, tax, electrical, construction, AI, developer, then everyday tools.
- For each page, check that it has:
  - What each input means.
  - Formula or logic in plain language.
  - A realistic example with numbers.
  - How to read the result.
  - Common mistakes.
  - When not to rely on the result.
  - Related internal links.
  - Matching blog guide that uses the actual tool.
- Replace generic FAQs with real questions people would ask.

First suggested batch:

- Mortgage Calculator
- Loan Calculator
- BMI Calculator
- Calorie Calculator
- Income Tax Calculator
- Salary Calculator
- Watts to Amps Calculator
- Wallpaper Calculator
- Image to Text OCR Tool
- Prompt Token Estimator

Proof required:

- Updated manual review notes or audit records only for pages actually checked.
- `npm run check` passes.
- No page is marked manually deep-reviewed without individual proof.

Useful commands:

- `npm run audit:semantic-depth`
- `npm run aft -- semantic-depth`
- `npm run aft -- page-seo mortgage-calculator`
- `npm run check`

### P1. Recognition Tracker

Status: v1 implemented on 2026-05-13 with `npm run recognition:track` and `npm run aft -- recognition`. The July 13 report shows 30 public proof URLs, 0 claimed rows missing proof, and clearly separates blocked platforms from active-with-proof platforms.

Goal: track where Access Free Tools is recognized across the web because AI search and modern SEO rely on brand mentions, not only classic rankings.

Tasks:

- Create a report that reads promotion queue, Medium URLs, Pinterest pins, Quora posts, Bluesky posts, DEV status, Search Console snapshots, Bing notes, and CrawlScout notes.
- Track public proof URLs separately from drafts, blocked channels, and unverified attempts.
- Add a simple "recognition status" per platform:
  - Live profile exists.
  - Public posts exist.
  - Links point to correct pages.
  - Ownership disclosure is present where needed.
  - Platform is blocked or healthy.

Proof required:

- A report under `output/recognition-tracker/`.
- No platform is marked active without public proof.
- Blocked platforms such as DEV or Reddit remain clearly blocked until restored.

Useful commands:

- `npm run recognition:track`
- `npm run aft -- recognition`
- `npm run aft -- proof-check`
- `npm run promotion:weekly-review`
- `npm run marketing:orchestrate`

### P1. Original Data Asset Plan

Status: v1 implemented on 2026-05-13 and hardened on 2026-07-13 with `docs/original-data-asset-plan.md`, `npm run content:usage-notes`, and `npm run aft -- usage-notes`. The report fails closed unless a fresh privacy-safe production aggregate exists; local event files remain QA diagnostics and can never become public-demand evidence. The ignored production token and owner-browser exclusion are now configured, and the first private aggregate fetch succeeded. Current status remains `not-ready` because the only recorded page view was the owner's Privacy Policy setup visit before opt-out and there are zero tool actions. Do not claim visitor, view, or tool-action readiness until genuine production thresholds are met.

Goal: create linkable, useful content that competitors cannot easily copy.

Tasks:

- Use anonymous first-party analytics to identify most-used tools, returning users, and common tool paths once enough data exists.
- Plan a monthly "Access Free Tools Usage Notes" page or blog post.
- Make the report useful, not braggy:
  - Most-used tools.
  - Common calculation categories.
  - Tools people come back to.
  - Mistakes the guides should explain better.
- Keep privacy wording clear and do not expose personal data, IPs, or raw user logs.

Proof required:

- Draft report format.
- Privacy review.
- Analytics dashboard data exists and owner traffic is filtered or clearly excluded.

Useful commands:

- `npm run analytics:production`
- `npm run aft -- usage-summary` (local QA diagnostics only)
- `npm run content:usage-notes`
- `npm run aft -- usage-notes`

### P2. FAQ Strategy Reset

Status: v1 implemented on 2026-05-13 with `docs/faq-strategy.md` and updates to the brand, agent, manual-review, and article-writing guidance. FAQ guidance now says FAQs are for visible user help, AI understanding, and clarity, not rich-result chasing.

Goal: keep FAQs useful while no longer treating FAQ rich results as the main SEO prize.

Tasks:

- Update internal guidance to say FAQs are for users, AI understanding, and conversion clarity, not rich-result chasing.
- Check whether FAQ schema is honest, visible-page-matched, and not overused.
- Improve weak FAQs where they sound template-made.

Proof required:

- Updated guidance in agent docs.
- Structured data checks still pass.
- No hidden or misleading FAQ markup.

Useful commands:

- `npm run check:structured-data`
- `npm run audit:site`

### P2. Promotion Content Quality Upgrade

Status: v1 implemented on 2026-05-13. Medium, Quora, Reddit, Bluesky, DEV, and Pinterest checks now emphasize real reader problems, practical examples, ownership disclosure, useful internal links, no agent-facing text, and public proof before queue updates. Proof: Medium, Quora, Reddit, Bluesky, DEV, and Pinterest quality/report commands passed after stricter gate fixes.

Goal: make every external post feel useful enough that a human would read it, not like a link drop.

Tasks:

- Keep using platform-specific gates for Medium, Quora, Bluesky, Pinterest, Reddit, and DEV.
- Make sure every long article has:
  - A real opening problem.
  - A practical example.
  - Natural internal links.
  - Ownership disclosure.
  - No agent-facing text.
  - Public proof before queue updates.
- Add Search Engine Land's "recognition" lesson to the marketing orchestrator: promotion is not only traffic, it is brand clarity across the web.

Proof required:

- Quality reports pass.
- Public post URL exists before queue status changes to posted.
- No blocked platform is retried blindly.

Useful commands:

- `npm run promotion:medium:quality`
- `npm run promotion:quora:quality`
- `npm run promotion:reddit:quality`
- `npm run promotion:bluesky:quality`
- `npm run promotion:devto:quality`
- `npm run promotion:pinterest:rss-report`
- `npm run aft -- proof-check`

## Recommended Execution Order

1. Keep the implemented indexing, AI crawler, hub, semantic-depth, recognition, FAQ, and promotion systems passing.
2. Watch exact Search Console recrawls; do not reopen completed pages from stale aggregate exports.
3. Collect production Four in a Row evidence through the September 7 pilot gate.
4. Plan the first original data asset only after production analytics and owner exclusion are proven.
5. Keep promotion quality gates strict and proof-based.

## Completion Rule

Do not mark any task complete until there is proof in `output/`, a passing command, a public URL, or a checked file diff. If a task is blocked by account access, OAuth, CAPTCHA, platform suspension, or missing live data, mark it blocked and say exactly what manual action is needed.
