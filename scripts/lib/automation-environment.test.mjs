import { describe, expect, it } from 'vitest';
import { approvedRepoCwds, localRuntimePaths } from './automation-environment.mjs';

describe('automation environment paths', () => {
  it('approves the active Access Free Tools workspace by default', () => {
    const report = localRuntimePaths({
      cwd: 'C:/Users/chamb/OneDrive/Desktop/accessfreetools.com',
      env: {},
    });

    expect(report.cwdMatchesExpected).toBe(true);
    expect(report.expectedCwds).toEqual(['C:\\Users\\chamb\\OneDrive\\Desktop\\accessfreetools.com']);
  });

  it('does not silently approve the stale production clone', () => {
    const report = localRuntimePaths({
      cwd: 'C:/Users/chamb/OneDrive/Desktop/accessfreetools-main-live',
      env: {},
    });

    expect(report.cwdMatchesExpected).toBe(false);
  });

  it('rejects unrelated workspaces', () => {
    const report = localRuntimePaths({
      cwd: 'C:/Users/chamb/OneDrive/Desktop/not-access-free-tools',
      env: {},
    });

    expect(report.cwdMatchesExpected).toBe(false);
  });

  it('allows explicit env configuration when the workspace moves', () => {
    const expectedCwds = approvedRepoCwds({
      AFT_AUTOMATION_APPROVED_CWDS: 'D:/sites/accessfreetools;E:/mirror/accessfreetools',
    });

    expect(expectedCwds).toEqual(['D:\\sites\\accessfreetools', 'E:\\mirror\\accessfreetools']);
    expect(
      localRuntimePaths({
        cwd: 'E:/mirror/accessfreetools',
        env: { AFT_AUTOMATION_APPROVED_CWDS: 'D:/sites/accessfreetools;E:/mirror/accessfreetools' },
      }).cwdMatchesExpected,
    ).toBe(true);
  });
});
