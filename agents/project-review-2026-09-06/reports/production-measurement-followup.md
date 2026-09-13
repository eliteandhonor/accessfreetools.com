# Production Measurement Follow-up

September 6, 2026. Read-only aggregate refresh; no deployment, storage change,
test events, public promotion or task approval.

## Commands And Observation Dates

The coordinator ran these from the review worktree. All exited 0:

```text
npm run analytics:production
npm run analytics:production:game
npm run pilot:four-in-a-row
```

The existing ignored analytics configuration in the original checkout was
referenced through `AFT_ANALYTICS_CONFIG`. No credential was copied into this
report, source control or another configuration file. Local QA event logs were
not used as production evidence.

| Evidence | Original Observation (UTC) | Local Report (UTC) |
| --- | --- | --- |
| `output/analytics/production-latest.json` | 11:30:05.396 | 11:30:08.236 |
| `output/analytics/production-four-in-a-row-game-latest.json` | 11:30:20.254 | 11:30:23.295 |
| `output/game-pilot/four-in-a-row-latest.json` | Uses the preceding game observation | 11:30:24.286 |

## Retained Observations, Not Complete-Period Totals

The current aggregate contains 44 visitors, 71 page views and 246 tool actions.
Random Number Generator accounts for 194 actions and Kawaii Calculator for 41.
An action is an event, not a unique person. These numbers describe the retained
observations only and must not be compared with older reports as a traffic trend.

The requested general interval is August 7 to September 6, but both responses
lack production coverage metadata and verified deployment continuity. The
consumer correctly records:

```text
coverage.status = unknown
coverage.retainedRead = unknown
coverage.reasons = coverage-metadata-missing, deployment-continuity-unverified
coverage.comparisonsAllowed = false
coverage.allTimeScope = retained-events-only
```

Production reports owner exclusion configured. That is not proof of continuous
retention or a complete measurement interval. EV-04 remains in progress until an
authorized deployment and observed storage continuity establish those facts.

## Four In A Row

The refreshed pilot remains `collecting`, with `measurementReady: false`.
There are zero retained game starts, not proof of zero starts across an unknown
retention period. The corrected `round-v2` event definition is absent from the
production response. Coverage is unknown; the September 7 review date and
100-start requirement also remain unmet at this observation time.

No additional game or Games category is justified. EV-05 remains in progress.
The local lifecycle tests and closed decision gate do not establish live
deployment or demand. No threshold, event definition, requested period or
acceptance rule was relaxed during this refresh.

## September 8 Refresh

The same three read-only production commands exited 0 again. The general
response was observed at 2026-09-08T11:46:34.061Z, the game response at
11:46:35.372Z, and the pilot decision at 11:46:37.264Z. Existing configuration
was referenced in place; no local QA events or raw visitor records were used.

The retained aggregate now contains 25 visitors, 28 page views and 56 tool
actions: Random Number Generator 51, Kawaii Calculator 3, Mileage 1, Pension 1.
This is not a decline comparison with September 6: the requested August 9 to
September 8 interval still has unknown retention coverage, missing coverage
metadata and unverified deployment continuity. Comparisons remain disabled.

The game decision is now `needs-more-evidence`, not `collecting`: September 7
has passed, but `round-v2` remains absent, coverage is unknown and zero retained
starts do not meet the 100-start gate. No new game/category is authorized by
these observations. EV-04 and EV-05 remain in progress.

The environment check reports missing worktree-local GSC/Hostinger credentials.
That is not an account outage: the existing Hostinger OAuth MCP returned its
latest build read-only. Build `01a076ca-b9a4-720d-9750-51ede0875ea3` completed
September 6 at 12:57:52Z with Node 24, Astro, `dist`, `build`, `app.js` and npm.
Evidence is `output/hostinger/node24-mcp-observation-2026-09-08.json`.
It supplies neither deployed Git SHA identity nor durable analytics proof.
No hosting write, credential replacement or deployment was performed.
