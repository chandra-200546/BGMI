import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Crown, Flame, Search, Skull, Trophy } from "lucide-react";
import { useMemo, useState } from "react";
import { Section, usePlatformData } from "../lib/shared-ui";
import { totalPoints, type Team } from "../lib/platform-types";

const mvpPlayers = [
  { name: "JONATHAN", team: "GodLike Ops", frags: 34, damage: "4,890 HP", matches: 6, avatar: "👑" },
  { name: "GOBBLIN", team: "Soul Ember", frags: 29, damage: "4,120 HP", matches: 6, avatar: "⚡" },
  { name: "MAVI", team: "Hydra Blitz", frags: 27, damage: "3,950 HP", matches: 6, avatar: "🔥" },
  { name: "SPOWER", team: "Revenant X", frags: 25, damage: "3,810 HP", matches: 6, avatar: "🎯" },
];

export function WeeklyPointsPage() {
  const { data } = usePlatformData();
  const [query, setQuery] = useState("");

  const teams = useMemo(() => {
    return [...data.teams]
      .filter((team) =>
        `${team.name} ${team.short} ${team.region}`.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => totalPoints(b) - totalPoints(a));
  }, [data.teams, query]);

  return (
    <div className="pt-24 pb-16">
      <Section eyebrow="Category 04 / Aggregate Standings" title="Weekly & Weekend Points Table">
        <p className="max-w-3xl font-mono text-sm leading-relaxed text-slate-300">
          Cumulative standings for current weekly & weekend battle stages. Points include WWCD placement rewards plus raw frag kills minus any official penalties.
        </p>

        {/* Top Weekly MVPs */}
        <div className="mt-10">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-orange-300">
            <Trophy className="h-4 w-4" /> Weekly MVP Frag Slayers
          </div>
          <div className="mt-4 grid gap-4 md:grid-cols-4">
            {mvpPlayers.map((mvp, index) => (
              <motion.div
                key={mvp.name}
                whileHover={{ y: -6 }}
                className="clip-panel hud-panel border border-orange-500/30 p-5 relative overflow-hidden"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs uppercase tracking-[0.2em] text-green-300">
                    MVP Rank #{index + 1}
                  </span>
                  <span className="text-xl">{mvp.avatar}</span>
                </div>
                <h4 className="mt-4 font-display text-4xl font-bold uppercase text-white">
                  {mvp.name}
                </h4>
                <p className="font-mono text-xs uppercase tracking-[0.16em] text-slate-400">
                  {mvp.team}
                </p>
                <div className="mt-4 border-t border-white/10 pt-3 flex items-center justify-between font-mono text-xs">
                  <span className="text-orange-300 font-bold">{mvp.frags} Finishes</span>
                  <span className="text-slate-400">{mvp.damage}</span>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Points Table */}
        <div className="mt-12 clip-panel hud-panel overflow-hidden">
          <div className="flex flex-col gap-3 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
            <label className="flex items-center gap-2 border border-white/10 bg-black/40 px-3 py-2">
              <Search className="h-4 w-4 text-orange-300" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search weekly squad"
                className="bg-transparent font-mono text-xs uppercase tracking-[0.12em] text-white outline-none"
              />
            </label>
            <div className="font-mono text-xs uppercase tracking-[0.2em] text-green-300">
              {data.teams.length} Verified Squads
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-left">
              <thead className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-slate-500">
                <tr>
                  <th className="p-4">Rank</th>
                  <th className="p-4">Squad</th>
                  <th className="p-4">Region</th>
                  <th className="p-4">Matches</th>
                  <th className="p-4">WWCD</th>
                  <th className="p-4">Finishes</th>
                  <th className="p-4">Total PTS</th>
                  <th className="p-4">Trend</th>
                </tr>
              </thead>
              <tbody>
                {teams.map((team, idx) => {
                  const up = team.form[0] === "W" || team.rank <= 3;
                  return (
                    <tr key={team.name} className="border-t border-white/10 hover:bg-orange-500/10">
                      <td className="p-4 font-display text-3xl font-bold text-orange-300">
                        #{idx + 1}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-white">{team.name}</p>
                        <p className="font-mono text-xs uppercase text-slate-500">
                          {team.short} / {team.captain}
                        </p>
                      </td>
                      <td className="p-4 text-slate-300">{team.region}</td>
                      <td className="p-4 text-white">6</td>
                      <td className="p-4 text-white">{team.wwcd}</td>
                      <td className="p-4 text-white">{team.finishes}</td>
                      <td className="p-4 font-display text-3xl font-bold text-white">
                        {totalPoints(team)}
                      </td>
                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.18em] ${
                            up ? "text-green-300" : "text-red-300"
                          }`}
                        >
                          {up ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
                          {up ? "dominant" : "pressure"}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </Section>
    </div>
  );
}
