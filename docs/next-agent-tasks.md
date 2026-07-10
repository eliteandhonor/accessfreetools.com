# Access Free Tools Next Agent Tasks

Updated: 2026-07-10

Run `npm run automation:env-check`, `npm run aft -- status`, `npm run aft -- seo-console`, and `npm run aft -- proof-check` before choosing work. Command output and the normalized July 9 reports are the source of truth; old build IDs, old Search Console screenshots, and June approval gates are historical evidence only.

## Current Evidence

- Read `docs/july-9-seo-evidence-recovery.md` for the current Google, Bing, and CrawlScout handoff.
- Google: 591 ranking URLs, 24,103 page impressions, 39 clicks, and 0.16% page CTR.
- CrawlScout sample: 138 not-indexed rows; 127 have impressions and no clicks.
- Bing: 1,996 impressions, 29 clicks, and 1.45% CTR. The Bing export is aggregate trend evidence, not page-level evidence.
- The controlled SEO queue has 602 approved page review units, 0 remaining, and no active gate.
- The technical foundation is healthy: production sitemap checks, indexing protection, structured data, AI crawler visibility, and local mobile checks have no confirmed hard blocker.
- `/sitemap/` is intentionally `noindex,follow` and absent from XML sitemaps.
- Google discovery uses XML sitemaps. `/feed.xml` remains an RSS reader feed and must not be submitted as a Google sitemap.

## Task 1: Finish And Release The Current Audit Hardening

Priority: High

- Complete the current Node 24/Astro 7 audit branch and run the full quality gate.
- Preserve public URLs, tool formulas, sitemap architecture, and deterministic Ask/API/MCP behavior.
- Deploy only after local typechecks, tests, build, SEO checks, accessibility checks, visual checks, and secret/dependency checks pass.
- After deploy, verify Ask/API/MCP and the production sitemap, then submit the XML sitemap set through Search Console and the changed URL set through IndexNow.

Definition of done: a committed audit report identifies each accepted finding, suppressed false positive, changed file, test result, and any residual risk.

## Task 2: Index-Recovery Lane

Priority: High after release proof

- Use the index-recovery list in `docs/july-9-seo-evidence-recovery.md`.
- Classify each page as `recover`, `differentiate`, `merge/canonicalize`, `noindex`, or `monitor` before editing.
- Run `node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>` for every page-level SEO decision.
- Use exact Search Console inspection and targeted DataForSEO only when the page's intent or index status is unclear. Do not run a broad paid crawl.
- Personal Loan Calculator tool and guide are `monitor`: both were fetched successfully but remain `Crawled - currently not indexed`; both current workbench judges pass with zero gaps. Do not rewrite them without newer evidence.

Definition of done: every edited page has exact evidence, a single recovery classification, browser proof, and a final workbench judge with zero gaps.

## Task 3: Ranking And CTR Lane

Priority: Medium

- Keep ranking/CTR work separate from index recovery so an indexed low-CTR page is not treated as a deindexing problem.
- Start from the July 9 high-impression list in `docs/july-9-seo-evidence-recovery.md`.
- Change titles, descriptions, answer blocks, examples, internal links, or schema only when exact page/query evidence supports the change.
- Avoid generic mass rewrites. Record completed URLs in `docs/seo-console-completions.json` so stale exports do not re-add them automatically.

Definition of done: edits preserve intent, avoid clickbait, pass the workbench, and are tracked for the next GSC comparison window.

## Task 4: Search Console Watch Lane

Priority: Medium

- Re-import new GSC and CrawlScout exports when Brendan provides them.
- Use `npm run search-console:inspect-key-urls` for rotating exact-page evidence.
- Do not repeatedly request indexing or restart broad validation without a new Google reason or a meaningful recrawl interval.
- Keep XML sitemap discovery, exact URL inspection, ranking data, and CrawlScout samples as separate evidence types.

Definition of done: the handoff states what changed since July 9 and distinguishes facts from recommendations.

## Task 5: Proof Retention And Safe Cleanup

Priority: Medium after release verification

- Run `npm run maintenance:retention-audit` before considering proof cleanup.
- Run `npm run maintenance:clean:dry-run` and then `npm run maintenance:clean:safe` only for allowlisted rebuildable artifacts.
- Preserve `output/`, `agents/`, `.local/`, Codex state, secrets, and evidence cited by tracked handoffs.

Definition of done: cleanup removes only rebuildable artifacts and all proof, SEO queue, and maintenance audits still pass.

## Always-On Runtime Rules

- Production and local releases use Node 24 and Astro 7.
- Ask/API/MCP must use Astro Node routes; do not add PHP fallbacks or duplicate tool data.
- Public promotion requires its platform quality gate and visible public proof. Draft or button-click state is not proof.
- No page is bulk-noindexed, merged, removed from XML sitemaps, or publicly promoted from aggregate data alone.
