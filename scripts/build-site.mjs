import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join } from 'node:path';
import { existsSync, writeFileSync } from 'node:fs';
import { captureReleaseSource, createBuildIdentity } from './lib/release-identity.mjs';

const require = createRequire(import.meta.url);
const before = captureReleaseSource();
const astroPackage = require.resolve('astro/package.json');
const astroBin = join(dirname(astroPackage), require(astroPackage).bin.astro);
const result = spawnSync(process.execPath, [astroBin, 'build'], { stdio: 'inherit', windowsHide: true });
if (result.status !== 0) process.exit(result.status ?? 1);
if (!existsSync('dist/client')) throw new Error('Astro build produced no dist/client; build identity was not written.');
await import('./mirror-static-output.mjs');
const identity = createBuildIdentity(before, captureReleaseSource());
for (const dir of ['dist/client', 'dist']) writeFileSync(join(dir, '_build.json'), `${JSON.stringify(identity, null, 2)}\n`);
console.log(`Build source identity: ${identity.commit ?? 'unavailable'}; ${identity.clean ? 'clean' : 'unverified'}.`);
