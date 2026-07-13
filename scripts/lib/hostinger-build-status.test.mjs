import { describe, expect, it } from 'vitest';

import { summarizeHostingerNodeRuntime } from './hostinger-build-status.mjs';

function build(overrides = {}) {
  return {
    uuid: 'build-1',
    state: 'completed',
    options: {
      node_version: 24,
      entry_file: 'app.js',
      output_directory: 'dist',
      source_type: 'git',
      ...overrides.options,
    },
    ...overrides,
  };
}

describe('Hostinger Node runtime status', () => {
  it('accepts a completed Node 24 Astro server build', () => {
    const result = summarizeHostingerNodeRuntime([build()]);

    expect(result.ok).toBe(true);
    expect(result.description).toContain('Node 24');
    expect(result.latest.entryFile).toBe('app.js');
  });

  it('rejects the old automatic Node 22 null-entry build shape', () => {
    const result = summarizeHostingerNodeRuntime([
      build({ options: { node_version: 22, entry_file: null, output_directory: 'dist' } }),
    ]);

    expect(result.ok).toBe(false);
    expect(result.message).toContain('Node 22');
    expect(result.message).toContain('entry null');
  });

  it('keeps an active build in attention state until it completes', () => {
    const result = summarizeHostingerNodeRuntime([build({ state: 'running' })]);

    expect(result.ok).toBe(false);
    expect(result.message).toContain('running');
  });

  it('reports missing build history as not enough data', () => {
    const result = summarizeHostingerNodeRuntime([]);

    expect(result.ok).toBe(false);
    expect(result.message).toContain('not enough data');
  });
});
