import { motion } from "framer-motion";
import { ChevronRight, Crown, Shield, Skull, Swords, Trophy, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedNumber, HudMetric, MagneticButton, Section, usePlatformData, useSoundDesign } from "../lib/shared-ui";

const prizeTiers = [
  { label: "Champion Squad", split: "55%", badge: "WWCD Winner", icon: Crown },
  { label: "Runner Up", split: "30%", badge: "Finalist", icon: Swords },
  { label: "MVP Bonus", split: "15%", badge: "Top Frag Slayer", icon: Skull },
];

export function WeekendWarPage() {
  const { data } = usePlatformData();
  const sound = useSoundDesign();
  const activeTournament = data.tournaments[0];
  const prizeNumber = Number((activeTournament?.prize ?? "0").replace(/[^0-9]/g, "")) || 0;

  return (
    <div className="pt-24 pb-16">
      <Section eyebrow="Category 01 / Major Championship" title="Weekend War Championship">
        <p className="max-w-3xl font-mono text-sm leading-relaxed text-slate-300">
          The ultimate weekend arena for top-tier battle royale squads. Heavy prize pools, official caster coverage, live drop points, and verified leaderboard rankings.
        </p>

        {activeTournament ? (
          <div className="mt-10 grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div data-gsap-reveal className="clip-panel hud-panel p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-mono text-xs uppercase tracking-[0.24em] text-orange-300">
                  Official Championship Format
                </span>
                <Zap className="h-6 w-6 text-orange-300" />
              </div>
              <h3 className="mt-4 font-display text-4xl font-bold uppercase text-white">
                {activeTournament.name}
              </h3>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <HudMetric label="Total Prize" value={activeTournament.prize} />
                <HudMetric label="Entry Fee" value={activeTournament.fee} />
                <HudMetric label="Format" value={activeTournament.mode} />
                <HudMetric label="Map Pool" value={activeTournament.map || "Erangel / Miramar"} />
              </div>

              <div className="mt-8">
                <Link to="/register">
                  <MagneticButton playSound={sound.play} className="w-full justify-center">
                    Register Squad for Weekend War <ChevronRight className="h-5 w-5" />
                  </MagneticButton>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {prizeTiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <motion.div
                    key={tier.label}
                    whileHover={{ y: -8, rotateX: 5 }}
                    className="clip-panel hud-panel min-h-64 p-5"
                  >
                    <Icon className="h-8 w-8 text-orange-300" />
                    <p className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-green-300">
                      {tier.badge}
                    </p>
                    <h3 className="mt-2 font-display text-3xl font-bold uppercase text-white">
                      {tier.label}
                    </h3>
                    <p className="mt-5 font-display text-4xl font-bold text-orange-300">
                      {prizeNumber > 0 ? (
                        <AnimatedNumber
                          value={Math.round(prizeNumber * (Number(tier.split.replace("%", "")) / 100))}
                          prefix="₹"
                        />
                      ) : (
                        tier.split
                      )}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-10 border border-white/10 bg-black/60 p-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
            <Crown className="mx-auto h-10 w-10 text-orange-400/60 mb-3" />
            <p className="text-sm font-bold text-white">No Active Weekend War Championship Scheduled</p>
            <p className="mt-2 text-slate-400">Organizers can create and launch major weekend tournaments anytime from the Admin Panel.</p>
            <Link
              to="/admin"
              className="mt-6 inline-block border border-orange-400/60 bg-orange-500/20 px-6 py-3 text-orange-200 hover:bg-orange-500 hover:text-black transition font-bold"
            >
              Announce Championship in Admin Panel
            </Link>
          </div>
        )}

        <div className="mt-12 border border-white/10 bg-black/50 p-6 backdrop-blur-md">
          <h4 className="font-display text-3xl font-bold uppercase text-white">
            Championship Rules & Format
          </h4>
          <ul className="mt-4 grid gap-3 font-mono text-xs text-slate-300 md:grid-cols-2">
            <li className="flex items-center gap-2 border border-white/10 p-3">
              <Shield className="h-4 w-4 text-orange-300" /> 16 Placement Points + 1 Point per Frag
            </li>
            <li className="flex items-center gap-2 border border-white/10 p-3">
              <Shield className="h-4 w-4 text-orange-300" /> Room credentials released 15 mins before drop
            </li>
            <li className="flex items-center gap-2 border border-white/10 p-3">
              <Shield className="h-4 w-4 text-orange-300" /> Emulators strictly banned (Mobile Only)
            </li>
            <li className="flex items-center gap-2 border border-white/10 p-3">
              <Shield className="h-4 w-4 text-orange-300" /> Captain check-in required on Discord / WhatsApp
            </li>
          </ul>
        </div>
      </Section>
    </div>
  );
}
