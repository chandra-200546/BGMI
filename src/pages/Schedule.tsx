import { motion } from "framer-motion";
import { CalendarDays, Shield } from "lucide-react";
import { Section, usePlatformData } from "../lib/shared-ui";
import type { ScheduleItem } from "../lib/platform-types";

function ScheduleCard({ match, index }: { match: ScheduleItem; index: number }) {
  return (
    <motion.article
      data-gsap-reveal
      whileHover={{ y: -8 }}
      className="group clip-panel hud-panel min-h-64 p-5"
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-xs uppercase tracking-[0.22em] text-green-300">
          {match.group}
        </span>
        <span className="border border-orange-300/30 bg-orange-500/10 px-2 py-1 font-mono text-[0.62rem] uppercase tracking-[0.16em] text-orange-100">
          T-{index + 1} live
        </span>
      </div>
      <h3 className="mt-8 font-display text-5xl font-bold uppercase leading-none text-white">
        {match.match}
      </h3>
      <div className="mt-6 grid gap-2 text-sm text-slate-300">
        <span className="flex items-center gap-2">
          <CalendarDays className="h-4 w-4 text-orange-300" /> {match.date} / {match.time}
        </span>
        <span className="flex items-center gap-2">
          <Shield className="h-4 w-4 text-green-300" /> {match.map}
        </span>
      </div>
      <div className="mt-6 translate-y-3 border-t border-white/10 pt-4 opacity-70 transition group-hover:translate-y-0 group-hover:opacity-100">
        <p className="font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
          Room ID reveals after check-in
        </p>
        <p className="mt-2 font-display text-3xl font-bold uppercase text-orange-300">
          {match.status}
        </p>
      </div>
    </motion.article>
  );
}

function ScheduleContent({ schedules }: { schedules: ScheduleItem[] }) {
  return (
    <Section id="schedule" eyebrow="Match schedule" title="Room drops incoming.">
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {schedules.length
          ? schedules.map((match, index) => (
              <ScheduleCard key={`${match.match}-${index}`} match={match} index={index} />
            ))
          : Array.from({ length: 4 }).map((_, index) => (
              <div
                key={index}
                data-gsap-reveal
                className="skeleton-scan h-64 border border-white/10"
              />
            ))}
      </div>
    </Section>
  );
}

export function SchedulePage() {
  const { data } = usePlatformData();

  return (
    <div className="pt-20">
      <ScheduleContent schedules={data.schedules} />
    </div>
  );
}
