# Access Free Tools Agent Memory

This repo is a long-running utility-site project. Future Codex agents should keep these standing rules.

## SEO Data Sources

- Use Google Search Console for real indexing, click, impression, CTR, and average-position data.
- Use DataForSEO for competitor research, live SERP checks, keyword discovery, and domain/keyword baselines when the task involves SEO research.
- DataForSEO credentials must stay out of Git. They live in the local Codex MCP config or environment variables.
- Check DataForSEO balance with `npm run dataforseo:account -- -- --min-balance=2`.
- Tell the user to top up when the DataForSEO balance is at or below 2 USD, or when DataForSEO returns billing/account errors.

## New Tool Standard

Every new public tool should include:

- A researched, working browser tool.
- Plain-language input explanations, formula/logic notes, examples, mistakes to avoid, and result interpretation.
- Six or more useful FAQs.
- A matching blog guide at `/blog/how-to-use-{slug}/` that uses the actual tool.
- Related tools, category placement, icon mapping, search terms, sitemap coverage, and structured data.
- A truthful audit record. Only mark a tool `deep-reviewed` after the exact tool page, FAQ, examples, blog, formula/logic, privacy/trust wording, and related links have been individually checked.

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
