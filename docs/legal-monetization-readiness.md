# Legal and Monetization Readiness

This is an implementation checklist, not legal advice. Recheck network terms and applicable law when the advertising setup changes.

## Inactive Infolinks Configuration

September 13 correction: the owner confirms Infolinks publisher approval was not
granted. Both advertising account gates in `src/lib/monetization.ts` are false.
Even old enabled environment flags or saved visitor consent cannot activate them.
Keep the integration dormant; do not treat supplied publisher IDs as approval.

- Publisher ID: `3447500`.
- Website ID: `0`.
- Product: InText only.
- Scope: eligible public HTML pages. Private admin, analytics, API, MCP endpoint, and error routes are excluded.
- Protected areas: navigation, footer, calculator and tool workspaces, Ask messages, and contact-form fields use Infolinks' supported `INFOLINKS_OFF` boundaries.
- Consent: the dormant loader retains its consent checks for any separately approved future activation.
- Owner and QA suppression: previously saved opt-outs remain stored; no advertising loads for any visitor now.
- Emergency switch: set `PUBLIC_INFOLINKS_ENABLED=false` and rebuild.

Before any future activation, verify publisher approval, keep only InText enabled,
set the maximum to two links per page, and turn off all other formats.

## Public Build Variables

```text
PUBLIC_INFOLINKS_ENABLED=false
PUBLIC_INFOLINKS_PID=3447500
PUBLIC_INFOLINKS_WSID=0
PUBLIC_ADSENSE_ENABLED=false
PUBLIC_ADSENSE_CMP_READY=false
PUBLIC_ADSENSE_CLIENT_ID=
PUBLIC_ADSENSE_CONTENT_SLOT_ID=
PUBLIC_KOFI_URL=
```

The build includes Google's verification-only account meta tag for `ca-pub-4461993577253590`.
It does not load ads. The live AdSense dashboard checked September 13 shows
`Needs attention / Low value content`, last updated September 12 at 6:31 PM AEST.
Client and slot variables remain inactive until approval and consent requirements
are complete. Do not confirm content issues fixed or request review from an
ads.txt repair alone.

## Verified Ads.txt Entry

The account's `Verify site ownership > Ads.txt snippet` supplied this exact line:

```text
google.com, pub-4461993577253590, DIRECT, f08c47fec0942fa0
```

`public/ads.txt` publishes it at `/ads.txt` through the normal Astro static build.
This account-supplied verification line may be installed before site approval.
Do not add guessed Infolinks/reseller entries. Check HTTP 200, plain-text content,
the exact publisher line, and crawler access after deployment. Dashboard status
can lag crawling; file publication does not resolve the content-quality finding.

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
- `public/ads.txt` contains only exact lines supplied by the corresponding network dashboard.

The readiness command now checks the disabled account state, exact source/built
ads.txt, verification meta tag and retained private boundaries. Technical PASS
still reports `awaiting_content_review`, never publisher approval.

## References

- Google ads.txt setup: https://support.google.com/adsense/answer/7532444
- Google crawler access: https://support.google.com/adsense/answer/7679060
- Google site readiness/content requirements: https://support.google.com/adsense/answer/12176698

- Infolinks integration: https://sites0001.infolinks.com/support/integration/how-do-i-integrate-infolinks-into-my-website
- Infolinks area controls: https://sites0001.infolinks.com/support/products/how-do-i-restrict-intext-ads-from-certain-areas
- Infolinks privacy policy: https://sites0001.infolinks.com/privacy-policy
- Infolinks service agreement: https://sites0001.infolinks.com/service-agreement
- Google ad placement policy: https://support.google.com/adsense/answer/1346295
- Google EU user consent policy: https://support.google.com/adsense/answer/7670013
