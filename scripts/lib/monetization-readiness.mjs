const INFOLINKS_URL = 'https://resources.infolinks.com/js/infolinks_main.js';
const ADSENSE_VERIFICATION_ACCOUNT = 'ca-pub-4461993577253590';

function count(value, pattern) {
  return [...value.matchAll(pattern)].length;
}

export function inspectRenderedMonetizationPage(html) {
  const directInfolinksScripts = html.match(
    /<script\b[^>]*\bsrc=["']https:\/\/resources\.infolinks\.com\/js\/infolinks_main\.js["'][^>]*>/gi,
  ) ?? [];

  return {
    adsenseVerificationAccount: html.match(
      /<meta\b[^>]*name=["']google-adsense-account["'][^>]*content=["'](ca-pub-\d{16})["']/i,
    )?.[1] ?? '',
    adMode: html.match(/"adMode":"(adsense|infolinks|none)"/)?.[1] ?? 'missing',
    hasAdChoice: html.includes('data-advertising-choice'),
    hasAdChoicesFooterControl: html.includes('data-ad-privacy-open'),
    hasAdDisclosure: html.includes('/advertising-disclosure/'),
    hasDynamicInfolinksLoader: html.includes(INFOLINKS_URL) && html.includes("document.createElement('script')"),
    hasNoIndex: /<meta\b[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex/i.test(html),
    infolinksOffMarkers: count(html, /<!--INFOLINKS_OFF-->/g),
    infolinksOnMarkers: count(html, /<!--INFOLINKS_ON-->/g),
    directInfolinksScriptCount: directInfolinksScripts.length,
  };
}

export function assessMonetizationReadiness({ pages, legalSources, analyticsSource, adsTxtExists }) {
  const issues = [];
  const warnings = [];
  const publicNames = ['home', 'blog', 'tool', 'ask', 'contact', 'support'];

  for (const name of publicNames) {
    const page = pages[name];
    if (!page?.hasAdChoice || !page.hasDynamicInfolinksLoader || page.adMode !== 'infolinks') {
      issues.push(`${name} does not contain the consent-gated Infolinks integration.`);
    }
    if (page?.directInfolinksScriptCount !== 0) {
      issues.push(`${name} contains an unconditional Infolinks script tag.`);
    }
    if ((page?.infolinksOffMarkers ?? 0) < 1 || (page?.infolinksOnMarkers ?? 0) < 1) {
      issues.push(`${name} is missing Infolinks page-boundary markers.`);
    }
  }

  for (const name of ['tool', 'ask', 'contact']) {
    const page = pages[name];
    if ((page?.infolinksOffMarkers ?? 0) < 2 || (page?.infolinksOnMarkers ?? 0) < 2) {
      issues.push(`${name} is missing a private interaction boundary.`);
    }
  }

  if (pages.admin?.hasAdChoice || pages.admin?.hasDynamicInfolinksLoader) {
    issues.push('admin contains public advertising code.');
  }

  if (!pages.support?.hasNoIndex) issues.push('support must remain noindex.');
  if (pages.home?.adsenseVerificationAccount !== ADSENSE_VERIFICATION_ACCOUNT) {
    issues.push('home is missing the exact AdSense account verification meta tag.');
  }

  const legalText = Object.values(legalSources).join('\n');
  for (const expected of ['Infolinks', 'double underline', 'Network Advertising Initiative', 'AdSense ads are not active']) {
    if (!legalText.includes(expected)) issues.push(`legal copy is missing: ${expected}.`);
  }

  if (!analyticsSource.includes("'.local/accessfreetools-analytics'")) {
    issues.push('analytics does not include its durable home-directory fallback.');
  }

  if (adsTxtExists) warnings.push('public/ads.txt exists and requires exact dashboard-line verification.');
  warnings.push('Verify InText-only mode and a two-link maximum in the Infolinks Publisher Center.');
  warnings.push('AdSense remains disabled until its account, identifiers, slot, and certified CMP are ready.');
  warnings.push('Ko-fi remains hidden until PUBLIC_KOFI_URL contains Brendan\'s verified profile URL.');

  return {
    issues,
    status: issues.length === 0 ? 'ready_with_manual_dashboard_checks' : 'blocked',
    warnings,
  };
}
