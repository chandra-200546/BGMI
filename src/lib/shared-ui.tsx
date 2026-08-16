import { useQuery } from "@tanstack/react-query";
import { useEffect, useState, useRef, type ReactNode } from "react";
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

  useEffect(() => {
    const saved = window.localStorage.getItem("bgmi-sound-muted");
    if (saved) setMuted(saved === "true");
  }, []);

  useEffect(() => {
    mutedRef.current = muted;
    window.localStorage.setItem("bgmi-sound-muted", String(muted));
  }, [muted]);

  function play(_name: SoundName) {
    // sound triggers
  }

  function toggle() {
    setMuted((value) => {
      const next = !value;
      mutedRef.current = next;
      return next;
    });
  }

  return { muted, toggle, play };
}

export function useGsapSequences(_playSound: (name: SoundName) => void) {
  // Simple static sequence without heavy animations
}

export function MagneticButton({
  children,
  href,
  className = "",
  onClick,
}: {
  children: ReactNode;
  href?: string;
  className?: string;
  onClick?: () => void;
  playSound?: (name: SoundName) => void;
  sound?: SoundName;
}) {
  const baseClasses = `inline-flex items-center gap-2 border border-sky-400 bg-sky-500/20 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-100 transition hover:bg-sky-400 hover:text-black ${className}`;

  if (href) {
    return (
      <a href={href} className={baseClasses}>
        {children}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={baseClasses}>
      {children}
    </button>
  );
}

export function CursorCrosshair() {
  return null;
}

export function HudMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border border-sky-400/20 bg-sky-950/20 p-3">
      <p className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-2 truncate font-display text-2xl font-bold uppercase text-sky-300">{value}</p>
    </div>
  );
}

export function MagazineLoader({ active }: { active: boolean }) {
  return (
    <div className="flex gap-1 mt-3" aria-hidden="true">
      {Array.from({ length: 9 }).map((_, index) => (
        <span
          key={index}
          className={`h-2.5 w-1.5 border border-sky-400/50 ${
            active || index < 7 ? "bg-sky-400" : "bg-transparent"
          }`}
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
      className="relative overflow-hidden border-t border-sky-400/15 px-4 py-12 lg:px-6 lg:py-16 bg-black/40"
    >
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-8 max-w-3xl">
          <p className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-sky-400">
            {eyebrow}
          </p>
          <h2 className="mt-2 font-display text-4xl font-bold uppercase leading-none text-white md:text-6xl">
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
  return (
    <span>
      {prefix}
      {value.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
