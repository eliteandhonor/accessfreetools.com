export function isTransientHttpStatus(status) {
  return [502, 503, 504].includes(Number(status));
}

export function isSameUrlRedirect(response, url) {
  if (response.status < 300 || response.status >= 400) return false;
  const location = response.headers.get('location');
  if (!location) return false;
  return new URL(location, url).href === url;
}

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

export async function fetchWithTransientRetry(
  url,
  init = {},
  {
    attempts = 3,
    fetchImpl = fetch,
    retryDelayMs = 0,
  } = {},
) {
  let response;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    response = await fetchImpl(url, init);
    if (!isTransientHttpStatus(response.status) || attempt === attempts) {
      return { attempts: attempt, response };
    }

    await response.arrayBuffer().catch(() => {});
    if (retryDelayMs > 0) {
      await sleep(retryDelayMs * attempt);
    }
  }

  return { attempts, response };
}
