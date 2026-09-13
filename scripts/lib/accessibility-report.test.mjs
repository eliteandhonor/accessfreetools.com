import { readFileSync } from 'node:fs';
import { runInNewContext } from 'node:vm';
import ts from 'typescript';
import { describe, expect, it } from 'vitest';
import { createAccessibilityCheck, summarizeAccessibilityChecks } from './accessibility-report.mjs';
import * as evidence from './accessibility-report.mjs';

const source = ts.createSourceFile('check-accessibility.mjs',
  readFileSync(new URL('../check-accessibility.mjs', import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true);
let reportExpression;
function visit(node) {
  if (ts.isCallExpression(node) && node.expression.getText(source) === 'report.checks.push') reportExpression = node.arguments[0].getText(source);
  ts.forEachChild(node, visit);
}
visit(source);
function fixture(results, overrides = {}) {
  const state = {
    pagePath: '/tools/', viewport: { name: 'tablet', width: 768, height: 1024 },
    createAccessibilityCheck,
    theme: { requestedId: 'fresh', observedId: 'fresh', method: 'isolated-default', applied: true }, blockedRequestCounts: {},
    results: { violations: [], incomplete: [], ...results }, assertions: [{ id: 'keyboard-control', pass: true }], pageErrors: [],
    ...overrides,
  };
  return runInNewContext(`JSON.parse(JSON.stringify(${reportExpression}))`, state);
}

const rule = (id, impact = 'moderate') => ({
  id, impact, description: 'Synthetic rule description', help: 'Review the rendered result',
  helpUrl: 'https://example.invalid/rule', tags: ['wcag2aa'],
  nodes: [{ target: ['#synthetic-control'], failureSummary: 'Review this foreground/background pair.',
    html: '<input value="synthetic-private-value">',
    any: [{ id: 'contrast-check', impact, message: 'Inspect the background in this selected theme.', data: { value: 'synthetic-private-value' } }],
    all: [], none: [],
  }],
});

describe('bounded selected-theme evidence plan', () => {
  it('keeps the default route/viewport gate and separates the opt-in 90-case matrix', () => {
    const pages = ['/tools/', '/ask/'];
    const viewports = [{ name: 'mobile-320', width: 320, height: 568 }];
    expect(evidence.createAccessibilityPlan({ pages, viewports })).toMatchObject({ pages, viewports,
      mode: 'default-theme', themes: [{ id: 'fresh', label: 'Fresh' }] });
    const plan = evidence.createAccessibilityPlan({ pages, viewports, themeMatrix: true });
    expect(plan.mode).toBe('selected-theme-matrix');
    expect(plan.pages).toEqual(['/tools/', '/blog/', '/gallery/finance/']);
    expect(plan.viewports.map((viewport) => viewport.width)).toEqual([1365, 768, 390]);
    expect(plan.pages.length * plan.viewports.length * plan.themes.length).toBe(90);
  });

  it('uses the actual supported IDs and labels, including Retro and Ink', () => {
    const picker = ts.createSourceFile('ThemePicker.tsx', readFileSync(new URL('../../src/components/ThemePicker.tsx', import.meta.url), 'utf8'), ts.ScriptTarget.Latest, true);
    const declaration = picker.statements.filter(ts.isVariableStatement).flatMap((node) => [...node.declarationList.declarations])
      .find((node) => node.name.getText(picker) === 'themes');
    const array = declaration.initializer.expression;
    const themes = array.elements.map((node) => Object.fromEntries(node.properties
      .filter((property) => ['id', 'label'].includes(property.name.getText(picker)))
      .map((property) => [property.name.getText(picker), property.initializer.text])));
    expect(evidence.createAccessibilityPlan({ themeMatrix: true }).themes).toEqual(themes);
  });
});

describe('local synthetic-page request boundaries', () => {
  it.each([
    ['http://127.0.0.1:4321/tools/', 'GET', 'allowed'],
    ['http://127.0.0.1:4321/tool-search-index.json', 'GET', 'allowed'],
    ['http://127.0.0.1:4321/_astro/page.js', 'GET', 'allowed'],
    ['https://example.invalid/tracker.js?token=synthetic', 'GET', 'external'],
    ['http://127.0.0.1:9999/tools/', 'GET', 'external'],
    ['http://127.0.0.1:4321/api/analytics/events', 'POST', 'non-get'],
    ['http://127.0.0.1:4321/%61dmin/analytics/', 'GET', 'private-or-api'],
    ['http://127.0.0.1:4321/api/v1/ask', 'GET', 'private-or-api'],
    ['http://127.0.0.1:4321/ai-models/model.onnx', 'GET', 'model-or-runtime'],
    ['https://example.invalid/tesseract-core.wasm.js', 'GET', 'model-or-runtime'],
    ['not-a-url', 'GET', 'malformed'],
  ])('classifies %s %s as %s without requests', (url, method, decision) => {
    expect(evidence.classifyAccessibilityRequest(url, method, 'http://127.0.0.1:4321')).toBe(decision);
  });

  it('cannot be repointed at a public production origin', () => {
    expect(evidence.classifyAccessibilityRequest('https://accessfreetools.com/tools/', 'GET', 'https://accessfreetools.com')).toBe('external');
  });
});

describe('actual checker theme-selection path with synthetic page methods', () => {
  it('checks initial keyboard entry before any theme selection changes the focus origin', () => {
    const inspect = source.statements.find(node => ts.isFunctionDeclaration(node) && node.name?.text === 'inspectPage').getText(source);
    expect(inspect.indexOf('inspectKeyboardAndStatusBehavior(page')).toBeLessThan(inspect.indexOf('selectTheme(page'));
    expect(inspect.indexOf('selectTheme(page')).toBeLessThan(inspect.indexOf('axe.analyze()'));
  });
  const selection = source.statements.find((node) => ts.isFunctionDeclaration(node) && node.name?.text === 'selectTheme');
  async function select(theme, { applies = true, hydrated = true, mode = 'selected-theme-matrix' } = {}) {
    const calls = [];
    let state = { observedId: 'fresh', storedId: null };
    const page = {
      locator: (selector) => ({ click: async () => { calls.push(selector); } }),
      getByRole: (role, options) => ({ click: async () => {
        calls.push({ role, ...options });
        if (applies) state = { observedId: theme.id, storedId: theme.id };
      } }),
      waitForFunction: async (_predicate, id) => { if (state.observedId !== id) throw new Error('Synthetic unapplied theme'); },
      evaluate: async () => state,
    };
    const run = runInNewContext(`${selection.getText(source)}; selectTheme`, {
      PLAN: { mode }, HYDRATION_TIMEOUT_MS: 1, waitForHydratedSelector: async () => hydrated,
    });
    return { result: await run(page, theme), calls };
  }

  it.each([{ id: 'orchid', label: 'Retro' }, { id: 'mono', label: 'Ink' }])('selects the exact %s swatch, then verifies observed and stored IDs', async (theme) => {
    const { result, calls } = await select(theme);
    expect(calls).toEqual(['.theme-picker-trigger', { role: 'button', name: `Use ${theme.label} look`, exact: true }]);
    expect(result).toMatchObject({ requestedId: theme.id, observedId: theme.id, storedId: theme.id, method: 'swatch-click', applied: true });
  });

  it('does not count opening the picker without successful selection as matrix coverage', async () => {
    const { result } = await select({ id: 'coral', label: 'Coral' }, { applies: false });
    expect(result).toMatchObject({ requestedId: 'coral', observedId: 'fresh', applied: false });
  });

  it('does not claim selection before the picker hydrates', async () => {
    const { result, calls } = await select({ id: 'fresh', label: 'Fresh' }, { hydrated: false });
    expect(calls).toEqual([]);
    expect(result.applied).toBe(false);
  });

  it('labels an isolated default-theme check separately from selected-theme proof', async () => {
    const { result, calls } = await select({ id: 'fresh', label: 'Fresh' }, { mode: 'default-theme' });
    expect(calls).toEqual([]);
    expect(result).toMatchObject({ method: 'isolated-default', applied: true });
  });
});

describe('accessibility report JSON evidence', () => {
  it('retains incomplete rule IDs, targets and guidance without failing the automated gate', () => {
    const report = fixture({ incomplete: [rule('color-contrast', 'serious')] });
    expect(report.pass).toBe(true);
    expect(report.automatedStatus).toBe('passed');
    expect(report.incomplete[0]).toMatchObject({ id: 'color-contrast', reviewStatus: 'pending',
      nodes: [{ target: ['#synthetic-control'], any: [{ id: 'contrast-check', message: expect.any(String) }] }] });
    expect(report.manualReview).toMatchObject({ status: 'pending', unresolvedFindingCount: 1, unresolvedNodeCount: 1 });
    expect(report.conformance).toBe('not-assessed');
    expect(JSON.stringify(report)).not.toContain('synthetic-private-value');
  });

  it('retains nonblocking rule details instead of only a violation count', () => {
    const report = fixture({ violations: [rule('color-contrast')] });
    expect(report.pass).toBe(true);
    expect(report.nonBlockingViolations[0]).toMatchObject({ id: 'color-contrast', help: expect.any(String),
      helpUrl: expect.any(String), reviewStatus: 'pending', nodes: [{ target: ['#synthetic-control'] }] });
    expect(report.manualReview.status).toBe('pending');
  });

  it.each([
    ['other-rule', 'critical', false], ['other-rule', 'serious', false],
    ['landmark-one-main', 'moderate', false], ['landmark-one-main', 'minor', true],
    ['color-contrast', 'moderate', true], ['other-rule', 'minor', true], ['other-rule', null, true],
  ])('preserves the existing blocker policy for %s / %s', (id, impact, pass) => {
    const report = fixture({ violations: [rule(id, impact)] });
    expect(report.pass).toBe(pass);
    expect(report.blockingViolations.map((finding) => finding.id)).toEqual(pass ? [] : [id]);
  });

  it('keeps keyboard assertion failures blocking', () => {
    expect(fixture({}, { assertions: [{ id: 'keyboard-control', pass: false }] }).pass).toBe(false);
  });

  it('keeps page errors blocking', () => {
    expect(fixture({}, { pageErrors: ['Synthetic page error'] }).pass).toBe(false);
  });

  it('does not imply conformance or manual review completion when axe returns no findings', () => {
    const report = fixture({});
    expect(report.pass).toBe(true);
    expect(report.manualReview).toMatchObject({ status: 'not-performed', unresolvedFindingCount: 0 });
    expect(report.conformance).toBe('not-assessed');
  });

  it('aggregates unresolved findings without converting them into blocking failures', () => {
    const check = fixture({ incomplete: [rule('color-contrast')] });
    const summary = JSON.parse(JSON.stringify(summarizeAccessibilityChecks([check, fixture({})])));
    expect(summary).toMatchObject({ automatedStatus: 'passed', conformance: 'not-assessed',
      manualReview: { status: 'pending', unresolvedFindingCount: 1, evidence: null } });
    expect(summarizeAccessibilityChecks([]).automatedStatus).toBe('not-run');
    expect(summarizeAccessibilityChecks([fixture({}, { pageErrors: ['Synthetic error'] })]).automatedStatus).toBe('failed');
  });

  it('does not treat a missing axe result set as an automated pass', () => {
    expect(() => createAccessibilityCheck({ results: { violations: [] } })).toThrow('incomplete arrays are required');
  });
});
