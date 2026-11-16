import bundledAnnouncements from "./announcements.json" with { type: "json" };

const START_COUNT = 20673;
const ANNOUNCEMENTS_KEY = "announcements";

const ALLOWED_ORIGINS = new Set([
  "https://desktoppet.app",
  "https://www.desktoppet.app",
  "https://edithharrison.github.io",
  "http://127.0.0.1:8765",
  "http://localhost:8765",
]);

function responseHeaders(origin, cacheControl = "no-store") {
  const headers = {
    "content-type": "application/json; charset=utf-8",
    "cache-control": cacheControl,
  };

  if (origin && ALLOWED_ORIGINS.has(origin)) {
    headers["access-control-allow-origin"] = origin;
    headers["access-control-allow-methods"] = "GET, POST, OPTIONS";
    headers["vary"] = "Origin";
  }

  return headers;
}

function jsonResponse(body, status, origin, cacheControl) {
  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders(origin, cacheControl),
  });
}

let announcementStored = false;

async function storeAnnouncements(downloads) {
  if (announcementStored) {
    return;
  }
  announcementStored = true;
  try {
    const stored = await downloads.get(ANNOUNCEMENTS_KEY, "json");
    if (!isAnnouncementFeed(stored) || feedTime(bundledAnnouncements) > feedTime(stored)) {
      await downloads.put(ANNOUNCEMENTS_KEY, JSON.stringify(bundledAnnouncements));
    }
  } catch (error) {
    announcementStored = false;
  }
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

function feedTime(data) {
  const time = Date.parse(data && data.updatedAt);
  return Number.isFinite(time) ? time : 0;
}

function isAnnouncementFeed(data) {
  return Boolean(data) && Array.isArray(data.announcements);
}

export default {
  async fetch(request, env, ctx) {
    const origin = request.headers.get("Origin");
    const { pathname } = new URL(request.url);

    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: responseHeaders(origin) });
    }

    if (request.method === "GET" && pathname === "/") {
      const count = await currentCount(env.DOWNLOADS);
      return jsonResponse({ count }, 200, origin);
    }

    if (request.method === "GET" && pathname === "/announcement") {
      ctx.waitUntil(storeAnnouncements(env.DOWNLOADS));
      return jsonResponse(bundledAnnouncements, 200, origin, "public, max-age=300");
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
