import { CalendarDays, Shield } from "lucide-react";
import { Section, usePlatformData } from "../lib/shared-ui";
import type { ScheduleItem } from "../lib/platform-types";

function ScheduleCard({ match, index }: { match: ScheduleItem; index: number }) {
  return (
    <article className="group hud-panel border border-sky-400/25 min-h-64 p-5 flex flex-col justify-between transition hover:border-sky-400 bg-slate-950">
      <div>
        <div className="flex items-center justify-between">
          <span className="font-mono text-xs uppercase tracking-[0.22em] text-sky-400 font-bold">
            {match.group || "Group A"}
          </span>
          <span className="border border-sky-400/30 bg-sky-500/10 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-sky-200">
            Match T-{index + 1}
          </span>
        </div>
        <h3 className="mt-6 font-display text-4xl font-bold uppercase leading-none text-white">
          {match.match || match.title}
        </h3>
        <div className="mt-4 grid gap-2 text-sm text-slate-300">
          <span className="flex items-center gap-2">
            <CalendarDays className="h-4 w-4 text-sky-400" /> {match.startsAt || match.date || "TBA"}
          </span>
          <span className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-sky-300" /> {match.map || "Erangel"}
          </span>
        </div>
      </div>
      <div className="mt-6 border-t border-white/10 pt-4">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
          Room ID reveals after check-in
        </p>
        <p className="mt-1 font-display text-3xl font-bold uppercase text-sky-400">
          {match.status || "UPCOMING"}
        </p>
      </div>
    </article>
  );
}

function ScheduleContent({ schedules }: { schedules: ScheduleItem[] }) {
  return (
    <Section id="schedule" eyebrow="Match Schedule" title="Upcoming Scrim & Match Drops">
      {schedules.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {schedules.map((match, index) => (
            <ScheduleCard key={`${match.match || match.title}-${index}`} match={match} index={index} />
          ))}
        </div>
      ) : (
        <div className="border border-sky-400/20 bg-slate-950 p-10 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
          <CalendarDays className="mx-auto h-10 w-10 text-sky-400/60 mb-3" />
          <p className="text-sm font-bold text-white">No Upcoming Match Schedules Posted Yet</p>
          <p className="mt-2 text-slate-400">Match drop schedules will appear here live once published by organizers in the Admin Panel.</p>
        </div>
      )}
    </Section>
  );
}

export function SchedulePage() {
  const { data } = usePlatformData();

  return (
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <ScheduleContent schedules={data.schedules} />
    </div>
  );
}
