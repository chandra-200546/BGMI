import { motion } from "framer-motion";
import { CalendarDays, Clock, Flame, Shield, Swords, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { HudMetric, MagneticButton, Section, usePlatformData, useSoundDesign } from "../lib/shared-ui";

export function DailyGrindPage() {
  const { data } = usePlatformData();
  const sound = useSoundDesign();

  const scrimSlots = [
    { time: "02:00 PM", match: "Slot 1 - Warmup Scrim", map: "Erangel", slots: "18/20", status: "OPEN" },
    { time: "05:00 PM", match: "Slot 2 - Prime Grind", map: "Miramar", slots: "20/20", status: "FULL" },
    { time: "08:00 PM", match: "Slot 3 - Night Frag War", map: "Sanhok", slots: "16/20", status: "OPEN" },
    { time: "10:30 PM", match: "Slot 4 - Late Night Showdown", map: "Erangel", slots: "12/20", status: "OPEN" },
  ];

  return (
    <div className="pt-24 pb-16">
      <Section eyebrow="Category 02 / Daily Scrim Lobbies" title="Daily Grind Scrims">
        <p className="max-w-3xl font-mono text-sm leading-relaxed text-slate-300">
          Fast-paced daily practice matches for registered squads to refine rotations, drop strategies, and gunplay before major weekend tournaments.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <HudMetric label="Daily Lobbies" value="4 Slots" />
          <HudMetric label="Daily Teams" value="80+ Squads" />
          <HudMetric label="Point Table" value="Auto Calculated" />
          <HudMetric label="Room Protection" value="AES Encrypted" />
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {scrimSlots.map((slot, index) => (
            <motion.div
              key={slot.time}
              whileHover={{ y: -6 }}
              className="clip-panel hud-panel border border-white/10 p-6 transition hover:border-orange-400/50"
            >
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] text-green-300">
                  <Clock className="h-4 w-4 text-orange-300" /> {slot.time}
                </span>
                <span
                  className={`border px-3 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] ${
                    slot.status === "OPEN"
                      ? "border-green-400/40 bg-green-500/10 text-green-100"
                      : "border-red-400/40 bg-red-500/10 text-red-100"
                  }`}
                >
                  {slot.status} ({slot.slots})
                </span>
              </div>

              <h3 className="mt-4 font-display text-4xl font-bold uppercase text-white">
                {slot.match}
              </h3>

              <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-xs text-slate-300">
                <span className="flex items-center gap-1.5">
                  <Shield className="h-4 w-4 text-orange-300" /> {slot.map}
                </span>
                <span className="flex items-center gap-1.5">
                  <Flame className="h-4 w-4 text-orange-400" /> Tier 1/2 Practice
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
      </Section>
    </div>
  );
}
