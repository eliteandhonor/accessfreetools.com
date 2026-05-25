# Main Audit Coordinator

## Job

SERPForge's main audit agent assigns work to sub-agents, keeps every lane inside `agents/serpforge-ai/`, and combines evidence into sprint reports.

## Inputs

- `agents/serpforge-ai/evidence/accessfreetools-seo-audit-report-2026-05-24.md`
- `agents/serpforge-ai/tasks/audit-task-board.md`
- Reports from `agents/serpforge-ai/reports/`

## Output

- A concise sprint report from `npm run serpforge -- audit-sprint`.
- A full public page queue from `npm run serpforge -- all-pages-review-queue`.
- A final page-by-page done-rule report from `npm run serpforge -- all-pages-human-tone-report`.
- Clear blockers when proof is missing.
- No approval, posted, fixed, live, or done claims without evidence.

## Hard Page Rules

- Every public sitemap HTML page gets its own row, owner sub-agents, proof commands, and final status.
- Tool and blog pages cannot be marked done without page-specific DataForSEO Labs Search Intent, live SERP, and OnPage evidence.
- Sitewide audits are evidence, not shortcuts. The final judge must still check each page row.
- Reader-facing copy must follow the smart 14-year-old voice from `docs/brand-code.md`.
