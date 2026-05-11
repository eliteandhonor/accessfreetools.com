# SEO Agent Operating System

This file adapts the five-agent SEO tutorial prompt pack into Access Free Tools' actual workflow.

## Local Commands

Before using Search Console commands, keep the OAuth client file local at
`.local/google-search-console-client-secret.json`, set `GSC_CLIENT_SECRET_PATH`,
or pass `--client-secret=...`. Do not commit OAuth client files or saved tokens.

```bash
npm run dataforseo:account -- -- --min-balance=2
npm run dataforseo:status
npm run dataforseo:status:sandbox
npm run search-console -- -- --site=https://accessfreetools.com/
npm run search-console -- -- --inspect-key-urls
npm run seo:self-evaluate
npm run check
```

## Cost Guardrail

- DataForSEO is active and should be used for SEO research.
- Keep credentials only in local Codex config or environment variables.
- Check API health with `npm run dataforseo:status` before paid research.
- Use `DATAFORSEO_SANDBOX=true` or `npm run dataforseo:status:sandbox` to test new endpoint shapes before paid production calls.
- Warn when balance is at or below `$10`, stop broad paid research at `$5`, and top up when `npm run dataforseo:account -- -- --min-balance=2` reports `TOP UP NEEDED`.
- Avoid large keyword batches unless the user asks for deeper paid research.
- Do not run top-100 SERP checks for every keyword. Use priority tiers, targeted ranges, and `stop_crawl_on_match` before paying for deep rank tracking.
- Do not automate Backlinks API until the account has confirmed access; the first direct backlinks check returned subscription/access denial.
- The standalone DataForSEO balance-watch automation was removed on 2026-05-09 because balance checks already run inside the daily SEO/promotion review, weekly SEO self-evaluation, monthly OnPage crawl, and deep audit. Do not recreate a top-up-only automation unless all of those owners are disabled.

## DataForSEO Knowledge Base Rules

The source-backed implementation notes live in `docs/dataforseo-knowledgebase-notes.md`.

- Tier keywords before SERP API calls:
  - Tier A: key revenue/trust pages, recent launches, Search Console impression pages, and page-one opportunities. Check deeper only when the decision needs it.
  - Tier B: useful supporting tools and guides. Check about top 30 to 50.
  - Tier C: long-tail ideas. Check page one only, or wait until Search Console shows impressions.
- Use `stop_crawl_on_match` when checking whether Access Free Tools ranks for a keyword.
- Use `depth`, `max_crawl_pages`, `offset`, and `limit` to inspect the ranking range we care about instead of crawling everything.
- Refresh Tier A weekly, Tier B every two to four weeks, and Tier C monthly or on demand.
- Save every paid run under `output/` so we do not lose Live-result context.
- Keep AI/GEO visibility checks as a later experiment. Normal indexing, helpful calculator pages, and Search Console progress come first.

## Prompt Pattern Rules

These rules come from Google Search Central quality guidance, DataForSEO operating notes, and the 2026-05-09 review of SEO prompt examples for ranking work. Adapt the patterns to Access Free Tools; do not copy local-business prompts that are meant for Google Business Profile or city-service pages.

### Context Loader

Before recommending changes, each SEO agent should quickly load:

- Site mission: free utility app website aiming to become a very large practical tool library.
- Current page type: tool, blog guide, category hub, legal/trust page, promotion page, or social companion post.
- Evidence source: Search Console, DataForSEO, local QA, production page, promotion queue, or competitor SERP.
- Active constraints: no fake ad boxes, no password storage, no broad paid SERP crawls, no public promotion claim without live proof.

### Opportunity Finder

For SEO work, prefer this order:

1. Search Console queries and pages with impressions, weak CTR, or positions 8-20.
2. Internal-link gaps from category hubs, related tools, guides, and promotion pages.
3. DataForSEO SERP checks only for high-value pages where title, meta, FAQ, or content structure decisions need competitor context.
4. New content ideas only when they add a real tool, real explanation, or real guide. Do not create thin keyword pages just because a phrase exists.

### Output Shape

Every SEO-agent recommendation should include:

- URL or slug.
- Evidence and date.
- Problem in plain language.
- Exact fix, not only strategy.
- Priority.
- Proof check after the fix.

For long reports, use the short executive format: 3 wins, 3 issues, 1 best next action, then evidence links or output paths.

## Agent Roles

### SEO Health Reporter

Runs weekly. Uses Search Console, URL inspection, DataForSEO domain/keyword data, and local QA checks. Produces an executive summary, indexing notes, technical issues, and top actions.

### CTR Rewrite Agent

Finds page/query pairs with impressions, ranking visibility, and weak CTR. Uses DataForSEO SERP checks before recommending title or meta rewrites. Avoids clickbait and keeps titles aligned with page intent.

### Content Refresh Agent

Finds pages that need clearer explanations, fresher examples, better FAQs, or stronger internal links. For Access Free Tools, this especially checks whether each blog guide explains the actual current tool UI.

### Page-One Opportunity Agent

Finds queries around positions 8-20 where better on-page content, examples, FAQs, and internal links could move the page closer to page one.

### Content Idea Agent

Uses working Search Console queries and DataForSEO SERP patterns to suggest supporting guides or tool improvements. It should not create thin duplicate pages just because a keyword has volume.

## Autonomous Weekly Run

The weekly agent should:

1. Run `npm run dataforseo:account -- -- --min-balance=2`.
2. Run `npm run dataforseo:status`.

For the scheduled monthly production crawl, prefer:

```powershell
npm run automation:monthly-onpage
```

The wrapper performs the account/status gates first and only then calls the capped DataForSEO OnPage audit.
3. Run `npm run search-console -- -- --site=https://accessfreetools.com/`.
4. Run `npm run search-console -- -- --inspect-key-urls`.
5. Run `npm run seo:self-evaluate`.
6. Run focused QA if code/content changed, and run `npm run check` before any GitHub update.
7. Report recommendations to the user. Do not auto-push code unless the user explicitly asks.

## Output Standard

Every recommendation should include:

- URL or tool slug.
- Evidence from Search Console, DataForSEO, local QA, or page content.
- Why it matters.
- Priority: High, Medium, or Low.
- Exact next action.

## DataForSEO Endpoint Rules

- Use DataForSEO Labs for weekly ranked keywords, SERP competitors, domain visibility, and related keyword ideas.
- Use SERP API only for targeted title/meta checks before changing high-value pages; prefer Standard SERP for non-urgent checks and Live only when instant results are needed.
- Use OnPage API only as an optional monthly production audit, not as a daily crawler. Start with a small crawl or priority URL queue before a larger scan.
- Use OnPage API for production-only proof when needed: duplicate tags, duplicate content, resources, redirect chains, non-indexable pages, waterfall/page-speed signals, and browser-rendered Core Web Vitals-style checks.
- If OnPage API fails, check robots.txt, noindex/nofollow tags, first-crawl URL, redirects, DNS, and crawler blocking before rerunning paid scans.
- Treat Search Console as the indexing source of truth. DataForSEO is the market and SERP intelligence layer.
- Keep old ranking URL gaps visible. Current high-priority example: `/calculators` ranks in DataForSEO but should redirect to `/categories/calculators/`.
