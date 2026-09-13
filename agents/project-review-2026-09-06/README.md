# GPT-6 Project Review And Goals

Reviewed September 6, 2026. Baseline: fresh origin/main `90d6dcab0580a91ca66382f2414d95e8817469e5`. Five GPT-6 specialists reviewed distinct systems; an independent GPT-6 judge validated the principal findings and approved this review/task package after one completeness correction. The coordinator ran the full project gate and read-only production checks.

**Recommendation: repair correctness, privacy boundaries and the release gate before adding more features or publishing more content.** The site is serving successfully, but green existing tests do not cover several reproduced failure cases.

## Highest-Priority Work

1. **Restore the dependency release gate.** Current npm audit reports fast-uri and qs advisories, including dependent ajv: three affected package nodes, two high and one moderate. This is a known dependency finding, not proof of a site compromise. SEC-01.
2. **Stop Ask returning answers to partial or reinterpreted questions.** `18% of 1,000` returns `0.18`; ISO date questions can become arithmetic; explicit metric/phase/pricing qualifiers are lost. COR-01 and COR-02.
3. **Explicitly mask private OCR/text/Ask output from session recording.** Missing masks create a conditional exposure risk unless Clarity settings compensate. No actual user-data disclosure was demonstrated. SEC-02.
4. **Bound JSON-to-CSV expansion before allocation.** A small sparse input can imply billions of output cells. Do not run the dangerous allocation to prove the limit. BR-01.
5. **Enforce the four-channel policy at every publishing boundary.** An old DEV npm command still embeds public-post flags; mixed-channel rows can hide unfinished Medium work. No unauthorized publication was performed or observed. PR-01.

The transcriber is **not deployed**. Its dirty feature worktree needs overlap, resampling, cancellation, caption-format and privacy-test fixes before the real full-hour/browser gates. Keep noindex and the browser-only/no-purchase design. TR-01 through TR-03.

## Goals And Ownership

The [task board](task-board.md) assigns **29 tasks across nine goals**. [campaign.json](campaign.json) is the authoritative structured task definition. Each agent has AGENT.md, goal.md, reference.md, tasks.md and an append-only worklog. BR-04 explicitly preserves TTS's separate real-model/device and beta-exit gates.

| Goal | Owner | Outcome |
| --- | --- | --- |
| G1 | Security And Privacy | Patched dependencies and explicit private-content boundaries |
| G2 | Calculation And API Correctness | Complete question parsing, sound dates/numbers, clear errors and bounded calls |
| G3 | Browser Runtime And Resource Safety | Bounded imports/conversions and recoverable TTS/OCR operations |
| G4 | Transcriber DSP And Privacy QA | Faithful text/captions and measured browser compatibility before release |
| G5 | Search And Analytics Evidence | Original observation dates, honest coverage and valid pilot decisions |
| G6 | Frontend And Accessibility | Reliable focus and usable narrow-screen discovery |
| G7 | Brendan Editorial And Four-Channel Promotion | Exact channel state, source review and public-proof gates |
| G8 | Automation And Deployment Proof | Correct source/evidence worktrees, current schedules and deployed revision proof |
| G9 | Release And Proof Judge | Independent review and later task-specific release decisions |

These are durable repo-local assignments, not nine new scheduled jobs or permission for agents to publish. Existing SERPForge, TTS, editorial and marketing campaigns retain ownership. No historical 604-unit SEO queue was reopened.

## Fresh Results

| Check | Result |
| --- | --- |
| Node | v24.20.0; Astro 7 retained |
| Both TypeScript lanes | Passed |
| Unit suite | 565 tests / 68 files passed |
| Browser smoke | 110 tests passed |
| Build, links, metadata, schema, article quality, image QA | Passed |
| Article geometry / key geometry / automated accessibility | 7 articles x 4 sizes / 15 pairs / 27 pairs passed |
| Lazy model checks | 665 non-AI and 9 AI initial pages passed |
| Complete npm run check | **Failed at dependency audit**; not approved for deployment |
| Production sitemap | 663 OK, zero hard failures; four supplemental redirect checks |
| Live Ask/API/MCP | Deterministic answer and advertised methods verified |
| Hostinger | Latest recorded build completed on Node 24, app.js and dist; exact deployed Git SHA not proven |
| DataForSEO | **Healthy, US$10.92**, verified after owner corrected IP; no paid research |
| OpenSEO | Not callable; current market-research evidence unavailable |

The frontend specialist captured 37 screenshots and reproduced focus problems that the existing geometry/axe gates miss. On tablet the full tools category rail places the first result around y=1446, below the first screen. See [frontend findings](reports/frontend-quality.md), including the exact screenshot paths and test sequences. Do not replace the mascot artwork based on this sample; inspected art and article body layouts were usable.

## Evidence And Limits

- [Correctness](reports/correctness.md): five reproduced findings, 173 focused tests and explicit API coverage.
- [Privacy/security](reports/privacy-security.md): six findings plus separate hardening questions; 74 focused tests.
- [Browser products](reports/browser-products.md): 12 main/draft findings; 102 focused tests; real-device/full-hour gates unperformed.
- [Search/content/promotion](reports/search-content-promotion.md): eight evidence/policy findings; 86 focused tests; saved export provenance distinguished from current inspections.
- [Frontend](reports/frontend-quality.md): keyboard reproductions, screenshots, tablet geometry, unresolved axe items and performance-measurement limits.
- [Operations](reports/operations.md): independent full-suite, live health, runtime, automation and worktree evidence.
- [Release Judge](reports/release-judge.md): independent adjudication, including any severity corrections or remaining conditions.

Focused test counts overlap the full suite; do not add them as unique tests. Review coverage is all major project systems with representative and boundary-driven inspection, **not every calculator formula, page, language or device exhaustively certified**.

Fresh production reports contain 42 visitors, 68 page views and 244 actions for the requested 30 days, but the same totals appear in the 90-day report. Storage coverage/continuity is not proven. Do not compare these with older totals as a decline. Four in a Row has zero measured starts; preserve the September 7 plus 100-start and valid-evidence gates.

The Sep 2 recovery worktree has fuller saved search exports than the old promotion cwd. GSC chart and page totals differ and remain separate. Downloads only has older Aug 26 exports now. Missing local artifacts are not zero traffic. Keep Kawaii unchanged; no new indexing requests, broad rewrites or growth expansion were justified by this review.

## What Changed

Only this review campaign's documents/verifier were authored in `codex/gpt6-project-review-sep6`; ignored reports, dependency installation and screenshots support the review. The original dirty promotion checkout and unfinished transcriber source were preserved. No product fixes, deployment, public posts, ad clicks, purchases, indexing submissions or automation changes occurred.

Start with [plan.md](plan.md). Validate the package with `node agents/project-review-2026-09-06/verify.mjs --require-local-proof`. See [completion-audit.md](completion-audit.md) for the review decision, distinct from unfinished implementation.
