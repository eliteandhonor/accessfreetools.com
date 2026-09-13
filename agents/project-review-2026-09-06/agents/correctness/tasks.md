# Assigned Tasks

See [campaign.json](../../campaign.json) for complete conditions and current task states. Local approval does not establish production deployment.

## COR-01: Preserve Ask units and explicit qualifiers

Priority: P1. Status: approved. Lane: main. Independent Release Judge: [exact task decision](../../reports/ask-routing-task-acceptance.md).
Depends on: none.

Completion: Three-phase/PF, metric concrete and per-1000 token questions preserve complete inputs or decline. Assert structured inputs plus results. Parser-first and fallback paths cannot silently reinterpret units; tests never call external models.

Evidence command(s): `npm test; npm run aft -- ask-audit`.
Evidence output: `output/project-review-followup/COR-01/`.

## COR-02: Reject partial numeric and date-question matches

Priority: P1. Status: approved. Lane: main. Independent Release Judge: [rejudge after grouped-expression fix](../../reports/ask-routing-task-acceptance.md).
Depends on: COR-01.

Completion: 18% of 1,000 returns180; chained arithmetic and ISO date questions route correctly or decline, never succeed on a prefix. Cover grouping, sign, decimals, scientific notation and leftover operators with no-network REST tests.

Evidence command(s): `npm test; npm run aft -- ask-audit`.
Evidence output: `output/project-review-followup/COR-02/`.

September 6: the original rejection remains recorded. The terminal calculation
classifier now declines unsupported grouped expressions before provider
fallback; the judge's final 648 cases pass with no real network calls. This
approves only COR-01/02 locally, not all Ask behavior or production deployment.

## COR-03: Fix month-end age and date decomposition

Priority: P2. Status: approved. Lane: main. Independent Release Judge: [exact task decision](../../reports/correctness-numeric-task-rejudge.md). No deployment or campaign approval.
Depends on: none.

Completion: Jan29/30/31, leap/non-leap Feb and reversed intervals use one documented convention. Components never negative; reconstructed later date and total days agree; verify browser and REST/MCP output.

Evidence command(s): `npm test; npm run test:smoke`.
Evidence output: `output/project-review-followup/COR-03/`.

## COR-04: Return explicit errors for non-finite tool results

Priority: P2. Status: approved. Lane: main. Independent Release Judge: [exact task decision](../../reports/correctness-numeric-task-rejudge.md). No deployment or campaign approval.
Depends on: none.

Completion: Overflow in basic, percentage and mortgage calls cannot serialize as ok:true with numeric null. REST returns existing error contract and MCP isError:true. Recursively check numerical results without rejecting intentional domain nulls.

Evidence command(s): `npm test; npm run aft -- api-ready; npm run aft -- mcp-smoke`.
Evidence output: `output/project-review-followup/COR-04/`.

## COR-05: Stabilize near-zero loan-rate mathematics

Priority: P2. Status: approved. Lane: main. Independent Release Judge: [exact task decision](../../reports/correctness-numeric-task-rejudge.md). No deployment or campaign approval.
Depends on: COR-04.

Completion: Small positive rates converge to zero-rate payment; total paid is at least principal within numerical tolerance. Independent reference covers ordinary/extreme supported rates and direct helper consumers; no negative interest from the reproduced cancellation error.

Evidence command(s): `npm test; npm run test:smoke`.
Evidence output: `output/project-review-followup/COR-05/`.

## COR-06: Align REST/MCP execution policy and bound Ask waits

Priority: P2. Status: approved. Lane: main. Independent Release Judge: [exact COR-06 acceptance](../../reports/ask-execution-task-acceptance.md). Not production approval.
Depends on: COR-02, SEC-01.

Completion: Document shared beta/public policy. Test configured/unset token, wrong/query credentials, discovery, 429 and MCP init/list/call. Mocked stalled request/body aborts by deadline; disconnect cancels upstream; UI recovers. No unsupported production per-IP guarantee.

Evidence command(s): `npm test; npm run check:live-ask`.
Evidence output: `output/project-review-followup/COR-06/`.
