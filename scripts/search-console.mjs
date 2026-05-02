import { createHash, randomBytes } from 'node:crypto';
import { createServer } from 'node:http';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { spawn } from 'node:child_process';

const DEFAULT_SECRET_PATH = resolve('.local/google-search-console-client-secret.json');
const TOKEN_PATH = resolve(process.env.GSC_TOKEN_PATH ?? '.local/search-console-token.json');
const REPORT_PATH = resolve(process.env.GSC_REPORT_PATH ?? 'output/search-console-performance.json');
const CANONICAL_FIX_REPORT_PATH = resolve(
  process.env.GSC_CANONICAL_FIX_REPORT_PATH ?? 'output/search-console-canonical-fix.json',
);
const DISCOVERY_REPORT_PATH = resolve(process.env.GSC_DISCOVERY_REPORT_PATH ?? 'output/search-console-discovery.json');
const URL_INSPECTION_REPORT_PATH = resolve(
  process.env.GSC_URL_INSPECTION_REPORT_PATH ?? 'output/search-console-url-inspection.json',
);
const DOMAIN_VERIFICATION_REPORT_PATH = resolve(
  process.env.GSC_DOMAIN_VERIFICATION_REPORT_PATH ?? 'output/search-console-domain-verification.json',
);
const READONLY_SCOPES = ['https://www.googleapis.com/auth/webmasters.readonly'];
const VERIFY_SCOPES = ['https://www.googleapis.com/auth/siteverification.verify_only'];
const SEARCH_CONSOLE_MANAGE_SCOPES = ['https://www.googleapis.com/auth/webmasters'];
const MANAGE_SCOPES = [
  'https://www.googleapis.com/auth/webmasters',
  'https://www.googleapis.com/auth/siteverification.verify_only',
];
const TARGET_DOMAIN = 'accessfreetools.com';
const CANONICAL_SITE_URL = `https://${TARGET_DOMAIN}/`;
const CANONICAL_SITEMAP_URL = `https://${TARGET_DOMAIN}/sitemap.xml`;
const CANONICAL_FEED_URL = `https://${TARGET_DOMAIN}/feed.xml`;
const KEY_INSPECTION_URLS = [
  CANONICAL_SITE_URL,
  `${CANONICAL_SITE_URL}tools/`,
  `${CANONICAL_SITE_URL}blog/`,
  `${CANONICAL_SITE_URL}tools/basic-calculator/`,
  `${CANONICAL_SITE_URL}tools/image-to-text-ocr-tool/`,
];

function parseArgs() {
  const args = process.argv.slice(2);
  const parsed = {
    urls: [],
  };

  for (const arg of args) {
    if (arg.startsWith('--client-secret=')) {
      parsed.clientSecretPath = arg.slice('--client-secret='.length);
    } else if (arg.startsWith('--site=')) {
      parsed.siteUrl = arg.slice('--site='.length);
    } else if (arg.startsWith('--start=')) {
      parsed.startDate = arg.slice('--start='.length);
    } else if (arg.startsWith('--end=')) {
      parsed.endDate = arg.slice('--end='.length);
    } else if (arg.startsWith('--url=')) {
      parsed.urls.push(arg.slice('--url='.length));
    } else if (arg === '--reauth') {
      parsed.reauth = true;
    } else if (arg === '--fix-canonical') {
      parsed.fixCanonical = true;
    } else if (arg === '--get-verification-file') {
      parsed.getVerificationFile = true;
    } else if (arg === '--get-domain-verification') {
      parsed.getDomainVerification = true;
    } else if (arg === '--submit-discovery') {
      parsed.submitDiscovery = true;
    } else if (arg === '--inspect-key-urls') {
      parsed.inspectKeyUrls = true;
    } else if (arg === '--list-sites') {
      parsed.listSites = true;
    }
  }

  return parsed;
}

function requiredScopesForArgs(args) {
  if (args.getVerificationFile || args.getDomainVerification) {
    return VERIFY_SCOPES;
  }

  if (args.fixCanonical) {
    return MANAGE_SCOPES;
  }

  if (args.submitDiscovery) {
    return SEARCH_CONSOLE_MANAGE_SCOPES;
  }

  return READONLY_SCOPES;
}

function toBase64Url(buffer) {
  return buffer.toString('base64').replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function isoDateDaysAgo(daysAgo) {
  const date = new Date();
  date.setUTCDate(date.getUTCDate() - daysAgo);
  return date.toISOString().slice(0, 10);
}

function readJson(path) {
  return JSON.parse(readFileSync(path, 'utf8'));
}

function writeJson(path, value) {
  mkdirSync(dirname(path), { recursive: true });
  writeFileSync(path, `${JSON.stringify(value, null, 2)}\n`);
}

function findLocalClientSecret() {
  const localDirectory = resolve('.local');

  if (existsSync(DEFAULT_SECRET_PATH)) {
    return DEFAULT_SECRET_PATH;
  }

  if (!existsSync(localDirectory)) {
    return DEFAULT_SECRET_PATH;
  }

  const candidates = readdirSync(localDirectory)
    .filter((name) => /^client_secret_.*\.json$/i.test(name))
    .sort();

  return candidates.length === 1 ? resolve(localDirectory, candidates[0]) : DEFAULT_SECRET_PATH;
}

function getClientConfig(secretPath) {
  let secret;

  try {
    secret = readJson(secretPath);
  } catch (error) {
    throw new Error(
      `Could not read Google Search Console OAuth client file at ${secretPath}. ` +
        'Set GSC_CLIENT_SECRET_PATH, pass --client-secret=..., place the file at .local/google-search-console-client-secret.json, or keep one client_secret_*.json file in .local.',
      { cause: error },
    );
  }

  const config = secret.installed ?? secret.web;

  if (!config?.client_id || !config?.client_secret) {
    throw new Error(`OAuth client file is missing client_id or client_secret: ${secretPath}`);
  }

  return config;
}

async function postForm(url, body) {
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams(body).toString(),
  });
  const text = await response.text();
  const json = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(`${url} returned ${response.status}: ${JSON.stringify(json)}`);
  }

  return json;
}

function openBrowser(url) {
  if (process.platform === 'win32') {
    spawn('rundll32.exe', ['url.dll,FileProtocolHandler', url], {
      detached: true,
      stdio: 'ignore',
    }).unref();
    return;
  }

  const command = process.platform === 'darwin' ? 'open' : 'xdg-open';
  spawn(command, [url], { detached: true, stdio: 'ignore' }).unref();
}

function waitForOAuthServer(redirectPath = '/oauth2callback') {
  return new Promise((resolveCode, reject) => {
    const server = createServer();

    server.once('error', reject);
    server.listen(0, 'localhost', () => {
      resolveCode({ server, port: server.address().port });
    });
  });
}

function hasRequiredScopes(token, requiredScopes) {
  const grantedScopes = new Set(String(token.scope ?? '').split(/\s+/).filter(Boolean));
  return requiredScopes.every((scope) => {
    if (scope === READONLY_SCOPES[0] && grantedScopes.has(MANAGE_SCOPES[0])) {
      return true;
    }

    return grantedScopes.has(scope);
  });
}

async function authenticate(config, forceReauth, requiredScopes) {
  if (!forceReauth) {
    try {
      const existingToken = readJson(TOKEN_PATH);
      const expiresAt = Number(existingToken.expires_at ?? 0);

      if (existingToken.access_token && expiresAt > Date.now() + 60_000 && hasRequiredScopes(existingToken, requiredScopes)) {
        return existingToken;
      }

      if (existingToken.refresh_token && hasRequiredScopes(existingToken, requiredScopes)) {
        const refreshed = await postForm(config.token_uri, {
          client_id: config.client_id,
          client_secret: config.client_secret,
          refresh_token: existingToken.refresh_token,
          grant_type: 'refresh_token',
        });
        const token = {
          ...existingToken,
          ...refreshed,
          refresh_token: refreshed.refresh_token ?? existingToken.refresh_token,
          expires_at: Date.now() + Number(refreshed.expires_in ?? 3600) * 1000,
        };
        writeJson(TOKEN_PATH, token);
        return token;
      }
    } catch {
      // Fall through to a fresh browser login.
    }
  }

  const redirectPath = '/';
  const waitForServer = waitForOAuthServer(redirectPath);
  const { server, port } = await waitForServer;
  const redirectUri = `http://localhost:${port}`;
  const verifier = toBase64Url(randomBytes(48));
  const challenge = toBase64Url(createHash('sha256').update(verifier).digest());

  const authUrl = new URL(config.auth_uri);
  authUrl.searchParams.set('client_id', config.client_id);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', requiredScopes.join(' '));
  authUrl.searchParams.set('access_type', 'offline');
  authUrl.searchParams.set('prompt', 'consent');
  authUrl.searchParams.set('code_challenge', challenge);
  authUrl.searchParams.set('code_challenge_method', 'S256');

  console.log('Opening Google OAuth in your browser. If it does not open, paste this URL into your browser:');
  console.log(authUrl.toString());
  openBrowser(authUrl.toString());

  const codeResult = await new Promise((resolve, reject) => {
    const timeout = setTimeout(() => {
      server.close();
      reject(new Error('Timed out waiting for the browser authorization callback.'));
    }, 15 * 60 * 1000);

    server.removeAllListeners('request');
    server.on('request', (req, res) => {
      const requestUrl = new URL(req.url ?? '/', 'http://127.0.0.1');
      const error = requestUrl.searchParams.get('error');
      const code = requestUrl.searchParams.get('code');

      if (requestUrl.pathname !== redirectPath) {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not found');
        return;
      }

      clearTimeout(timeout);

      if (error) {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Google authorization failed</h1><p>You can close this tab.</p>');
        server.close();
        reject(new Error(`Google OAuth returned error: ${error}`));
        return;
      }

      if (!code) {
        res.writeHead(400, { 'Content-Type': 'text/html; charset=utf-8' });
        res.end('<h1>Missing OAuth code</h1><p>You can close this tab.</p>');
        server.close();
        reject(new Error('Google OAuth callback did not include a code.'));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end('<h1>Access Free Tools is connected to Search Console.</h1><p>You can close this tab and return to Codex.</p>');
      server.close();
      resolve({ code });
    });
  });

  const token = await postForm(config.token_uri, {
    client_id: config.client_id,
    client_secret: config.client_secret,
    code: codeResult.code,
    code_verifier: verifier,
    redirect_uri: redirectUri,
    grant_type: 'authorization_code',
  });
  const savedToken = {
    ...token,
    expires_at: Date.now() + Number(token.expires_in ?? 3600) * 1000,
    scope: token.scope ?? requiredScopes.join(' '),
  };
  writeJson(TOKEN_PATH, savedToken);
  return savedToken;
}

async function googleApi(path, token, options = {}) {
  const response = await fetch(`https://searchconsole.googleapis.com${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
  const text = await response.text();
  const json = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(`Search Console API ${path} returned ${response.status}: ${JSON.stringify(json)}`);
  }

  return json;
}

function chooseSite(sites, requestedSite) {
  if (requestedSite) {
    return sites.find((site) => site.siteUrl === requestedSite);
  }

  const verifiedSites = sites.filter((site) => site.permissionLevel !== 'siteUnverifiedUser');
  const preferred = [`sc-domain:${TARGET_DOMAIN}`, `https://${TARGET_DOMAIN}/`, `http://${TARGET_DOMAIN}/`];

  for (const siteUrl of preferred) {
    const match = verifiedSites.find((site) => site.siteUrl === siteUrl);

    if (match) {
      return match;
    }
  }

  return verifiedSites.find((site) => site.siteUrl.includes(TARGET_DOMAIN));
}

async function googleSiteVerificationApi(path, token, options = {}) {
  const response = await fetch(`https://www.googleapis.com/siteVerification/v1${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      'Content-Type': 'application/json',
      ...(options.headers ?? {}),
    },
  });
  const text = await response.text();
  const json = text ? JSON.parse(text) : {};

  if (!response.ok) {
    throw new Error(`Site Verification API ${path} returned ${response.status}: ${JSON.stringify(json)}`);
  }

  return json;
}

async function queryPerformance(siteUrl, token, body) {
  return googleApi(`/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/searchAnalytics/query`, token, {
    method: 'POST',
    body: JSON.stringify(body),
  });
}

async function addSite(siteUrl, token) {
  return googleApi(`/webmasters/v3/sites/${encodeURIComponent(siteUrl)}`, token, {
    method: 'PUT',
  });
}

async function submitSitemap(siteUrl, sitemapUrl, token) {
  return googleApi(
    `/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps/${encodeURIComponent(sitemapUrl)}`,
    token,
    {
      method: 'PUT',
    },
  );
}

async function listSitemaps(siteUrl, token) {
  return googleApi(`/webmasters/v3/sites/${encodeURIComponent(siteUrl)}/sitemaps`, token);
}

async function inspectUrl(siteUrl, inspectionUrl, token) {
  return googleApi('/v1/urlInspection/index:inspect', token, {
    method: 'POST',
    body: JSON.stringify({
      inspectionUrl,
      siteUrl,
      languageCode: 'en-US',
    }),
  });
}

async function getVerificationToken(siteUrl, token) {
  return googleSiteVerificationApi('/token', token, {
    method: 'POST',
    body: JSON.stringify({
      site: {
        type: 'SITE',
        identifier: siteUrl,
      },
      verificationMethod: 'FILE',
    }),
  });
}

async function getDomainVerificationToken(domain, token) {
  return googleSiteVerificationApi('/token', token, {
    method: 'POST',
    body: JSON.stringify({
      site: {
        type: 'INET_DOMAIN',
        identifier: domain,
      },
      verificationMethod: 'DNS_TXT',
    }),
  });
}

async function verifySite(siteUrl, token) {
  return googleSiteVerificationApi('/webResource?verificationMethod=FILE', token, {
    method: 'POST',
    body: JSON.stringify({
      site: {
        type: 'SITE',
        identifier: siteUrl,
      },
    }),
  });
}

function sumMetric(rows, key) {
  return (rows ?? []).reduce((sum, row) => sum + Number(row[key] ?? 0), 0);
}

function printRows(label, rows, keyLabel) {
  console.log(`\n${label}`);

  if (!rows?.length) {
    console.log('  No rows returned yet.');
    return;
  }

  for (const row of rows.slice(0, 10)) {
    const key = row.keys?.join(' | ') ?? '(total)';
    console.log(
      `  ${keyLabel}: ${key} | clicks ${row.clicks ?? 0} | impressions ${row.impressions ?? 0} | CTR ${((row.ctr ?? 0) * 100).toFixed(2)}% | position ${(row.position ?? 0).toFixed(1)}`,
    );
  }
}

function summarizeInspection(inspectionUrl, response) {
  const result = response.inspectionResult ?? {};
  const indexStatus = result.indexStatusResult ?? {};

  return {
    inspectionUrl,
    verdict: indexStatus.verdict,
    coverageState: indexStatus.coverageState,
    robotsTxtState: indexStatus.robotsTxtState,
    indexingState: indexStatus.indexingState,
    pageFetchState: indexStatus.pageFetchState,
    lastCrawlTime: indexStatus.lastCrawlTime,
    userCanonical: indexStatus.userCanonical,
    googleCanonical: indexStatus.googleCanonical,
    raw: response,
  };
}

function printSitemapSummary(sitemaps) {
  for (const sitemap of sitemaps.sitemap ?? []) {
    console.log(
      `  ${sitemap.path} | pending ${Boolean(sitemap.isPending)} | submitted ${sitemap.contents?.[0]?.submitted ?? 0} | indexed ${sitemap.contents?.[0]?.indexed ?? 0} | errors ${sitemap.errors ?? 0} | warnings ${sitemap.warnings ?? 0}`,
    );
  }
}

async function main() {
  const args = parseArgs();
  const secretPath = resolve(
    args.clientSecretPath ?? process.env.GSC_CLIENT_SECRET_PATH ?? process.env.GSC_CLIENT_SECRET ?? findLocalClientSecret(),
  );
  const config = getClientConfig(secretPath);
  const requiredScopes = requiredScopesForArgs(args);
  const token = await authenticate(config, Boolean(args.reauth), requiredScopes);

  if (args.getVerificationFile) {
    const verificationToken = await getVerificationToken(CANONICAL_SITE_URL, token);

    if (!verificationToken.token) {
      throw new Error('Google did not return a FILE verification token.');
    }

    const verificationFilePath = resolve('public', verificationToken.token);
    writeFileSync(verificationFilePath, `google-site-verification: ${verificationToken.token}\n`);
    console.log(`Wrote required verification file: ${verificationFilePath}`);
    console.log('Deploy this file, then run `node scripts/search-console.mjs --fix-canonical`.');
    return;
  }

  if (args.getDomainVerification) {
    const verificationToken = await getDomainVerificationToken(TARGET_DOMAIN, token);
    const report = {
      generatedAt: new Date().toISOString(),
      domain: TARGET_DOMAIN,
      type: 'TXT',
      host: '@',
      value: verificationToken.token,
      note: 'Add this TXT record at the DNS host for accessfreetools.com, wait for DNS propagation, then verify the sc-domain property in Search Console.',
    };
    writeJson(DOMAIN_VERIFICATION_REPORT_PATH, report);
    console.log(`Saved domain verification DNS record to ${DOMAIN_VERIFICATION_REPORT_PATH}`);
    console.log(`TXT host: @`);
    console.log(`TXT value: ${verificationToken.token}`);
    return;
  }

  const sitesResponse = await googleApi('/webmasters/v3/sites', token);
  const sites = sitesResponse.siteEntry ?? [];

  if (args.listSites) {
    console.log('Available Search Console properties:');
    for (const entry of sites) {
      console.log(`  ${entry.siteUrl} (${entry.permissionLevel})`);
    }
    return;
  }

  if (args.submitDiscovery) {
    const site = chooseSite(sites, args.siteUrl);

    if (!site) {
      throw new Error('No verified accessfreetools.com Search Console property is available for sitemap submission.');
    }

    const discoveryUrls = [CANONICAL_SITEMAP_URL, CANONICAL_FEED_URL];
    const submissions = [];

    for (const discoveryUrl of discoveryUrls) {
      console.log(`Submitting ${discoveryUrl} to ${site.siteUrl}`);
      await submitSitemap(site.siteUrl, discoveryUrl, token);
      submissions.push(discoveryUrl);
    }

    const sitemaps = await listSitemaps(site.siteUrl, token);
    const report = {
      generatedAt: new Date().toISOString(),
      site,
      submissions,
      sitemaps,
    };
    writeJson(DISCOVERY_REPORT_PATH, report);
    console.log(`Saved discovery report to ${DISCOVERY_REPORT_PATH}`);
    printSitemapSummary(sitemaps);
    return;
  }

  if (args.inspectKeyUrls) {
    const site = chooseSite(sites, args.siteUrl);

    if (!site) {
      throw new Error('No verified accessfreetools.com Search Console property is available for URL inspection.');
    }

    const urlsToInspect = args.urls.length > 0 ? args.urls : KEY_INSPECTION_URLS;
    const inspections = [];

    for (const inspectionUrl of urlsToInspect) {
      try {
        console.log(`Inspecting ${inspectionUrl}`);
        const response = await inspectUrl(site.siteUrl, inspectionUrl, token);
        const summary = summarizeInspection(inspectionUrl, response);
        inspections.push(summary);
        console.log(
          `  verdict ${summary.verdict ?? 'unknown'} | coverage ${summary.coverageState ?? 'unknown'} | fetch ${summary.pageFetchState ?? 'unknown'}`,
        );
      } catch (error) {
        inspections.push({
          inspectionUrl,
          error: error.message,
        });
        console.log(`  failed: ${error.message}`);
      }
    }

    const report = {
      generatedAt: new Date().toISOString(),
      site,
      inspections,
    };
    writeJson(URL_INSPECTION_REPORT_PATH, report);
    console.log(`Saved URL inspection report to ${URL_INSPECTION_REPORT_PATH}`);
    return;
  }

  if (args.fixCanonical) {
    console.log(`Adding canonical HTTPS property: ${CANONICAL_SITE_URL}`);
    await addSite(CANONICAL_SITE_URL, token);

    const refreshedSitesResponse = await googleApi('/webmasters/v3/sites', token);
    const refreshedSites = refreshedSitesResponse.siteEntry ?? [];
    const canonicalSite = refreshedSites.find((entry) => entry.siteUrl === CANONICAL_SITE_URL);

    if (!canonicalSite || canonicalSite.permissionLevel === 'siteUnverifiedUser') {
      let verificationToken;

      try {
        console.log('Trying Site Verification API with the currently live HTML-file method.');
        await verifySite(CANONICAL_SITE_URL, token);
      } catch (error) {
        console.log('Google did not accept the currently live verification file for this OAuth user.');
        verificationToken = await getVerificationToken(CANONICAL_SITE_URL, token);

        if (verificationToken.token) {
          const verificationFilePath = resolve('public', verificationToken.token);
          writeFileSync(verificationFilePath, `google-site-verification: ${verificationToken.token}\n`);
          console.log(`Wrote required verification file: ${verificationFilePath}`);
        }
      }

      const afterVerificationSitesResponse = await googleApi('/webmasters/v3/sites', token);
      const afterVerificationSite = (afterVerificationSitesResponse.siteEntry ?? []).find(
        (entry) => entry.siteUrl === CANONICAL_SITE_URL,
      );

      if (afterVerificationSite && afterVerificationSite.permissionLevel !== 'siteUnverifiedUser') {
        console.log(`Canonical HTTPS property verified: ${afterVerificationSite.permissionLevel}`);
        console.log(`Submitting sitemap: ${CANONICAL_SITEMAP_URL}`);
        await submitSitemap(CANONICAL_SITE_URL, CANONICAL_SITEMAP_URL, token);
        const sitemaps = await listSitemaps(CANONICAL_SITE_URL, token);
        const report = {
          generatedAt: new Date().toISOString(),
          status: 'fixed',
          canonicalSite: afterVerificationSite,
          sitemaps,
        };
        writeJson(CANONICAL_FIX_REPORT_PATH, report);
        console.log(`Saved canonical fix report to ${CANONICAL_FIX_REPORT_PATH}`);
        return;
      }

      const report = {
        generatedAt: new Date().toISOString(),
        status: verificationToken?.token ? 'needs-verification-file-deploy' : 'needs-manual-verification',
        canonicalSiteUrl: CANONICAL_SITE_URL,
        canonicalSite: afterVerificationSite ?? canonicalSite,
        requiredVerificationFile: verificationToken?.token ? `/public/${verificationToken.token}` : undefined,
        availableSites: afterVerificationSitesResponse.siteEntry ?? refreshedSites,
        note: verificationToken?.token
          ? 'Deploy the generated verification file, then run `node scripts/search-console.mjs --fix-canonical` again.'
          : 'Google added or listed the HTTPS property, but this OAuth user is not verified as an owner for it yet.',
      };
      writeJson(CANONICAL_FIX_REPORT_PATH, report);
      console.log(`Google did not return owner access for ${CANONICAL_SITE_URL}.`);
      console.log(`Saved report to ${CANONICAL_FIX_REPORT_PATH}`);
      process.exitCode = 1;
      return;
    }

    console.log(`Canonical HTTPS property permission: ${canonicalSite.permissionLevel}`);
    console.log(`Submitting sitemap: ${CANONICAL_SITEMAP_URL}`);
    await submitSitemap(CANONICAL_SITE_URL, CANONICAL_SITEMAP_URL, token);
    await submitSitemap(CANONICAL_SITE_URL, CANONICAL_FEED_URL, token);
    const sitemaps = await listSitemaps(CANONICAL_SITE_URL, token);
    const report = {
      generatedAt: new Date().toISOString(),
      status: 'fixed',
      canonicalSite,
      sitemaps,
    };
    writeJson(CANONICAL_FIX_REPORT_PATH, report);
    console.log(`Saved canonical fix report to ${CANONICAL_FIX_REPORT_PATH}`);

    printSitemapSummary(sitemaps);

    return;
  }

  const site = chooseSite(sites, args.siteUrl);

  if (!site) {
    console.log('Connected to Google, but no Search Console property matched accessfreetools.com.');
    console.log('Available properties:');
    for (const entry of sites) {
      console.log(`  ${entry.siteUrl} (${entry.permissionLevel})`);
    }
    process.exitCode = 1;
    return;
  }

  const startDate = args.startDate ?? isoDateDaysAgo(28);
  const endDate = args.endDate ?? isoDateDaysAgo(2);
  const commonBody = {
    startDate,
    endDate,
    rowLimit: 25,
  };
  const total = await queryPerformance(site.siteUrl, token, commonBody);
  const byQuery = await queryPerformance(site.siteUrl, token, { ...commonBody, dimensions: ['query'] });
  const byPage = await queryPerformance(site.siteUrl, token, { ...commonBody, dimensions: ['page'] });
  const byPageQuery = await queryPerformance(site.siteUrl, token, {
    ...commonBody,
    dimensions: ['page', 'query'],
    rowLimit: 50,
  });
  const byDate = await queryPerformance(site.siteUrl, token, { ...commonBody, dimensions: ['date'] });
  const totalRows = total.rows ?? [];
  const totals = totalRows[0] ?? {
    clicks: sumMetric(byDate.rows, 'clicks'),
    impressions: sumMetric(byDate.rows, 'impressions'),
    ctr: 0,
    position: 0,
  };
  const report = {
    generatedAt: new Date().toISOString(),
    site,
    range: { startDate, endDate },
    totals,
    byQuery: byQuery.rows ?? [],
    byPage: byPage.rows ?? [],
    byPageQuery: byPageQuery.rows ?? [],
    byDate: byDate.rows ?? [],
  };

  writeJson(REPORT_PATH, report);

  console.log(`\nConnected Search Console property: ${site.siteUrl} (${site.permissionLevel})`);
  console.log(`Date range: ${startDate} to ${endDate}`);
  console.log(
    `Totals: clicks ${totals.clicks ?? 0} | impressions ${totals.impressions ?? 0} | CTR ${(((totals.ctr ?? 0) * 100) || 0).toFixed(2)}% | avg position ${((totals.position ?? 0) || 0).toFixed(1)}`,
  );
  printRows('Top queries', byQuery.rows, 'query');
  printRows('Top pages', byPage.rows, 'page');
  printRows('Top page/query pairs', byPageQuery.rows, 'page | query');
  printRows('Daily rows', byDate.rows, 'date');
  console.log(`\nSaved local report to ${REPORT_PATH}`);
  console.log(`Saved OAuth token to ${TOKEN_PATH}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
