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
