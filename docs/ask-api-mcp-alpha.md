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

The app also supports `OLLAMA` as a fallback because the first Hostinger setup
used that key name. Prefer `OLLAMA_API_KEY` for future clarity.

After environment changes in Hostinger, redeploy or restart the Node app so the
server process sees the new values.

Production note: the current Hostinger deployment is serving the public Apache/PHP
layer, so `public/api/v1/*.php`, `public/mcp.php`, and `public/.htaccess` mirror
the same core API routes for live traffic. Keep the TypeScript Astro routes as
the source for the Node deployment path, and keep the PHP fallback working until
Hostinger is definitely running the Node server for dynamic routes.

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
