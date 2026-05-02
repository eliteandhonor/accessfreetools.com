# Deep Audit Overview - 2026-05-02

This audit reviewed the current Access Free Tools codebase, generated site output, SEO automation, DataForSEO integration, source links, indexing reports, and performance budgets.

## Research Basis

- Google Search Central SEO Starter Guide: descriptive titles, crawlable pages, internal links, useful content, and clean sitemaps.
- Google helpful content guidance: pages should be made for people first, not search engines first.
- Google structured data policies: structured data must match visible page content.
- web.dev Core Web Vitals: LCP under 2.5s, INP under 200ms, CLS under 0.1.
- DataForSEO v3 docs: check API status, handle response status codes, use Sandbox for endpoint shape tests, and store paid research reports locally.
- AdSense, FTC, WCAG, and OWASP guidance already tracked in `docs/full-site-improvement-plan.md`.

## Fresh Audit Results

- DataForSEO status: production services checked as healthy for appendix, DataForSEO Labs, SERP, and OnPage.
- DataForSEO balance: above the $10 warning threshold and above the $2 emergency top-up threshold.
- Search Console snapshot in the SEO self-evaluation: home page and Basic Calculator indexed; `/tools/`, `/blog/`, and Image OCR discovered but not indexed yet.
- DataForSEO ranking gaps: `/calculators` and `/deep-research` were old ranking URLs and are now mapped to canonical 301 redirect targets.
- External links: reduced from 22 review links to 0 current review links after replacing brittle or blocked references.
- Blog hub weight: reduced the built `/blog/` page from roughly 288 KB to roughly 129 KB by moving full guide search data into `/blog-search-index.json`.
- Tools hub weight: remains under the current soft HTML budget after using the existing `/tool-search-index.json` split.
- AI assets: still intentionally large, but verified as lazy assets that non-AI pages do not request statically.

## Improvements Completed

- Added hardened DataForSEO API handling with top-level status checks, task-level status checks, `tasks_error` checks, known paid/API error hints, Sandbox base URL support, and rate-limit logging.
- Added `npm run dataforseo:status` and `npm run dataforseo:status:sandbox`.
- Updated SEO self-evaluation to check DataForSEO service health before paid research, follow balance guardrails, and include competitor and related-keyword research.
- Added canonical redirects for `/calculators`, `/calculators/`, `/deep-research`, and `/deep-research/`.
- Strengthened `/categories/calculators/` for broad calculator intent while keeping focused tools as the user path.
- Improved Basic Calculator search relevance for "free online calculator", "basic calculator online free", and large browser calculator queries.
- Added lazy blog guide search through `/blog-search-index.json`.
- Limited blog hub collection JSON-LD to the first 100 listed items while keeping the real `numberOfItems`.
- Added external-link report output at `output/external-link-audit.json`.
- Replaced brittle source links with accessible references from OpenStax, FINRA, CFPB, PubMed, FDA, DOE, NIST CSRC, Mayo Clinic, ACOG, GitHub, R&A, Benefits.gov, and relevant calculator references.

## Remaining Watch Items

- Google indexing still needs time and Search Console monitoring. The next production step is to resubmit the sitemap index and inspect `/categories/calculators/`, `/tools/`, `/blog/`, `/tools/basic-calculator/`, and `/tools/image-to-text-ocr-tool/`.
- The largest AI model files remain above the soft asset budget by design. Keep AI tools lazy-loaded and consider slimmer models later if user experience suffers.
- The Transformers bundle and ONNX WASM warning remain expected for the AI tool section. Non-AI pages should continue passing the AI lazy-asset check.
- Before the site reaches 500+ tools, keep splitting search indexes and avoid making `/tools/` or `/blog/` carry every card in initial HTML.
- Future affiliate/product links must use visible disclosures and `rel="sponsored nofollow"` before launch.

## Repeatable Proof Commands

```bash
npm run dataforseo:account -- -- --min-balance=2 --warn-balance=10
npm run dataforseo:status
npm run seo:self-evaluate
npm run check:external-links
npm run check
```
