export function isBlockingViolation(violation) {
  if (violation.impact === 'critical' || violation.impact === 'serious') return true;
  return violation.impact === 'moderate' && violation.id.startsWith('landmark');
}

function findingEvidence(finding, kind) {
  const checks = (items = []) => items.map((check) => ({
    id: check.id, impact: check.impact ?? null, message: check.message ?? '',
    relatedNodes: (check.relatedNodes ?? []).map((node) => ({ target: node.target })),
  }));
  return {
    id: finding.id,
    impact: finding.impact ?? null,
    description: finding.description,
    help: finding.help,
    helpUrl: finding.helpUrl,
    tags: finding.tags ?? [],
    reviewStatus: 'pending',
    reviewEvidence: null,
    guidance: kind === 'incomplete'
      ? 'Axe could not decide this rule. Review the node checks in this viewport and selected theme; record evidence before resolving.'
      : 'Review and resolve this violation using the rule help and node guidance; the automated severity gate is not conformance approval.',
    nodes: (finding.nodes ?? []).map((node) => ({
      target: node.target,
      failureSummary: node.failureSummary ?? '',
      any: checks(node.any), all: checks(node.all), none: checks(node.none),
    })),
  };
}

export function createAccessibilityCheck({ pagePath, viewport, results, assertions = [], pageErrors = [], theme = null, blockedRequestCounts = {} }) {
  if (!Array.isArray(results?.violations) || !Array.isArray(results?.incomplete)) {
    throw new Error('Axe violations and incomplete arrays are required for an accessibility report.');
  }
  const blockingViolations = results.violations.filter(isBlockingViolation).map((finding) => findingEvidence(finding, 'violation'));
  const nonBlockingViolations = results.violations.filter((finding) => !isBlockingViolation(finding)).map((finding) => findingEvidence(finding, 'violation'));
  const incomplete = results.incomplete.map((finding) => findingEvidence(finding, 'incomplete'));
  const unresolved = [...blockingViolations, ...nonBlockingViolations, ...incomplete];
  const pass = pageErrors.length === 0 && blockingViolations.length === 0 && assertions.every((assertion) => assertion.pass);
  return {
    pagePath, viewport, assertions, pageErrors, theme, blockedRequestCounts,
    engine: results.testEngine ? { name: results.testEngine.name, version: results.testEngine.version } : null,
    violationCount: results.violations.length,
    incompleteCount: incomplete.length,
    blockingViolations, nonBlockingViolations, incomplete,
    pass,
    automatedStatus: pass ? 'passed' : 'failed',
    manualReview: {
      status: unresolved.length ? 'pending' : 'not-performed',
      unresolvedFindingCount: unresolved.length,
      unresolvedNodeCount: unresolved.reduce((sum, finding) => sum + finding.nodes.length, 0),
      evidence: null,
    },
    conformance: 'not-assessed',
  };
}

export function createAccessibilityPlan({ pages = [], viewports = [], themeMatrix = false } = {}) {
  const themes = [
    { id: 'fresh', label: 'Fresh' }, { id: 'coral', label: 'Coral' }, { id: 'violet', label: 'Violet' },
    { id: 'lagoon', label: 'Lagoon' }, { id: 'bloom', label: 'Bloom' }, { id: 'sunrise', label: 'Sunrise' },
    { id: 'forest', label: 'Forest' }, { id: 'slate', label: 'Slate' }, { id: 'orchid', label: 'Retro' }, { id: 'mono', label: 'Ink' },
  ];
  return themeMatrix ? {
    mode: 'selected-theme-matrix', themes,
    pages: ['/tools/', '/blog/', '/gallery/finance/'],
    viewports: [{ name: 'desktop', width: 1365, height: 900 }, { name: 'tablet', width: 768, height: 1024 },
      { name: 'mobile', width: 390, height: 844 }],
  } : { mode: 'default-theme', pages, viewports, themes: themes.slice(0, 1) };
}

export function classifyAccessibilityRequest(value, method, origin) {
  if (method !== 'GET') return 'non-get';
  try {
    const url = new URL(value);
    let pathname = url.pathname;
    for (let pass = 0; pass < 3 && pathname.includes('%'); pass += 1) pathname = decodeURIComponent(pathname);
    if (pathname.includes('%')) return 'malformed';
    if (/\/ai-models\/|\.onnx(?:$|\/)|traineddata|tesseract-core|ort-wasm|transformers\.web|(?:kokoro|supertonic)\.worker|phonemizer|kokoro-82m|supertonic-3/i.test(pathname)) return 'model-or-runtime';
    if (url.origin !== origin || !/^http:\/\/127\.0\.0\.1:\d+$/.test(origin)) return 'external';
    pathname = new URL(`${origin}${pathname.replace(/\\/g, '/').replace(/\/{2,}/g, '/')}`).pathname;
    if (/^\/(?:admin|private-analytics|api|mcp)(?:\/|$)/i.test(pathname)) return 'private-or-api';
    return 'allowed';
  } catch {
    return 'malformed';
  }
}

export function summarizeAccessibilityChecks(checks) {
  const unresolvedFindingCount = checks.reduce((sum, check) => sum + check.manualReview.unresolvedFindingCount, 0);
  return {
    automatedStatus: checks.length ? checks.every((check) => check.pass) ? 'passed' : 'failed' : 'not-run',
    manualReview: { status: unresolvedFindingCount ? 'pending' : 'not-performed', unresolvedFindingCount, evidence: null },
    conformance: 'not-assessed',
  };
}
