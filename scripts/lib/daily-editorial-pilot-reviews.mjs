import { createHash } from 'node:crypto';

// These validators assess diagnostic outputs only. They never adopt a rewrite,
// publish content, or replace independent source/content review.
export const PILOT_THRESHOLDS = Object.freeze({
  supported: 0.95, confidence: 0.8, clarity: 4, duplicate: 0.1,
  duplicatePositive: 0.9, duplicateNegative: 0.1,
});
const HASH = /^[a-f0-9]{64}$/;
const ID = /^[A-Za-z0-9][A-Za-z0-9_-]{0,63}$/;
const CHOICES = ['supported', 'contradicted', 'insufficient'];
const CONTROL_TYPES = Object.freeze({
  clarity: 'score', actual_duplicate: 'noul', control_support: 'choice',
  control_contradiction: 'choice', control_insufficient: 'choice',
  duplicate_control_positive: 'noul', duplicate_control_negative: 'noul',
});
const result = (passed, code) => ({ passed, code });
const hold = (code) => result(false, code);
const pass = (code) => result(true, code);
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value) &&
  [Object.prototype, null].includes(Object.getPrototypeOf(value));
const exact = (value, keys) => object(value) && Object.keys(value).length === keys.length && keys.every((key) => Object.hasOwn(value, key));
const bytes = (value) => Buffer.byteLength(value, 'utf8');
const text = (value, maximum) => typeof value === 'string' && value.trim().length > 0 && bytes(value) <= maximum && !value.includes('\0');
const probability = (value) => typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1;
const integer = (value, maximum) => Number.isSafeInteger(value) && value >= 0 && value <= maximum;
const hash = (value) => createHash('sha256').update(value, 'utf8').digest('hex');
const ids = (value, maximum = 128) => Array.isArray(value) && value.length > 0 && value.length <= maximum &&
  value.every((id) => typeof id === 'string' && ID.test(id)) && new Set(value).size === value.length;
const sameIds = (actual, expected) => ids(actual) && ids(expected) && actual.length === expected.length && expected.every((id) => actual.includes(id));
const optionalExpectedIds = (expected, key, actual) => expected[key] === undefined || sameIds(expected[key], actual);

function usage(value, inputLimit, outputLimit, freeOutput = false) {
  return exact(value, ['inputTokens', 'outputTokens']) && integer(value.inputTokens, inputLimit) && value.inputTokens > 0 &&
    integer(value.outputTokens, freeOutput ? Number.MAX_SAFE_INTEGER : outputLimit) && (freeOutput || value.outputTokens > 0);
}

function ollamaInput(request, expected, writing = false) {
  if (!exact(request, ['model', 'messages', 'stream', 'options']) || request.model !== 'gpt-oss:120b' || request.stream !== false ||
      !exact(request.options, ['temperature', 'num_predict']) || request.options.temperature !== 0.2 ||
      !integer(request.options.num_predict, 4000) || request.options.num_predict < 1 ||
      !Array.isArray(request.messages) || request.messages.length !== 2 ||
      request.messages.some((message, index) => !exact(message, ['role', 'content']) || message.role !== ['system', 'user'][index] || !text(message.content, 56000)) ||
      bytes(JSON.stringify(request)) > 56000 || !object(expected) || !HASH.test(expected.articleSha256 ?? '')) return null;
  const input = JSON.parse(request.messages[1].content);
  const basis = writing ? input.basisArticleSha256 : input.articleSha256;
  if (!object(input) || basis !== expected.articleSha256 || !text(input.exactArticleMarkdown, 20000) || hash(input.exactArticleMarkdown) !== basis ||
      !Array.isArray(input.publicUnits) || !ids(input.publicUnits.map((unit) => unit?.id))) return null;
  const unitIds = input.publicUnits.map((unit) => unit.id);
  if (!optionalExpectedIds(expected, 'publicUnitIds', unitIds)) return null;
  if (writing) return { input, unitIds };
  if (!Array.isArray(input.assignedGroups) || !ids(input.assignedGroups.map((group) => group?.id), 64) ||
      input.assignedGroups.some((group) => !ids(group.units))) return null;
  const groupIds = input.assignedGroups.map((group) => group.id);
  const groupedIds = input.assignedGroups.flatMap((group) => group.units);
  if (!sameIds(groupedIds, unitIds) || !optionalExpectedIds(expected, 'groupIds', groupIds)) return null;
  return { input, unitIds, groupIds };
}

/** expected.articleSha256 is required; expected.groupIds/publicUnitIds may add manifest coverage checks. */
export function validatePilotOllamaReview(request, response, expected) {
  try {
    const input = ollamaInput(request, expected);
    if (!input) return hold('PILOT_REQUEST_INVALID');
    if (!exact(response, ['data', 'usage']) || !usage(response.usage, 131072, request.options.num_predict)) return hold('PILOT_USAGE_INVALID');
    const data = response.data;
    if (!exact(data, ['articleSha256', 'assignedGroupIds', 'coveredPublicUnitIds', 'practical', 'noInventedTesting', 'clear', 'issues'])) return hold('PILOT_REVIEW_SCHEMA');
    if (data.articleSha256 !== expected.articleSha256) return hold('PILOT_REVIEW_HASH');
    if (!sameIds(data.assignedGroupIds, input.groupIds) || !sameIds(data.coveredPublicUnitIds, input.unitIds)) return hold('PILOT_REVIEW_COVERAGE');
    if (!Array.isArray(data.issues)) return hold('PILOT_REVIEW_SCHEMA');
    if (data.issues.length) return hold('PILOT_REVIEW_ISSUES');
    if (data.practical !== true || data.noInventedTesting !== true || data.clear !== true) return hold('PILOT_REVIEW_FLAGS');
    return pass('PILOT_REVIEW_VALIDATED');
  } catch { return hold('PILOT_REQUEST_OR_REVIEW_INVALID'); }
}

function writingEntries(entries, knownUnits, unresolved) {
  return Array.isArray(entries) && entries.length <= 128 && entries.every((entry) =>
    exact(entry, unresolved ? ['publicUnitIds', 'reason', 'requiredEvidence'] : ['publicUnitIds', 'reason']) &&
    ids(entry.publicUnitIds) && entry.publicUnitIds.every((id) => knownUnits.includes(id)) && text(entry.reason, 2000) &&
    (!unresolved || text(entry.requiredEvidence, 2000)));
}

/** A schema-valid style proposal remains separate and unreviewed; no proposal text is returned. */
export function validatePilotWriting(request, response, expected) {
  try {
    const input = ollamaInput(request, expected, true);
    if (!input) return hold('PILOT_REQUEST_INVALID');
    if (!exact(response, ['data', 'usage']) || !usage(response.usage, 131072, request.options.num_predict)) return hold('PILOT_USAGE_INVALID');
    const data = response.data;
    if (!exact(data, ['basisArticleSha256', 'proposedMarkdown', 'changes', 'unresolvedIssues'])) return hold('PILOT_WRITING_SCHEMA');
    if (data.basisArticleSha256 !== expected.articleSha256) return hold('PILOT_WRITING_HASH');
    if (!text(data.proposedMarkdown, 20000) || !writingEntries(data.changes, input.unitIds, false) || !writingEntries(data.unresolvedIssues, input.unitIds, true)) return hold('PILOT_WRITING_SCHEMA');
    if (data.unresolvedIssues.length) return hold('PILOT_WRITING_UNRESOLVED');
    if (data.proposedMarkdown !== input.input.exactArticleMarkdown && data.changes.length === 0) return hold('PILOT_WRITING_CHANGE_COVERAGE');
    return pass('PILOT_WRITING_PROPOSAL_VALIDATED');
  } catch { return hold('PILOT_REQUEST_OR_WRITING_INVALID'); }
}

function distribution(value, keys) {
  return exact(value, keys) && Object.values(value).every(probability) &&
    Math.abs(Object.values(value).reduce((sum, p) => sum + p, 0) - 1) <= 0.0001;
}

// Defend this boundary independently even when the normal provider adapter ran first.
function typedAnswer(question, answer) {
  if (!object(question) || !object(answer) || answer.type !== question.type) return false;
  if (question.type === 'noul') return exact(answer, ['type', 'noul']) && probability(answer.noul);
  if (question.type === 'choice') {
    if (!exact(question.criteria, CHOICES) || !exact(answer, ['type', 'choice', 'probabilities', 'confidence']) ||
        !CHOICES.includes(answer.choice) || !probability(answer.confidence) || !distribution(answer.probabilities, CHOICES)) return false;
    const maximum = Math.max(...Object.values(answer.probabilities));
    return answer.probabilities[answer.choice] >= maximum - 0.0001 && Math.abs((maximum - 1 / 3) / (1 - 1 / 3) - answer.confidence) <= 0.02;
  }
  if (question.type !== 'score' || !Array.isArray(question.criteria) || question.criteria.length !== 6 || question.criteria.some((level) => !text(level, 4000))) return false;
  const keys = question.criteria.map((_, index) => String(index));
  if (!exact(answer, ['type', 'score', 'legend', 'probabilities', 'confidence']) || !probability(answer.confidence) ||
      !exact(answer.legend, keys) || keys.some((key) => answer.legend[key] !== question.criteria[Number(key)]) ||
      !distribution(answer.probabilities, keys) || !Number.isFinite(answer.score) || answer.score < 0 || answer.score > 5) return false;
  const weighted = keys.reduce((sum, key) => sum + Number(key) * answer.probabilities[key], 0);
  const mode = keys.reduce((best, key) => answer.probabilities[key] > answer.probabilities[best] ? key : best, keys[0]);
  const distance = keys.reduce((sum, key) => sum + answer.probabilities[key] * Math.abs(Number(key) - Number(mode)), 0);
  const uniformDistance = keys.reduce((sum, key) => sum + Math.abs(Number(key) - 2.5), 0) / 6;
  return Math.abs(weighted - answer.score) <= 0.001 && Math.abs(Math.max(0, 1 - distance / uniformDistance) - answer.confidence) <= 0.02;
}

function thresholds(overrides) {
  if (overrides === undefined) return PILOT_THRESHOLDS;
  if (!object(overrides) || Object.keys(overrides).some((key) => !Object.hasOwn(PILOT_THRESHOLDS, key))) return null;
  const combined = { ...PILOT_THRESHOLDS, ...overrides };
  if (Object.entries(combined).some(([key, value]) => !Number.isFinite(value) || value < 0 || value > (key === 'clarity' ? 5 : 1))) return null;
  if (combined.supported < 0.95 || combined.confidence < 0.8 || combined.clarity < 4 || combined.duplicate > 0.1 ||
      combined.duplicatePositive < 0.9 || combined.duplicateNegative > 0.1) return null;
  return combined;
}

/** Validates one frozen batch. The runner must separately prove all six batches / 37 units / 16 groups passed. */
export function validatePilotTypeSafe(request, response, options = {}) {
  try {
    const limits = object(options) && Object.keys(options).every((key) => key === 'thresholds') ? thresholds(options.thresholds) : null;
    if (!limits || !exact(request, ['state', 'model', 'questions']) || request.model !== 'jev-1.13.0' ||
        !object(request.state) || !HASH.test(request.state.articleSha256 ?? '') || !object(request.questions) ||
        bytes(JSON.stringify(request)) > 25000 || !ids(Object.keys(request.questions), 64) || !Array.isArray(request.state.groups)) return hold('PILOT_REQUEST_INVALID');
    const questionIds = Object.keys(request.questions);
    if (Object.values(request.questions).some((question) => !exact(question, ['type', 'instructions', 'criteria']) ||
        !text(question.instructions, 4000) || bytes(JSON.stringify({ state: request.state, question })) > 28000)) return hold('PILOT_REQUEST_INVALID');
    const groups = request.state.groups;
    const controls = groups.length === 0;
    if (controls) {
      if (!exact(request.questions, Object.keys(CONTROL_TYPES)) || questionIds.some((id) => request.questions[id].type !== CONTROL_TYPES[id]) ||
          !text(request.state.exactArticleMarkdown, 20000) || hash(request.state.exactArticleMarkdown) !== request.state.articleSha256 ||
          !exact(request.state.controls, ['support', 'contradiction', 'insufficient', 'duplicatePositive', 'duplicateNegative'])) return hold('PILOT_REQUEST_COVERAGE');
    } else {
      const groupIds = groups.map((group) => group?.id);
      const unitIds = groups.flatMap((group) => Array.isArray(group?.publicWording) ? group.publicWording.map((unit) => unit?.id) : []);
      if (!sameIds(questionIds, groupIds) || !ids(unitIds) || groups.some((group) => !Array.isArray(group.publicWording) ||
          group.publicWording.length === 0 || group.publicWording.some((unit) => !text(unit?.wording, 20000))) ||
          questionIds.some((id) => request.questions[id].type !== 'choice')) return hold('PILOT_REQUEST_COVERAGE');
    }
    if (!exact(response, ['data', 'usage']) || !usage(response.usage, 65536, 0, true)) return hold('PILOT_USAGE_INVALID');
    if (!exact(response.data, ['model', 'answers']) || response.data.model !== request.model || !exact(response.data.answers, questionIds)) return hold('PILOT_TYPESAFE_SCHEMA');
    const answers = response.data.answers;
    if (questionIds.some((id) => !typedAnswer(request.questions[id], answers[id]))) return hold('PILOT_TYPESAFE_SCHEMA');
    const sourceIds = controls ? ['control_support', 'control_contradiction', 'control_insufficient'] : questionIds;
    for (const id of sourceIds) {
      const label = controls && id === 'control_contradiction' ? 'contradicted' : controls && id === 'control_insufficient' ? 'insufficient' : 'supported';
      const answer = answers[id];
      if (answer.choice !== label || answer.probabilities[label] < limits.supported || answer.confidence < limits.confidence) return hold(controls ? 'PILOT_CONTROL_FAILED' : 'PILOT_SOURCE_UNSUPPORTED');
    }
    if (controls && (answers.duplicate_control_positive.noul < limits.duplicatePositive || answers.duplicate_control_negative.noul > limits.duplicateNegative)) return hold('PILOT_CONTROL_FAILED');
    if (controls && answers.clarity.score < limits.clarity) return hold('PILOT_CLARITY_HELD');
    if (controls && answers.actual_duplicate.noul > limits.duplicate) return hold('PILOT_DUPLICATE_HELD');
    return pass('PILOT_TYPESAFE_BATCH_VALIDATED');
  } catch { return hold('PILOT_REQUEST_OR_TYPESAFE_INVALID'); }
}
