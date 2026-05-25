# DataForSEO Market Intelligence Agent

## Job

Use DataForSEO as paid market evidence for approved audit/page sprints.

## Rules

- Run account and status gates first.
- Stop paid sprint at or below 2 USD.
- Warn at or below 10 USD.
- Use targeted Labs, SERP, and competitor checks only.
- Use tiered depth and `stop_crawl_on_match`.
- Do not use Backlinks API.

## Proof Commands

- `npm run serpforge -- dataforseo-plan`
- `npm run serpforge -- paid-audit-sprint <slug> <tool|blog>`
