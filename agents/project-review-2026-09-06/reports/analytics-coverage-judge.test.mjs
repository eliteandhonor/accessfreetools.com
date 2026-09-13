import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { createProductionAnalyticsReport } from '../../../scripts/lib/production-analytics-report.mjs';
import { createUsageDataAssetReport } from '../../../scripts/lib/usage-data-asset-report.mjs';
import { analyzeFourInARowPilot } from '../../../scripts/lib/four-in-a-row-pilot-report.mjs';

// Extract the actual pure sanitizer without importing config lookup or accessing event logs.
const source = readFileSync(new URL('../../../src/lib/siteAnalytics.ts', import.meta.url), 'utf8');
const ast = ts.createSourceFile('siteAnalytics.ts', source, ts.ScriptTarget.Latest, true);
const sanitizer = ast.statements.find((node) => ts.isFunctionDeclaration(node) && node.name?.text === 'sanitizeAnalyticsPath');
const javascript = ts.transpileModule(sanitizer.getText(ast).replace(/^export /, ''), {
  compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.None },
}).outputText;
const sanitize = runInNewContext(`${javascript}; sanitizeAnalyticsPath`, { URL });
const layout = readFileSync(new URL('../../../src/components/BaseLayout.astro', import.meta.url), 'utf8');
const tracker = [...layout.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/g)]
  .find((match) => match[1].includes('const analyticsHosts'))[1];

function clientEvents(path) {
  const beacons = [];
  const listeners = new Map();
  const storage = { getItem: () => null, setItem: () => {} };
  runInNewContext(tracker, {
    URL, Blob, CustomEvent, location: { hostname: 'accessfreetools.com', pathname: path },
    window: { localStorage: storage, sessionStorage: storage },
    navigator: { language: 'en', sendBeacon: (_url, body) => { beacons.push(body); return true; } },
    document: { title: 'Synthetic private path', referrer: '', addEventListener: (name, listener) => listeners.set(name, listener) },
  });
  listeners.get('aft:tool-action')?.(new CustomEvent('aft:tool-action', {
    detail: { action: 'Calculate', toolSlug: 'fixture', toolName: 'Fixture' },
  }));
  return beacons;
}

for (const path of ['//admin/analytics/', '///private-analytics/', '/\\api/v1/run/']) {
  test(`J-EV04-01 server must not reinterpret private pathname ${path} as an authority`, () => {
    assert.equal(sanitize(`https://accessfreetools.com${path}`), '');
    assert.equal(sanitize(path), '', `actual normalized value: ${sanitize(path)}`);
  });
  test(`J-EV04-01 tracker must exclude normalized private pathname ${path}`, () => {
    assert.equal(clientEvents(path).length, 0, 'private page_view/custom action beacons must both be suppressed');
  });
}

test('private normal forms and similar public routes remain correct', () => {
  for (const path of ['/admin/', '/private-analytics/', '/%61dmin/', '/tools/../api/']) {
    assert.equal(sanitize(path), '');
    assert.equal(clientEvents(path).length, 0);
  }
  for (const path of ['/administrator/', '/apiary/', '/mcp-guide/']) {
    assert.equal(sanitize(path), path);
    assert.equal(clientEvents(path).length, 2);
  }
});

const now = new Date('2026-09-08T00:00:00.000Z');
function production(coverage) {
  return createProductionAnalyticsReport({ days: 30, generatedAt: now.toISOString(), source: 'synthetic-only', summary: {
    generatedAt: now.toISOString(), ownerExclusionConfigured: true, coverage,
    range: { events: 180, pageViews: 120, toolActions: 60, visitors: 40, returningVisitors: 12 },
    topPages: [{ count: 30, label: 'Tools', path: '/tools/' }],
  } });
}

test('partial and missing production coverage block usage-note readiness', () => {
  for (const coverage of [undefined, { status: 'partial', retainedRead: 'partial', comparisonsAllowed: false,
    deploymentContinuity: 'unknown', reasons: ['file-tail-limit'] }]) {
    const result = createUsageDataAssetReport({ now, productionReport: production(coverage) });
    assert.equal(result.status, 'not-ready');
  }
});

test('J-EV04-02 contradictory partial coverage must not authorize an editorial draft', () => {
  const report = createUsageDataAssetReport({ now, productionReport: production({ status: 'complete',
    retainedRead: 'partial', deploymentContinuity: 'verified', comparisonsAllowed: true, reasons: ['file-tail-limit'],
    observedStart: null, observedEnd: null, rangeObservedStart: null, rangeObservedEnd: null }) });
  assert.equal(report.status, 'not-ready', JSON.stringify({ status: report.status, issues: report.readinessIssues }));
});

test('J-EV04-02 malformed legacy reasons must fail closed rather than crash the report', () => {
  assert.doesNotThrow(() => createUsageDataAssetReport({ now, productionReport: production({ status: 'partial',
    deploymentContinuity: 'unknown', comparisonsAllowed: false, reasons: 'file-tail-limit' }) }));
});

test('J-EV04-C1 deferred game consumer must not decide from explicitly partial coverage', () => {
  const report = analyzeFourInARowPilot({ now, ownerExclusionConfigured: true, aggregate: {
    coverage: { status: 'partial', comparisonsAllowed: false, deploymentContinuity: 'unknown' },
    actions: [{ action: 'Start round: computer', count: 100 }, { action: 'Complete round', count: 25 }],
    audience: { pageViews: 80, sessions: 40, visitors: 30 },
  } });
  assert.equal(report.measurementReady, false, report.status);
});
