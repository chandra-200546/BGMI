import { motion } from "framer-motion";
import { CalendarDays, Clock, Flame, Shield, Swords, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { HudMetric, MagneticButton, Section, usePlatformData, useSoundDesign } from "../lib/shared-ui";

export function DailyGrindPage() {
  const { data } = usePlatformData();
  const sound = useSoundDesign();

  const realLobbies = data.schedules.length
    ? data.schedules
    : data.tournaments
        .filter((t) => t.name.toLowerCase().includes("daily") || t.name.toLowerCase().includes("grind") || t.name.toLowerCase().includes("scrim"))
        .map((t) => ({
          id: t.id,
          title: t.name,
          startsAt: t.starts,
          map: t.map,
          status: t.status,
          group: t.mode,
        }));

  return (
    <div className="pt-24 pb-16">
      <Section eyebrow="Category 02 / Daily Scrim Lobbies" title="Daily Grind Scrims">
        <p className="max-w-3xl font-mono text-sm leading-relaxed text-slate-300">
          Fast-paced daily practice matches for registered squads to refine rotations, drop strategies, and gunplay before major weekend tournaments.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <HudMetric label="Active Lobbies" value={`${realLobbies.length} Lobbies`} />
          <HudMetric label="Registered Squads" value={`${data.teams.length} Squads`} />
          <HudMetric label="Point Table" value="Auto Calculated" />
          <HudMetric label="Room Protection" value="AES Encrypted" />
        </div>

        {realLobbies.length ? (
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {realLobbies.map((lobby, index) => (
              <motion.div
                key={lobby.id ?? index}
                whileHover={{ y: -6 }}
                className="clip-panel hud-panel border border-white/10 p-6 transition hover:border-orange-400/50"
              >
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-green-300">
                    <Clock className="h-4 w-4 text-orange-300" /> {lobby.startsAt}
                  </span>
                  <span className="border border-green-400/40 bg-green-500/10 px-3 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] text-green-100">
                    {lobby.status}
                  </span>
                </div>

                <h3 className="mt-4 font-display text-4xl font-bold uppercase text-white">
                  {lobby.title}
                </h3>

                <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Shield className="h-4 w-4 text-orange-300" /> {lobby.map || "Erangel"}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Flame className="h-4 w-4 text-orange-400" /> {lobby.group || "Squad TPP"}
                  </span>
                </div>

                <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
                  <span className="font-mono text-[0.68rem] uppercase tracking-[0.18em] text-slate-400">
                    Protected Credentials
                  </span>
                  <Link to="/register">
                    <MagneticButton playSound={sound.play} sound="reload">
                      Join Scrim
                    </MagneticButton>
                  </Link>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-white/10 bg-black/60 p-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
            <Flame className="mx-auto h-10 w-10 text-orange-400/60 mb-3" />
            <p className="text-sm font-bold text-white">No Daily Scrim Lobbies Scheduled Currently</p>
            <p className="mt-2 text-slate-400">Lobbies will appear here automatically when announced by organizers in the Admin Panel.</p>
            <Link
              to="/admin"
              className="mt-6 inline-block border border-orange-400/60 bg-orange-500/20 px-6 py-3 text-orange-200 hover:bg-orange-500 hover:text-black transition font-bold"
            >
              Announce Lobbies in Admin Panel
            </Link>
          </div>
        )}
      </Section>
    </div>
  );
}
