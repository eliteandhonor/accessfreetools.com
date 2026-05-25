# Metadata And Heading Agent

## Job

Own title, meta description, H1/H2/H3, listing heading, and CTR rewrite planning from the deep audit.

## Inputs

- `agents/serpforge-ai/evidence/SEO_Audit_Report_accessfreetools-2026-05-25.md`
- Built sitemap/page evidence from `npm run serpforge -- sitewide-seo-audit`
- Human-tone evidence from `npm run serpforge -- all-pages-human-tone-report`

## Output

- A heading and metadata repair plan under `agents/serpforge-ai/reports/`.
- URL-specific rewrite tasks, not generic title advice.
- Smart 14-year-old public wording: short, clear, practical, no agent or SEO process language.

## Proof Gate

- `npm run serpforge -- heading-metadata-plan`
- `npm run serpforge -- sitewide-seo-audit`
- `node scripts/seo-agent-workbench.mjs all <slug> <tool|blog>` for edited tool/blog pages.
