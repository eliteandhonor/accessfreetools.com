import assert from 'node:assert/strict';
import { existsSync, readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));
const repo = resolve(root, '../..');
const campaign = JSON.parse(readFileSync(resolve(root, 'campaign.json'), 'utf8'));
const nonempty = (value) => typeof value === 'string' && value.trim().length > 0;
const ids = (rows) => new Set(rows.map((row) => row.id));
const requireFile = (path) => assert(existsSync(path), `Missing: ${path}`);
const agentIds = ids(campaign.agents);
const goalIds = ids(campaign.goals);
const taskIds = ids(campaign.tasks);

assert.equal(campaign.schemaVersion, 1);
assert.equal(agentIds.size, campaign.agents.length, 'Duplicate agent');
assert.equal(goalIds.size, campaign.goals.length, 'Duplicate goal');
assert.equal(taskIds.size, campaign.tasks.length, 'Duplicate task');
assert.match(campaign.sourceRevision, /^[a-f0-9]{40}$/);
assert.equal(campaign.agents.filter((a) => a.mayApprove).length, 1);
assert(campaign.agents.find((a) => a.id === campaign.approvalAuthority)?.mayApprove);

for (const file of ['AGENTS.md', 'README.md', 'plan.md', 'task-board.md', 'completion-audit.md']) {
  requireFile(resolve(root, file));
}
for (const agent of campaign.agents) {
  assert(goalIds.has(agent.goalId));
  assert(nonempty(agent.goal) && nonempty(agent.scope));
  for (const file of ['AGENT.md', 'goal.md', 'reference.md', 'tasks.md', 'worklog.md']) {
    requireFile(resolve(root, agent.directory, file));
  }
  assert(campaign.tasks.some((task) => task.owner === agent.id));
}
for (const goal of campaign.goals) {
  assert(agentIds.has(goal.owner));
  assert(nonempty(goal.objective));
  assert(goal.taskIds.length > 0);
  for (const id of goal.taskIds) {
    const task = campaign.tasks.find((item) => item.id === id);
    assert(task && task.goalId === goal.id && task.owner === goal.owner);
  }
}
for (const task of campaign.tasks) {
  assert(agentIds.has(task.owner) && goalIds.has(task.goalId));
  assert(agentIds.has(task.evaluator));
  if (task.lane !== 'review' && task.owner !== campaign.approvalAuthority) {
    assert.notEqual(task.owner, task.evaluator, 'Implementation evaluation must be independent');
  }
  assert(campaign.allowedStatuses.includes(task.status));
  assert(['P0', 'P1', 'P2', 'P3'].includes(task.priority));
  assert(nonempty(task.title) && nonempty(task.doneRule) && nonempty(task.evidenceCommand));
  assert(nonempty(task.evidenceOutput));
  assert.equal(task.approvalGate, campaign.approvalAuthority);
  if (task.status === 'approved') assert.equal(task.approvedBy, campaign.approvalAuthority);
  if (task.status === 'blocked') assert(nonempty(task.blockedReason));
  assert(task.evidencePaths.length > 0);
  task.evidencePaths.forEach((path) => requireFile(resolve(root, path)));
  task.dependsOn.forEach((id) => assert(taskIds.has(id) && id !== task.id));
  const board = readFileSync(resolve(root, 'task-board.md'), 'utf8');
  assert(board.includes(`| ${task.id} | ${task.priority} | ${task.owner} | ${task.status} |`));
}
const visited = new Set();
function visit(id, stack = new Set()) {
  assert(!stack.has(id), `Dependency cycle at ${id}`);
  if (visited.has(id)) return;
  const next = new Set([...stack, id]);
  campaign.tasks.find((t) => t.id === id).dependsOn.forEach((dependency) => visit(dependency, next));
  visited.add(id);
}
campaign.tasks.forEach((task) => visit(task.id));
for (const name of ['correctness', 'privacy-security', 'browser-products', 'search-content-promotion', 'frontend-quality', 'operations', 'release-judge']) {
  requireFile(resolve(root, 'reports', `${name}.md`));
}
if (process.argv.includes('--require-local-proof')) {
  for (const path of ['output/gpt6-project-review/baseline.json', 'output/gpt6-project-review/full-check.log', 'output/gpt6-project-review/smoke.log', 'output/gpt6-project-review/dependency-audit.json', 'output/production-sitemap-check.json', 'output/playwright/frontend-local-tools-tablet.png']) {
    requireFile(resolve(repo, path));
  }
}
console.log(`Review structure PASS: ${agentIds.size} agents, ${goalIds.size} goals, ${taskIds.size} tasks; owners, references, states and acyclic dependencies verified.`);
console.log('Structure and file presence are not implementation, public-proof or factual approval. Read the Release Judge decision.');
