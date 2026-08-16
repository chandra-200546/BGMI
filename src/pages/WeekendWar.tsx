import { ChevronRight, Crown, Shield, Skull, Swords, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedNumber, HudMetric, MagneticButton, Section, usePlatformData } from "../lib/shared-ui";

const prizeTiers = [
  { label: "Champion Squad", split: "55%", badge: "WWCD Winner", icon: Crown },
  { label: "Runner Up", split: "30%", badge: "Finalist", icon: Swords },
  { label: "MVP Bonus", split: "15%", badge: "Top Frag Slayer", icon: Skull },
];

export function WeekendWarPage() {
  const { data } = usePlatformData();
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
            <div className="hud-panel p-6">
              {activeTournament.mediaUrl ? (
                <div className="mb-6 overflow-hidden border border-sky-400/30 bg-black">
                  <img
                    src={activeTournament.mediaUrl}
                    alt={activeTournament.name}
                    className="h-48 w-full object-cover"
                  />
                </div>
              ) : null}

              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <span className="font-mono text-xs uppercase tracking-[0.24em] text-sky-400">
                  Official Championship Format
                </span>
                <Zap className="h-6 w-6 text-sky-400" />
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
                  <MagneticButton className="w-full justify-center">
                    Register Squad for Weekend War <ChevronRight className="h-5 w-5" />
                  </MagneticButton>
                </Link>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-3">
              {prizeTiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <div
                    key={tier.label}
                    className="hud-panel min-h-64 p-5 flex flex-col justify-between"
                  >
                    <div>
                      <Icon className="h-8 w-8 text-sky-400" />
                      <p className="mt-6 font-mono text-xs uppercase tracking-[0.22em] text-sky-300">
                        {tier.badge}
                      </p>
                      <h3 className="mt-2 font-display text-3xl font-bold uppercase text-white">
                        {tier.label}
                      </h3>
                    </div>
                    <p className="mt-5 font-display text-4xl font-bold text-sky-400">
                      {prizeNumber > 0 ? (
                        <AnimatedNumber
                          value={Math.round(prizeNumber * (Number(tier.split.replace("%", "")) / 100))}
                          prefix="₹"
                        />
                      ) : (
                        tier.split
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        ) : (
          <div className="mt-10 border border-sky-400/20 bg-slate-950 p-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
            <Crown className="mx-auto h-10 w-10 text-sky-400/60 mb-3" />
            <p className="text-sm font-bold text-white">No Active Weekend War Championship Scheduled</p>
            <p className="mt-2 text-slate-400">Organizers can create and launch major weekend tournaments anytime from the Admin Panel.</p>
            <Link
              to="/admin"
              className="mt-6 inline-block border border-sky-400/60 bg-sky-500/20 px-6 py-3 text-sky-200 hover:bg-sky-400 hover:text-black transition font-bold"
            >
              Announce Championship in Admin Panel
            </Link>
          </div>
        )}

        <div className="mt-12 border border-sky-400/20 bg-slate-950/80 p-6">
          <h4 className="font-display text-3xl font-bold uppercase text-white">
            Championship Rules & Format
          </h4>
          <ul className="mt-4 grid gap-3 font-mono text-xs text-slate-300 md:grid-cols-2">
            <li className="flex items-center gap-2 border border-white/10 p-3">
              <Shield className="h-4 w-4 text-sky-400" /> 16 Placement Points + 1 Point per Frag
            </li>
            <li className="flex items-center gap-2 border border-white/10 p-3">
              <Shield className="h-4 w-4 text-sky-400" /> Room credentials released 15 mins before drop
            </li>
            <li className="flex items-center gap-2 border border-white/10 p-3">
              <Shield className="h-4 w-4 text-sky-400" /> Emulators strictly banned (Mobile Only)
            </li>
            <li className="flex items-center gap-2 border border-white/10 p-3">
              <Shield className="h-4 w-4 text-sky-400" /> Captain check-in required on Discord / WhatsApp
            </li>
          </ul>
        </div>
      </Section>
    </div>
  );
}
