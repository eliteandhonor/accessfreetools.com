import { cpSync, existsSync, readdirSync, writeFileSync } from 'node:fs';
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

writeFileSync(join(distDir, 'app.js'), "import './server/entry.mjs';\n");

console.log('Mirrored dist/client into dist and wrote dist/app.js for output-directory starts.');
