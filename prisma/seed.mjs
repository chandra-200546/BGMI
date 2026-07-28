import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const scoringRules = {
  placement: { 1: 10, 2: 6, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1, 8: 1 },
  finishPoint: 1,
};

const teamRows = [
  [
    "Velocity Reign",
    "VRN",
    "Delhi",
    "Aarav Blaze",
    4,
    72,
    98,
    0,
    ["W", "3", "2", "W", "5"],
    "School",
  ],
  [
    "Neon Vipers",
    "NVX",
    "Mumbai",
    "Rehan Volt",
    3,
    68,
    91,
    2,
    ["2", "W", "4", "7", "W"],
    "Pochinki",
  ],
  [
    "Iron Phantoms",
    "IPH",
    "Bengaluru",
    "Kabir Hex",
    2,
    61,
    86,
    0,
    ["4", "2", "W", "6", "3"],
    "Rozhok",
  ],
  [
    "Storm Syntax",
    "SSX",
    "Hyderabad",
    "Ishan Node",
    2,
    58,
    81,
    4,
    ["7", "3", "5", "2", "W"],
    "Mylta",
  ],
  ["Quantum Rush", "QRX", "Pune", "Dev Cipher", 1, 55, 78, 0, ["5", "8", "2", "W", "4"], "Yasnaya"],
  [
    "Solar Dominion",
    "SDM",
    "Kolkata",
    "Rudra Nova",
    1,
    49,
    72,
    1,
    ["6", "4", "8", "3", "2"],
    "Georgopol",
  ],
  [
    "Rogue Circuit",
    "RGC",
    "Chennai",
    "Nikhil Flux",
    1,
    46,
    66,
    0,
    ["8", "5", "6", "4", "3"],
    "Military Base",
  ],
  [
    "Apex Mirage",
    "AMG",
    "Jaipur",
    "Vihaan Frost",
    0,
    41,
    61,
    0,
    ["9", "6", "7", "5", "6"],
    "Severny",
  ],
];

async function main() {
  const season = await prisma.season.upsert({
    where: { name: "Season 06" },
    update: {},
    create: {
      name: "Season 06",
      startsAt: new Date("2026-07-01T00:00:00.000Z"),
      endsAt: new Date("2026-10-31T23:59:59.000Z"),
    },
  });

  const tournament = await prisma.tournament.upsert({
    where: { slug: "nebula-masters-invitational" },
    update: {
      status: "LIVE",
      scoringRules,
    },
    create: {
      seasonId: season.id,
      name: "Nebula Masters Invitational",
      slug: "nebula-masters-invitational",
      status: "LIVE",
      mode: "Squad TPP",
      format: "Qualifiers to Grand Finals",
      maps: ["Erangel", "Miramar", "Sanhok", "Vikendi"],
      prizePool: 500000,
      entryFee: 799,
      maxTeams: 64,
      registrationDeadline: new Date("2026-08-10T18:29:59.000Z"),
      rosterLockDeadline: new Date("2026-08-12T18:29:59.000Z"),
      startsAt: new Date("2026-08-15T13:30:00.000Z"),
      endsAt: new Date("2026-08-18T17:30:00.000Z"),
      scoringRules,
      tieBreakers: ["WWCD", "FINISHES", "PLACEMENT_POINTS", "LATEST_MATCH"],
    },
  });

  for (const [
    index,
    [name, shortName, region, captainIgn, wwcd, placement, finishes, penalty, form, drop],
  ] of teamRows.entries()) {
    const team = await prisma.team.upsert({
      where: { tournamentId_name: { tournamentId: tournament.id, name } },
      update: {
        shortName,
        region,
        preferredDrop: drop,
      },
      create: {
        tournamentId: tournament.id,
        name,
        shortName,
        region,
        city: region,
        preferredDrop: drop,
        description: `${name} is a fictional competitive squad seeded for live tournament operations.`,
      },
    });

    const player = await prisma.player.upsert({
      where: { bgmiUid: `58493027${String(index + 100).padStart(3, "0")}` },
      update: { ign: captainIgn },
      create: {
        fullName: `${captainIgn} Captain`,
        ign: captainIgn,
        bgmiUid: `58493027${String(index + 100).padStart(3, "0")}`,
        email: `${shortName.toLowerCase()}@nexbattles.example`,
        state: region,
      },
    });

    await prisma.teamMember.upsert({
      where: { teamId_playerId: { teamId: team.id, playerId: player.id } },
      update: { role: "IGL", isStarter: true },
      create: {
        teamId: team.id,
        playerId: player.id,
        role: "IGL",
        isStarter: true,
        ageChecked: true,
      },
    });

    await prisma.leaderboardEntry.upsert({
      where: { teamId: team.id },
      update: {
        matchesPlayed: 16,
        wwcd,
        placementPoints: placement,
        finishes,
        finishPoints: finishes,
        penaltyPoints: penalty,
        totalPoints: placement + finishes - penalty,
        rank: index + 1,
        recentForm: form,
      },
      create: {
        teamId: team.id,
        matchesPlayed: 16,
        wwcd,
        placementPoints: placement,
        finishes,
        finishPoints: finishes,
        penaltyPoints: penalty,
        totalPoints: placement + finishes - penalty,
        rank: index + 1,
        recentForm: form,
      },
    });

    await prisma.dropLocation.upsert({
      where: { id: `${team.id}-erangel-drop` },
      update: { label: drop },
      create: {
        id: `${team.id}-erangel-drop`,
        teamId: team.id,
        map: "Erangel",
        label: drop,
        x: 20 + index * 7,
        y: 28 + index * 5,
      },
    });
  }

  const matchRows = [
    ["Grand Final M1", 1, "Erangel", "ROOM_RELEASED", "2026-07-28T13:30:00.000Z"],
    ["Grand Final M2", 2, "Miramar", "CHECK_IN_OPEN", "2026-07-28T14:20:00.000Z"],
    ["Grand Final M3", 3, "Sanhok", "UPCOMING", "2026-07-29T13:30:00.000Z"],
    ["Grand Final M4", 4, "Vikendi", "UPCOMING", "2026-07-29T14:20:00.000Z"],
  ];

  for (const [name, matchNumber, map, status, startsAt] of matchRows) {
    const match = await prisma.match.upsert({
      where: {
        tournamentId_phase_matchNumber: {
          tournamentId: tournament.id,
          phase: "Grand Finals",
          matchNumber,
        },
      },
      update: { map, status, startsAt: new Date(startsAt) },
      create: {
        tournamentId: tournament.id,
        name,
        phase: "Grand Finals",
        week: 1,
        matchNumber,
        map,
        groupName: "Group A+B",
        startsAt: new Date(startsAt),
        status,
      },
    });

    await prisma.matchRoom.upsert({
      where: { matchId: match.id },
      update: {},
      create: {
        matchId: match.id,
        roomId: `7365 ${9800 + matchNumber}`,
        password: `NBX#${20 + matchNumber}`,
        releaseAt: new Date(new Date(startsAt).getTime() - 20 * 60 * 1000),
        lobbyOpensAt: new Date(new Date(startsAt).getTime() - 15 * 60 * 1000),
        checkInEndsAt: new Date(new Date(startsAt).getTime() - 5 * 60 * 1000),
        released: status === "ROOM_RELEASED",
      },
    });
  }

  const announcements = [
    ["Important", "Grand finals lobby opens 20 minutes earlier tonight.", true],
    ["Rules", "Zone heal camping penalty updated for finals matches.", false],
    ["Result", "Semi-final leaderboard verified after payment and roster audit.", false],
    ["Schedule", "Miramar slot moved to 7:50 PM after broadcaster sync.", false],
  ];

  for (const [category, title, pinned] of announcements) {
    await prisma.announcement.upsert({
      where: { id: `${tournament.id}-${category.toLowerCase()}` },
      update: { title, pinned },
      create: {
        id: `${tournament.id}-${category.toLowerCase()}`,
        tournamentId: tournament.id,
        category,
        title,
        body: title,
        pinned,
      },
    });
  }
}

main()
  .finally(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
