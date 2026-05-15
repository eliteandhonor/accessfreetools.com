import { cpSync, existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';

const distDir = join(process.cwd(), 'dist');
const clientDir = join(distDir, 'client');

if (!existsSync(clientDir)) {
  console.log('No dist/client directory found. Static mirror skipped.');
  process.exit(0);
}

for (const entry of readdirSync(clientDir, { withFileTypes: true })) {
  const source = join(clientDir, entry.name);
  const destination = join(distDir, entry.name);

  cpSync(source, destination, {
    force: true,
    recursive: entry.isDirectory(),
  });
}

writeFileSync(
  join(distDir, 'app.js'),
  [
    "const parsedPort = Number(process.env.PORT);",
    "if (!process.env.PORT || process.env.PORT === 'undefined' || !Number.isFinite(parsedPort) || parsedPort <= 0) {",
    "  process.env.PORT = '3000';",
    '}',
    "if (!process.env.HOST || process.env.HOST === 'undefined') {",
    "  process.env.HOST = '0.0.0.0';",
    '}',
    "import('./server/entry.mjs').catch((error) => {",
    '  console.error(error);',
    '  process.exitCode = 1;',
    '});',
    '',
  ].join('\n'),
);

const serverChunksDir = join(distDir, 'server', 'chunks');
let patchedServerChunks = 0;

if (existsSync(serverChunksDir)) {
  for (const entry of readdirSync(serverChunksDir, { withFileTypes: true })) {
    if (!entry.isFile() || !/^server_.*\.mjs$/.test(entry.name)) continue;

    const path = join(serverChunksDir, entry.name);
    const source = readFileSync(path, 'utf8');
    const patched = source.replace(
      [
        'const port = process.env.PORT ? Number(process.env.PORT) : options.port ?? 8080;',
        '  const host = process.env.HOST ?? hostOptions(options.host);',
      ].join('\n'),
      [
        "const rawPort = process.env.PORT;",
        "const parsedPort = rawPort && rawPort !== 'undefined' ? Number(rawPort) : NaN;",
        "const rawOptionPort = options.port;",
        "const parsedOptionPort = rawOptionPort && rawOptionPort !== 'undefined' ? Number(rawOptionPort) : NaN;",
        'const port = Number.isFinite(parsedPort) && parsedPort > 0 ? parsedPort : Number.isFinite(parsedOptionPort) && parsedOptionPort > 0 ? parsedOptionPort : 8080;',
        "const rawHost = process.env.HOST;",
        'const optionHost = hostOptions(options.host);',
        "const host = rawHost && rawHost !== 'undefined' ? rawHost : optionHost && optionHost !== 'undefined' ? optionHost : '0.0.0.0';",
      ].join('\n  '),
    );

    if (patched !== source) {
      writeFileSync(path, patched);
      patchedServerChunks += 1;
    }
  }
}

console.log(
  `Mirrored dist/client into dist, wrote dist/app.js, and patched ${patchedServerChunks} server chunk(s) for Hostinger starts.`,
);
