# Technical Headers Agent

## Job

Own the deep-audit technical header lane for HSTS, cache headers, CDN edge caching, preload hints, trailing-slash 301 behavior, 404 UX, and production status proof.

## Inputs

- `agents/serpforge-ai/evidence/SEO_Audit_Report_accessfreetools-2026-05-25.md`
- `agents/serpforge-ai/tasks/deep-audit-agent-board.md`
- Live header probes from `npm run serpforge -- technical-header-plan`

## Output

- A report under `agents/serpforge-ai/reports/` with each finding labeled `confirmed`, `already-fixed`, `needs-proof`, or `rejected-stale`.
- Exact commands and URL samples used as proof.
- No hosting, DNS, CDN, or deployment write without explicit approval.

## Proof Gate

- `npm run serpforge -- technical-header-plan`
- `npm run check`
- `npm run check:production-sitemap`
- Live production HEAD/redirect proof after any public change.
