import { existsSync, readFileSync } from "node:fs";

function loadLocalEnv() {
  for (const file of [".env.local", ".env"]) {
    if (!existsSync(file)) continue;
    for (const line of readFileSync(file, "utf8").split(/\r?\n/)) {
      const match = line.match(/^([A-Z0-9_]+)=(.*)$/);
      if (!match) continue;
      const [, name, rawValue] = match;
      if (process.env[name]) continue;
      process.env[name] = rawValue.replace(/^"|"$/g, "");
    }
  }
}

loadLocalEnv();

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error("SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.");
  process.exit(1);
}

async function upsert(table, rows) {
  const response = await fetch(`${url.replace(/\/$/, "")}/rest/v1/${table}?on_conflict=id`, {
    method: "POST",
    headers: {
      apikey: key,
      authorization: `Bearer ${key}`,
      "content-type": "application/json",
      prefer: "resolution=merge-duplicates",
    },
    body: JSON.stringify(rows),
  });

  if (!response.ok) {
    throw new Error(`${table} seed failed: ${response.status} ${await response.text()}`);
  }
}

const tournamentId = "nebula-masters";

await upsert("tournaments", [
  {
    id: tournamentId,
    name: "Nebula Masters Invitational",
    mode: "Squad TPP",
    status: "LIVE",
    prize_pool: 500000,
    entry_fee: 799,
    max_teams: 64,
    registered_teams: 48,
    starts_at: "2026-08-15T13:30:00.000Z",
    registration_deadline: "2026-08-10T18:29:59.000Z",
    maps: ["Erangel", "Miramar", "Sanhok", "Vikendi"],
    phase: "Grand Finals",
    accent: "from-cyan-400 to-fuchsia-500",
  },
  {
    id: "crimson-rift",
    name: "Crimson Rift Pro League",
    mode: "Squad FPP",
    status: "REGISTRATION_OPEN",
    prize_pool: 250000,
    entry_fee: 499,
    max_teams: 32,
    registered_teams: 29,
    starts_at: "2026-09-02T13:30:00.000Z",
    registration_deadline: "2026-08-31T18:29:59.000Z",
    maps: ["Erangel", "Livik"],
    phase: "League",
    accent: "from-red-500 to-orange-400",
  },
]);

const teams = [
  [
    "velocity-reign",
    "Velocity Reign",
    "VRN",
    "Delhi",
    "Aarav Blaze",
    16,
    4,
    72,
    98,
    0,
    ["W", "3", "2", "W", "5"],
    "School",
  ],
  [
    "neon-vipers",
    "Neon Vipers",
    "NVX",
    "Mumbai",
    "Rehan Volt",
    16,
    3,
    68,
    91,
    2,
    ["2", "W", "4", "7", "W"],
    "Pochinki",
  ],
  [
    "iron-phantoms",
    "Iron Phantoms",
    "IPH",
    "Bengaluru",
    "Kabir Hex",
    16,
    2,
    61,
    86,
    0,
    ["4", "2", "W", "6", "3"],
    "Rozhok",
  ],
  [
    "storm-syntax",
    "Storm Syntax",
    "SSX",
    "Hyderabad",
    "Ishan Node",
    16,
    2,
    58,
    81,
    4,
    ["7", "3", "5", "2", "W"],
    "Mylta",
  ],
  [
    "quantum-rush",
    "Quantum Rush",
    "QRX",
    "Pune",
    "Dev Cipher",
    16,
    1,
    55,
    78,
    0,
    ["5", "8", "2", "W", "4"],
    "Yasnaya",
  ],
  [
    "solar-dominion",
    "Solar Dominion",
    "SDM",
    "Kolkata",
    "Rudra Nova",
    16,
    1,
    49,
    72,
    1,
    ["6", "4", "8", "3", "2"],
    "Georgopol",
  ],
  [
    "rogue-circuit",
    "Rogue Circuit",
    "RGC",
    "Chennai",
    "Nikhil Flux",
    16,
    1,
    46,
    66,
    0,
    ["8", "5", "6", "4", "3"],
    "Military Base",
  ],
  [
    "apex-mirage",
    "Apex Mirage",
    "AMG",
    "Jaipur",
    "Vihaan Frost",
    16,
    0,
    41,
    61,
    0,
    ["9", "6", "7", "5", "6"],
    "Severny",
  ],
];

await upsert(
  "teams",
  teams.map(
    ([
      id,
      name,
      short_name,
      region,
      captain,
      matches_played,
      wwcd,
      placement_points,
      finishes,
      penalty_points,
      recent_form,
      preferred_drop,
    ]) => ({
      id,
      tournament_id: tournamentId,
      name,
      short_name,
      region,
      captain,
      matches_played,
      wwcd,
      placement_points,
      finishes,
      penalty_points,
      recent_form,
      preferred_drop,
    }),
  ),
);

await upsert("matches", [
  {
    id: "gf-m1",
    tournament_id: tournamentId,
    name: "Grand Final M1",
    starts_at: "2026-07-28T13:30:00.000Z",
    map: "Erangel",
    status: "ROOM_RELEASED",
    group_name: "Group A+B",
  },
  {
    id: "gf-m2",
    tournament_id: tournamentId,
    name: "Grand Final M2",
    starts_at: "2026-07-28T14:20:00.000Z",
    map: "Miramar",
    status: "CHECK_IN_OPEN",
    group_name: "Group A+B",
  },
  {
    id: "gf-m3",
    tournament_id: tournamentId,
    name: "Grand Final M3",
    starts_at: "2026-07-29T13:30:00.000Z",
    map: "Sanhok",
    status: "UPCOMING",
    group_name: "Group A+B",
  },
  {
    id: "gf-m4",
    tournament_id: tournamentId,
    name: "Grand Final M4",
    starts_at: "2026-07-29T14:20:00.000Z",
    map: "Vikendi",
    status: "UPCOMING",
    group_name: "Group A+B",
  },
]);

await upsert("announcements", [
  {
    id: "ann-important",
    tournament_id: tournamentId,
    category: "Important",
    title: "Grand finals lobby opens 20 minutes earlier tonight.",
    body: "Grand finals lobby opens 20 minutes earlier tonight.",
    pinned: true,
  },
  {
    id: "ann-rules",
    tournament_id: tournamentId,
    category: "Rules",
    title: "Zone heal camping penalty updated for finals matches.",
    body: "Zone heal camping penalty updated for finals matches.",
    pinned: false,
  },
  {
    id: "ann-result",
    tournament_id: tournamentId,
    category: "Result",
    title: "Semi-final leaderboard verified after payment and roster audit.",
    body: "Semi-final leaderboard verified after payment and roster audit.",
    pinned: false,
  },
]);

console.log("Supabase seed complete.");
