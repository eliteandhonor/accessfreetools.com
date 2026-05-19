#!/usr/bin/env node
import { runSeoAgentWorkbench } from './lib/seo-agent-workbench.mjs';

try {
  const report = runSeoAgentWorkbench();
  const paths = report.paths || {};

  if (report.kind === 'seo-agent-workbench-all') {
    console.log(`SEO agent workbench: ${report.status}`);
    console.log(`- Slug: ${report.slug}`);
    console.log(`- Page: ${report.page}`);
    console.log(`- Agents: ${report.summary.agents}`);
    console.log(`- Active micro-agents: ${report.summary.microAgents}`);
    console.log(`- Parked micro-agents: ${report.summary.parkedMicroAgents}`);
    console.log(`- Internal-link score: ${report.summary.linkScore}`);
    console.log(`- Remaining gaps: ${report.summary.remainingGaps}`);
    console.log(`- Plan: ${paths.plan?.markdownPath}`);
    console.log(`- Source evidence: ${paths.sourceEvidence?.markdownPath}`);
    console.log(`- Micro-agent plan: ${paths.microPlan?.markdownPath}`);
    console.log(`- Link audit: ${paths.linkAudit?.markdownPath}`);
    console.log(`- Final judge: ${paths.finalJudge?.markdownPath}`);
  } else {
    console.log(`SEO agent workbench: ${report.status}`);
    console.log(`- Kind: ${report.kind}`);
    console.log(`- Slug: ${report.slug}`);
    console.log(`- Page: ${report.page}`);
    if (report.score !== undefined) console.log(`- Score: ${report.score}`);
    if (report.remainingGaps) console.log(`- Remaining gaps: ${report.remainingGaps.length}`);
    if (paths.markdownPath) console.log(`- Saved report: ${paths.markdownPath}`);
  }
} catch (error) {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 1;
}
