import { describe, expect, it } from 'vitest';

import { DEFAULT_HOSTINGER_NODE_VERSION, resolveHostingerNodeVersion } from './hostinger-deploy-config.mjs';

describe('Hostinger deploy config', () => {
  it('defaults production deploys to Node 24', () => {
    expect(DEFAULT_HOSTINGER_NODE_VERSION).toBe(24);
    expect(resolveHostingerNodeVersion({})).toBe(24);
  });

  it('allows only the Node 24 production runtime', () => {
    expect(resolveHostingerNodeVersion({ HOSTINGER_NODE_VERSION: '24' })).toBe(24);
    expect(resolveHostingerNodeVersion({ npm_config_node_version: '24' })).toBe(24);
  });

  it('rejects non-24 Hostinger Node versions', () => {
    expect(() => resolveHostingerNodeVersion({ HOSTINGER_NODE_VERSION: '22' })).toThrow(/must be 24/);
    expect(() => resolveHostingerNodeVersion({ npm_config_node_version: '20' })).toThrow(/must be 24/);
  });
});
