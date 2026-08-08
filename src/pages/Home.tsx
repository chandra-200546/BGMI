import { motion } from "framer-motion";
import { ChevronRight, Crown, Skull, Swords, Trophy, Zap } from "lucide-react";
import { Link } from "react-router-dom";
import {
  AnimatedNumber,
  HudMetric,
  MagazineLoader,
  MagneticButton,
  parseDisplayDate,
  Section,
  useCountdown,
  usePlatformData,
  useSoundDesign,
} from "../lib/shared-ui";
import type { PlatformData } from "../lib/platform-types";

const prizeTiers = [
  { label: "Champion Squad", split: "55%", badge: "WWCD", icon: Crown },
  { label: "Runner Up", split: "30%", badge: "Frag pressure", icon: Swords },
  { label: "MVP Bonus", split: "15%", badge: "Top finisher", icon: Skull },
];

function Hero({
  data,
  isFetching,
  playSound,
}: {
  data: PlatformData;
  isFetching: boolean;
  playSound: (name: "hover" | "shot" | "reload" | "reveal" | "victory") => void;
}) {
  const activeTournament = data.tournaments[0];
  const deadline = parseDisplayDate(activeTournament?.deadline ?? "");
  const countdown = useCountdown(deadline);
  const registered = data.tournaments.reduce((sum, tournament) => sum + tournament.registered, 0);
  const slots = data.tournaments.reduce((sum, tournament) => sum + tournament.slots, 0);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden px-4 pt-28 lg:px-6">
      <div className="absolute inset-0">
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
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_10%,rgba(255,107,0,0.28),transparent_32rem),linear-gradient(90deg,rgba(5,5,8,0.98),rgba(5,5,8,0.7)_42%,rgba(5,5,8,0.96))]" />
      </div>
      <div className="battle-grid absolute inset-0 opacity-25" />
      <div className="scanline absolute inset-0" />
      <div className="ember-field absolute inset-0" />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-7rem)] max-w-7xl items-center gap-12 lg:grid-cols-[1.1fr_0.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, ease: "easeOut" }}
          className="max-w-4xl"
        >
          <div className="relative">
            <h1
              className="glitch-title relative z-10 font-display text-6xl font-bold uppercase leading-[0.82] tracking-normal text-white sm:text-7xl lg:text-9xl"
              data-text="BGMI WAR ROOM"
            >
              BGMI War Room
            </h1>
          </div>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Register your squad, track live standings, reveal match drops, and run the entire
            tournament from one battle-ready command center.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link to="/register">
              <MagneticButton playSound={playSound}>
                Register Now <ChevronRight className="h-5 w-5" />
              </MagneticButton>
            </Link>
            <Link
              to="/leaderboard"
              className="inline-flex min-h-12 items-center gap-2 border border-white/15 bg-white/5 px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:border-green-300/50 hover:text-green-200"
            >
              <Trophy className="h-4 w-4" /> View Live Board
            </Link>
          </div>
        </motion.div>

        <motion.aside
          initial={{ opacity: 0, x: 44, rotateY: -8 }}
          animate={{ opacity: 1, x: 0, rotateY: 0 }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="clip-panel hud-panel p-5"
        >
          <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-green-300">
                Registration deadline
              </p>
              <h2 className="mt-1 font-display text-4xl font-bold uppercase text-white">
                {activeTournament?.name ?? "Awaiting live event"}
              </h2>
            </div>
            <Zap className="h-8 w-8 text-orange-300" />
          </div>

          <div className="mt-5 grid grid-cols-4 gap-2">
            {countdown ? (
              Object.entries(countdown).map(([label, value]) => (
                <div key={label} className="digital-tile">
                  <span>{String(value).padStart(2, "0")}</span>
                  <small>{label}</small>
                </div>
              ))
            ) : (
              <div className="col-span-4 border border-orange-300/25 bg-orange-500/10 p-5 font-mono text-xs uppercase tracking-[0.18em] text-orange-100">
                Countdown arms when a tournament deadline is published.
              </div>
            )}
          </div>

          <div className="mt-5 border border-white/10 bg-black/45 p-4">
            <div className="flex items-center justify-between">
              <p className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-slate-400">
                Live loading state
              </p>
              <span className="font-mono text-[0.65rem] uppercase tracking-[0.18em] text-green-300">
                {isFetching ? "reloading" : "ready"}
              </span>
            </div>
            <MagazineLoader active={isFetching} />
          </div>

          <div className="mt-5 grid grid-cols-3 gap-3">
            <HudMetric label="Teams" value={`${registered}/${slots || 0}`} />
            <HudMetric label="Prize" value={activeTournament?.prize ?? "Live"} />
            <HudMetric label="Mode" value={activeTournament?.mode ?? "Squad"} />
          </div>
        </motion.aside>
      </div>
    </section>
  );
}

function TournamentInfo({ data }: { data: PlatformData }) {
  const activeTournament = data.tournaments[0];
  const prizeNumber = Number((activeTournament?.prize ?? "0").replace(/[^0-9]/g, "")) || 0;
  const slots = activeTournament?.slots ?? 0;
  const registered = activeTournament?.registered ?? 0;

  return (
    <Section id="prizes" eyebrow="Prize pool / tournament info" title="Drop in. Cash out.">
      <div className="grid gap-4 lg:grid-cols-[0.8fr_1.2fr]">
        <div data-gsap-reveal data-weapon-reload className="clip-panel hud-panel p-6">
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-slate-400">
            Current live event
          </p>
          <h3 className="mt-4 font-display text-5xl font-bold uppercase text-white">
            {activeTournament?.name ?? "Waiting for tournament"}
          </h3>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <HudMetric label="Prize Pool" value={activeTournament?.prize ?? "TBA"} />
            <HudMetric label="Entry" value={activeTournament?.fee ?? "TBA"} />
            <HudMetric label="Map Pool" value={activeTournament?.map ?? "TBA"} />
            <HudMetric label="Phase" value={activeTournament?.phase ?? "TBA"} />
          </div>
          <div className="mt-6 h-4 border border-green-300/25 bg-black/50 p-1">
            <div
              className="health-fill h-full"
              style={{ width: `${slots ? (registered / slots) * 100 : 0}%` }}
            />
          </div>
          <p className="mt-3 font-mono text-xs uppercase tracking-[0.18em] text-green-200">
            {registered}/{slots || 0} slots locked
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {prizeTiers.map((tier, index) => {
            const Icon = tier.icon;
            return (
              <motion.div
                data-gsap-reveal
                key={tier.label}
                whileHover={{ y: -8, rotateX: 5, rotateY: index === 1 ? 0 : index === 0 ? -4 : 4 }}
                className="clip-panel hud-panel min-h-64 p-5"
              >
                <Icon className="h-8 w-8 text-orange-300" />
                <p className="mt-8 font-mono text-xs uppercase tracking-[0.22em] text-green-300">
                  {tier.badge}
                </p>
                <h3 className="mt-2 font-display text-4xl font-bold uppercase text-white">
                  {tier.label}
                </h3>
                <p className="mt-5 font-display text-5xl font-bold text-orange-300">
                  {prizeNumber ? (
                    <AnimatedNumber
                      value={Math.round(prizeNumber * (Number(tier.split.replace("%", "")) / 100))}
                      prefix="₹"
                    />
                  ) : (
                    tier.split
                  )}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </Section>
  );
}

export function HomePage() {
  const { data, isFetching } = usePlatformData();
  const sound = useSoundDesign();

  return (
    <>
      <Hero data={data} isFetching={isFetching} playSound={sound.play} />
      <TournamentInfo data={data} />
    </>
  );
}
