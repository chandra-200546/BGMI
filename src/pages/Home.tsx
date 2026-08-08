import { motion } from "framer-motion";
import {
  CalendarDays,
  ChevronDown,
  ChevronRight,
  Crown,
  Flame,
  LockKeyhole,
  Search,
  Shield,
  Swords,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  MagazineLoader,
  MagneticButton,
  parseDisplayDate,
  Section,
  useCountdown,
  usePlatformData,
  useSoundDesign,
} from "../lib/shared-ui";
import type { PlatformData } from "../lib/platform-types";

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
  {
    number: "08",
    title: "Organizer Admin Panel",
    subtitle: "Management Command Deck",
    desc: "Announce new tournaments, delete challenges, review squad registration proofs, and manage live Supabase tables.",
    route: "/admin",
    badge: "ADMIN DECK",
    icon: LockKeyhole,
    highlight: "Management Control",
  },
];

function Hero({
  data,
  isFetching,
}: {
  data: PlatformData;
  isFetching: boolean;
}) {
  const sound = useSoundDesign();
  const activeTournament = data.tournaments[0];
  const deadline = parseDisplayDate(activeTournament?.deadline ?? "");
  const countdown = useCountdown(deadline);
  const registered = data.tournaments.reduce((sum, t) => sum + t.registered, 0);
  const slots = data.tournaments.reduce((sum, t) => sum + t.slots, 0);

  return (
    <section
      id="hero"
      className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden px-4 pt-24 pb-12 lg:px-8"
    >
      {/* Background Parachute Video & Overlay Gradients */}
      <div className="absolute inset-0 z-0">
        <video
          className="hidden h-full w-full object-cover opacity-55 md:block"
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
          className="block h-full w-full object-cover opacity-55 md:hidden"
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,rgba(255,107,0,0.35),transparent_42rem),linear-gradient(180deg,rgba(5,5,8,0.85)_0%,rgba(5,5,8,0.65)_40%,rgba(5,5,8,0.98)_100%)]" />
      </div>

      <div className="battle-grid absolute inset-0 opacity-30 pointer-events-none" />
      <div className="scanline absolute inset-0 pointer-events-none" />
      <div className="ember-field absolute inset-0 pointer-events-none" />

      {/* Main Content Grid: Balanced 2 Columns */}
      <div className="relative z-10 mx-auto my-auto grid w-full max-w-7xl items-center gap-10 py-6 lg:grid-cols-[1.15fr_0.85fr] lg:gap-12">
        {/* Left Column: Branding, Title, Subtitle, CTAs */}
        <motion.div
          initial={{ opacity: 0, y: 36 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.85, ease: "easeOut" }}
          className="flex flex-col items-start"
        >
          <span className="inline-flex items-center gap-2 border border-orange-400/60 bg-orange-500/15 px-4 py-2 font-mono text-xs uppercase tracking-[0.24em] text-orange-200 shadow-[0_0_20px_rgba(255,107,0,0.25)]">
            <Zap className="h-4 w-4 text-orange-400 animate-pulse" /> Official BGMI Competitive Portal
          </span>

          <h1 className="glitch-title mt-5 font-display text-6xl font-bold uppercase leading-[0.82] tracking-normal text-white sm:text-7xl lg:text-8xl xl:text-9xl">
            BGMI ESPORTS HUB
          </h1>

          <p className="mt-5 max-w-2xl font-mono text-sm leading-relaxed text-slate-200 sm:text-base">
            India's hardcore battle-royale tournament platform. Register your squad, track real-time standings, reveal match drops, and claim official prize payouts from one command deck.
          </p>

          {/* Action CTAs */}
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link to="/register">
              <MagneticButton playSound={sound.play} className="shadow-[0_0_35px_rgba(255,107,0,0.4)]">
                REGISTER SQUAD <ChevronRight className="h-5 w-5" />
              </MagneticButton>
            </Link>

            <Link
              to="/points-table"
              className="inline-flex min-h-12 items-center gap-2 border border-green-400/50 bg-green-500/10 px-5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-green-100 transition hover:border-green-300 hover:bg-green-500/20"
            >
              <Trophy className="h-4 w-4 text-green-300" /> VIEW LIVE BOARD
            </Link>

            <Link
              to="/admin"
              className="inline-flex min-h-12 items-center gap-2 border border-orange-400/60 bg-orange-500/20 px-5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-orange-200 transition hover:border-orange-300 hover:bg-orange-500 hover:text-black"
            >
              <LockKeyhole className="h-4 w-4" /> ADMIN PANEL
            </Link>
          </div>
        </motion.div>

        {/* Right Column: Live Tournament Command Deck Card */}
        <motion.aside
          initial={{ opacity: 0, x: 44, rotateY: -8 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.85, delay: 0.25 }}
          className="clip-panel hud-panel border border-orange-500/40 p-6 md:p-8 backdrop-blur-xl shadow-[0_0_40px_rgba(255,107,0,0.18)]"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <span className="font-mono text-xs uppercase tracking-[0.22em] text-green-300">
                Spotlight Tournament
              </span>
              <h2 className="mt-1 font-display text-4xl font-bold uppercase text-white">
                {activeTournament?.name ?? "Weekend War Championship"}
              </h2>
            </div>
            <Crown className="h-8 w-8 text-orange-400" />
          </div>

          {/* Countdown Clock */}
          <div className="mt-6">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-slate-400">
              Registration Countdown
            </span>
            <div className="mt-2 grid grid-cols-4 gap-2 text-center">
              {countdown ? (
                Object.entries(countdown).map(([label, value]) => (
                  <div key={label} className="digital-tile">
                    <span>{String(value).padStart(2, "0")}</span>
                    <small>{label}</small>
                  </div>
                ))
              ) : (
                <div className="col-span-4 border border-orange-300/25 bg-orange-500/10 p-3 font-mono text-xs uppercase tracking-[0.18em] text-orange-100">
                  Registration Window Live
                </div>
              )}
            </div>
          </div>

          {/* Slot Health Bar */}
          <div className="mt-6">
            <div className="flex items-center justify-between font-mono text-xs text-slate-300">
              <span>Slot Lock Pressure</span>
              <span className="text-green-300 font-bold">
                {registered}/{slots || 24} Squads (
                {Math.round((registered / (slots || 24)) * 100)}%)
              </span>
            </div>
            <div className="mt-2 h-4 border border-green-300/30 bg-black/60 p-1">
              <div
                className="health-fill h-full"
                style={{ width: `${slots ? (registered / slots) * 100 : 0}%` }}
              />
            </div>
          </div>

          {/* Engine Status & Loader */}
          <div className="mt-6 border border-white/10 bg-black/45 p-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-slate-400">
                Engine Pipeline
              </p>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-green-300">
                {isFetching ? "Syncing API" : "Engine Ready"}
              </span>
            </div>
            <MagazineLoader active={isFetching} />
          </div>

          <div className="mt-6 flex items-center justify-between border-t border-white/10 pt-4">
            <div className="font-mono text-xs">
              <span className="block text-slate-400">PRIZE POOL</span>
              <span className="font-display text-2xl font-bold text-orange-400">
                {activeTournament?.prize ?? "₹50,000 INR"}
              </span>
            </div>

            <Link to="/register">
              <button
                type="button"
                onClick={() => sound.play("reload")}
                className="flex items-center gap-2 border border-orange-400/60 bg-orange-500/20 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-orange-100 transition hover:bg-orange-500 hover:text-black"
              >
                LOCK SQUAD SLOT <ChevronRight className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </motion.aside>
      </div>

      {/* Bottom Scroll Indicator Anchor */}
      <div className="relative z-10 mx-auto mt-4 flex items-center justify-center">
        <a
          href="#hub-categories"
          className="flex flex-col items-center gap-1 font-mono text-[0.65rem] uppercase tracking-[0.24em] text-slate-400 transition hover:text-orange-400"
        >
          <span>SCROLL FOR TOP CATEGORIES</span>
          <ChevronDown className="h-4 w-4 animate-bounce text-orange-400" />
        </a>
      </div>
    </section>
  );
}

export function HomePage() {
  const { data, isFetching } = usePlatformData();
  const sound = useSoundDesign();
  const [query, setQuery] = useState("");

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
      <Hero data={data} isFetching={isFetching} />

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
              placeholder="Search category (e.g. Scrims, Points, Admin)"
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
