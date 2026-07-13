# Access Free Tools Analytics Dashboard

Last updated: 2026-07-13

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

Enter the private token once there. It stores the token for the current tab session, then opens:

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
```

The Astro Node analytics endpoint also accepts the same values from Hostinger environment variables. It still supports the older `public_html/.analytics/config.env` fallback path, but the home-level `.local` file is better because normal site deploys should not delete it. Never commit real token, salt, IP list, or hosting credentials to GitHub.

For owner setup, keep the private local copy at:

```text
.local/analytics-dashboard.env
```

That file is ignored by Git. If Hostinger SSH is available, upload those same lines to `/home/u726893900/.local/accessfreetools-analytics.env`. If using Hostinger File Manager and home-level files are hard to reach, use the older fallback path `domains/accessfreetools.com/public_html/.analytics/config.env`.

## How To Open It

After deployment and environment setup, open the simple login hub:

```text
https://accessfreetools.com/admin/
```

Enter the private token once, then use the buttons for Analytics or Agent Tools. The page stores
the token only for the current browser-tab session.

The direct private analytics link also works, but tokens should not be placed in
the URL:

```text
https://accessfreetools.com/private-analytics/
```

Enter the token in the form once. The page stores the token in session storage for
the current browser tab and sends it to the API with the
`x-aft-analytics-token` header. Closing the tab ends that stored admin session.

## Privacy Rules

- Raw IP addresses are not stored in the analytics event log.
- Visitor and session IDs are hashed before storage.
- Obvious bots and crawlers are filtered.
- Do Not Track is respected.
- Admin pages and API routes are not counted.
- Analytics page paths exclude query strings and fragments.
- Users can opt out from the private dashboard controls, which set `access-free-tools-analytics-opt-out` in local storage.
- The public Privacy Policy offers the same persistent browser opt-out without requiring an admin token.
- Current analytics logs rotate at 25 MB, archive logs expire after 90 days, and reports read bounded recent tails rather than unbounded files.
- Microsoft Clarity is third-party analytics and must stay disclosed in `/privacy-policy/`; it must not be added to private admin or analytics pages.
- Game analytics may record aggregate starts, completions, and replays, but never individual moves, board state, player identity, or outcome.

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
