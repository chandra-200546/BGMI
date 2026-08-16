import {
  Crosshair,
  LayoutDashboard,
  LogIn,
  LogOut,
  MessageCircle,
  Shield,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
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
  onOpenAuth,
}: {
  liveLabel: string;
  muted: boolean;
  toggleSound: () => void;
  onOpenAuth: () => void;
}) {
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-40 border-b border-sky-400/20 bg-[#030712]/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 lg:px-6">
        {/* Brand Logo & Name */}
        <Link to="/" className="flex items-center gap-3 font-display text-2xl font-bold uppercase tracking-wider text-white">
          <img
            src="/logo.png"
            alt="LordsEsports Logo"
            className="h-9 w-9 rounded-md border border-sky-400/40 bg-black/60 object-contain p-0.5"
          />
          <span className="inline">LordsEsports</span>
        </Link>

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

          <button
            type="button"
            aria-label="Toggle interface sound"
            onClick={toggleSound}
            className="grid h-10 w-10 place-items-center border border-white/15 bg-white/5 text-slate-200 transition hover:border-sky-300/60 hover:text-sky-200"
          >
            {muted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}

export function Footer({ onOpenAdmin }: { onOpenAdmin?: () => void }) {
  return (
    <footer className="border-t border-sky-400/15 bg-black px-4 py-12 lg:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="grid gap-8 md:grid-cols-2">
          {/* Brand & Mission */}
          <div>
            <Link to="/" className="flex items-center gap-3 font-display text-4xl font-bold uppercase tracking-wider text-white">
              <img
                src="/logo.png"
                alt="LordsEsports Logo"
                className="h-12 w-12 rounded-md border border-sky-400/40 bg-black/60 object-contain p-1"
              />
              <span>LordsEsports BGMI</span>
            </Link>
            <p className="mt-3 max-w-md font-mono text-xs leading-relaxed text-slate-400">
              India's premiere competitive BGMI tournament & scrim hub. Real-time standings, verified rosters, protected match drop vaults, and automated points tables.
            </p>
            {/* Social Icons */}
            <div className="mt-6 flex flex-wrap gap-2.5">
              {[
                { label: "WhatsApp Channel", href: "https://whatsapp.com/channel/0029VanlLBL9RZARIMR3Vm2W", icon: MessageCircle },
                { label: "Instagram", href: "https://www.instagram.com/lordsesports.in?igsh=MXRyb2liaTN4YW5heg==", icon: Shield },
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

          {/* Legal & Support */}
          <div className="md:justify-self-end md:text-right">
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
            </ul>
          </div>
        </div>

        {/* Copyright & Attribution */}
        <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-6 md:flex-row">
          <p className="font-mono text-[0.68rem] uppercase tracking-[0.22em] text-slate-500">
            <button
              type="button"
              onClick={onOpenAdmin}
              className="inline-block font-bold text-sky-400 hover:scale-125 transition-transform duration-200 cursor-pointer focus:outline-none"
              title="Admin Access"
            >
              ©
            </button>{" "}
            2026 LordsEsports BGMI. All rights reserved.
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
  const { user, authModalOpen, openAuthModal, closeAuthModal } = useAuth();
  const { data, refetch } = usePlatformData();
  const navigate = useNavigate();
  const liveLabel = formatUpdatedAt(data.generatedAt);

  // Auto redirect to pending tournament registration if player just logged in
  useEffect(() => {
    if (user && typeof window !== "undefined") {
      const pendingTournamentId = sessionStorage.getItem("lordsesports_pending_tournament_id");
      if (pendingTournamentId) {
        sessionStorage.removeItem("lordsesports_pending_tournament_id");
        navigate(`/register?tournamentId=${encodeURIComponent(pendingTournamentId)}`);
      }
    }
  }, [user, navigate]);

  // Secret keystroke detection to open Admin Panel modal when bgmi!@#$% (or vinaygbmi!@#$%^&*) is typed
  useEffect(() => {
    let keyBuffer = "";
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key.length === 1) {
        keyBuffer += event.key;
      }
      if (keyBuffer.length > 50) {
        keyBuffer = keyBuffer.slice(-50);
      }

      const lower = keyBuffer.toLowerCase();
      if (
        lower.includes("bgmi!@#$%") ||
        lower.includes("vinaygbmi!@#$%^&*") ||
        lower.includes("bgmi!@#$%^&*")
      ) {
        setAdminOpen(true);
        keyBuffer = "";
      }
    }

    window.addEventListener("keydown", handleKeyDown, true);
    return () => window.removeEventListener("keydown", handleKeyDown, true);
  }, []);

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100">
      <AppNav
        liveLabel={liveLabel}
        muted={sound.muted}
        toggleSound={sound.toggle}
        onOpenAuth={openAuthModal}
      />
      <main className="min-h-[calc(100vh-16rem)]">{children}</main>
      <AdminPanelModal
        data={data}
        open={adminOpen}
        onClose={() => setAdminOpen(false)}
        onChanged={() => void refetch()}
      />
      <AuthModal open={authModalOpen} onClose={closeAuthModal} />
      <Footer onOpenAdmin={() => setAdminOpen(true)} />
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
