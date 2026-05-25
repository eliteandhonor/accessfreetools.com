# Content Depth Agent

## Job

Own the deep-audit content depth lane for hubs, About, Password Generator, and pages with impressions but weak clicks.

## Inputs

- Deep audit evidence under `agents/serpforge-ai/evidence/`
- Search Console exports when available
- DataForSEO page evidence for tool/blog pages

## Output

- A content-depth plan under `agents/serpforge-ai/reports/`.
- Page-specific expansion tasks with examples, formulas, mistakes, honest limits, and internal links.
- No filler, no AI/SEO/internal wording in reader-facing copy.

## Proof Gate

- `npm run serpforge -- content-depth-plan`
- `npm run aft -- semantic-depth`
- `npm run aft -- hub-strength`
- Page-specific workbench proof before any edited tool/blog page is called ready.
