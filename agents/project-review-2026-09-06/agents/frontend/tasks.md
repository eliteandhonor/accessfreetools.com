# Assigned Tasks

See [campaign.json](../../campaign.json) for complete conditions. The [independent exact task decisions](../../reports/frontend-task-acceptance.md) approve UX-01/02/03 locally. No deployment or accessibility conformance is claimed.

## UX-01: Preserve keyboard position in reveals, themes and game board

Priority: P2. Status: approved. Lane: main.
Depends on: none.

Completion: Enter/Space reveal continues into new tool/blog/gallery items; keyboard theme choice restores trigger. Game roving tabindex skips full columns and remains re-enterable. Search focus visibly distinguishable; tests390/768/1365plus reset/undo/delayed load.

Evidence command(s): `npm run test:smoke; npm run check:accessibility; npm run check:key-visual`.
Evidence output: `output/project-review-followup/UX-01/`.

## UX-02: Shorten mobile/tablet path from tool search to results

Priority: P2. Status: approved. Lane: main.
Depends on: UX-01.

Completion: Compact accessible category selector at<=980px preserves all crawlable category links and desktop rail. Tablet search and first result appear without full rail scroll; mobile selected/typed results reachable immediately. Screenshot320/390/768/980/1081/1365with no overlap.

Evidence command(s): `npm run check:key-visual; npm run check:accessibility; npm run check:site`.
Evidence output: `output/project-review-followup/UX-02/`.

## UX-03: Keep unresolved accessibility checks and measure route costs

Priority: P2. Status: approved. Lane: measurement.
Depends on: UX-01.

Completion: Persist axe incomplete/nonblocking rule IDs/nodes with manual-review status; automated pass is not conformance approval. Measure cold/warm route costs with conditions and real-device limitations; optimize CSS only from measured cost, preserve lazy models.

Evidence command(s): `npm run check:accessibility; node scripts/check-accessibility.mjs --theme-matrix; node scripts/measure-route-costs.mjs; npm run check:performance; npm run check:ai-assets`.
Evidence output: `output/project-review-followup/UX-03/`.

### Production Follow-Up For UX-03

The [07:43-07:47 UTC Clarity follow-up](../../reports/clarity-dead-click-followup.md) narrows dead clicks to Kawaii display/history/container targets and records its route-level performance signals. Reproduce in owner-excluded Chrome/Edge before choosing a fix. The local measurement task is approved, not deployed or field-approved. Protect Kawaii metadata, math and private-data boundaries. No visitor replay or production mutation was performed.
