import { createHash } from 'node:crypto';
import { describe, it, expect } from 'vitest';
import { PILOT_THRESHOLDS, validatePilotOllamaReview, validatePilotWriting, validatePilotTypeSafe } from './daily-editorial-pilot-reviews.mjs';

// Entirely synthetic input. Real draft/evidence and raw paid responses stay private.
const markdown = '# Move a file\n\nChoose the receiving device and verify the received copy.\n';
const articleSha256 = createHash('sha256').update(markdown).digest('hex');
const clone = (value) => structuredClone(value);
const expected = { articleSha256, groupIds: ['workflow'], publicUnitIds: ['title', 'step'] };
const units = [{ id: 'title', text: 'Move a file' }, { id: 'step', text: 'Verify the received copy.' }];
const user = { articleSha256, exactArticleMarkdown: markdown, publicUnits: units,
  assignedGroups: [{ id: 'workflow', units: ['title', 'step'], evidence: ['source'], kind: 'source' }] };
const ollama = (input = user, num_predict = 1000) => ({ model: 'gpt-oss:120b', stream: false,
  messages: [{ role: 'system', content: 'Review synthetic data. Return JSON only.' }, { role: 'user', content: JSON.stringify(input) }],
  options: { temperature: 0.2, num_predict } });
const review = () => ({ data: { articleSha256, assignedGroupIds: ['workflow'], coveredPublicUnitIds: ['title', 'step'],
  practical: true, noInventedTesting: true, clear: true, issues: [] }, usage: { inputTokens: 300, outputTokens: 100 } });
const writingRequest = () => ollama({ basisArticleSha256: articleSha256, exactArticleMarkdown: markdown, publicUnits: units }, 3000);
const writing = () => ({ data: { basisArticleSha256: articleSha256, proposedMarkdown: '# Move a file\n\nCheck the received copy.\n',
  changes: [{ publicUnitIds: ['step'], reason: 'Use a shorter sentence.' }], unresolvedIssues: [] }, usage: { inputTokens: 300, outputTokens: 100 } });
const choiceQuestion = () => ({ type: 'choice', instructions: 'Assess every exact public statement against supplied synthetic evidence.',
  criteria: { supported: 'The evidence supports every implication.', contradicted: 'The evidence conflicts.', insufficient: 'Evidence is missing.' } });
const choice = (label = 'supported', p = 0.96) => ({ type: 'choice', choice: label,
  probabilities: Object.fromEntries(['supported', 'contradicted', 'insufficient'].map((key) => [key, key === label ? p : (1 - p) / 2])),
  confidence: (p - 1 / 3) / (1 - 1 / 3) });
const sourceRequest = () => ({ model: 'jev-1.13.0', state: { articleSha256, groups: [{ id: 'workflow',
  publicWording: [{ id: 'title', wording: 'Move a file' }, { id: 'step', wording: 'Verify the received copy.' }] }] },
  questions: { workflow: choiceQuestion() } });
const sourceResponse = () => ({ data: { model: 'jev-1.13.0', answers: { workflow: choice() } }, usage: { inputTokens: 300, outputTokens: 30 } });
const noulQuestion = () => ({ type: 'noul', instructions: 'Does the supplied text concern the same reader problem?', criteria: { true: 'Same problem.', false: 'Different problem.' } });
const controlsRequest = () => ({ model: 'jev-1.13.0', state: { articleSha256, exactArticleMarkdown: markdown, groups: [],
  controls: { support: { wording: 'Evidence supports this.' }, contradiction: { wording: 'Evidence contradicts this.' }, insufficient: { wording: 'No evidence for this.' },
    duplicatePositive: { previousSummary: 'Same reader problem.' }, duplicateNegative: { previousSummary: 'Different reader problem.' } } },
  questions: { clarity: { type: 'score', instructions: 'Assess practical clarity.', criteria: ['Unclear.', 'Poor.', 'Incomplete.', 'Needs work.', 'Clear.', 'Very clear.'] },
    actual_duplicate: noulQuestion(), control_support: choiceQuestion(), control_contradiction: choiceQuestion(), control_insufficient: choiceQuestion(),
    duplicate_control_positive: noulQuestion(), duplicate_control_negative: noulQuestion() } });
const controlsResponse = () => ({ data: { model: 'jev-1.13.0', answers: {
  clarity: { type: 'score', score: 4, legend: { 0: 'Unclear.', 1: 'Poor.', 2: 'Incomplete.', 3: 'Needs work.', 4: 'Clear.', 5: 'Very clear.' },
    probabilities: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 1, 5: 0 }, confidence: 1 },
  actual_duplicate: { type: 'noul', noul: 0.1 }, control_support: choice(), control_contradiction: choice('contradicted'), control_insufficient: choice('insufficient'),
  duplicate_control_positive: { type: 'noul', noul: 0.9 }, duplicate_control_negative: { type: 'noul', noul: 0.1 },
} }, usage: { inputTokens: 600, outputTokens: 60 } });

describe('exact pilot factual review', () => {
  it('admits complete assigned coverage independent of order', () => {
    const output = review(); output.data.coveredPublicUnitIds.reverse();
    expect(validatePilotOllamaReview(ollama(), output, expected)).toEqual({ passed: true, code: 'PILOT_REVIEW_VALIDATED' });
  });
  it.each([
    ['extra private field', (r) => { r.data.privateNotes = 'PRIVATE_UNAPPROVED_TEXT'; }, 'PILOT_REVIEW_SCHEMA'],
    ['wrong hash', (r) => { r.data.articleSha256 = 'b'.repeat(64); }, 'PILOT_REVIEW_HASH'],
    ['missing unit', (r) => { r.data.coveredPublicUnitIds.pop(); }, 'PILOT_REVIEW_COVERAGE'],
    ['duplicate unit', (r) => { r.data.coveredPublicUnitIds = ['title', 'title']; }, 'PILOT_REVIEW_COVERAGE'],
    ['unassigned group', (r) => { r.data.assignedGroupIds = ['unassigned']; }, 'PILOT_REVIEW_COVERAGE'],
    ['false flag', (r) => { r.data.noInventedTesting = false; }, 'PILOT_REVIEW_FLAGS'],
    ['truthy string', (r) => { r.data.clear = 'true'; }, 'PILOT_REVIEW_FLAGS'],
    ['private issues', (r) => { r.data.issues = [{ reason: 'PRIVATE_UNAPPROVED_TEXT' }]; }, 'PILOT_REVIEW_ISSUES'],
    ['over output cap', (r) => { r.usage.outputTokens = 1001; }, 'PILOT_USAGE_INVALID'],
    ['over input reservation', (r) => { r.usage.inputTokens = 131073; }, 'PILOT_USAGE_INVALID'],
    ['missing usage', (r) => { delete r.usage; }, 'PILOT_USAGE_INVALID'],
  ])('holds %s with a safe code', (_, mutate, code) => {
    const output = review(); mutate(output);
    expect(validatePilotOllamaReview(ollama(), output, expected)).toEqual({ passed: false, code });
  });
  it('holds mismatched request identity and manifest coverage', () => {
    const request = ollama(); const input = clone(user); input.exactArticleMarkdown += 'Changed.';
    request.messages[1].content = JSON.stringify(input);
    expect(validatePilotOllamaReview(request, review(), expected).passed).toBe(false);
    expect(validatePilotOllamaReview(ollama(), review(), { ...expected, publicUnitIds: ['title'] }).passed).toBe(false);
    expect(validatePilotOllamaReview(ollama(), review(), {}).passed).toBe(false);
  });
});

describe('separate writing proposal', () => {
  it('returns no proposal text, publication authority or mutation', () => {
    const output = writing(); const before = JSON.stringify(output);
    expect(validatePilotWriting(writingRequest(), output, { articleSha256 })).toEqual({ passed: true, code: 'PILOT_WRITING_PROPOSAL_VALIDATED' });
    expect(JSON.stringify(output)).toBe(before);
  });
  it.each([
    ['wrong basis', (r) => { r.data.basisArticleSha256 = 'b'.repeat(64); }, 'PILOT_WRITING_HASH'],
    ['extra field', (r) => { r.data.approvedForPublication = true; }, 'PILOT_WRITING_SCHEMA'],
    ['oversized UTF-8 proposal', (r) => { r.data.proposedMarkdown = '🙂'.repeat(5001); }, 'PILOT_WRITING_SCHEMA'],
    ['unknown changed unit', (r) => { r.data.changes[0].publicUnitIds = ['unknown']; }, 'PILOT_WRITING_SCHEMA'],
    ['duplicate changed unit', (r) => { r.data.changes[0].publicUnitIds = ['step', 'step']; }, 'PILOT_WRITING_SCHEMA'],
    ['unstructured reason', (r) => { r.data.changes[0].reason = { private: 'PRIVATE_UNAPPROVED_TEXT' }; }, 'PILOT_WRITING_SCHEMA'],
    ['unreported changes', (r) => { r.data.changes = []; }, 'PILOT_WRITING_CHANGE_COVERAGE'],
    ['unresolved evidence', (r) => { r.data.unresolvedIssues = [{ publicUnitIds: ['step'], reason: 'Missing evidence.', requiredEvidence: 'A complete source.' }]; }, 'PILOT_WRITING_UNRESOLVED'],
  ])('holds %s', (_, mutate, code) => {
    const output = writing(); mutate(output);
    expect(validatePilotWriting(writingRequest(), output, { articleSha256 })).toEqual({ passed: false, code });
  });
});

describe('typed source and controls', () => {
  it('admits complete source coverage and correctly separated controls', () => {
    expect(validatePilotTypeSafe(sourceRequest(), sourceResponse())).toEqual({ passed: true, code: 'PILOT_TYPESAFE_BATCH_VALIDATED' });
    expect(validatePilotTypeSafe(controlsRequest(), controlsResponse())).toEqual({ passed: true, code: 'PILOT_TYPESAFE_BATCH_VALIDATED' });
  });
  it.each([
    ['contradicted source', (r) => { r.data.answers.workflow = choice('contradicted'); }, 'PILOT_SOURCE_UNSUPPORTED'],
    ['insufficient source', (r) => { r.data.answers.workflow = choice('insufficient'); }, 'PILOT_SOURCE_UNSUPPORTED'],
    ['low supported probability', (r) => { r.data.answers.workflow = choice('supported', 0.94); }, 'PILOT_SOURCE_UNSUPPORTED'],
    ['bad distribution', (r) => { r.data.answers.workflow.probabilities.supported = 1; }, 'PILOT_TYPESAFE_SCHEMA'],
    ['wrong answer type', (r) => { r.data.answers.workflow = { type: 'noul', noul: 1 }; }, 'PILOT_TYPESAFE_SCHEMA'],
    ['extra answer', (r) => { r.data.answers.unasked = choice(); }, 'PILOT_TYPESAFE_SCHEMA'],
    ['missing answer', (r) => { delete r.data.answers.workflow; }, 'PILOT_TYPESAFE_SCHEMA'],
    ['extra private result', (r) => { r.data.privateNotes = 'PRIVATE_UNAPPROVED_TEXT'; }, 'PILOT_TYPESAFE_SCHEMA'],
    ['model drift', (r) => { r.data.model = 'jev-latest'; }, 'PILOT_TYPESAFE_SCHEMA'],
    ['unknown usage', (r) => { r.usage.inputTokens = NaN; }, 'PILOT_USAGE_INVALID'],
    ['over reservation', (r) => { r.usage.inputTokens = 65537; }, 'PILOT_USAGE_INVALID'],
  ])('holds %s', (_, mutate, code) => {
    const output = sourceResponse(); mutate(output);
    expect(validatePilotTypeSafe(sourceRequest(), output)).toEqual({ passed: false, code });
  });
  it.each([
    ['contradiction mislabel', (r) => { r.data.answers.control_contradiction = choice(); }, 'PILOT_CONTROL_FAILED'],
    ['insufficient mislabel', (r) => { r.data.answers.control_insufficient = choice(); }, 'PILOT_CONTROL_FAILED'],
    ['positive duplicate missed', (r) => { r.data.answers.duplicate_control_positive.noul = 0.89; }, 'PILOT_CONTROL_FAILED'],
    ['negative duplicate failed', (r) => { r.data.answers.duplicate_control_negative.noul = 0.11; }, 'PILOT_CONTROL_FAILED'],
    ['actual duplicate', (r) => { r.data.answers.actual_duplicate.noul = 0.11; }, 'PILOT_DUPLICATE_HELD'],
    ['low clarity', (r) => { r.data.answers.clarity = { ...r.data.answers.clarity, score: 3, probabilities: { 0: 0, 1: 0, 2: 0, 3: 1, 4: 0, 5: 0 } }; }, 'PILOT_CLARITY_HELD'],
    ['score/rubric mismatch', (r) => { r.data.answers.clarity.legend[4] = 'Invented rubric.'; }, 'PILOT_TYPESAFE_SCHEMA'],
    ['score/distribution mismatch', (r) => { r.data.answers.clarity.score = 5; }, 'PILOT_TYPESAFE_SCHEMA'],
    ['confidence mismatch', (r) => { r.data.answers.clarity.confidence = 0; }, 'PILOT_TYPESAFE_SCHEMA'],
    ['extra primitive field', (r) => { r.data.answers.actual_duplicate.privateNotes = 'PRIVATE_UNAPPROVED_TEXT'; }, 'PILOT_TYPESAFE_SCHEMA'],
  ])('holds %s', (_, mutate, code) => {
    const output = controlsResponse(); mutate(output);
    expect(validatePilotTypeSafe(controlsRequest(), output)).toEqual({ passed: false, code });
  });
  it('does not permit weaker thresholds or partial/duplicate request coverage', () => {
    expect(Object.isFrozen(PILOT_THRESHOLDS)).toBe(true);
    expect(validatePilotTypeSafe(sourceRequest(), sourceResponse(), { thresholds: { supported: 0.5 } }).passed).toBe(false);
    expect(validatePilotTypeSafe(sourceRequest(), sourceResponse(), { thresholds: { unknown: 0.99 } }).passed).toBe(false);
    expect(validatePilotTypeSafe(sourceRequest(), sourceResponse(), { thresholds: { supported: 0.99 } }).code).toBe('PILOT_SOURCE_UNSUPPORTED');
    const duplicate = sourceRequest(); duplicate.state.groups[0].publicWording[1].id = 'title';
    expect(validatePilotTypeSafe(duplicate, sourceResponse()).code).toBe('PILOT_REQUEST_COVERAGE');
    const partial = controlsRequest(); delete partial.questions.control_insufficient;
    expect(validatePilotTypeSafe(partial, controlsResponse()).code).toBe('PILOT_REQUEST_COVERAGE');
  });
  it('never exposes raw source, proposed output or model issue text in a failure result', () => {
    const output = review(); output.data.issues = [{ reason: 'PRIVATE_UNAPPROVED_TEXT', rawEvidence: 'PRIVATE_UNAPPROVED_TEXT' }];
    expect(JSON.stringify(validatePilotOllamaReview(ollama(), output, expected))).not.toContain('PRIVATE_UNAPPROVED_TEXT');
    const ts = sourceResponse(); ts.data.answers.workflow.private = 'PRIVATE_UNAPPROVED_TEXT';
    expect(JSON.stringify(validatePilotTypeSafe(sourceRequest(), ts))).not.toContain('PRIVATE_UNAPPROVED_TEXT');
  });
});
