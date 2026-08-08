# Promotion Account And Profile Registry

Last updated: 2026-07-03

This is the source of truth for Access Free Tools promotion accounts,
brand profiles, directory profiles, and backlink/profile setup status.
Use this before creating a new account so agents do not duplicate work or
mistake a blocked setup for a finished public profile.

Do not store passwords, one-time codes, recovery links, cookies, API tokens,
or private identity details in this file. Use `contact@accessfreetools.com`
only where a public business email is appropriate.

Do not use Google OAuth for new promotion or backlink profiles by default. If a
platform has no practical non-Google signup path, add it to the Google/email
handoff queue below so the owner can create or choose the email account later.

## Status Meanings

- `live`: public profile or listing is visible and has a verified Access Free
  Tools URL or profile proof.
- `active`: account exists and can be used, but the current proof is account
  setup rather than a public backlink.
- `blocked`: setup started but needs owner action, CAPTCHA, platform review, or
  payment before it can count as public proof.
- `defer`: do not use until the noted issue is resolved.

## Core Brand Profiles

Owner correction, 2026-08-08: active promotion is limited to the Access Free Tools blog, Medium, Bluesky, and Pinterest. Older directory and profile records below are historical evidence, not an active promotion queue.

| Platform | Status | Public URL | Login/Owner Notes | Proof And Next Action |
| --- | --- | --- | --- | --- |
| Pinterest Business | live | `https://au.pinterest.com/accessfreetools/` | Created by user on 2026-05-06. | Public profile, verified website, avatar, starter boards, and starter pins were verified. See `docs/promotion-account-launch-kit.md`. |
| Medium | live | `https://medium.com/@accessfreetools` | Created with `contact@accessfreetools.com`. | Public profile setup complete. Use canonical/source links in approved posts; do not post without quality gate. |
| Reddit | blocked | `https://www.reddit.com/user/accessfreetools/` | Historical account record. | Owner marked Reddit blocked on 2026-08-08. Do not retry or create promotion tasks. |
| Quora | retired-by-owner | `https://www.quora.com/profile/Access-Free-Tools` | Historical account record. | Owner retired Quora on 2026-08-08. Do not publish or recommend it. |
| Quora Space | retired-by-owner | `https://accessfreetoolssspace.quora.com/` | Historical account record. | Do not publish, invite, or create campaign tasks. |
| Bluesky | live | `https://bsky.app/profile/accessfreetools.bsky.social` | Brand account active. | Profile bio was updated on 2026-07-03 to include `accessfreetools.com`. Use Chrome or API only after approval and quality gate. |
| LinkedIn Company Page | not-in-use | Historical URL only | Owner states LinkedIn was never used for this campaign. | Do not rely on the older setup claim or create promotion work without fresh owner activation and proof. |
| Linktree | live | `https://linktr.ee/accessfreetools` | Created through Google OAuth from the brand Google account on 2026-07-03. | Public profile verified with Access Free Tools display name, brand-safe bio, and clickable links to `https://accessfreetools.com/`, Pinterest, GitHub, LinkedIn, and Gravatar. Free plan only; Pro trial was skipped. |

## Developer And Directory Profiles

| Platform | Status | Public URL | Login/Owner Notes | Proof And Next Action |
| --- | --- | --- | --- | --- |
| GitHub brand account | live | `https://github.com/access-free-tools` | Brand account created with `contact@accessfreetools.com` on 2026-07-03. | Public profile includes Access Free Tools name, bio, website, and social links. Avatar upload was retried in Chrome on 2026-07-03 using `public/pinterest/access-free-tools-avatar.png`; GitHub exposed the correct `access-free-tools` profile settings and an `avatar_upload` field, but the hidden input could not be clicked directly and the visible-control retry reset Chrome control. Keep the profile live; retry avatar only after Chrome file chooser control is stable. |
| GitHub brand profile README | live | `https://github.com/access-free-tools/access-free-tools` | Public repo under brand account. | README backlink to Access Free Tools verified. Keep repo public and factual. |
| GitHub personal/supporting account | live | `https://github.com/eliteandhonor` | Existing/user-owned personal account. | Public profile and `eliteandhonor/access-free-tools` repo were created as supporting proof. Keep personal and brand identities distinct. |
| GitLab brand profile | live | `https://gitlab.com/accessfreetools` | Created through Google OAuth from the brand Google account on 2026-07-03. | Public profile verified with Access Free Tools name, Australia location, brand-safe bio, website link to `https://accessfreetools.com/`, and GitHub social link. Public email is hidden. GitLab forced a first project/group onboarding path; no paid trial, billing, team invite, or outreach setup was used. |
| CodePen brand profile | live | `https://codepen.io/accessfreetools` | Created through Google OAuth from the brand Google account on 2026-07-03. | Public Chrome profile view verified with Access Free Tools display name, Australia location, short brand-safe bio, and links to `https://accessfreetools.com/`, GitHub, and Linktree. Email verification was completed by the owner. No pens, fake activity, PRO upgrade, or paid feature was used. |
| CodeSandbox brand profile | live | `https://codesandbox.io/u/access-free-tools` | Created through GitHub OAuth from the brand GitHub account on 2026-07-03. | Public Chrome profile view verified with Access Free Tools display name, `access-free-tools` username, short brand-safe bio, and clickable website link to `https://accessfreetools.com/`. Workspace creation wizard was skipped after account setup; no sandboxes, fake activity, paid upgrade, team invite, or repository import was created. |
| Devpost brand portfolio | live | `https://devpost.com/access-free-tools` | Created through GitHub OAuth from the brand GitHub account on 2026-07-03. | Public Chrome portfolio view verified with Access Free Tools name, `access-free-tools` username, short brand-safe bio, clickable website link to `https://accessfreetools.com/`, GitHub link, and owner-supplied LinkedIn link. Newsletter opt-in was unchecked before signup. Hackathon recommendation/eligibility fields, projects, hackathon submissions, fake activity, and team features were skipped. |
| Docker Hub brand profile | live | `https://hub.docker.com/u/accessfreetools` | Created through GitHub OAuth from the brand GitHub account on 2026-07-03; business mailbox verification was completed by the owner. | Public Docker Hub profile verified with Access Free Tools name, Australia location, Gravatar avatar lookup, and clickable website link to `https://accessfreetools.com/`. No repositories, paid plan, billing setup, organization setup, Docker Desktop install, or fake activity was created. |
| Kaggle brand profile | live | `https://www.kaggle.com/accessfreetools` | Created through Google OAuth from the brand Google account on 2026-07-03. | Public Chrome profile view verified with Access Free Tools display name, tagline, organization, brand-safe bio, and clickable `https://accessfreetools.com/` link inside the bio. Website and LinkedIn social fields require phone verification, so they were not added. No datasets, notebooks, competitions, comments, or fake activity were created. |
| daily.dev brand profile | live | `https://daily.dev/accessfreetools` | Created through Google OAuth from the brand Google account on 2026-07-03. | Public Chrome profile view verified with Access Free Tools name, `@accessfreetools` username, headline, brand-safe bio, and clickable links to `https://accessfreetools.com/`. CV upload, extension install, paid Plus plan, posts, squads, and fake activity were skipped. |
| Peerlist brand profile | live | `https://peerlist.io/accessfreetools` | Created through Google OAuth from the brand Google account on 2026-07-03. | Public Chrome profile view verified with Access Free Tools name, brand-safe bio, clickable website link to `https://accessfreetools.com/`, owner-supplied LinkedIn link, and JavaScript/ReactJS/TypeScript skill tags. LinkedIn autofill/import, projects, posts, job preferences, invites, and fake activity were skipped. |
| Replit | blocked | Pending | Signup path reviewed on 2026-07-03; retried after Chrome restart. | `https://replit.com/signup` still returns a Cloudflare "Sorry, you have been blocked" page before any account or OAuth options appear. Do not retry repeatedly; continue only after the owner can open the signup page normally in Chrome. |
| StackBlitz brand profile | live | `https://stackblitz.com/@access-free-tools` | Created through GitHub OAuth from the brand GitHub account on 2026-07-03 after Chrome restart. | Public Chrome profile view verified with Access Free Tools name, `access-free-tools` username, clickable `https://accessfreetools.com/` website link, and 0 projects. No projects, collections, imports, onboarding answers, paid plan, fake activity, or file upload was created. |
| JSFiddle | blocked | Pending | Signup path reviewed on 2026-07-03. | `https://jsfiddle.net/user/signup/` requires a new email/password signup and CAPTCHA-style verification in the reviewed path, with no GitHub OAuth option visible. Do not reuse the Google or GitHub password; continue only if the owner creates credentials and completes verification. |
| Observable | live | `https://observablehq.com/user/@accessfreetools` | Created through GitHub OAuth from the brand GitHub account on 2026-07-03. | Public Chrome profile view verified with Access Free Tools name, brand-safe bio, clickable `https://accessfreetools.com/` website link, and 0 public notebooks. No notebooks, fake activity, team setup, paid plan, or file upload was created. |
| Glitch | defer | Pending | Reviewed on 2026-07-03. | The sign-in path redirects to the Glitch Blog and current public content says the Glitch service is ending. Not useful as a new backlink/profile target. |
| SaaSHub | live | `https://www.saashub.com/access-free-tools` | Logged in as `access-free-tools` during 2026-07-03 review. | Public listing includes `Visit official website` link to `https://accessfreetools.com/`. Do not post fake reviews. |
| Crunchbase company profile | live | `https://www.crunchbase.com/organization/access-free-tools` | Created through the Google registration path on 2026-07-03. | Public company profile verified with Access Free Tools name, clickable website link to `https://accessfreetools.com/`, LinkedIn link, public contact email, and a factual company description. No paid trial, funding claims, private address, phone, founders, hiring/recruiting setup, or fake activity was added. |
| SlideShare | live | `https://www.slideshare.net/accessfreetools?tab=about` | Account was completed by the owner and profile was updated in Chrome on 2026-07-03. | Public About tab verified with Access Free Tools name, organization, occupation, brand-safe bio, and visible clickable website link to `https://accessfreetools.com/`. No deck, document, paid trial, fake saves, or fake engagement was created; upload only real useful assets. |
| Issuu | blocked | Pending | Signup path reviewed on 2026-07-03. | Chrome automation is blocked by the browser safety layer on `https://issuu.com/signup`, so do not try workaround navigation. Revisit only if the owner opens/completes the account manually or if there is a real public PDF/report asset ready to publish. |
| Archive.org | active | Pending public proof | Signup path reviewed on 2026-07-03; owner later reached `https://archive.org/account/settings`. | Chrome verified that account settings are accessible, but the visible settings page only exposes screen name, email, password, and avatar controls. It does not provide a public website or bio field. No irreversible screen-name change, password action, avatar upload, or file upload was made. A real overview asset is prepared at `output/backlink-assets/access-free-tools-overview.pdf` with matching markdown and HTML sources, but do not upload files or mark live until a public Archive.org URL visibly proves the link. |
| Hashnode | live | `https://hashnode.com/@accessfreetools` | Created with GitHub OAuth from the brand GitHub account on 2026-07-03. | Public profile verified with clickable `Website` link to `https://accessfreetools.com/`, GitHub link, LinkedIn link, tagline, location `Australia`, and brand-safe bio. Do not publish thin posts; use only for real developer/tool guides. |
| StackShare | blocked | Dashboard: `https://stackshare.io/dashboard/202182` | Company dashboard created on 2026-07-03. | Public publishing is gated behind StackShare Pro at `$4.99/month`. Do not count as a public backlink unless the user approves paid Pro and public page is verified. |
| AlternativeTo | live | `https://alternativeto.net/user/access-free-tools/` | Created with GitHub OAuth from the brand GitHub account on 2026-07-03. | Public profile verified with Access Free Tools name, Australia location, brand-safe bio, and a clickable `https://accessfreetools.com/` profile link. Link is marked `nofollow ugc`, which is expected for user-generated profiles. New app/Calculator.net alternative submission was reviewed on 2026-07-03 but is blocked because AlternativeTo requires new app submissions to come from an account at least 7 days old; earliest retry is 2026-07-10. The form also requires an icon, and may deny submissions without screenshots. Use URL-based icon/screenshot fields if possible; do not post reviews, votes, or fake activity. |
| WebCatalog | active | Pending review | Account created through Google OAuth from the brand Google account on 2026-07-03. | Access Free Tools was submitted through `https://webcatalog.io/en/apps/submit` with public app name and homepage URL after the owner completed the robot/security step in Chrome. WebCatalog showed: "The request has been sent successfully. Thank you! We will review the app submission as soon as possible." Do not count this as a live backlink until a public WebCatalog listing URL is visible and verified. |
| Diigo | blocked | Pending | Free-plan signup path reviewed on 2026-07-03. | The free plan opens a standalone username/email/password signup with reCAPTCHA and adjacent payment fields. No account was created. Continue only if the owner creates credentials and completes verification directly; do not use Diigo for thin bookmark spam. |
| Flipboard magazine | unverified-inactive | Historical URL only | Owner does not recognize this as an active channel. | Do not use or recommend it unless the owner explicitly reactivates and verifies it. |
| Linklist.bio | blocked | Pending | Signup path reviewed on 2026-07-03. | Registration requires standalone name/email/password fields and terms acceptance; no Google OAuth path was visible. No account was created. Since Linktree and About.me are already live, treat this as low priority unless the owner explicitly wants another link-in-bio profile and creates credentials directly. |
| JustPaste.it profile | live | `https://justpaste.it/u/accessfreetools` | Account/profile page was opened by the owner in Chrome on 2026-07-03. | Public profile verified with Access Free Tools display name, Australia location, short brand-safe description, and a clickable `https://accessfreetools.com/` website link. No notes, file uploads, pasted articles, or link-dump pages were created. |
| Pearltrees | live | `https://www.pearltrees.com/accessfreetools` | Owner completed signup on 2026-07-03 after Codex prepared the non-sensitive public fields. | Public profile verified with Access Free Tools display name and brand-safe bio. The visible profile shows `AccessFreeTools.com` as bio text, but no clickable website link or collection item was verified yet. Next safe action is one real public collection of useful calculator/tool resources, not a thin bookmark dump. |
| Brownbook user profile | active | Pending public proof | Account profile was updated in Chrome on 2026-07-03. | Private account profile fields were saved with Access Free Tools name, website, blog URL, and brand-safe about text. No public user profile URL was found, so this is not counted as a backlink. The business-listing form was reviewed and no private address, city, ZIP, phone, or mobile was entered or submitted. Continue only with a website-only listing if a public listing URL can be verified without exposing a residential address. |
| LinkCentre | blocked | Pending | Free listing path reviewed on 2026-07-03. | Free plan exists, but account creation requires owner-created email/password, then email verification before listing submission. Do not connect Google OAuth. |
| Gravatar | live | `https://gravatar.com/exactly664c9a321a` | Completed through the WordPress.com/Gravatar email flow with `contact@accessfreetools.com` on 2026-07-03. | Public profile verified with Access Free Tools name, Australia location, brand-safe bio, and clickable links to `https://accessfreetools.com/`, GitHub, and LinkedIn. |
| About.me | live | `https://about.me/accessfreetools` | Created through Google OAuth from the brand Google account on 2026-07-03. | Public profile verified with Access Free Tools name, Australia location, updated brand-safe bio, and clickable website link to `https://accessfreetools.com/`. Owner completed the hCaptcha; no paid upgrade, email-signature promotion, or outreach setup was used. |
| Stack Overflow | blocked | Pending | Signup path reviewed on 2026-07-03. | Initial review hit a non-interactive Cloudflare security gate. Later retry reached OAuth, but GitHub OAuth was rejected by Stack Overflow's email policy. A retry with the newer Google account still failed with "Account creation failed due to issues with your IP address." Do not retry repeatedly; continue only after the IP/account-creation gate clears. |
| Hugging Face | blocked | Pending | Signup path reviewed on 2026-07-03. | `https://huggingface.co/join` requires a fresh email/password signup in the reviewed path and did not show a Google OAuth option. Do not reuse the Google account password on Hugging Face; continue only if the owner creates credentials or a Google path becomes available. |
| Bitbucket / Atlassian | blocked | Pending | Signup path reviewed on 2026-07-03. | Atlassian signup through Google OAuth reached the final account creation step, then Atlassian returned that it was unable to create the account. No Bitbucket account or public profile was created; do not contact support or retry repeatedly without owner direction. |
| Indie Hackers | blocked | Pending | Signup path reviewed on 2026-07-03. | Username, stage, coding level, and topic interests were accepted, but onboarding then required birthday/private profile details before completion. Stop at that private identity gate; continue only if the owner fills those fields directly. |
| Open Collective | blocked | Pending | Signup path reviewed on 2026-07-03. | Organization setup still requires a personal account path and Cloudflare/Turnstile verification before a public collective/profile can be created. No public profile was created. |
| Google Developer Profile | defer | Pending | Brand profile path reviewed on 2026-07-03. | The Google Developer profile page opened an older personal/private profile rather than a clean Access Free Tools brand profile. Do not edit that profile as brand proof; revisit only if the owner chooses a brand-safe Google profile path. |
| Blogger | defer | Pending | Reviewed again on 2026-07-03 with Google account access. | Blogger defaulted to an older personal blog, and the clean path pushes directly into blog creation rather than profile-only setup. Do not create a thin Blogspot property solely for a backlink; use only if Access Free Tools starts a real, maintained publication. |
| Substack | defer | Pending | Signup path reviewed on 2026-07-03. | Substack showed an email/magic-link style sign-in path and publishing-focused setup. Do not create a thin newsletter or publication solely for a backlink; revisit only if there is a real digest/newsletter plan. |
| Slashdot | blocked | Pending | Signup path reviewed on 2026-07-03. | New registrations require administrator approval by email explaining why the account should exist. Do not send outreach just for a backlink; revisit only for genuine community participation. |
| SourceForge | defer | Pending | Signup path reviewed on 2026-07-03. | Registration requires standalone email/password and optional phone/job/company fields; no OAuth path was visible. SourceForge should only be used if Access Free Tools publishes a real open-source/downloadable project, not as a thin account/profile. |
| npm | blocked | Pending | Signup path reviewed on 2026-07-03. | npm requires a standalone password and states the account email can appear in package metadata when publishing. Do not create an npm account until there is a real package to publish and owner-approved credentials/2FA path. |
| Wellfound | defer | Pending | Company setup path reviewed on 2026-07-03. | The direct company-create URL returned a 404 and visible flows are focused on jobs/recruiting. Revisit only if there is a real hiring/startup profile need. |
| F6S | defer | Pending | Signup/listing path reviewed on 2026-07-03. | F6S appears startup/program oriented and needs a clearer sign-in/setup path before profile creation. Revisit only if Access Free Tools is being positioned as a startup/company listing with truthful startup details. |
| Disqus | defer | Pending | Reviewed on 2026-07-03 from the user-provided opportunity list. | Requires password creation and broad marketing/data-sharing consent. Not a priority backlink profile. |
| DEV Community | defer | Pending/restoration needed | First `@accessfreetools` account had suspended or limited access. | Do not retry public publishing until DEV restores the account or user approves a clean replacement path. See `docs/devto-promotion-agent.md`. |

## Webmaster, Analytics, And Search Accounts

These are not backlink profiles, but they matter for ownership proof and
site monitoring.

| Platform | Status | URL | Notes |
| --- | --- | --- | --- |
| Google Search Console | active | `https://search.google.com/search-console/` | Use for indexing, performance, sitemap submission, and URL inspection evidence. |
| Bing Webmaster Tools | active | `https://www.bing.com/webmasters/` | Used for Bing sitemap/indexing work and Microsoft Clarity setup path. |
| Microsoft Clarity | active | `https://clarity.microsoft.com/` | Tracking project exists for `accessfreetools.com`; site integration should be verified separately in code/deploy checks. |
| CrawlScout | active | `https://crawlscout.com/` | Used for deindexed/recommendation exports. Treat as evidence, not public promotion. |

## Google Or New Email Handoff Queue

Use this queue for platforms that cannot be completed safely without the owner
choosing an email account, setting a password, or using a Google account.

| Platform | Need | Status | Notes |
| --- | --- | --- | --- |
| LinkCentre | New email/password or owner-chosen login | blocked | Free listing path confirmed. Continue only after the owner creates or chooses account credentials and verifies email. |

No reviewed platform is currently confirmed as Google-only. WebCatalog moved
out of this queue on 2026-07-03 after Google OAuth and app submission were
completed; it remains pending public listing review.

## Safe Next Profile Opportunities

Use these only when the platform allows a truthful profile or listing with a
public website field. Do not create fake posts, fake reviews, or paid campaigns.

1. Add the Access Free Tools logo to GitHub and LinkedIn after Chrome file
   upload permission is fixed.
2. Review product/directory opportunities from any user-provided article and
   classify each as `safe profile`, `submit/listing review`, `paid gate`,
   `spam risk`, or `not relevant`.
3. Consider one software-directory listing at a time only when the category is
   accurate: calculators, converters, developer tools, browser utilities, or
   free online tools.
4. Prioritize real content/profile assets over broad Web 2.0 account creation:
   SlideShare/Scribd-style decks, one useful LinkedIn Article, and one quality
   Medium article are safer than empty blogs or duplicate posts.
5. Treat PRLog or press-release sites as milestone-only. Use them only when
   there is genuine news such as a major launch, public data asset, or feature
   release, and keep the copy factual.
6. Use `output/backlink-assets/access-free-tools-overview.pdf` as the first
   upload-ready asset for SlideShare, Archive.org, or similar document platforms
   only when the logged-in browser can verify the final public URL and website
   link. The source files are
   `output/backlink-assets/access-free-tools-overview.md` and
   `output/backlink-assets/access-free-tools-overview.html`.

## Source Review Log

### Collaborator Free Backlinks 2026 Article

Reviewed: 2026-07-03
Source: `https://collaborator.pro/blog/free-backlinks`

Use this article only as an idea source. It mixes normal profile opportunities
with generic directory and Web 2.0 link-building tactics, and several lists are
embedded as images rather than crawlable text. Do not treat its domain rating or
traffic numbers as proof that a listing is useful for Access Free Tools.

| Candidate | Category | Decision | Reason / Next Action |
| --- | --- | --- | --- |
| `linkcentre.com` | Business directory | blocked | Free plan confirmed. Account setup is blocked on owner-created email/password and email verification before any public listing can be submitted. Do not use Google OAuth. |
| `bizcommunity.com` | Business directory | not relevant | Broad business/media community; lower fit for a global online tools site unless it offers an accurate software/tools listing path. |
| `brownbook.net` | Business directory | active / public proof pending | User profile fields were saved without private address exposure. A public user-profile URL was not found, and no business listing was submitted. Continue only with a website-only listing that does not expose a residential address and can be publicly verified. |
| `hotfrog.com` | Business directory | defer | Local directory fit is uncertain. Avoid address-based setup unless a public business address is available. |
| `localpages.com` | Business directory | not relevant | Local listing emphasis is a poor fit for a web-only utility library. |
| `substack.com` | Web 2.0 / publication | defer | Useful only if Access Free Tools runs a real digest/newsletter. Do not create a thin publication just for a backlink. |
| `hackernoon.com` | Publication | defer | Potentially valuable for original technical articles, not a profile-only backlink. Use only after a high-quality developer article is prepared. |
| `sites.google.com` | Web 2.0 | spam risk | Avoid building thin satellite pages solely for links. |
| `wikidot.com` | Web 2.0 | spam risk | Avoid unless there is a real documentation/wiki use case. |
| `steemit.com` | Web 2.0 / social | spam risk | Low brand fit and high link-building footprint risk. |
| `typepad.com` | Web 2.0 / blog | spam risk | Do not create a duplicate blog property solely for links. |
| `instructables.com` | Project/tutorial site | not relevant | Only use if publishing a real hands-on calculator or measurement project. |
| `folkd.com` | Social bookmarking | spam risk | Bookmark-only link building is low-quality for the brand. Avoid unless there is a genuine saved-resource/community use case. |
| `instapaper.com` | Read-it-later/bookmarking | not relevant | Primarily private reading/bookmarking, not a durable public brand profile opportunity. |
| `pearltrees.com` | Curation/bookmarking | live profile / collection opportunity | Public profile is live at `https://www.pearltrees.com/accessfreetools`, but no clickable website link or resource collection was verified. Use only for a real public calculator/tool resource collection rather than a thin bookmark dump. |

### User-Provided Profile And Publishing List

Reviewed: 2026-07-03
Source: user-provided backlink possibilities list.

| Candidate | Category | Decision | Reason / Next Action |
| --- | --- | --- | --- |
| WordPress.com | Web 2.0 / publishing | defer | Use only for a real publication or if Gravatar/WordPress account setup is completed. Do not create a thin mirror blog. |
| Blogger | Web 2.0 / publishing | defer | Google access exists, but the reviewed path pushes into blog creation rather than a profile-only setup. Use only for a real maintained publication, not a thin backlink blog. |
| Medium | Publishing/profile | live | Existing live profile: `https://medium.com/@accessfreetools`. Use only after Medium quality gates. |
| Tumblr | Web 2.0 / publishing | defer | Would require a real content plan. Do not create a thin link-only blog. |
| Weebly / Wix / Jimdo / Strikingly / Site123 | Website builders | spam risk | Avoid thin satellite sites solely for backlinks. Use only if a real microsite/product page strategy is approved. |
| Reddit | Profile/community | blocked | Owner marked this channel blocked. No retries or promotion work. |
| Quora | Profile/Q&A | retired-by-owner | Historical account only. No active work. |
| Pinterest | Visual/profile | live | Existing Business profile is live and verified. |
| LinkedIn | Company profile | not-in-use | Owner states LinkedIn was never used. Exclude from campaigns and reports. |
| GitHub | Developer profile | live | Brand account and README repo are live. Avatar upload remains blocked by Chrome file upload permissions. |
| StackBlitz | Developer profile | live | Public profile created and verified: `https://stackblitz.com/@access-free-tools`. Includes Access Free Tools name and clickable website link. Do not create starter projects unless there is a real code/demo asset. |
| Behance / Dribbble | Creative portfolio | not relevant | Design-portfolio sites are a poor fit unless Access Free Tools starts publishing original design/UI case studies. |
| Disqus | Comment/profile | defer | Requires password and broad data/marketing consent. Not a priority. |
| Gravatar | Profile/link-in-bio | live | Public profile verified: `https://gravatar.com/exactly664c9a321a`. Includes clickable links to Access Free Tools, GitHub, and LinkedIn. |
| About.me | Profile/link-in-bio | live | Public profile verified: `https://about.me/accessfreetools`. Includes updated brand-safe bio and clickable website link to Access Free Tools. |
| Linktree | Profile/link-in-bio | live | Public profile verified: `https://linktr.ee/accessfreetools`. Includes clickable links to Access Free Tools, Pinterest, GitHub, LinkedIn, and Gravatar. |
| Substack | Publishing | defer | Use only for a real newsletter/digest. No thin publication for backlinks. |
| Vocal Media / HubPages / Tealfeed | Publishing | defer | Use only for original articles that pass article-quality review. |
| Hashnode | Developer publishing/profile | live | Public profile created and verified: `https://hashnode.com/@accessfreetools`. Do not publish until there is a real developer/tool guide. |
| Observable | Developer profile/notebooks | live | Public profile created and verified: `https://observablehq.com/user/@accessfreetools`. Includes Access Free Tools name, brand-safe bio, and clickable website link. Do not create notebooks unless there is a real data/visualization asset. |
| Dev.to | Developer publishing/profile | defer | Existing account had limited/suspended access; do not retry until restored or replaced. |
| Mix / Folkd / Diigo | Social bookmarking | spam risk | Avoid as Tier 1 unless used as real curated collections with useful context. |
| Flipboard | Curated magazine | unverified-inactive | Historical claim only. Exclude from campaigns and reports. |
| Slashdot / SourceForge | Software directory/news | defer | SourceForge was reviewed on 2026-07-03. It is best for open-source/downloadable projects or vendor software listings. Do not import the small GitHub profile repo as a thin project; revisit only if Access Free Tools publishes a real open-source package or app repo. |

### Shrushti Web 2.0 Sites 2026 Article

Reviewed: 2026-07-03
Source: `https://www.shrushti.com/seoblog/web-2-0-sites/`

Use this article as a cautionary idea list, not as an execution list. It
correctly warns against spam, duplicate content, keyword stuffing, and exact
anchor overuse, but it also labels many generic Web 2.0/blog-builder links as
high-value. For Access Free Tools, empty satellite sites are a bigger risk than
a benefit.

| Candidate / Pattern | Decision | Reason / Next Action |
| --- | --- | --- |
| WordPress.com, Blogger, Tumblr, Weebly, Wix, Webnode, Strikingly, Google Sites | spam risk unless there is a real publication | Do not create thin mirror blogs or microsites. Use only for a maintained editorial/documentation strategy with unique articles and natural links. |
| Medium | live | Existing profile is live. Publish only after Medium quality gates and public proof checks. |
| LinkedIn Articles | safe content opportunity | Use one real, useful article with a different angle from Medium; no duplicate/spun content. |
| Diigo, DocDroid, Evernote-style document/bookmark tools | defer | Use only for real public collections or useful PDF/deck assets, not naked bookmark dumps. |
| Clutch | not relevant for now | Better for service agencies/vendors than a free utility library unless Access Free Tools becomes a formal software/vendor listing. |

### Reddit Linkbuilding 2026 Tested Sites Thread

Reviewed: 2026-07-03
Source: `https://www.reddit.com/r/linkbuilding/comments/1sjrv0g/i_tested_dozens_of_free_backlink_sites_these_5/`

This thread is more practical than giant backlink lists, but treat the dofollow
claims as unproven because commenters dispute the Medium and SlideShare link
attributes. The useful takeaway is focus: fewer real assets, one natural link
each, and no exact-match anchor stuffing.

| Candidate | Decision | Reason / Next Action |
| --- | --- | --- |
| Medium | live / content opportunity | Existing profile is live. Use only for approved, reader-first articles with one contextual link plus profile link. |
| PRLog | milestone-only | Use only for genuine news; do not issue fake press releases for a backlink. |
| SlideShare | live / content opportunity | Public profile is live with a visible website link. Create a concise, useful deck/PDF from an existing guide or data asset before uploading anything. Verify any future public deck URL and link attributes afterward. |
| Google Business Profile | owner/public-location decision | Useful only if the owner has a public business/service-area setup that can pass Google verification without exposing a private address. |
| LinkedIn Articles | safe content opportunity | Publish a genuinely useful long-form article from the company/personal context only after quality review and public proof. |

### Antops 90+ DA Free Backlinks 2026 List

Reviewed: 2026-07-03
Source: `https://antops.com/90-da-free-backlinks-2026-complete-updated-list-high-authority-sites/`
Local copy reviewed: `C:\Users\chamb\Downloads\90+ DA Free Backlinks 2026 – Updated High Authority List.md`

This list is broad and mixes strong profile sites with irrelevant, risky, or
file-sharing platforms. Use it for candidate discovery only. The safest pattern
is complete, truthful brand profiles on relevant platforms; the riskiest pattern
is file dumps, empty web builders, or irrelevant creative/local/travel profiles.

| Candidate / Group | Decision | Reason / Next Action |
| --- | --- | --- |
| LinkedIn, GitHub, Gravatar, Pinterest, Quora, Reddit, About.me, Docker Hub, Medium, Linktree | already live/active | These are already in the registry. Improve only with truthful profile completeness or real content. |
| SlideShare, Issuu, Archive.org | mixed status | SlideShare profile is live; future uploads should be asset-backed. Review Issuu and Archive.org only for real decks, guides, reports, or archived public assets that help users. |
| Unsplash, Pexels, Dreamstime, Behance, DeviantArt, Sketchfab, Thingiverse | not relevant unless asset strategy exists | Use only if publishing original visual/3D/design assets; no generic account creation for links. |
| MediaFire, 4shared, Pastebin | spam/file-dump risk | Avoid unless there is a legitimate public file or code-snippet distribution need. |
| JustPaste.it | profile live / no paste spam | Public profile verified: `https://justpaste.it/u/accessfreetools`. Do not create pasted articles or link-dump pages unless there is a legitimate user-facing note or asset. |
| Trustpilot, TripAdvisor, OpenStreetMap, Google Business Profile | owner/local proof decision | Avoid unless the business context is truthful and verification does not expose private residential details. |
| SourceForge, npm, developer portals | project-only | Use only when there is a real package, API client, open-source project, or developer artifact. |

### Competitor-Adjacent Calculator Backlink Opportunities

Reviewed: 2026-07-03
Seed competitors: `calculator.net`, `calculatorsoup.com`, `omnicalculator.com`,
`gigacalculator.com`, `inchcalculator.com`, `mortgagecalculator.net`.

Do not expect direct backlinks from large calculator competitors. The useful
pattern is to find neutral pages where those competitors are already cited:
alternative directories, software/app catalogs, resource pages, review pages,
and webmaster/embed pages. Treat competitor evidence as gap research and
placement discovery only; never copy competitor wording, calculators, examples,
or page structure.

| Opportunity Type | Decision | Evidence / Next Action |
| --- | --- | --- |
| AlternativeTo-style alternatives pages | blocked until 2026-07-10 | AlternativeTo has a live `Calculator.net Alternatives` page with an `Add Alternatives` path and multiple online calculator suites listed. Access Free Tools already has an AlternativeTo user profile. The new-app form was inspected on 2026-07-03 and requires an account age of at least 7 days before app submissions. Retry on or after 2026-07-10 with factual fields only: name, official website, short description, full description, English, Free pricing, calculator/utility tags, Online/SaaS platform, Access Free Tools as author, and public URL-based icon/screenshot assets if available. |
| Software/web-app catalog listings | submitted / review one at a time | WebCatalog lists Calculator.net plus many similar calculator sites and exposes a developer Submit new app path. Access Free Tools was submitted to WebCatalog on 2026-07-03 after Google OAuth and owner-completed robot/security verification. Wait for a public WebCatalog listing URL before counting it as a backlink. Review other catalogs one at a time, allow only truthful web app/online utility listings, and avoid irrelevant download portals or fake desktop-app claims. |
| Finance/tax/accountant resource pages | outreach/content opportunity | Search results show professional resource pages linking to Calculator.net calculators. Build a small list of pages that already link to public calculators, then pitch only relevant Access Free Tools alternatives such as mortgage, loan, budget, net worth, sales tax, or retirement calculators with clear no-signup value. No mass outreach. |
| Education/math resource pages | outreach/content opportunity | Calculator.net and scientific-calculator resource pages appear in education/resource contexts. Pitch only pages where Access Free Tools has a stronger or complementary tool/guide, such as fraction, triangle, area, distance, matrix, scientific, or statistics calculators. |
| Review/roundup pages for calculator sites | review only | Calculator.net appears on review/alternatives pages. Seek inclusion only where the page accepts legitimate product suggestions or editorial review. Do not buy fake reviews or create comment spam. |
| Embeddable calculators/webmaster resources | strategic content opportunity | MortgageCalculator.net exposes an embeddable calculator/webmaster path. Access Free Tools should consider a real `/embed/` or `/webmasters/` page for selected calculators before outreach, so site owners have something useful to link to. |
| Competitor sites themselves | mostly not viable | Direct competitors are unlikely to link to Access Free Tools except through error reports, public resource submissions, or mutually useful open-source/data work. Do not ask direct competitors for generic backlinks. |

Safe next steps:

1. Retry the AlternativeTo app/listing submission on or after 2026-07-10, after preparing URL-based icon and screenshot assets.
2. Build a small competitor-citation prospect list from resource pages that
   already cite Calculator.net, CalculatorSoup, Omni Calculator, or
   MortgageCalculator.net. First draft saved:
   `output/backlink-assets/competitor-citation-prospects-2026-07-03.md`.
3. Create one real webmaster/embed asset for a high-value calculator before
   pitching resource pages.
4. Use paid DataForSEO or GSC only for targeted prospect validation, not broad
   backlink scraping.

## Agent Rules

- Before creating a new account, check this registry and
  `docs/promotion-account-launch-kit.md`.
- Public proof must be a visible URL, public profile, public listing, or public
  feed view.
- Do not mark a setup as `live` from a submit button, dashboard, private admin
  page, or memory.
- Do not store passwords, one-time codes, recovery details, cookies, or tokens.
- Stop at CAPTCHA, identity, payment, security, or platform-review gates and
  record the exact blocker.
