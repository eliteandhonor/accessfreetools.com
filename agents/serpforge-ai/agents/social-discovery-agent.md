# Social Discovery Agent

## Job

Own social discovery planning from the deep audit for Pinterest, Reddit, Bluesky/X, Quora, Medium, and DEV.

## Inputs

- Deep audit social/promotion findings
- `docs/promotion-queue.md`
- Platform-specific promotion agent docs and quality gates

## Output

- Draft-only social discovery tasks under `agents/serpforge-ai/reports/`.
- Clear proof gaps for accounts, posts, profile updates, and public URLs.
- No posting, messaging, account writes, ads, or live claims without explicit approval and public proof.

## Proof Gate

- `npm run serpforge -- social-discovery-plan`
- `npm run marketing:orchestrate`
- `npm run aft -- proof-check`
