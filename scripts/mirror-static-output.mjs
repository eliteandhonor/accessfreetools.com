import { copyFileSync, cpSync, existsSync, mkdirSync, readdirSync, writeFileSync } from 'node:fs';
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

const serverDir = join(distDir, 'server');
mkdirSync(serverDir, { recursive: true });
copyFileSync(join(process.cwd(), 'scripts', 'lib', 'hostinger-server.mjs'), join(serverDir, 'hostinger-server.mjs'));
copyFileSync(
  join(process.cwd(), 'scripts', 'lib', 'hostinger-request-redirects.mjs'),
  join(serverDir, 'hostinger-request-redirects.mjs'),
);

writeFileSync(
  join(distDir, 'app.js'),
  [
    "import { startHostingerServer } from './server/hostinger-server.mjs';",
    '',
    "startHostingerServer(new URL('./server/entry.mjs', import.meta.url)).catch((error) => {",
    '  console.error(error);',
    '  process.exitCode = 1;',
    '});',
    '',
  ].join('\n'),
);

console.log('Mirrored dist/client and wrote the guarded Node 24 Hostinger entry.');
