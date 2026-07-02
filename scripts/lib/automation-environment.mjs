import { delimiter } from 'node:path';
import { resolve } from 'node:path';

export const DEFAULT_APPROVED_REPO_CWDS = [
  'C:/Users/chamb/OneDrive/Desktop/accessfreetools-main-live',
  'C:/Users/chamb/OneDrive/Desktop/accessfreetools.com',
];

function pathKey(path) {
  return resolve(path).toLowerCase();
}

function splitPathList(value = '') {
  return String(value)
    .split(/[;\n]/)
    .flatMap((item) => item.split(delimiter))
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
    .map((value) => resolve(value))
    .filter((value) => {
      const key = pathKey(value);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

export function localRuntimePaths({ cwd = process.cwd(), env = process.env } = {}) {
  const normalizedCwd = resolve(cwd);
  const expectedCwds = approvedRepoCwds(env);
  const cwdMatchesExpected = expectedCwds.some((expectedCwd) => pathKey(expectedCwd) === pathKey(normalizedCwd));

  return {
    cwd: normalizedCwd,
    cwdMatchesExpected,
    expectedCwd: expectedCwds[0] ?? '',
    expectedCwds,
  };
}
