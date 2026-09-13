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

const disabledHtml = publicHtml.replace(/<section.*?<\/section>/, '').replace(/<script>.*?<\/script>/, '');
const sellerLine = 'google.com, pub-4461993577253590, DIRECT, f08c47fec0942fa0\n';
function assessmentInput() {
  const ordinary = inspectRenderedMonetizationPage(disabledHtml);
  const protectedSurface = inspectRenderedMonetizationPage(
    disabledHtml.replace('<!--INFOLINKS_ON-->', '<!--INFOLINKS_ON--><!--INFOLINKS_OFF--><!--INFOLINKS_ON-->'),
  );
  return {
    adsTxt: sellerLine,
    builtAdsTxt: sellerLine,
    analyticsSource: "return resolve(homeDir, '.local/accessfreetools-analytics');",
    legalSources: {
      disclosure: 'Infolinks advertising is not active; double underline',
      privacy: 'Network Advertising Initiative AdSense ads are not active',
    },
    pages: {
      admin: inspectRenderedMonetizationPage('<main>Private</main>'),
      ask: protectedSurface, blog: ordinary, contact: protectedSurface,
      home: ordinary, support: ordinary, tool: protectedSurface,
    },
  };
}

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
    const input = assessmentInput();
    const assessment = assessMonetizationReadiness(input);
    expect(assessment.status).toBe('awaiting_content_review');
    expect(assessment.technicalStatus).toBe('passed');
    expect(assessment.issues).toEqual([]);
    input.pages.tool = input.pages.blog;
    expect(assessMonetizationReadiness(input).issues).toContain('tool is missing a private interaction boundary.');
  });

  it.each(['', sellerLine.replace('4461993577253590', '1234567890123456'), `${sellerLine}infolinks.com, 3447500, DIRECT\n`])('rejects missing or unverified ads.txt entries: %s', (text) => {
    const input = assessmentInput();
    input.builtAdsTxt = text;
    expect(assessMonetizationReadiness(input).technicalStatus).toBe('failed');
  });

  it('rejects stale builds that still offer or load ads', () => {
    const input = assessmentInput();
    input.pages.home = inspectRenderedMonetizationPage(publicHtml);
    expect(assessMonetizationReadiness(input).issues.some(issue => issue.includes('approval is missing'))).toBe(true);
    input.pages.home = inspectRenderedMonetizationPage(`${disabledHtml}<script src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4461993577253590"></script>`);
    expect(assessMonetizationReadiness(input).issues).toContain('home contains an AdSense ad script before approval.');
  });
});
