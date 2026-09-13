# Ask Access Free Tools API And MCP Alpha

Last updated: 2026-07-02

Access Free Tools now has an alpha tool execution layer for a chatbot, REST API,
and MCP clients. The important rule is that exact answers come from deterministic
Access Free Tools code. For supported starter questions, the local parser picks
the tool and the server runs the real tool runner. Ollama is reserved for
ambiguous routing, and final answer wording is kept deterministic so the model
cannot rewrite exact numbers.

## Agent Upgrade Gates

For current-agent upgrades, use `docs/recommended-agency-agents.md` with these
specialist lenses:

- API And MCP Tester for REST routes, MCP calls, OpenAPI output, tool schemas,
  and deterministic runner parity.
- Agentic Search Optimizer for AI-agent discovery and task-completion flow.
- Reality Checker before claiming Ask/API/MCP is live, fixed, or production
  ready.

Minimum proof before a done claim:

```powershell
npm run aft -- ask-audit
npm run aft -- api-ready
npm run aft -- mcp-smoke
```

After deployment-related API/Ask/MCP changes, also run:

```powershell
npm run check:live-ask
```

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
When `AFT_API_BETA_TOKEN` is set, API clients must send it with the
`x-aft-api-token` header or an `Authorization: Bearer ...` header. Query-string
tokens such as `?token=` are intentionally rejected so private tokens do not end
up in browser history, logs, referrer headers, or shared URLs.

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
`dist`, build script `build`, Node 24, and a server process listening on port
`3000` when Hostinger does not provide a valid `PORT` environment value. The
generated `dist/app.js` wrapper must not use top-level `await`, because
Hostinger's runtime loads the entry through a CommonJS `require()` wrapper. Use:

```powershell
npm run hostinger:deploy-node
npm run check:live-ask
```

`npm run hostinger:deploy-node` uses Hostinger Node 24 only. Do not set
`HOSTINGER_NODE_VERSION` or npm `--node-version` to Node 22 for Access Free
Tools production deploys.

`check:live-ask` must show `/api/v1/ask` using `route.source: "parser"` or
`route.source: "ollama"` and must never show `php-router`. Do not add PHP
fallback routes or duplicated PHP tool data; if the Node runtime is not active,
fix the Hostinger Node deployment instead of serving stale fallback answers.

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

### Shared Execution Policy

REST execution, Ask, and every MCP POST (including initialize and tools/list)
use the same optional `AFT_API_BETA_TOKEN` header check. With no configured token,
these interfaces are public. With a token, use `x-aft-api-token` or
`Authorization: Bearer ...`; query credentials never authorize execution.
HTTP tool catalogs, schemas, OpenAPI, and developer documentation stay public.

Accepted REST, Ask, and MCP requests share one in-process fixed window of 60
requests per 60 seconds using Astro's `clientAddress`. Rejected authentication
does not use the quota. A limited response is HTTP 429 with `Retry-After` in
seconds and `Cache-Control: no-store`. Missing addresses share the `unknown`
bucket. This is not a distributed limiter or a verified production per-IP
guarantee: Hostinger's proxy address forwarding still needs deployment proof.
MCP clients must send the configured header from initialization onward.
Send one RPC message per POST. JSON-RPC arrays are rejected with HTTP 400 so one
admitted request cannot execute an uncounted batch of tools.

Ambiguous Ask questions have a 30-second upstream deadline covering both the
request and response body. A request abort is passed to the upstream fetch.
The browser has a 35-second end-to-end deadline and aborts on component removal;
late responses cannot replace a retry. Deterministic questions stay offline.
Ask returns HTTP 504 / `ASK_TIMEOUT`, 408 / `ASK_CANCELLED`, or 503 /
`ASK_UNAVAILABLE` for these operational failures, without returning a fake tool
answer or exposing provider errors. Existing invalid-input failures remain 400.
Actual disconnect propagation through the production proxy is a release check,
not a guarantee derived from mocked unit tests.

- Every answer should identify the tool used.
- Finance, health, construction, electrical, privacy, and other high-trust tools
  must keep warning text visible in API and chatbot responses.
- If a question cannot be matched to an API-ready tool, return a clear "not
  available yet" message instead of guessing.
- Do not store raw private user questions in public reports.

## Current Starter Tools

The alpha starts with percentage, absolute value, AI token cost, amp hours to
watt hours, amps to watts, tip, BMI, mortgage, concrete, paint, download time,
watts to amps, word counter, JSON formatter, Base64, URL encode/decode,
password generator, subnet, and date difference.

## Key Rotation

The first Ollama key was pasted into chat during setup. Once the deployment is
working, create a fresh Ollama key, replace the local and Hostinger values, and
delete the old key in Ollama settings.
