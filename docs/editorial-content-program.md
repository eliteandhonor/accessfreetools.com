# Editorial Content Program

Updated: 2026-08-26

This is the source of truth for first-person Brendan Chambers editorial articles. It is separate from the completed generated tool/blog SEO review queue.

## Release Rules

- Write as Brendan Chambers, the owner of Access Free Tools.
- Use primary technical sources and label untested projects clearly.
- Run `node scripts/seo-agent-workbench.mjs all <slug> editorial` before release.
- Require `npm run check:editorial-quality`, `npm run check:article-visual`, and the full `npm run check` to pass.
- Publish only the row marked `release-ready`; do not expose draft routes or add them to the sitemap.
- The standing owner directive for a fully proven row is `user autonomous completion directive`.
- Deploy on Astro 7 and Node 24, then submit only new or substantively changed URLs through Search Console and IndexNow.

## Program Queue

| Order | Slug | Working title | Target release | Status |
| - | - | - | - | - |
| 1 | `open-source-projects-behind-access-free-tools` | 8 Open-Source Projects I Use to Build Access Free Tools | 2026-07-13 | published |
| 2 | `how-to-check-github-project-before-installing` | How I Check a GitHub Project Before Installing It | 2026-07-13 | published |
| 3 | `browser-ai-vs-local-ai-privacy` | Browser AI vs Local AI: What Actually Stays on Your Device? | 2026-07-20 | published |
| 4 | `tesseract-js-browser-ocr-image-quality` | How I Improve Tesseract.js OCR Results in a Browser | 2026-08-17 | published |
| 5 | `browser-text-to-speech-kokoro-vs-supertonic` | I Refused to Buy a Server for Text to Speech. The Browser Did the Job. | 2026-08-26 | published |
| 6 | `test-free-tools-playwright-vitest` | How I Test Hundreds of Free Tools with Playwright and Vitest | Deferred | deferred |
| 7 | `remove-ai-writing-tells-before-publishing` | How I Remove AI Writing Tells Before Publishing | 2026-09-23 | planned |

## Active Distribution Policy

- The site blog is the primary canonical publication.
- Active external channels are Medium, Bluesky, and Pinterest only.
- Medium companions wait at least seven days and canonicalize to the site article. Original Medium-only stories keep canonical unset.
- Bluesky and Pinterest point to the exact site article after its live release is verified.
- Quora, Reddit, LinkedIn, Flipboard, DEV Community, and other platforms are not part of this program.

## Launch Evidence

- Production deployment `019f5b49-f2fd-7166-920b-39057f726702` completed on Node 24 on 2026-07-13.
- Both launch articles passed the editorial SEO workbench with a 100 internal-link score and zero remaining gaps.
- Live mobile checks confirmed the canonical URL, BlogPosting schema, descriptive 1200 x 630 hero image, source links, and no horizontal overflow.
- Search Console discovery was submitted. Immediate URL inspection correctly reported both new URLs as unknown to Google; this is the pre-crawl baseline, not an indexing failure.
- IndexNow accepted the two new articles, the substantively updated AI-skills article, and `/blog/` with HTTP 200.
- Browser AI vs Local AI was published on 2026-07-29 from commit `fe9b57cf` through Hostinger deployment `019fad6c-232f-72fb-bd64-53e6cdbe54f7` on Astro 7 and Node 24.
- Its live page passed desktop and mobile visual checks, metadata and schema checks, a 660-URL production sitemap check with zero hard failures, Ask/API/MCP checks, Search Console discovery and exact URL indexing request, and an HTTP 200 IndexNow submission.
- The browser TTS story was selected on 2026-08-26 after the owner rejected the internal testing topic as dull. Fresh reader research showed demand around no-sign-up access, MP3 export, local processing, and reliable voice switching. The article uses measured Kokoro, Supertonic, Edge fallback, MP3, and chapter-voice evidence from the live Access Free Tools implementation.
- The browser TTS story was published from commit `c34caae1` on Astro 7 and Node 24. Its live canonical, metadata, BlogPosting schema, hero alt text, desktop layout, Ask/API/MCP runtime, and 662-URL production sitemap were verified. Search Console accepted the sitemap refresh, and IndexNow accepted the article and `/blog/` with HTTP 200.
- Its owner-written Bluesky companion was published and publicly verified at `https://bsky.app/profile/accessfreetools.bsky.social/post/3mtxpy2qbzc2h`. The public post shows the approved 294-character copy, the exact article destination, the article card title, and the cleaned hero image.
- Its Medium companion was published and publicly verified at `https://medium.com/@accessfreetools/why-i-nearly-bought-a-tts-server-before-testing-kokoro-vs-supertonic-31e4e9b8fcae`. The live story shows Brendan's first-person account, the approved hero and literal alt text, five focused topics, primary project sources, contextual site links, and a canonical pointing to the original Access Free Tools article.

## Remaining Briefs

### Browser AI vs Local AI

- Intent: `browser AI vs local AI privacy`.
- Use real Access Free Tools examples: browser-side OCR/model loading, optional Ollama routing, and deterministic calculator answers.
- Explain that browser-side does not automatically mean private in every app; network requests, model downloads, analytics, and user choices still matter.
- Link `/categories/ai-tools/`, `/tools/image-to-text-ocr-tool/`, `/ask/`, `/privacy-policy/`, and the open-source stack article.

### Tesseract.js OCR Image Quality

- Intent: `Tesseract.js browser OCR image quality`.
- Use screenshots and photos to explain blur, glare, crop, contrast, tiny text, language selection, and manual checking.
- Link the OCR tool and its matching guide contextually before the final section.
- Do not promise perfect recognition or claim uploaded images never leave the device without checking the exact live implementation.

### Testing Hundreds of Free Tools

- Intent: `automated website testing with Playwright and Vitest`.
- Explain the split between deterministic unit tests and real-browser visual/accessibility checks.
- Use the four editorial viewports and the Four in a Row rules tests as concrete examples.
- Verify the current tool/page count at publication time instead of hardcoding a stale number.

### Removing AI Writing Tells

- Intent: `how to make AI-assisted writing sound human`.
- Show a short original before-and-after example, the Stop Slop five-part score, and the reader-first gate.
- Link the Reading Level Checker, Keyword Extractor, earlier AI-skills article, and this program's published articles.
- Make clear that editing improves clarity; it does not prove authorship, originality, or factual accuracy.

## Measurement

- At 28 days, record index status, impressions, queries, CTR, and first-party article engagement.
- At 56 days, decide whether the cluster has enough evidence for a second content program.
- Pause new cluster expansion when the articles remain unindexed or receive no useful engagement evidence.
