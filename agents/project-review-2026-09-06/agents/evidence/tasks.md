# Assigned Tasks

See [campaign.json](../../campaign.json) for complete conditions and current task states. Saved-report acceptance does not establish today's Google state.

## EV-01: Unify observation provenance across SEO and pilot consumers

Priority: P2. Status: approved. Lane: main. Independent Release Judge: [exact EV-01 acceptance](../../reports/evidence-pipeline-task-acceptance.md). Current live Google state is not certified.
Depends on: none.

Completion: Newest per-URL actual observation wins across nested merges and worktrees; original source paths/dates remain stable. Prelaunch/future/stale/missing evidence cannot activate a pilot. OldPASS/newfailure and reverse fixtures preserve partial URL sets; wrappers cannot refresh source age.

Evidence command(s): `npm test; npm run aft -- indexing-gaps; npm run marketing:orchestrate`.
Evidence output: `output/project-review-followup/EV-01/`.

## EV-02: Make provider status and independent refreshes truthful

Priority: P2. Status: approved. Lane: main. [Exact EV-02 acceptance](../../reports/evidence-pipeline-task-acceptance.md) by the independent Release Judge. Synthetic refresh proof is not live GSC or scheduler readiness.
Depends on: none.

Completion: Disk-only account data is cached with age; current attempt state distinct. Mocked DataForSEO failure does not prevent GSC refresh or become a topup claim. No paid research/submissions added; fresh complete/partial outcomes exposed in JSON and CLI.

Evidence command(s): `npm test; npm run automation:env-check; npm run aft -- status`.
Evidence output: `output/project-review-followup/EV-02/`.

## EV-03: Respect successful and intentionally excluded indexing states

Priority: P2. Status: approved. Lane: main. The [dated exact task rejudge](../../reports/evidence-pipeline-task-acceptance.md#ev-03-frozen-fix-rejudge-2026-09-06) closes the weekly serialization blocker after unchanged failed probes, 14 independent guards and 212 focused contract tests pass. Original rejection remains historical; this is local acceptance only.
Depends on: EV-01.

Completion: All PASS variants are non-recovery; intentional TTS/feeds/support noindex remains excluded/monitor. Unexpected noindex still fails. Link Helper/SEO Console/marketing use common policy; protect Kawaii and completed604unit queue.

Evidence command(s): `npm test; npm run aft -- indexing-gaps; npm run aft -- link-helper; npm run audit:indexing-protection; npm run aft -- site-sitemap`.
Evidence output: `output/project-review-followup/EV-03/`.

## EV-04: Report analytics coverage and exclude private dashboard traffic

Priority: P2. Status: in_progress. Lane: main. [Local fixes independently rejudged](../../reports/analytics-coverage-final-rejudge.md); durable production interval/continuity remains unverified.
Depends on: none.

Completion: 16/25MiB and120000event fixtures yield exact bounded totals or explicit partial coverage. Requested period never implies full coverage. Private/admin/API normalized paths excluded client/server. Document active-log retention and verify durable production interval before comparisons; no unbounded read or real-log deletion.

Evidence command(s): `npm test; npm run analytics:production; npm run analytics:production:game`.
Evidence output: `output/project-review-followup/EV-04/`.

## EV-05: Make game lifecycle events and pilot decisions valid

Priority: P2. Status: in_progress. Lane: main. [Local lifecycle/report fixes pass](../../reports/game-evidence-implementation.md); independent approval and production definition/coverage remain unproven.
Depends on: EV-01, EV-04.

Completion: Win/undo/re-win emits one completion; first-move undo/replay one start per in-memory round. Impossible rates block conclusions. Fresh dated production evidence, owner exclusion, Sep7date and100starts all required. No moves/identities recorded; no new game/category.

Evidence command(s): `npm test; npm run analytics:production:game; npm run pilot:four-in-a-row`.
Evidence output: `output/project-review-followup/EV-05/`.
