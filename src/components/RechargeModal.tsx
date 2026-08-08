import { AnimatePresence, motion } from "framer-motion";
import { CreditCard, IndianRupee, ShieldCheck, Wallet, X } from "lucide-react";
import { useState } from "react";

export function RechargeModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [amount, setAmount] = useState("100");
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  const presets = ["50", "100", "250", "500", "1000"];

  function handleProceed() {
    const num = Number(amount);
    if (!num || num < 50) {
      setStatus("Minimum wallet recharge amount is ₹50");
      return;
    }
    setLoading(true);
    setStatus("");
    setTimeout(() => {
      setStatus(`Gateway ready for ₹${num}. Razorpay / UPI gateway integration pending confirmation.`);
      setLoading(false);
    }, 1000);
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
              aria-label="Close recharge modal"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center border border-orange-400/60 bg-orange-500/10 text-orange-300 shadow-[0_0_30px_rgba(255,107,0,0.35)]">
                <Wallet className="h-6 w-6" />
              </span>
              <h2 className="mt-4 font-display text-4xl font-bold uppercase tracking-wider text-white">
                Recharge Wallet
              </h2>
              <p className="mt-1 font-mono text-xs uppercase tracking-[0.18em] text-green-300">
                Current Balance: ₹0.00
              </p>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <label className="block font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
                  Enter Recharge Amount (Min ₹50)
                </label>
                <div className="relative mt-2">
                  <IndianRupee className="absolute left-3 top-3.5 h-4 w-4 text-orange-300" />
                  <input
                    type="number"
                    min="50"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="100"
                    className="w-full border border-white/15 bg-black/60 py-3 pl-10 pr-4 font-mono text-lg font-bold text-white outline-none transition focus:border-orange-400"
                  />
                </div>
              </div>

              <div>
                <span className="block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-500">
                  Quick Amount Presets
                </span>
                <div className="mt-2 grid grid-cols-5 gap-2">
                  {presets.map((preset) => (
                    <button
                      key={preset}
                      type="button"
                      onClick={() => setAmount(preset)}
                      className={`border py-2 font-mono text-xs font-bold uppercase transition ${
                        amount === preset
                          ? "border-orange-400 bg-orange-500/20 text-orange-100"
                          : "border-white/10 bg-white/5 text-slate-300 hover:border-orange-400/50"
                      }`}
                    >
                      ₹{preset}
                    </button>
                  ))}
                </div>
              </div>

              <div className="border border-white/10 bg-black/40 p-4">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Entry Pass Credits</span>
                  <span className="font-mono font-bold text-white">₹{amount || 0}.00</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                  <span>Platform Fee (0%)</span>
                  <span className="font-mono text-green-300">₹0.00</span>
                </div>
                <div className="mt-3 flex items-center justify-between border-t border-white/10 pt-2 font-mono text-sm font-bold text-orange-300">
                  <span>Total Payable</span>
                  <span>₹{amount || 0}.00</span>
                </div>
              </div>

              <button
                type="button"
                onClick={handleProceed}
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 border border-orange-400/60 bg-gradient-to-r from-orange-500/20 via-orange-600/20 to-orange-500/20 py-3.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:border-orange-300 hover:bg-orange-500/30 disabled:opacity-50"
              >
                <CreditCard className="h-4 w-4" />
                {loading ? "Processing..." : "Proceed to Pay"}
              </button>

              {status ? (
                <div className="border border-orange-400/30 bg-orange-500/10 p-3 text-center font-mono text-xs uppercase tracking-[0.15em] text-orange-100">
                  {status}
                </div>
              ) : null}
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.18em] text-slate-500">
              <ShieldCheck className="h-4 w-4 text-green-300" /> 256-bit Encrypted Payments
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
