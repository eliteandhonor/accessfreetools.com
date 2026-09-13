import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { analyzeFourInARowPilot, renderFourInARowPilotReport, isGameOwnerExclusionConfirmed } from './lib/four-in-a-row-pilot-report.mjs';
import { getAnalyticsCoverage } from './lib/production-analytics-report.mjs';

// Run the wrapper with in-memory IO only; never inspect real reports or owner configuration.
const source = ts.createSourceFile('four-in-a-row-pilot-report.mjs',
  readFileSync(new URL('./four-in-a-row-pilot-report.mjs', import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true);
const wrapper = source.statements.filter((statement) => !ts.isImportDeclaration(statement))
  .map((statement) => statement.getText(source)).join('\n');

describe('Four in a Row wrapper coverage propagation', () => {
  it.each([undefined, { status: 'partial', retainedRead: 'partial', reasons: ['file-tail-limit'],
    deploymentContinuity: 'unknown', comparisonsAllowed: false,
    requestedStart: '2026-07-13T00:00:00Z', requestedEnd: '2026-09-08T00:00:00Z',
    observedStart: '2026-09-01T00:00:00Z', observedEnd: '2026-09-08T00:00:00Z' }])(
    'propagates or marks unknown coverage from a synthetic production aggregate: %j', (coverage) => {
      const writes = new Map();
      runInNewContext(wrapper, {
        existsSync: (path) => path === 'output/analytics/production-four-in-a-row-game-latest.json',
        readFileSync: () => JSON.stringify({ summary: { coverage,
          selectedToolActions: [{ action: 'Start round: computer', count: 100 }], selectedToolAudience: { visitors: 30 } } }),
        writeFileSync: (path, contents) => writes.set(path, contents), mkdirSync: () => {},
        resolve: (path) => path, dirname: () => 'output/game-pilot',
        process: { env: { AFT_ANALYTICS_EXCLUDE_IPS: 'synthetic-only' } }, console: { log: () => {} },
        getAnalyticsCoverage, renderFourInARowPilotReport, isGameOwnerExclusionConfirmed,
        analyzeFourInARowPilot: (input) => {
          expect(input.aggregate.coverage).toMatchObject(coverage ?? { status: 'unknown', comparisonsAllowed: false });
          return analyzeFourInARowPilot({ ...input, now: new Date('2026-09-08T00:00:00Z') });
        },
      });
      const report = JSON.parse(writes.get('output/game-pilot/four-in-a-row-latest.json'));
      expect(report.measurementReady).toBe(false);
      expect(report.usage.starts).toBe(100);
    });
});

describe('Four in a Row wrapper production provenance', () => {
  it('passes the server observation and target, never the wrapper refresh date or local IP configuration', () => {
    const writes = new Map();
    runInNewContext(wrapper, {
      existsSync: (path) => path === 'output/analytics/production-four-in-a-row-game-latest.json',
      readFileSync: () => JSON.stringify({ generatedAt: '2026-09-08T12:00:00Z', toolSlug: 'four-in-a-row-game',
        source: 'https://accessfreetools.com/api/analytics/events?days=90&tool=four-in-a-row-game',
        summary: { generatedAt: '2026-07-14T00:00:00Z', rangeStart: '2026-06-01T00:00:00Z', ownerExclusionConfigured: false,
          selectedToolActions: [{ action: 'Start round: computer (round-v2)', count: 100 }],
          selectedToolAudience: { slug: 'four-in-a-row-game', visitors: 30 } } }),
      writeFileSync: (path, contents) => writes.set(path, contents), mkdirSync: () => {},
      resolve: (path) => path, dirname: () => 'output/game-pilot',
      process: { env: { AFT_ANALYTICS_EXCLUDE_IPS: 'synthetic-only' } }, console: { log: () => {} },
      getAnalyticsCoverage, renderFourInARowPilotReport, isGameOwnerExclusionConfirmed,
      analyzeFourInARowPilot: (input) => {
        expect(input.aggregate).toMatchObject({ generatedAt: '2026-07-14T00:00:00Z', rangeStart: '2026-06-01T00:00:00Z',
          toolSlug: 'four-in-a-row-game', source: 'https://accessfreetools.com/api/analytics/events?days=90&tool=four-in-a-row-game' });
        expect(input.ownerExclusionConfigured).toBe(false);
        return analyzeFourInARowPilot({ ...input, now: new Date('2026-09-08T12:00:00Z') });
      },
    });
    const report = JSON.parse(writes.get('output/game-pilot/four-in-a-row-latest.json'));
    expect(report.measurementReady).toBe(false);
    expect(report.evidence.status).toBe('stale');
    expect(report.evidence.generatedAt).toBe('2026-07-14T00:00:00Z');
  });
});
