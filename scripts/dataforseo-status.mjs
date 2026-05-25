import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import {
  findDataForSeoService,
  getDataForSeoLabsStatus,
  getDataForSeoServiceStatus,
  summarizeDataForSeoLabsStatus,
  summarizeDataForSeoServiceStatus,
} from './lib/dataforseo.mjs';

const args = process.argv.slice(2);

function option(name, fallback) {
  const key = `npm_config_${name.replace(/^--/, '').replace(/-/g, '_')}`;
  return args.find((arg) => arg.startsWith(`${name}=`))?.slice(name.length + 1) ?? process.env[key] ?? fallback;
}

function flag(name) {
  const key = `npm_config_${name.replace(/^--/, '').replace(/-/g, '_')}`;
  const value = process.env[key];
  return args.includes(name) || value === 'true' || value === '';
}

const reportPath = resolve(
  option('--report', 'output/dataforseo-status.json'),
);
const sandbox = flag('--sandbox');
const failOnUnhealthy = flag('--fail-on-unhealthy');

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

async function currentPublicIp() {
  try {
    const response = await fetch('https://api.ipify.org?format=json');
    const json = await response.json();
    return typeof json.ip === 'string' ? json.ip : '';
  } catch {
    return '';
  }
}

function serviceLine(service) {
  return `${service?.api ?? 'unknown'}: ${service?.status ?? 'unknown'}`;
}

try {
  let serviceStatus;
  let serviceStatusWarning = '';

  try {
    serviceStatus = summarizeDataForSeoServiceStatus(await getDataForSeoServiceStatus({ sandbox }));
  } catch (error) {
    if (!sandbox) {
      throw error;
    }

    serviceStatusWarning =
      error instanceof Error
        ? `Sandbox service status was not available: ${error.message}`
        : `Sandbox service status was not available: ${String(error)}`;
    serviceStatus = {
      generatedAt: new Date().toISOString(),
      statusCode: null,
      statusMessage: 'sandbox-unavailable',
      rateLimit: error?.rateLimit ?? null,
      services: [],
      warning: serviceStatusWarning,
    };
  }

  let labsStatus;
  let labsStatusWarning = '';

  try {
    labsStatus = summarizeDataForSeoLabsStatus(await getDataForSeoLabsStatus({ sandbox }));
  } catch (error) {
    if (!sandbox) {
      throw error;
    }

    labsStatusWarning =
      error instanceof Error
        ? `Sandbox Labs status was not available: ${error.message}`
        : `Sandbox Labs status was not available: ${String(error)}`;
    labsStatus = {
      generatedAt: new Date().toISOString(),
      statusCode: null,
      statusMessage: 'sandbox-unavailable',
      rateLimit: error?.rateLimit ?? null,
      searchEngines: {},
      warning: labsStatusWarning,
    };
  }

  const requiredServices = ['appendix', 'dataforseo_labs', 'serp', 'on_page'];
  const serviceChecks =
    sandbox && serviceStatus.services.length === 0
      ? [{ api: 'sandbox', status: 'not-prepared' }]
      : requiredServices.map((api) => findDataForSeoService(serviceStatus, api) ?? { api, status: 'missing' });
  const unhealthyServices =
    sandbox && serviceStatus.services.length === 0 ? [] : serviceChecks.filter((service) => service.status !== 'ok');
  const warning = [serviceStatusWarning, labsStatusWarning].filter(Boolean).join(' ');
  const report = {
    generatedAt: new Date().toISOString(),
    mode: sandbox ? 'sandbox' : 'production',
    status: unhealthyServices.length > 0 ? 'degraded' : warning ? 'ok-with-sandbox-warning' : 'ok',
    warning,
    serviceChecks,
    serviceStatus,
    labsStatus,
  };

  writeJson(reportPath, report);

  console.log(`DataForSEO status check (${report.mode})`);
  for (const service of serviceChecks) {
    console.log(serviceLine(service));
  }
  if (warning) {
    console.log(warning);
  } else {
    console.log(`DataForSEO Labs database freshness: ${JSON.stringify(labsStatus.searchEngines)}`);
  }
  if (
    serviceStatus.rateLimit &&
    (serviceStatus.rateLimit.limit !== null && serviceStatus.rateLimit.limit !== undefined
      ? true
      : serviceStatus.rateLimit.remaining !== null && serviceStatus.rateLimit.remaining !== undefined)
  ) {
    console.log(
      `Rate limit: ${serviceStatus.rateLimit.remaining ?? 'unknown'} remaining of ${serviceStatus.rateLimit.limit ?? 'unknown'}`,
    );
  }
  console.log(`Status: ${report.status}`);
  console.log(`Saved report to ${reportPath}`);

  if (unhealthyServices.length > 0 && failOnUnhealthy) {
    process.exitCode = 2;
  }
} catch (error) {
  const publicIp = await currentPublicIp();
  const report = {
    generatedAt: new Date().toISOString(),
    mode: sandbox ? 'sandbox' : 'production',
    status: 'error',
    message: error instanceof Error ? error.message : String(error),
    publicIp,
    details: error?.details ?? null,
  };
  writeJson(reportPath, report);
  console.error(report.message);
  process.exitCode = 1;
}
