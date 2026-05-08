# Bluesky Promotion Agent

Bluesky is the recommended next organic promotion channel because it has a
straightforward posting API, short-form link posts fit utility pages well, and
the workflow can run from local environment variables instead of fragile browser
click automation.

## Status

- Recommended next platform: yes.
- Account status: created by the user on 2026-05-08 at
  `https://bsky.app/profile/accessfreetools.bsky.social`.
- Public profile audit on 2026-05-08 passed after the profile was updated with
  the Access Free Tools display name, approved bio, and branded avatar.
- Publishing status: first starter batch posted and verified on the public
  Bluesky author feed on 2026-05-08.
- Local agent: `scripts/bluesky-promotion-agent.mjs`.
- Quality gate: `scripts/check-bluesky-promotion-quality.mjs`.
- Profile audit: `scripts/bluesky-profile-audit.mjs`.
- Profile update helper: `scripts/bluesky-profile-update.mjs`, which updates
  display name, bio, and the branded avatar from
  `public/bluesky/access-free-tools-avatar.png`.

## Setup

1. Account created: `accessfreetools.bsky.social`.
2. Preferred future handle: `accessfreetools.com` if domain verification is available.
   Fallback handle: `accessfreetools.bsky.social`.
3. Create a Bluesky app password for Codex/local automation. Do not use or
   store the normal account password. Done 2026-05-08.
4. Add these values only in local environment variables, never Git:

```powershell
$env:BLUESKY_HANDLE="accessfreetools.bsky.social"
$env:BLUESKY_APP_PASSWORD="xxxx-xxxx-xxxx-xxxx"
```

5. Run the draft and quality review:

```powershell
npm run promotion:bluesky:quality
```

6. Generate the Bluesky-specific avatar:

```powershell
npm run promotion:bluesky:avatar
```

7. Update the profile after the app password is available. This sets the
   display name, bio, and branded avatar:

```powershell
npm run promotion:bluesky:profile-update
npm run promotion:bluesky:profile-audit
```

After the branded avatar is uploaded and visually checked on the public profile,
rerun the audit with `BLUESKY_AVATAR_VERIFIED=true`. Do not use that flag until
the avatar has actually been checked in the browser.

8. Publish only after the user approves the exact batch:

```powershell
npm run promotion:bluesky:publish
```

After publishing, open the public Bluesky profile and verify every post is live
before marking anything `posted` in `docs/promotion-queue.md`.

Security note: if the normal account password was shared in chat, change it
inside Bluesky after the app password workflow is working. Keep the app password
only in local environment variables.

## Content Rules

- Keep posts under Bluesky's 300-character limit.
- Use one Access Free Tools link per post.
- Use one to three focused hashtags.
- Keep the wording useful, not hype-driven.
- Add plain limitation wording for finance, money, health, electrical,
  construction, and AI/privacy topics.
- Never promise rankings, income, medical outcomes, or safety approval.

## Why Bluesky Before More Accounts

- It can be automated through an API after account setup.
- It is better for frequent short useful posts than Reddit, where new-account
  limits and community rules make automation risky.
- It is less blocked than LinkedIn, whose posting APIs need OAuth scopes and
  permission setup.
- It fills a different lane from Pinterest RSS and Medium articles: quick,
  searchable micro-explanations tied to exact tools.

## Sources

- Bluesky post records use `app.bsky.feed.post` with required `text` and
  `createdAt` fields:
  https://docs.bsky.app/docs/tutorials/creating-a-post
- Bluesky identity uses handles and DIDs, which supports a domain-handle path:
  https://docs.bsky.app/docs/advanced-guides/resolving-identities
- Google recommends people-first content over search-engine-first content:
  https://developers.google.com/search/docs/fundamentals/creating-helpful-content
