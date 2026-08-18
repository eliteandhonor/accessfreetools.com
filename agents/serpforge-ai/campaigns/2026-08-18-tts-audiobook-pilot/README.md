# Browser Text-to-MP3 Pilot Campaign

This campaign adds a browser-only multilingual text-to-MP3 tool to the existing Access Free Tools Astro 7 site on Hostinger Node 24. The visitor pastes text, and the browser downloads the pinned model, generates speech, and creates an MP3 locally. The tool requires no purchase, separate host, owner PC, upload API, or background service. The tool and guide stay `noindex,follow` and out of XML sitemaps until production-browser beta evidence passes.

## Roles

- `infrastructure`: existing-site integration, route isolation, model-host reachability, caching, and rollback evidence.
- `model-audio`: pinned Supertonic browser model and MP3 encoder, language and voice verification, WebGPU/WASM behavior, MP3 quality, and source risk.
- `product-accessibility`: paste-only UI, worker lifecycle, MP3 preview/download, keyboard, mobile, and screen-reader proof.
- `security-privacy`: no-upload boundaries, worker isolation, dependency review, model-source integrity, and Clarity masking.
- `seo-content`: demand evidence, page copy, sources, artwork, internal links, and both SEO workbench lanes.
- `release-judge`: the only role allowed to mark a task `approved`.

## Standing Gates

1. No purchase, plan upgrade, VPS, DNS record, Docker service, paid inference API, or owner-PC dependency is permitted for this pilot.
2. OpenSEO is the first research layer. If unavailable, record `not enough data`; the paid fallback is capped at 15 phrases and USD 0.50 after a balance check.
3. Browser helper code is pinned to source commit `7e2804f96016a7028cb1ed627353c61c1e9dd281`; model files are pinned to revision `3cadd1ee6394adea1bd021217a0e650ede09a323`.
4. Input text and generated audio must stay in the visitor's browser. Analytics and proof reports may contain only text-free events.
5. The public beta requires local and production-browser generation, valid MP3 download, mobile/accessibility proof, and no regression to the main site.
