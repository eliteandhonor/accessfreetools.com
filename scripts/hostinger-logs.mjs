import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { getHostingerVpsDockerLogs, summarizeCollection } from './lib/hostinger-api.mjs';

const virtualMachineId =
  process.argv.find((argument) => argument.startsWith('--virtual-machine-id='))?.split('=')[1] ||
  process.env.HOSTINGER_VPS_ID ||
  '';
const projectName =
  process.argv.find((argument) => argument.startsWith('--project='))?.split('=')[1] ||
  process.env.HOSTINGER_PROJECT_NAME ||
  '';
const outputPath = resolve('output/hostinger/logs.json');

function write(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, value);
}

function slimLog(entry) {
  return {
    timestamp: entry.timestamp ?? '',
    line: String(entry.line ?? entry.message ?? '').slice(0, 500),
  };
}

async function main() {
  if (!virtualMachineId || !projectName) {
    const report = {
      generatedAt: new Date().toISOString(),
      status: 'not-configured',
      message: 'Set HOSTINGER_VPS_ID and HOSTINGER_PROJECT_NAME, or pass --virtual-machine-id=... --project=...',
    };
    write(outputPath, `${JSON.stringify(report, null, 2)}\n`);
    console.log('Hostinger logs: not configured (HOSTINGER_VPS_ID or HOSTINGER_PROJECT_NAME missing).');
    return;
  }

  const response = await getHostingerVpsDockerLogs(virtualMachineId, projectName);
  const logs = summarizeCollection(response)
    .flatMap((item) => (Array.isArray(item.entries) ? item.entries : Array.isArray(item.logs) ? item.logs : [item]))
    .map(slimLog)
    .slice(-200);
  const report = {
    generatedAt: new Date().toISOString(),
    status: 'ok',
    virtualMachineId,
    projectName,
    count: logs.length,
    logs,
    rateLimit: response.rateLimit,
  };

  write(outputPath, `${JSON.stringify(report, null, 2)}\n`);
  console.log(`Hostinger logs: ${logs.length} recent lines`);
  for (const log of logs.slice(-20)) {
    console.log(`- ${log.timestamp ? `${log.timestamp} ` : ''}${log.line}`);
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
});
