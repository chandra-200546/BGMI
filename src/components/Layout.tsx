import {
  Crosshair,
  Gamepad2,
  Headphones,
  LockKeyhole,
  MessageCircle,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";
import {
  CursorCrosshair,
  formatUpdatedAt,
  usePlatformData,
  useSoundDesign,
  useGsapSequences,
} from "../lib/shared-ui";
import { AdminPanelModal } from "../pages/Admin";

const navItems = [
  { label: "Arena", path: "/" },
  { label: "Prizes", path: "/#prizes" },
  { label: "Register", path: "/register" },
  { label: "Leaderboard", path: "/leaderboard" },
  { label: "Schedule", path: "/schedule" },
  { label: "Teams", path: "/teams" },
];

export function AppNav({
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
  const location = useLocation();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-orange-400/20 bg-black/55 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
        <Link to="/" className="flex items-center gap-3">
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
        </Link>

        <nav className="hidden items-center gap-6 lg:flex">
          {navItems.map(({ label, path }) => {
            const isAnchor = path.includes("#");
            const isActive = isAnchor
              ? location.pathname === "/" && location.hash === "#prizes"
              : location.pathname === path;

            if (isAnchor) {
              return (
                <a
                  key={label}
                  href={path}
                  className={`font-mono text-xs uppercase tracking-[0.18em] transition ${
                    isActive
                      ? "font-bold text-orange-300 underline underline-offset-4"
                      : "text-slate-300 hover:text-orange-300"
                  }`}
                >
                  {label}
                </a>
              );
            }

            return (
              <NavLink
                key={label}
                to={path}
                className={({ isActive: linkActive }) =>
                  `font-mono text-xs uppercase tracking-[0.18em] transition ${
                    linkActive
                      ? "font-bold text-orange-300 border-b-2 border-orange-400 pb-0.5"
                      : "text-slate-300 hover:text-orange-300"
                  }`
                }
              >
                {label}
              </NavLink>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            to="/admin"
            className="inline-flex min-h-10 items-center gap-2 border border-orange-300/40 bg-orange-500/10 px-3 font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-orange-100 transition hover:bg-orange-500/20"
          >
            <LockKeyhole className="h-4 w-4" />
            Admin Panel
          </Link>
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

export function Footer() {
  return (
    <footer className="border-t border-white/10 bg-black px-4 py-10 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <Link to="/" className="font-display text-4xl font-bold uppercase text-white">
              NexBattles BGMI
            </Link>
            <p className="mt-1 font-mono text-xs uppercase tracking-[0.2em] text-slate-500">
              Registration. Standings. Room ops.
            </p>
          </div>
          <div className="flex flex-wrap gap-3">
            {[
              ["Discord", Headphones, "/register"],
              ["WhatsApp", MessageCircle, "/register"],
              ["Rules", Gamepad2, "/schedule"],
            ].map(([label, Icon, to]) => (
              <motion.div key={label as string} whileHover={{ y: -4, scale: 1.04 }}>
                <Link
                  to={to as string}
                  className="inline-flex items-center gap-2 border border-white/15 bg-white/5 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-200 hover:border-orange-300/50 hover:text-orange-200"
                >
                  <Icon className="h-4 w-4" /> {label}
                </Link>
              </motion.div>
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

export function Layout({ children }: { children: ReactNode }) {
  const sound = useSoundDesign();
  useGsapSequences(sound.play);
  const [adminOpen, setAdminOpen] = useState(false);
  const { data, refetch } = usePlatformData();
  const liveLabel = formatUpdatedAt(data.generatedAt);

  return (
    <div className="min-h-screen overflow-hidden bg-[#0a0a0f] text-slate-100">
      <CursorCrosshair />
      <motion.div
        initial={{ x: 0 }}
        animate={{ x: "100%" }}
        transition={{ duration: 0.75, ease: [0.76, 0, 0.24, 1] }}
        className="fixed inset-0 z-[100] bg-orange-500 pointer-events-none"
      />
      <AppNav
        liveLabel={liveLabel}
        muted={sound.muted}
        toggleSound={sound.toggle}
        onOpenAdmin={() => setAdminOpen(true)}
      />
      <main className="min-h-[calc(100vh-16rem)]">{children}</main>
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
