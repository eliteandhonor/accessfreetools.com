import { test } from 'vitest';
import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { assessProjectLicense, validateArticle, articlePublicText, articleHash, semanticRequest,
  semanticReviewFromResponses, validateSemanticReview } from './daily-editorial-checks.mjs';
import { typesafeEvaluate } from './daily-editorial-providers.mjs';

const COMMIT = 'a'.repeat(40);
const NOW = new Date('2026-10-08T12:00:00.000Z');
const DATE = '2026-10-08T10:00:00.000Z';
const MIT = `MIT License

Copyright (c) 2026 Example Authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.`;
const SOURCE_TEXT = `Table Helper converts plain text rows into Markdown tables for README authors.

Paste two text rows into the input and choose Convert to create a Markdown table.

For example, input a row with Item and Count, then a row with Apples and 3.

The tool does not validate table data and does not save the source input.`;
const digest = (text) => createHash('sha256').update(text).digest('hex');
function source(id, kind, text, url = `https://raw.githubusercontent.com/example/table-helper/${COMMIT}/README.md`) {
  return { id, kind, url, fetchedAt: DATE, text, sha256: digest(text) };
}
function fixture() {
  const paragraphs = SOURCE_TEXT.split('\n\n');
  const authored = [
    'If you write README files, Table Helper can turn rows of text into a Markdown table.',
    'Add your two text rows in the input box, then select Convert for the table output.',
    'A small example uses two columns, Item and Count, with an Apples row holding a count of 3.',
    'Table Helper leaves data validation to you and keeps no saved copy of the input.',
  ];
  return {
    schemaVersion: 1, slug: 'table-helper-readme-tables', title: 'Make README tables with Table Helper',
    summary: 'Table Helper converts text rows into Markdown tables.', problem: 'README authors can use Table Helper to turn plain rows into Markdown tables.',
    project: { fullName: 'example/table-helper', url: 'https://github.com/example/table-helper', commit: COMMIT, license: 'MIT', release: null },
    researchedAt: DATE,
    sections: ['Who it helps', 'How to use it', 'A practical example', 'Limits to check'].map((heading, index) => ({
      heading, paragraphs: [{ text: authored[index], sourceIds: ['readme'], evidence: [{ sourceId: 'readme', quote: paragraphs[index] }] }],
    })),
    sources: [source('readme', 'readme', SOURCE_TEXT), source('docs', 'docs', SOURCE_TEXT),
      source('license', 'license', MIT, `https://raw.githubusercontent.com/example/table-helper/${COMMIT}/LICENSE`),
      source('metadata', 'metadata', JSON.stringify({ full_name: 'example/table-helper', commit: COMMIT, license: { spdx_id: 'MIT' } }), 'https://api.github.com/repos/example/table-helper'),
      source('release', 'release', JSON.stringify({ status: 404, checkedAt: DATE, message: 'No published GitHub release was returned by latest-release endpoint.' }), 'https://api.github.com/repos/example/table-helper/releases/latest')],
  };
}
const evaluate = (article, catalog = []) => validateArticle(article, { catalog, now: NOW });
function mockResponses(request) {
  return request.batches.map((batch) => ({ data: { model: 'jev-1.13.0', answers: Object.fromEntries(Object.entries(batch.questions).map(([id, question]) => {
    if (question.type === 'choice') return [id, { type: 'choice', choice: 'supported', probabilities: { supported: 0.98, contradicted: 0.01, insufficient: 0.01 }, confidence: 0.97 }];
    if (question.type === 'score') return [id, { type: 'score', score: 4.5, confidence: 2 / 3, probabilities: { 0: 0, 1: 0, 2: 0, 3: 0, 4: 0.5, 5: 0.5 }, legend: Object.fromEntries(question.criteria.map((text, index) => [index, text])) }];
    return [id, { type: 'noul', noul: 0.01 }];
  })) } }));
}

test('a practical article has intact pinned evidence, actual metadata SPDX, and an explicitly checked absent release', () => {
  const result = evaluate(fixture());
  assert.equal(result.passed, true, result.issues.join('\n'));
  assert.equal(result.warnings.length, 1, 'word targets remain advice, never filler requirements');
});

test('license decision checks a complete MIT grant and disclaimer, not a label or brief paraphrase', () => {
  assert.equal(assessProjectLicense({ spdxId: 'MIT', text: MIT }).passed, true);
  assert.equal(assessProjectLicense({ spdxId: 'MIT', text: 'MIT License. Free to use.' }).passed, false);
  assert.equal(assessProjectLicense({ spdxId: 'NOASSERTION', text: MIT }).passed, false);
  assert.equal(assessProjectLicense({ spdxId: 'BSL-1.1', text: MIT }).passed, false);
  assert.equal(assessProjectLicense({ spdxId: 'Apache-2.0', text: MIT }).passed, false);
});

test('a recognized-looking license with extra restrictions, missing clauses, or replaced grant is held', () => {
  for (const text of [`${MIT}\nNo commercial use allowed.`, `${MIT}\nAdditional condition: send us a fee.`, MIT.replace('and/or sell', 'but never sell'), MIT.slice(0, MIT.indexOf('THE SOFTWARE')),
    MIT.replace('Example Authors', 'Example Authors. Non-commercial only.')]) {
    assert.equal(assessProjectLicense({ spdxId: 'MIT', text }).passed, false);
  }
});

test('copyright-line conditions are retained and hold both license and article gates', () => {
  const conditions = [
    '. You must send us a fee before use.',
    '; redistribution requires payment.',
    ', use only after registering with us.',
    '. This permission expires after thirty days.',
    ' users must register before use',
    ' commercial derivatives require separate permission',
  ];
  for (const added of conditions) {
    const text = MIT.replace('Example Authors', 'Example Authors' + added);
    assert.equal(assessProjectLicense({ spdxId: 'MIT', text }).passed, false, added);
    const article = fixture(); article.sources[2].text = text; article.sources[2].sha256 = digest(text);
    assert.equal(evaluate(article).passed, false, added);
  }
  const reviewerNotice = 'Copyright (c) 2026 Offline Fixtures. Additional license condition: every user must pay a fee before use.';
  const exactReviewCase = MIT.replace(/^Copyright[^\n]*$/m, reviewerNotice);
  assert.ok(exactReviewCase.includes(reviewerNotice), 'replace the whole notice so a changed fixture owner cannot turn the repro into a no-op');
  assert.equal(assessProjectLicense({ spdxId: 'MIT', text: exactReviewCase }).passed, false);
  const article = fixture(); article.sources[2].text = exactReviewCase; article.sources[2].sha256 = digest(exactReviewCase);
  assert.equal(evaluate(article).passed, false);
  assert.equal(assessProjectLicense({ spdxId: 'MIT', text: MIT.replace('Example Authors', 'Ambiguous Freeform Copyright Owner') }).passed, false);
});

test('complete ISC and BSD templates are recognized without accepting restrictive title add-ons', () => {
  const isc = `ISC License
Copyright (c) 2026 Example Authors
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.
THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.`;
  const bsdHead = `Copyright (c) 2026 Example Authors
All rights reserved.
Redistribution and use in source and binary forms, with or without
modification, are permitted provided that the following conditions are met:
1. Redistributions of source code must retain the above copyright notice, this
list of conditions and the following disclaimer.
2. Redistributions in binary form must reproduce the above copyright notice,
this list of conditions and the following disclaimer in the documentation
and/or other materials provided with the distribution.`;
  const bsdThird = `3. Neither the name of Example Authors nor the names of its
contributors may be used to endorse or promote products derived from
this software without specific prior written permission.`;
  const bsdTail = `THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE
LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
POSSIBILITY OF SUCH DAMAGE.`;
  const bsd2 = `BSD 2-Clause "Simplified" License\n${bsdHead}\n${bsdTail}`;
  const bsd3 = `BSD 3-Clause "New" or "Revised" License\n${bsdHead}\n${bsdThird}\n${bsdTail}`;
  for (const [spdxId, text] of [['ISC', isc], ['BSD-2-Clause', bsd2], ['BSD-3-Clause', bsd3]]) {
    assert.equal(assessProjectLicense({ spdxId, text }).passed, true, spdxId);
    assert.equal(assessProjectLicense({ spdxId, text: text + '\nPay a fee before using this software.' }).passed, false);
  }
  for (const holder of ['Example Authors (redistribution requires payment)', 'Example Authors. Users must pay a fee. The holder',
    'Example Authors and users must register before use', 'UnverifiedOwner']) {
    assert.equal(assessProjectLicense({ spdxId: 'BSD-3-Clause', text: bsd3.replace('Neither the name of Example Authors', `Neither the name of ${holder}`) }).passed, false, holder);
  }
  assert.equal(assessProjectLicense({ spdxId: 'BSD-2-Clause', text: bsd2.replace('"Simplified" License', '(restricted to researchers)') }).passed, false);
});

test('complete standard Apache 2.0 text is recognized and appended/altered terms are held', () => {
  // The host ships this standard license. If another platform lacks it, use the
  // MIT fixture tests; production recognition never depends on this host file.
  let apache;
  try { apache = readFileSync('/usr/share/common-licenses/Apache-2.0', 'utf8'); } catch { return; }
  assert.equal(assessProjectLicense({ spdxId: 'Apache-2.0', text: apache }).passed, true);
  assert.equal(assessProjectLicense({ spdxId: 'Apache-2.0', text: `${apache}\nNo use by competitors.` }).passed, false);
  assert.equal(assessProjectLicense({ spdxId: 'Apache-2.0', text: apache.replace('perpetual', 'temporary') }).passed, false);
  for (const notice of ['Copyright 2026 Example Authors. You must send us a fee before use.',
    'Copyright 2026 Example Authors; redistribution requires payment.', 'Copyright 2026 Example Authors users must register before use',
    'Copyright [yyyy] [name of copyright owner] every user must obtain separate permission']) {
    assert.equal(assessProjectLicense({ spdxId: 'Apache-2.0', text: apache.replace('Copyright [yyyy] [name of copyright owner]', notice) }).passed, false, notice);
  }
});

test('authored fields reject HTML, code, URLs, and unknown schema fields', () => {
  for (const title of ['<script>publish()</script>', '`npm install unknown`', 'Visit https://evil.example/', '[Copy](https://evil.example/)']) {
    const article = fixture(); article.title = title;
    assert.equal(evaluate(article).passed, false);
  }
  const article = fixture(); article.publishNow = true;
  assert.equal(evaluate(article).passed, false);
  const malformed = fixture(); malformed.project.url = 4;
  assert.equal(evaluate(malformed).passed, false);
});

test('source text drift, exact quote drift, missing evidence, and extra mapped IDs all hold', () => {
  const drift = fixture(); drift.sources[0].text += '\nChanged after checking.';
  assert.match(evaluate(drift).issues.join(' '), /hash/);
  const quote = fixture(); quote.sections[0].paragraphs[0].evidence[0].quote = 'This does not appear in the actual source.';
  assert.match(evaluate(quote).issues.join(' '), /altered/);
  const missing = fixture(); missing.sections[0].paragraphs[0].evidence = [];
  assert.equal(evaluate(missing).passed, false);
  const extra = fixture(); extra.sections[0].paragraphs[0].sourceIds.push('docs');
  assert.match(evaluate(extra).issues.join(' '), /without exact supporting evidence/);
  const missingSource = fixture(); missingSource.sources = missingSource.sources.filter(({ kind }) => kind !== 'license');
  assert.equal(evaluate(missingSource).passed, false);
});

test('source authorities, repo path, immutable commit, dates, and metadata license cannot drift', () => {
  for (const url of ['https://github.com.evil.example/example/table-helper/blob/'+COMMIT+'/README.md',
    'https://raw.githubusercontent.com/other/project/'+COMMIT+'/README.md',
    'https://raw.githubusercontent.com/example/table-helper/main/README.md',
    'https://user:secret@raw.githubusercontent.com/example/table-helper/'+COMMIT+'/README.md']) {
    const article = fixture(); article.sources[0].url = url;
    assert.equal(evaluate(article).passed, false);
  }
  const metadata = fixture(); metadata.sources[3].text = JSON.stringify({ full_name: 'example/table-helper', commit: COMMIT, license: { spdx_id: 'NOASSERTION' } }); metadata.sources[3].sha256 = digest(metadata.sources[3].text);
  assert.equal(evaluate(metadata).passed, false);
  const future = fixture(); future.researchedAt = '2026-10-09T10:00:00.000Z';
  assert.equal(evaluate(future).passed, false);
  const invalid = fixture(); invalid.researchedAt = '2026-02-30T10:00:00.000Z';
  assert.equal(evaluate(invalid).passed, false);
});

test('release dates and absence require the actual checked release source', () => {
  const article = fixture(); article.project.release = { tag: 'v2.0.0', publishedAt: '2026-10-07T10:00:00Z' };
  assert.equal(evaluate(article).passed, false);
  article.sources[4].text = JSON.stringify({ tag_name: 'v2.0.0', published_at: '2026-10-07T10:00:00Z', body: 'Adds table conversion.' }); article.sources[4].sha256 = digest(article.sources[4].text);
  assert.equal(evaluate(article).passed, true);
  article.sources[4].text = JSON.stringify({ tag_name: 'v1.0.0', published_at: '2026-10-07T10:00:00Z', body: 'Adds table conversion.' }); article.sources[4].sha256 = digest(article.sources[4].text);
  assert.equal(evaluate(article).passed, false);
});

test('practical scope, original paragraphs, owner experience, writing hype, and certification checks hold weak copy', () => {
  for (const replacement of ['We installed Table Helper and tested it.', 'Brendan used Table Helper for his own README.', 'This tool is security certified.', 'This revolutionary tool is guaranteed to work.', 'Table Helper is the #1 table converter.']) {
    const article = fixture(); article.sections[0].paragraphs[0].text = replacement;
    assert.equal(evaluate(article).passed, false, replacement);
  }
  const repeated = fixture(); repeated.sections[1].paragraphs[0] = structuredClone(repeated.sections[0].paragraphs[0]);
  assert.match(evaluate(repeated).issues.join(' '), /repeats a paragraph/);
  const missing = fixture(); missing.sections[3].heading = 'More details';
  assert.match(evaluate(missing).issues.join(' '), /limits/);
});

test('all historical entries are checked for project, slug, normalized title, and substantial shingle duplication', () => {
  const article = fixture();
  for (const entry of [{ slug: article.slug, title: 'Unrelated title' }, { slug: 'old', title: 'Another title', project: { fullName: 'Example/Table-Helper' } },
    { slug: 'old', title: 'Make README tables WITH Table Helper!' }, { slug: 'old', title: 'Different title', summary: articlePublicText(article) }]) {
    assert.equal(evaluate(article, [entry]).passed, false);
  }
  const catalog = Array.from({ length: 604 }, (_, index) => ({ slug: `old-${index}`, title: `Different old subject ${index}`, summary: 'An unrelated calculator.' }));
  catalog[603].slug = article.slug;
  assert.equal(evaluate(article, catalog).passed, false, 'the last entry cannot evade dedup');
});

test('hash binds evidence and public copy, while JSON key ordering does not change it', () => {
  const article = fixture(); const reordered = Object.fromEntries(Object.entries(article).reverse());
  assert.equal(articleHash(article), articleHash(reordered));
  const changed = fixture(); changed.sources[0].fetchedAt = '2026-10-08T09:00:00.000Z';
  assert.notEqual(articleHash(article), articleHash(changed));
  changed.sources[0].fetchedAt = DATE; changed.title += ' now';
  assert.notEqual(articleHash(article), articleHash(changed));
});

test('originality holds long source copying and mostly pasted prose but permits short shared technical phrases', () => {
  const pasted = fixture();
  pasted.sections.forEach((section, index) => { section.paragraphs[0].text = SOURCE_TEXT.split('\n\n')[index]; });
  assert.match(evaluate(pasted).issues.join(' '), /source (?:wording|prose)/);
  const long = fixture();
  const copied = 'A reader first opens the input panel and chooses a file from the local computer before selecting the table export option and checking every value in the resulting output for mistakes.';
  long.sources[0].text += '\n\n' + copied; long.sources[0].sha256 = digest(long.sources[0].text);
  long.sections[0].paragraphs[0].text = copied;
  assert.match(evaluate(long).issues.join(' '), /30 or more consecutive/);
  assert.equal(evaluate(fixture()).passed, true);
});

test('semantic requests cover title, summary, problem, every heading and paragraph with complete source context', () => {
  const article = fixture(); const request = semanticRequest(article);
  assert.equal(request.passed, true, request.issues.join('\n'));
  assert.equal(request.claims.length, 11);
  assert.deepEqual(request.claims.slice(0, 3).map(({ id }) => id), ['title', 'summary', 'problem']);
  assert.ok(request.claims.every(({ context }) => context && /\.$/.test(context)));
  assert.ok(request.batches.every((batch) => Buffer.byteLength(JSON.stringify(batch)) <= 25000));
  const review = semanticReviewFromResponses(request, mockResponses(request));
  assert.equal(validateSemanticReview(review, request).passed, true);
  assert.equal(review.clarity, 0.9);
});

test('partial quote selection retains full nearby negation instead of a 160-character evidence slice', () => {
  const article = fixture();
  const text = `Do not assume that ${'the table helper '.repeat(24)}validates data. The tool does not validate table data and does not save the source input.`;
  article.sources[0].text = text; article.sources[0].sha256 = digest(text);
  article.sections = article.sections.map((section) => ({ ...section, paragraphs: [{ ...section.paragraphs[0], evidence: [{ sourceId: 'readme', quote: 'validates data' }] }] }));
  const request = semanticRequest(article);
  assert.equal(request.passed, true);
  assert.ok(request.claims.every(({ context }) => context.includes('Do not assume that') && context.includes('does not validate')));
});

test('every TypeSafe claim retains adjacent and distant contradictory source paragraphs or holds the complete source', () => {
  const article = fixture();
  const contradiction = 'Important: this no-account workflow is disabled in released builds. A web account is required for normal use.';
  article.sources[0].text = SOURCE_TEXT.replace('\n\n', `\n\n${contradiction}\n\n`);
  article.sources[0].sha256 = digest(article.sources[0].text);
  const request = semanticRequest(article);
  assert.equal(request.passed, true);
  assert.ok(request.claims.every(({ context }) => context.includes(contradiction)));
  assert.ok(request.claims.every(({ context }) => context.includes(article.sources[0].text)));
  article.sources[0].text += `\n\n${'Other details. '.repeat(4000)}\n\n${contradiction}`;
  article.sources[0].sha256 = digest(article.sources[0].text);
  const oversized = semanticRequest(article);
  assert.equal(oversized.passed, false);
  assert.ok(oversized.issues.some((issue) => /unassessed/.test(issue)));
});

test('ambiguous, incomplete, and oversized source contexts are unassessed and hold', () => {
  for (const text of [SOURCE_TEXT + '\n\n' + SOURCE_TEXT.split('\n\n')[0], SOURCE_TEXT.split('\n\n')[0].slice(0, -1), 'x'.repeat(24000) + ' ' + SOURCE_TEXT.split('\n\n')[0]]) {
    const article = fixture(); article.sources[0].text = text; article.sources[0].sha256 = digest(text);
    article.sections[0].paragraphs[0].evidence[0].quote = text.includes('x'.repeat(20)) ? SOURCE_TEXT.split('\n\n')[0] : 'Table Helper converts plain text rows';
    assert.equal(semanticRequest(article).passed, false);
  }
});

test('synthetic complete source above 4 KB is retained once per bounded batch', () => {
  const text = SOURCE_TEXT + '\n\n' + 'Synthetic complete source documentation.\n'.repeat(280);
  assert.ok(Buffer.byteLength(text) > 4000);
  const article = fixture();
  const quote = 'Table Helper converts plain text rows';
  for (const id of ['readme', 'docs']) {
    const document = article.sources.find((item) => item.id === id);
    document.text = text; document.sha256 = digest(text);
  }
  article.sections = article.sections.map((section) => ({ ...section, paragraphs: [{ ...section.paragraphs[0],
    sourceIds: ['readme', 'docs'], evidence: ['readme', 'docs'].map((sourceId) => ({ sourceId, quote })) }] }));
  const request = semanticRequest(article);
  assert.equal(request.passed, true, request.issues.join('\n'));
  assert.ok(request.claims.every((claim) => claim.context.includes(text)));
  for (const batch of request.batches.filter((item) => item.claimIds.length)) {
    assert.equal(batch.state.sources.length, 1);
    assert.equal(batch.state.sources[0].text, text);
    assert.deepEqual(batch.state.sources[0].ids, ['readme', 'docs']);
    assert.ok(Buffer.byteLength(JSON.stringify(batch)) <= 25000);
  }
  assert.ok(request.batches.length <= 8);
  const result = semanticReviewFromResponses(request, mockResponses(request));
  assert.equal(validateSemanticReview(result, request).passed, true);
});

test('large complete source keeps a distant contradiction and batches without duplicated evidence', () => {
  const article = fixture();
  const contradiction = 'Important: an account is required in released builds.';
  const text = SOURCE_TEXT + '\n\n' + 'Other complete source documentation. '.repeat(340) + '\n\n' + contradiction;
  article.sources[0].text = text; article.sources[0].sha256 = digest(text);
  const request = semanticRequest(article);
  assert.ok(Buffer.byteLength(text) > 12000);
  assert.equal(request.passed, true, request.issues.join('\n'));
  assert.ok(request.claims.every((claim) => claim.context.includes(contradiction)));
  assert.ok(request.batches.filter((batch) => batch.claimIds.length).every((batch) => batch.state.sources[0].text === text));
  article.sources[0].sha256 = '0'.repeat(64);
  assert.equal(semanticRequest(article).passed, false, 'source drift is not accepted by the semantic builder');
  assert.equal(semanticRequest(fixture(), [], { maxCallBytes: 56000 }).passed, false);
});

test('semantic duplicate assessment selects max12 nearest intact summaries and records its coverage limit', () => {
  const catalog = Array.from({ length: 604 }, (_, index) => ({ slug: `old-${index}`, title: `Old calculator ${index}`, summary: 'Unrelated arithmetic help.' }));
  catalog[603] = { slug: 'closest', title: 'README tables using a helper', summary: 'Convert text rows to Markdown tables.' };
  const request = semanticRequest(fixture(), catalog);
  assert.equal(request.passed, true);
  assert.equal(request.duplicate.contexts.length, 12);
  assert.equal(request.duplicate.contexts[0].slug, 'closest');
  assert.equal(request.duplicate.totalCatalogEntries, 604);
  assert.equal(request.batches.filter(({ questions }) => Object.keys(questions).some((id) => id.startsWith('duplicate_'))).length, 1);
});

test('missing, duplicate, unassessed, low-confidence, stale, or contradicted semantic results hold', () => {
  const request = semanticRequest(fixture()); const valid = semanticReviewFromResponses(request, mockResponses(request));
  for (const mutate of [
    (review) => { review.claims.pop(); },
    (review) => { review.claims.push(review.claims[0]); },
    (review) => { review.claims[0].status = 'unassessed'; },
    (review) => { review.claims[0].status = 'contradicted'; },
    (review) => { review.claims[0].supported = 0.94; },
    (review) => { review.claims[0].confidence = 0.79; },
    (review) => { review.articleSha256 = '0'.repeat(64); },
    (review) => { review.clarity = 0.79; },
    (review) => { review.duplicate = 0.11; },
    (review) => { review.duplicate = Number.NaN; },
  ]) {
    const changed = structuredClone(valid); mutate(changed);
    assert.equal(validateSemanticReview(changed, request).passed, false);
  }
  assert.throws(() => semanticReviewFromResponses(request, mockResponses(request).slice(1)), /incomplete/);
  const responses = mockResponses(request); delete responses[0].data.answers.claim_0;
  assert.throws(() => semanticReviewFromResponses(request, responses), /incomplete/);
});

test('generated batches pass the provider question and bounded-input contract using only fake responses', async () => {
  const request = semanticRequest(fixture());
  const responses = mockResponses(request);
  for (const [index, batch] of request.batches.entries()) {
    let calls = 0;
    const result = await typesafeEvaluate(batch.state, batch.questions, { key: 'offline-fixture-key', fetchImpl: async () => {
      calls += 1;
      return new Response(JSON.stringify({ ...responses[index].data, usage: { input_tokens: 1000, output_tokens: 0 } }), { status: 200, headers: { 'content-type': 'application/json' } });
    } });
    assert.equal(calls, 1);
    assert.equal(result.data.model, 'jev-1.13.0');
  }
});
