import { motion } from "framer-motion";
import {
  CalendarDays,
  ChevronRight,
  Crown,
  Flame,
  Search,
  Shield,
  Skull,
  Swords,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  HudMetric,
  MagazineLoader,
  MagneticButton,
  parseDisplayDate,
  Section,
  useCountdown,
  usePlatformData,
  useSoundDesign,
} from "../lib/shared-ui";

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
    desc: "6-step registration pipeline for team captains: Squad -> Captain -> Roster -> Comms -> Payment proof.",
    route: "/register",
    badge: "REGISTRATION",
    icon: Shield,
    highlight: "Squad Lock",
  },
  {
    number: "06",
    title: "Team & Member Directory",
    subtitle: "Featured Squads & Player Profiles",
    desc: "Directory of registered squads with 3D flip cards, preferred drop locations, regions, and captain handles.",
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
];

function Hero({
  isFetching,
  registered,
  slots,
}: {
  isFetching: boolean;
  registered: number;
  slots: number;
}) {
  const sound = useSoundDesign();

  return (
    <section id="hero" className="relative overflow-hidden px-4 pt-28 pb-16 lg:px-6">
      <div className="absolute inset-0">
        <video
          className="hidden h-full w-full object-cover opacity-45 md:block"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/battle-arena-hero.png"
          aria-hidden="true"
        >
          <source src="/assets/hero-parachute-desktop.mp4" type="video/mp4" />
        </video>
        <video
          className="block h-full w-full object-cover opacity-45 md:hidden"
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
          poster="/assets/battle-arena-hero.png"
          aria-hidden="true"
        >
          <source src="/assets/hero-parachute-mobile.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,107,0,0.28),transparent_32rem),linear-gradient(90deg,rgba(5,5,8,0.98),rgba(5,5,8,0.7)_42%,rgba(5,5,8,0.96))]" />
      </div>
      <div className="battle-grid absolute inset-0 opacity-25" />
      <div className="scanline absolute inset-0" />

      <div className="relative z-10 mx-auto max-w-7xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl"
        >
          <span className="inline-flex items-center gap-2 border border-orange-400/50 bg-orange-500/10 px-3.5 py-1.5 font-mono text-xs uppercase tracking-[0.24em] text-orange-300">
            <Zap className="h-4 w-4 text-orange-400" /> Competitive BGMI Tournament Portal
          </span>
          <h1 className="glitch-title mt-4 font-display text-5xl font-bold uppercase leading-[0.85] text-white sm:text-7xl lg:text-8xl">
            BGMI Esports Hub
          </h1>
          <p className="mt-4 max-w-2xl font-mono text-sm leading-relaxed text-slate-300">
            Select a category card below to view live leaderboards, practice scrim lobbies, squad registration, or match schedules.
          </p>
        </motion.div>

        {/* Live Metrics */}
        <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4 max-w-3xl">
          <HudMetric label="Active Hub Squads" value={`${registered}/${slots || 24}`} />
          <HudMetric label="Daily Practice" value="4 Lobbies" />
          <HudMetric label="Live Board" value="Auto Calculated" />
          <HudMetric label="Data Source" value={isFetching ? "Reloading" : "Supabase Live"} />
        </div>
      </div>
    </section>
  );
}

export function HomePage() {
  const { data, isFetching } = usePlatformData();
  const sound = useSoundDesign();
  const [query, setQuery] = useState("");

  const registered = data.tournaments.reduce((sum, t) => sum + t.registered, 0);
  const slots = data.tournaments.reduce((sum, t) => sum + t.slots, 0);

  const filteredCategories = useMemo(() => {
    return categories.filter(
      (cat) =>
        cat.title.toLowerCase().includes(query.toLowerCase()) ||
        cat.subtitle.toLowerCase().includes(query.toLowerCase()) ||
        cat.desc.toLowerCase().includes(query.toLowerCase()),
    );
  }, [query]);

  return (
    <>
      <Hero isFetching={isFetching} registered={registered} slots={slots} />

      {/* Hub Categories Section */}
      <Section id="hub-categories" eyebrow="EXPLORE WHAT WE OFFER" title="OUR TOP CATEGORIES">
        {/* Search Filter Bar */}
        <div className="mb-8 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <label className="flex items-center gap-3 border border-orange-500/40 bg-black/60 px-4 py-3 min-w-[280px] md:min-w-[360px]">
            <Search className="h-4 w-4 text-orange-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search category (e.g. Scrims, Points, Registration)"
              className="bg-transparent font-mono text-xs uppercase tracking-[0.14em] text-white outline-none placeholder:text-slate-500 w-full"
            />
          </label>

          <span className="font-mono text-xs uppercase tracking-[0.2em] text-green-300">
            Showing {filteredCategories.length} Categories
          </span>
        </div>

        {/* Numbered Category Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {filteredCategories.map((cat) => {
            const Icon = cat.icon;
            return (
              <motion.div
                key={cat.number}
                whileHover={{ y: -8, scale: 1.02 }}
                transition={{ duration: 0.2 }}
                className="clip-panel hud-panel group relative flex flex-col justify-between border border-white/10 p-6 backdrop-blur-md transition hover:border-orange-400/60 hover:shadow-[0_0_30px_rgba(255,107,0,0.15)]"
              >
                <div>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4">
                    <span className="font-display text-4xl font-bold text-orange-400/80 group-hover:text-orange-300">
                      {cat.number}
                    </span>
                    <span className="border border-orange-400/40 bg-orange-500/10 px-2.5 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-orange-200">
                      {cat.badge}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center border border-white/15 bg-white/5 text-orange-300 group-hover:border-orange-400/60 group-hover:bg-orange-500/20">
                      <Icon className="h-5 w-5" />
                    </span>
                    <div>
                      <h3 className="font-display text-2xl font-bold uppercase text-white group-hover:text-orange-300 transition">
                        {cat.title}
                      </h3>
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-green-300">
                        {cat.subtitle}
                      </p>
                    </div>
                  </div>

                  <p className="mt-4 font-mono text-xs leading-relaxed text-slate-300">
                    {cat.desc}
                  </p>
                </div>

                <div className="mt-6 border-t border-white/10 pt-4 flex items-center justify-between">
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-slate-400">
                    {cat.highlight}
                  </span>
                  <Link to={cat.route}>
                    <button
                      type="button"
                      onClick={() => sound.play("shot")}
                      className="inline-flex items-center gap-2 border border-orange-400/50 bg-orange-500/10 px-4 py-2 font-mono text-xs font-bold uppercase tracking-[0.2em] text-orange-200 transition hover:border-orange-300 hover:bg-orange-500/25 group-hover:bg-orange-500 group-hover:text-black"
                    >
                      EXPLORE <ChevronRight className="h-4 w-4" />
                    </button>
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Section>
    </>
  );
}
