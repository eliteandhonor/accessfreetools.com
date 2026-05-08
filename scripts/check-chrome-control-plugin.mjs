import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';

const OUTPUT_JSON = resolve('output', 'automation', 'chrome-control-check.json');
const OUTPUT_MD = resolve('output', 'automation', 'chrome-control-check.md');
const CODEX_EXTENSION_NAME = 'Codex';
const CODEX_EXTENSION_DESCRIPTION = 'Control Chrome with Codex.';
const NATIVE_HOST = 'com.openai.codexextension';

function readJson(path) {
  try {
    return JSON.parse(readFileSync(path, 'utf8'));
  } catch {
    return null;
  }
}

function listProfileDirs(root) {
  if (!root || !existsSync(root)) return [];
  return readdirSync(root, { withFileTypes: true })
    .filter((entry) => entry.isDirectory())
    .map((entry) => join(root, entry.name))
    .filter((profilePath) => existsSync(join(profilePath, 'Extensions')));
}

function findExtensionInstalls(root, browser) {
  return listProfileDirs(root).flatMap((profilePath) => {
    const extensionRoot = join(profilePath, 'Extensions');
    return readdirSync(extensionRoot, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .flatMap((extensionDir) => {
        const versionRoot = join(extensionRoot, extensionDir.name);
        return readdirSync(versionRoot, { withFileTypes: true })
          .filter((entry) => entry.isDirectory())
          .map((versionDir) => {
            const manifestPath = join(versionRoot, versionDir.name, 'manifest.json');
            const manifest = readJson(manifestPath);
            if (!manifest) return null;
            const isCodex =
              manifest.name === CODEX_EXTENSION_NAME ||
              manifest.description === CODEX_EXTENSION_DESCRIPTION;
            if (!isCodex) return null;
            return {
              browser,
              profile: profilePath.split(/[\\/]/).at(-1),
              id: extensionDir.name,
              version: manifest.version,
              description: manifest.description,
              manifestPath,
            };
          })
          .filter(Boolean);
      });
  });
}

function queryRegistry(path) {
  if (process.platform !== 'win32') {
    return { exists: false, path: null, note: 'Registry check is Windows-only.' };
  }

  try {
    const output = execFileSync('reg', ['query', path, '/ve'], {
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    const match = output.match(/REG_\w+\s+(.+)$/m);
    return {
      exists: true,
      path: match?.[1]?.trim() ?? null,
      note: null,
    };
  } catch {
    return { exists: false, path: null, note: null };
  }
}

function makeMarkdown(report) {
  const recommendations = report.recommendations.map((item) => `- ${item}`).join('\n');
  const installs = report.installs.length
    ? report.installs
        .map(
          (item) =>
            `- ${item.browser} profile \`${item.profile}\`: ${item.id} v${item.version} (${item.description})`,
        )
        .join('\n')
    : '- No Codex browser extension install found in scanned Chrome or Edge profiles.';

  return `# Codex Chrome Control Check

Checked: ${report.checkedAt}

## Result

- Chrome extension installed: ${report.summary.chromeExtensionInstalled ? 'yes' : 'no'}
- Edge extension installed: ${report.summary.edgeExtensionInstalled ? 'yes' : 'no'}
- Chrome native host registered: ${report.summary.chromeNativeHostRegistered ? 'yes' : 'no'}
- Edge native host registered: ${report.summary.edgeNativeHostRegistered ? 'yes' : 'no'}
- Recommended status: ${report.summary.status}

## Extension Installs

${installs}

## Native Hosts

- Chrome: ${report.nativeHosts.chrome.exists ? report.nativeHosts.chrome.path : 'not found'}
- Edge: ${report.nativeHosts.edge.exists ? report.nativeHosts.edge.path : 'not found'}

## Recommendations

${recommendations}
`;
}

function main() {
  const localAppData = process.env.LOCALAPPDATA ?? '';
  const chromeRoot = join(localAppData, 'Google', 'Chrome', 'User Data');
  const edgeRoot = join(localAppData, 'Microsoft', 'Edge', 'User Data');
  const installs = [
    ...findExtensionInstalls(chromeRoot, 'Chrome'),
    ...findExtensionInstalls(edgeRoot, 'Edge'),
  ];

  const nativeHosts = {
    chrome: queryRegistry(`HKCU\\Software\\Google\\Chrome\\NativeMessagingHosts\\${NATIVE_HOST}`),
    edge: queryRegistry(`HKCU\\Software\\Microsoft\\Edge\\NativeMessagingHosts\\${NATIVE_HOST}`),
  };

  const summary = {
    chromeExtensionInstalled: installs.some((item) => item.browser === 'Chrome'),
    edgeExtensionInstalled: installs.some((item) => item.browser === 'Edge'),
    chromeNativeHostRegistered: nativeHosts.chrome.exists,
    edgeNativeHostRegistered: nativeHosts.edge.exists,
    status: 'needs setup',
  };

  if (summary.chromeExtensionInstalled && summary.chromeNativeHostRegistered) {
    summary.status = 'ready for the @chrome skill and extension browser runtime';
  } else if (summary.edgeExtensionInstalled && !summary.chromeExtensionInstalled) {
    summary.status = 'Edge extension found, but official Chrome control is not fully installed in Chrome';
  }

  const recommendations = [];
  if (!summary.chromeExtensionInstalled) {
    recommendations.push(
      'Install the official Codex browser-control extension in Google Chrome, not only Edge, then restart Codex if the Chrome tool is still missing.',
    );
  }
  if (!summary.chromeNativeHostRegistered) {
    recommendations.push(
      'Repair or reinstall the Codex extension host so Chrome can talk to the local Codex app.',
    );
  }
  if (summary.edgeExtensionInstalled && !summary.edgeNativeHostRegistered) {
    recommendations.push(
      'Edge has the Codex extension installed, but no Edge native host entry was found. Treat Edge control as unproven until the @chrome skill can list live tabs.',
    );
  }
  recommendations.push(
    'Use the @chrome skill for logged-in browser work. Its callable path runs through the generic browser runtime, so a separate chrome.* tool namespace is not required.',
  );

  const report = {
    checkedAt: new Date().toISOString(),
    docs: 'https://developers.openai.com/codex/app/chrome-extension',
    summary,
    installs,
    nativeHosts,
    recommendations,
  };

  mkdirSync(dirname(OUTPUT_JSON), { recursive: true });
  writeFileSync(OUTPUT_JSON, `${JSON.stringify(report, null, 2)}\n`);
  writeFileSync(OUTPUT_MD, makeMarkdown(report));

  console.log(makeMarkdown(report));

  if (!summary.chromeExtensionInstalled || !summary.chromeNativeHostRegistered) {
    process.exitCode = 2;
  }
}

main();
