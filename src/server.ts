import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import { getPlatformData, submitPublicRegistration } from "./lib/platform-data.server";

type ServerEntry = {
  fetch: (request: Request, env: unknown, ctx: unknown) => Promise<Response> | Response;
};

let serverEntryPromise: Promise<ServerEntry> | undefined;

async function getServerEntry(): Promise<ServerEntry> {
  if (!serverEntryPromise) {
    serverEntryPromise = import("@tanstack/react-start/server-entry").then(
      (m) => (m.default ?? m) as ServerEntry,
    );
  }
  return serverEntryPromise;
}

// h3 swallows in-handler throws into a normal 500 Response with body
// {"unhandled":true,"message":"HTTPError"} — try/catch alone never fires for those.
async function normalizeCatastrophicSsrResponse(response: Response): Promise<Response> {
  if (response.status < 500) return response;
  const contentType = response.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) return response;

  const body = await response.clone().text();
  if (!isH3SwallowedErrorBody(body)) return response;

  console.error(consumeLastCapturedError() ?? new Error(`h3 swallowed SSR error: ${body}`));
  return new Response(renderErrorPage(), {
    status: 500,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function jsonResponse(payload: unknown, init?: ResponseInit) {
  return new Response(JSON.stringify(payload), {
    ...init,
    headers: {
      "content-type": "application/json; charset=utf-8",
      "cache-control": "no-store",
      ...(init?.headers ?? {}),
    },
  });
}

async function handlePublicApi(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/public")) return undefined;

  if (url.pathname === "/api/public/register") {
    if (request.method !== "POST") {
      return jsonResponse({ error: "Method not allowed" }, { status: 405 });
    }

    try {
      const result = await submitPublicRegistration(await request.json());
      return jsonResponse({ data: result }, { status: 201 });
    } catch (error) {
      return jsonResponse(
        { error: error instanceof Error ? error.message : "Registration submission failed" },
        { status: 400 },
      );
    }
  }

  const data = await getPlatformData();

  if (url.pathname === "/api/public/live") {
    return jsonResponse(data);
  }

  if (url.pathname === "/api/public/tournaments") {
    return jsonResponse({
      data: data.tournaments,
      generatedAt: data.generatedAt,
      source: data.source,
      message: data.message,
    });
  }

  if (url.pathname.startsWith("/api/public/leaderboard")) {
    return jsonResponse({
      data: data.teams,
      generatedAt: data.generatedAt,
      source: data.source,
      message: data.message,
    });
  }

  if (url.pathname.startsWith("/api/public/schedule")) {
    return jsonResponse({
      data: data.schedules,
      generatedAt: data.generatedAt,
      source: data.source,
      message: data.message,
    });
  }

  if (url.pathname === "/api/public/announcements") {
    return jsonResponse({
      data: data.announcements,
      generatedAt: data.generatedAt,
      source: data.source,
      message: data.message,
    });
  }

  return jsonResponse({ error: "Public API route not found" }, { status: 404 });
}

function isH3SwallowedErrorBody(body: string): boolean {
  try {
    const payload = JSON.parse(body) as { unhandled?: unknown; message?: unknown };
    return payload.unhandled === true && payload.message === "HTTPError";
  } catch {
    return false;
  }
}

export default {
  async fetch(request: Request, env: unknown, ctx: unknown) {
    try {
      const apiResponse = await handlePublicApi(request);
      if (apiResponse) return apiResponse;

      const handler = await getServerEntry();
      const response = await handler.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
