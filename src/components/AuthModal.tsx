import { AnimatePresence, motion } from "framer-motion";
import { Lock, Mail, ShieldCheck, X } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../lib/auth-context";

export function AuthModal({
  open,
  onClose,
  customMessage,
  onSuccess,
}: {
  open: boolean;
  onClose: () => void;
  customMessage?: string;
  onSuccess?: () => void;
}) {
  const { loginWithGoogle, loginWithEmail } = useAuth();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function handleGoogleLogin() {
    setLoading(true);
    setMessage("");
    try {
      await loginWithGoogle();
      setMessage("Login successful! Welcome to NexBattles.");
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 800);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Authentication failed");
    } finally {
      setLoading(false);
    }
  }

  async function handleEmailLogin(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    setLoading(true);
    setMessage("");
    try {
      await loginWithEmail(email);
      setMessage(`Authentication link sent & profile authenticated for ${email}!`);
      setTimeout(() => {
        onSuccess?.();
        onClose();
      }, 1000);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Login failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] grid place-items-center bg-black/85 px-4 backdrop-blur-xl"
        >
          <motion.div
            initial={{ scale: 0.92, y: 24, rotateX: -6 }}
            animate={{ scale: 1, y: 0, rotateX: 0 }}
            exit={{ scale: 0.92, y: 24, rotateX: -6 }}
            className="clip-panel hud-panel relative w-full max-w-md border border-orange-500/40 p-6 md:p-8"
          >
            <button
              type="button"
              onClick={onClose}
              className="absolute right-4 top-4 grid h-9 w-9 place-items-center border border-white/15 bg-white/5 text-slate-300 transition hover:border-orange-400 hover:text-white"
              aria-label="Close auth modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center border border-orange-400/60 bg-orange-500/10 text-orange-300 shadow-[0_0_30px_rgba(255,107,0,0.35)]">
                <ShieldCheck className="h-6 w-6" />
              </span>
              <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-wider text-white">
                Player Authentication
              </h2>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-green-300">
                Continue with Gmail
              </p>
            </div>

            {customMessage ? (
              <div className="mt-4 border border-orange-400/40 bg-orange-500/15 p-3 text-center font-mono text-xs uppercase tracking-[0.16em] text-orange-200">
                {customMessage}
              </div>
            ) : null}

            <div className="mt-6 space-y-4">
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={loading}
                className="group flex w-full items-center justify-center gap-3 border border-orange-400/60 bg-gradient-to-r from-orange-500/20 via-orange-600/20 to-orange-500/20 px-5 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:border-orange-300 hover:bg-orange-500/30 disabled:opacity-50"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24">
                  <path
                    fill="#EA4335"
                    d="M12 5c1.6 0 3 .6 4.1 1.6l3.1-3.1C17.3 1.7 14.8 1 12 1 7.5 1 3.7 3.6 1.9 7.3l3.7 2.9C6.5 7.3 9 5 12 5z"
                  />
                  <path
                    fill="#4285F4"
                    d="M23.5 12.3c0-.8-.1-1.6-.2-2.3H12v4.5h6.5c-.3 1.5-1.1 2.8-2.4 3.7l3.7 2.9c2.2-2 3.7-5 3.7-8.8z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.6 14.8c-.2-.7-.4-1.5-.4-2.3s.2-1.6.4-2.3L1.9 7.3C.7 9.7 0 12 0 14.8s.7 5.1 1.9 7.5l3.7-2.9c-.6-.8-1.1-2.4-1.1-4.6z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c3.2 0 6-1.1 8-3l-3.7-2.9c-1.1.7-2.5 1.2-4.3 1.2-3 0-5.5-2.3-6.4-5.2L1.9 16C3.7 19.7 7.5 23 12 23z"
                  />
                </svg>
                {loading ? "Authenticating..." : "Continue with Gmail"}
              </button>

              <div className="relative my-4 flex items-center justify-center">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10" />
                </div>
                <span className="relative bg-[#0d0e15] px-3 font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">
                  Or magic link
                </span>
              </div>

              <form onSubmit={handleEmailLogin} className="space-y-3">
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 h-4 w-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="player@esports.com"
                    required
                    className="w-full border border-white/15 bg-black/60 py-3 pl-10 pr-4 font-mono text-xs text-white placeholder-slate-500 outline-none transition focus:border-orange-400"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex w-full items-center justify-center gap-2 border border-white/20 bg-white/5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-slate-200 transition hover:border-orange-300 hover:text-orange-200 disabled:opacity-50"
                >
                  <Lock className="h-4 w-4" /> Send Magic Pass
                </button>
              </form>

              {message ? (
                <div className="border border-green-400/30 bg-green-500/10 p-3 text-center font-mono text-xs uppercase tracking-[0.15em] text-green-200">
                  {message}
                </div>
              ) : null}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
