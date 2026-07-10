import { delimiter, resolve, win32 } from 'node:path';

export const DEFAULT_APPROVED_REPO_CWDS = [
  'C:/Users/chamb/OneDrive/Desktop/accessfreetools.com',
];

function isWindowsAbsolutePath(path) {
  return /^[a-z]:[\\/]/i.test(path);
}

function resolveConfiguredPath(path) {
  return isWindowsAbsolutePath(path) ? win32.resolve(path) : resolve(path);
}

function pathKey(path) {
  return resolveConfiguredPath(path).replaceAll('\\', '/').toLowerCase();
}

function splitPathList(value = '') {
  return String(value)
    .split(/[;\n]/)
    .flatMap((item) => {
      const trimmed = item.trim();
      return delimiter === ':' && isWindowsAbsolutePath(trimmed) ? [trimmed] : trimmed.split(delimiter);
    })
    .map((item) => item.trim())
    .filter(Boolean);
}

export function approvedRepoCwds(env = process.env) {
  const configured = [
    ...splitPathList(env.AFT_AUTOMATION_APPROVED_CWDS),
    ...splitPathList(env.AFT_AUTOMATION_EXPECTED_CWD),
  ];
  const values = configured.length ? configured : DEFAULT_APPROVED_REPO_CWDS;
  const seen = new Set();
  return values
    .map((value) => resolveConfiguredPath(value))
    .filter((value) => {
      const key = pathKey(value);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function localRuntimePaths({ cwd = process.cwd(), env = process.env } = {}) {
  const normalizedCwd = resolveConfiguredPath(cwd);
  const expectedCwds = approvedRepoCwds(env);
  const cwdMatchesExpected = expectedCwds.some((expectedCwd) => pathKey(expectedCwd) === pathKey(normalizedCwd));

  return {
    cwd: normalizedCwd,
    cwdMatchesExpected,
    expectedCwd: expectedCwds[0] ?? '',
    expectedCwds,
  };
}
