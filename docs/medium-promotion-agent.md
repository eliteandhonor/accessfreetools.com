# Medium Promotion Agent

The Medium Promotion Agent prepares safe companion posts for Access Free Tools.
It does not publish publicly, store credentials, run ads, send emails, or add
affiliate links.

## Specialist Upgrade Lenses

Use `docs/recommended-agency-agents.md` before Medium work:

- Technical Writer for article clarity, examples, headings, and source links.
- Evidence Collector for hero-image, alt-text, formatting, and public URL proof.
- Reality Checker before marking a live edit fixed or complete.

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
- A Codex app cron automation named `Medium Promotion Agent` is active for
  Wednesdays at 10:00am. It runs the Medium draft generator, DataForSEO checks,
  and `npm run promotion:medium:quality`, then reports the best update/publish
  candidate. It must not publish or update live Medium posts without owner
  approval.
- The current 10-draft queue was approved by the user on 2026-05-07. Keep the
  quality gate and one-at-a-time posting rule so live Medium posts stay useful
  and do not look like duplicate bulk content.
- Live Medium lesson from 2026-05-07: the first published story was missing its
  hero image and the second story had headings that pasted as normal
  paragraphs. Future agents must verify the public article after every live
  edit, not just the editor or Story Settings.
- Live Medium lesson from 2026-05-08: the wallpaper article hero image had
  detail text crossing the calculator artwork. The generator now has layout
  checks, and future live edits must include a public-page visual screenshot.
  Do not mark a Medium post complete from the editor alone, even when alt text
  and SEO settings are saved.

## Commands

Generate every starter Medium draft:

```bash
npm run promotion:medium:starter
```

Generate one draft:

```bash
node scripts/medium-promotion-agent.mjs --slug=wallpaper-waste-percent
```

Regenerate the starter drafts and run the writing-quality gate:

```bash
npm run promotion:medium:quality
```

This also generates branded Medium hero images, then runs the Medium article
reviewer. It scores each draft for SEO, originality, human reading interest,
reader desire, and overall quality. The JSON report is saved to
`output/promotion/medium-quality-report.json`.

Generate only the Medium hero images:

```bash
npm run promotion:medium:images
```

Hero images are written to `public/medium/` so they can be uploaded to Medium
or imported by URL. The draft metadata includes the matching image URL, local
path, and alt text.

Regenerate and check the first calculator post only:

```bash
npm run promotion:medium:quality:first
```

Generated drafts are written to `output/promotion/medium/`. Clean paste-ready
copies without frontmatter, publisher notes, or the internal checklist are
written to `output/promotion/medium/public/`. The output folder is ignored by
Git because these are working drafts, not source files.

The generator also writes:

- `output/promotion/medium/_publishing-queue.md` with the recommended order.
- `output/promotion/medium-promotion-report.json` with draft paths, source
  URLs, canonical URLs, tags, word counts, public paste paths, and approval
  status.

## Starter Drafts

- `right-free-online-calculator`
- `percentage-calculator-discounts`
- `wallpaper-waste-percent`
- `browser-only-ai-tools-privacy`
- `mortgage-payment-before-shopping`
- `bmi-result-limits`
- `ad-revenue-calculator-creator`
- `watts-to-amps-safety`
- `voltage-drop-wire-length`
- `markdown-table-cleanup`

## Publishing Rules

- Run an SEO review before every public Medium post. At minimum, check
  DataForSEO account/status, confirm the main keyword and search intent, and
  keep the article tightly matched to that one topic.
- Run `npm run promotion:medium:quality` before public posting. The checker
  fails drafts with thin word counts, missing disclosure/source links, missing
  examples, generic hype phrases, too-high reading level, topic drift, weak SEO
  score, weak originality score, weak human-interest score, or weak
  reader-desire score. It also requires a contextual Access Free Tools link
  before the final CTA and, when separate pages exist, links to both the tool
  and the matching guide.
- Use the `reader-first-article-review` skill before publishing or live-editing
  a Medium article. If the draft feels generic, rewrite it even if older SEO
  structure checks pass.
- Use short companion posts, not full copies of Access Free Tools blog guides.
- Keep the disclosure line that says the post is from Access Free Tools.
- Link to the original tool or guide.
- Set the canonical/source URL shown in the draft when Medium offers the option.
- Upload or import the matching hero image from `public/medium/` and set the
  draft's `hero_alt` text before publishing.
- Paste rich HTML or use Medium's formatting controls for live rewrites. Plain
  Markdown can preserve the words while losing H2 heading formatting.
- Keep first-wave posts free, not paywalled.
- Do not add affiliate links until an affiliate disclosure is visible next to
  the link.
- Do not use paid promotion unless the user explicitly asks for a paid campaign.
- Publish one article at a time at first, then record the live Medium URL in
  `docs/promotion-queue.md`.
- After publishing or updating, open the public Medium URL in the external
  browser and verify the hero image, saved alt text, large title, bold H2
  headings, SEO title/description, canonical/source URL, and reader interests.
  Save screenshots under `output/promotion/medium/` when doing browser work.
- If the user manually fixes a Medium article, still run the live visual check
  and record the public URL plus what was actually verified. Do not overwrite
  the user's live edit unless a later approved repair requires it.
- For live article rewrites, use the latest generated draft as the replacement
  source. Prefer the clean file in `output/promotion/medium/public/`, but do
  not mark the live article updated until the Medium editor has actually been
  changed in the external browser.
- Remove the internal publisher checklist before pasting if the public article
  should be shorter.
- Follow `docs/article-writing-agent-standard.md` before drafting or editing.
- Use the requested voice for first-wave posts: clear, practical, and smart
  enough for a 14-year-old reader without sounding childish or stuffed with
  keywords.
- Do not copy Neil Patel's personality or any living writer's exact style. Use
  the useful public SEO lessons only: clear value, skimmable structure,
  examples, proof, and a practical next step.

## Recommended First Publishing Order

1. `right-free-online-calculator`
2. `percentage-calculator-discounts`
3. `wallpaper-waste-percent`
4. `browser-only-ai-tools-privacy`
5. `mortgage-payment-before-shopping`
6. `bmi-result-limits`
7. `watts-to-amps-safety`
8. `ad-revenue-calculator-creator`
9. `voltage-drop-wire-length`
10. `markdown-table-cleanup`

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
