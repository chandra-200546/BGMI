import "./lib/error-capture";

import { consumeLastCapturedError } from "./lib/error-capture";
import { renderErrorPage } from "./lib/error-page";
import {
  getAdminSnapshot,
  getPlatformData,
  runAdminCommand,
  submitPublicRegistration,
  validateAdminKey,
} from "./lib/platform-data.server";

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

async function handleAuthApi(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/auth")) return undefined;

  const supabaseUrl =
    process.env.SUPABASE_URL ||
    process.env.VITE_SUPABASE_URL ||
    "";
  const supabaseAnonKey =
    process.env.SUPABASE_ANON_KEY ||
    process.env.VITE_SUPABASE_ANON_KEY ||
    "";

  if (url.pathname === "/api/auth/config") {
    return jsonResponse({
      supabaseUrl,
      supabaseAnonKey,
      isConfigured: Boolean(supabaseUrl && supabaseAnonKey),
    });
  }

  if (url.pathname === "/api/auth/google") {
    if (!supabaseUrl) {
      return jsonResponse(
        { error: "SUPABASE_URL is not configured in server environment" },
        { status: 500 }
      );
    }
    const origin = url.origin;
    const redirectTo = `${origin}/dashboard`;
    const targetUrl = `${supabaseUrl.replace(/\/$/, "")}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(redirectTo)}`;
    return Response.redirect(targetUrl, 302);
  }

  return jsonResponse({ error: "Auth API route not found" }, { status: 404 });
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

async function handleAdminApi(request: Request): Promise<Response | undefined> {
  const url = new URL(request.url);
  if (!url.pathname.startsWith("/api/admin")) return undefined;
  if (request.method !== "POST") {
    return jsonResponse({ error: "Method not allowed" }, { status: 405 });
  }

  try {
    const payload = await request.json();
    if (url.pathname === "/api/admin/auth") {
      const isValid = await validateAdminKey((payload as { adminKey?: unknown }).adminKey);
      if (!isValid) {
        return jsonResponse({ error: "Invalid admin password. Please try again." }, { status: 401 });
      }
      return jsonResponse({ data: { ok: true } });
    }

    if (url.pathname === "/api/admin/command") {
      const result = await runAdminCommand(payload);
      return jsonResponse({ data: result }, { status: 201 });
    }

    if (url.pathname === "/api/admin/snapshot") {
      const result = await getAdminSnapshot(payload);
      return jsonResponse({ data: result });
    }

    return jsonResponse({ error: "Admin API route not found" }, { status: 404 });
  } catch (error) {
    return jsonResponse(
      { error: error instanceof Error ? error.message : "Admin command failed" },
      { status: 400 },
    );
  }
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
  async fetch(request: Request, env: unknown, ctx: unknown): Promise<Response> {
    const authApiResponse = await handleAuthApi(request);
    if (authApiResponse) return authApiResponse;

    const publicApiResponse = await handlePublicApi(request);
    if (publicApiResponse) return publicApiResponse;

    const adminApiResponse = await handleAdminApi(request);
    if (adminApiResponse) return adminApiResponse;

    try {
      const serverEntry = await getServerEntry();
      const response = await serverEntry.fetch(request, env, ctx);
      return await normalizeCatastrophicSsrResponse(response);
    } catch (error) {
      console.error(consumeLastCapturedError() ?? error);
      return new Response(renderErrorPage(), {
        status: 500,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    }
  },
};
