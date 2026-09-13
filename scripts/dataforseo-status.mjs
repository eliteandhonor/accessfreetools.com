import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { providerFailure } from './lib/provider-status.mjs';
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

function serviceLine(service) {
  return `${service?.api ?? 'unknown'}: ${service?.status ?? 'unknown'}`;
}

let serviceStatus;
let labsStatus;
try {
  let serviceStatusWarning = '';

  try {
    serviceStatus = summarizeDataForSeoServiceStatus(await getDataForSeoServiceStatus({ sandbox }));
  } catch (error) {
    if (!sandbox) {
      throw error;
    }

    serviceStatusWarning = `Sandbox service status was not available: ${providerFailure(error).message}`;
    serviceStatus = {
      generatedAt: new Date().toISOString(),
      statusCode: null,
      statusMessage: 'sandbox-unavailable',
      rateLimit: error?.rateLimit ?? null,
      services: [],
      warning: serviceStatusWarning,
    };
  }

  let labsStatusWarning = '';

  try {
    labsStatus = summarizeDataForSeoLabsStatus(await getDataForSeoLabsStatus({ sandbox }));
  } catch (error) {
    if (!sandbox) {
      throw error;
    }

    labsStatusWarning = `Sandbox Labs status was not available: ${providerFailure(error).message}`;
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
  report.currentAttempt = { status: report.status === 'ok' ? 'success' : 'partial', generatedAt: report.generatedAt };

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
  const failure = providerFailure(error);
  const report = {
    generatedAt: new Date().toISOString(),
    mode: sandbox ? 'sandbox' : 'production',
    status: serviceStatus || labsStatus ? 'partial' : 'error',
    ...failure,
    serviceStatus: serviceStatus ?? null,
    labsStatus: labsStatus ?? null,
  };
  report.currentAttempt = { status: report.status === 'partial' ? 'partial' : 'failed', generatedAt: report.generatedAt, ...failure };
  writeJson(reportPath, report);
  console.error(report.message);
  process.exitCode = 1;
}
