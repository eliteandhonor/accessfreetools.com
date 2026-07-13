# Bing IndexNow Setup

## Current Setup

- Bing IndexNow key: `79e3e302ad4545d592d9b53f6ae2350f`
- Hosted key file: `/79e3e302ad4545d592d9b53f6ae2350f.txt`
- Production key URL: `https://accessfreetools.com/79e3e302ad4545d592d9b53f6ae2350f.txt`
- Local submitter: `scripts/indexnow-submit.mjs`

The key file is intentionally public. IndexNow uses the file to prove that the
person submitting URLs controls the host.

## Commands

Run a local key-file check:

```bash
npm run indexnow:verify-key
```

Preview the built sitemap URLs that would be submitted:

```bash
npm run build
npm run indexnow:dry-run
```

Submit only canonical URLs changed by a routine release:

```bash
npm run indexnow:submit -- --url=https://accessfreetools.com/tools/example/ --url=https://accessfreetools.com/blog/example/
```

The submit command verifies the production key file first. If the key file is
not live yet, it stops instead of sending a bad request.

Submit every canonical sitemap URL only after a migration, large launch, or
major sitemap change:

```bash
npm run indexnow:submit-all
```

## Operating Rules

- Use IndexNow after publishing new tool batches, important page rewrites, new
  category hubs, or major sitemap changes.
- Do not submit unchanged URLs every day. Routine submissions require explicit
  `--url` values; use the full sitemap only after large launches.
- Keep Google Search Console as the source of truth for Google indexing.
  IndexNow mainly helps Bing and other engines that support the protocol.
- Keep sitemap and RSS submitted in Google Search Console and Bing Webmaster
  Tools.

## User Follow-Up

After this change is deployed, open the production key URL in a browser. It
should show only:

```text
79e3e302ad4545d592d9b53f6ae2350f
```

Then run the explicit changed-URL command locally or ask Codex to run it. The
latest report is saved at `output/indexnow-submission.json`, with timestamped
history under `output/indexnow/`.
