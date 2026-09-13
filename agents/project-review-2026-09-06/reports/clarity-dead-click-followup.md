# Clarity Dead-Click Follow-Up

Observed 2026-09-06, approximately 07:43-07:47 UTC, through the owner's logged-in Chrome tab. Read-only aggregate review. No visitor replay, raw visitor ID, private input, account setting, public page or ad was changed. The dashboard values match the earlier same-day snapshot; this is not evidence of growth between inspections.

## Fresh Access Check

From `C:/Users/chamb/OneDrive/Desktop/accessfreetools.com`:

- `npm run automation:env-check`: exit 0, generated `2026-09-06T07:44:26.977Z`; DataForSEO and Hostinger healthy. Search Console token refreshable, not a newly executed Google request.
- `npm run dataforseo:account`: exit 0; live balance USD 10.92, above the USD 2 top-up threshold. The corrected IP access now works for the existing local API client. This does not certify every separately hosted MCP connector's egress IP.
- Ignored evidence: `output/automation-environment.json` and `output/dataforseo-account.json` in that checkout. No paid keyword/SERP request was made.

## Observed Aggregates

Clarity project `xg7bzx9dxo`, dashboard filter **Last 3 days**:

- 22 sessions, with 13 bot sessions excluded; 1.27 pages/session and 1.7 minutes active time.
- Six sessions have dead clicks (27.27%); one has a quick back; no rage clicks or JavaScript errors are recorded in this window.
- Kawaii Calculator appears in nine sessions; Random Number Generator in three. These are sessions containing a route, not verified tool starts or unique actions.
- The dead-click session filter returns six sessions: five include Kawaii Calculator, one includes Carbohydrate Calculator. Five use Edge and one Chrome. Browser and route totals alone do not establish that Edge caused the issue.

| Route | Clarity score | LCP | INP | CLS |
| --- | --- | --- | --- | --- |
| Kawaii Calculator | 53 | 3.2 s | 460 ms | 1 |
| Random Number Generator | 91 | 1.1 s | 170 ms | 0 |

These are displayed Clarity values, not Lighthouse or Search Console/CrUX results. Microsoft documents the widget's timing and stability metrics as 75th percentiles. Exact per-route performance sample counts were not shown. The earlier same-day overview reported only seven measured pageviews. Owner/test exclusion remains unconfirmed; do not declare a representative site-wide Core Web Vitals failure.

## Kawaii Heatmap Detail

Selected **PC**, **Last 3 days**, exact Kawaii route and the actual **Dead clicks** heatmap type. The separate dashboard dead-click session filter is explicitly unsupported in heatmaps; it must not be used to describe the heatmap as only those five sessions.

The loaded heatmap reports 14 pageviews and 24 dead clicks across 12 elements:

| Target | Dead clicks |
| --- | ---: |
| Result output | 7 |
| Keypad container, not an individual key | 3 |
| Calculator panel | 3 |
| History expression span | 3 |
| Each of eight other display, history, artwork, heading or page containers | 1 |

No individual number, operator, equals or copy button appears in this dead-click ranking. That narrows the investigation; it does not prove every button works. The masked numeric glyphs in the saved heatmap are not evidence of missing live button labels. No attempt was made to unmask them.

Evidence was the live accessibility tree plus a screenshot rendered in the task; no local screenshot file is claimed. Read-only reproduction: Dashboard > Insights > Dead clicks > Dashboard > Kawaii heatmap > click-type menu > Dead clicks. Do not save a shared heatmap or open visitor replays without a task-specific reason.

## Bounded Follow-Up, Not An Approved Fix

Owner: existing frontend agent, linked to UX-03. Status: investigation needed; preserve the existing task's local automated evidence rather than treating it as production approval.

1. Reproduce Kawaii layout shifts and delayed interactions in owner-excluded Chrome and Edge. Capture the shifting nodes and long tasks on cold/warm loads, at desktop and mobile widths. Check hydration, image sizing, history growth and the consent surface as hypotheses, not established causes. Do not click live ads.
2. Review result selection, the existing Copy result action and history reuse with synthetic calculations. A copy affordance or explicit reuse control may help, but do not silently turn selectable text into an unexpected clipboard write. Test keyboard, touch, focus and selection before choosing a change.
3. Inspect the single Carbohydrate session's aggregate targets before recommending a health-page change. No current evidence supports changing its formula or copy.
4. Preserve Kawaii's title, canonical, URL, math, internal links and search intent. No broad content rewrite, new tool or ad activation follows from these measurements.

Acceptance for a later fix: reproduced cause, regression test, unchanged math and private-data boundaries, no overflow/focus regression, normal release approval, then fresh post-deploy field evidence. Lab improvement alone does not prove the historical dead-click rate has fallen.

Primary guidance: [Microsoft Clarity performance metrics](https://learn.microsoft.com/en-us/clarity/insights/performance-widget).
