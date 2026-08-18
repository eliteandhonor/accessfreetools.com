# Infrastructure Worklog

- 2026-08-18: Created isolated Compose design. Redis and worker have no public TCP ports; worker and cleanup use `network_mode: none`; Caddy exposes only bounded API and health paths.
- 2026-08-18: Hostinger VPS MCP installed and OAuth authenticated. No purchase, DNS, firewall, or deployment write performed.
- 2026-08-18: Local container validation blocked because Docker Desktop service is disabled and current task lacks permission to enable it.
- 2026-08-18: Compose syntax and policy validation passed without starting containers. Runtime mounts, permissions, health checks, and image scanning remain unproven until Docker starts.
- 2026-08-18: `tts:preflight` detects both authenticated Hostinger MCP connections from Codex configuration and reports Docker engine availability as the only local setup blocker.
- 2026-08-18: Owner rejected all purchase and separate-service options. The earlier VPS, Docker, DNS, and container design is superseded and is not an active blocker or recommendation.
- 2026-08-18: Replaced the infrastructure lane with the existing Hostinger Astro 7/Node 24 route, visitor-side browser inference, pinned model-host downloads, route isolation, and normal site rollback evidence.
- 2026-08-18: Fresh build and asset checks proved that the existing Node 24 application serves the route, unrelated pages request no TTS model assets, and the model is fetched only after the visitor chooses to load it. No hosting product, DNS record, or paid service was added.
