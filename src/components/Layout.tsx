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
import { useState, type ReactNode } from "react";
import { Link, NavLink } from "react-router-dom";
import { useAuth, AuthProvider } from "../lib/auth-context";
import {
  formatUpdatedAt,
  usePlatformData,
  useSoundDesign,
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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-sky-400/20 bg-black/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 lg:px-6">
        <Link to="/" className="flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center border border-sky-400/60 bg-sky-500/10 text-sky-400">
            <Crosshair className="h-5 w-5" />
          </span>
          <span>
            <span className="block font-display text-2xl font-bold uppercase leading-none tracking-[0.12em] text-white">
              LordsEsports
            </span>
            <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-sky-400">
              BGMI Hub
            </span>
          </span>
        </Link>

        {/* Navigation */}
        <nav className="hidden items-center gap-6 lg:flex">
          <NavLink
            to="/"
            className={({ isActive }) =>
              `font-mono text-xs uppercase tracking-[0.18em] transition ${
                isActive
                  ? "font-bold text-sky-400 border-b-2 border-sky-400 pb-0.5"
                  : "text-slate-300 hover:text-sky-300"
              }`
            }
          >
            Home
          </NavLink>

          <a
            href="https://whatsapp.com/channel/0029VanlLBL9RZARIMR3Vm2W"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.18em] text-slate-300 transition hover:text-green-400"
          >
            <MessageCircle className="h-3.5 w-3.5 text-green-400" /> WhatsApp Channel
          </a>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `font-mono text-xs uppercase tracking-[0.18em] transition ${
                isActive
                  ? "font-bold text-sky-400 border-b-2 border-sky-400 pb-0.5"
                  : "text-slate-300 hover:text-sky-300"
              }`
            }
          >
            Contact Us
          </NavLink>

          <NavLink
            to="/admin"
            className={({ isActive }) =>
              `flex items-center gap-1.5 border border-sky-400/50 bg-sky-500/10 px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-sky-300 transition hover:border-sky-300 hover:bg-sky-500 hover:text-black ${
                isActive ? "bg-sky-400 text-black border-sky-300 font-extrabold" : ""
              }`
            }
          >
            <LockKeyhole className="h-3.5 w-3.5" /> Admin Panel
          </NavLink>
        </nav>

        {/* Auth Actions */}
        <div className="flex items-center gap-2">
          {user ? (
            <>
              <Link to="/dashboard">
                <button
                  type="button"
                  className="inline-flex min-h-10 items-center gap-2 border border-sky-400/60 bg-sky-500/10 px-3.5 font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-sky-100 transition hover:bg-sky-500 hover:text-black"
                >
                  <LayoutDashboard className="h-4 w-4 text-sky-300" />
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
              className="inline-flex min-h-10 items-center gap-2 border border-sky-400/60 bg-sky-500/20 px-4 font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] text-white transition hover:bg-sky-400 hover:text-black"
            >
              <LogIn className="h-4 w-4" />
              Login
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-sky-400/15 bg-black px-4 py-12 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 lg:grid-cols-[1.4fr_1fr_1fr]">
          {/* Brand & Mission */}
          <div>
            <Link to="/" className="font-display text-4xl font-bold uppercase tracking-wider text-white">
              LordsEsports BGMI
            </Link>
            <p className="mt-3 max-w-md font-mono text-xs leading-relaxed text-slate-400">
              India's premiere competitive BGMI tournament & scrim hub. Real-time standings, verified rosters, protected match drop vaults, and automated points tables.
            </p>
            {/* Social Icons */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                { label: "WhatsApp Channel", href: "https://whatsapp.com/channel/0029VanlLBL9RZARIMR3Vm2W", icon: MessageCircle },
                { label: "Instagram", href: "https://www.instagram.com/lordsesports.in?igsh=MXRyb2liaTN4YW5heg==", icon: Shield },
                { label: "Discord", href: "https://discord.gg/lordsesports", icon: Headphones },
                { label: "YouTube", href: "https://youtube.com/@lordsesports", icon: Gamepad2 },
              ].map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 border border-white/15 bg-white/5 px-3 py-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] text-slate-300 transition hover:border-sky-400 hover:text-sky-300"
                >
                  <Icon className="h-3.5 w-3.5 text-sky-400" /> {label}
                </a>
              ))}
            </div>
          </div>

          {/* Quick Hub Links */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-sky-400">
              Tournament Hub
            </h4>
            <ul className="mt-4 space-y-2.5 font-mono text-xs text-slate-300">
              <li>
                <Link to="/weekend-war" className="transition hover:text-sky-400">
                  01. Weekend War Championship
                </Link>
              </li>
              <li>
                <Link to="/daily-grind" className="transition hover:text-sky-400">
                  02. Daily Grind Scrims
                </Link>
              </li>
              <li>
                <Link to="/points-table" className="transition hover:text-sky-400">
                  03. Daily Scrim Points Table + MVP
                </Link>
              </li>
              <li>
                <Link to="/weekly-points" className="transition hover:text-sky-400">
                  04. Weekly & Weekend Standings
                </Link>
              </li>
              <li>
                <Link to="/register" className="transition hover:text-sky-400">
                  05. Elite Series Registration
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-sky-400 font-bold transition hover:text-white">
                  08. Organizer Admin Panel
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Support */}
          <div>
            <h4 className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-sky-400">
              Legal & Support
            </h4>
            <ul className="mt-4 space-y-2.5 font-mono text-xs text-slate-300">
              <li>
                <Link to="/terms" className="transition hover:text-sky-400">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="transition hover:text-sky-400">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/contact" className="transition hover:text-sky-400">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link to="/about" className="transition hover:text-sky-400">
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/admin" className="text-sky-400 font-bold transition hover:text-white">
                  Organizer Command Deck (/admin)
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Copyright & Attribution */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">
            © 2026 LordsEsports BGMI. All rights reserved.
          </p>
          <div className="flex items-center gap-3">
            <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">
              Engineered by
            </span>
            <div className="border border-sky-400/20 bg-black p-1.5">
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
  const [adminOpen, setAdminOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const { data, refetch } = usePlatformData();
  const liveLabel = formatUpdatedAt(data.generatedAt);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
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
