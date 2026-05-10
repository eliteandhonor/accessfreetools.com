# Access Free Tools Analytics Dashboard

Last updated: 2026-05-10

Access Free Tools uses a small first-party analytics system for owner-only usage checks. It is meant to answer simple questions:

- Which tools are people using?
- Which pages get real visits?
- Are users new or returning?
- Which referrers are sending visitors?

Hostinger hPanel analytics should still be used for server logs, bandwidth, errors, and bot crawl checks. The site dashboard is cleaner for product decisions because it filters obvious bots and records anonymous browser events.

## Private Dashboard

The dashboard URL is:

```text
/admin/analytics/
```

It is marked `noindex` and requires a private token before stats are shown.

## Required Hostinger Environment Variables

Set these in the deployed Node app environment:

```env
AFT_ANALYTICS_TOKEN=replace-with-a-private-dashboard-token
AFT_ANALYTICS_SALT=replace-with-a-long-random-secret
```

Optional but recommended:

```env
AFT_ANALYTICS_EXCLUDE_IPS=your.home.ip.address,your.mobile.ip.address
AFT_ANALYTICS_TIME_ZONE=Australia/Brisbane
```

Never commit real token, salt, IP list, or hosting credentials to GitHub.

## How To Open It

After deployment and environment setup, open:

```text
https://accessfreetools.com/admin/analytics/?token=YOUR_PRIVATE_TOKEN
```

The page stores the token in an HttpOnly cookie scoped to `/admin/analytics/`, so later visits can use:

```text
https://accessfreetools.com/admin/analytics/
```

## Privacy Rules

- Raw IP addresses are not stored in the analytics event log.
- Visitor and session IDs are hashed before storage.
- Obvious bots and crawlers are filtered.
- Do Not Track is respected.
- Admin pages and API routes are not counted.
- Users can opt out from the private dashboard controls, which set `access-free-tools-analytics-opt-out` in local storage.

## Agent Commands

Use these commands for local checks:

```powershell
npm run aft -- usage-summary
npm run aft -- usage-summary -- --json
npm run aft -- site-sitemap
```

`usage-summary` reads `.local/analytics/events.ndjson`, which is ignored by Git.

