import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { Section, usePlatformData } from "../lib/shared-ui";
import { totalPoints, type PlatformData, type Team } from "../lib/platform-types";

function LeaderboardRow({ team }: { team: Team }) {
  const up = team.form[0] === "W" || team.rank <= 3;
  return (
    <motion.tr
      whileHover={{ backgroundColor: "rgba(255,107,0,0.1)" }}
      className="border-t border-white/10"
    >
      <td className="p-4 font-display text-3xl font-bold text-orange-300">#{team.rank}</td>
      <td className="p-4">
        <p className="font-bold text-white">{team.name}</p>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
          {team.short} / {team.captain}
        </p>
      </td>
      <td className="p-4 text-slate-300">{team.region}</td>
      <td className="p-4 text-white">{team.wwcd}</td>
      <td className="p-4 text-white">{team.finishes}</td>
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
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"rank" | "points" | "finishes">("rank");

  const teams = useMemo(() => {
    return [...data.teams]
      .filter((team) =>
        `${team.name} ${team.short} ${team.region}`.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => {
        if (sort === "points") return totalPoints(b) - totalPoints(a);
        if (sort === "finishes") return b.finishes - a.finishes;
        return a.rank - b.rank;
      });
  }, [data.teams, query, sort]);

  return (
    <Section id="leaderboard" eyebrow="Live leaderboard" title="Every point bleeds.">
      <div data-gsap-reveal className="clip-panel hud-panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
          <label className="flex items-center gap-2 border border-white/10 bg-black/40 px-3 py-2">
            <Search className="h-4 w-4 text-orange-300" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter squads"
              className="bg-transparent font-mono text-xs uppercase tracking-[0.12em] text-white outline-none"
            />
          </label>

          <div className="flex gap-2">
            {(["rank", "points", "finishes"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSort(item)}
                className={`border px-3 py-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] ${
                  sort === item
                    ? "border-orange-300/60 bg-orange-500/15 text-orange-100"
                    : "border-white/10 text-slate-400"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-slate-500">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Squad</th>
                <th className="p-4">Region</th>
                <th className="p-4">WWCD</th>
                <th className="p-4">Finishes</th>
                <th className="p-4">Total</th>
                <th className="p-4">Trend</th>
              </tr>
            </thead>
            <tbody>
              {teams.length ? (
                teams.map((team) => <LeaderboardRow key={team.name} team={team} />)
              ) : (
                <tr>
                  <td colSpan={7} className="p-4">
                    <div className="skeleton-scan h-16 border border-white/10" />
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
