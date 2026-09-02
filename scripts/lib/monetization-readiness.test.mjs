import { describe, expect, it } from 'vitest';

import { assessMonetizationReadiness, inspectRenderedMonetizationPage } from './monetization-readiness.mjs';

const publicHtml = `
  <meta name="google-adsense-account" content="ca-pub-4461993577253590">
  <meta name="robots" content="noindex,follow">
  <!--INFOLINKS_OFF--><!--INFOLINKS_ON-->
  <button data-ad-privacy-open>Ad choices</button>
  <section data-advertising-choice></section>
  <a href="/advertising-disclosure/">Disclosure</a>
  <script>const config={"adMode":"infolinks"};document.createElement('script').src='https://resources.infolinks.com/js/infolinks_main.js';</script>
`;

describe('monetization readiness parser', () => {
  it('distinguishes a dynamic consent loader from an unconditional script tag', () => {
    const dynamic = inspectRenderedMonetizationPage(publicHtml);
    const direct = inspectRenderedMonetizationPage(
      `${publicHtml}<script src="https://resources.infolinks.com/js/infolinks_main.js"></script>`,
    );

    expect(dynamic.hasDynamicInfolinksLoader).toBe(true);
    expect(dynamic.directInfolinksScriptCount).toBe(0);
    expect(direct.directInfolinksScriptCount).toBe(1);
  });

  it('requires extra boundaries around private public-page interactions', () => {
    const ordinary = inspectRenderedMonetizationPage(publicHtml);
    const protectedSurface = inspectRenderedMonetizationPage(
      publicHtml.replace('<!--INFOLINKS_ON-->', '<!--INFOLINKS_ON--><!--INFOLINKS_OFF--><!--INFOLINKS_ON-->'),
    );
    const assessment = assessMonetizationReadiness({
      adsTxtExists: false,
      analyticsSource: "return resolve(homeDir, '.local/accessfreetools-analytics');",
      legalSources: {
        disclosure: 'Infolinks double underline',
        privacy: 'Network Advertising Initiative AdSense ads are not active',
      },
      pages: {
        admin: inspectRenderedMonetizationPage('<main>Private</main>'),
        ask: protectedSurface,
        blog: ordinary,
        contact: protectedSurface,
        home: ordinary,
        support: ordinary,
        tool: protectedSurface,
      },
    });

    expect(assessment.status).toBe('ready_with_manual_dashboard_checks');
    expect(assessment.issues).toEqual([]);
  });
});
