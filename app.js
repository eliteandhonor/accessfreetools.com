const parsedPort = Number(process.env.PORT);
if (!process.env.PORT || process.env.PORT === 'undefined' || !Number.isFinite(parsedPort) || parsedPort <= 0) {
  process.env.PORT = '3000';
}

if (!process.env.HOST || process.env.HOST === 'undefined') {
  process.env.HOST = '0.0.0.0';
}

await import('./dist/server/entry.mjs');
