import { motion } from "framer-motion";
import { ArrowDown, ArrowUp, Crown, Flame, Search, Skull, Trophy, Swords, CalendarDays } from "lucide-react";
import { useMemo, useState } from "react";
import { Section, usePlatformData } from "../lib/shared-ui";
import { totalPoints, type Team } from "../lib/platform-types";

const battlesList = [
  { id: "all", name: "All Battles (Cumulative)", icon: Trophy },
  { id: "weekend-war", name: "Weekend War Championship (Season 4)", icon: Crown },
  { id: "daily-slot-1", name: "Daily Grind - Slot 1 (02:00 PM)", icon: Flame },
  { id: "daily-slot-2", name: "Daily Grind - Slot 2 (05:00 PM)", icon: Flame },
  { id: "daily-slot-3", name: "Daily Grind - Slot 3 (08:00 PM)", icon: Flame },
  { id: "daily-slot-4", name: "Daily Grind - Slot 4 (10:30 PM)", icon: Flame },
  { id: "elite-series", name: "Elite Series Qualifiers", icon: Swords },
];

const mvpPlayers = [
  { name: "JONATHAN", team: "GodLike Ops", frags: 34, damage: "4,890 HP", matches: 6, avatar: "👑" },
  { name: "GOBBLIN", team: "Soul Ember", frags: 29, damage: "4,120 HP", matches: 6, avatar: "⚡" },
  { name: "MAVI", team: "Hydra Blitz", frags: 27, damage: "3,950 HP", matches: 6, avatar: "🔥" },
  { name: "SPOWER", team: "Revenant X", frags: 25, damage: "3,810 HP", matches: 6, avatar: "🎯" },
];

export function WeeklyPointsPage() {
  const { data } = usePlatformData();
  const [selectedBattle, setSelectedBattle] = useState("all");
  const [query, setQuery] = useState("");

  const currentBattle = useMemo(() => {
    return battlesList.find((b) => b.id === selectedBattle) ?? battlesList[0];
  }, [selectedBattle]);

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

  return (
    <div className="pt-24 pb-16">
      <Section eyebrow="Dedicated Standings" title="Weekly & Weekend Points Table">
        <p className="max-w-3xl font-mono text-sm leading-relaxed text-slate-300">
          Cumulative and dedicated standings for current weekly & weekend battle stages. Points include WWCD placement rewards plus raw frag kills minus any official penalties.
        </p>

        {/* Battle Filter Selector */}
        <div className="mt-8 border border-orange-500/30 bg-black/60 p-4">
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

        {/* Top Weekly MVPs */}
        <div className="mt-10">
          <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.24em] text-orange-300">
            <Trophy className="h-4 w-4" /> Dedicated MVP Frag Slayers — {currentBattle.name}
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
            <div>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-green-300">
                Battle Standings
              </span>
              <h3 className="font-display text-2xl font-bold uppercase text-white">
                {currentBattle.name}
              </h3>
            </div>
            <label className="flex items-center gap-2 border border-white/10 bg-black/40 px-3.5 py-2">
              <Search className="h-4 w-4 text-orange-300" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search weekly squad"
                className="bg-transparent font-mono text-xs uppercase tracking-[0.12em] text-white outline-none"
              />
            </label>
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
                  const up = team.form[0] === "W" || idx < 3;
                  return (
                    <tr key={team.name} className="border-t border-white/10 hover:bg-orange-500/10">
                      <td className="p-4 font-display text-3xl font-bold text-orange-300">
                        #{idx + 1}
                      </td>
                      <td className="p-4">
                        <p className="font-bold text-white text-base">{team.name}</p>
                        <p className="font-mono text-xs uppercase text-slate-400">
                          {team.short} / Capt. {team.captain}
                        </p>
                      </td>
                      <td className="p-4 text-slate-300 font-mono text-xs">{team.region}</td>
                      <td className="p-4 text-white font-bold">6</td>
                      <td className="p-4 text-white font-bold">{team.wwcd}</td>
                      <td className="p-4 text-white font-bold">{team.finishes}</td>
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
