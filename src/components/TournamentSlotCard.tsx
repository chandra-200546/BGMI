import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import type { Tournament } from "../lib/platform-types";
import { Users, Info, Shield } from "lucide-react";

interface TournamentSlotCardProps {
  tournament: Tournament;
  onViewTeams?: (tournament: Tournament) => void;
  onInfo?: (tournament: Tournament) => void;
  onBookSlot?: (tournament: Tournament) => void;
}

export function TournamentSlotCard({
  tournament,
  onViewTeams,
  onInfo,
  onBookSlot,
}: TournamentSlotCardProps) {
  const { user, openAuthModal } = useAuth();
  const navigate = useNavigate();
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Parse maps into array
  const mapList = Array.isArray(tournament.maps)
    ? tournament.maps
    : (tournament.maps || "Erangel, Miramar")
        .split(",")
        .map((m) => m.trim())
        .filter(Boolean);

  // Timing slots from tournament or default fallback
  const timings = tournament.idpTimings
    ? tournament.idpTimings.split(",").map((t) => t.trim()).filter(Boolean)
    : ["1:23 PM", "1:54 PM", "2:24 PM", "3:02 PM"];

  function handleSlotBooking() {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("lordsesports_pending_tournament_id", tournament.id);
    }
    if (onBookSlot) {
      onBookSlot(tournament);
      return;
    }
    if (!user) {
      openAuthModal();
      return;
    }
    navigate(`/register?tournamentId=${tournament.id}`);
  }

  const feeDisplay =
    typeof tournament.entryFee === "number" && tournament.entryFee > 0
      ? `PAY ₹${tournament.entryFee}`
      : tournament.fee && tournament.fee !== "FREE" && !tournament.fee.includes("0")
      ? `PAY ${tournament.fee}`
      : "FREE";

  return (
    <div className="relative overflow-hidden rounded-xl border border-sky-500/30 bg-[#060c1c] p-5 shadow-2xl transition duration-200 hover:border-sky-400 hover:shadow-sky-900/20">
      {/* Top Header: Title & Badges */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-sky-900/40 pb-4">
        <div>
          <h3 className="font-display text-xl font-extrabold uppercase tracking-wide text-white sm:text-2xl">
            {tournament.name}
          </h3>
          <p className="font-mono text-xs text-slate-400 mt-0.5">
            {tournament.mode} • Prize Pool: <span className="text-green-400 font-bold">{tournament.prize}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded bg-sky-950/80 border border-sky-800/80 px-2.5 py-1 font-mono text-[0.68rem] font-bold text-sky-300 uppercase">
            LOBBY 01
          </span>
          <button
            type="button"
            onClick={() => (onViewTeams ? onViewTeams(tournament) : navigate("/teams"))}
            className="rounded bg-sky-600 hover:bg-sky-500 px-3 py-1 font-mono text-xs font-semibold text-white transition flex items-center gap-1 cursor-pointer"
          >
            <Users className="h-3.5 w-3.5" /> VIEW TEAMS
          </button>
          <button
            type="button"
            onClick={() => (onInfo ? onInfo(tournament) : setShowInfoModal(true))}
            className="rounded bg-sky-600 hover:bg-sky-500 px-3 py-1 font-mono text-xs font-semibold text-white transition flex items-center gap-1 cursor-pointer"
          >
            <Info className="h-3.5 w-3.5" /> INFO
          </button>
        </div>
      </div>

      {/* Media Image Banner if uploaded */}
      {tournament.mediaUrl ? (
        <div className="my-4 overflow-hidden rounded-lg border border-sky-500/30 bg-black p-2">
          <img
            src={tournament.mediaUrl}
            alt={tournament.name}
            className="max-h-[30rem] w-full object-contain mx-auto rounded"
          />
        </div>
      ) : null}

      {/* Middle Grid: IDP Timings & Maps vs Slot Booking */}
      <div className="mt-4 grid gap-6 md:grid-cols-3 md:items-center">
        {/* Left 2 Cols: Timings & Maps */}
        <div className="md:col-span-2 space-y-4">
          {/* IDP Timings */}
          <div>
            <span className="block font-mono text-[0.68rem] font-bold uppercase tracking-wider text-sky-400 mb-1.5">
              IDP TIMINGS
            </span>
            <div className="grid grid-cols-4 gap-2">
              {timings.map((time, idx) => (
                <div
                  key={idx}
                  className="rounded border border-sky-950 bg-slate-900/90 px-2 py-1.5 text-center font-mono text-xs text-slate-200"
                >
                  <span className="block font-semibold">{time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Maps */}
          <div>
            <span className="block font-mono text-[0.68rem] font-bold uppercase tracking-wider text-sky-400 mb-1.5">
              MAP
            </span>
            <div className="grid grid-cols-4 gap-2">
              {mapList.map((mapName, idx) => (
                <div
                  key={idx}
                  className="rounded border border-sky-950 bg-slate-900/90 px-2 py-1.5 text-center font-mono text-[0.68rem] uppercase font-bold text-slate-300 truncate"
                  title={mapName}
                >
                  {mapName}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col: Slot Book & Payment */}
        <div className="flex flex-col items-center justify-center rounded-lg border border-sky-500/20 bg-slate-950/80 p-4 text-center">
          <span className="font-mono text-[0.68rem] font-bold uppercase tracking-wider text-sky-400">
            SLOT BOOK
          </span>
          <div className="my-1.5 font-display text-2xl font-extrabold uppercase text-white">
            {feeDisplay}
          </div>
          <button
            type="button"
            onClick={handleSlotBooking}
            className="w-full rounded-lg bg-sky-500 hover:bg-sky-400 py-2.5 px-4 font-mono text-xs font-bold uppercase tracking-wider text-black shadow-lg shadow-sky-500/20 transition duration-150 cursor-pointer"
          >
            {user ? "BOOK SLOT →" : "LOGIN"}
          </button>
        </div>
      </div>

      {/* Info Modal Popup */}
      {showInfoModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
          <div className="w-full max-w-lg rounded-xl border border-sky-400/40 bg-slate-950 p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-sky-400/20 pb-3">
              <h4 className="font-display text-xl font-bold uppercase text-white flex items-center gap-2">
                <Shield className="h-5 w-5 text-sky-400" /> {tournament.name} Info
              </h4>
              <button
                type="button"
                onClick={() => setShowInfoModal(false)}
                className="font-mono text-xs text-slate-400 hover:text-white"
              >
                ✕
              </button>
            </div>
            <div className="space-y-2 font-mono text-xs text-slate-300">
              <p><strong className="text-sky-400">Mode:</strong> {tournament.mode}</p>
              <p><strong className="text-sky-400">Prize Pool:</strong> {tournament.prize}</p>
              <p><strong className="text-sky-400">Entry Fee:</strong> {tournament.fee}</p>
              <p><strong className="text-sky-400">Slots:</strong> {tournament.registered} / {tournament.slots} Registered</p>
              <p><strong className="text-sky-400">Maps:</strong> {mapList.join(", ")}</p>
              <p><strong className="text-sky-400">Rules:</strong> Standard BGMI Esport Point System applies. Emulator strictly prohibited.</p>
            </div>
            <button
              type="button"
              onClick={() => setShowInfoModal(false)}
              className="w-full rounded bg-sky-500 py-2 font-mono text-xs font-bold uppercase text-black"
            >
              Close
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}
