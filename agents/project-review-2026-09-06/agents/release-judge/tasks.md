# Assigned Tasks

See [campaign.json](../../campaign.json) for complete conditions. States below are initial allocation, not completed work.

## RJ-01: Judge review completeness and task traceability

Priority: P1. Status: approved. Lane: review. Approval: Release Judge, 2026-09-06, reports/release-judge.md. This is not implementation approval.
Depends on: none.

Completion: Every substantive finding maps to a bounded task or explicitly deferred rationale. Verify source refs, status/owners/dependencies, evidence limits, no application changes and original dirty preservation. Approval covers review only, not implementation.

Evidence command(s): `node agents/project-review-2026-09-06/verify.mjs`.
Evidence output: `output/project-review-followup/RJ-01/`.

## RJ-02: Approve each future release only after its selected tasks pass

Priority: P1. Status: blocked. Lane: release.
Depends on: the exact selected release's tasks, their dependencies, a fresh green full check and live-action authority. No unrelated all-project dependency is imposed on a narrow repair.

Completion: For each narrow proposed release, verify acceptance and relevant dependencies plus clean source/lock and fullcheck. Obtain live-action authority; then Node24Astro7 deployment, exact revision and public functional proof. Submit only actual changed eligible URLs. Never bundle every task into one release.

Evidence command(s): `npm run check; npm run hostinger:status; npm run check:live-ask; npm run check:production-sitemap`.
Evidence output: `output/project-review-followup/RJ-02/`.

Current gate, September13: security18ebd554 has shipped with Linux CI and live
Node24/API/MCP/sitemap proof. Clean correctness candidate0c78956b has independent
local acceptance,902tests/132browser cases, but requested bounded owner
push/deploy approval is unanswered. Its Linux CI/live source identity remain
unperformed. R/T are not included; broader patches retain separate gates.
See ../../reports/local-verification-closeout-2026-09-13.md.
