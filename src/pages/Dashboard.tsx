import { useEffect, useState } from "react";
import { Clock, KeyRound, LogOut, ShieldAlert, User, Trophy } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth, type RegisteredChallenge } from "../lib/auth-context";
import { isSupabaseConfigured, supabase } from "../lib/supabase";
import { Section, usePlatformData } from "../lib/shared-ui";

export function DashboardPage() {
  const { user, userChallenges, logout } = useAuth();
  const { data: platformData } = usePlatformData();
  const navigate = useNavigate();

  const [dbChallenges, setDbChallenges] = useState<RegisteredChallenge[]>([]);
  const [loadingDb, setLoadingDb] = useState(false);

  // Check if there are any active / available tournaments to register for
  const availableTournaments = (platformData?.tournaments ?? []).filter(
    (t) => t.status !== "Completed" && t.status !== "FINISHED"
  );
  const hasAvailableChallenge = availableTournaments.length > 0;

  // Real-time synchronization of user's registered challenges from Supabase database
  useEffect(() => {
    if (!user?.email || !isSupabaseConfigured()) return;

    let isMounted = true;
    async function fetchUserRegistrations() {
      setLoadingDb(true);
      try {
        const { data: submissions, error } = await supabase
          .from("registration_submissions")
          .select("*")
          .eq("captain_email", user.email);

        if (!error && submissions && isMounted) {
          const mapped: RegisteredChallenge[] = submissions.map((sub) => {
            let playerList: string[] = [];
            if (Array.isArray(sub.players)) playerList = sub.players.map(String);
            else if (typeof sub.players === "string") {
              try {
                const parsed = JSON.parse(sub.players) as unknown;
                playerList = Array.isArray(parsed) ? parsed.map(String) : sub.players.split(",");
              } catch {
                playerList = sub.players.split(",");
              }
            }

            // Find matching tournament from platformData
            const tMatch = platformData.tournaments.find((t) => t.id === sub.tournament_id);

            return {
              id: sub.id,
              tournamentId: sub.tournament_id || "t1",
              tournamentName: tMatch?.name || "BGMI Championship Challenge",
              teamName: sub.team_name,
              captainName: sub.captain_name,
              captainEmail: sub.captain_email,
              bgmiUid: sub.bgmi_uid,
              players: playerList,
              status: (sub.status as RegisteredChallenge["status"]) || "UNDER_REVIEW",
              paymentStatus: sub.payment_file_name ? "PAID" : "PENDING_VERIFICATION",
              entryFee: tMatch?.fee || "₹500",
              registeredAt: sub.created_at,
              matchTime: tMatch?.starts || "Matches Scheduled Today",
              roomDetails: tMatch
                ? { roomId: (tMatch as any).roomId, password: (tMatch as any).roomPassword }
                : undefined,
            };
          });
          setDbChallenges(mapped);
        }
      } catch (err) {
        console.warn("Could not sync user DB registrations:", err);
      } finally {
        if (isMounted) setLoadingDb(false);
      }
    }

    void fetchUserRegistrations();

    return () => {
      isMounted = false;
    };
  }, [user?.email, platformData]);

  // Combine DB challenges and local state challenges (avoiding duplicates)
  const allUserChallenges = [...dbChallenges];
  userChallenges.forEach((localCh) => {
    if (
      !allUserChallenges.some(
        (dbCh) =>
          dbCh.id === localCh.id ||
          (dbCh.teamName === localCh.teamName && dbCh.tournamentId === localCh.tournamentId)
      )
    ) {
      allUserChallenges.push(localCh);
    }
  });

  if (!user) {
    return (
      <div className="pt-28 pb-16 px-4">
        <Section eyebrow="Authentication Required" title="Player Dashboard">
          <div className="border border-sky-400/40 bg-slate-950 max-w-xl p-8 text-center mx-auto">
            <User className="mx-auto h-14 w-14 text-sky-400" />
            <h3 className="mt-4 font-display text-4xl font-bold uppercase text-white">
              Access Restricted
            </h3>
            <p className="mt-2 font-mono text-xs text-slate-300">
              Please login with your Google account to view your registered battles, challenges, and room credentials.
            </p>
            <div className="mt-6 flex justify-center gap-4">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="border border-sky-400/60 bg-sky-500/20 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white hover:bg-sky-400 hover:text-black transition"
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
    <div className="pt-24 pb-16 px-4 max-w-7xl mx-auto">
      <Section eyebrow="Player Command Center" title="My Dashboard">
        {/* Profile Card Header */}
        <div className="border border-sky-400/30 bg-slate-950 p-6 md:p-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-4">
              {user.avatarUrl ? (
                <img
                  src={user.avatarUrl}
                  alt={user.name}
                  className="h-14 w-14 rounded-full border-2 border-sky-400 object-cover"
                />
              ) : (
                <span className="grid h-14 w-14 place-items-center border border-sky-400/60 bg-sky-500/10 text-sky-400">
                  <User className="h-7 w-7" />
                </span>
              )}
              <div>
                <h3 className="font-display text-4xl font-bold uppercase text-white">
                  {user.name}
                </h3>
                <p className="font-mono text-xs uppercase tracking-[0.18em] text-sky-400 font-bold">
                  {user.email}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Only show Register for Challenge button when an active challenge/tournament exists */}
              {hasAvailableChallenge ? (
                <Link to="/register">
                  <button
                    type="button"
                    className="border border-sky-400/60 bg-sky-500/20 px-4 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white transition hover:bg-sky-400 hover:text-black"
                  >
                    + Register For Challenge
                  </button>
                </Link>
              ) : null}

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
              My Registered Battles & Challenges ({allUserChallenges.length})
            </h4>
            <span className="font-mono text-xs uppercase tracking-[0.2em] text-sky-400 font-bold">
              Live Real-Time Tracker
            </span>
          </div>

          <div className="mt-6 grid gap-6">
            {allUserChallenges.length > 0 ? (
              allUserChallenges.map((challenge) => (
                <div
                  key={challenge.id}
                  className="border border-sky-400/25 bg-slate-950 p-6 transition hover:border-sky-400"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="border border-sky-400/40 bg-sky-500/10 px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-sky-300">
                          {challenge.tournamentName}
                        </span>
                        <span
                          className={`border px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] ${
                            challenge.status === "APPROVED"
                              ? "border-green-400/40 bg-green-500/10 text-green-200"
                              : challenge.status === "REJECTED"
                              ? "border-red-400/40 bg-red-500/10 text-red-200"
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
                      <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.18em] text-sky-400 font-bold">
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
                </div>
              ))
            ) : (
              <div className="border border-dashed border-sky-400/30 bg-slate-950 p-8 text-center">
                <Trophy className="mx-auto h-12 w-12 text-sky-400/60" />
                <h4 className="mt-3 font-display text-2xl font-bold uppercase text-white">
                  No Active Challenges Registered
                </h4>
                <p className="mt-1 font-mono text-xs text-slate-400 max-w-md mx-auto">
                  {hasAvailableChallenge
                    ? "You haven't registered for any active tournament challenges yet. Click '+ Register For Challenge' above to lock your squad!"
                    : "There are currently no active challenges open for registration. Check back when an organizer creates a new challenge tournament!"}
                </p>
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}
