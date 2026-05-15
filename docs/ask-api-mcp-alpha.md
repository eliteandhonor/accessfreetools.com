# Ask Access Free Tools API And MCP Alpha

Last updated: 2026-05-15

Access Free Tools now has an alpha tool execution layer for a chatbot, REST API,
and MCP clients. The important rule is that exact answers come from deterministic
Access Free Tools code. Ollama is used for tool routing in the alpha; final answer
wording is kept deterministic so the model cannot rewrite exact numbers.

## Local Secrets

Local development reads:

```text
.local/ollama.env
```

Required:

```env
OLLAMA_API_KEY=your-private-ollama-key
AFT_ASK_ENABLED=true
```

Optional:

```env
OLLAMA_MODEL=gpt-oss:120b
AFT_API_BETA_TOKEN=private-beta-token
```

`.local` is ignored by Git. Never commit Ollama keys, beta tokens, prompts that
contain secrets, or API response logs that include private user input.

## Hostinger Environment

Recommended Hostinger variables:

```env
OLLAMA_API_KEY=your-private-ollama-key
AFT_ASK_ENABLED=true
```

The app also supports `OLLAMA` as a legacy environment-variable name because
the first Hostinger setup used that key name. Prefer `OLLAMA_API_KEY` for future
clarity.

After environment changes in Hostinger, redeploy or restart the Node app so the
server process sees the new values.

Production note: Ask/API/MCP must run through the Astro Node server. Hostinger
needs the JavaScript deployment entry file set to `app.js`, output directory
`dist`, build script `build`, and Node 22. Use:

```powershell
npm run hostinger:deploy-node
npm run check:live-ask
```

`check:live-ask` must show `/api/v1/ask` using `route.source: "ollama"`. Do
not add PHP fallback routes or duplicated PHP tool data; if the Node runtime is
not active, fix the Hostinger Node deployment instead of serving stale fallback
answers.

For local tests only, `AFT_ASK_FORCE_FALLBACK=true` can force the deterministic
pattern router. Production should not set that flag; if Ollama cannot route a
question, Ask should return a clear unavailable message instead of pretending it
used the model.

## Public Interfaces

- Visitor chatbot: `/ask/`
- REST tool list: `/api/v1/tools`
- REST run tool: `/api/v1/run/{tool_slug}`
- Ask route: `/api/v1/ask`
- OpenAPI: `/api/openapi.json`
- MCP endpoint: `/mcp`
- Developer notes: `/developers/mcp/`

## Safety Rules

- Every answer should identify the tool used.
- Finance, health, construction, electrical, privacy, and other high-trust tools
  must keep warning text visible in API and chatbot responses.
- If a question cannot be matched to an API-ready tool, return a clear "not
  available yet" message instead of guessing.
- Do not store raw private user questions in public reports.

## Current Starter Tools

The alpha starts with percentage, tip, BMI, mortgage, concrete, paint, download
time, watts to amps, word counter, JSON formatter, Base64, URL encode/decode,
password generator, subnet, and date difference.

## Key Rotation

The first Ollama key was pasted into chat during setup. Once the deployment is
working, create a fresh Ollama key, replace the local and Hostinger values, and
delete the old key in Ollama settings.
