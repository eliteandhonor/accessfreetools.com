import { describe, expect, it } from 'vitest';

import { isIndexablePath, readExplicitIndexationPolicies } from './indexation-policy-source.mjs';

describe('indexation policy source reader', () => {
  it('reads explicit noindex routes from the TypeScript source of truth', () => {
    const policies = readExplicitIndexationPolicies();

    expect(policies.get('/sitemap/')).toMatchObject({ index: false, includeInXmlSitemap: false });
    expect(policies.get('/tools/text-to-speech-audiobook-generator/')).toMatchObject({
      index: false,
      includeInXmlSitemap: false,
    });
    expect(isIndexablePath('/tools/text-to-speech-audiobook-generator/')).toBe(false);
    expect(isIndexablePath('/tools/percentage-calculator/')).toBe(true);
  });
});
