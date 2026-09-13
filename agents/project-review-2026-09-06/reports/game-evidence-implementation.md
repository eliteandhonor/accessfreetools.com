# Game Lifecycle And Evidence Follow-up

September 6, 2026. Main review worktree, HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25` plus dirty changes. EV-05 and the game portion of UX-01 remain in progress, not approved or deployed.

## Implemented

- Starts and completions are emitted once per in-memory round. Undo does not reset either milestone. The visible score still reverses after undo and can be earned again. New round and mode selection reset the flags; neither emits a start until a legal move is made. Replay remains a separate action after a completed round.
- All four milestone action names now use ` (round-v2)`, and the Clarity event names use `_v2`. No round IDs, individual moves, outcomes, identities or extra payload fields were added. Existing logs remain untouched. Legacy totals remain visible but cannot satisfy the corrected-count gate.
- The roving board tab stop selects a playable column. Arrow keys, Home and End skip full columns. Filling the focused column restores focus to a legal column; completing a computer turn restores it only if the user has not moved to another control. Undo/reset preserve board re-entry.
- The game report rejects malformed, duplicated, negative, fractional, non-finite or unsafe milestone counts, and invalid completion/replay ratios. It preserves the server observation date, range and exact game source/target. Local fetch/report timestamps do not refresh old observations.
- A seven-day evidence window, coverage/continuity, owner exclusion, September 7 review date and 100 corrected starts all remain mandatory. A local environment setting no longer proves production owner exclusion. The wrapper accepts the production flag or a fresh verified browser opt-out.

## Tests And Evidence

Logs are under `output/project-review-followup/integration/`:

- `game-lifecycle-red.log`: seven failing mounted cases before the implementation.
- `game-lifecycle-green.log`: seven passing cases using the real React component and rules/AI engine in isolated Chromium, including StrictMode, keyboard Enter/Space, undo/re-win, reset, legal-column focus and interrupted computer-turn focus.
- `game-evidence-red.log` / `game-evidence-green.log`: evidence admission regressions before/after the first helper fix.
- `game-evidence-wrapper-red.log`: three additional red cases for explicit null/missing counts and lost production provenance.
- `game-evidence-lifecycle-green.log`: 82 passing tests across six files, including the corrected wrapper, evidence helper, existing coverage tests, mounted component and engine.
- `game-pilot-local-current.log`: local report regeneration only. Its closed decision gate is not a fresh production fetch or market-demand result.

Current source/tests: `FourInARowGame.tsx`, its new mounted lifecycle test, game report wrapper/helper and their focused tests. The general analytics event schema and historical logs are unchanged. `docs/analytics-dashboard.md` records the version boundary without inventing a deployment date.

## Review Limits

Coordinator source review and targeted tests support the implementation. Independent release judgment is pending: both current specialists stopped with an account usage-limit error after saving their assigned work. No retry with another identity, purchase or usage-reset action was attempted. This does not prevent local verification from continuing.

The full main-site check subsequently passed with 2036 tests, zero dependency findings and the existing soft asset warnings, but a later reporting-only route measurement script still requires its own final integration run. Fresh built discovery proof is separate from mounted game proof. No claim is made about physical mobile devices, production collection, verified analytics continuity, Search Console or live Clarity game behavior. The pilot must not expand from local tests alone.
