import { ChevronRight, Crown, Shield, Skull, Swords, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import { AnimatedNumber, HudMetric, MagneticButton, Section, usePlatformData } from "../lib/shared-ui";
import { TournamentSlotCard } from "../components/TournamentSlotCard";

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
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <Section eyebrow="Category 01 / Major Championship" title="Weekend War Championship">
        <p className="max-w-3xl font-mono text-sm leading-relaxed text-slate-300">
          The ultimate weekend arena for top-tier battle royale squads. Heavy prize pools, official caster coverage, live drop points, and verified leaderboard rankings.
        </p>

        {activeTournament ? (
          <div className="mt-10 space-y-6">
            <TournamentSlotCard tournament={activeTournament} />

            <div className="grid gap-4 md:grid-cols-3">
              {prizeTiers.map((tier) => {
                const Icon = tier.icon;
                return (
                  <div
                    key={tier.label}
                    className="hud-panel min-h-64 p-5 flex flex-col justify-between border border-sky-400/20 bg-slate-950"
                  >
                    <div>
                      <Icon className="h-8 w-8 text-sky-400" />
                      <p className="mt-6 font-mono text-xs uppercase tracking-[0.22em] text-sky-300 font-bold">
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
            <p className="text-sm font-bold text-white">No Active Weekend War Championship Scheduled Currently</p>
            <p className="mt-2 text-slate-400">Championships will appear here automatically when announced live by organizers.</p>
          </div>
        )}

        <div className="mt-12 border border-sky-400/20 bg-slate-950/80 p-6">
          <h4 className="font-display text-3xl font-bold uppercase text-white">
            Championship Rules & Format
          </h4>
          <ul className="mt-4 space-y-2 font-mono text-xs text-slate-300 leading-relaxed">
            <li>• All team rosters must match registered BGMI In-Game Names (IGNs).</li>
            <li>• Room credentials (ID & Password) are released to verified team captains prior to match drop.</li>
            <li>• Point calculation follows standard BGIS/BGMS rules: 10 placement pts for WWCD + 1 finish pt per kill.</li>
          </ul>
        </div>
      </Section>
    </div>
  );
}
