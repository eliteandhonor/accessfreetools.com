import { afterEach, describe, expect, it } from 'vitest';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import {
  findExtensionInstalls,
  isChatGptChromeExtension,
  summarizeChromeControl,
} from './check-chrome-control-plugin.mjs';

const temporaryDirectories = [];

afterEach(() => {
  for (const directory of temporaryDirectories.splice(0)) {
    rmSync(directory, { force: true, recursive: true });
  }
});

describe('Chrome control diagnostics', () => {
  it('recognizes the current ChatGPT Chrome Extension manifest and ID', () => {
    expect(
      isChatGptChromeExtension('hehggadaopoacecdllhhajmbjkdcmajg', {
        description: 'Control Chrome with ChatGPT.',
        name: 'ChatGPT',
      }),
    ).toBe(true);
    expect(isChatGptChromeExtension('unrelated', { description: 'Other', name: 'Other' })).toBe(false);
  });

  it('reports a registered current extension as installed and enabled', () => {
    const root = mkdtempSync(join(tmpdir(), 'aft-chrome-check-'));
    temporaryDirectories.push(root);
    const profile = join(root, 'Default');
    const extensionId = 'hehggadaopoacecdllhhajmbjkdcmajg';
    const versionDirectory = join(profile, 'Extensions', extensionId, '1.2.3_0');
    mkdirSync(versionDirectory, { recursive: true });
    writeFileSync(
      join(versionDirectory, 'manifest.json'),
      JSON.stringify({ description: 'Control Chrome with ChatGPT.', name: 'ChatGPT', version: '1.2.3' }),
    );
    writeFileSync(
      join(profile, 'Secure Preferences'),
      JSON.stringify({ extensions: { settings: { [extensionId]: { disable_reasons: [] } } } }),
    );

    const installs = findExtensionInstalls(root, 'Chrome');
    const summary = summarizeChromeControl(installs, {
      chrome: { exists: true },
      edge: { exists: false },
    });

    expect(installs).toHaveLength(1);
    expect(installs[0]).toMatchObject({ enabled: true, name: 'ChatGPT', registered: true });
    expect(summary).toMatchObject({
      chromeExtensionEnabled: true,
      chromeExtensionInstalled: true,
      status: 'ready for the @chrome skill and extension browser runtime',
    });
  });

  it('does not call a disabled install ready', () => {
    const summary = summarizeChromeControl(
      [{ browser: 'Chrome', enabled: false }],
      { chrome: { exists: true }, edge: { exists: false } },
    );

    expect(summary.chromeExtensionInstalled).toBe(true);
    expect(summary.chromeExtensionEnabled).toBe(false);
    expect(summary.status).toBe('needs setup');
  });
});
