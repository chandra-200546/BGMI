import { Clock, Flame, Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { HudMetric, Section, usePlatformData } from "../lib/shared-ui";
import { TournamentSlotCard } from "../components/TournamentSlotCard";

export function DailyGrindPage() {
  const { data } = usePlatformData();
  const tournaments = data.tournaments ?? [];

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <Section eyebrow="Category 02 / Daily Scrim Lobbies" title="Daily Grind Scrims">
        <p className="max-w-3xl font-mono text-sm leading-relaxed text-slate-300">
          Fast-paced daily practice matches for registered squads to refine rotations, drop strategies, and gunplay before major weekend tournaments.
        </p>

        <div className="mt-8 grid grid-cols-2 gap-4 md:grid-cols-4">
          <HudMetric label="Active Lobbies" value={`${tournaments.length} Lobbies`} />
          <HudMetric label="Registered Squads" value={`${data.teams.length} Squads`} />
          <HudMetric label="Point Table" value="Auto Calculated" />
          <HudMetric label="Room Protection" value="Protected" />
        </div>

        {tournaments.length ? (
          <div className="mt-12 grid gap-6">
            {tournaments.map((t) => (
              <TournamentSlotCard key={t.id} tournament={t} />
            ))}
          </div>
        ) : (
          <div className="mt-12 border border-sky-400/20 bg-slate-950 p-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
            <Flame className="mx-auto h-10 w-10 text-sky-400/60 mb-3" />
            <p className="text-sm font-bold text-white">No Daily Scrim Lobbies Scheduled Currently</p>
            <p className="mt-2 text-slate-400">Lobbies will appear here automatically when announced live by organizers.</p>
          </div>
        )}
      </Section>
    </div>
  );
}
