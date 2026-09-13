# Browser Runtime And Resource Safety

Goal: Keep existing browser tools bounded, cancellable and recoverable.

Scope: JSON-to-CSV allocation, TTS imports/worker promises, OCR lifecycle; no server inference.

Read ../../AGENTS.md, ../../campaign.json and reference.md before working. Coordinate through the existing owning subsystem; this document is not a second scheduler. Start with one ready task. Reproduce the finding against fresh source before editing; never silently broaden scope. Preserve unrelated work and use apply_patch. Record commands, exact source SHA, evidence dates, pass/failure and remaining gates in worklog.md.

You may move assigned tasks to evidence_ready only. Never approve your own work; request Release Judge review. Do not publish, deploy, spend, request indexing or change global settings from this assignment alone.
