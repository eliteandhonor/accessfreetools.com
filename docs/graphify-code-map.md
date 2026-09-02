# Graphify Code Map

Graphify is an optional local architecture aid for this repository. It does not run in production, deployment, CI, `npm run check`, or the website runtime.

## Supported Use

- Build a deterministic code-only graph from tracked Astro, TypeScript, JavaScript, and JSON source.
- Trace imports and calls across tool pages, React components, API routes, MCP routes, registries, and workers.
- Use graph results as navigation evidence, then verify important conclusions against source and tests.

Graphify does not replace `rg`, TypeScript checks, tests, SERPForge, the SEO workbench, or project documentation.

## Installation

Install the reviewed version in an isolated `uv` environment:

```powershell
uv tool install graphifyy==0.9.53
```

The package name is `graphifyy`; the installed command is `graphify`.

Do not run `graphify install --platform codex`, `graphify codex install`, or `graphify hook install` in this repository. Those commands can change `AGENTS.md` or Git hooks. The retained integration is deliberately command-only.

## Commands

```powershell
npm run graphify:build
npm run graphify:verify
npm run graphify:query -- "How does the MCP route reach the API tool registry?"
npm run graphify:path -- "mcp.ts" "apiToolRegistry.ts"
npm run graphify:explain -- "TextToSpeechAudiobookGenerator"
```

Use `path` for exact dependency questions and `query` for broader discovery. Natural-language queries can return large neighborhoods in this repository, so narrow the terms or confirm the result with `path` and source reads.

The build uses local AST extraction with `--code-only`. It sends no source to a model and requires no API key. Generated files stay in ignored `output/graphify/`.

The verifier records a hash of tracked Graphify-compatible source files. Queries, paths, and explanations stop with a rebuild message when local source has changed since the graph was generated.

## Acceptance Baseline

The September 2, 2026 pilot scanned the complete repository after excluding vendored browser model assets:

- 416 code files scanned.
- 5,755 nodes and 11,605 edges generated.
- Zero dangling endpoints, duplicate edges, or excluded model-runtime files.
- All 90 tracked Astro files represented.
- All 12 required project import paths verified, covering the shared tool route, JSON-to-CSV, Browser TTS, Ask API, MCP, registries, layout, and workers.
- A measured 9.8x graph-query token reduction compared with the tool's full-corpus estimate.

Graphify reported partial syntax extraction for 75 Astro files. This is an accepted limitation because every tracked Astro file and every required import relationship remained present. Do not rely on Graphify alone for symbols declared inside Astro templates.

## Upgrade Rule

Keep version `0.9.53` pinned. Before upgrading, rebuild the graph and require `npm run graphify:verify`, the focused unit test, and several direct source comparisons to pass. Remove the tool with `uv tool uninstall graphifyy` if a future version introduces missing relationships, source changes, unstable Windows paths, or generated-file pollution.
