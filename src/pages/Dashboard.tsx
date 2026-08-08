import { motion } from "framer-motion";
import { CheckCircle, Clock, KeyRound, LogOut, Shield, ShieldCheck, Trophy, User, Users } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { Section } from "../lib/shared-ui";

export function DashboardPage() {
  const { user, userChallenges, logout } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    return (
      <div className="pt-28 pb-16 px-4">
        <Section eyebrow="Authentication Required" title="Player Dashboard">
          <div className="clip-panel hud-panel max-w-xl border border-orange-500/40 p-8 text-center">
            <User className="mx-auto h-14 w-14 text-orange-400" />
            <h3 className="mt-4 font-display text-4xl font-bold uppercase text-white">
              Access Restricted
            </h3>
            <p className="mt-2 font-mono text-xs text-slate-300">
              Please login with your Gmail account to view your registered battles, challenges, and room credentials.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="border border-white/20 bg-white/5 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white hover:border-orange-400"
              >
                Back to Home
              </button>
            </div>
          </div>
        </Section>
      </div>
    );
  }

  return (
    <div className="pt-24 pb-16">
      <Section eyebrow="Player Command Center" title="My Dashboard">
        {/* Profile Card Header */}
        <div className="clip-panel hud-panel border border-orange-500/40 p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              <span className="grid h-14 w-14 place-items-center border border-orange-400/60 bg-orange-500/10 text-orange-300 shadow-[0_0_30px_rgba(255,107,0,0.3)]">
                <User className="h-7 w-7" />
              </span>
              <div>
                <h3 className="font-display text-4xl font-bold uppercase text-white">
                  {user.name}
                </h3>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-green-300">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <Link to="/register">
                <button
                  type="button"
                  className="border border-orange-400/60 bg-orange-500/20 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-orange-100 transition hover:bg-orange-500 hover:text-black"
                >
                  + Register New Squad
                </button>
              </Link>
              <button
                type="button"
                onClick={logout}
                className="flex items-center gap-2 border border-red-400/40 bg-red-500/10 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-red-200 transition hover:bg-red-500/20"
              >
                <LogOut className="h-4 w-4" /> Logout
              </button>
            </div>
          </div>
        </div>

        {/* Registered Challenges List */}
        <div className="mt-10">
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <h4 className="font-display text-3xl font-bold uppercase text-white">
              My Registered Battles & Challenges ({userChallenges.length})
            </h4>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-orange-300">
              Live Tracker
            </span>
          </div>

          <div className="mt-6 grid gap-6">
            {userChallenges.length > 0 ? (
              userChallenges.map((challenge) => (
                <motion.div
                  key={challenge.id}
                  whileHover={{ y: -4 }}
                  className="clip-panel hud-panel border border-white/15 p-6 backdrop-blur-md transition hover:border-orange-400/60"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="border border-orange-400/40 bg-orange-500/10 px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-orange-200">
                          {challenge.tournamentName}
                        </span>
                        <span
                          className={`border px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] ${
                            challenge.status === "APPROVED"
                              ? "border-green-400/40 bg-green-500/10 text-green-200"
                              : "border-yellow-400/40 bg-yellow-500/10 text-yellow-200"
                          }`}
                        >
                          {challenge.status}
                        </span>
                        <span className="border border-green-400/40 bg-green-500/10 px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-green-200">
                          Payment: {challenge.paymentStatus} ({challenge.entryFee})
                        </span>
                      </div>

                      <h4 className="mt-3 font-display text-3xl font-bold uppercase text-white">
                        Squad: {challenge.teamName}
                      </h4>
                      <p className="mt-1 font-mono text-xs text-slate-300">
                        Captain: {challenge.captainName} | BGMI UID: {challenge.bgmiUid}
                      </p>
                    </div>

                    <div className="border border-white/10 bg-black/40 p-4 min-w-[240px]">
                      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-orange-300">
                        <Clock className="h-4 w-4" /> {challenge.matchTime}
                      </div>
                      <div className="mt-2 flex items-center gap-2 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-slate-400">
                        <KeyRound className="h-3.5 w-3.5 text-green-400" />
                        Room ID: {challenge.roomDetails?.roomId || "Reveals 15m before drop"}
                      </div>
                    </div>
                  </div>

                  {/* Roster details */}
                  <div className="mt-4 border-t border-white/10 pt-3">
                    <span className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-slate-400">
                      Roster IGNs:
                    </span>
                    <div className="mt-1 flex flex-wrap gap-2 font-mono text-xs text-slate-200">
                      {challenge.players.map((player, idx) => (
                        <span
                          key={idx}
                          className="border border-white/10 bg-white/5 px-2.5 py-1"
                        >
                          {player}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="border border-white/10 bg-black/40 p-8 text-center font-mono text-xs uppercase tracking-[0.18em] text-slate-400">
                No active registered challenges found. Register your squad for an upcoming scrim or tournament!
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
