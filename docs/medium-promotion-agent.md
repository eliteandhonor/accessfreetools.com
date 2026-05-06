# Medium Promotion Agent

The Medium Promotion Agent prepares safe companion posts for Access Free Tools.
It does not publish publicly, store credentials, run ads, send emails, or add
affiliate links.

## Current Status

- Medium login was started by the user on 2026-05-06 with
  `contact@accessfreetools.com`.
- Medium uses an email sign-in flow for this account, so the agent should not
  request or store a password.
- Public profile setup was completed in the external browser on 2026-05-06:
  `https://medium.com/@accessfreetools`.
- Display name, username, short bio, and the branded Access Free Tools avatar
  are live. Medium did not show a dedicated free website field in the visible
  profile settings, so approved posts should link back to the relevant Access
  Free Tools page and use canonical/source URLs when available.

## Commands

Generate every starter Medium draft:

```bash
npm run promotion:medium:starter
```

Generate one draft:

```bash
npm run promotion:medium -- --slug=wallpaper-waste-percent
```

Generated drafts are written to `output/promotion/medium/`. The output folder is
ignored by Git because these are working drafts, not source files.

The generator also writes:

- `output/promotion/medium/_publishing-queue.md` with the recommended order.
- `output/promotion/medium-promotion-report.json` with draft paths, source
  URLs, canonical URLs, tags, word counts, and approval status.

## Starter Drafts

- `right-free-online-calculator`
- `percentage-calculator-discounts`
- `wallpaper-waste-percent`
- `browser-only-ai-tools-privacy`
- `mortgage-payment-before-shopping`
- `bmi-result-limits`
- `ad-revenue-calculator-creator`
- `watts-to-amps-safety`

## Publishing Rules

- Run an SEO review before every public Medium post. At minimum, check
  DataForSEO account/status, confirm the main keyword and search intent, and
  keep the article tightly matched to that one topic.
- Use short companion posts, not full copies of Access Free Tools blog guides.
- Keep the disclosure line that says the post is from Access Free Tools.
- Link to the original tool or guide.
- Set the canonical/source URL shown in the draft when Medium offers the option.
- Keep first-wave posts free, not paywalled.
- Do not add affiliate links until an affiliate disclosure is visible next to
  the link.
- Do not use paid promotion unless the user explicitly asks for a paid campaign.
- Publish one article at a time at first, then record the live Medium URL in
  `docs/promotion-queue.md`.
- Remove the internal publisher checklist before pasting if the public article
  should be shorter.
- Use the requested voice for first-wave posts: clear, practical, and smart
  enough for a 15-year-old reader without sounding childish or stuffed with
  keywords.

## Recommended First Publishing Order

1. `right-free-online-calculator`
2. `percentage-calculator-discounts`
3. `wallpaper-waste-percent`
4. `browser-only-ai-tools-privacy`
5. `mortgage-payment-before-shopping`
6. `bmi-result-limits`
7. `watts-to-amps-safety`
8. `ad-revenue-calculator-creator`

## Manual Profile Checklist

- Display name: `Access Free Tools`. Done 2026-05-06.
- Username: `accessfreetools`. Done 2026-05-06.
- Public profile URL: `https://medium.com/@accessfreetools`. Done 2026-05-06.
- Bio: `Clear guides for free calculators, converters, finance estimators, home project calculators, and school-friendly utilities.` Updated 2026-05-06.
- Website: Medium did not show a dedicated free website field during setup; use
  approved post links and canonical/source URLs.
- Profile image: Access Free Tools branded avatar from Pinterest. Done
  2026-05-06.
- Optional publication: `Access Free Tools Guides`
- Optional publication tagline: `Simple guides for calculators, converters, project estimators, and everyday online utilities.`

## Research Notes

- Medium supports profile and publication setup through its own UI, so the
  account owner should handle email, CAPTCHA, identity, and recovery checks.
- Medium's help center says imported stories add a canonical link to the
  original source automatically. Our workflow still prefers shorter companion
  posts to avoid duplicating the full site guide.
- If Medium offers a canonical/source field in story settings, use the
  `canonical_url_to_set` value printed in each generated draft.

Reference links:

- https://help.medium.com/
- https://help.medium.com/hc/en-us/articles/214550207-Importing-a-post-to-Medium
- https://help.medium.com/hc/en-us/articles/360033930293-Set-a-canonical-link
- https://help.medium.com/hc/en-us/articles/115004746707-Your-profile-page-URL
