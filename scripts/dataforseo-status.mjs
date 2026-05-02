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
const reportPath = resolve(
  args.find((arg) => arg.startsWith('--report='))?.slice('--report='.length) ?? 'output/dataforseo-status.json',
);
const sandbox = args.includes('--sandbox');
const failOnUnhealthy = args.includes('--fail-on-unhealthy');

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
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
  if (serviceStatus.rateLimit?.limit !== null || serviceStatus.rateLimit?.remaining !== null) {
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
  const report = {
    generatedAt: new Date().toISOString(),
    mode: sandbox ? 'sandbox' : 'production',
    status: 'error',
    message: error instanceof Error ? error.message : String(error),
    details: error?.details ?? null,
  };
  writeJson(reportPath, report);
  console.error(report.message);
  process.exitCode = 1;
}
