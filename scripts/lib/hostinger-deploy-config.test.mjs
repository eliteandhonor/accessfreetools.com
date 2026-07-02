import { describe, expect, it } from 'vitest';

import { DEFAULT_HOSTINGER_NODE_VERSION, resolveHostingerNodeVersion } from './hostinger-deploy-config.mjs';

describe('Hostinger deploy config', () => {
  it('defaults production deploys to Node 24', () => {
    expect(DEFAULT_HOSTINGER_NODE_VERSION).toBe(24);
    expect(resolveHostingerNodeVersion({})).toBe(24);
  });

  it('allows explicit rollback/runtime override values', () => {
    expect(resolveHostingerNodeVersion({ HOSTINGER_NODE_VERSION: '22' })).toBe(22);
    expect(resolveHostingerNodeVersion({ npm_config_node_version: '20' })).toBe(20);
  });

  it('rejects unsupported Hostinger Node versions', () => {
    expect(() => resolveHostingerNodeVersion({ HOSTINGER_NODE_VERSION: '23' })).toThrow(/Unsupported Hostinger Node version/);
  });
});
