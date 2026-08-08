import { useQuery } from "@tanstack/react-query";
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
import { useEffect, useState, useRef, type ChangeEvent, type ReactNode } from "react";
import { emptyPlatformData, type PlatformData } from "./platform-types";

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

export type SoundName = "hover" | "shot" | "reload" | "reveal" | "victory";

export async function fetchPlatformData(): Promise<PlatformData> {
  const response = await fetch("/api/public/live", { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load live tournament data");
  return (await response.json()) as PlatformData;
}

export function usePlatformData() {
  return useQuery({
    queryKey: ["platform-live-data"],
    queryFn: fetchPlatformData,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 2500,
    placeholderData: emptyPlatformData,
  });
}

export function formatUpdatedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "syncing";
  return date.toLocaleTimeString("en-IN", {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function parseDisplayDate(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function useCountdown(target?: Date) {
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

export function useSoundDesign() {
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

export function useGsapSequences(playSound: (name: SoundName) => void) {
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

export function MagneticButton({
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

export function CursorCrosshair() {
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

export function HudMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-white/10 bg-black/40 p-3">
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-slate-500">{label}</p>
      <p className="mt-2 truncate font-display text-2xl font-bold uppercase text-white">{value}</p>
    </div>
  );
}

export function MagazineLoader({ active }: { active: boolean }) {
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

export function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id?: string;
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

export function AnimatedNumber({
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
