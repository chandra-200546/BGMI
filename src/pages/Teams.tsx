import { Users } from "lucide-react";
import { Link } from "react-router-dom";
import { Section, usePlatformData } from "../lib/shared-ui";
import { totalPoints, type Team } from "../lib/platform-types";

function HallOfFameContent({ teams }: { teams: Team[] }) {
  if (!teams.length) {
    return (
      <Section id="teams" eyebrow="Featured Teams / Hall of Fame" title="Squad Directory">
        <div className="border border-sky-400/20 bg-slate-950 p-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
          <Users className="mx-auto h-10 w-10 text-sky-400/60 mb-3" />
          <p className="text-sm font-bold text-white">No Registered Squads in Directory Yet</p>
          <p className="mt-2 text-slate-400">Be the first team to register and enter the LordsEsports Hall of Fame.</p>
          <Link
            to="/register"
            className="mt-6 inline-block border border-sky-400/60 bg-sky-500/20 px-6 py-3 text-sky-200 hover:bg-sky-400 hover:text-black transition font-bold"
          >
            Register Your Squad Now
          </Link>
        </div>
      </Section>
    );
  }

  return (
    <Section id="teams" eyebrow="Featured Teams / Hall of Fame" title="Squad Directory">
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {teams.map((team, index) => (
          <div
            key={`${team.name}-${index}`}
            className="hud-panel border border-sky-400/25 p-6 flex flex-col justify-between"
          >
            <div>
              <Users className="h-8 w-8 text-sky-400" />
              <h3 className="mt-4 font-display text-4xl font-bold uppercase text-white">
                {team.name}
              </h3>
              <p className="font-mono text-xs uppercase tracking-[0.18em] text-sky-300">
                {team.region} / Capt. {team.captain}
              </p>
            </div>

            <div className="mt-6 border-t border-white/10 pt-4">
              <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate-400">
                Battle Stats
              </p>
              <p className="mt-1 font-display text-4xl font-bold uppercase text-sky-400">
                {totalPoints(team)} PTS
              </p>
              <p className="mt-2 text-xs font-mono text-slate-300">
                Preferred Drop: <span className="text-white">{team.preferredDrop || "Pochinki"}</span>
              </p>
            </div>
          </div>
        ))}
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
