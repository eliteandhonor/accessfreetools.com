import { afterEach, expect, it, vi } from 'vitest';

const mocks = vi.hoisted(() => ({ remove: vi.fn(), write: vi.fn() }));
vi.mock('node:fs', async (importOriginal) => ({
  ...await importOriginal(),
  mkdirSync: vi.fn(),
  readdirSync: () => [{ name: 'owner-authored-article.png', isFile: () => true }],
  rmSync: mocks.remove,
  writeFileSync: mocks.write,
}));
vi.mock('playwright', () => ({
  chromium: { launch: async () => ({
    newPage: async () => ({
      setContent: async () => {},
      setViewportSize: async () => {},
      screenshot: async () => Buffer.from('synthetic image'),
    }),
    close: async () => {},
  }) },
}));
vi.mock('sharp', () => ({ default: (path) => ({ metadata: async () => ({ width: 1000, height: path.endsWith('avatar.png') ? 1000 : 1500, format: 'jpeg' }) }) }));

afterEach(() => vi.restoreAllMocks());

it('generates its assets without deleting owner-authored public PNGs', async () => {
  vi.spyOn(console, 'log').mockImplementation(() => {});
  await import('../generate-pinterest-assets.mjs');
  expect(mocks.remove).not.toHaveBeenCalled();
  expect(mocks.write.mock.calls.some(([path]) => path.endsWith('basic-calculator.jpg'))).toBe(true);
});

it('check mode never regenerates public artwork', async () => {
  const args = process.argv;
  process.argv = [...args, '--check'];
  vi.resetModules();
  mocks.write.mockClear();
  try {
    vi.spyOn(console, 'log').mockImplementation(() => {});
    await import('../generate-pinterest-assets.mjs');
    expect(mocks.write.mock.calls.filter(([path]) => /[\\/]public[\\/]/.test(path))).toEqual([]);
  } finally {
    process.argv = args;
  }
});
