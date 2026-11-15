const START_COUNT = 20673;

const ALLOWED_ORIGINS = new Set([
  "https://desktoppet.app",
  "https://www.desktoppet.app",
  "https://edithharrison.github.io",
  "http://127.0.0.1:8765",
  "http://localhost:8765",
]);

function responseHeaders(origin) {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
  };

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["access-control-allow-origin"] = origin;
    headers["access-control-allow-methods"] = "GET, POST, OPTIONS";
    headers["vary"] = "Origin";
  }

  return headers;
}

function jsonResponse(body, status, origin) {
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders(origin),
  });
}

async function currentCount(downloads) {
  const stored = await downloads.get("count");
  if (stored == null) {
    await downloads.put("count", String(START_COUNT));
    return START_COUNT;
  }

  const count = Number(stored);
  if (!Number.isFinite(count)) {
    await downloads.put("count", String(START_COUNT));
    return START_COUNT;
  }

  return count;
}

export default {
  async fetch(request, env) {
    const origin = request.headers.get("Origin");
    const { pathname } = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: responseHeaders(origin) });
    }

    if (request.method === "GET" && pathname === "/") {
      const count = await currentCount(env.DOWNLOADS);
      return jsonResponse({ count }, 200, origin);
    }

    if (request.method === "POST" && pathname === "/hit") {
      if (!origin || !ALLOWED_ORIGINS.has(origin)) {
        return jsonResponse({ error: "forbidden" }, 403, origin);
      }

      const count = (await currentCount(env.DOWNLOADS)) + 1;
      await env.DOWNLOADS.put("count", String(count));
      return jsonResponse({ count }, 200, origin);
    }

    return jsonResponse({ error: "not found" }, 404, origin);
  },
};
