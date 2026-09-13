# September 13 Dependency Security Update

Keep Node24 and Astro7. The previous main lockfile reports11 fresh findings,
including1critical. This is dependency evidence, not proof of compromise.

Exact patches: Astro7.2.8, Nodemailer9.1.1, Vitest4.1.11, Hono4.13.5,
js-yaml4.3.2, Sharp0.35.4, SVGO4.1.0 and adm-zip0.6.1 under unchanged
ONNX Runtime1.27.0. Model revisions and browser inference are unchanged.
No broad audit fix, waiver or unrelated direct dependency upgrade.

Sources: [Astro advisory](https://github.com/advisories/GHSA-26w7-cxv4-gfx2),
[Sharp advisory](https://github.com/advisories/GHSA-rgj7-g3m4-5g8c),
[adm-zip release](https://github.com/cthackers/adm-zip/releases/tag/v0.6.1).
The last release is newer than the older advisory's no-fix statement.

Local Node24.20.0 proof: lifecycle-enabled `npm ci`, full `npm run check`
(577 tests,68files), mobile SEO and zero audit findings. Thirteen focused
tests cover locked pins, real directory-link extraction rejection, normal ZIP
extraction, patched libheif and an owned AVIF round-trip. Five existing PNG/CSS
soft warnings remain. Ignored receipts/logs/hashes: `output/security-sep13/`.
Local checks do not establish deployment.

npm11.2.0 crashed resolving optional peers during the lock update. Isolated
`npx --yes --package=npm@11.19.1 npm install --package-lock-only --ignore-scripts`
succeeded without changing global npm or bypassing peers. Normal npm11.2.0
`npm ci` then passed with lifecycle scripts enabled.
