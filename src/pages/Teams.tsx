import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Section, usePlatformData } from "../lib/shared-ui";
import { totalPoints, type Team } from "../lib/platform-types";

function HallOfFameContent({ teams }: { teams: Team[] }) {
  if (!teams.length) {
    return (
      <Section id="teams" eyebrow="Featured Teams / Hall of Fame" title="Squads with Aura">
        <div className="border border-white/10 bg-black/60 p-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
          <Users className="mx-auto h-10 w-10 text-orange-400/60 mb-3" />
          <p className="text-sm font-bold text-white">No Registered Squads in Directory Yet</p>
          <p className="mt-2 text-slate-400">Be the first team to register and enter the NexBattles Hall of Fame.</p>
          <Link
            to="/register"
            className="mt-6 inline-block border border-orange-400/60 bg-orange-500/20 px-6 py-3 text-orange-200 hover:bg-orange-500 hover:text-black transition font-bold"
          >
            Register Your Squad Now
          </Link>
        </div>
      </Section>
    );
  }

  const entries = teams.map((team) => ({
    name: team.name,
    region: team.region,
    stat: `${totalPoints(team)} PTS`,
    drop: team.preferredDrop || "Pochinki",
  }));
  const marquee = [...entries, ...entries];

  return (
    <Section id="teams" eyebrow="Featured Teams / Hall of Fame" title="Squads with Aura">
      <div data-gsap-reveal className="marquee-shell">
        <div className="marquee-track">
          {marquee.map((team, index) => (
            <div key={`${team.name}-${index}`} className="flip-card">
              <div className="flip-card-inner">
                <div className="flip-face clip-panel hud-panel">
                  <Users className="h-8 w-8 text-orange-300" />
                  <h3 className="mt-8 font-display text-4xl font-bold uppercase text-white">
                    {team.name}
                  </h3>
                  <p className="font-mono text-xs uppercase tracking-[0.18em] text-green-300">
                    {team.region}
                  </p>
                </div>
                <div className="flip-face flip-back clip-panel hud-panel">
                  <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                    Battle Stats
                  </p>
                  <p className="mt-3 font-display text-5xl font-bold uppercase text-orange-300">
                    {team.stat}
                  </p>
                  <p className="mt-4 text-slate-300">Preferred drop: {team.drop}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section>
  );
}

export function TeamsPage() {
  const { data } = usePlatformData();

  return (
    <div className="pt-20">
      <HallOfFameContent teams={data.teams} />
    </div>
  );
}
