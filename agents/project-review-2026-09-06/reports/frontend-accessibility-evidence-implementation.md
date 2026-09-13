# Accessibility Evidence And Route Costs

September 6, 2026. Review worktree `accessfreetools-gpt6-review`, HEAD `243d71d1d832b398cba86d5c7fcc70deefa25f25` plus uncommitted fixes. UX-03 remains in progress. These results do not establish conformance, production speed, independent approval or deployment.

## Reporting Contract

The accessibility checker now persists blocking and nonblocking violations and axe incomplete findings, including rule IDs, node targets, check messages, help links and explicit pending manual-review state. It omits node HTML and opaque check data. The existing serious/critical/moderate-landmark blocking policy is unchanged. An automated pass never implies manual completion or conformance. The report is for isolated owned static pages without submitted input, not a general-purpose sanitizer for arbitrary private DOM content.

`node scripts/check-accessibility.mjs --theme-matrix` selects all ten actual theme swatches on Tools, Blog and Finance Gallery at desktop, tablet and mobile widths. It verifies both the applied and persisted theme, not merely opening the menu. Default 27-case evidence and the separate 90-case theme report use different files.

The first matrix applied all 90 requested themes but failed. A checker sequencing error tested the first Tab after a theme click had changed focus origin. The coordinator moved initial keyboard-entry checks before theme selection while retaining axe analysis after selection. A regression assertion preserves that sequence; the full browser rerun remains a distinct gate.

The same run found eight real blocking contrast cases: selected tool filters/category controls in desktop Coral/Lagoon, plus the Gallery artwork button in those looks at all three widths. White-on-Coral measured 3.89:1 and white-on-Lagoon 4.09:1 against the required 4.5:1. Scoped selectors now use the existing `--primary-strong` token. Palette definitions, artwork, other button families and public copy were not rewritten.

Evidence in `output/project-review-followup/integration/`:

- `accessibility-theme-matrix-red.json` preserves the complete first matrix, including all unresolved nodes and failures.
- `selected-theme-contrast-red.log` records an initial fixture error: axe requires an explicit browser context. It is not product-failure evidence.
- `selected-theme-contrast-valid-red.log` reproduces two actual contrast failures and the checker ordering failure after fixing that fixture.
- `selected-theme-contrast-green.log`: all 44 targeted checks pass, including ten selected-look contrast fixtures with zero incomplete results for the scoped controls.
- `check-game-frontend-final.log`: full check passes with 2050 tests in 97 files; 27 default axe cases pass with 55 unresolved findings retained. Those 55 findings are not marked resolved.

## Cold And Warm Baseline

Command: `node scripts/measure-route-costs.mjs`.

Proof: `output/project-review-followup/UX-03/route-costs/2026-09-06T06-54-29.248Z/report.json`. All 72 loads passed: six routes, two viewport sizes, three repetitions and cold/warm pairs. All 65 served built-file hashes stayed unchanged. Zero model attempts, valid timing totals and hydrated initial islands; every warm load demonstrated cached response bodies. Browsers and the ephemeral server closed normally.

Conditions: Chromium 151.0.7922.34, Windows 11 build 26200, Node 24.20.0, 20 logical CPUs; native CPU, loopback HTTP, uncompressed assets, no network throttle. Cold uses a fresh isolated context and cleared HTTP cache; warm uses a new page in that context with static caching enabled. HTML is not cached. CSP blocks external connections/embeds/workers without Playwright routing disabling HTTP caching. No inputs, tool actions or live analytics were sent.

Each navigation records request totals, Resource Timing transfer/encoded/decoded sizes, observed cached bodies, load and DOM-content-loaded timing, LCP, layout-shift sum, long-task count/duration, hydration, failures and observer support. Observations end 1500ms after load. INP is unmeasured; layout-shift sum over this window is not a full-session CLS measurement. Other user workloads were not controlled. Desktop/mobile below mean viewports, not physical-device support.

Median desktop transfer KiB across three runs:

| Route | Cold | Warm |
| --- | ---: | ---: |
| Tools | 604.2 | 204.6 |
| Percentage | 628.3 | 44.0 |
| Finance Gallery | 1041.9 | 197.0 |
| Free AI Skills editorial | 554.8 | 43.2 |
| OCR | 511.3 | 42.2 |
| TTS | 600.6 | 59.3 |

Mobile Finance Gallery cold transfer was 652.4 KiB; the other measured route totals matched desktop. Gallery viewport differences reflect initial lazy image loading, not missing links or sitemap changes. Most groups had median zero long tasks. TTS had one approximately 51-56ms median long task in the mobile cold/warm and desktop warm groups. No inference ran. LCP medians of 52-104ms are loopback observations and must not be quoted as real-user performance.

Decision: retain the existing hard asset budgets and model-lazy gate. This establishes a repeatable baseline, not a new production speed budget. Do not split global CSS from its 171 KiB soft warning alone. A later TTS initial-load profile under controlled throttling and a real device can determine whether its small long task warrants a narrowly targeted change. Do not load models earlier to improve an artificial timing result.

## Remaining Gates

The final rebuilt 90-case matrix passed: all themes were applied and stored, with zero blocking violations. Its 160 incomplete findings remain pending. The final JSON is preserved at `output/project-review-followup/integration/accessibility-theme-game-frontend-final.json`; the complete integration and source hashes are in [the final integration report](game-frontend-integration-2026-09-06.md). Independent source review remains pending. Physical Android/iOS, screen readers, forced colors, zoom and manual resolution of incomplete findings remain unproven. Both assigned specialists stopped with an account usage-limit error after saving partial work; the coordinator inspected their code, fixed the reproduced defects and continued verification. No purchase or reset was attempted.

The runner is report-only and has not changed deployment, site routing, APIs, analytics storage or privacy consent. No public speed claim, CSS optimization, live ad test or model/device acceptance is supported by this baseline.
