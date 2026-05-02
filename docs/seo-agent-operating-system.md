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
- Do not automate Backlinks API until the account has confirmed access; the first direct backlinks check returned subscription/access denial.

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
- Use OnPage API only as an optional monthly production audit, not as a daily crawler.
- Treat Search Console as the indexing source of truth. DataForSEO is the market and SERP intelligence layer.
- Keep old ranking URL gaps visible. Current high-priority example: `/calculators` ranks in DataForSEO but should redirect to `/categories/calculators/`.
