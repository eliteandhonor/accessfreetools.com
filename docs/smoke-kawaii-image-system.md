# Smoke-Kawaii Image System

Access Free Tools is building one unique smoke-style kawaii image for every canonical tool page and one related but distinct image for every matching guide page.

The public site must only show images marked `approved`. Repeated placeholder art is rejected, even if it passes file-size or sitemap checks.

## Rules

- Images are useful page media, not hidden SEO decoration.
- Artwork must be G-rated, chibi/kawaii, smoke-shaped, and free of readable text, logos, brand names, or sexualized styling.
- Every approved character must be full body with all hair, smoky wisps, hands, props, and the lower floating smoke tail fully inside the frame. Do not approve cropped hair, cropped hands, or cut-off body shapes.
- Tool images show the mascot presenting or using the utility concept.
- Guide images show the mascot explaining or organizing the same concept in a different composition.
- Alt text should describe the picture naturally. Do not stuff keywords.
- Tool and guide pages must embed the image with a normal `<img src>` element, explicit width and height, and descriptive alt text.
- Gallery cards must link back to the matching tool or guide page.
- Use GPT Image for real artwork. Script-made placeholder art can be used for prompt planning only, never as approved public artwork.
- Do not publish a batch until every image in that rollout has passed visual QA.

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
