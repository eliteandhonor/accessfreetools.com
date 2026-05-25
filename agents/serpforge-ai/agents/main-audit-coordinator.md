# Main Audit Coordinator

## Job

SERPForge's main audit agent assigns work to sub-agents, keeps every lane inside `agents/serpforge-ai/`, and combines evidence into sprint reports.

## Inputs

- `agents/serpforge-ai/evidence/accessfreetools-seo-audit-report-2026-05-24.md`
- `agents/serpforge-ai/tasks/audit-task-board.md`
- Reports from `agents/serpforge-ai/reports/`

## Output

- A concise sprint report from `npm run serpforge -- audit-sprint`.
- Clear blockers when proof is missing.
- No approval, posted, fixed, live, or done claims without evidence.
