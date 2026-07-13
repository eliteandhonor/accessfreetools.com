import { execFileSync } from 'node:child_process';
import { existsSync, mkdirSync, readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const OUTPUT_JSON = resolve('output', 'automation', 'chrome-control-check.json');
const OUTPUT_MD = resolve('output', 'automation', 'chrome-control-check.md');
const CHATGPT_EXTENSION_ID = 'hehggadaopoacecdllhhajmbjkdcmajg';
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

function extensionRegistration(profilePath, extensionId) {
  for (const preferencesFile of ['Secure Preferences', 'Preferences']) {
    const settings = readJson(join(profilePath, preferencesFile))?.extensions?.settings;
    const registration = settings?.[extensionId];
    if (!registration) continue;

    const disableReasons = Array.isArray(registration.disable_reasons)
      ? registration.disable_reasons.filter(Boolean)
      : registration.disable_reasons
        ? [registration.disable_reasons]
        : [];

    return {
      enabled: registration.state !== 0 && disableReasons.length === 0,
      registered: true,
    };
  }

  return { enabled: false, registered: false };
}

export function isChatGptChromeExtension(extensionId, manifest) {
  if (!manifest || typeof manifest !== 'object') return false;
  if (extensionId === CHATGPT_EXTENSION_ID) return true;

  return manifest.name === 'ChatGPT' && manifest.description === 'Control Chrome with ChatGPT.';
}

export function findExtensionInstalls(root, browser) {
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
            if (!isChatGptChromeExtension(extensionDir.name, manifest)) return null;
            const registration = extensionRegistration(profilePath, extensionDir.name);
            return {
              browser,
              profile: profilePath.split(/[\\/]/).at(-1),
              id: extensionDir.name,
              version: manifest.version,
              enabled: registration.enabled,
              registered: registration.registered,
              name: manifest.name,
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
            `- ${item.browser} profile \`${item.profile}\`: ${item.name} ${item.id} v${item.version} (${item.enabled ? 'enabled' : 'not enabled'})`,
        )
        .join('\n')
    : '- No ChatGPT Chrome Extension install found in scanned Chrome or Edge profiles.';

  return `# ChatGPT Chrome Extension Check

Checked: ${report.checkedAt}

## Result

- Chrome extension installed: ${report.summary.chromeExtensionInstalled ? 'yes' : 'no'}
- Chrome extension enabled: ${report.summary.chromeExtensionEnabled ? 'yes' : 'no'}
- Edge extension installed: ${report.summary.edgeExtensionInstalled ? 'yes' : 'no'}
- Edge extension enabled: ${report.summary.edgeExtensionEnabled ? 'yes' : 'no'}
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

export function summarizeChromeControl(installs, nativeHosts) {
  const summary = {
    chromeExtensionInstalled: installs.some((item) => item.browser === 'Chrome'),
    chromeExtensionEnabled: installs.some((item) => item.browser === 'Chrome' && item.enabled),
    edgeExtensionInstalled: installs.some((item) => item.browser === 'Edge'),
    edgeExtensionEnabled: installs.some((item) => item.browser === 'Edge' && item.enabled),
    chromeNativeHostRegistered: nativeHosts.chrome.exists,
    edgeNativeHostRegistered: nativeHosts.edge.exists,
    status: 'needs setup',
  };

  if (summary.chromeExtensionEnabled && summary.chromeNativeHostRegistered) {
    summary.status = 'ready for the @chrome skill and extension browser runtime';
  } else if (summary.edgeExtensionEnabled && !summary.chromeExtensionEnabled) {
    summary.status = 'Edge extension found, but official Chrome control is not fully enabled in Chrome';
  }

  return summary;
}

export function main() {
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

  const summary = summarizeChromeControl(installs, nativeHosts);

  const recommendations = [];
  if (!summary.chromeExtensionInstalled) {
    recommendations.push(
      'Install the ChatGPT Chrome Extension in Google Chrome, then restart Codex if the Chrome tool is still missing.',
    );
  } else if (!summary.chromeExtensionEnabled) {
    recommendations.push('Enable the ChatGPT Chrome Extension in the selected Google Chrome profile.');
  }
  if (!summary.chromeNativeHostRegistered) {
    recommendations.push(
      'Reinstall the Chrome plugin from the ChatGPT plugin UI so Chrome can reconnect to the local Codex app.',
    );
  }
  if (summary.edgeExtensionInstalled && !summary.edgeNativeHostRegistered) {
    recommendations.push(
      'Edge has the ChatGPT extension installed, but no Edge native host entry was found. Treat Edge control as unproven until the @chrome skill can list live tabs.',
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

  if (!summary.chromeExtensionEnabled || !summary.chromeNativeHostRegistered) {
    process.exitCode = 2;
  }
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main();
