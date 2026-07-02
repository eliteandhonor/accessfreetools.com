# Access Free Tools Analytics Dashboard

Last updated: 2026-07-03

Access Free Tools uses a small first-party analytics system for owner-only usage checks. It is meant to answer simple questions:

- Which tools are people using?
- Which pages get real visits?
- Are users new or returning?
- Which referrers are sending visitors?

Hostinger hPanel analytics should still be used for server logs, bandwidth, errors, and bot crawl checks. The site dashboard is cleaner for product decisions because it filters obvious bots and records anonymous browser events.

Microsoft Clarity is also installed on public production pages for layout and session-quality review. The Clarity loader is guarded so it only runs on `accessfreetools.com` or `www.accessfreetools.com`, respects the same local analytics opt-out key, respects browser Do Not Track, and skips `/admin/` plus `/private-analytics/` pages.

## Private Dashboard

The easiest private entry URL is:

```text
/admin/
```

Enter the private token once there. It stores the token in this browser only, then opens:

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

The PHP analytics endpoint also accepts the same values from Hostinger environment variables. It still supports the older `public_html/.analytics/config.env` path, but the home-level `.local` file is better because normal site deploys should not delete it. Never commit real token, salt, IP list, or hosting credentials to GitHub.

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
the token in this browser only.

The direct private analytics link also works:

```text
https://accessfreetools.com/private-analytics/?token=YOUR_PRIVATE_TOKEN
```

The page stores the token in this browser only, so later visits can use:

```text
https://accessfreetools.com/private-analytics/
```

## Privacy Rules

- Raw IP addresses are not stored in the analytics event log.
- Visitor and session IDs are hashed before storage.
- Obvious bots and crawlers are filtered.
- Do Not Track is respected.
- Admin pages and API routes are not counted.
- Users can opt out from the private dashboard controls, which set `access-free-tools-analytics-opt-out` in local storage.
- Microsoft Clarity is third-party analytics and must stay disclosed in `/privacy-policy/`; it must not be added to private admin or analytics pages.

## Agent Commands

Use these commands for local checks:

```powershell
npm run aft -- usage-summary
npm run aft -- usage-summary -- --json
npm run aft -- site-sitemap
```

`usage-summary` reads `.local/analytics/events.ndjson`, which is ignored by Git.
