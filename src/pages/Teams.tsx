import { Users } from "lucide-react";
import { Section, usePlatformData } from "../lib/shared-ui";
import { totalPoints, type Team } from "../lib/platform-types";

const hallFallback = [
  { name: "Hydra Blitz", region: "North", stat: "4 WWCD", drop: "Georgopol" },
  { name: "Soul Ember", region: "West", stat: "78 Finishes", drop: "Pochinki" },
  { name: "Revenant X", region: "South", stat: "212 Points", drop: "School" },
  { name: "GodLike Ops", region: "East", stat: "99% Check-in", drop: "Military Base" },
];

function HallOfFameContent({ teams }: { teams: Team[] }) {
  const entries = teams.length
    ? teams.slice(0, 8).map((team) => ({
        name: team.name,
        region: team.region,
        stat: `${totalPoints(team)} PTS`,
        drop: team.drop,
      }))
    : hallFallback;
  const marquee = [...entries, ...entries];

  return (
    <Section id="teams" eyebrow="Featured teams / Hall of fame" title="Squads with aura.">
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
                    Battle stats
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
