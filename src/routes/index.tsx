import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  ArrowDown,
  ArrowUp,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  Crosshair,
  Crown,
  Gamepad2,
  Headphones,
  ImagePlus,
  LockKeyhole,
  MessageCircle,
  RefreshCw,
  Search,
  Shield,
  SlidersHorizontal,
  Skull,
  Swords,
  Trophy,
  Upload,
  Users,
  Volume2,
  VolumeX,
  X,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState, type ChangeEvent, type ReactNode } from "react";

import {
  emptyPlatformData,
  totalPoints,
  type PlatformData,
  type ScheduleItem,
  type Team,
  type Tournament,
} from "../lib/platform-types";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NexBattles BGMI - Hardcore Esports Registration" },
      {
        name: "description",
        content:
          "Real-time BGMI tournament registration with live leaderboards, match schedule, team hall of fame, and cinematic gaming animations.",
      },
      { property: "og:title", content: "NexBattles BGMI - Register Your Squad" },
      {
        property: "og:description",
        content:
          "A hardcore battle-royale tournament platform powered by live Supabase tournament data.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BgmiTournamentApp,
});

type RegistrationPayload = {
  tournamentId: string;
  teamName: string;
  logoFileName: string;
  captainName: string;
  captainEmail: string;
  bgmiUid: string;
  players: string[];
  whatsapp: string;
  discord: string;
  paymentFileName: string;
};

type SoundName = "hover" | "shot" | "reload" | "reveal" | "victory";

type AdminSnapshot = {
  tournaments: Array<Record<string, unknown>>;
  teams: Array<Record<string, unknown>>;
  registrations: Array<Record<string, unknown>>;
  matches: Array<Record<string, unknown>>;
  announcements: Array<Record<string, unknown>>;
  generatedAt: string;
  warnings?: string[];
};

type AdminDataTab = "registrations" | "teams" | "tournaments" | "matches" | "announcements";

const navItems = [
  ["Arena", "#hero"],
  ["Prizes", "#prizes"],
  ["Register", "#register"],
  ["Leaderboard", "#leaderboard"],
  ["Schedule", "#schedule"],
  ["Teams", "#teams"],
] as const;

const prizeTiers = [
  { label: "Champion Squad", split: "55%", badge: "WWCD", icon: Crown },
  { label: "Runner Up", split: "30%", badge: "Frag pressure", icon: Swords },
  { label: "MVP Bonus", split: "15%", badge: "Top finisher", icon: Skull },
];

const registrationSteps = ["Squad", "Captain", "Roster", "Comms", "Proof"];

const hallFallback = [
  { name: "Hydra Blitz", region: "North", stat: "4 WWCD", drop: "Georgopol" },
  { name: "Soul Ember", region: "West", stat: "78 Finishes", drop: "Pochinki" },
  { name: "Revenant X", region: "South", stat: "212 Points", drop: "School" },
  { name: "GodLike Ops", region: "East", stat: "99% Check-in", drop: "Military Base" },
];

async function fetchPlatformData(): Promise<PlatformData> {
  const response = await fetch("/api/public/live", { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load live tournament data");
  return (await response.json()) as PlatformData;
}

function usePlatformData() {
  return useQuery({
    queryKey: ["platform-live-data"],
    queryFn: fetchPlatformData,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 2500,
    placeholderData: emptyPlatformData,
  });
}

function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "syncing";
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

function parseDisplayDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function useCountdown(target?: Date) {
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  if (!target) return undefined;

  const diff = Math.max(0, target.getTime() - now);
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  return { days, hours, minutes, seconds };
}

function useSoundDesign() {
  const [muted, setMuted] = useState(true);
  const mutedRef = useRef(true);
  const contextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem("bgmi-sound-muted");
    if (saved) setMuted(saved === "true");
  }, []);

  useEffect(() => {
    mutedRef.current = muted;
    window.localStorage.setItem("bgmi-sound-muted", String(muted));
  }, [muted]);

  function getContext() {
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!contextRef.current) contextRef.current = new AudioContextClass();
    return contextRef.current;
  }

  function tone(
    context: AudioContext,
    start: number,
    frequency: number,
    duration: number,
    gain = 0.035,
  ) {
    const oscillator = context.createOscillator();
    const volume = context.createGain();
    oscillator.type = "square";
    oscillator.frequency.setValueAtTime(frequency, start);
    volume.gain.setValueAtTime(gain, start);
    volume.gain.exponentialRampToValueAtTime(0.001, start + duration);
    oscillator.connect(volume).connect(context.destination);
    oscillator.start(start);
    oscillator.stop(start + duration);
  }

  function noise(context: AudioContext, duration: number, gain = 0.05) {
    const buffer = context.createBuffer(1, context.sampleRate * duration, context.sampleRate);
    const channel = buffer.getChannelData(0);
    for (let index = 0; index < channel.length; index += 1) {
      channel[index] = (Math.random() * 2 - 1) * (1 - index / channel.length);
    }
    const source = context.createBufferSource();
    const filter = context.createBiquadFilter();
    const volume = context.createGain();
    source.buffer = buffer;
    filter.type = "lowpass";
    filter.frequency.value = 900;
    volume.gain.value = gain;
    source.connect(filter).connect(volume).connect(context.destination);
    source.start();
  }

  function play(name: SoundName) {
    if (mutedRef.current || typeof window === "undefined") return;
    const context = getContext();
    if (context.state === "suspended") void context.resume();
    const now = context.currentTime;

    if (name === "hover") {
      tone(context, now, 280, 0.07, 0.018);
      tone(context, now + 0.045, 520, 0.05, 0.012);
    } else if (name === "shot") {
      noise(context, 0.16, 0.08);
      tone(context, now, 84, 0.12, 0.05);
    } else if (name === "reload") {
      tone(context, now, 190, 0.08, 0.03);
      tone(context, now + 0.11, 360, 0.09, 0.035);
    } else if (name === "reveal") {
      noise(context, 0.32, 0.018);
      tone(context, now + 0.04, 72, 0.24, 0.014);
    } else {
      tone(context, now, 523, 0.1, 0.03);
      tone(context, now + 0.1, 784, 0.12, 0.032);
      tone(context, now + 0.23, 1046, 0.18, 0.028);
    }
  }

  function toggle() {
    setMuted((value) => {
      const next = !value;
      mutedRef.current = next;
      if (!next) {
        window.setTimeout(() => play("reload"), 0);
      }
      return next;
    });
  }

  return { muted, toggle, play };
}

function useGsapSequences(playSound: (name: SoundName) => void) {
  useEffect(() => {
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;

    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([gsapModule, scrollTriggerModule]) => {
        if (cancelled || typeof window === "undefined") return;
        const gsap = gsapModule.gsap;
        const ScrollTrigger = scrollTriggerModule.ScrollTrigger;
        gsap.registerPlugin(ScrollTrigger);

        ctx = gsap.context(() => {
          gsap.to(".battle-grid", {
            backgroundPosition: "160px 320px",
            ease: "none",
            scrollTrigger: {
              trigger: document.body,
              start: "top top",
              end: "bottom bottom",
              scrub: 1,
            },
          });

          gsap.utils.toArray<HTMLElement>("[data-gsap-reveal]").forEach((element) => {
            gsap.fromTo(
              element,
              { y: 46, opacity: 0, rotateX: 8 },
              {
                y: 0,
                opacity: 1,
                rotateX: 0,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: { trigger: element, start: "top 82%" },
              },
            );
          });

          gsap.utils.toArray<HTMLElement>("[data-weapon-reload]").forEach((element) => {
            gsap.fromTo(
              element,
              { x: 0, rotate: 0 },
              {
                x: -18,
                rotate: -3,
                duration: 0.12,
                yoyo: true,
                repeat: 1,
                ease: "power2.out",
                scrollTrigger: {
                  trigger: element,
                  start: "top 72%",
                  onEnter: () => playSound("reveal"),
                },
              },
            );
          });
        });
      },
    );

    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, [playSound]);
}

function MagneticButton({
  children,
  href,
  className = "",
  onClick,
  playSound,
  sound = "shot",
}: {
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  playSound?: (name: SoundName) => void;
  sound?: SoundName;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const [recoil, setRecoil] = useState(false);
  const springX = useSpring(x, { stiffness: 240, damping: 18 });
  const springY = useSpring(y, { stiffness: 240, damping: 18 });

  function onMove(event: React.MouseEvent<HTMLElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    x.set((event.clientX - rect.left - rect.width / 2) * 0.22);
    y.set((event.clientY - rect.top - rect.height / 2) * 0.22);
  }

  const props = {
    onMouseEnter: () => playSound?.("hover"),
    onMouseMove: onMove,
    onMouseLeave: () => {
      x.set(0);
      y.set(0);
    },
    onClick: () => {
      playSound?.(sound);
      setRecoil(true);
      window.setTimeout(() => setRecoil(false), 220);
      onClick?.();
    },
    style: { x: springX, y: springY },
    className: `magnetic-button ${recoil ? "button-recoil" : ""} ${className}`,
  };

  if (href) {
    return (
      <motion.a href={href} {...props}>
        {children}
      </motion.a>
    );
  }

  return (
    <motion.button type="button" {...props}>
      {children}
    </motion.button>
  );
}

function CursorCrosshair() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [flash, setFlash] = useState(false);

  useEffect(() => {
    const update = (event: PointerEvent) => setPosition({ x: event.clientX, y: event.clientY });
    const flare = () => {
      setFlash(true);
      window.setTimeout(() => setFlash(false), 130);
    };
    window.addEventListener("pointermove", update);
    window.addEventListener("pointerdown", flare);
    return () => {
      window.removeEventListener("pointermove", update);
      window.removeEventListener("pointerdown", flare);
    };
  }, []);

  return (
    <div
      className={`cursor-crosshair pointer-events-none fixed z-[80] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 md:block ${
        flash ? "cursor-flare" : ""
      }`}
      style={{ left: position.x, top: position.y }}
    />
  );
}

function AppNav({
  liveLabel,
  muted,
  toggleSound,
  onOpenAdmin,
}: {
  liveLabel: string;
  muted: boolean;
  toggleSound: () => void;
  onOpenAdmin: () => void;
}) {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-orange-400/20 bg-black/55 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
        <a href="#hero" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-orange-400/60 bg-orange-500/10 text-orange-300 shadow-[0_0_28px_rgba(255,107,0,0.3)]">
            <Crosshair className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-display text-2xl font-bold uppercase leading-none tracking-[0.12em] text-white">
              NexBattles
            </span>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-green-300">
              BGMI live ops
            </span>
          </span>
        </a>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map(([label, href]) => (
            <a
              key={label}
              href={href}
              className="font-mono text-xs uppercase tracking-[0.18em] text-slate-300 transition hover:text-orange-300"
            >
              {label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onOpenAdmin}
            className="inline-flex min-h-10 items-center gap-2 border border-orange-300/40 bg-orange-500/10 px-3 font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-orange-100 transition hover:bg-orange-500/20"
          >
            <LockKeyhole className="h-4 w-4" />
            Admin Panel
          </button>
          <span className="hidden border border-green-300/30 bg-green-400/10 px-3 py-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-green-200 sm:inline-flex">
            Live {liveLabel}
          </span>
          <button
            type="button"
            aria-label="Toggle interface sound"
            onClick={toggleSound}
            className="grid h-10 w-10 place-items-center border border-white/15 bg-white/5 text-slate-200 transition hover:border-orange-300/60 hover:text-orange-200"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}

function Hero({
  data,
  isFetching,
  playSound,
}: {
  data: PlatformData;
  isFetching: boolean;
  playSound: (name: SoundName) => void;
}) {
  const activeTournament = data.tournaments[0];
  const deadline = parseDisplayDate(activeTournament?.deadline ?? "");
  const countdown = useCountdown(deadline);
  const registered = data.tournaments.reduce((sum, tournament) => sum + tournament.registered, 0);
  const slots = data.tournaments.reduce((sum, tournament) => sum + tournament.slots, 0);

  return (
    <section id="hero" className="relative min-h-screen overflow-hidden px-4 pt-28 lg:px-6">
      <div className="absolute inset-0">
        <img
          src="/assets/battle-arena-hero.png"
          alt=""
          className="h-full w-full object-cover opacity-45"
        />
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
            <WeaponAssembly active={isFetching} />
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
            <MagneticButton href="#register" playSound={playSound}>
              Register Now <ChevronRight className="h-5 w-5" />
            </MagneticButton>
            <a
              href="#leaderboard"
              className="inline-flex min-h-12 items-center gap-2 border border-white/15 bg-white/5 px-5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:border-green-300/50 hover:text-green-200"
            >
              <Trophy className="h-4 w-4" /> View Live Board
            </a>
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

function HudMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-black/40 p-3">
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 truncate font-display text-2xl font-bold uppercase text-white">{value}</p>
    </div>
  );
}

function WeaponAssembly({ active }: { active: boolean }) {
  const parts = [
    { className: "weapon-stock", delay: 0.12, x: -90 },
    { className: "weapon-body", delay: 0.22, x: 0 },
    { className: "weapon-barrel", delay: 0.34, x: 110 },
    { className: "weapon-mag", delay: 0.46, y: 80 },
    { className: "weapon-scope", delay: 0.58, y: -54 },
  ];

  return (
    <motion.div
      data-weapon-reload
      className={`weapon-stage ${active ? "weapon-loading" : ""}`}
      animate={{ y: [0, -8, 0], rotate: [-1, 1, -1] }}
      transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
      aria-hidden="true"
    >
      {parts.map((part) => (
        <motion.span
          key={part.className}
          className={`weapon-part ${part.className}`}
          initial={{ opacity: 0, x: part.x ?? 0, y: part.y ?? 0, scale: 0.9 }}
          animate={{ opacity: 1, x: 0, y: 0, scale: 1 }}
          transition={{
            duration: 0.48,
            delay: part.delay,
            type: "spring",
            stiffness: 210,
            damping: 18,
          }}
        />
      ))}
      <span className="weapon-flare" />
    </motion.div>
  );
}

function MagazineLoader({ active }: { active: boolean }) {
  return (
    <div className="magazine-loader mt-3" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, index) => (
        <span
          key={index}
          className={
            active || index < 7 ? "magazine-round magazine-round-active" : "magazine-round"
          }
          style={{ animationDelay: `${index * 0.06}s` }}
        />
      ))}
    </div>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative overflow-hidden border-t border-white/10 px-4 py-16 lg:px-6 lg:py-24"
    >
      <div className="battle-grid absolute inset-0 opacity-10" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div data-gsap-reveal className="mb-10 max-w-3xl">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-orange-300">
            {eyebrow}
          </p>
          <h2 className="mt-3 font-display text-5xl font-bold uppercase leading-none text-white md:text-7xl">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function AnimatedNumber({
  value,
  prefix = "",
  suffix = "",
}: {
  value: number;
  prefix?: string;
  suffix?: string;
}) {
  const motionValue = useMotionValue(0);
  const rounded = useTransform(motionValue, (latest) => Math.round(latest).toLocaleString("en-IN"));
  const [display, setDisplay] = useState("0");
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const unsubscribe = rounded.on("change", setDisplay);
    return () => unsubscribe();
  }, [rounded]);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        motionValue.set(value);
        observer.disconnect();
      }
    });
    observer.observe(node);
    return () => observer.disconnect();
  }, [motionValue, value]);

  return (
    <span ref={ref}>
      {prefix}
      {display}
      {suffix}
    </span>
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

function Registration({
  tournaments,
  playSound,
}: {
  tournaments: Tournament[];
  playSound: (name: SoundName) => void;
}) {
  const [step, setStep] = useState(0);
  const [shake, setShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<RegistrationPayload>({
    tournamentId: tournaments[0]?.id ?? "",
    teamName: "",
    logoFileName: "",
    captainName: "",
    captainEmail: "",
    bgmiUid: "",
    players: ["", "", "", ""],
    whatsapp: "",
    discord: "",
    paymentFileName: "",
  });

  useEffect(() => {
    if (!form.tournamentId && tournaments[0]?.id) {
      setForm((current) => ({ ...current, tournamentId: tournaments[0].id }));
    }
  }, [form.tournamentId, tournaments]);

  const progress = ((step + 1) / registrationSteps.length) * 100;

  function setField(key: keyof RegistrationPayload, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setFile(key: "logoFileName" | "paymentFileName", event: ChangeEvent<HTMLInputElement>) {
    setField(key, event.target.files?.[0]?.name ?? "");
  }

  function isStepValid() {
    if (step === 0) return Boolean(form.tournamentId && form.teamName);
    if (step === 1) return Boolean(form.captainName && form.captainEmail && form.bgmiUid);
    if (step === 2) return form.players.every(Boolean);
    if (step === 3) return Boolean(form.whatsapp || form.discord);
    return Boolean(form.paymentFileName);
  }

  function failValidation() {
    setShake(true);
    window.setTimeout(() => setShake(false), 450);
  }

  async function submit() {
    if (!isStepValid()) {
      failValidation();
      return;
    }
    setSubmitting(true);
    try {
      const response = await fetch("/api/public/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Registration API rejected the submission");
      playSound("victory");
      setSuccess(true);
    } catch {
      failValidation();
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    if (!isStepValid()) {
      failValidation();
      return;
    }
    setStep((value) => Math.min(value + 1, registrationSteps.length - 1));
  }

  return (
    <Section id="register" eyebrow="Team registration" title="Lock your squad.">
      <div data-weapon-reload className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <div data-gsap-reveal className="clip-panel hud-panel p-6">
          <p className="font-mono text-xs uppercase tracking-[0.22em] text-green-300">
            Health bar progress
          </p>
          <div className="mt-4 h-5 border border-orange-300/30 bg-black/60 p-1">
            <motion.div className="health-fill h-full" animate={{ width: `${progress}%` }} />
          </div>
          <div className="mt-6 space-y-3">
            {registrationSteps.map((label, index) => (
              <button
                key={label}
                type="button"
                onClick={() => setStep(index)}
                className={`flex w-full items-center justify-between border px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.18em] transition ${
                  index === step
                    ? "border-orange-300/60 bg-orange-500/15 text-orange-100"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                }`}
              >
                {label}
                {index < step ? (
                  <CheckCircle2 className="h-4 w-4 text-green-300" />
                ) : (
                  <span>0{index + 1}</span>
                )}
              </button>
            ))}
          </div>
        </div>

        <motion.div
          data-gsap-reveal
          className={`clip-panel hud-panel p-6 ${shake ? "shake-error" : ""}`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 48 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -48 }}
              transition={{ duration: 0.24 }}
            >
              <RegistrationStep
                step={step}
                form={form}
                tournaments={tournaments}
                setField={setField}
                setFile={setFile}
                setForm={setForm}
              />
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex flex-wrap justify-between gap-3">
            <button
              type="button"
              onClick={() => setStep((value) => Math.max(0, value - 1))}
              className="border border-white/15 bg-white/5 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white disabled:opacity-35"
              disabled={step === 0}
            >
              Back
            </button>
            {step === registrationSteps.length - 1 ? (
              <MagneticButton
                onClick={submit}
                playSound={playSound}
                sound="reload"
                className={submitting ? "opacity-70" : ""}
              >
                {submitting ? "Submitting" : "Submit Squad"} <Upload className="h-5 w-5" />
              </MagneticButton>
            ) : (
              <MagneticButton onClick={next} playSound={playSound} sound="reload">
                Continue <ChevronRight className="h-5 w-5" />
              </MagneticButton>
            )}
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {success ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[90] grid place-items-center bg-black/80 px-4 backdrop-blur-md"
          >
            <div className="victory-confetti" />
            <motion.div
              initial={{ scale: 0.8, rotateX: -16 }}
              animate={{ scale: 1, rotateX: 0 }}
              className="clip-panel hud-panel max-w-lg p-8 text-center"
            >
              <Trophy className="mx-auto h-14 w-14 text-orange-300" />
              <h3 className="mt-4 font-display text-6xl font-bold uppercase text-white">
                Victory Queue
              </h3>
              <p className="mt-3 text-slate-300">
                Your registration entered the live review pipeline. Organizer approval and room
                alerts will use the contact details you submitted.
              </p>
              <button
                type="button"
                onClick={() => setSuccess(false)}
                className="mt-6 border border-green-300/40 bg-green-400/10 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-green-100"
              >
                Continue
              </button>
            </motion.div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </Section>
  );
}

function RegistrationStep({
  step,
  form,
  tournaments,
  setField,
  setFile,
  setForm,
}: {
  step: number;
  form: RegistrationPayload;
  tournaments: Tournament[];
  setField: (key: keyof RegistrationPayload, value: string) => void;
  setFile: (key: "logoFileName" | "paymentFileName", event: ChangeEvent<HTMLInputElement>) => void;
  setForm: React.Dispatch<React.SetStateAction<RegistrationPayload>>;
}) {
  if (step === 0) {
    return (
      <FormGrid title="Squad identity">
        <label className="field-shell">
          Tournament
          <select
            value={form.tournamentId}
            onChange={(event) => setField("tournamentId", event.target.value)}
          >
            <option value="">Select live tournament</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name}
              </option>
            ))}
          </select>
        </label>
        <Field
          label="Team name"
          value={form.teamName}
          onChange={(value) => setField("teamName", value)}
        />
        <FileField
          label="Team logo upload"
          value={form.logoFileName}
          onChange={(event) => setFile("logoFileName", event)}
        />
      </FormGrid>
    );
  }

  if (step === 1) {
    return (
      <FormGrid title="Captain verification">
        <Field
          label="Captain full name"
          value={form.captainName}
          onChange={(value) => setField("captainName", value)}
        />
        <Field
          label="Captain email"
          value={form.captainEmail}
          onChange={(value) => setField("captainEmail", value)}
          type="email"
        />
        <Field
          label="BGMI UID"
          value={form.bgmiUid}
          onChange={(value) => setField("bgmiUid", value)}
        />
      </FormGrid>
    );
  }

  if (step === 2) {
    return (
      <FormGrid title="Four player slots">
        {form.players.map((player, index) => (
          <Field
            key={index}
            label={`Player ${index + 1} IGN + UID`}
            value={player}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                players: current.players.map((item, playerIndex) =>
                  playerIndex === index ? value : item,
                ),
              }))
            }
          />
        ))}
      </FormGrid>
    );
  }

  if (step === 3) {
    return (
      <FormGrid title="Comms channel">
        <Field
          label="WhatsApp number"
          value={form.whatsapp}
          onChange={(value) => setField("whatsapp", value)}
        />
        <Field
          label="Discord handle"
          value={form.discord}
          onChange={(value) => setField("discord", value)}
        />
      </FormGrid>
    );
  }

  return (
    <FormGrid title="Payment proof">
      <FileField
        label="Payment screenshot upload"
        value={form.paymentFileName}
        onChange={(event) => setFile("paymentFileName", event)}
      />
      <div className="border border-orange-300/25 bg-orange-500/10 p-4 text-sm text-orange-50">
        Screenshots are queued as registration evidence. Connect Supabase Storage later for full
        binary file storage; the production API already records this submission metadata.
      </div>
    </FormGrid>
  );
}

function FormGrid({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-5xl font-bold uppercase text-white">{title}</h3>
      <div className="mt-6 grid gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="field-shell">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter details"
      />
    </label>
  );
}

function FileField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="field-shell">
      {label}
      <span className="flex items-center justify-between gap-3 border border-white/10 bg-black/55 px-4 py-3 text-slate-300">
        <span className="truncate">{value || "Choose file"}</span>
        <ImagePlus className="h-4 w-4 text-orange-300" />
      </span>
      <input className="sr-only" type="file" accept="image/*" onChange={onChange} />
    </label>
  );
}

function Leaderboard({ data }: { data: PlatformData }) {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<"rank" | "points" | "finishes">("rank");

  const teams = useMemo(() => {
    return [...data.teams]
      .filter((team) =>
        `${team.name} ${team.short} ${team.region}`.toLowerCase().includes(query.toLowerCase()),
      )
      .sort((a, b) => {
        if (sort === "points") return totalPoints(b) - totalPoints(a);
        if (sort === "finishes") return b.finishes - a.finishes;
        return a.rank - b.rank;
      });
  }, [data.teams, query, sort]);

  return (
    <Section id="leaderboard" eyebrow="Live leaderboard" title="Every point bleeds.">
      <div data-gsap-reveal className="clip-panel hud-panel overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-white/10 p-4 md:flex-row md:items-center md:justify-between">
          <label className="flex items-center gap-2 border border-white/10 bg-black/40 px-3 py-2">
            <Search className="h-4 w-4 text-orange-300" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Filter squads"
              className="bg-transparent font-mono text-xs uppercase tracking-[0.12em] text-white outline-none"
            />
          </label>
          <div className="flex gap-2">
            {(["rank", "points", "finishes"] as const).map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setSort(item)}
                className={`border px-3 py-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] ${
                  sort === item
                    ? "border-orange-300/60 bg-orange-500/15 text-orange-100"
                    : "border-white/10 text-slate-400"
                }`}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[760px] text-left">
            <thead className="font-mono text-[0.65rem] uppercase tracking-[0.22em] text-slate-500">
              <tr>
                <th className="p-4">Rank</th>
                <th className="p-4">Squad</th>
                <th className="p-4">Region</th>
                <th className="p-4">WWCD</th>
                <th className="p-4">Finishes</th>
                <th className="p-4">Total</th>
                <th className="p-4">Trend</th>
              </tr>
            </thead>
            <tbody>
              {teams.length ? (
                teams.map((team) => <LeaderboardRow key={team.name} team={team} />)
              ) : (
                <tr>
                  <td colSpan={7} className="p-4">
                    <div className="skeleton-scan h-16 border border-white/10" />
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </Section>
  );
}

function LeaderboardRow({ team }: { team: Team }) {
  const up = team.form[0] === "W" || team.rank <= 3;
  return (
    <motion.tr
      whileHover={{ backgroundColor: "rgba(255,107,0,0.1)" }}
      className="border-t border-white/10"
    >
      <td className="p-4 font-display text-3xl font-bold text-orange-300">#{team.rank}</td>
      <td className="p-4">
        <p className="font-bold text-white">{team.name}</p>
        <p className="font-mono text-xs uppercase tracking-[0.16em] text-slate-500">
          {team.short} / {team.captain}
        </p>
      </td>
      <td className="p-4 text-slate-300">{team.region}</td>
      <td className="p-4 text-white">{team.wwcd}</td>
      <td className="p-4 text-white">{team.finishes}</td>
      <td className="p-4 font-display text-3xl font-bold text-white">{totalPoints(team)}</td>
      <td className="p-4">
        <span
          className={`inline-flex items-center gap-1 font-mono text-xs uppercase tracking-[0.18em] ${up ? "text-green-300" : "text-red-300"}`}
        >
          {up ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          {up ? "rising" : "under fire"}
        </span>
      </td>
    </motion.tr>
  );
}

function Schedule({ schedules }: { schedules: ScheduleItem[] }) {
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

function HallOfFame({ teams }: { teams: Team[] }) {
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

function AdminPanelModal({
  data,
  open,
  onClose,
  onChanged,
}: {
  data: PlatformData;
  open: boolean;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [adminKey, setAdminKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [activeTask, setActiveTask] = useState<
    "announcement" | "tournament" | "match" | "registrationStatus"
  >("announcement");
  const [activeDataTab, setActiveDataTab] = useState<AdminDataTab>("registrations");
  const [snapshot, setSnapshot] = useState<AdminSnapshot | undefined>();
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: "",
    category: "Tournament",
    pinned: true,
    tournamentId: data.tournaments[0]?.id ?? "",
    tournamentName: "",
    mode: "Squad",
    prizePool: "50000",
    entryFee: "0",
    maxTeams: "24",
    startsAt: "",
    registrationDeadline: "",
    maps: "Erangel, Miramar, Sanhok",
    matchName: "",
    matchMap: "Erangel",
    matchGroup: "Group A",
    matchStartsAt: "",
    registrationId: "",
    registrationStatus: "APPROVED",
  });

  useEffect(() => {
    if (!form.tournamentId && data.tournaments[0]?.id) {
      setForm((current) => ({ ...current, tournamentId: data.tournaments[0].id }));
    }
  }, [data.tournaments, form.tournamentId]);

  function updateField(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function unlock() {
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ adminKey }),
      });
      if (!response.ok) throw new Error("Wrong admin key");
      setUnlocked(true);
      setStatus("Admin command deck unlocked.");
      await loadSnapshot();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to unlock admin panel");
    } finally {
      setBusy(false);
    }
  }

  async function loadSnapshot() {
    const response = await fetch("/api/admin/snapshot", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ adminKey }),
    });
    const payload = (await response.json()) as { data?: AdminSnapshot; error?: string };
    if (!response.ok || !payload.data) throw new Error(payload.error ?? "Unable to load database");
    setSnapshot(payload.data);
  }

  async function runCommand() {
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/command", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ adminKey, action: activeTask, ...form }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Admin command failed");
      setStatus(`${activeTask} command completed.`);
      await loadSnapshot();
      onChanged();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Admin command failed");
    } finally {
      setBusy(false);
    }
  }

  const pendingSignal = data.tournaments.reduce(
    (sum, tournament) => sum + Math.max(tournament.slots - tournament.registered, 0),
    0,
  );

  const adminCards = [
    {
      label: "Registration queue",
      value: `${data.tournaments.reduce((sum, item) => sum + item.registered, 0)} squads`,
      note: "Approve, waitlist, or reject captain submissions.",
      icon: Users,
    },
    {
      label: "Room controls",
      value: `${data.schedules.length} matches`,
      note: "Prepare room IDs, passwords, release windows, and check-ins.",
      icon: LockKeyhole,
    },
    {
      label: "Live ops",
      value: `${pendingSignal} slots`,
      note: "Monitor slot pressure, announcements, scoring, and disputes.",
      icon: SlidersHorizontal,
    },
  ];

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] overflow-y-auto bg-black/82 px-4 py-8 backdrop-blur-xl"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="grid h-11 w-11 place-items-center border border-white/15 bg-white/5 text-white hover:border-orange-300/50"
                aria-label="Close admin panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <motion.div
              initial={{ y: 34, opacity: 0, rotateX: 6 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
              className="clip-panel hud-panel p-5 md:p-7"
            >
              <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-start md:justify-between">
                <div>
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-orange-300">
                    Admin panel
                  </p>
                  <h2 className="mt-2 font-display text-5xl font-bold uppercase leading-none text-white md:text-7xl">
                    Organizer command
                  </h2>
                </div>
                <div className="border border-green-300/25 bg-green-400/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-green-100">
                  {unlocked ? "Credentials accepted" : "Credentials required"}
                </div>
              </div>

              {!unlocked ? (
                <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
                  <label className="field-shell">
                    Admin key
                    <input
                      type="password"
                      value={adminKey}
                      onChange={(event) => setAdminKey(event.target.value)}
                      placeholder="Enter admin password"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={unlock}
                    disabled={busy}
                    className="self-end border border-orange-300/50 bg-orange-500/15 px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-orange-100 disabled:opacity-50"
                  >
                    {busy ? "Checking" : "Unlock"}
                  </button>
                </div>
              ) : (
                <div className="mt-6 grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
                  <div className="grid gap-3">
                    {adminCards.map((card) => {
                      const Icon = card.icon;
                      return (
                        <div key={card.label} className="border border-white/10 bg-black/45 p-4">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-green-300">
                                {card.label}
                              </p>
                              <p className="mt-1 font-display text-4xl font-bold uppercase text-white">
                                {card.value}
                              </p>
                            </div>
                            <Icon className="h-5 w-5 text-orange-300" />
                          </div>
                          <p className="mt-2 text-sm leading-6 text-slate-400">{card.note}</p>
                        </div>
                      );
                    })}
                  </div>

                  <div>
                    <div className="mb-4 flex flex-wrap gap-2">
                      {(["announcement", "tournament", "match", "registrationStatus"] as const).map(
                        (task) => (
                          <button
                            key={task}
                            type="button"
                            onClick={() => setActiveTask(task)}
                            className={`border px-4 py-3 font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] ${
                              activeTask === task
                                ? "border-orange-300/60 bg-orange-500/15 text-orange-100"
                                : "border-white/10 bg-white/[0.03] text-slate-400"
                            }`}
                          >
                            {task}
                          </button>
                        ),
                      )}
                    </div>

                    <AdminTaskFields
                      activeTask={activeTask}
                      form={form}
                      tournaments={data.tournaments}
                      registrations={snapshot?.registrations ?? []}
                      updateField={updateField}
                    />

                    <button
                      type="button"
                      onClick={runCommand}
                      disabled={busy}
                      className="mt-5 w-full border border-green-300/40 bg-green-400/10 px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-green-100 disabled:opacity-50"
                    >
                      {busy ? "Executing" : "Execute admin command"}
                    </button>
                  </div>
                </div>
              )}

              {unlocked ? (
                <div className="mt-8 border-t border-white/10 pt-6">
                  <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                      <p className="font-mono text-xs uppercase tracking-[0.22em] text-orange-300">
                        Database control room
                      </p>
                      <p className="mt-1 text-sm text-slate-400">
                        View everything stored in Supabase and refresh after organizer actions.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setBusy(true);
                        loadSnapshot()
                          .then(() => setStatus("Database snapshot refreshed."))
                          .catch((error: unknown) =>
                            setStatus(error instanceof Error ? error.message : "Refresh failed"),
                          )
                          .finally(() => setBusy(false));
                      }}
                      disabled={busy}
                      className="inline-flex items-center justify-center gap-2 border border-white/15 bg-white/5 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white disabled:opacity-50"
                    >
                      <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
                      Refresh
                    </button>
                  </div>

                  <AdminDatabaseBrowser
                    snapshot={snapshot}
                    activeTab={activeDataTab}
                    setActiveTab={setActiveDataTab}
                  />
                </div>
              ) : null}

              {status ? (
                <p className="mt-5 border border-white/10 bg-black/45 p-3 font-mono text-xs uppercase tracking-[0.16em] text-orange-100">
                  {status}
                </p>
              ) : null}
            </motion.div>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function AdminTaskFields({
  activeTask,
  form,
  tournaments,
  registrations,
  updateField,
}: {
  activeTask: "announcement" | "tournament" | "match" | "registrationStatus";
  form: Record<string, string | boolean>;
  tournaments: Tournament[];
  registrations: Array<Record<string, unknown>>;
  updateField: (key: keyof typeof form, value: string | boolean) => void;
}) {
  if (activeTask === "announcement") {
    return (
      <div className="grid gap-4">
        <Field
          label="Announcement title"
          value={String(form.title)}
          onChange={(value) => updateField("title", value)}
        />
        <Field
          label="Announcement body"
          value={String(form.body)}
          onChange={(value) => updateField("body", value)}
        />
        <Field
          label="Category"
          value={String(form.category)}
          onChange={(value) => updateField("category", value)}
        />
        <label className="field-shell">
          Tournament target
          <select
            value={String(form.tournamentId)}
            onChange={(event) => updateField("tournamentId", event.target.value)}
          >
            <option value="">Global announcement</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  if (activeTask === "tournament") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <Field
          label="Tournament name"
          value={String(form.tournamentName)}
          onChange={(value) => updateField("tournamentName", value)}
        />
        <Field
          label="Mode"
          value={String(form.mode)}
          onChange={(value) => updateField("mode", value)}
        />
        <Field
          label="Prize pool"
          value={String(form.prizePool)}
          onChange={(value) => updateField("prizePool", value)}
        />
        <Field
          label="Entry fee"
          value={String(form.entryFee)}
          onChange={(value) => updateField("entryFee", value)}
        />
        <Field
          label="Max teams"
          value={String(form.maxTeams)}
          onChange={(value) => updateField("maxTeams", value)}
        />
        <Field
          label="Map pool"
          value={String(form.maps)}
          onChange={(value) => updateField("maps", value)}
        />
        <Field
          label="Starts at"
          type="datetime-local"
          value={String(form.startsAt)}
          onChange={(value) => updateField("startsAt", value)}
        />
        <Field
          label="Registration deadline"
          type="datetime-local"
          value={String(form.registrationDeadline)}
          onChange={(value) => updateField("registrationDeadline", value)}
        />
      </div>
    );
  }

  if (activeTask === "registrationStatus") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-shell">
          Registration
          <select
            value={String(form.registrationId)}
            onChange={(event) => updateField("registrationId", event.target.value)}
          >
            <option value="">Select team submission</option>
            {registrations.map((registration) => (
              <option key={String(registration.id)} value={String(registration.id)}>
                {String(registration.team_name ?? "Team")} /{" "}
                {String(registration.captain_name ?? "Captain")}
              </option>
            ))}
          </select>
        </label>
        <label className="field-shell">
          Status
          <select
            value={String(form.registrationStatus)}
            onChange={(event) => updateField("registrationStatus", event.target.value)}
          >
            {["SUBMITTED", "UNDER_REVIEW", "APPROVED", "WAITLISTED", "REJECTED"].map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="field-shell">
        Tournament
        <select
          value={String(form.tournamentId)}
          onChange={(event) => updateField("tournamentId", event.target.value)}
        >
          <option value="">Select tournament</option>
          {tournaments.map((tournament) => (
            <option key={tournament.id} value={tournament.id}>
              {tournament.name}
            </option>
          ))}
        </select>
      </label>
      <Field
        label="Match name"
        value={String(form.matchName)}
        onChange={(value) => updateField("matchName", value)}
      />
      <Field
        label="Map"
        value={String(form.matchMap)}
        onChange={(value) => updateField("matchMap", value)}
      />
      <Field
        label="Group"
        value={String(form.matchGroup)}
        onChange={(value) => updateField("matchGroup", value)}
      />
      <Field
        label="Match starts at"
        type="datetime-local"
        value={String(form.matchStartsAt)}
        onChange={(value) => updateField("matchStartsAt", value)}
      />
    </div>
  );
}

function AdminDatabaseBrowser({
  snapshot,
  activeTab,
  setActiveTab,
}: {
  snapshot?: AdminSnapshot;
  activeTab: AdminDataTab;
  setActiveTab: (tab: AdminDataTab) => void;
}) {
  const tabs: Array<{ key: AdminDataTab; label: string; columns: string[] }> = [
    {
      key: "registrations",
      label: "Registrations",
      columns: [
        "team_name",
        "captain_name",
        "captain_email",
        "bgmi_uid",
        "players",
        "whatsapp",
        "discord",
        "payment_file_name",
        "status",
        "created_at",
      ],
    },
    {
      key: "teams",
      label: "Teams",
      columns: [
        "rank",
        "name",
        "short_name",
        "region",
        "captain",
        "matches_played",
        "wwcd",
        "placement_points",
        "finishes",
        "total_points",
        "preferred_drop",
      ],
    },
    {
      key: "tournaments",
      label: "Tournaments",
      columns: [
        "name",
        "mode",
        "status",
        "prize_pool",
        "entry_fee",
        "max_teams",
        "registered_teams",
        "starts_at",
        "registration_deadline",
        "maps",
      ],
    },
    {
      key: "matches",
      label: "Matches",
      columns: ["name", "group_name", "map", "status", "starts_at", "tournament_id"],
    },
    {
      key: "announcements",
      label: "Announcements",
      columns: ["category", "title", "body", "pinned", "publish_at", "tournament_id"],
    },
  ];

  const activeConfig = tabs.find((tab) => tab.key === activeTab) ?? tabs[0];
  const rows = snapshot?.[activeConfig.key] ?? [];

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`border px-3 py-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] ${
              activeTab === tab.key
                ? "border-green-300/50 bg-green-400/10 text-green-100"
                : "border-white/10 bg-white/[0.03] text-slate-400"
            }`}
          >
            {tab.label} {snapshot ? `(${snapshot[tab.key].length})` : ""}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto border border-white/10 bg-black/45">
        <table className="w-full min-w-[980px] text-left">
          <thead className="bg-white/[0.04] font-mono text-[0.62rem] uppercase tracking-[0.18em] text-slate-500">
            <tr>
              {activeConfig.columns.map((column) => (
                <th key={column} className="p-3">
                  {column.replaceAll("_", " ")}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, index) => (
                <tr key={String(row.id ?? index)} className="border-t border-white/10">
                  {activeConfig.columns.map((column) => (
                    <td key={column} className="max-w-[18rem] p-3 align-top text-sm text-slate-200">
                      {formatAdminCell(row[column])}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-5 text-sm text-slate-400" colSpan={activeConfig.columns.length}>
                  {snapshot ? "No rows in this table yet." : "Unlocking database snapshot..."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-slate-500">
        Snapshot: {snapshot ? formatUpdatedAt(snapshot.generatedAt) : "not loaded"}
      </p>
      {snapshot?.warnings?.length ? (
        <div className="mt-3 border border-orange-300/30 bg-orange-500/10 p-3 text-sm text-orange-100">
          {snapshot.warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function formatAdminCell(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-10 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="font-display text-4xl font-bold uppercase text-white">NexBattles BGMI</p>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
              Registration. Standings. Room ops.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              ["Discord", Headphones],
              ["WhatsApp", MessageCircle],
              ["Rules", Gamepad2],
            ].map(([label, Icon]) => (
              <motion.a
                key={label as string}
                whileHover={{ y: -4, scale: 1.04 }}
                href="#register"
                className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-200 hover:border-orange-300/50 hover:text-orange-200"
              >
                <Icon className="h-4 w-4" /> {label}
              </motion.a>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">
            Designed by
          </p>
          <div className="clip-panel border border-cyan-300/25 bg-white/[0.03] p-2 shadow-[0_0_28px_rgba(0,212,255,0.18)]">
            <img
              src="/assets/fiveu-technologies.jpeg"
              alt="FiveU Technologies Pvt Ltd"
              className="h-14 w-auto max-w-[18rem] object-contain sm:h-16"
            />
          </div>
        </div>
      </div>
    </footer>
  );
}

function BgmiTournamentApp() {
  const sound = useSoundDesign();
  useGsapSequences(sound.play);
  const [adminOpen, setAdminOpen] = useState(false);
  const { data = emptyPlatformData, isFetching, refetch } = usePlatformData();
  const liveLabel = formatUpdatedAt(data.generatedAt);

  return (
    <div className="min-h-screen overflow-hidden bg-[#0a0a0f] text-slate-100">
      <CursorCrosshair />
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-[100] bg-orange-500"
      />
      <AppNav
        liveLabel={liveLabel}
        muted={sound.muted}
        toggleSound={sound.toggle}
        onOpenAdmin={() => setAdminOpen(true)}
      />
      <main>
        <Hero data={data} isFetching={isFetching} playSound={sound.play} />
        <TournamentInfo data={data} />
        <Registration tournaments={data.tournaments} playSound={sound.play} />
        <Leaderboard data={data} />
        <Schedule schedules={data.schedules} />
        <HallOfFame teams={data.teams} />
      </main>
      <AdminPanelModal
        data={data}
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        onChanged={() => void refetch()}
      />
      <Footer />
    </div>
  );
}
