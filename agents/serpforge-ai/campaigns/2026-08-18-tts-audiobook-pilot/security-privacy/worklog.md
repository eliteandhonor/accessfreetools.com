# Security And Privacy Worklog

- 2026-08-18: Python security and behavior suite passed 29 tests.
- 2026-08-18: `pip-audit` found no known dependency vulnerabilities in the locked environment.
- 2026-08-18: Added non-root app image, dropped capabilities, read-only filesystems, bounded CPU/memory/PIDs, private Redis socket, and no-network worker/cleanup containers.
- 2026-08-18: Removed the vulnerable development-only lxml 5.4.0 path by pinning lxml 6.1.0 and refreshing the audit/SBOM toolchain; the production lock remains separate.
- 2026-08-18: Owner rejected the server design. The earlier Python, container, storage, queue, and retention controls are superseded and are no longer part of the product.
- 2026-08-18: The active boundary keeps text and generated WAV data in the visitor's browser, masks the full workbench from Clarity, limits EPUB parsing locally, and fetches only pinned model assets after explicit action.
- 2026-08-18: Browser network inspection during real generation showed only GET requests for pinned model assets, local ONNX Runtime WASM assets, and the local blob audio URL. The synthetic input text did not appear in any request. The full npm audit reported zero vulnerabilities.
