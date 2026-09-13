import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    // Browser and Git tests spawn child processes in addition to Vitest workers.
    maxWorkers: 1,
    include: ['src/**/*.test.ts', 'tests/**/*.test.ts', 'scripts/**/*.test.mjs'],
  },
});
