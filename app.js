import { startHostingerServer } from './scripts/lib/hostinger-server.mjs';

startHostingerServer(new URL('./dist/server/entry.mjs', import.meta.url)).catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
