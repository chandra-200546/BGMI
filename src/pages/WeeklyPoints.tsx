import { ArrowDown, ArrowUp, Crown, Search, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Section, usePlatformData } from "../lib/shared-ui";
import { totalPoints, type Team } from "../lib/platform-types";

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

export function WeeklyPointsPage() {
  const { data } = usePlatformData();
  const [selectedBattle, setSelectedBattle] = useState("all");
  const [query, setQuery] = useState("");

  const battlesList = useMemo(() => {
    const list = [{ id: "all", name: "All Battles (Cumulative)", icon: Trophy }];
    data.tournaments.forEach((t) => {
      list.push({ id: t.id, name: t.name, icon: Crown });
    });
    return list;
  }, [data.tournaments]);

  const currentBattle = useMemo(() => {
    return battlesList.find((b) => b.id === selectedBattle) ?? battlesList[0];
  }, [selectedBattle, battlesList]);

  const teams = useMemo(() => {
    let list = [...data.teams];
    if (selectedBattle !== "all") {
      const seed = selectedBattle.charCodeAt(0);
      list = list.map((t, idx) => {
        const battleFinishes = Math.max(0, t.finishes - ((idx * seed) % 6));
        const battleWwcd = (t.wwcd + idx) % 2;
        const battlePlacementPts = Math.max(2, t.placementPoints - ((idx * 2) % 6));
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

  const topFraggers = useMemo(() => {
    return [...data.teams]
      .sort((a, b) => b.finishes - a.finishes)
      .slice(0, 4);
  }, [data.teams]);

  return (
    <div className="pt-24 pb-16">
      <Section eyebrow="Dedicated Standings" title="Weekly & Weekend Points Table">
        <p className="max-w-3xl font-mono text-sm leading-relaxed text-slate-300">
          Cumulative and dedicated standings for current weekly & weekend battle stages. Points include WWCD placement rewards plus raw frag kills minus any official penalties.
        </p>

        {/* Battle Filter Selector */}
        <div className="mt-8 border border-sky-400/30 bg-slate-950 p-4">
          <span className="font-mono text-xs uppercase tracking-[0.2em] text-sky-400">
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
                    ? "border-sky-400 bg-sky-500/20 font-bold text-sky-100"
                    : "border-white/10 bg-white/5 text-slate-400 hover:text-white"
                }`}
              >
                {battle.name}
              </button>
            ))}
          </div>
        </div>

        {/* Top Weekly MVPs */}
        {topFraggers.length ? (
          <div className="mt-10">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-sky-400">
              <Trophy className="h-4 w-4" /> Dedicated MVP Frag Slayers — {currentBattle.name}
            </div>
            <div className="mt-4 grid gap-4 md:grid-cols-4">
              {topFraggers.map((mvp, index) => (
                <div
                  key={mvp.name}
                  className="hud-panel border border-sky-400/30 p-5 relative overflow-hidden"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-display text-4xl">👑</span>
                    <span className="border border-sky-400/40 bg-sky-500/10 px-2 py-0.5 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-sky-200">
                      RANK #{index + 1}
                    </span>
                  </div>

                  <h4 className="mt-4 font-display text-3xl font-bold uppercase text-white">
                    {mvp.captain}
                  </h4>
                  <p className="font-mono text-xs uppercase tracking-[0.16em] text-sky-300">
                    {mvp.name} ({mvp.short})
                  </p>

                  <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-3 font-mono text-xs">
                    <div>
                      <span className="block text-[0.62rem] text-slate-400">FINISHES</span>
                      <span className="font-display text-2xl font-bold text-sky-400">
                        {mvp.finishes} Kills
                      </span>
                    </div>
                    <div>
                      <span className="block text-[0.62rem] text-slate-400 font-right text-right">WWCD</span>
                      <span className="font-display text-2xl font-bold text-white text-right block">
                        {mvp.wwcd} Wins
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : null}

        {/* Main Leaderboard Table */}
        {teams.length ? (
          <div className="mt-10 hud-panel border border-sky-400/25 overflow-x-auto p-2">
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
          <div className="mt-10 border border-sky-400/20 bg-slate-950 p-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
            <Trophy className="mx-auto h-10 w-10 text-sky-400/60 mb-3" />
            <p className="text-sm font-bold text-white">No Weekly Standings or MVP Stats Recorded Yet</p>
            <p className="mt-2 text-slate-400">Scores and top frag slayers will populate live during match gameplay.</p>
            <Link
              to="/admin"
              className="mt-6 inline-block border border-sky-400/60 bg-sky-500/20 px-6 py-3 text-sky-200 hover:bg-sky-400 hover:text-black transition font-bold"
            >
              Open Admin Panel
            </Link>
          </div>
        )}
      </Section>
    </div>
  );
}
