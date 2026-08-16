import React, { useState } from "react";
import {
  CalendarDays,
  Crown,
  Flame,
  HelpCircle,
  Shield,
  Swords,
  Trophy,
  Users,
  Swords as SwordsIcon,
  Sparkles,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { usePlatformData } from "../lib/shared-ui";
import type { Tournament } from "../lib/platform-types";
import { TournamentSlotCard } from "../components/TournamentSlotCard";
import { TournamentDetailModal } from "../components/TournamentDetailModal";

const categories = [
  {
    number: "01",
    title: "Weekend War Championship",
    subtitle: "Major Prize Pool Arena",
    desc: "Official weekend tournament with caster coverage, live drop locations, and verified prize payouts.",
    route: "/weekend-war",
    badge: "MAJOR TOURNAMENT",
    icon: Crown,
    highlight: "₹50,000 Prize Pool",
  },
  {
    number: "02",
    title: "Daily Grind Scrims",
    subtitle: "Tier 1 & 2 Practice Lobbies",
    desc: "Fast-paced daily practice matches with 4 slot windows, live map rotations, and protected room keys.",
    route: "/daily-grind",
    badge: "DAILY SCRIMS",
    icon: Flame,
    highlight: "4 Slots Daily",
  },
  {
    number: "03",
    title: "Daily Scrim Points Table + MVP",
    subtitle: "Real-Time Leaderboard & Frag Slayers",
    desc: "Live placement points + finish points calculation. Search squads, view trend badges, and track top MVPs.",
    route: "/points-table",
    badge: "LIVE STANDINGS",
    icon: Trophy,
    highlight: "Auto Calculated",
  },
  {
    number: "04",
    title: "Weekly & Weekend Points Table",
    subtitle: "Aggregate Tournament Standings",
    desc: "Cumulative weekly standings table with top frag slayer player cards, damage stats, and WWCD counts.",
    route: "/weekly-points",
    badge: "CUMULATIVE",
    icon: Swords,
    highlight: "Top Frag Slayers",
  },
  {
    number: "05",
    title: "Elite Series Registration",
    subtitle: "Squad Lock & Comms Channel",
    desc: "Registration pipeline for team captains: Squad Profile -> Captain Details -> Roster -> Payment proof screenshot.",
    route: "/register",
    badge: "REGISTRATION",
    icon: Shield,
    highlight: "Squad Lock",
  },
  {
    number: "06",
    title: "Team & Member Directory",
    subtitle: "Featured Squads & Player Profiles",
    desc: "Directory of registered squads with preferred drop locations, regions, and captain handles.",
    route: "/teams",
    badge: "HALL OF FAME",
    icon: Users,
    highlight: "Squad Directory",
  },
  {
    number: "07",
    title: "Special Scrim Lobbies",
    subtitle: "Room Release Vault & Check-ins",
    desc: "Upcoming match schedule cards, lobby timings, group stages, and protected room credential releases.",
    route: "/schedule",
    badge: "MATCH VAULT",
    icon: CalendarDays,
    highlight: "Protected Keys",
  },
  {
    number: "08",
    title: "Rules & Support Desk",
    subtitle: "Fair Play & Contact",
    desc: "Review official battle-royale rules, emulator policies, support numbers, and organizer contact details.",
    route: "/terms",
    badge: "SUPPORT DESK",
    icon: HelpCircle,
    highlight: "Official Policies",
  },
];

function NormalTournamentCard({
  tournament,
  onOpenDetails,
}: {
  tournament: Tournament;
  onOpenDetails: (t: Tournament) => void;
}) {
  return (
    <div
      onClick={() => onOpenDetails(tournament)}
      className="group relative flex flex-col justify-between border border-sky-400/30 bg-slate-950 p-5 transition hover:border-sky-400 hover:bg-sky-950/20 cursor-pointer rounded-xl shadow-xl"
    >
      <div>
        {/* Media Image Banner if uploaded by admin */}
        {tournament.mediaUrl ? (
          <div className="relative mb-4 overflow-hidden border border-sky-400/20 rounded-lg max-h-52">
            <img
              src={tournament.mediaUrl}
              alt={tournament.name}
              className="h-48 w-full object-cover transition duration-300 group-hover:scale-105"
            />
          </div>
        ) : null}

        {/* Badges & Status */}
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <span className="border border-sky-400/40 bg-sky-500/10 px-2.5 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.18em] text-sky-300 rounded">
            {tournament.status}
          </span>
          <span className="font-mono text-xs font-bold uppercase tracking-[0.16em] text-green-400">
            Prize: {tournament.prize}
          </span>
        </div>

        {/* Tournament Title & Details */}
        <h3 className="mt-4 font-display text-3xl font-bold uppercase leading-tight text-white group-hover:text-sky-300">
          {tournament.name}
        </h3>

        <div className="mt-3 space-y-1.5 font-mono text-xs text-slate-300">
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-slate-400">Entry Fee:</span>
            <span className="font-bold text-white">{tournament.fee}</span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-slate-400">Slots Filled:</span>
            <span className="font-bold text-sky-300">
              {tournament.registered} / {tournament.slots} Squads
            </span>
          </div>
          <div className="flex justify-between border-b border-white/5 pb-1">
            <span className="text-slate-400">Map & Mode:</span>
            <span className="font-bold text-slate-200">
              {tournament.map} ({tournament.mode})
            </span>
          </div>
        </div>
      </div>

      {/* Primary Action CTA */}
      <div className="mt-6 border-t border-white/10 pt-4">
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onOpenDetails(tournament);
          }}
          className="flex w-full items-center justify-center gap-2 rounded border border-sky-400 bg-sky-500/20 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-white transition hover:bg-sky-400 hover:text-black cursor-pointer"
        >
          <SwordsIcon className="h-4 w-4" />
          View Details & Book Slot →
        </button>
      </div>
    </div>
  );
}

export function HomePage() {
  const { user, openAuthModal } = useAuth();
  const { data } = usePlatformData();
  const navigate = useNavigate();

  const [selectedTournament, setSelectedTournament] = useState<Tournament | null>(null);
  const tournaments = data?.tournaments ?? [];

  function handleJoinChallenge(tournament: Tournament) {
    if (!user) {
      openAuthModal();
      return;
    }
    navigate(`/register?tournamentId=${tournament.id}`);
  }

  return (
    <div className="pt-24 pb-16 px-4 lg:px-8 max-w-7xl mx-auto space-y-16">
      {/* 1. REAL-TIME ACTIVE CHALLENGES SECTION */}
      {tournaments.length > 0 ? (
        <section className="border-b border-sky-400/20 pb-12">
          <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between mb-8">
            <div>
              <span className="flex items-center gap-2 font-mono text-xs font-bold uppercase tracking-[0.24em] text-sky-400">
                <Sparkles className="h-4 w-4 text-sky-400" /> Live Tournament Deck
              </span>
              <h2 className="mt-1 font-display text-4xl font-bold uppercase text-white md:text-6xl">
                Active Challenges Arena
              </h2>
            </div>
            <p className="font-mono text-xs text-slate-400 max-w-md">
              Select any live challenge below to lock your squad, upload payment proof, and compete for prize pools.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tournaments.map((t) => (
              <NormalTournamentCard
                key={t.id}
                tournament={t}
                onOpenDetails={(selected) => setSelectedTournament(selected)}
              />
            ))}
          </div>

          <TournamentDetailModal
            tournament={selectedTournament}
            open={Boolean(selectedTournament)}
            onClose={() => setSelectedTournament(null)}
          />
        </section>
      ) : null}

      {/* 2. CATEGORY INDEX SECTION */}
      <div>
        <div className="mb-12 border-b border-sky-400/20 pb-6">
          <span className="font-mono text-xs font-bold uppercase tracking-[0.24em] text-sky-400">
            Official Category Index
          </span>
          <h2 className="mt-2 font-display text-5xl font-bold uppercase text-white md:text-7xl">
            LordsEsports BGMI Arena
          </h2>
          <p className="mt-2 font-mono text-xs text-slate-400 max-w-2xl">
            Select a category below to access registered lobbies, dedicated standings, squad registration, or official tournament rules.
          </p>
        </div>

        {/* Grid of 8 Numbered Category Cards */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <Link
                key={cat.number}
                to={cat.route}
                className="group relative flex flex-col justify-between border border-sky-400/25 bg-slate-950 p-6 transition hover:border-sky-400 hover:bg-sky-950/20"
              >
                <div>
                  {/* Header: Number & Badge */}
                  <div className="flex items-center justify-between border-b border-white/10 pb-3">
                    <span className="font-display text-3xl font-bold text-sky-400">
                      {cat.number}
                    </span>
                    <span className="border border-sky-400/40 bg-sky-500/10 px-2 py-0.5 font-mono text-[0.62rem] font-bold uppercase tracking-[0.18em] text-sky-300">
                      {cat.badge}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="mt-5">
                    <Icon className="h-8 w-8 text-sky-400 transition group-hover:scale-110" />
                    <h3 className="mt-3 font-display text-3xl font-bold uppercase leading-tight text-white group-hover:text-sky-300">
                      {cat.title}
                    </h3>
                    <p className="mt-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-sky-300">
                      {cat.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="mt-4 font-mono text-xs leading-relaxed text-slate-400">
                    {cat.desc}
                  </p>
                </div>

                {/* Footer: Highlight tag */}
                <div className="mt-6 border-t border-white/10 pt-3">
                  <span className="font-mono text-[0.65rem] font-bold uppercase tracking-[0.2em] text-sky-300">
                    {cat.highlight} →
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
