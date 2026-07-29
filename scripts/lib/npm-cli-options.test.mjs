import { describe, expect, it } from 'vitest';

import { hasFlag, optionValue } from './npm-cli-options.mjs';

describe('npm CLI options', () => {
  it('reads inline and separate command-line values', () => {
    expect(optionValue('--zip', { argv: ['--zip=C:\\reports\\gsc.zip'], env: {} })).toBe(
      'C:\\reports\\gsc.zip',
    );
    expect(optionValue('--file', { argv: ['--file', 'C:\\reports\\bing.csv'], env: {} })).toBe(
      'C:\\reports\\bing.csv',
    );
  });

  it('reads values npm 11 exposes through npm_config variables', () => {
    expect(
      optionValue('--zip', {
        argv: [],
        env: { npm_config_zip: 'C:\\reports with spaces\\gsc.zip' },
      }),
    ).toBe('C:\\reports with spaces\\gsc.zip');
  });

  it('reads boolean flags from argv and npm_config variables', () => {
    expect(hasFlag('--no-overview', { argv: ['--no-overview'], env: {} })).toBe(true);
    expect(
      hasFlag('--no-overview', {
        argv: [],
        env: { npm_config_no_overview: 'true' },
      }),
    ).toBe(true);
    expect(
      hasFlag('--no-overview', {
        argv: [],
        env: { npm_config_overview: '' },
      }),
    ).toBe(true);
    expect(hasFlag('--no-overview', { argv: [], env: {} })).toBe(false);
  });
});
