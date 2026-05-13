# DEV Community Promotion Agent

Last updated: 2026-05-13

DEV Community is the next recommended organic promotion channel for Access Free
Tools, but only for topics that fit a developer or technical productivity
audience. Use it for developer tools, browser AI tools, Markdown, JSON, URL,
encoding, token, API, and workflow articles. Do not use DEV for general finance,
health, pregnancy, tax, or home-project calculators unless the angle is truly a
developer workflow.

## Why DEV Fits

- The Forem/DEV API supports creating articles with Markdown.
- Articles can include tags, a cover image, a description, and a canonical URL.
- Authenticated API calls can list the account's articles for proof checks.
- The platform audience matches our developer, AI, browser, Markdown, JSON, and
  productivity tools better than broad calculator posts.

Research source: `https://developers.forem.com/api/v0`

## Local Setup

The user must create or approve the DEV account first. After the account exists,
create a DEV API key from the account settings and store it locally only:

```text
.local/devto.env
DEVTO_API_KEY=your-dev-api-key
```

Never commit the API key. `.local/` is ignored by Git.

## Current Account Status

On 2026-05-13, external Chrome completed onboarding for the user-created
`@accessfreetools` account, saved the profile basics, and confirmed the email
link was already accepted. The article editor at `/new` then returned
`Forbidden` with the message that the account is suspended and has limited
access. Do not publish, comment, or keep retrying DEV until DEV support restores
the account or the user approves a clean replacement account path.

## Agent Commands

Draft and score:

```bash
npm run promotion:devto:quality
```

Draft only:

```bash
npm run promotion:devto
```

Publish only after the exact article and platform are approved, the quality gate
passes, and the local API key exists:

```bash
npm run promotion:devto:publish -- --slug=markdown-table-generator
```

The publish command still needs public proof. Do not mark a DEV item `posted`
unless a public DEV URL opens and shows the article, the Access Free Tools
ownership disclosure, the source/canonical link, the useful example, and the
cover image or platform image area.

## Content Rules

Every DEV article must:

- Start with a real developer or browser-workflow problem.
- Use the smart 14-year-old clarity from `docs/brand-code.md`.
- Include one concrete example with numbers, snippets, rows, or exact values.
- Link to the matching Access Free Tools tool and guide.
- Include a clear ownership disclosure.
- Set `canonical_url` to the Access Free Tools guide.
- Use 3-4 focused tags from the approved technical set.
- Avoid generic filler, fake hype, and agent-facing notes.

## Good DEV Topics

- `markdown-table-generator`: broken README tables, docs tables, issue replies.
- `json-formatter`: broken JSON, missing commas, config debugging.
- `image-to-text-ocr-tool`: browser OCR, screenshot text, privacy limits.
- `prompt-token-estimator`: token cost, long prompt planning, context cleanup.
- `url-encode-decode`: URL parameters, broken links, encoded characters.
- `base64-encode-decode`: harmless encoding explanation and limits.

## Topics To Avoid On DEV

- Mortgage, loan, salary, tax, pregnancy, BAC, BMI, medical-adjacent, or other
  YMYL calculator articles.
- Wallpaper, concrete, flooring, and other home-project topics unless the angle
  is a developer workflow, which is rare.
- Short link drops or duplicate copies of Medium articles.

## Proof Checklist

Before queue updates:

1. `npm run promotion:devto:quality` passes.
2. The public DEV article URL opens.
3. The article has the right title, tags, cover image, and source/canonical URL.
4. The body does not contain internal agent instructions.
5. The queue row records the live URL and date.

If the API returns 401, 403, 422, or 429, stop and report the exact blocker. Do
not retry repeatedly.
