import {
  Crosshair,
  Gamepad2,
  Headphones,
  LayoutDashboard,
  LockKeyhole,
  LogIn,
  LogOut,
  MessageCircle,
  Shield,
  User,
  Volume2,
  VolumeX,
} from "lucide-react";
import { motion } from "framer-motion";
import { useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth, AuthProvider } from "../lib/auth-context";
import {
  CursorCrosshair,
  formatUpdatedAt,
  usePlatformData,
  useSoundDesign,
  useGsapSequences,
} from "../lib/shared-ui";
import { AdminPanelModal } from "../pages/Admin";
import { AuthModal } from "./AuthModal";

export function AppNav({
  liveLabel,
  muted,
  toggleSound,
  onOpenAdmin,
  onOpenAuth,
}: {
  liveLabel: string;
  muted: boolean;
  toggleSound: () => void;
  onOpenAdmin: () => void;
  onOpenAuth: () => void;
}) {
  const { user, logout } = useAuth();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-orange-400/20 bg-black/65 backdrop-blur-xl">
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
              Esports Hub
            </span>
          </span>
        </Link>

        {/* Minimal Nav: Home, WhatsApp Channel, Contact Us */}
        <nav className="hidden items-center gap-6 lg:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-mono text-xs uppercase tracking-[0.18em] transition ${
                isActive
                  ? "font-bold text-orange-300 border-b-2 border-orange-400 pb-0.5"
                  : "text-slate-300 hover:text-orange-300"
              }`
            }
          >
            Home
          </NavLink>
          <a
            href="https://whatsapp.com/channel/0029VanlLBL9RZARIMR3Vm2W"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-slate-300 transition hover:text-green-300"
          >
            <MessageCircle className="h-3.5 w-3.5 text-green-400" /> WhatsApp Channel
          </a>
          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `font-mono text-xs uppercase tracking-[0.18em] transition ${
                isActive
                  ? "font-bold text-orange-300 border-b-2 border-orange-400 pb-0.5"
                  : "text-slate-300 hover:text-orange-300"
              }`
            }
          >
            Contact Us
          </NavLink>
        </nav>

        {/* Auth State Action Buttons */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/dashboard">
                <button
                  type="button"
                  className="inline-flex min-h-10 items-center gap-2 border border-green-400/60 bg-green-500/10 px-3.5 font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-green-100 transition hover:bg-green-500/20"
                >
                  <LayoutDashboard className="h-4 w-4 text-green-300" />
                  My Dashboard
                </button>
              </Link>

              <button
                type="button"
                onClick={logout}
                title="Logout"
                className="grid h-10 w-10 place-items-center border border-white/15 bg-white/5 text-slate-300 transition hover:border-red-400/60 hover:text-red-300"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </>
          ) : (
            <button
              type="button"
              onClick={onOpenAuth}
              className="inline-flex min-h-10 items-center gap-2 border border-orange-400/60 bg-gradient-to-r from-orange-500/20 via-orange-600/20 to-orange-500/20 px-3.5 font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white transition hover:border-orange-300 hover:bg-orange-500/30 shadow-[0_0_20px_rgba(255,107,0,0.2)]"
            >
              <LogIn className="h-4 w-4" />
              Login
            </button>
          )}

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
    <footer className="border-t border-white/10 bg-[#07070b] px-4 py-12 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand & Mission Statement */}
          <div>
            <Link to="/" className="font-display text-4xl font-bold uppercase tracking-wider text-white">
              NexBattles BGMI
            </Link>
            <p className="mt-3 max-w-md font-mono text-xs leading-relaxed text-slate-400">
              India's premiere competitive BGMI tournament & scrim hub. Real-time standings, verified rosters, protected match drop vaults, and automated points tables.
            </p>
            {/* Social Icons */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                { label: "WhatsApp Channel", href: "https://whatsapp.com/channel/0029VanlLBL9RZARIMR3Vm2W", icon: MessageCircle },
                { label: "Instagram", href: "https://www.instagram.com/lordsesports.in?igsh=MXRyb2liaTN4YW5heg==", icon: Shield },
                { label: "Discord", href: "https://discord.gg/nexbattles", icon: Headphones },
                { label: "YouTube", href: "https://youtube.com/@nexbattles", icon: Gamepad2 },
              ].map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 border border-white/15 bg-white/5 px-3 py-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-300 transition hover:border-orange-400/60 hover:text-orange-200"
                >
                  <Icon className="h-3.5 w-3.5 text-orange-300" /> {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Hub Links */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-orange-300">
              Tournament Hub
            </h4>
            <ul className="mt-4 space-y-2.5 font-mono text-xs text-slate-300">
              <li>
                <Link to="/weekend-war" className="transition hover:text-orange-300">
                  01. Weekend War Championship
                </Link>
              </li>
              <li>
                <Link to="/daily-grind" className="transition hover:text-orange-300">
                  02. Daily Grind Scrims
                </Link>
              </li>
              <li>
                <Link to="/points-table" className="transition hover:text-orange-300">
                  03. Daily Scrim Points Table + MVP
                </Link>
              </li>
              <li>
                <Link to="/weekly-points" className="transition hover:text-orange-300">
                  04. Weekly & Weekend Standings
                </Link>
              </li>
              <li>
                <Link to="/register" className="transition hover:text-orange-300">
                  05. Elite Series Registration
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Platform Info */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-orange-300">
              Legal & Support
            </h4>
            <ul className="mt-4 space-y-2.5 font-mono text-xs text-slate-300">
              <li>
                <Link to="/terms" className="transition hover:text-orange-300">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="transition hover:text-orange-300">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-orange-300">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-orange-300">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/admin" className="transition hover:text-orange-300">
                  Organizer Command Deck
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Attribution */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">
            © 2026 NexBattles BGMI. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">
              Engineered by
            </span>
            <div className="clip-panel border border-cyan-300/25 bg-white/[0.03] p-1.5 shadow-[0_0_24px_rgba(0,212,255,0.18)]">
              <img
                src="/assets/fiveu-technologies.jpeg"
                alt="FiveU Technologies Pvt Ltd"
                className="h-10 w-auto max-w-[14rem] object-contain sm:h-12"
              />
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export function LayoutContent({ children }: { children: ReactNode }) {
  const sound = useSoundDesign();
  useGsapSequences(sound.play);
  const [adminOpen, setAdminOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { data, refetch } = usePlatformData();
  const liveLabel = formatUpdatedAt(data.generatedAt);

  return (
    <div className="min-h-screen overflow-hidden bg-[#08080c] text-slate-100">
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
        onOpenAuth={() => setAuthOpen(true)}
      />
      <main className="min-h-[calc(100vh-16rem)]">{children}</main>
      <AdminPanelModal
        data={data}
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        onChanged={() => void refetch()}
      />
      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
      <Footer />
    </div>
  );
}

export function Layout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthProvider>
  );
}
