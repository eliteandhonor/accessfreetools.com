# GEO Second-Opinion Audit

## Purpose

`npm run audit:geo-second-opinion` provides a small, read-only review of how ten representative Access Free Tools pages look after browser rendering. It asks useful questions about crawlable metadata, answer structure, internal discovery, sources, authorship, dates, and passage length.

It does not measure Google rankings, AI citations, visibility, traffic, or reader satisfaction. It is not a release gate.

Google states that the normal SEO requirements also apply to AI features and that no special AI files, schema, or optimization are required. Important content should remain available as text, discoverable through links, and supported by accurate structured data that matches the visible page.

Sources:

- Google AI features and your website: https://developers.google.com/search/docs/appearance/ai-features
- Google structured data introduction: https://developers.google.com/search/docs/appearance/structured-data/intro-structured-data
- Playwright network controls: https://playwright.dev/docs/network
- Playwright page evaluation: https://playwright.dev/docs/api/class-page#page-evaluate

## Reviewed Upstream Project

The audit was informed by ideas in `geo-seo-claude` at the following fixed revision:

- Repository: https://github.com/zubair-trabzada/geo-seo-claude
- Reviewed commit: `5d068e9ca34f50789b68de2a5029ac04aad8cdaa`
- Commit URL: https://github.com/zubair-trabzada/geo-seo-claude/commit/5d068e9ca34f50789b68de2a5029ac04aad8cdaa

No upstream code, installer, Python dependency, prompt, agent, CRM, prospecting workflow, proposal generator, PDF generator, web app, or updater is included. The implementation is original and uses the Playwright dependency already present in Access Free Tools.

## Fixed Review Set

The command audits exactly ten routes:

1. `/`
2. `/tools/`
3. `/free-calculator-resources/`
4. `/categories/ai-tools/`
5. `/tools/kawaii-calculator/`
6. `/tools/json-to-csv-converter/`
7. `/tools/text-to-speech-audiobook-generator/`
8. `/blog/browser-text-to-speech-kokoro-vs-supertonic/`
9. `/blog/remove-ai-writing-tells-before-publishing/`
10. `/developers/mcp/`

The set covers the home page, hubs, tools, owner-written articles, an AI tool, a protected search winner, and the developer discovery page.

## Operation

The default npm command:

1. Builds the current site.
2. Serves the built files on a random loopback port.
3. Opens a new Playwright Chromium context with no saved cookies or login state.
4. Blocks every request outside the local preview origin.
5. Renders each fixed route.
6. Records metadata, headings, counts, hashes, structured-data types, and findings.
7. Deletes complete page text from memory before writing reports.
8. Stops Chromium and the local server in cleanup code.

Production can be reviewed explicitly with:

```powershell
node scripts/geo-second-opinion.mjs --base-url=https://accessfreetools.com
```

Only loopback HTTP and the two Access Free Tools HTTPS hosts are accepted. This prevents the tool from becoming a general-purpose URL fetcher.

## Outputs

Ignored evidence is written to:

- `output/geo-second-opinion/latest.json`
- `output/geo-second-opinion/latest.md`
- `output/geo-second-opinion/runs/<timestamp>/`

Reports contain no cookies, credentials, complete page bodies, form input, or user data. Full body text is reduced to a word count and SHA-256 hash before writing.

## Interpretation

Technical observations cover rendered status, final route, language, title, description, canonical URL, H1 count, visible main content, and JSON-LD parsing.

Heuristic prompts cover opening length, section structure, broad paragraph-length ranges, internal links, external sources, author/date signals, and concrete examples. These are questions for a human reviewer. They are not instructions to pad a page with words, numbers, links, FAQs, or schema.

Always confirm a supported change with the relevant page-level SEO workbench:

```powershell
node scripts/seo-agent-workbench.mjs all <slug> <tool|blog|editorial>
```

Search Console remains the source of truth for Google indexing and performance. Bing, OpenSEO, and production analytics provide additional current evidence.

## Adoption Rule

Keep this audit only while it finds correct, non-duplicative review questions. Remove or narrow a check when it produces repeated false positives. Never use its score in public claims, dashboards, release approval, Search Console submission, or automatic content editing.
