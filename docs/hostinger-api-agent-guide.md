# Hostinger API Agent Guide

Last updated: 2026-05-13

This guide explains how Access Free Tools agents should use the Hostinger API and MCP tooling. The purpose is hosting visibility first: check websites, DNS, logs, and deployment state without making risky infrastructure changes.

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

This starts a Hostinger JavaScript deployment with Node 22, build script `build`,
output directory `dist`, and entry file `app.js`. The live check verifies that
Ask/API/MCP traffic reaches the Astro Node runtime instead of any retired PHP
route.

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

Hostinger publishes the `hostinger-api-mcp` npm package with scoped binaries such as `hostinger-hosting-mcp`. Prefer scoped binaries before the full all-products server. Use `scripts/hostinger-mcp-wrapper.mjs` so the token is loaded from `.local/hostinger-api.env` and passed as `API_TOKEN` without being printed.

Hostinger's MCP docs may require a newer Node runtime than this repo's app runtime. If MCP help or startup fails because of Node version, use the local API scripts instead and record the blocker. Do not upgrade the production app runtime just for MCP without a separate plan.

## Error Handling

- `401`: token missing, expired, revoked, or lacks permission.
- `429`: rate limited. Stop broad polling and retry later; repeated limits can temporarily block the IP.
- `422`: invalid request shape or unavailable resource.
- `500`: Hostinger-side problem. Save the `correlation_id` if present for support.

Agents should run `npm run automation:env-check` before reporting Hostinger as broken. If that report says Hostinger is healthy, do not ask the user to re-add the same key.
