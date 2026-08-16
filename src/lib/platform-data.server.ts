import { PrismaClient } from "@prisma/client";

import type {
  AnnouncementItem,
  PlatformData,
  ScheduleItem,
  Status,
  Team,
  Tournament,
} from "./platform-types";

const globalForPrisma = globalThis as typeof globalThis & {
  prisma?: PrismaClient;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const accentClasses = [
  "from-cyan-400 to-fuchsia-500",
  "from-red-500 to-orange-400",
  "from-violet-400 to-blue-500",
  "from-emerald-300 to-cyan-400",
];

type SupabaseTournament = {
  id: string;
  name: string;
  mode: string;
  status: string;
  prize_pool: number;
  entry_fee: number;
  max_teams: number;
  registered_teams: number;
  starts_at: string;
  registration_deadline: string;
  maps: string[] | string | null;
  phase: string | null;
  accent: string | null;
  media_url?: string | null;
  idp_timings?: string | null;
  room_id?: string | null;
  room_password?: string | null;
};

type SupabaseTeam = {
  id: string;
  name: string;
  short_name: string;
  region: string;
  captain: string;
  matches_played: number;
  wwcd: number;
  placement_points: number;
  finishes: number;
  penalty_points: number;
  recent_form: string[] | string | null;
  preferred_drop: string | null;
};

type SupabaseMatch = {
  id: string;
  name: string;
  starts_at: string;
  map: string;
  status: string;
  group_name: string;
  room_id?: string | null;
  room_password?: string | null;
};

type SupabaseAnnouncement = {
  id: string;
  category: string;
  title: string;
  body?: string;
  pinned: boolean;
  publish_at: string;
};

type SupabaseRegistrationSubmission = {
  id: string;
  tournament_id: string | null;
  team_name: string;
  logo_file_name: string | null;
  captain_name: string;
  captain_email: string;
  bgmi_uid: string;
  players: string[] | string | null;
  whatsapp: string | null;
  discord: string | null;
  payment_file_name: string | null;
  status: string;
  created_at: string;
};

export type PublicRegistrationSubmission = {
  tournamentId: string;
  teamName: string;
  logoFileName?: string;
  captainName: string;
  captainEmail: string;
  bgmiUid: string;
  players: string[];
  whatsapp?: string;
  discord?: string;
  paymentFileName?: string;
};

export type AdminCommandPayload = {
  adminKey?: string;
  action?:
    | "announcement"
    | "tournament"
    | "match"
    | "registrationStatus"
    | "updateRoomCredentials"
    | "deleteTournament"
    | "deleteAnnouncement"
    | "deleteRegistration"
    | "deleteMatch"
    | "deleteTeam"
    | "wipeSeedData";
  title?: string;
  body?: string;
  category?: string;
  pinned?: boolean;
  tournamentId?: string;
  announcementId?: string;
  tournamentName?: string;
  mode?: string;
  prizePool?: string | number;
  entryFee?: string | number;
  maxTeams?: string | number;
  startsAt?: string;
  registrationDeadline?: string;
  maps?: string;
  mediaUrl?: string;
  matchName?: string;
  matchMap?: string;
  matchGroup?: string;
  matchStartsAt?: string;
  matchId?: string;
  teamId?: string;
  registrationId?: string;
  registrationStatus?: string;
  roomId?: string;
  roomPassword?: string;
};

function formatCurrency(value: number) {
  if (value === 0) return "Free";
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDate(value?: Date | null) {
  if (!value) return "TBA";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(value);
}

function parseList(value: string[] | string | null | undefined) {
  if (Array.isArray(value)) return value;
  if (!value) return [];
  try {
    const parsed = JSON.parse(value) as unknown;
    return Array.isArray(parsed) ? parsed.map(String) : value.split(",").map((item) => item.trim());
  } catch {
    return value.split(",").map((item) => item.trim());
  }
}

function supabaseStatus(status: string, registered: number, maxTeams: number): Status {
  if (registered >= maxTeams) return "Full";
  const normalized = status.toUpperCase().replaceAll(" ", "_");
  if (normalized === "LIVE") return "Live";
  if (normalized === "COMPLETED") return "Completed";
  if (normalized === "REGISTRATION_OPEN") {
    return maxTeams - registered <= Math.max(3, Math.ceil(maxTeams * 0.1))
      ? "Closing Soon"
      : "Registration Open";
  }
  return "Completed";
}

async function supabaseAdminGet<T>(path: string): Promise<T[]> {
  const url = process.env.SUPABASE_URL;
  const keys = [process.env.SUPABASE_SERVICE_ROLE_KEY, process.env.SUPABASE_ANON_KEY].filter(
    Boolean,
  ) as string[];
  if (!url || keys.length === 0) return [];

  let lastError: Error | undefined;
  for (const key of keys) {
    const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${path}`, {
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        accept: "application/json",
      },
    });

    if (response.ok) return (await response.json()) as T[];
    lastError = new Error(`Supabase admin REST request failed for ${path}: ${response.status}`);
  }

  throw lastError ?? new Error(`Supabase admin REST request failed for ${path}`);
}

async function optionalSupabaseAdminGet<T>(
  path: string,
  warning: string,
): Promise<{ rows: T[]; warning?: string }> {
  try {
    return { rows: await supabaseAdminGet<T>(path) };
  } catch (error) {
    return { rows: [], warning: `${warning}: ${error instanceof Error ? error.message : "Error"}` };
  }
}

async function supabaseGet<T>(path: string): Promise<T[]> {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_ANON_KEY ?? process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return [];

  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${path}`, {
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Supabase REST request failed for ${path}: ${response.status}`);
  }

  return (await response.json()) as T[];
}

export async function validateAdminKey(candidateKey?: unknown) {
  if (typeof candidateKey !== "string" || !candidateKey.trim()) return false;
  const targetKey = candidateKey.trim();

  // Primary check: Supabase admin_settings table row `key = 'admin_password'`
  try {
    const settings = await supabaseAdminGet<{ key: string; value: string }>(
      "admin_settings?key=eq.admin_password",
    );
    if (settings.length && settings[0]?.value) {
      if (targetKey === settings[0].value.trim()) return true;
    }
  } catch {
    // fallback
  }

  // Environment variable check
  const envAdminPass = process.env.ADMIN_PASSWORD || process.env.VITE_ADMIN_PASSWORD;
  if (envAdminPass && targetKey === envAdminPass.trim()) return true;

  // Official passcode fallback checks
  const lowerKey = targetKey.toLowerCase();
  return (
    lowerKey === "vinaygbmi!@#$%^&*" ||
    lowerKey === "bgmi!@#$%" ||
    lowerKey === "vinaygbmi!@#$%" ||
    lowerKey === "bgmi!@#$%^&*"
  );
}

function numberValue(input: unknown, fallback = 0): number {
  if (typeof input === "number") return input;
  if (typeof input === "string") {
    const parsed = Number(input.replace(/[^0-9.]/g, ""));
    return Number.isNaN(parsed) ? fallback : parsed;
  }
  return fallback;
}

function isoValue(input?: string, offsetDays = 7): string {
  if (input) {
    const date = new Date(input);
    if (!Number.isNaN(date.getTime())) return date.toISOString();
  }
  return new Date(Date.now() + offsetDays * 86_400_000).toISOString();
}

async function supabaseInsert(table: string, payload: Record<string, unknown>) {
  const url = process.env.SUPABASE_URL;
  const keys = [process.env.SUPABASE_SERVICE_ROLE_KEY, process.env.SUPABASE_ANON_KEY].filter(
    Boolean,
  ) as string[];
  if (!url || keys.length === 0) throw new Error("Supabase is not configured");

  let lastError = "";
  for (const key of keys) {
    const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${table}`, {
      method: "POST",
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
        prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) return (await response.json()) as unknown;
    lastError = await response.text();

    // If PostgREST fails because media_url column is missing in database schema cache (PGRST204), retry without media_url
    if (lastError.includes("PGRST204") || lastError.includes("media_url")) {
      const sanitized = { ...payload };
      delete sanitized.media_url;
      delete sanitized.mediaUrl;
      const retryResponse = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${table}`, {
        method: "POST",
        headers: {
          apikey: key,
          authorization: `Bearer ${key}`,
          "content-type": "application/json",
          prefer: "return=representation",
        },
        body: JSON.stringify(sanitized),
      });

      if (retryResponse.ok) return (await retryResponse.json()) as unknown;
    }
  }

  throw new Error(`Supabase ${table} insert failed: ${lastError}`);
}

async function supabasePatch(table: string, id: string, payload: Record<string, unknown>) {
  const url = process.env.SUPABASE_URL;
  const keys = [process.env.SUPABASE_SERVICE_ROLE_KEY, process.env.SUPABASE_ANON_KEY].filter(
    Boolean,
  ) as string[];
  if (!url || keys.length === 0) throw new Error("Supabase is not configured");

  let lastError = "";
  for (const key of keys) {
    const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${table}?id=eq.${id}`, {
      method: "PATCH",
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
        "content-type": "application/json",
        prefer: "return=representation",
      },
      body: JSON.stringify(payload),
    });

    if (response.ok) return (await response.json()) as unknown;
    lastError = await response.text();

    if (lastError.includes("PGRST204") || lastError.includes("media_url")) {
      const sanitized = { ...payload };
      delete sanitized.media_url;
      delete sanitized.mediaUrl;
      const retryResponse = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${table}?id=eq.${id}`, {
        method: "PATCH",
        headers: {
          apikey: key,
          authorization: `Bearer ${key}`,
          "content-type": "application/json",
          prefer: "return=representation",
        },
        body: JSON.stringify(sanitized),
      });

      if (retryResponse.ok) return (await retryResponse.json()) as unknown;
    }
  }

  throw new Error(`Supabase ${table} update failed: ${lastError}`);
}

async function supabaseDelete(table: string, id: string) {
  const url = process.env.SUPABASE_URL;
  const keys = [process.env.SUPABASE_SERVICE_ROLE_KEY, process.env.SUPABASE_ANON_KEY].filter(
    Boolean,
  ) as string[];
  if (!url || keys.length === 0) throw new Error("Supabase is not configured");

  let lastError = "";
  for (const key of keys) {
    const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${table}?id=eq.${id}`, {
      method: "DELETE",
      headers: {
        apikey: key,
        authorization: `Bearer ${key}`,
      },
    });

    if (response.ok) return true;
    lastError = await response.text();
  }

  throw new Error(`Supabase ${table} delete failed: ${lastError}`);
}

async function supabaseClearTable(table: string) {
  const url = process.env.SUPABASE_URL;
  const keys = [process.env.SUPABASE_SERVICE_ROLE_KEY, process.env.SUPABASE_ANON_KEY].filter(
    Boolean,
  ) as string[];
  if (!url || keys.length === 0) return;

  for (const key of keys) {
    try {
      await fetch(`${url.replace(/\/$/, "")}/rest/v1/${table}?id=not.is.null`, {
        method: "DELETE",
        headers: {
          apikey: key,
          authorization: `Bearer ${key}`,
        },
      });
    } catch {
      // ignore individual delete failures
    }
  }
}

export async function runAdminCommand(payload: unknown) {
  const command = payload as AdminCommandPayload;
  if (!(await validateAdminKey(command.adminKey))) throw new Error("Invalid admin password");

  if (command.action === "wipeSeedData") {
    await Promise.all([
      supabaseClearTable("matches"),
      supabaseClearTable("announcements"),
      supabaseClearTable("teams"),
      supabaseClearTable("tournaments"),
      supabaseClearTable("registration_submissions"),
    ]);
    return { action: command.action, status: "wiped" };
  }

  if (command.action === "announcement") {
    if (!command.title?.trim()) throw new Error("Announcement title is required");
    const id = globalThis.crypto?.randomUUID?.() ?? `ann_${Date.now()}`;
    await supabaseInsert("announcements", {
      id,
      tournament_id: command.tournamentId || null,
      category: command.category?.trim() || "Admin",
      title: command.title.trim(),
      body: command.body?.trim() || command.title.trim(),
      pinned: Boolean(command.pinned),
      publish_at: new Date().toISOString(),
    });
    return { id, action: command.action, status: "published" };
  }

  if (command.action === "tournament") {
    if (!command.tournamentName?.trim()) throw new Error("Tournament name is required");
    const id = globalThis.crypto?.randomUUID?.() ?? `tour_${Date.now()}`;
    await supabaseInsert("tournaments", {
      id,
      name: command.tournamentName.trim(),
      mode: command.mode?.trim() || "Squad",
      status: "REGISTRATION_OPEN",
      prize_pool: numberValue(command.prizePool),
      entry_fee: numberValue(command.entryFee),
      max_teams: numberValue(command.maxTeams, 24),
      registered_teams: 0,
      starts_at: isoValue(command.startsAt, 7),
      registration_deadline: isoValue(command.registrationDeadline, 5),
      maps: String(command.maps || "Erangel, Miramar, Sanhok")
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      phase: "Registration",
      accent: "from-sky-400 to-blue-500",
      media_url: command.mediaUrl?.trim() || null,
      idp_timings: command.idpTimings?.trim() || null,
    });
    return { id, action: command.action, status: "created" };
  }

  if (command.action === "updateTournamentTimings") {
    const id = command.tournamentId?.trim();
    if (!id) throw new Error("Tournament selection is required");
    await supabasePatch("tournaments", id, {
      idp_timings: command.idpTimings?.trim() || null,
      updated_at: new Date().toISOString(),
    });
    return { id, action: command.action, status: "updated" };
  }

  if (command.action === "match") {
    if (!command.matchName?.trim()) throw new Error("Match name is required");
    if (!command.tournamentId?.trim()) throw new Error("Tournament is required");
    const id = globalThis.crypto?.randomUUID?.() ?? `match_${Date.now()}`;
    await supabaseInsert("matches", {
      id,
      tournament_id: command.tournamentId.trim(),
      name: command.matchName.trim(),
      starts_at: isoValue(command.matchStartsAt, 2),
      map: command.matchMap?.trim() || "Erangel",
      status: "UPCOMING",
      group_name: command.matchGroup?.trim() || "Group A",
    });
    return { id, action: command.action, status: "scheduled" };
  }

  if (command.action === "registrationStatus") {
    if (!command.registrationId?.trim()) throw new Error("Registration is required");
    const status = command.registrationStatus?.trim() || "UNDER_REVIEW";
    await supabasePatch("registration_submissions", command.registrationId.trim(), {
      status,
      updated_at: new Date().toISOString(),
    });
    return { id: command.registrationId.trim(), action: command.action, status };
  }

  if (command.action === "updateRoomCredentials") {
    const id = command.tournamentId?.trim() || command.matchId?.trim();
    if (!id) throw new Error("Tournament or Match selection is required");
    const table = command.matchId ? "matches" : "tournaments";
    await supabasePatch(table, id, {
      room_id: command.roomId?.trim() || null,
      room_password: command.roomPassword?.trim() || null,
      updated_at: new Date().toISOString(),
    });
    return { id, action: command.action, status: "updated" };
  }

  if (command.action === "deleteTournament") {
    const id = command.tournamentId?.trim();
    if (!id) throw new Error("Tournament ID is required for deletion");
    await supabaseDelete("tournaments", id);
    return { id, action: command.action, status: "deleted" };
  }

  if (command.action === "deleteAnnouncement") {
    const id = command.announcementId?.trim();
    if (!id) throw new Error("Announcement ID is required for deletion");
    await supabaseDelete("announcements", id);
    return { id, action: command.action, status: "deleted" };
  }

  if (command.action === "deleteRegistration") {
    const id = command.registrationId?.trim();
    if (!id) throw new Error("Registration ID is required for deletion");
    await supabaseDelete("registration_submissions", id);
    return { id, action: command.action, status: "deleted" };
  }

  if (command.action === "deleteMatch") {
    const id = command.matchId?.trim();
    if (!id) throw new Error("Match ID is required for deletion");
    await supabaseDelete("matches", id);
    return { id, action: command.action, status: "deleted" };
  }

  if (command.action === "deleteTeam") {
    const id = command.teamId?.trim();
    if (!id) throw new Error("Team ID is required for deletion");
    await supabaseDelete("teams", id);
    return { id, action: command.action, status: "deleted" };
  }

  throw new Error("Unsupported admin command");
}

export async function submitPublicRegistration(payload: PublicRegistrationSubmission) {
  if (!payload.teamName?.trim()) throw new Error("Team name is required");
  if (!payload.captainName?.trim()) throw new Error("Captain name is required");
  if (!payload.captainEmail?.trim()) throw new Error("Captain email is required");
  if (!payload.bgmiUid?.trim()) throw new Error("BGMI UID is required");

  const id = globalThis.crypto?.randomUUID?.() ?? `reg_${Date.now()}`;
  await supabaseInsert("registration_submissions", {
    id,
    tournament_id: payload.tournamentId || null,
    team_name: payload.teamName.trim(),
    logo_file_name: payload.logoFileName || null,
    captain_name: payload.captainName.trim(),
    captain_email: payload.captainEmail.trim(),
    bgmi_uid: payload.bgmiUid.trim(),
    players: payload.players || [],
    whatsapp: payload.whatsapp || null,
    discord: payload.discord || null,
    payment_file_name: payload.paymentFileName || null,
    status: "APPROVED",
  });

  return { id, status: "APPROVED" };
}

export async function getAdminSnapshot(payload: unknown) {
  const { adminKey } = (payload ?? {}) as { adminKey?: string };
  if (!(await validateAdminKey(adminKey))) throw new Error("Invalid admin password");

  const warnings: string[] = [];

  const [tRes, teRes, rRes, mRes, aRes] = await Promise.all([
    optionalSupabaseAdminGet<SupabaseTournament>("tournaments?select=*&order=created_at.desc", "Tournaments table issue"),
    optionalSupabaseAdminGet<SupabaseTeam>("teams?select=*&order=created_at.desc", "Teams table issue"),
    optionalSupabaseAdminGet<SupabaseRegistrationSubmission>("registration_submissions?select=*&order=created_at.desc", "Registrations table issue"),
    optionalSupabaseAdminGet<SupabaseMatch>("matches?select=*&order=created_at.desc", "Matches table issue"),
    optionalSupabaseAdminGet<SupabaseAnnouncement>("announcements?select=*&order=created_at.desc", "Announcements table issue"),
  ]);

  [tRes, teRes, rRes, mRes, aRes].forEach((res) => {
    if (res.warning) warnings.push(res.warning);
  });

  return {
    tournaments: tRes.rows,
    teams: teRes.rows,
    registrations: rRes.rows,
    matches: mRes.rows,
    announcements: aRes.rows,
    generatedAt: new Date().toISOString(),
    warnings: warnings.length ? warnings : undefined,
  };
}

async function getSupabasePlatformData(): Promise<PlatformData | undefined> {
  if (
    !process.env.SUPABASE_URL ||
    !(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)
  ) {
    return undefined;
  }

  const [tournamentRows, teamRows, matchRows, announcementRows] = await Promise.all([
    supabaseGet<SupabaseTournament>("tournaments?select=*&order=starts_at.asc").catch(() => []),
    supabaseGet<SupabaseTeam>(
      "teams?select=*&order=placement_points.desc&order=wwcd.desc&order=finishes.desc",
    ).catch(() => []),
    supabaseGet<SupabaseMatch>("matches?select=*&order=starts_at.asc").catch(() => []),
    supabaseGet<SupabaseAnnouncement>(
      "announcements?select=*&order=pinned.desc&order=publish_at.desc",
    ).catch(() => []),
  ]);

  const safeTournamentRows = Array.isArray(tournamentRows) ? tournamentRows : [];
  const safeTeamRows = Array.isArray(teamRows) ? teamRows : [];
  const safeMatchRows = Array.isArray(matchRows) ? matchRows : [];
  const safeAnnouncementRows = Array.isArray(announcementRows) ? announcementRows : [];

  const seedIds = new Set(["nebula-masters", "crimson-rift"]);
  const userTournaments = safeTournamentRows.filter((row) => row && !seedIds.has(row.id));

  // Purge legacy seed rows from Supabase if present
  const seedRowsToPurge = safeTournamentRows.filter((row) => row && seedIds.has(row.id));
  if (seedRowsToPurge.length > 0) {
    for (const seedRow of seedRowsToPurge) {
      void supabaseDelete("tournaments", seedRow.id).catch(() => {});
    }
  }

  const tournaments: Tournament[] = userTournaments.map((row, index) => ({
    id: row.id,
    name: row.name,
    mode: row.mode,
    status: supabaseStatus(row.status, row.registered_teams, row.max_teams),
    prize: formatCurrency(row.prize_pool),
    fee: formatCurrency(row.entry_fee),
    slots: row.max_teams,
    registered: row.registered_teams,
    starts: formatDate(new Date(row.starts_at)),
    deadline: formatDate(new Date(row.registration_deadline)),
    map: parseList(row.maps).join(", "),
    phase: row.phase ?? "League",
    accent: row.accent ?? accentClasses[index % accentClasses.length],
    mediaUrl: row.media_url ?? undefined,
    idpTimings: row.idp_timings ?? undefined,
  }));

  const userTeams = safeTeamRows.filter((row) => row && (!row.tournament_id || !seedIds.has(row.tournament_id)));
  const userMatches = safeMatchRows.filter((row) => row && (!row.tournament_id || !seedIds.has(row.tournament_id)));
  const userAnnouncements = safeAnnouncementRows.filter((row) => row && (!row.tournament_id || !seedIds.has(row.tournament_id)));

  const teams: Team[] = userTeams.map((row, index) => ({
    rank: index + 1,
    name: row.name,
    short: row.short_name,
    region: row.region,
    captain: row.captain,
    matches: row.matches_played,
    wwcd: row.wwcd,
    placement: row.placement_points,
    finishes: row.finishes,
    penalty: row.penalty_points,
    form: parseList(row.recent_form),
    drop: row.preferred_drop ?? "Pochinki",
  }));

  const schedules: ScheduleItem[] = userMatches.map((row) => ({
    id: row.id,
    title: row.name,
    startsAt: row.starts_at,
    map: row.map,
    status: row.status as ScheduleItem["status"],
    group: row.group_name,
  }));

  const announcements: AnnouncementItem[] = userAnnouncements.map((row) => ({
    id: row.id,
    title: row.title,
    body: row.body ?? row.title,
    category: row.category,
    pinned: row.pinned,
    publishAt: row.publish_at,
  }));

  return {
    tournaments,
    teams,
    schedules,
    announcements,
    generatedAt: new Date().toISOString(),
    source: "supabase",
  };
}

export async function getPlatformData(): Promise<PlatformData> {
  try {
    const supabaseData = await getSupabasePlatformData();
    if (supabaseData) return supabaseData;
  } catch (error) {
    console.error("Supabase read error:", error);
  }

  return {
    tournaments: [],
    teams: [],
    schedules: [],
    announcements: [],
    generatedAt: new Date().toISOString(),
    source: "supabase",
  };
}
