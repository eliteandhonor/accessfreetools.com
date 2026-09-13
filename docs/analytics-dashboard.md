# Access Free Tools Analytics Dashboard

Last updated: 2026-09-06

Access Free Tools uses a small first-party analytics system for owner-only usage checks. It is meant to answer simple questions:

- Which tools are people using?
- Which pages get real visits?
- Are users new or returning?
- Which referrers are sending visitors?

Hostinger hPanel analytics should still be used for server logs, bandwidth, errors, and bot crawl checks. The site dashboard is cleaner for product decisions because it filters obvious bots and records anonymous browser events.

Microsoft Clarity is also installed on public production pages for layout and session-quality review. The Clarity loader is guarded so it only runs on `accessfreetools.com` or `www.accessfreetools.com`, respects the same local analytics opt-out key, respects browser Do Not Track, and skips `/admin/` plus `/private-analytics/` pages.

The Four in a Row pilot records only aggregate `Start round`, `Complete round`,
and `Replay round` milestones. It does not record columns, moves, board state,
player identity, or round outcome. The same three milestones can be sent to
Clarity as custom events only when the normal analytics privacy gate allows it.

## Private Dashboard

The easiest private entry URL is:

```text
/admin/
```

The hub links to these private pages. Enter the token on the page for each workflow:

```text
/admin/analytics/
/admin/agent-tools/
```

The older analytics shortcut still works:

```text
/private-analytics/
```

It is marked `noindex` and requires a private token before stats are shown.

## Durable Hostinger Setup

The safest live setup is one private file outside the deploy folder:

```text
/home/u726893900/.local/accessfreetools-analytics.env
```

Put these values in that file:

```env
AFT_ANALYTICS_TOKEN=replace-with-a-private-dashboard-token
AFT_ANALYTICS_SALT=replace-with-a-long-random-secret
```

Optional but recommended:

```env
AFT_ANALYTICS_EXCLUDE_IPS=your.home.ip.address,your.mobile.ip.address
AFT_ANALYTICS_TIME_ZONE=Australia/Brisbane
AFT_ANALYTICS_DIR=/home/u726893900/.local/accessfreetools-analytics
```

The Astro Node analytics endpoint also accepts the same values from Hostinger environment variables. It still supports the older `public_html/.analytics/config.env` fallback path, but the home-level `.local` file is better because normal site deploys should not delete it. Never commit real token, salt, IP list, or hosting credentials to GitHub.

When the home-level config file exists, the app defaults event storage to the sibling
`/home/u726893900/.local/accessfreetools-analytics/` directory even if `AFT_ANALYTICS_DIR` is omitted.
Set the variable explicitly when a different durable directory is required. Local development without the
home-level config continues to use the ignored repo path `.local/analytics/`.

For owner setup, keep the private local copy at:

```text
.local/analytics-dashboard.env
```

That file is ignored by Git. If Hostinger SSH is available, upload those same lines to `/home/u726893900/.local/accessfreetools-analytics.env`. If using Hostinger File Manager and home-level files are hard to reach, use the older fallback path `domains/accessfreetools.com/public_html/.analytics/config.env`.

## How To Open It

After deployment of the no-persistence change and environment setup, open the private navigation hub:

```text
https://accessfreetools.com/admin/
```

Choose Analytics or Agent Tools, then enter the private token on that page. Each page/workflow
requires explicit entry; the hub does not transfer a credential between pages.

The direct private analytics link also works, but tokens should not be placed in
the URL:

```text
https://accessfreetools.com/private-analytics/
```

Enter the token for this page's workflow. It is sent only in the `x-aft-analytics-token`
header and is not persisted in browser storage, cookies, URLs, or window.name. Agent Tools
keeps its workflow credential only in page-local closure memory. Reloading or navigating
to another private page requires fresh entry.

Logout and pagehide clear the page's local credential and private view and cancel pending
client requests. They do not revoke the reusable server credential, establish server expiry,
or undo work already accepted by the server. This reduces browser-persistence exposure;
it does not isolate an entered credential or authenticated workflow from arbitrary same-origin
code that can hook requests or script an authenticated opener.

## Privacy Rules

- Raw IP addresses are not stored in the analytics event log.
- Visitor and session IDs are hashed before storage.
- Obvious bots and crawlers are filtered.
- Do Not Track is respected.
- First-party analytics excludes `/admin`, `/api`, `/mcp`, and `/private-analytics`, including their descendants, with or without a trailing slash. Client and server checks normalize paths first, including absolute URLs, query/hash variants, encoded separators, and dot segments. Previously stored private-route events are excluded from summaries too.
- Analytics page paths exclude query strings and fragments.
- Users can opt out from the private dashboard controls, which set `access-free-tools-analytics-opt-out` in local storage.
- The public Privacy Policy offers the same persistent browser opt-out without requiring an admin token.
- Current analytics logs rotate at 25 MiB, archive logs expire by file modification age after 90 days, and reports read bounded recent tails rather than unbounded files. This is an ARCHIVE policy, not a 90-day event-age deletion policy; see below.
- Microsoft Clarity is third-party analytics and must stay disclosed in `/privacy-policy/`; it must not be added to private admin or analytics pages.
- Game analytics may record aggregate starts, completions, and replays, but never individual moves, board state, player identity, or outcome.

## Retention And Coverage

The existing retention policy is unchanged. Before appending an event, a current
`events.ndjson` file at or above 25 MiB is renamed to an archive. The active file
can exceed that threshold by the last append until the next write. Archive files
matching `events-*.ndjson` with a modification time older than 90 days are deleted
during archive pruning, which runs when logs rotate and before report reads.
Expiry uses file modification time, not event timestamps or dates in filenames.

The active log is not deleted or rewritten by event age. A small active log can
retain very old events indefinitely; an unexpired archive can contain mixed-age
events. This does not promise deletion of every event after 90 days. Any new
destructive event-age retention policy needs a separate owner decision, matching
privacy wording, and isolated fixture tests. Never test pruning against real logs.

Each report reads at most 16 MiB per file, 32 files (at most 512 MiB of event-file
content), and retains at most 120,000 events. A 25 MiB file therefore has an omitted
prefix. The summary reports `coverage.status: partial` when byte, event, or file
limits omit history, or when damaged records, failed reads, or files changing
during a read prevent a complete snapshot. It includes reason codes, read limits,
and observed event dates. Missing/legacy coverage metadata is `unknown`, not
complete. A fully read retained snapshot is still `unknown` for interval coverage.

`days`, `rangeStart`, and `coverage.requestedStart` / `requestedEnd` describe the
request, not proven coverage. `observedStart` / `observedEnd` describe the retained
events actually counted; `rangeObservedStart` / `rangeObservedEnd` describe counted
events inside the requested interval. These endpoints do not prove uninterrupted
collection between them. Empty observations have null dates, not proof of zero
traffic throughout a requested 30-day period.

The compatibility key `allTime` means retained-event counts in this read, not
lifetime totals (`coverage.allTimeScope: retained-events-only`). New/returning
classifications use observed history only: first seen in this read does not prove
a genuinely new visitor, and earlier visits can be missing. The dashboard labels
these limits; privacy-safe production reports preserve coverage and dates, and
legacy aggregates get an explicit unknown marker. Usage-notes drafts stay blocked
when interval coverage or continuity is unverified, regardless of count thresholds.

`coverage.deploymentContinuity` remains `unknown` and `comparisonsAllowed` remains
`false`. A durable directory setting, a fresh report timestamp, and requested days
are not deployment-survival proof. Before comparing periods or releasing usage
claims, the owner/release reviewer must verify the actual private production
storage location, stable visitor salt/configuration, retention/rotation history,
and dated aggregate continuity across deployments for the exact interval. Missing
history must remain unknown. Local synthetic tests cannot close that production
gate; they do not inspect owner configuration or read/delete real analytics logs.

## Agent Commands

Use these commands for local checks:

```powershell
npm run aft -- usage-summary
npm run aft -- usage-summary -- --json
npm run aft -- site-sitemap
npm run analytics:production
npm run analytics:production:game
npm run pilot:four-in-a-row
```

`usage-summary` reads `.local/analytics/events.ndjson`, which is ignored by Git
and may contain historical local QA traffic. It must not be used as production
engagement proof. Public pages now send analytics only on the two production
hostnames, which prevents local visual and smoke checks from adding new events.

`analytics:production:game` reads a private 90-day aggregate from the production
API using a local-only analytics token. It saves no token or raw visitor data.
The Four in a Row pilot report then separates aggregate starts, completions,
and replays from page views and keeps the eight-week decision gate explicit.

The pending September 6 game fix versions these actions with ` (round-v2)`.
Its start and completion flags survive undo within one in-memory round, while
the visible score remains reversible. New round or mode selection resets the
flags. No round IDs, individual moves, player identities or outcomes are sent.
Do not claim this definition is live until deployment is verified. Existing
unversioned rows remain visible as legacy observations and cannot supply the
100 corrected-start gate; logs are not rewritten to manufacture a baseline.

The game report uses the production summary's original `generatedAt`, measured
interval and exact game target, not the local fetch or report time. Evidence
older than seven days, impossible counts and unverified interval coverage block
decisions. Owner exclusion must come from the production response or a fresh
verified browser opt-out, not merely a local environment setting. Even a ready
measurement report does not replace the separate Search Console, Clarity and
owner release gates.

The CLI link helper, tool briefs, and SEO console use only the fresh privacy-safe
`output/analytics/production-latest.json` aggregate for usage-based priorities.
They never fall back to `.local/analytics/events.ndjson`; when the production
aggregate is missing or older than eight days, they report `not enough data`.
