import { existsSync, readFileSync } from 'node:fs';
import { join, resolve } from 'node:path';

export const REQUIRED_TTS_FEATURE_IDS = [
  'favorites-recent-voices',
  'audio-estimate',
  'chapter-builder',
  'document-import',
];

export const REQUIRED_TTS_INVARIANT_IDS = [
  'local-only-processing',
  'no-account-or-server-storage',
  'no-purchase-or-hosted-inference',
  'no-document-upload',
  'no-sensitive-analytics',
  'bounded-browser-resources',
  'beta-indexing-unchanged',
];

export const REQUIRED_AGENT_FILES = [
  'AGENT.md',
  'goal.md',
  'reference.md',
  'tasks.md',
  'worklog.md',
];

export const REQUIRED_CAMPAIGN_FILES = [
  'README.md',
  'plan.md',
  'campaign.json',
  'task-board.md',
  'completion-audit.md',
];

function duplicateValues(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

function hasText(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function findDependencyCycle(tasks) {
  const graph = new Map(tasks.map((task) => [task.id, task.dependsOn ?? []]));
  const visiting = new Set();
  const visited = new Set();

  function visit(taskId, trail) {
    if (visiting.has(taskId)) {
      const cycleStart = trail.indexOf(taskId);
      return [...trail.slice(cycleStart), taskId];
    }
    if (visited.has(taskId)) return null;

    visiting.add(taskId);
    for (const dependencyId of graph.get(taskId) ?? []) {
      if (!graph.has(dependencyId)) continue;
      const cycle = visit(dependencyId, [...trail, taskId]);
      if (cycle) return cycle;
    }
    visiting.delete(taskId);
    visited.add(taskId);
    return null;
  }

  for (const taskId of graph.keys()) {
    const cycle = visit(taskId, []);
    if (cycle) return cycle;
  }
  return null;
}

export function validateCampaignDefinition(campaign) {
  const errors = [];
  const warnings = [];

  if (!campaign || typeof campaign !== 'object' || Array.isArray(campaign)) {
    return { ok: false, errors: ['Campaign must be a JSON object.'], warnings };
  }

  if (campaign.schemaVersion !== 1) errors.push('schemaVersion must be 1.');
  if (!hasText(campaign.campaignId)) errors.push('campaignId is required.');
  if (!hasText(campaign.objective)) errors.push('objective is required.');

  const allowedStatuses = Array.isArray(campaign.allowedStatuses) ? campaign.allowedStatuses : [];
  const requiredStatuses = ['planned', 'in_progress', 'evidence_ready', 'approved', 'blocked'];
  for (const status of requiredStatuses) {
    if (!allowedStatuses.includes(status)) errors.push(`Missing allowed status: ${status}.`);
  }
  if (!allowedStatuses.includes(campaign.state)) errors.push(`Campaign state is not allowed: ${campaign.state}.`);

  const features = Array.isArray(campaign.features) ? campaign.features : [];
  const featureIds = features.map((feature) => feature?.id).filter(Boolean);
  for (const duplicate of duplicateValues(featureIds)) errors.push(`Duplicate feature ID: ${duplicate}.`);
  for (const featureId of REQUIRED_TTS_FEATURE_IDS) {
    if (!featureIds.includes(featureId)) errors.push(`Missing required feature: ${featureId}.`);
  }

  const invariants = Array.isArray(campaign.invariants) ? campaign.invariants : [];
  const invariantIds = invariants.map((invariant) => invariant?.id).filter(Boolean);
  for (const duplicate of duplicateValues(invariantIds)) errors.push(`Duplicate invariant ID: ${duplicate}.`);
  for (const invariantId of REQUIRED_TTS_INVARIANT_IDS) {
    if (!invariantIds.includes(invariantId)) errors.push(`Missing required invariant: ${invariantId}.`);
  }
  for (const invariant of invariants) {
    if (!hasText(invariant?.rule)) errors.push(`Invariant ${invariant?.id ?? '<unknown>'} needs a rule.`);
  }

  const agents = Array.isArray(campaign.agents) ? campaign.agents : [];
  const agentIds = agents.map((agent) => agent?.id).filter(Boolean);
  const agentIdSet = new Set(agentIds);
  for (const duplicate of duplicateValues(agentIds)) errors.push(`Duplicate agent ID: ${duplicate}.`);

  const approvingAgents = agents.filter((agent) => agent?.mayApprove === true);
  if (approvingAgents.length !== 1) errors.push('Exactly one agent must have approval authority.');
  if (!hasText(campaign.approvalAuthority)) errors.push('approvalAuthority is required.');
  if (approvingAgents[0]?.id !== campaign.approvalAuthority) {
    errors.push('approvalAuthority must match the only agent with mayApprove=true.');
  }
  for (const agent of agents) {
    if (!hasText(agent?.name)) errors.push(`Agent ${agent?.id ?? '<unknown>'} needs a name.`);
    if (!hasText(agent?.goal)) errors.push(`Agent ${agent?.id ?? '<unknown>'} needs a goal.`);
    if (!hasText(agent?.directory)) errors.push(`Agent ${agent?.id ?? '<unknown>'} needs a directory.`);
  }

  const tasks = Array.isArray(campaign.tasks) ? campaign.tasks : [];
  const taskIds = tasks.map((task) => task?.id).filter(Boolean);
  const taskIdSet = new Set(taskIds);
  for (const duplicate of duplicateValues(taskIds)) errors.push(`Duplicate task ID: ${duplicate}.`);
  if (tasks.length === 0) errors.push('At least one task is required.');

  for (const featureId of REQUIRED_TTS_FEATURE_IDS) {
    if (!tasks.some((task) => task?.feature === featureId)) {
      errors.push(`No task covers required feature: ${featureId}.`);
    }
  }

  for (const task of tasks) {
    const taskId = task?.id ?? '<unknown>';
    if (!hasText(task?.title)) errors.push(`Task ${taskId} needs a title.`);
    if (!agentIdSet.has(task?.owner)) errors.push(`Task ${taskId} has unknown owner: ${task?.owner}.`);
    if (!['P0', 'P1', 'P2'].includes(task?.priority)) errors.push(`Task ${taskId} has invalid priority: ${task?.priority}.`);
    if (!allowedStatuses.includes(task?.status)) errors.push(`Task ${taskId} has invalid status: ${task?.status}.`);
    if (!Array.isArray(task?.dependsOn)) errors.push(`Task ${taskId} dependsOn must be an array.`);
    for (const dependencyId of task?.dependsOn ?? []) {
      if (!taskIdSet.has(dependencyId)) errors.push(`Task ${taskId} has unknown dependency: ${dependencyId}.`);
      if (dependencyId === task?.id) errors.push(`Task ${taskId} cannot depend on itself.`);
    }
    if (!Array.isArray(task?.evidencePaths) || task.evidencePaths.length === 0 || task.evidencePaths.some((path) => !hasText(path))) {
      errors.push(`Task ${taskId} needs one or more evidence paths.`);
    }
    if (!hasText(task?.evidenceCommand)) errors.push(`Task ${taskId} needs an evidence command.`);
    if (!hasText(task?.doneRule)) errors.push(`Task ${taskId} needs a completion rule.`);
    if (task?.approvalGate !== campaign.approvalAuthority) {
      errors.push(`Task ${taskId} must use ${campaign.approvalAuthority} as its approval gate.`);
    }
    if (task?.status === 'approved' && task?.approvedBy !== campaign.approvalAuthority) {
      errors.push(`Approved task ${taskId} must name ${campaign.approvalAuthority} in approvedBy.`);
    }
    if (task?.status !== 'approved' && task?.approvedBy) {
      errors.push(`Unapproved task ${taskId} cannot have approvedBy.`);
    }
  }

  const cycle = findDependencyCycle(tasks);
  if (cycle) errors.push(`Task dependency cycle: ${cycle.join(' -> ')}.`);

  if (!tasks.some((task) => task.owner === campaign.approvalAuthority)) {
    errors.push('The approval authority needs at least one owned release task.');
  }
  if (tasks.some((task) => task.status === 'approved')) {
    warnings.push('Campaign includes approved tasks; verify their evidence paths are current before release.');
  }

  return {
    ok: errors.length === 0,
    errors,
    warnings,
    summary: {
      agents: agents.length,
      features: features.length,
      invariants: invariants.length,
      tasks: tasks.length,
      approvedTasks: tasks.filter((task) => task.status === 'approved').length,
    },
  };
}

function readUtf8(path) {
  return readFileSync(path, 'utf8');
}

export function verifyCampaignWorkspace({ rootDir, campaignRelativePath }) {
  const absoluteRoot = resolve(rootDir);
  const campaignDir = resolve(absoluteRoot, campaignRelativePath);
  const errors = [];
  const warnings = [];

  for (const filename of REQUIRED_CAMPAIGN_FILES) {
    if (!existsSync(join(campaignDir, filename))) errors.push(`Missing campaign file: ${filename}.`);
  }
  const workspaceRules = join(campaignDir, '..', '..', 'AGENTS.md');
  if (!existsSync(workspaceRules)) errors.push('Missing agents/tts-audiobook/AGENTS.md.');

  let campaign;
  const campaignPath = join(campaignDir, 'campaign.json');
  if (existsSync(campaignPath)) {
    try {
      campaign = JSON.parse(readUtf8(campaignPath));
    } catch (error) {
      errors.push(`campaign.json is not valid JSON: ${error.message}`);
    }
  }

  const definition = validateCampaignDefinition(campaign);
  errors.push(...definition.errors);
  warnings.push(...definition.warnings);

  if (campaign) {
    const taskBoardPath = join(campaignDir, 'task-board.md');
    const taskBoard = existsSync(taskBoardPath) ? readUtf8(taskBoardPath) : '';

    for (const agent of campaign.agents ?? []) {
      const agentDir = join(campaignDir, agent.directory ?? '');
      for (const filename of REQUIRED_AGENT_FILES) {
        const path = join(agentDir, filename);
        if (!existsSync(path)) errors.push(`Missing ${agent.id} file: ${filename}.`);
      }

      const worklogPath = join(agentDir, 'worklog.md');
      if (existsSync(worklogPath) && !/append-only/i.test(readUtf8(worklogPath))) {
        errors.push(`${agent.id} worklog must declare append-only behavior.`);
      }

      const tasksPath = join(agentDir, 'tasks.md');
      const agentTasks = existsSync(tasksPath) ? readUtf8(tasksPath) : '';
      for (const task of (campaign.tasks ?? []).filter((candidate) => candidate.owner === agent.id)) {
        if (!agentTasks.includes(task.id)) errors.push(`${agent.id} tasks.md is missing ${task.id}.`);
      }
    }

    for (const task of campaign.tasks ?? []) {
      if (!taskBoard.includes(task.id)) errors.push(`task-board.md is missing ${task.id}.`);
    }
  }

  return {
    status: errors.length === 0 ? 'pass' : 'fail',
    campaignId: campaign?.campaignId ?? null,
    campaignPath: campaignRelativePath.replaceAll('\\', '/'),
    errors,
    warnings,
    summary: definition.summary ?? {
      agents: 0,
      features: 0,
      invariants: 0,
      tasks: 0,
      approvedTasks: 0,
    },
  };
}

export function renderCampaignVerificationMarkdown(report) {
  const lines = [
    '# TTS Feature Campaign Verification',
    '',
    `- Status: **${report.status.toUpperCase()}**`,
    `- Campaign: \`${report.campaignId ?? 'unknown'}\``,
    `- Agents: ${report.summary.agents}`,
    `- Requested features: ${report.summary.features}`,
    `- Product invariants: ${report.summary.invariants}`,
    `- Tasks: ${report.summary.tasks}`,
    `- Approved tasks: ${report.summary.approvedTasks}`,
    '',
  ];

  lines.push('## Errors', '');
  lines.push(...(report.errors.length ? report.errors.map((error) => `- ${error}`) : ['- None.']));
  lines.push('', '## Warnings', '');
  lines.push(...(report.warnings.length ? report.warnings.map((warning) => `- ${warning}`) : ['- None.']));
  lines.push('', 'A passing campaign verification proves the goals and controls are internally consistent. It does not prove the product features are implemented.', '');
  return lines.join('\n');
}
