import {
  CalendarDays,
  Crown,
  Flame,
  HelpCircle,
  Shield,
  Swords,
  Trophy,
  Users,
} from "lucide-react";
import { Link } from "react-router-dom";

const categories = [
  {
    number: "01",
    title: "Weekend War Championship",
    subtitle: "Major Prize Pool Arena",
    desc: "Official weekend tournament with caster coverage, live drop locations, and verified prize payouts.",
    route: "/weekend-war",
    badge: "MAJOR TOURNAMENT",
    icon: Crown,
    highlight: "₹50,000 Prize Pool",
  },
  {
    number: "02",
    title: "Daily Grind Scrims",
    subtitle: "Tier 1 & 2 Practice Lobbies",
    desc: "Fast-paced daily practice matches with 4 slot windows, live map rotations, and protected room keys.",
    route: "/daily-grind",
    badge: "DAILY SCRIMS",
    icon: Flame,
    highlight: "4 Slots Daily",
  },
  {
    number: "03",
    title: "Daily Scrim Points Table + MVP",
    subtitle: "Real-Time Leaderboard & Frag Slayers",
    desc: "Live placement points + finish points calculation. Search squads, view trend badges, and track top MVPs.",
    route: "/points-table",
    badge: "LIVE STANDINGS",
    icon: Trophy,
    highlight: "Auto Calculated",
  },
  {
    number: "04",
    title: "Weekly & Weekend Points Table",
    subtitle: "Aggregate Tournament Standings",
    desc: "Cumulative weekly standings table with top frag slayer player cards, damage stats, and WWCD counts.",
    route: "/weekly-points",
    badge: "CUMULATIVE",
    icon: Swords,
    highlight: "Top Frag Slayers",
  },
  {
    number: "05",
    title: "Elite Series Registration",
    subtitle: "Squad Lock & Comms Channel",
    desc: "Registration pipeline for team captains: Squad Profile -> Captain Details -> Roster -> Payment proof screenshot.",
    route: "/register",
    badge: "REGISTRATION",
    icon: Shield,
    highlight: "Squad Lock",
  },
  {
    number: "06",
    title: "Team & Member Directory",
    subtitle: "Featured Squads & Player Profiles",
    desc: "Directory of registered squads with preferred drop locations, regions, and captain handles.",
    route: "/teams",
    badge: "HALL OF FAME",
    icon: Users,
    highlight: "Squad Directory",
  },
  {
    number: "07",
    title: "Special Scrim Lobbies",
    subtitle: "Room Release Vault & Check-ins",
    desc: "Upcoming match schedule cards, lobby timings, group stages, and protected room credential releases.",
    route: "/schedule",
    badge: "MATCH VAULT",
    icon: CalendarDays,
    highlight: "Protected Keys",
  },
  {
    number: "08",
    title: "Rules & Support Desk",
    subtitle: "Fair Play & Contact",
    desc: "Review official battle-royale rules, emulator policies, support numbers, and organizer contact details.",
    route: "/terms",
    badge: "SUPPORT DESK",
    icon: HelpCircle,
    highlight: "Official Policies",
  },
];

export function HomePage() {
  return (
    <div className="pt-24 pb-16 px-4 lg:px-8 max-w-7xl mx-auto">
      {/* Category Index Header */}
      <div className="mb-12 border-b border-sky-400/20 pb-6">
        <span className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-sky-400">
          Official Category Index
        </span>
        <h1 className="mt-2 font-display text-5xl font-bold uppercase text-white md:text-7xl">
          LordsEsports BGMI Arena
        </h1>
        <p className="mt-2 font-mono text-xs text-slate-400 max-w-2xl">
          Select a category below to access registered lobbies, dedicated standings, squad registration, or official tournament rules.
        </p>
      </div>

      {/* Grid of 8 Numbered Category Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {categories.map((cat) => {
          const Icon = cat.icon;
          return (
            <Link
              key={cat.number}
              to={cat.route}
              className="group relative flex flex-col justify-between border border-sky-400/25 bg-slate-950 p-6 transition hover:border-sky-400 hover:bg-sky-950/20"
            >
              <div>
                {/* Header: Number & Badge */}
                <div className="flex items-center justify-between border-b border-white/10 pb-3">
                  <span className="font-display text-3xl font-bold text-sky-400">
                    {cat.number}
                  </span>
                  <span className="border border-sky-400/40 bg-sky-500/10 px-2 py-0.5 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-sky-300">
                    {cat.badge}
                  </span>
                </div>

                {/* Icon & Title */}
                <div className="mt-5">
                  <Icon className="h-8 w-8 text-sky-400 transition group-hover:scale-110" />
                  <h3 className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-white group-hover:text-sky-300">
                    {cat.title}
                  </h3>
                  <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-sky-300">
                    {cat.subtitle}
                  </p>
                </div>

                {/* Description */}
                <p className="mt-4 font-mono text-xs leading-relaxed text-slate-400">
                  {cat.desc}
                </p>
              </div>

              {/* Footer: Highlight tag */}
              <div className="mt-6 border-t border-white/10 pt-3">
                <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-sky-300">
                  {cat.highlight} →
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
