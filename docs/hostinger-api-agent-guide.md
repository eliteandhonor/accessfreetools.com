# Hostinger API Agent Guide

Last updated: 2026-07-12

This guide explains how Access Free Tools agents should use the Hostinger API and MCP tooling. The purpose is hosting visibility first: check websites, DNS, logs, and deployment state without making risky infrastructure changes.

## Specialist Upgrade Lenses

Use `docs/recommended-agency-agents.md` before Hostinger or deployment work:

- Automation Governance Architect for deployment, DNS, hosting, VPS, Docker, and
  MCP automation decisions.
- API And MCP Tester for live Ask/API/MCP proof after deployment changes.
- Reality Checker before claiming production is fixed, healthy, or using the
  Node runtime.

## Sources

- Official docs: `https://developers.hostinger.com/`
- Hostinger API setup: `https://www.hostinger.com/support/10840865-what-is-hostinger-api/`
- Hostinger MCP setup: `https://www.hostinger.com/support/11079316-hostinger-api-mcp-server/`
- Hostinger MCP GitHub: `https://github.com/hostinger/api-mcp-server`
- Hostinger SDKs: `https://www.hostinger.com/support/11080244-introduction-to-hostinger-api-sdks/`
- Local OpenAPI downloads: ignored `Host API/api-1.yaml` and `Host API/api-1.json`

## Authentication

Hostinger uses bearer tokens. Keep the token local only:

```text
.local/hostinger-api.env
HOSTINGER_API_TOKEN=your-token-here
```

The `.local` folder is ignored by Git. Never put the token in `AGENTS.md`, docs, screenshots, reports, MCP config, or final messages. If the token was pasted into chat or another shared surface, rotate it in hPanel after confirming the integration works.

Requests use:

```text
Authorization: Bearer TOKEN
Accept: application/json
Content-Type: application/json for request bodies
```

The local OpenAPI file lists the base URL as `https://developers.hostinger.com`.

## Safe Commands

Use these read-only commands first:

```powershell
npm run hostinger:status
npm run hostinger:websites
npm run hostinger:dns-audit
npm run aft -- hostinger
```

Deployment command, only after explicit approval:

```powershell
npm run hostinger:deploy-node
npm run check:live-ask
```

This starts a Hostinger JavaScript deployment with Node 24, build script
`build`, output directory `dist`, and entry file `app.js`. Do not override this
to Node 22; Access Free Tools production deploys are Node 24-only. The live
check verifies that Ask/API/MCP traffic reaches the Astro Node runtime instead
of any retired PHP route.

Optional VPS Docker checks need local IDs:

```powershell
$env:HOSTINGER_VPS_ID="123"
npm run hostinger:deployments

$env:HOSTINGER_PROJECT_NAME="access-free-tools"
npm run hostinger:logs
```

Reports are written under `output/hostinger/`, which stays out of Git.

## Useful Read-only Endpoints

- `GET /api/hosting/v1/websites`: list hosted websites.
- `GET /api/hosting/v1/orders`: list hosting orders.
- `GET /api/domains/v1/portfolio`: list domains.
- `GET /api/dns/v1/zones/{domain}`: inspect DNS records.
- `GET /api/vps/v1/virtual-machines/{virtualMachineId}/docker`: inspect Docker projects on a VPS.
- `GET /api/vps/v1/virtual-machines/{virtualMachineId}/docker/{projectName}/logs`: inspect Docker logs.

## Approval-only Actions

Do not run these from automation unless the user explicitly approves the exact action:

- Billing/payment changes or subscription auto-renewal changes.
- Domain purchases, WHOIS changes, privacy changes, lock/nameserver changes.
- DNS update/delete/reset/restore operations.
- VPS delete, recreate, stop, recovery mode, password, firewall, snapshot restore, backup restore, or hostname changes.
- Docker project create/update/delete/start/stop/restart actions.

## MCP Guidance

Hostinger publishes the `hostinger-api-mcp` npm package with scoped binaries. Prefer `hostinger-hosting-mcp` for Access Free Tools because it exposes the 45 hosting tools needed for website, deployment, build, and log visibility. Do not register the 212-tool `hostinger-api-mcp` all-products server by default; it also exposes unrelated billing, DNS, domains, ecommerce, VPS, and other write-capable tools.

The user-global Codex setup installed and verified on 2026-07-12 is:

```powershell
npm install -g hostinger-api-mcp@1.5.1
codex mcp add hostinger-hosting -- hostinger-hosting-mcp
hostinger-hosting-mcp --login
```

The Codex entry uses Hostinger OAuth and stores no API token in `~/.codex/config.toml`. On Windows, Hostinger stores the OAuth credentials under `%APPDATA%\hostinger-mcp\credentials.json`. Never print or commit that file. Restart Codex after adding or updating the MCP server so the new tools are loaded into the session.

For local CLI diagnostics that intentionally use the existing project token, use `scripts/hostinger-mcp-wrapper.mjs`. It loads `.local/hostinger-api.env` and passes the current `HOSTINGER_API_TOKEN` environment variable without printing it. `API_TOKEN` is now a deprecated compatibility alias and should not be added to new setup instructions.

Hostinger's support article still says Node 20+, while the current official GitHub README says Node 24+ and the npm package manifest accepts Node 20+. Access Free Tools stays on Node 24, which satisfies every published requirement.

The 2026-07-12 verification listed 45 tools and completed a read-only `hosting_listWebsitesV1` call for `accessfreetools.com` with HTTP 200. Keep normal MCP use read-only unless the user explicitly approves the exact deployment or infrastructure write. DNS, billing, domain, subscription, ecommerce, VPS, and destructive hosting actions remain outside the default MCP scope.

Hostinger's MCP docs may require a newer Node runtime than this repo's app runtime. If MCP help or startup fails because of Node version, use the local API scripts instead and record the blocker. Do not upgrade the production app runtime just for MCP without a separate plan.

## Error Handling

- `401`: token missing, expired, revoked, or lacks permission.
- `429`: rate limited. Stop broad polling and retry later; repeated limits can temporarily block the IP.
- `422`: invalid request shape or unavailable resource.
- `500`: Hostinger-side problem. Save the `correlation_id` if present for support.

Agents should run `npm run automation:env-check` before reporting Hostinger as broken. If that report says Hostinger is healthy, do not ask the user to re-add the same key.
