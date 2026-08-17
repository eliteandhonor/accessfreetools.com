import { readFileSync } from 'node:fs';
import http from 'node:http';
import https from 'node:https';
import { redirectLocationForRequest } from './hostinger-request-redirects.mjs';

function runtimeOptions() {
  const parsedPort = Number(process.env.PORT);
  const port = process.env.PORT && process.env.PORT !== 'undefined' && Number.isFinite(parsedPort) && parsedPort > 0
    ? parsedPort
    : 3000;
  const host = process.env.HOST && process.env.HOST !== 'undefined' ? process.env.HOST : '0.0.0.0';
  process.env.PORT = String(port);
  process.env.HOST = host;
  return { host, port };
}

function createRuntimeServer(listener) {
  if (process.env.SERVER_CERT_PATH && process.env.SERVER_KEY_PATH) {
    return https.createServer(
      {
        cert: readFileSync(process.env.SERVER_CERT_PATH),
        key: readFileSync(process.env.SERVER_KEY_PATH),
      },
      listener,
    );
  }

  return http.createServer(listener);
}

export async function startHostingerServer(entryUrl) {
  const { host, port } = runtimeOptions();
  process.env.ASTRO_NODE_AUTOSTART = 'disabled';
  const { handler } = await import(entryUrl.href);
  const server = createRuntimeServer((request, response) => {
    const location = redirectLocationForRequest(request.url, request.method);
    if (location) {
      response.statusCode = 301;
      response.setHeader('Location', location);
      response.setHeader('X-Content-Type-Options', 'nosniff');
      response.end();
      return;
    }

    handler(request, response);
  });

  server.listen(port, host, () => {
    console.log(`Access Free Tools server listening on http://${host}:${port}`);
  });
  return server;
}
