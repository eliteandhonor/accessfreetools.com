# Access Free Tools Marketing Orchestrator

Last updated: 2026-05-18

The Marketing Orchestrator is the coordinator above the SEO, content, internal-link, and promotion agents. It does not replace platform agents. It decides what should happen next, checks evidence, prevents duplicate reporting, and blocks unsafe "done" claims.

## Operating Rule

The orchestrator is report-only in v1. It can read reports, rank next actions, and explain blockers. It must not publish posts, edit live pages, send outreach, run ads, store secrets, or mark work complete without proof.

## Five Workstreams

1. Intelligence
   - Source of truth: Google Search Console for indexing, clicks, impressions, CTR, and position.
   - Market proof: DataForSEO for targeted keyword, competitor, and live SERP checks.
   - Support signals: Bing Webmaster Tools, IndexNow, sitemap, RSS, and production health reports.

2. Content
   - Source of truth: `docs/brand-code.md` and `docs/article-writing-agent-standard.md`.
   - Jobs: improve tool pages, blog guides, Medium articles, DEV Community articles, Quora answers, Reddit replies, Bluesky posts, and Pinterest copy.
   - Standard: practical examples, clear limits, natural internal links, no generic filler.

3. Review And Testing
   - Source of truth: local quality scripts and public proof checks.
   - Jobs: run platform quality gates, check Medium hero images, verify public URLs, and stop bad drafts before publishing.

4. Distribution
   - Source of truth: platform-specific agent docs.
   - Jobs: route work to Pinterest, Medium, DEV Community, Bluesky, Quora, Quora Space, and Reddit.
   - Rule: promotion must answer a real question first and disclose ownership when linking.
   - Recognition rule: a platform counts only when the public proof exists. Drafts and submit-button success do not count.

5. Reporting
   - Source of truth: `docs/promotion-queue.md` and `output/marketing-orchestrator/`.
   - Jobs: produce a short daily plan with wins, blockers, and 1 to 3 best next actions.
   - Rule: facts and ideas must be separate.

## Specialist Routing Upgrade

Before ranking work, load `docs/recommended-agency-agents.md` and choose the
smallest specialist lens that fits the action:

| Workstream | Specialist lens | Proof lens |
| --- | --- | --- |
| Intelligence | SEO Specialist or AI Citation Strategist | Reality Checker |
| Content | Technical Writer | Evidence Collector |
| Review And Testing | Accessibility Auditor, API And MCP Tester, or Performance Benchmarker | Reality Checker |
| Distribution | Legal Compliance Checker + platform agent | Evidence Collector |
| Reporting | Analytics Reporter | Reality Checker |

The orchestrator should name the lens in the report when it changes the next
action. It must still keep recommendations to 1 to 3 items.

## Ownership Map

| Work | Owner | Evidence |
| --- | --- | --- |
| Daily SEO and promotion overview | Marketing Orchestrator | `output/marketing-orchestrator/daily-plan.md` |
| Search Console indexing truth | SEO scripts | `output/search-console-url-inspection.json` |
| DataForSEO balance and service health | Daily SEO/marketing overview, weekly SEO, monthly crawl, deep audit | `output/dataforseo-account.json`, `output/dataforseo-status.json` |
| Medium draft quality | Medium Promotion Agent | `output/promotion/medium-quality-report.json` |
| Pinterest RSS health | Pinterest RSS report | `output/promotion/pinterest-rss-report.json` |
| Reddit draft safety | Reddit Promotion Agent | `output/promotion/reddit-quality-report.json` |
| Bluesky draft safety and API posting proof | Bluesky Promotion Agent | `output/promotion/bluesky/bluesky-quality-report.json` |
| Quora draft safety | Quora Promotion Agent | `output/promotion/quora-quality-report.json` |
| DEV Community draft safety | DEV Community Promotion Agent | `output/promotion/devto/devto-quality-report.json` |
| Public live status | Platform proof only | public URL, public profile/feed view, or screenshot |
| Brand recognition tracker | Recognition Tracker | `output/recognition-tracker/` |

Do not recreate a standalone DataForSEO top-up agent while the owner jobs above are active.

## Daily Decision Rules

The orchestrator should recommend only 1 to 3 actions.

Priority order:

1. Fix a quality blocker that could damage trust.
2. Improve or promote a page that Search Console says is unknown, discovered, or crawled but not indexed.
3. Verify a platform item that is already connected but lacks public proof.
4. Publish or prepare one approved, quality-passed promotion item if the platform cadence allows it.
5. Add or improve internal links when a page has promotion interest but weak discovery.
6. Improve recognition proof when a platform has drafts, profiles, or pending RSS but no public URL.

The orchestrator should ask the user only when blocked by:

- Login, CAPTCHA, email, phone, or identity checks.
- Payment, ads, affiliate placement, or legal risk.
- Platform policy uncertainty.
- A post that is not already covered by the user's current approval.

## Proof Gates

Never mark any promotion as `posted`, `updated`, `done`, or `fixed` unless one of these exists:

- Public URL that opens and shows the change.
- Public profile or feed view showing the item.
- Screenshot saved in `output/` showing the live state.
- Generated report proving the non-public action, such as RSS health or sitemap verification.

Draft quality gates must block:

- Agent-facing text in reader copy.
- Generic filler.
- Missing ownership disclosure where a self-link is used.
- Missing contextual internal links in Medium.
- Missing real problem, realistic example, or useful next step in long-form promotion.
- Hero image layout failures.
- Platform score below the configured threshold.

## Report Shape

`npm run marketing:orchestrate` writes:

- `output/marketing-orchestrator/daily-plan.json`
- `output/marketing-orchestrator/daily-plan.md`

Each report should include:

- Generated time.
- Owner lane.
- Specialist routing evidence from `docs/recommended-agency-agents.md`.
- Evidence files read.
- Current wins.
- Current blockers.
- Recommended next actions, limited to 1 to 3.
- Quality-gate status by platform.
- Proof policy reminder.

The report should be short enough to act on.
