import React from "react";
import type { Tournament } from "../lib/platform-types";
import { TournamentSlotCard } from "./TournamentSlotCard";
import { X } from "lucide-react";

interface TournamentDetailModalProps {
  tournament: Tournament | null;
  open: boolean;
  onClose: () => void;
}

export function TournamentDetailModal({
  tournament,
  open,
  onClose,
}: TournamentDetailModalProps) {
  if (!open || !tournament) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-3xl rounded-2xl border border-sky-400/30 bg-[#030712] p-6 shadow-2xl space-y-4">
        {/* Close Header */}
        <div className="flex items-center justify-between border-b border-sky-400/20 pb-3">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.2em] text-sky-400">
            Tournament Slot Booking Deck
          </span>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full border border-sky-400/20 bg-slate-900 p-1.5 text-slate-400 hover:border-sky-400 hover:text-white transition"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Slot Card */}
        <TournamentSlotCard tournament={tournament} />
      </div>
    </div>
  );
}
