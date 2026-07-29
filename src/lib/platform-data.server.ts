import { PrismaClient, TournamentStatus } from "@prisma/client";

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
};

type SupabaseAnnouncement = {
  id: string;
  category: string;
  title: string;
  pinned: boolean;
  publish_at: string;
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

function formatTime(value?: Date | null) {
  if (!value) return "TBA";
  return new Intl.DateTimeFormat("en-IN", {
    hour: "numeric",
    minute: "2-digit",
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

function supabaseHeaders() {
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.SUPABASE_ANON_KEY;
  if (!process.env.SUPABASE_URL || !key) return undefined;

  return {
    url: process.env.SUPABASE_URL.replace(/\/$/, ""),
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
      accept: "application/json",
    },
  };
}

function normalizeSubmission(payload: unknown): PublicRegistrationSubmission {
  const value = payload as Partial<PublicRegistrationSubmission>;
  const players = Array.isArray(value.players)
    ? value.players.map(String).map((item) => item.trim())
    : [];

  const submission: PublicRegistrationSubmission = {
    tournamentId: String(value.tournamentId ?? "").trim(),
    teamName: String(value.teamName ?? "").trim(),
    logoFileName: String(value.logoFileName ?? "").trim(),
    captainName: String(value.captainName ?? "").trim(),
    captainEmail: String(value.captainEmail ?? "").trim(),
    bgmiUid: String(value.bgmiUid ?? "").trim(),
    players,
    whatsapp: String(value.whatsapp ?? "").trim(),
    discord: String(value.discord ?? "").trim(),
    paymentFileName: String(value.paymentFileName ?? "").trim(),
  };

  if (!submission.tournamentId) throw new Error("Tournament is required");
  if (!submission.teamName) throw new Error("Team name is required");
  if (!submission.captainName) throw new Error("Captain name is required");
  if (!submission.captainEmail) throw new Error("Captain email is required");
  if (!submission.bgmiUid) throw new Error("BGMI UID is required");
  if (players.length !== 4 || players.some((player) => !player)) {
    throw new Error("Four player slots are required");
  }
  if (!submission.whatsapp && !submission.discord) throw new Error("Contact channel is required");
  if (!submission.paymentFileName) throw new Error("Payment screenshot is required");

  return submission;
}

export async function submitPublicRegistration(payload: unknown) {
  const submission = normalizeSubmission(payload);
  const supabase = supabaseHeaders();

  if (!supabase) {
    throw new Error("Supabase is not configured for registration writes");
  }

  const id = globalThis.crypto?.randomUUID?.() ?? `reg_${Date.now()}`;
  const response = await fetch(`${supabase.url}/rest/v1/registration_submissions`, {
    method: "POST",
    headers: { ...supabase.headers, prefer: "return=representation" },
    body: JSON.stringify({
      id,
      tournament_id: submission.tournamentId,
      team_name: submission.teamName,
      logo_file_name: submission.logoFileName,
      captain_name: submission.captainName,
      captain_email: submission.captainEmail,
      bgmi_uid: submission.bgmiUid,
      players: submission.players,
      whatsapp: submission.whatsapp,
      discord: submission.discord,
      payment_file_name: submission.paymentFileName,
      status: "SUBMITTED",
    }),
  });

  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`Supabase registration insert failed: ${response.status} ${detail}`);
  }

  return { id, status: "SUBMITTED" };
}

async function getSupabasePlatformData(): Promise<PlatformData | undefined> {
  if (
    !process.env.SUPABASE_URL ||
    !(process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY)
  ) {
    return undefined;
  }

  const [tournamentRows, teamRows, matchRows, announcementRows] = await Promise.all([
    supabaseGet<SupabaseTournament>("tournaments?select=*&order=starts_at.asc"),
    supabaseGet<SupabaseTeam>(
      "teams?select=*&order=placement_points.desc&order=wwcd.desc&order=finishes.desc",
    ),
    supabaseGet<SupabaseMatch>("matches?select=*&order=starts_at.asc"),
    supabaseGet<SupabaseAnnouncement>(
      "announcements?select=*&order=pinned.desc&order=publish_at.desc",
    ),
  ]);

  const tournaments: Tournament[] = tournamentRows.map((row, index) => ({
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
  }));

  const teams: Team[] = teamRows.map((row, index) => ({
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
    drop: row.preferred_drop ?? "TBA",
  }));

  const schedules: ScheduleItem[] = matchRows.map((row) => ({
    match: row.name,
    date: formatDate(new Date(row.starts_at)),
    time: formatTime(new Date(row.starts_at)),
    map: row.map,
    status: row.status
      .replaceAll("_", " ")
      .toLowerCase()
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    group: row.group_name,
  }));

  const announcements: AnnouncementItem[] = announcementRows.map((row) => ({
    category: row.category,
    title: row.title,
    state: row.pinned ? "Pinned" : "Published",
    date: formatDate(new Date(row.publish_at)),
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

function tournamentStatus(status: TournamentStatus, registered: number, maxTeams: number): Status {
  if (registered >= maxTeams) return "Full";
  if (status === "LIVE") return "Live";
  if (status === "COMPLETED") return "Completed";
  if (status === "REGISTRATION_OPEN") {
    return maxTeams - registered <= Math.max(3, Math.ceil(maxTeams * 0.1))
      ? "Closing Soon"
      : "Registration Open";
  }
  return "Completed";
}

function mapTournament(
  tournament: Awaited<ReturnType<typeof prisma.tournament.findMany>>[number],
  index: number,
): Tournament {
  const registered = tournament.teams.length;
  return {
    id: tournament.id,
    name: tournament.name,
    mode: tournament.mode,
    status: tournamentStatus(tournament.status, registered, tournament.maxTeams),
    prize: formatCurrency(tournament.prizePool),
    fee: formatCurrency(tournament.entryFee),
    slots: tournament.maxTeams,
    registered,
    starts: formatDate(tournament.startsAt),
    deadline: formatDate(tournament.registrationDeadline),
    map: tournament.maps.join(", "),
    phase: tournament.matches[0]?.phase ?? tournament.format,
    accent: accentClasses[index % accentClasses.length],
  };
}

export async function getPlatformData(): Promise<PlatformData> {
  try {
    const supabaseData = await getSupabasePlatformData();
    if (supabaseData) return supabaseData;
  } catch (error) {
    console.error(error);
    return {
      tournaments: [],
      teams: [],
      schedules: [],
      announcements: [],
      generatedAt: new Date().toISOString(),
      source: "error",
      message:
        "Supabase is configured, but required REST tables are missing or blocked. Run supabase/schema.sql and seed data.",
    };
  }

  if (!process.env.DATABASE_URL) {
    return {
      tournaments: [],
      teams: [],
      schedules: [],
      announcements: [],
      generatedAt: new Date().toISOString(),
      source: "unconfigured",
      message: "DATABASE_URL is missing. Add PostgreSQL credentials and run the seed script.",
    };
  }

  try {
    const [tournaments, leaderboard, matches, announcements] = await Promise.all([
      prisma.tournament.findMany({
        where: { deletedAt: null },
        orderBy: [{ startsAt: "asc" }],
        include: {
          teams: { select: { id: true } },
          matches: { orderBy: [{ startsAt: "asc" }], take: 1 },
        },
      }),
      prisma.leaderboardEntry.findMany({
        orderBy: [{ totalPoints: "desc" }, { wwcd: "desc" }, { finishes: "desc" }],
        include: {
          team: {
            include: {
              members: {
                include: { player: true },
                orderBy: { joinedAt: "asc" },
                take: 1,
              },
              dropLocations: { take: 1 },
            },
          },
        },
        take: 16,
      }),
      prisma.match.findMany({
        orderBy: [{ startsAt: "asc" }],
        take: 8,
      }),
      prisma.announcement.findMany({
        orderBy: [{ pinned: "desc" }, { publishAt: "desc" }],
        take: 8,
      }),
    ]);

    const teams: Team[] = leaderboard.map((entry, index) => ({
      rank: index + 1,
      name: entry.team.name,
      short: entry.team.shortName,
      region: entry.team.region,
      captain: entry.team.members[0]?.player.ign ?? "Captain pending",
      matches: entry.matchesPlayed,
      wwcd: entry.wwcd,
      placement: entry.placementPoints,
      finishes: entry.finishes,
      penalty: entry.penaltyPoints,
      form: entry.recentForm.length > 0 ? entry.recentForm : ["-", "-", "-", "-", "-"],
      drop: entry.team.dropLocations[0]?.label ?? entry.team.preferredDrop ?? "TBA",
    }));

    const schedules: ScheduleItem[] = matches.map((match) => ({
      match: match.name,
      date: formatDate(match.startsAt),
      time: formatTime(match.startsAt),
      map: match.map,
      status: match.status
        .replaceAll("_", " ")
        .toLowerCase()
        .replace(/\b\w/g, (c) => c.toUpperCase()),
      group: match.groupName,
    }));

    const announcementItems: AnnouncementItem[] = announcements.map((announcement) => ({
      category: announcement.category,
      title: announcement.title,
      state: announcement.pinned ? "Pinned" : "Published",
      date: formatDate(announcement.publishAt),
    }));

    return {
      tournaments: tournaments.map(mapTournament),
      teams,
      schedules,
      announcements: announcementItems,
      generatedAt: new Date().toISOString(),
      source: "database",
    };
  } catch (error) {
    console.error(error);
    return {
      tournaments: [],
      teams: [],
      schedules: [],
      announcements: [],
      generatedAt: new Date().toISOString(),
      source: "error",
      message:
        "Database connection failed. Check DATABASE_URL, migrations, and Prisma client generation.",
    };
  }
}
