# Legal and Monetization Readiness

This is an implementation checklist, not legal advice. Recheck network terms and applicable law when the advertising setup changes.

## Current Infolinks Pilot

- Publisher ID: `3447500`.
- Website ID: `0`.
- Product: InText only.
- Scope: eligible public HTML pages. Private admin, analytics, API, MCP endpoint, and error routes are excluded.
- Protected areas: navigation, footer, calculator and tool workspaces, Ask messages, and contact-form fields use Infolinks' supported `INFOLINKS_OFF` boundaries.
- Consent: the remote loader does not run until the visitor selects `Allow contextual ads`.
- Owner and QA suppression: use `Exclude this browser from ads` on `/privacy-policy/`.
- Emergency switch: set `PUBLIC_INFOLINKS_ENABLED=false` and rebuild.

The publisher dashboard must be checked after deployment. Keep only InText enabled, set the maximum to two links per page, and turn off InFold, InTag, InFrame, and other formats.

## Public Build Variables

```text
PUBLIC_INFOLINKS_ENABLED=true
PUBLIC_INFOLINKS_PID=3447500
PUBLIC_INFOLINKS_WSID=0
PUBLIC_ADSENSE_ENABLED=false
PUBLIC_ADSENSE_CMP_READY=false
PUBLIC_ADSENSE_CLIENT_ID=
PUBLIC_ADSENSE_CONTENT_SLOT_ID=
PUBLIC_KOFI_URL=
```

The build includes Google's verification-only account meta tag for `ca-pub-4461993577253590`.
It does not load ads. The AdSense site is still marked `Requires review`, so the client and slot
variables remain inactive until approval and consent requirements are complete.

The Infolinks identifiers are public integration values. Never put account passwords, payout details, tax information, or private API credentials in these variables.

## Google AdSense Checklist

AdSense is disabled. The code supports one future manual responsive slot on Date, Gas Mileage, Mileage, Hex, and Percentage Calculator pages only. It cannot activate until all of these are true:

- The account and site are approved.
- `PUBLIC_ADSENSE_ENABLED=true`.
- A valid `ca-pub-...` client ID and numeric slot ID are configured.
- `PUBLIC_ADSENSE_CMP_READY=true` only after the required Google-certified consent setup is working.

Do not enable Auto ads, anchors, vignettes, side rails, or ad intents during the pilot. When AdSense is active on an allowlisted calculator, Infolinks is suppressed on that page.

## Affiliate Checklist

- No affiliate campaign is active.
- Disclose any future commission relationship beside the affected link.
- Keep affiliate links out of calculator controls and results.
- Verify the destination, terms, and disclosure before publication.

## Reader Support

`/support/` is `noindex,follow`. It displays an external Ko-fi button only when `PUBLIC_KOFI_URL` is an exact verified HTTPS `ko-fi.com` URL supplied by Brendan. No payment script is embedded.

## Readiness And Proof

Run:

```bash
npm run monetization:readiness
```

The report is written to ignored files under `output/monetization/`. It checks the built route scope, consent loader, private-area boundaries, legal wording, support-page index policy, analytics persistence fallback, and live Infolinks loader reachability.

Before marking the pilot live, also verify:

- The Infolinks Publisher Center lists `accessfreetools.com` as approved or active.
- Only InText is enabled and the maximum is two links per page.
- No ad request occurs before consent or from an owner-suppressed browser.
- The live tool input and result areas contain no injected ad links.
- `/privacy-policy/`, `/terms/`, `/advertising-disclosure/`, and `/support/` render correctly.
- There is no `public/ads.txt` entry unless an approved network supplied the exact line.

## References

- Infolinks integration: https://sites0001.infolinks.com/support/integration/how-do-i-integrate-infolinks-into-my-website
- Infolinks area controls: https://sites0001.infolinks.com/support/products/how-do-i-restrict-intext-ads-from-certain-areas
- Infolinks privacy policy: https://sites0001.infolinks.com/privacy-policy
- Infolinks service agreement: https://sites0001.infolinks.com/service-agreement
- Google ad placement policy: https://support.google.com/adsense/answer/1346295
- Google EU user consent policy: https://support.google.com/adsense/answer/7670013
