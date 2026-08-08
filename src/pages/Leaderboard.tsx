import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Flame, Search, Trophy, Swords, CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import { Section, usePlatformData } from "../lib/shared-ui";
import { totalPoints, type PlatformData, type Team } from "../lib/platform-types";

const battlesList = [
  { id: "all", name: "All Battles & Scrims (Combined)", icon: Trophy },
  { id: "weekend-war", name: "Weekend War Championship (Season 4)", icon: Trophy },
  { id: "daily-slot-1", name: "Daily Grind - Slot 1 (02:00 PM IST)", icon: Flame },
  { id: "daily-slot-2", name: "Daily Grind - Slot 2 (05:00 PM IST)", icon: Flame },
  { id: "daily-slot-3", name: "Daily Grind - Slot 3 (08:00 PM IST)", icon: Flame },
  { id: "daily-slot-4", name: "Daily Grind - Slot 4 (10:30 PM IST)", icon: Flame },
  { id: "elite-series", name: "Elite Series Qualifiers", icon: Swords },
  { id: "special-scrim", name: "Special Scrim Lobby A", icon: CalendarDays },
];

function LeaderboardRow({ team, rankOverride }: { team: Team; rankOverride?: number }) {
  const displayRank = rankOverride ?? team.rank;
  const up = team.form[0] === "W" || displayRank <= 3;
  return (
    <motion.tr
      whileHover={{ backgroundColor: "rgba(255,107,0,0.1)" }}
      className="border-t border-white/10"
    >
      <td className="p-4 font-display text-3xl font-bold text-orange-300">#{displayRank}</td>
      <td className="p-4">
        <p className="font-bold text-white text-base">{team.name}</p>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-slate-400">
          {team.short} / Capt. {team.captain}
        </p>
      </td>
      <td className="p-4 text-slate-300 font-mono text-xs">{team.region}</td>
      <td className="p-4 text-white font-bold">{team.wwcd}</td>
      <td className="p-4 text-white font-bold">{team.finishes}</td>
      <td className="p-4 font-display text-3xl font-bold text-white">{totalPoints(team)}</td>
      <td className="p-4">
        <span
          className={`inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.18em] ${
            up ? "text-green-300" : "text-red-300"
          }`}
        >
          {up ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          {up ? "rising" : "under fire"}
        </span>
      </td>
    </motion.tr>
  );
}

function LeaderboardContent({ data }: { data: PlatformData }) {
  const [selectedBattle, setSelectedBattle] = useState("all");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"rank" | "points" | "finishes">("rank");

  const currentBattleInfo = useMemo(() => {
    return battlesList.find((b) => b.id === selectedBattle) ?? battlesList[0];
  }, [selectedBattle]);

  const teams = useMemo(() => {
    let list = [...data.teams];

    // Simulate battle-specific score adjustments if a specific battle is chosen
    if (selectedBattle !== "all") {
      const seed = selectedBattle.charCodeAt(0);
      list = list.map((t, idx) => {
        const battleFinishes = Math.max(0, t.finishes - ((idx * seed) % 7));
        const battleWwcd = (t.wwcd + idx) % 2;
        const battlePlacementPts = Math.max(2, t.placementPoints - ((idx * 3) % 8));
        return {
          ...t,
          finishes: battleFinishes,
          wwcd: battleWwcd,
          placementPoints: battlePlacementPts,
        };
      });
    }

    return list
      .filter((team) =>
        `${team.name} ${team.short} ${team.region} ${team.captain}`
          .toLowerCase()
          .includes(query.toLowerCase()),
      )
      .sort((a, b) => {
        if (sort === "points") return totalPoints(b) - totalPoints(a);
        if (sort === "finishes") return b.finishes - a.finishes;
        return a.rank - b.rank;
      });
  }, [data.teams, query, sort, selectedBattle]);

  return (
    <Section id="leaderboard" eyebrow="Dedicated Standings" title="Points Table per Battle">
      {/* Battle Selection Toolbar */}
      <div className="mb-6 flex flex-col gap-4 border border-orange-500/30 bg-black/60 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-orange-300">
            Select Dedicated Battle / Scrim
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {battlesList.map((battle) => (
              <button
                key={battle.id}
                type="button"
                onClick={() => setSelectedBattle(battle.id)}
                className={`border px-3.5 py-2 font-mono text-xs uppercase tracking-[0.14em] transition ${
                  selectedBattle === battle.id
                    ? "border-orange-400 bg-orange-500/20 font-bold text-orange-100 shadow-[0_0_15px_rgba(255,107,0,0.25)]"
                    : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {battle.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div data-gsap-reveal className="clip-panel hud-panel overflow-hidden">
        {/* Battle Banner & Search Controls */}
        <div className="flex flex-col gap-4 border-b border-white/10 p-5 md:flex-row md:items-center md:justify-between">
          <div>
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-green-300">
              Active Battle Leaderboard
            </span>
            <h3 className="font-display text-3xl font-bold uppercase text-white">
              {currentBattleInfo.name}
            </h3>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="flex items-center gap-2 border border-white/15 bg-black/60 px-3.5 py-2">
              <Search className="h-4 w-4 text-orange-300" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search squad or captain..."
                className="bg-transparent font-mono text-xs uppercase tracking-[0.12em] text-white outline-none placeholder:text-slate-500"
              />
            </label>

            <div className="flex gap-1.5">
              {(["rank", "points", "finishes"] as const).map((item) => (
                <button
                  key={item}
                  type="button"
                  onClick={() => setSort(item)}
                  className={`border px-3 py-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] ${
                    sort === item
                      ? "border-orange-300/60 bg-orange-500/15 text-orange-100"
                      : "border-white/10 text-slate-400 hover:text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table View */}
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="border-b border-white/10 bg-white/5 font-mono text-[0.68rem] uppercase tracking-[0.22em] text-slate-400">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Squad & Captain</th>
                <th className="p-4">Region</th>
                <th className="p-4">WWCD</th>
                <th className="p-4">Finishes</th>
                <th className="p-4">Total PTS</th>
                <th className="p-4">Trend</th>
              </tr>
            </thead>
            <tbody>
              {teams.length ? (
                teams.map((team, idx) => (
                  <LeaderboardRow key={team.name} team={team} rankOverride={idx + 1} />
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center font-mono text-xs uppercase text-slate-400">
                    No teams found for this battle filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}

export function LeaderboardPage() {
  const { data } = usePlatformData();

  return (
    <div className="pt-20">
      <LeaderboardContent data={data} />
    </div>
  );
}
