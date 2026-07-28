import { useQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import {
  Activity,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronRight,
  ClipboardCheck,
  Crown,
  Database,
  Download,
  FileText,
  Filter,
  Gamepad2,
  Gauge,
  Image,
  Lock,
  MapPinned,
  Menu,
  MessageCircle,
  QrCode,
  Search,
  Shield,
  Swords,
  Trophy,
  Upload,
  Users,
  Video,
  X,
  Zap,
} from "lucide-react";
import {
  useMemo,
  useState,
  type ComponentType,
  type CSSProperties,
  type ReactNode,
  type SVGProps,
} from "react";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import {
  emptyPlatformData,
  totalPoints,
  type PlatformData,
  type Team,
} from "../lib/platform-types";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NexBattles BGMI - Live Esports Tournament Platform" },
      {
        name: "description",
        content:
          "Live PostgreSQL-backed BGMI esports tournament management with real-time leaderboards, schedules, registration, dashboards, and admin operations.",
      },
      { property: "og:title", content: "NexBattles BGMI - Live Tournament Command Center" },
      {
        property: "og:description",
        content:
          "A futuristic esports command center powered by database-backed tournament data and live refresh.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BgmiTournamentApp,
});

type Icon = ComponentType<SVGProps<SVGSVGElement>>;

const placementPoints: Record<number, number> = { 1: 10, 2: 6, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1, 8: 1 };

async function fetchPlatformData(): Promise<PlatformData> {
  const response = await fetch("/api/public/live", { cache: "no-store" });
  if (!response.ok) throw new Error("Unable to load live tournament data");
  return (await response.json()) as PlatformData;
}

function usePlatformData() {
  return useQuery({
    queryKey: ["platform-live-data"],
    queryFn: fetchPlatformData,
    refetchInterval: 5000,
    refetchIntervalInBackground: true,
    staleTime: 2500,
    placeholderData: emptyPlatformData,
  });
}

function Card({
  children,
  className = "",
  id,
}: {
  children: ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <div id={id} className={`glass-panel ${className}`}>
      {children}
    </div>
  );
}

function Stat({ label, value, icon: IconComponent }: { label: string; value: string; icon: Icon }) {
  return (
    <Card className="p-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-slate-400">{label}</p>
          <p className="mt-2 text-2xl font-black text-white">{value}</p>
        </div>
        <span className="grid h-11 w-11 place-items-center rounded-md border border-cyan-300/30 bg-cyan-300/10 text-cyan-200">
          <IconComponent className="h-5 w-5" />
        </span>
      </div>
    </Card>
  );
}

function StatusBadge({ status }: { status: string }) {
  const color =
    status === "Live"
      ? "border-red-400/50 bg-red-500/15 text-red-200"
      : status === "Registration Open"
        ? "border-emerald-400/50 bg-emerald-400/15 text-emerald-200"
        : status === "Closing Soon"
          ? "border-amber-300/50 bg-amber-300/15 text-amber-100"
          : "border-slate-400/40 bg-slate-400/10 text-slate-200";
  return (
    <span
      className={`rounded-sm border px-2 py-1 text-[0.68rem] font-bold uppercase tracking-[0.16em] ${color}`}
    >
      {status}
    </span>
  );
}

function LiveDataBanner({ data, isFetching }: { data: PlatformData; isFetching: boolean }) {
  const live = data.source === "database" || data.source === "supabase";
  const label = data.source === "supabase" ? "Supabase live connected" : "Live database connected";
  return (
    <div
      className={`rounded-md border px-4 py-3 text-sm ${
        live
          ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-100"
          : "border-amber-300/40 bg-amber-300/10 text-amber-100"
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="flex items-center gap-2 font-bold">
          <span className={`h-2 w-2 rounded-full ${live ? "bg-emerald-300" : "bg-amber-300"}`} />
          {live ? label : "Database setup required"}
        </span>
        <span className="font-mono text-xs uppercase tracking-[0.16em] opacity-80">
          {isFetching ? "Syncing..." : `Updated ${new Date(data.generatedAt).toLocaleTimeString()}`}
        </span>
      </div>
      {!live && data.message ? <p className="mt-2 text-xs opacity-90">{data.message}</p> : null}
    </div>
  );
}

function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <Card className="p-8 text-center">
      <Database className="mx-auto h-10 w-10 text-cyan-200" />
      <h3 className="mt-4 text-xl font-black uppercase text-white">{title}</h3>
      <p className="mx-auto mt-2 max-w-xl text-sm leading-6 text-slate-400">{body}</p>
    </Card>
  );
}

function AppNav() {
  const [open, setOpen] = useState(false);
  const links = [
    "Tournaments",
    "Register",
    "Leaderboard",
    "Schedule",
    "Teams",
    "Rules",
    "Gallery",
    "Admin",
  ];
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#070912]/85 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3 lg:px-6">
        <a href="#home" className="flex items-center gap-3">
          <span className="relative grid h-11 w-11 place-items-center overflow-hidden rounded-md border border-cyan-300/40 bg-cyan-300/10 text-cyan-100 shadow-[0_0_28px_rgba(34,211,238,0.22)]">
            <Swords className="h-5 w-5" />
          </span>
          <div>
            <p className="text-lg font-black uppercase leading-none tracking-[0.12em] text-white">
              NexBattles
            </p>
            <p className="text-[0.62rem] font-bold uppercase tracking-[0.25em] text-cyan-300">
              BGMI Command
            </p>
          </div>
        </a>
        <nav className="ml-auto hidden items-center gap-5 lg:flex">
          {links.map((link) => (
            <a
              key={link}
              href={`#${link.toLowerCase()}`}
              className="text-xs font-bold uppercase tracking-[0.16em] text-slate-300 hover:text-cyan-200"
            >
              {link}
            </a>
          ))}
        </nav>
        <button className="relative grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/5 text-slate-100">
          <Bell className="h-4 w-4" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-red-400" />
        </button>
        <a
          href="#register"
          className="hidden rounded-md bg-cyan-300 px-4 py-2 text-sm font-black uppercase tracking-[0.12em] text-[#061019] shadow-[0_0_28px_rgba(34,211,238,0.28)] sm:inline-flex"
        >
          Register
        </a>
        <button
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/5 text-white lg:hidden"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open ? (
        <div className="border-t border-white/10 bg-[#070912] px-4 py-4 lg:hidden">
          <div className="grid gap-2">
            {links.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase()}`}
                onClick={() => setOpen(false)}
                className="rounded-md border border-white/10 bg-white/5 px-3 py-3 text-sm font-bold uppercase tracking-[0.14em] text-slate-200"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      ) : null}
    </header>
  );
}

function GamingAnimationLayer() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="scanline" />
      <div className="reticle reticle-a" />
      <div className="reticle reticle-b" />
      <div className="drop-marker drop-a">DROP</div>
      <div className="drop-marker drop-b">ZONE</div>
      <div className="tracer tracer-a" />
      <div className="tracer tracer-b" />
      <div className="tracer tracer-c" />
      <div className="hud-sweep" />
      <div className="particle-field">
        {Array.from({ length: 18 }).map((_, index) => (
          <span key={index} style={{ "--i": index } as CSSProperties} />
        ))}
      </div>
    </div>
  );
}

function Hero({ data, isFetching }: { data: PlatformData; isFetching: boolean }) {
  const topTeams = data.teams.slice(0, 5);
  const totalPrize = data.tournaments.length > 0 ? data.tournaments[0].prize : "DB pending";
  const registered = data.tournaments.reduce((sum, item) => sum + item.registered, 0);
  const slots = data.tournaments.reduce((sum, item) => sum + item.slots, 0);

  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[url('/assets/battle-arena-hero.png')] bg-cover bg-center opacity-70" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,#05060c_0%,rgba(5,6,12,.88)_36%,rgba(5,6,12,.42)_100%)]" />
      <div className="grid-overlay absolute inset-0 opacity-35" />
      <GamingAnimationLayer />
      <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-6">
        <div className="relative z-10">
          <LiveDataBanner data={data} isFetching={isFetching} />
          <div className="mt-6 inline-flex items-center gap-2 rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
            <Activity className="h-4 w-4" /> Real-time tournament feed
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-normal text-white md:text-7xl xl:text-8xl">
            <span className="glitch-title" data-text="Live BGMI esports command center.">
              Live BGMI esports command center.
            </span>
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Database-backed tournaments, registrations, rosters, room releases, check-ins, results,
            leaderboards, notifications, and admin operations with live refresh.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#register" className="neon-button">
              Register Your Team <ChevronRight className="h-4 w-4" />
            </a>
            <a href="#leaderboard" className="ghost-button">
              View Live Standings
            </a>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Prize pool" value={totalPrize} icon={Trophy} />
            <Stat label="Teams" value={`${registered}/${slots || 0}`} icon={Users} />
            <Stat label="Events" value={String(data.tournaments.length)} icon={CalendarDays} />
            <Stat
              label="Live sync"
              value={data.source === "database" || data.source === "supabase" ? "5 sec" : "Waiting"}
              icon={Zap}
            />
          </div>
        </div>
        <div className="relative z-10">
          <Card className="hud-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                  Live Leaderboard Feed
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase text-white">
                  {data.tournaments.find((item) => item.status === "Live")?.name ??
                    "Awaiting Live Tournament"}
                </h2>
              </div>
              <StatusBadge
                status={
                  data.source === "database" || data.source === "supabase" ? "Live" : "DB Pending"
                }
              />
            </div>
            {topTeams.length > 0 ? (
              <div className="mt-5 overflow-hidden rounded-md border border-white/10">
                {topTeams.map((team) => (
                  <div
                    key={team.name}
                    className="grid grid-cols-[40px_1fr_auto] items-center gap-3 border-b border-white/10 bg-white/[0.03] px-3 py-3 last:border-b-0"
                  >
                    <Rank rank={team.rank} />
                    <TeamIdentity team={team} />
                    <p className="text-xl font-black text-cyan-200">{totalPoints(team)}</p>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No leaderboard rows"
                body="Seed PostgreSQL with approved teams and results to activate the live standings feed."
              />
            )}
          </Card>
        </div>
      </div>
    </section>
  );
}

function Tournaments({ data }: { data: PlatformData }) {
  const [filter, setFilter] = useState("All");
  const visible =
    filter === "All" ? data.tournaments : data.tournaments.filter((item) => item.status === filter);
  return (
    <Section
      id="tournaments"
      eyebrow="Live tournament discovery"
      title="Tournament cards powered by PostgreSQL, not local demo arrays."
    >
      <div className="mb-6 flex flex-wrap gap-2">
        {["All", "Registration Open", "Closing Soon", "Live", "Completed"].map((item) => (
          <button
            key={item}
            onClick={() => setFilter(item)}
            className={`rounded-md border px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] ${filter === item ? "border-cyan-300 bg-cyan-300 text-slate-950" : "border-white/10 bg-white/5 text-slate-300"}`}
          >
            {item}
          </button>
        ))}
      </div>
      {visible.length === 0 ? (
        <EmptyState
          title="No tournaments in database"
          body="Create tournaments from the admin dashboard or run the Prisma seed script. This screen intentionally does not use static placeholder data."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-3">
          {visible.map((tournament) => (
            <Card key={tournament.id} className="group overflow-hidden">
              <div className={`relative h-36 bg-gradient-to-br ${tournament.accent}`}>
                <div className="grid-overlay absolute inset-0 opacity-40" />
                <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
                  <Gamepad2 className="h-10 w-10 text-white" />
                  <StatusBadge status={tournament.status} />
                </div>
              </div>
              <div className="p-5">
                <h3 className="text-2xl font-black uppercase text-white">{tournament.name}</h3>
                <p className="mt-2 text-sm text-slate-400">
                  {tournament.mode} - {tournament.map}
                </p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <MiniMetric label="Prize" value={tournament.prize} />
                  <MiniMetric label="Entry" value={tournament.fee} />
                  <MiniMetric
                    label="Slots"
                    value={`${tournament.registered}/${tournament.slots}`}
                  />
                  <MiniMetric label="Start" value={tournament.starts} />
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-cyan-300"
                    style={{ width: `${(tournament.registered / tournament.slots) * 100}%` }}
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </Section>
  );
}

function MiniMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-md border border-white/10 bg-black/20 p-3">
      <p className="text-[0.65rem] uppercase tracking-[0.18em] text-slate-400">{label}</p>
      <p className="mt-1 text-lg font-black text-white">{value}</p>
    </div>
  );
}

function Registration() {
  const steps = ["Tournament", "Team", "Captain", "Roster", "Payment", "Review"];
  const [step, setStep] = useState(0);
  return (
    <Section
      id="register"
      eyebrow="Database-ready registration"
      title="Registration forms are structured for server validation, payment proof, rosters, and unique Team IDs."
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-5">
          {steps.map((label, index) => (
            <button
              key={label}
              onClick={() => setStep(index)}
              className={`mb-3 flex w-full items-center gap-3 rounded-md border p-3 text-left ${step === index ? "border-cyan-300 bg-cyan-300/15" : "border-white/10 bg-white/5"}`}
            >
              <span className="grid h-8 w-8 place-items-center rounded-md bg-white/10 text-sm font-black text-white">
                {index + 1}
              </span>
              <span className="font-bold text-white">{label}</span>
              {index < step ? <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-300" /> : null}
            </button>
          ))}
        </Card>
        <Card className="p-5">
          <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">Step {step + 1} of 6</p>
          <h3 className="mt-2 text-2xl font-black uppercase text-white">{steps[step]}</h3>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              "Tournament ID",
              "Team name",
              "Captain UID",
              "Roster UID validation",
              "Payment transaction",
              "Fair-play agreement",
            ].map((field) => (
              <Field key={field} label={field} value="Stored after database submission" />
            ))}
            <Uploader label="Logo / payment proof upload" />
          </div>
          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <button onClick={() => setStep(Math.max(0, step - 1))} className="ghost-button">
              Back
            </button>
            <button
              onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
              className="neon-button"
            >
              {step === steps.length - 1 ? "Submit To Database" : "Continue"}
            </button>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <label className="block">
      <span className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>
      <input
        value={value}
        readOnly
        className="mt-2 w-full rounded-md border border-white/10 bg-black/25 px-3 py-3 text-sm text-white outline-none focus:border-cyan-300"
      />
    </label>
  );
}

function Uploader({ label }: { label: string }) {
  return (
    <div className="rounded-md border border-dashed border-cyan-300/40 bg-cyan-300/5 p-4">
      <Upload className="h-5 w-5 text-cyan-200" />
      <p className="mt-2 text-sm font-bold text-white">{label}</p>
      <p className="text-xs text-slate-400">
        Upload metadata is modeled for Cloudinary/Supabase storage.
      </p>
    </div>
  );
}

function Leaderboard({ data }: { data: PlatformData }) {
  const [query, setQuery] = useState("");
  const filtered = data.teams.filter((team) =>
    team.name.toLowerCase().includes(query.toLowerCase()),
  );
  return (
    <Section
      id="leaderboard"
      eyebrow="Live leaderboard"
      title="Standings refresh every five seconds from the public API."
    >
      <Card className="p-5">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2 rounded-md border border-white/10 bg-black/25 px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search team"
              className="bg-transparent text-sm text-white outline-none placeholder:text-slate-500"
            />
          </div>
          <div className="flex gap-2">
            <button className="ghost-button">
              <Filter className="h-4 w-4" /> Phase
            </button>
            <button className="ghost-button">
              <Download className="h-4 w-4" /> Export
            </button>
          </div>
        </div>
        {filtered.length === 0 ? (
          <EmptyState
            title="No leaderboard data"
            body="Publish match results in PostgreSQL to populate ranking, finishes, WWCD, penalties, and form."
          />
        ) : (
          <LeaderboardRows teams={filtered} />
        )}
      </Card>
    </Section>
  );
}

function LeaderboardRows({ teams }: { teams: Team[] }) {
  return (
    <>
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full min-w-[900px] border-collapse text-left">
          <thead>
            <tr className="border-b border-white/10 text-[0.68rem] uppercase tracking-[0.18em] text-slate-400">
              {[
                "Rank",
                "Team",
                "MP",
                "WWCD",
                "Placement",
                "Finishes",
                "Penalty",
                "Total",
                "Form",
              ].map((head) => (
                <th key={head} className="px-3 py-3">
                  {head}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {teams.map((team) => (
              <tr key={team.name} className="border-b border-white/10 text-sm">
                <td className="px-3 py-4">
                  <Rank rank={team.rank} />
                </td>
                <td className="px-3 py-4">
                  <TeamIdentity team={team} />
                </td>
                <td className="px-3 py-4 text-slate-300">{team.matches}</td>
                <td className="px-3 py-4 text-slate-300">{team.wwcd}</td>
                <td className="px-3 py-4 text-slate-300">{team.placement}</td>
                <td className="px-3 py-4 text-slate-300">{team.finishes}</td>
                <td className="px-3 py-4 text-red-200">-{team.penalty}</td>
                <td className="px-3 py-4 text-xl font-black text-cyan-200">{totalPoints(team)}</td>
                <td className="px-3 py-4">
                  <FormPills form={team.form} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="grid gap-3 lg:hidden">
        {teams.map((team) => (
          <div key={team.name} className="rounded-md border border-white/10 bg-white/[0.03] p-4">
            <div className="flex items-center justify-between gap-3">
              <TeamIdentity team={team} />
              <Rank rank={team.rank} />
            </div>
            <div className="mt-4 grid grid-cols-4 gap-2 text-center">
              <MiniMetric label="WWCD" value={String(team.wwcd)} />
              <MiniMetric label="Fin" value={String(team.finishes)} />
              <MiniMetric label="Pen" value={`-${team.penalty}`} />
              <MiniMetric label="Total" value={String(totalPoints(team))} />
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

function Rank({ rank }: { rank: number }) {
  return (
    <span
      className={`grid h-9 w-9 place-items-center rounded-md font-black ${rank === 1 ? "bg-amber-300 text-black shadow-[0_0_18px_rgba(252,211,77,0.45)]" : rank === 2 ? "bg-slate-300 text-black" : rank === 3 ? "bg-orange-400 text-black" : "bg-white/10 text-white"}`}
    >
      {rank}
    </span>
  );
}

function TeamIdentity({ team }: { team: Team }) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-10 w-10 place-items-center rounded-md border border-cyan-300/30 bg-cyan-300/10 text-xs font-black text-cyan-100">
        {team.short}
      </span>
      <div>
        <p className="font-bold text-white">{team.name}</p>
        <p className="text-xs text-slate-400">
          {team.region} - Captain {team.captain}
        </p>
      </div>
    </div>
  );
}

function FormPills({ form }: { form: string[] }) {
  return (
    <div className="flex gap-1">
      {form.map((item, index) => (
        <span
          key={`${item}-${index}`}
          className="grid h-7 w-7 place-items-center rounded-sm bg-white/10 text-[0.68rem] font-bold text-slate-200"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

function ScheduleAndRooms({ data }: { data: PlatformData }) {
  return (
    <Section
      id="schedule"
      eyebrow="Match control"
      title="Schedules and room-release state are loaded from database matches."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5">
          {data.schedules.length === 0 ? (
            <EmptyState
              title="No match schedule"
              body="Add Match rows to PostgreSQL to show phases, maps, room release status, and check-in windows."
            />
          ) : (
            <div className="space-y-3">
              {data.schedules.map((item) => (
                <div
                  key={`${item.match}-${item.date}`}
                  className="grid gap-3 rounded-md border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_auto_auto] md:items-center"
                >
                  <div>
                    <p className="font-black uppercase text-white">{item.match}</p>
                    <p className="text-sm text-slate-400">
                      {item.date} - {item.time} - {item.group}
                    </p>
                  </div>
                  <span className="text-sm font-bold text-cyan-200">{item.map}</span>
                  <StatusBadge status={item.status} />
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-cyan-200" />
            <h3 className="text-xl font-black uppercase text-white">Room Vault</h3>
          </div>
          <p className="mt-4 text-sm leading-6 text-slate-400">
            Room credentials live in the `MatchRoom` table and are never exposed through public
            APIs. Approved captains receive them only after `releaseAt`.
          </p>
          <div className="mt-5 rounded-md border border-emerald-300/30 bg-emerald-300/10 p-4">
            <QrCode className="h-8 w-8 text-emerald-200" />
            <p className="mt-2 font-bold text-white">QR check-in modeled</p>
            <p className="text-sm text-slate-400">
              Every team and match has a unique check-in token.
            </p>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function Dashboard({ data }: { data: PlatformData }) {
  const topTeam = data.teams[0];
  return (
    <Section
      id="teams"
      eyebrow="Captain dashboard"
      title="Captain and team views consume the same live ranking and registration models."
    >
      <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
        <Card className="p-4">
          {[
            "Overview",
            "Registration",
            "Team Profile",
            "Roster",
            "Match Schedule",
            "Room Details",
            "Results",
            "Penalties",
            "Notifications",
            "Downloads",
            "Transfers",
            "Settings",
          ].map((item, index) => (
            <button
              key={item}
              className={`mb-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-sm font-bold ${index === 0 ? "bg-cyan-300 text-slate-950" : "bg-white/5 text-slate-300"}`}
            >
              <Gauge className="h-4 w-4" /> {item}
            </button>
          ))}
        </Card>
        <div className="grid gap-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Team" value={topTeam?.short ?? "None"} icon={Shield} />
            <Stat label="Current rank" value={topTeam ? `#${topTeam.rank}` : "DB"} icon={Crown} />
            <Stat
              label="Total points"
              value={topTeam ? String(totalPoints(topTeam)) : "0"}
              icon={Zap}
            />
            <Stat label="WWCD" value={topTeam ? String(topTeam.wwcd) : "0"} icon={Trophy} />
          </div>
          <Card className="p-5">
            <h3 className="text-xl font-black uppercase text-white">Registration Timeline</h3>
            <div className="mt-5 grid gap-3 md:grid-cols-5">
              {["Draft", "Submitted", "Under Review", "Payment Verified", "Approved"].map(
                (item) => (
                  <div
                    key={item}
                    className="rounded-md border border-emerald-300/30 bg-emerald-300/10 p-3"
                  >
                    <CheckCircle2 className="h-5 w-5 text-emerald-200" />
                    <p className="mt-2 text-sm font-bold text-white">{item}</p>
                  </div>
                ),
              )}
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}

function DropMapAndStats({ data }: { data: PlatformData }) {
  const chartData = data.teams
    .slice(0, 6)
    .map((team) => ({ name: team.short, points: totalPoints(team), finishes: team.finishes }));
  const pieData = [
    { name: "Erangel", value: data.schedules.filter((item) => item.map === "Erangel").length || 1 },
    { name: "Miramar", value: data.schedules.filter((item) => item.map === "Miramar").length || 1 },
    { name: "Sanhok", value: data.schedules.filter((item) => item.map === "Sanhok").length || 1 },
    { name: "Vikendi", value: data.schedules.filter((item) => item.map === "Vikendi").length || 1 },
  ];
  return (
    <Section
      id="statistics"
      eyebrow="Strategy and analytics"
      title="Animated drop map and charts render from live teams and schedules."
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="relative min-h-[430px] overflow-hidden p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.16),transparent_22%),radial-gradient(circle_at_70%_60%,rgba(244,63,94,0.14),transparent_25%)]" />
          <div className="grid-overlay absolute inset-0 opacity-40" />
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-xl font-black uppercase text-white">Live Drop Map</h3>
            <MapPinned className="h-5 w-5 text-cyan-200" />
          </div>
          {data.teams.slice(0, 10).map((team, index) => (
            <div
              key={team.name}
              className="absolute rounded-md border border-cyan-300/40 bg-cyan-300/15 px-2 py-1 text-xs font-black text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.24)]"
              style={{ left: `${12 + ((index * 13) % 72)}%`, top: `${22 + ((index * 17) % 58)}%` }}
            >
              {team.short} <span className="text-slate-300">{team.drop}</span>
            </div>
          ))}
        </Card>
        <div className="grid gap-5">
          <Card className="p-5">
            <h3 className="text-xl font-black uppercase text-white">Points Progression</h3>
            <div className="mt-4 h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={chartData}>
                  <CartesianGrid stroke="rgba(255,255,255,.08)" />
                  <XAxis dataKey="name" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      background: "#080b14",
                      border: "1px solid rgba(255,255,255,.12)",
                      color: "#fff",
                    }}
                  />
                  <Bar dataKey="points" fill="#22d3ee" radius={[4, 4, 0, 0]} />
                  <Bar dataKey="finishes" fill="#d946ef" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
          <div className="grid gap-5 md:grid-cols-2">
            <Card className="p-5">
              <h3 className="text-lg font-black uppercase text-white">Map Distribution</h3>
              <div className="mt-4 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie data={pieData} innerRadius={48} outerRadius={78} dataKey="value">
                      {["#22d3ee", "#d946ef", "#f43f5e", "#a3e635"].map((color) => (
                        <Cell key={color} fill={color} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#080b14",
                        border: "1px solid rgba(255,255,255,.12)",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="text-lg font-black uppercase text-white">Scoring Rule</h3>
              <div className="mt-4 grid grid-cols-2 gap-2">
                {Object.entries(placementPoints).map(([place, points]) => (
                  <MiniMetric key={place} label={`${place} place`} value={`${points} pts`} />
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ContentPages({ data }: { data: PlatformData }) {
  const rules = [
    "Eligibility",
    "Team composition",
    "Player verification",
    "Lobby rules",
    "Device rules",
    "Fair-play policy",
    "Point system",
    "Penalty system",
    "Disconnect policy",
    "Protest and appeals",
    "Prize distribution",
    "Disqualification",
  ];
  const gallery = [
    ["Posters", Image],
    ["Match Highlights", Video],
    ["Winner Photos", Trophy],
    ["Behind The Scenes", Image],
    ["Tournament Moments", Zap],
    ["YouTube Embeds", Video],
  ] as Array<[string, Icon]>;
  return (
    <Section
      id="rules"
      eyebrow="Public content"
      title="Announcements and content modules are API-backed and ready for admin publishing."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5">
          <h3 className="text-xl font-black uppercase text-white">Announcements</h3>
          {data.announcements.length === 0 ? (
            <p className="mt-4 text-sm text-slate-400">
              No announcements published from the database yet.
            </p>
          ) : (
            <div className="mt-4 space-y-3">
              {data.announcements.map((item) => (
                <div
                  key={item.title}
                  className="rounded-md border border-white/10 bg-white/[0.03] p-3"
                >
                  <div className="flex justify-between gap-3">
                    <span className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-200">
                      {item.category}
                    </span>
                    <span className="text-xs text-slate-500">{item.date}</span>
                  </div>
                  <p className="mt-2 text-sm font-bold text-white">{item.title}</p>
                  <p className="mt-1 text-xs text-slate-400">{item.state}</p>
                </div>
              ))}
            </div>
          )}
        </Card>
        <Card className="p-5">
          <h3 className="text-xl font-black uppercase text-white">Rules Library</h3>
          <div className="mt-4 grid grid-cols-2 gap-2">
            {rules.map((rule) => (
              <button
                key={rule}
                className="rounded-md border border-white/10 bg-white/[0.03] p-3 text-left text-xs font-bold text-slate-300 hover:border-cyan-300/50"
              >
                {rule}
              </button>
            ))}
          </div>
          <button className="ghost-button mt-4 w-full">
            <FileText className="h-4 w-4" /> Download Rules PDF
          </button>
        </Card>
        <Card id="gallery" className="p-5">
          <h3 className="text-xl font-black uppercase text-white">Media Gallery</h3>
          <div className="mt-4 grid grid-cols-2 gap-3">
            {gallery.map(([label, IconComponent]) => (
              <div
                key={label}
                className="rounded-md border border-white/10 bg-gradient-to-br from-white/10 to-white/[0.02] p-4"
              >
                <IconComponent className="h-5 w-5 text-fuchsia-200" />
                <p className="mt-3 text-sm font-bold text-white">{label}</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Section>
  );
}

function AdminPanel({ data }: { data: PlatformData }) {
  const revenueData = data.tournaments.map((item) => ({
    day: item.starts,
    registrations: item.registered,
    revenue: item.registered * Number(item.fee.replace(/[^0-9]/g, "") || 0),
  }));
  return (
    <Section
      id="admin"
      eyebrow="Protected admin panel"
      title="Admin modules write to the same PostgreSQL schema used by the live public API."
    >
      <div className="grid gap-6 lg:grid-cols-[250px_1fr]">
        <Card className="p-4">
          {[
            "Dashboard",
            "Tournaments",
            "Registrations",
            "Teams",
            "Players",
            "Matches",
            "Results",
            "Leaderboard",
            "Drop Locations",
            "Announcements",
            "Notifications",
            "Penalties",
            "Transfers",
            "Gallery",
            "Hall of Fame",
            "Seasons",
            "Exports",
            "Settings",
            "Audit Logs",
          ].map((item, index) => (
            <button
              key={item}
              className={`mb-2 flex w-full items-center gap-3 rounded-md px-3 py-2 text-left text-xs font-bold ${index === 0 ? "bg-fuchsia-400 text-slate-950" : "bg-white/5 text-slate-300"}`}
            >
              <Shield className="h-4 w-4" /> {item}
            </button>
          ))}
        </Card>
        <div className="grid gap-5">
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            <Stat label="Active events" value={String(data.tournaments.length)} icon={Trophy} />
            <Stat label="Pending regs" value="DB" icon={ClipboardCheck} />
            <Stat label="Entry fees" value="Live" icon={Database} />
            <Stat label="Open appeals" value="DB" icon={MessageCircle} />
          </div>
          <Card className="p-5">
            <h3 className="text-xl font-black uppercase text-white">Registrations and Revenue</h3>
            <div className="mt-4 h-72">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="cyan" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="5%" stopColor="#22d3ee" stopOpacity={0.65} />
                      <stop offset="95%" stopColor="#22d3ee" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="rgba(255,255,255,.08)" />
                  <XAxis dataKey="day" stroke="#94a3b8" />
                  <YAxis stroke="#94a3b8" />
                  <Tooltip
                    contentStyle={{
                      background: "#080b14",
                      border: "1px solid rgba(255,255,255,.12)",
                      color: "#fff",
                    }}
                  />
                  <Area dataKey="registrations" stroke="#22d3ee" fill="url(#cyan)" />
                  <Line dataKey="revenue" stroke="#d946ef" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </div>
      </div>
    </Section>
  );
}

function Footer() {
  return (
    <footer className="border-t border-white/10 bg-[#05060c]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 lg:grid-cols-[1fr_1fr_1fr] lg:px-6">
        <div>
          <p className="text-xl font-black uppercase tracking-[0.12em] text-white">
            NexBattles BGMI
          </p>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            Original esports tournament management platform with PostgreSQL-backed live data and
            AI-generated battle arena visuals.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 text-sm text-slate-300">
          {[
            "Home",
            "Tournaments",
            "Register",
            "Leaderboard",
            "Schedule",
            "Teams",
            "Rules",
            "Contact",
          ].map((item) => (
            <a key={item} href={`#${item.toLowerCase()}`} className="hover:text-cyan-200">
              {item}
            </a>
          ))}
        </div>
        <div className="text-sm text-slate-400">
          <p className="font-bold text-white">Organizer Contact</p>
          <p className="mt-2">support@nexbattles.example</p>
          <p>WhatsApp: +91 90000 00000</p>
          <p>Discord: NexBattles HQ</p>
        </div>
      </div>
    </footer>
  );
}

function Section({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      id={id}
      className="relative border-t border-white/10 bg-[#070912] px-4 py-16 lg:px-6 lg:py-24"
    >
      <div className="grid-overlay absolute inset-0 opacity-20" />
      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="mb-10 max-w-4xl">
          <p className="text-xs font-black uppercase tracking-[0.22em] text-cyan-300">{eyebrow}</p>
          <h2 className="mt-3 text-3xl font-black uppercase leading-tight text-white md:text-5xl">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </section>
  );
}

function BgmiTournamentApp() {
  const { data = emptyPlatformData, isFetching } = usePlatformData();
  const stableData = useMemo(() => data, [data]);

  return (
    <div className="min-h-screen bg-[#05060c] text-slate-100">
      <AppNav />
      <main>
        <Hero data={stableData} isFetching={isFetching} />
        <Tournaments data={stableData} />
        <Registration />
        <Leaderboard data={stableData} />
        <ScheduleAndRooms data={stableData} />
        <Dashboard data={stableData} />
        <DropMapAndStats data={stableData} />
        <ContentPages data={stableData} />
        <AdminPanel data={stableData} />
      </main>
      <Footer />
    </div>
  );
}
