import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { listHostingerVpsDockerProjects, summarizeCollection } from './lib/hostinger-api.mjs';

const virtualMachineId =
  process.argv.find((argument) => argument.startsWith('--virtual-machine-id='))?.split('=')[1] ||
  process.env.HOSTINGER_VPS_ID ||
  '';
const outputPath = resolve('output/hostinger/deployments.json');

function write(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function projectName(project) {
  return project.name ?? project.project_name ?? project.projectName ?? project.id ?? 'unknown';
}

async function main() {
  if (!virtualMachineId) {
    const report = {
      generatedAt: new Date().toISOString(),
      status: 'not-configured',
      message: 'Set HOSTINGER_VPS_ID or pass --virtual-machine-id=... to inspect Hostinger VPS Docker projects.',
    };
    write(outputPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log('Hostinger deployments: not configured (HOSTINGER_VPS_ID missing).');
    return;
  }

  const response = await listHostingerVpsDockerProjects(virtualMachineId);
  const projects = summarizeCollection(response).map((project) => ({
    name: projectName(project),
    status: project.status ?? project.state ?? '',
  }));
  const report = {
    generatedAt: new Date().toISOString(),
    status: 'ok',
    virtualMachineId,
    count: projects.length,
    projects,
    rateLimit: response.rateLimit,
  };

  write(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Hostinger deployments: ${projects.length}`);
  for (const project of projects.slice(0, 20)) {
    console.log(`- ${project.name}${project.status ? ` (${project.status})` : ''}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
