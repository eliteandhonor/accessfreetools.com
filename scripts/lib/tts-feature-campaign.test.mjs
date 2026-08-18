import { describe, expect, it } from 'vitest';

import {
  REQUIRED_TTS_FEATURE_IDS,
  REQUIRED_TTS_INVARIANT_IDS,
  validateCampaignDefinition,
} from './tts-feature-campaign.mjs';

function makeCampaign() {
  const agents = [
    { id: 'feature-owner', name: 'Feature Owner', goal: 'Own feature work.', directory: 'agents/feature-owner', mayApprove: false },
    { id: 'release-proof-judge', name: 'Release Judge', goal: 'Judge proof.', directory: 'agents/release-proof-judge', mayApprove: true },
  ];
  const tasks = REQUIRED_TTS_FEATURE_IDS.map((feature, index) => ({
    id: `T-${index + 1}`,
    title: `Deliver ${feature}`,
    feature,
    owner: 'feature-owner',
    priority: 'P1',
    status: 'planned',
    dependsOn: index === 0 ? [] : [`T-${index}`],
    evidencePaths: [`output/${feature}.json`],
    evidenceCommand: `npm run verify:${feature}`,
    doneRule: `${feature} has implementation and proof.`,
    approvalGate: 'release-proof-judge',
  }));
  tasks.push({
    id: 'RJ-01',
    title: 'Judge final evidence',
    feature: 'release',
    owner: 'release-proof-judge',
    priority: 'P0',
    status: 'planned',
    dependsOn: ['T-4'],
    evidencePaths: ['output/judge.json'],
    evidenceCommand: 'npm run check',
    doneRule: 'All final evidence is independently checked.',
    approvalGate: 'release-proof-judge',
  });

  return {
    schemaVersion: 1,
    campaignId: 'fixture',
    objective: 'Test campaign validation.',
    state: 'planned',
    allowedStatuses: ['planned', 'in_progress', 'evidence_ready', 'approved', 'blocked'],
    approvalAuthority: 'release-proof-judge',
    features: REQUIRED_TTS_FEATURE_IDS.map((id) => ({ id, title: id })),
    invariants: REQUIRED_TTS_INVARIANT_IDS.map((id) => ({ id, rule: `${id} remains enforced.` })),
    agents,
    tasks,
  };
}

describe('TTS feature campaign validation', () => {
  it('accepts a complete proof-gated campaign', () => {
    const result = validateCampaignDefinition(makeCampaign());
    expect(result.ok).toBe(true);
    expect(result.errors).toEqual([]);
    expect(result.summary).toMatchObject({ features: 4, tasks: 5, approvedTasks: 0 });
  });

  it('rejects missing requested feature coverage and privacy invariants', () => {
    const campaign = makeCampaign();
    campaign.features = campaign.features.filter((feature) => feature.id !== 'document-import');
    campaign.tasks = campaign.tasks.filter((task) => task.feature !== 'document-import');
    campaign.invariants = campaign.invariants.filter((invariant) => invariant.id !== 'no-document-upload');

    const result = validateCampaignDefinition(campaign);
    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Missing required feature: document-import.');
    expect(result.errors).toContain('No task covers required feature: document-import.');
    expect(result.errors).toContain('Missing required invariant: no-document-upload.');
  });

  it('rejects unknown dependencies and cycles', () => {
    const unknown = makeCampaign();
    unknown.tasks[0].dependsOn = ['missing-task'];
    expect(validateCampaignDefinition(unknown).errors).toContain('Task T-1 has unknown dependency: missing-task.');

    const cyclic = makeCampaign();
    cyclic.tasks[0].dependsOn = ['T-2'];
    const result = validateCampaignDefinition(cyclic);
    expect(result.errors.some((error) => error.startsWith('Task dependency cycle:'))).toBe(true);
  });

  it('rejects approval by anyone except the release judge', () => {
    const campaign = makeCampaign();
    campaign.agents[0].mayApprove = true;
    campaign.tasks[0].status = 'approved';
    campaign.tasks[0].approvedBy = 'feature-owner';

    const result = validateCampaignDefinition(campaign);
    expect(result.ok).toBe(false);
    expect(result.errors).toContain('Exactly one agent must have approval authority.');
    expect(result.errors).toContain('Approved task T-1 must name release-proof-judge in approvedBy.');
  });

  it('requires evidence paths, commands, completion rules, and the judge gate', () => {
    const campaign = makeCampaign();
    campaign.tasks[0].evidencePaths = [];
    campaign.tasks[0].evidenceCommand = '';
    campaign.tasks[0].doneRule = '';
    campaign.tasks[0].approvalGate = 'feature-owner';

    const result = validateCampaignDefinition(campaign);
    expect(result.errors).toContain('Task T-1 needs one or more evidence paths.');
    expect(result.errors).toContain('Task T-1 needs an evidence command.');
    expect(result.errors).toContain('Task T-1 needs a completion rule.');
    expect(result.errors).toContain('Task T-1 must use release-proof-judge as its approval gate.');
  });
});
