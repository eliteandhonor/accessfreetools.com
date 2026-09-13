import { describe, expect, it } from 'vitest';

import { isIndexablePath, readExplicitIndexationPolicies } from './indexation-policy-source.mjs';

describe('indexation policy source reader', () => {
  it('reads explicit noindex routes from the TypeScript source of truth', () => {
    const policies = readExplicitIndexationPolicies();

    expect(policies.get('/sitemap/')).toMatchObject({ index: false, includeInXmlSitemap: false });
    expect(policies.has('/tools/text-to-speech-audiobook-generator/')).toBe(false);
    expect(isIndexablePath('/tools/text-to-speech-audiobook-generator/')).toBe(true);
    expect(isIndexablePath('/blog/how-to-use-text-to-speech-audiobook-generator/')).toBe(true);
    expect(policies.has('/tools/audio-video-transcriber/')).toBe(false);
    expect(isIndexablePath('/tools/audio-video-transcriber/')).toBe(true);
    expect(isIndexablePath('/blog/how-to-use-audio-video-transcriber/')).toBe(true);
    expect(isIndexablePath('/tools/percentage-calculator/')).toBe(true);
  });
});
