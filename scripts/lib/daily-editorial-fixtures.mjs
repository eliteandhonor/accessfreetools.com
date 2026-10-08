// Entirely invented, offline-only project and prose. Never publish this fixture.
import { createHash } from 'node:crypto';
export const fixtureNow = new Date('2026-10-08T09:00:00.000Z');
export const fixtureName = 'offline-fixtures/task-notes';
export const fixtureCommit = 'a'.repeat(40);
export const fixtureLicense = `MIT License

Copyright (c) 2026 Offline Fixtures

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
export const fixtureReadme = `Task Notes is a desktop app for creating task notes in local files without a web account.

Open the app, choose a local folder, and create a note with a task title.

For example, create four notes to track four errands and keep the files in the chosen folder.

The app does not synchronize notes between computers. Back up the folder separately.`;
const hash = (text) => createHash('sha256').update(text).digest('hex');
const source = (id, kind, url, text) => ({ id, kind, url, text, sha256: hash(text), fetchedAt: fixtureNow.toISOString() });
const paragraph = (text, quote) => ({ text, sourceIds: ['readme'], evidence: [{ sourceId: 'readme', quote }] });

export function fixtureArticle() {
  const url = `https://github.com/${fixtureName}/blob/${fixtureCommit}`;
  return {
    schemaVersion: 1, slug: 'keep-task-notes-in-local-files', title: 'Keep small task notes in local files',
    summary: 'Task Notes stores simple task notes as local files. Check its documented workflow and limits before choosing it.',
    problem: 'Keep a short task list in local files without opening a web account.',
    project: { fullName: fixtureName, url: `https://github.com/${fixtureName}`, commit: fixtureCommit, license: 'MIT', release: { tag: 'v1.0.0', publishedAt: '2026-10-01T00:00:00Z' } },
    researchedAt: fixtureNow.toISOString(),
    sources: [source('readme', 'readme', `${url}/README.md`, fixtureReadme), source('license', 'license', `${url}/LICENSE`, fixtureLicense), source('docs', 'docs', `${url}/README.md`, fixtureReadme), source('metadata', 'metadata', `https://api.github.com/repos/${fixtureName}`, JSON.stringify({ full_name: fixtureName, commit: fixtureCommit, license: { spdx_id: 'MIT' } })), source('release', 'release', `https://github.com/${fixtureName}/releases/tag/v1.0.0`, JSON.stringify({ tag_name: 'v1.0.0', published_at: '2026-10-01T00:00:00Z', body: 'Initial documented release.' }))],
    sections: [
      { heading: 'Quick answer', paragraphs: [paragraph('Task Notes keeps task notes in local files, so it offers a desktop workflow without a web account.', fixtureReadme.split('\n')[0])] },
      { heading: 'Who it helps', paragraphs: [paragraph('If you want a short task list stored on your computer, this documented approach may fit that job.', fixtureReadme.split('\n')[0])] },
      { heading: 'How to use it', paragraphs: [paragraph('The documented steps are to open the app, choose a folder and create a note with the task title.', fixtureReadme.split('\n')[2])] },
      { heading: 'A hypothetical example', paragraphs: [paragraph('As a hypothetical example, four errands can become four notes in the folder you chose. This describes the project example; it is not a result from running the app here.', fixtureReadme.split('\n')[4])] },
      { heading: 'Limits to check', paragraphs: [paragraph('The documentation says notes do not synchronize between computers. Keep a separate backup of the folder if you need a recovery copy.', fixtureReadme.split('\n')[6])] },
    ],
  };
}

export function fixtureProviders({ timeout = false, contradict = false } = {}) {
  let writes = 0;
  const calls = { github: 0, jina: 0, ollama: 0, typesafe: 0 };
  const article = fixtureArticle();
  const encode = (text, path) => ({ encoding: 'base64', content: Buffer.from(text).toString('base64'), path });
  return { calls, fixture: true,
    async github(path) {
      calls.github++;
      let data;
      if (path.startsWith('/search/')) data = { items: [{ full_name: fixtureName }] };
      else if (path.includes('/commits/')) data = { sha: fixtureCommit, commit: { committer: { date: fixtureNow.toISOString() } } };
      else if (path.includes('/readme?')) data = encode(fixtureReadme, 'README.md');
      else if (path.includes('/license?')) data = { ...encode(fixtureLicense, 'LICENSE'), license: { spdx_id: 'MIT' } };
      else if (path.endsWith('/releases/latest')) data = { tag_name: 'v1.0.0', published_at: '2026-10-01T00:00:00Z', body: 'Initial documented release.', html_url: `https://github.com/${fixtureName}/releases/tag/v1.0.0` };
      else if (path.includes('/contents/')) { const error = new Error('Fixture absent docs'); error.status = 404; throw error; }
      else data = { full_name: fixtureName, default_branch: 'main', visibility: 'public', license: { spdx_id: 'MIT' }, description: 'Local task notes', archived: false, disabled: false, fork: false };
      return { data, usage: {} };
    },
    async jina(url) {
      calls.jina++;
      if (timeout) { const error = new Error('Fixture timeout'); error.code = 'REQUEST_TIMEOUT'; error.outcome = 'unknown'; throw error; }
      return { data: { text: fixtureReadme, url, truncated: false }, usage: { tokens: 100 } };
    },
    async ollama() {
      calls.ollama++; writes++;
      if (writes === 1) { const { slug, title, summary, problem, sections } = article; return { data: { slug, title, summary, problem, sections }, usage: { inputTokens: 700, outputTokens: 500 } }; }
      return { data: { allClaimsCovered: true, practical: true, noInventedTesting: true, licenseClear: true, original: true, clear: true, issues: [] }, usage: { inputTokens: 700, outputTokens: 100 } };
    },
    async typesafe(state, questions) {
      calls.typesafe++;
      const answers = Object.fromEntries(Object.entries(questions).map(([id, question]) => [id,
        question.type === 'choice' ? { type: 'choice', choice: contradict ? 'contradicted' : 'supported', probabilities: { supported: contradict ? 0 : 1, contradicted: contradict ? 1 : 0, insufficient: 0 }, confidence: 1 }
        : question.type === 'score' ? { type: 'score', score: 5, confidence: 1 }
        : { type: 'noul', noul: 0 }]));
      return { data: { model: 'jev-1.13.0', answers }, usage: { inputTokens: 1000, outputTokens: 100 } };
    },
  };
}
