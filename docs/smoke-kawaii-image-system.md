# Smoke-Kawaii Image System

Access Free Tools is building one unique smoke-style kawaii image for every canonical tool page and one related but distinct image for every matching guide page.

The public site must only show images marked `approved`. Repeated placeholder art is rejected, even if it passes file-size or sitemap checks.

## Rules

- Images are useful page media, not hidden SEO decoration.
- Artwork must be G-rated, chibi/kawaii, smoke-shaped, and free of readable text, logos, brand names, or sexualized styling.
- Every approved character must be full body with all hair, smoky wisps, hands, props, and the lower floating smoke tail fully inside the frame. Do not approve cropped hair, cropped hands, or cut-off body shapes.
- Before creating an image, research the exact tool first. Read the tool definition, examples, FAQ/formula wording, matching guide, and any relevant runner or page logic. Do not generate from the tool name alone.
- Every image must visibly represent the actual tool, not just its broad category. Use concrete visual cues from that tool's inputs, outputs, formulas, examples, units, or result interpretation.
- The established mascot is the smoky kawaii girl: translucent grey-white smoke body, wispy hair, dress-like smoke shape, tiny hands, heart chest glow, and lower floating smoke tail on a charcoal smoke background. Do not approve purple ghost/spirit redesigns or generic mascot substitutes.
- Tool images show the mascot presenting or using the utility concept.
- Guide images show the mascot explaining or organizing the same concept in a different composition.
- Guide images need a distinct teaching/organizing composition from the matching tool image, while still using exact-tool cues.
- Alt text should describe the picture naturally. Do not stuff keywords.
- Tool and guide pages must embed the image with a normal `<img src>` element, explicit width and height, and descriptive alt text.
- Gallery cards must link back to the matching tool or guide page.
- Use GPT Image for real artwork. Script-made placeholder art can be used for prompt planning only, never as approved public artwork.
- Do not publish a batch until every image in that rollout has passed visual QA.

## Pre-Generation Research

For each tool/guide pair, write a short visual brief before generating art:

- Exact tool purpose in one sentence.
- Inputs the user enters.
- Main result/output the tool returns.
- Formula, conversion, or logic the page explains.
- One or two example scenarios from the tool or guide.
- Visual objects that represent this exact tool without readable text.
- What would make the image too generic or misleading.

Use the repo as the source of truth first: the tool data file, matching blog guide data, page text, examples, FAQ, and runner logic when needed. Use outside research only when the local tool/guide does not explain the concept enough.

## Files

- Manifest: `src/data/toolArtManifest.ts`
- Runtime helper: `src/data/toolArt.ts`
- Page component: `src/components/ToolArtFigure.astro`
- Images: `public/tool-art/{slug}-tool.webp` and `public/tool-art/{slug}-guide.webp`
- Thumbnails: `public/tool-art/thumbs/{slug}-tool.webp` and `public/tool-art/thumbs/{slug}-guide.webp`
- Gallery hub: `/gallery/`
- Gallery category pages: `/gallery/{category}/`
- Image sitemap: `/sitemap-images.xml`

## Commands

- `npm run images:manifest` regenerates the tracked manifest and report.
- `npm run images:generate` writes a GPT Image prompt queue to `output/tool-art-gpt-image-queue.md` and `.json`.
- `npm run images:crop-audit` writes `output/tool-art-crop-review/` reports and contact sheets for approved-looking files that may violate the full-body/no-crop rule. Treat this as visual-review evidence, not automatic approval or rejection.
- `npm run images:qa` checks manifest freshness and approved image files only. Queued images are not embedded publicly.
- `npm run images:sitemap-check` checks the built image sitemap for approved image entries.
- `npm run gallery:qa` checks built gallery pages and backlinks for approved image entries.

## New Tool Reminder

After adding a new public tool, run:

```bash
npm run images:manifest
npm run images:generate
npm run build
npm run images:qa
npm run images:sitemap-check
npm run gallery:qa
```

Do not mark the new page image-ready until the GPT Image tool image, GPT Image guide image, gallery link, and sitemap checks pass with `status: approved` and `qaStatus: approved`.
