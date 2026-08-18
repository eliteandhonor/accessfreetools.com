# Reference

## Current Proven Behavior

- Desktop and 390px layouts currently have no horizontal overflow.
- Current TTS accessibility checks pass before and during generation.
- Results do not autoplay.
- Reduced motion stops mascot and sound-wave animation.
- Chrome and Edge use WebGPU when available; compatibility fallback uses q8 WebAssembly.
- Physical Android, iOS, and Safari remain unproven and must not be inferred from viewport emulation.

## Integration Risks

- A long voice library, chapter list, and result list can create excessive page height or nested controls.
- Reordering must work without drag-only interaction.
- Multiple audio elements and object URLs can retain memory.
- File inputs and imported names can leak through labels, analytics, errors, or browser traces.
- ZIP creation can block the main thread or double memory use.

## Proof To Collect

- Desktop, tablet, and 390x844 Playwright checks.
- Axe, keyboard-only, screen-reader status semantics, reduced motion, and high-zoom checks.
- Installed Chrome and Edge full-flow evidence, with fallback engines truthfully classified.
- Request interception seeded with unique canary text and filenames; any match is a hard failure.
- Cleanup evidence after cancel, file replacement, result deletion, ZIP download, and route navigation.
