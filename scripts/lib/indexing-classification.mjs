import { fileURLToPath } from 'node:url';
import { readExplicitIndexationPolicies } from './indexation-policy-source.mjs';
import { hasInspectionSourcePath } from './search-console-inspection-reports.mjs';

const sourceRoot = fileURLToPath(new URL('../../', import.meta.url));
const siteOrigin = 'https://accessfreetools.com';

function policyPath(value) {
  if (typeof value !== 'string' || !value.trim()) return '';
  try {
    const url = new URL(value, siteOrigin);
    if (url.origin !== siteOrigin) return '';
    const path = url.pathname;
    return /\.[a-z0-9]+$/i.test(path) || path.endsWith('/') ? path : `${path}/`;
  } catch {
    return '';
  }
}

export function hasBlockedIndexingState(item) {
  return /^BLOCKED_BY_(?:META_TAG|HTTP_HEADER)$/i.test(String(item.indexingState ?? '').trim());
}

export function newerPassForRecovery(item, report, indexed) {
  const path = policyPath(item.path ?? item.url);
  const dataDate = report.source?.dataDate;
  // A daily export has no event time: require PASS after the whole reported Brisbane day.
  const reportDate = dataDate === undefined ? report.generatedAt
    : /^\d{4}-\d{2}-\d{2}$/.test(String(dataDate)) ? `${dataDate}T23:59:59.999+10:00` : '';
  const recoveryTime = Date.parse(Object.hasOwn(item, 'sourceGeneratedAt') ? item.sourceGeneratedAt : reportDate);
  if (!path || !Number.isFinite(recoveryTime)) return null;
  const pass = indexed.find((inspection) =>
    policyPath(inspection.inspectionUrl ?? inspection.url) === path &&
    String(inspection.verdict ?? '').trim().toUpperCase() === 'PASS' &&
    !inspection.error && hasInspectionSourcePath(inspection.sourcePath) && inspection.sourceFreshness === 'fresh' &&
    Date.parse(inspection.sourceGeneratedAt) > recoveryTime);
  return pass ? { sourcePath: pass.sourcePath, sourceGeneratedAt: pass.sourceGeneratedAt,
    recoveryObservedAt: new Date(recoveryTime).toISOString() } : null;
}

export function createIndexingClassifier(rootDir = sourceRoot) {
  // Read the code's policy once per report. Dates and report wrappers cannot release a pilot.
  const policies = readExplicitIndexationPolicies(rootDir);
  return (item) => {
    const path = policyPath(item.inspectionUrl ?? item.url ?? item.path);
    if (policies.get(path)?.index === false) return 'excluded';
    const verdict = String(item.verdict ?? '').trim().toUpperCase();
    if (verdict === 'PASS') return 'indexed';
    const coverage = String(item.coverageState ?? item.state ?? '').trim();
    if (item.error || item.status === 'not enough data') return 'unavailable';
    if (hasBlockedIndexingState(item)) return 'failure';
    if (!coverage) return 'unavailable';
    if (verdict === 'FAIL' || /noindex|blocked_by_(?:meta_tag|http_header)/i.test(`${coverage} ${item.indexingState ?? ''}`)) {
      return 'failure';
    }
    if (/unknown|not indexed|discovered|crawled/i.test(coverage)) return 'recovery';
    if (/^(?:submitted and indexed|indexed, not submitted in sitemap)$/i.test(coverage)) return 'indexed';
    return 'monitor';
  };
}

export function needsIndexingAttention(classification) {
  return ['failure', 'recovery', 'unavailable'].includes(classification);
}
