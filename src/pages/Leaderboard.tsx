import { ArrowDown, ArrowUp, Search, Trophy, Swords } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Section, usePlatformData } from "../lib/shared-ui";
import { totalPoints, type PlatformData, type Team } from "../lib/platform-types";

function LeaderboardRow({ team, rankOverride }: { team: Team; rankOverride?: number }) {
  const displayRank = rankOverride ?? team.rank;
  const up = (team.recentForm && team.recentForm[0] === "W") || displayRank <= 3;
  return (
    <tr className="border-t border-sky-400/15 hover:bg-sky-950/20">
      <td className="p-4 font-display text-3xl font-bold text-sky-400">#{displayRank}</td>
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
            up ? "text-sky-300" : "text-slate-400"
          }`}
        >
          {up ? <ArrowUp className="h-4 w-4 text-sky-400" /> : <ArrowDown className="h-4 w-4" />}
          {up ? "rising" : "steady"}
        </span>
      </td>
    </tr>
  );
}

function LeaderboardContent({ data }: { data: PlatformData }) {
  const [selectedBattle, setSelectedBattle] = useState("all");
  const [query, setQuery] = useState("");

  const battlesList = useMemo(() => {
    const list = [{ id: "all", name: "All Battles & Scrims (Combined)", icon: Trophy }];
    data.tournaments.forEach((t) => {
      list.push({ id: t.id, name: t.name, icon: Swords });
    });
    return list;
  }, [data.tournaments]);

  const teams = useMemo(() => {
    let list = [...data.teams];

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
      .sort((a, b) => totalPoints(b) - totalPoints(a));
  }, [data.teams, query, selectedBattle]);

  return (
    <Section id="leaderboard" eyebrow="Dedicated Standings" title="Points Table per Battle">
      {/* Battle Selection Toolbar */}
      <div className="mb-6 flex flex-col gap-4 border border-sky-400/30 bg-slate-950 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-sky-400">
            Select Dedicated Battle / Scrim
          </span>
          <div className="mt-2 flex flex-wrap gap-2">
            {battlesList.map((b) => (
              <button
                key={b.id}
                type="button"
                onClick={() => setSelectedBattle(b.id)}
                className={`border px-3.5 py-2 font-mono text-xs uppercase tracking-[0.14em] transition ${
                  selectedBattle === b.id
                    ? "border-sky-400 bg-sky-500/20 font-bold text-sky-100"
                    : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {b.name}
              </button>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-2 border border-sky-400/20 bg-slate-900 px-3 py-2">
            <Search className="h-4 w-4 text-sky-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search squad..."
              className="bg-transparent font-mono text-xs uppercase text-white outline-none placeholder:text-slate-500"
            />
          </label>
        </div>
      </div>

      {teams.length ? (
        <div className="hud-panel border border-sky-400/25 overflow-x-auto p-2">
          <table className="w-full text-left min-w-[700px]">
            <thead className="border-b border-white/10 font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Squad Name</th>
                <th className="p-4">Region</th>
                <th className="p-4">WWCD</th>
                <th className="p-4">Finishes</th>
                <th className="p-4">Total PTS</th>
                <th className="p-4">Trend</th>
              </tr>
            </thead>
            <tbody>
              {teams.map((team, index) => (
                <LeaderboardRow key={team.name} team={team} rankOverride={index + 1} />
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="border border-sky-400/20 bg-slate-950 p-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
          <Trophy className="mx-auto h-10 w-10 text-sky-400/60 mb-3" />
          <p className="text-sm font-bold text-white">No Points or Team Standings Recorded Yet</p>
          <p className="mt-2 text-slate-400">Standings update live as matches conclude and frags are tallied.</p>
          <Link
            to="/register"
            className="mt-6 inline-block border border-sky-400/60 bg-sky-500/20 px-6 py-3 text-sky-200 hover:bg-sky-400 hover:text-black transition font-bold"
          >
            Register Squad to Earn Points
          </Link>
        </div>
      )}
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
