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
import { useState, type ComponentType, type ReactNode, type SVGProps } from "react";
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

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "NexBattles BGMI - Esports Tournament Platform" },
      {
        name: "description",
        content:
          "A premium BGMI esports tournament management platform for discovery, team registration, live standings, schedules, dashboards, and admin operations.",
      },
      { property: "og:title", content: "NexBattles BGMI - Tournament Command Center" },
      {
        property: "og:description",
        content:
          "Manage BGMI tournaments, registrations, rosters, leaderboards, rooms, notifications, and admin workflows from one futuristic esports platform.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: BgmiTournamentApp,
});

type Icon = ComponentType<SVGProps<SVGSVGElement>>;
type Status = "Registration Open" | "Closing Soon" | "Live" | "Completed" | "Full";

type Tournament = {
  id: string;
  name: string;
  mode: string;
  status: Status;
  prize: string;
  fee: string;
  slots: number;
  registered: number;
  starts: string;
  deadline: string;
  map: string;
  phase: string;
  accent: string;
};

type Team = {
  rank: number;
  name: string;
  short: string;
  region: string;
  captain: string;
  matches: number;
  wwcd: number;
  placement: number;
  finishes: number;
  penalty: number;
  form: string[];
  drop: string;
};

const tournaments: Tournament[] = [
  {
    id: "nebula",
    name: "Nebula Masters Invitational",
    mode: "Squad TPP",
    status: "Registration Open",
    prize: "₹5,00,000",
    fee: "₹799",
    slots: 64,
    registered: 48,
    starts: "15 Aug 2026",
    deadline: "10 Aug 2026",
    map: "Erangel, Miramar, Sanhok",
    phase: "Qualifiers",
    accent: "from-cyan-400 to-fuchsia-500",
  },
  {
    id: "rift",
    name: "Crimson Rift Pro League",
    mode: "Squad FPP",
    status: "Closing Soon",
    prize: "₹2,50,000",
    fee: "₹499",
    slots: 32,
    registered: 29,
    starts: "02 Sep 2026",
    deadline: "31 Jul 2026",
    map: "Erangel, Livik",
    phase: "League",
    accent: "from-red-500 to-orange-400",
  },
  {
    id: "aurora",
    name: "Aurora Campus Cup",
    mode: "Squad TPP",
    status: "Live",
    prize: "₹1,20,000",
    fee: "Free",
    slots: 24,
    registered: 24,
    starts: "24 Jul 2026",
    deadline: "20 Jul 2026",
    map: "Miramar, Vikendi",
    phase: "Grand Finals",
    accent: "from-violet-400 to-blue-500",
  },
];

const teams: Team[] = [
  {
    rank: 1,
    name: "Velocity Reign",
    short: "VRN",
    region: "Delhi",
    captain: "Aarav Blaze",
    matches: 16,
    wwcd: 4,
    placement: 72,
    finishes: 98,
    penalty: 0,
    form: ["W", "3", "2", "W", "5"],
    drop: "School",
  },
  {
    rank: 2,
    name: "Neon Vipers",
    short: "NVX",
    region: "Mumbai",
    captain: "Rehan Volt",
    matches: 16,
    wwcd: 3,
    placement: 68,
    finishes: 91,
    penalty: 2,
    form: ["2", "W", "4", "7", "W"],
    drop: "Pochinki",
  },
  {
    rank: 3,
    name: "Iron Phantoms",
    short: "IPH",
    region: "Bengaluru",
    captain: "Kabir Hex",
    matches: 16,
    wwcd: 2,
    placement: 61,
    finishes: 86,
    penalty: 0,
    form: ["4", "2", "W", "6", "3"],
    drop: "Rozhok",
  },
  {
    rank: 4,
    name: "Storm Syntax",
    short: "SSX",
    region: "Hyderabad",
    captain: "Ishan Node",
    matches: 16,
    wwcd: 2,
    placement: 58,
    finishes: 81,
    penalty: 4,
    form: ["7", "3", "5", "2", "W"],
    drop: "Mylta",
  },
  {
    rank: 5,
    name: "Quantum Rush",
    short: "QRX",
    region: "Pune",
    captain: "Dev Cipher",
    matches: 16,
    wwcd: 1,
    placement: 55,
    finishes: 78,
    penalty: 0,
    form: ["5", "8", "2", "W", "4"],
    drop: "Yasnaya",
  },
  {
    rank: 6,
    name: "Solar Dominion",
    short: "SDM",
    region: "Kolkata",
    captain: "Rudra Nova",
    matches: 16,
    wwcd: 1,
    placement: 49,
    finishes: 72,
    penalty: 1,
    form: ["6", "4", "8", "3", "2"],
    drop: "Georgopol",
  },
  {
    rank: 7,
    name: "Rogue Circuit",
    short: "RGC",
    region: "Chennai",
    captain: "Nikhil Flux",
    matches: 16,
    wwcd: 1,
    placement: 46,
    finishes: 66,
    penalty: 0,
    form: ["8", "5", "6", "4", "3"],
    drop: "Military Base",
  },
  {
    rank: 8,
    name: "Apex Mirage",
    short: "AMG",
    region: "Jaipur",
    captain: "Vihaan Frost",
    matches: 16,
    wwcd: 0,
    placement: 41,
    finishes: 61,
    penalty: 0,
    form: ["9", "6", "7", "5", "6"],
    drop: "Severny",
  },
];

const schedules = [
  ["Grand Final M1", "28 Jul 2026", "7:00 PM", "Erangel", "Room Released", "Group A+B"],
  ["Grand Final M2", "28 Jul 2026", "7:50 PM", "Miramar", "Check-in Open", "Group A+B"],
  ["Grand Final M3", "29 Jul 2026", "7:00 PM", "Sanhok", "Upcoming", "Group A+B"],
  ["Grand Final M4", "29 Jul 2026", "7:50 PM", "Vikendi", "Upcoming", "Group A+B"],
];

const announcements = [
  ["Important", "Grand finals lobby opens 20 minutes earlier tonight.", "Pinned", "28 Jul 2026"],
  ["Rules", "Zone heal camping penalty updated for finals matches.", "Published", "27 Jul 2026"],
  [
    "Result",
    "Semi-final leaderboard verified after payment and roster audit.",
    "Published",
    "26 Jul 2026",
  ],
  ["Schedule", "Miramar slot moved to 7:50 PM after broadcaster sync.", "Published", "25 Jul 2026"],
];

const placementPoints: Record<number, number> = { 1: 10, 2: 6, 3: 5, 4: 4, 5: 3, 6: 2, 7: 1, 8: 1 };

function totalPoints(team: Team) {
  return team.placement + team.finishes - team.penalty;
}

function Card({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass-panel ${className}`}>{children}</div>;
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
        <button className="hidden rounded-md border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold uppercase tracking-[0.14em] text-white lg:inline-flex">
          Season 06
        </button>
        <button
          className="relative grid h-10 w-10 place-items-center rounded-md border border-white/10 bg-white/5 text-slate-100"
          aria-label="Notifications"
        >
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
          aria-label="Toggle menu"
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

function Hero() {
  return (
    <section id="home" className="relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_10%,rgba(217,70,239,0.28),transparent_34%),radial-gradient(circle_at_20%_20%,rgba(34,211,238,0.24),transparent_30%),linear-gradient(135deg,#070912_0%,#101329_52%,#05060c_100%)]" />
      <div className="grid-overlay absolute inset-0 opacity-50" />
      <div className="mx-auto grid min-h-[calc(100vh-72px)] max-w-7xl items-center gap-10 px-4 py-16 lg:grid-cols-[1.05fr_0.95fr] lg:px-6">
        <div className="relative z-10">
          <div className="inline-flex items-center gap-2 rounded-md border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-bold uppercase tracking-[0.18em] text-cyan-200">
            <Activity className="h-4 w-4" /> Registration live
          </div>
          <h1 className="mt-6 max-w-4xl text-5xl font-black uppercase leading-[0.95] tracking-normal text-white md:text-7xl xl:text-8xl">
            Run BGMI tournaments like a broadcast command center.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-300">
            Discover tournaments, register squads, manage rosters, release rooms, publish results,
            calculate points, notify players, and operate a complete admin panel from one premium
            esports cockpit.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#register" className="neon-button">
              Register Your Team <ChevronRight className="h-4 w-4" />
            </a>
            <a href="#tournaments" className="ghost-button">
              View Tournament
            </a>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat label="Prize pool" value="₹8.7L" icon={Trophy} />
            <Stat label="Teams" value="101/120" icon={Users} />
            <Stat label="Starts in" value="18D 04H" icon={CalendarDays} />
            <Stat label="Live rooms" value="06" icon={Lock} />
          </div>
        </div>
        <div className="relative z-10">
          <Card className="hud-card p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                  Live Finals Feed
                </p>
                <h2 className="mt-2 text-2xl font-black uppercase text-white">Aurora Campus Cup</h2>
              </div>
              <StatusBadge status="Live" />
            </div>
            <div className="mt-5 overflow-hidden rounded-md border border-white/10">
              {teams.slice(0, 5).map((team) => (
                <div
                  key={team.name}
                  className="grid grid-cols-[40px_1fr_auto] items-center gap-3 border-b border-white/10 bg-white/[0.03] px-3 py-3 last:border-b-0"
                >
                  <span
                    className={`grid h-9 w-9 place-items-center rounded-md font-black ${team.rank === 1 ? "bg-amber-300 text-black" : team.rank === 2 ? "bg-slate-300 text-black" : team.rank === 3 ? "bg-orange-400 text-black" : "bg-white/10 text-white"}`}
                  >
                    {team.rank}
                  </span>
                  <div>
                    <p className="font-bold text-white">{team.name}</p>
                    <p className="text-xs text-slate-400">
                      {team.region} - {team.form.join(" / ")}
                    </p>
                  </div>
                  <p className="text-xl font-black text-cyan-200">{totalPoints(team)}</p>
                </div>
              ))}
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-3">
              <MiniMetric label="Room release" value="19:00" />
              <MiniMetric label="Map" value="Erangel" />
              <MiniMetric label="Checked in" value="23/24" />
            </div>
          </Card>
        </div>
      </div>
    </section>
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

function Tournaments() {
  const [filter, setFilter] = useState("All");
  const visible =
    filter === "All" ? tournaments : tournaments.filter((item) => item.status === filter);
  return (
    <Section
      id="tournaments"
      eyebrow="Tournament discovery"
      title="Filterable tournament cards with slots, dates, fees, maps, and status."
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
      <div className="grid gap-5 lg:grid-cols-3">
        {visible.map((tournament) => (
          <Card key={tournament.id} className="group overflow-hidden">
            <div className={`h-36 bg-gradient-to-br ${tournament.accent} relative`}>
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
                <MiniMetric label="Slots" value={`${tournament.registered}/${tournament.slots}`} />
                <MiniMetric label="Start" value={tournament.starts} />
              </div>
              <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-cyan-300"
                  style={{ width: `${(tournament.registered / tournament.slots) * 100}%` }}
                />
              </div>
              <div className="mt-5 flex gap-3">
                <a href="#register" className="neon-button flex-1">
                  Register
                </a>
                <a href="#leaderboard" className="ghost-button flex-1">
                  Details
                </a>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </Section>
  );
}

function Registration() {
  const steps = ["Tournament", "Team", "Captain", "Roster", "Payment", "Review"];
  const [step, setStep] = useState(0);
  const [teamName, setTeamName] = useState("Velocity Reign Academy");
  return (
    <Section
      id="register"
      eyebrow="Team registration"
      title="Six-step captain workflow with validation-ready fields, payment proof, roster rules, and receipt generation."
    >
      <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
        <Card className="p-5">
          <div className="space-y-3">
            {steps.map((label, index) => (
              <button
                key={label}
                onClick={() => setStep(index)}
                className={`flex w-full items-center gap-3 rounded-md border p-3 text-left ${step === index ? "border-cyan-300 bg-cyan-300/15" : "border-white/10 bg-white/5"}`}
              >
                <span className="grid h-8 w-8 place-items-center rounded-md bg-white/10 text-sm font-black text-white">
                  {index + 1}
                </span>
                <span className="font-bold text-white">{label}</span>
                {index < step ? (
                  <CheckCircle2 className="ml-auto h-4 w-4 text-emerald-300" />
                ) : null}
              </button>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.18em] text-cyan-300">
                Step {step + 1} of 6
              </p>
              <h3 className="mt-2 text-2xl font-black uppercase text-white">{steps[step]}</h3>
            </div>
            <StatusBadge status="Verification Pending" />
          </div>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {step === 0 ? (
              <>
                <Field label="Selected tournament" value="Nebula Masters Invitational" />
                <Field label="Entry fee" value="₹799" />
                <Field label="Available slots" value="16 slots left" />
                <Field label="Registration deadline" value="10 Aug 2026" />
              </>
            ) : step === 1 ? (
              <>
                <Field label="Team name" value={teamName} onChange={setTeamName} />
                <Field label="Short name" value="VRA" />
                <Field label="Region" value="Delhi NCR" />
                <Field label="Preferred drop" value="School / Apartments" />
              </>
            ) : step === 2 ? (
              <>
                <Field label="Captain full name" value="Aarav Mehta" />
                <Field label="BGMI name" value="VRN Blaze" />
                <Field label="BGMI UID" value="58493027162" />
                <Field label="WhatsApp" value="+91 98765 43210" />
              </>
            ) : step === 3 ? (
              ["IGL", "Assaulter", "Sniper", "Support", "Substitute", "Coach"].map(
                (role, index) => (
                  <Field
                    key={role}
                    label={role}
                    value={index < 4 ? `Player ${index + 1} - UID locked` : "Optional slot"}
                  />
                ),
              )
            ) : step === 4 ? (
              <>
                <Field label="UPI ID" value="nexbattles@upi" />
                <Field label="Transaction ID" value="TXN98162276" />
                <Uploader label="Payment screenshot" />
                <Field label="Payment status" value="Verification Pending" />
              </>
            ) : (
              <>
                <Field label="Generated Team ID" value="BGM-2026-0001" />
                <Field label="Registration no." value="NB-NEBULA-048" />
                <Field label="Fair-play agreement" value="Accepted" />
                <Field label="Printable receipt" value="Ready after submission" />
              </>
            )}
          </div>
          <div className="mt-6 flex flex-wrap justify-between gap-3">
            <button onClick={() => setStep(Math.max(0, step - 1))} className="ghost-button">
              Back
            </button>
            <button
              onClick={() => setStep(Math.min(steps.length - 1, step + 1))}
              className="neon-button"
            >
              {step === steps.length - 1 ? "Submit Registration" : "Continue"}
            </button>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange?: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-[0.68rem] font-bold uppercase tracking-[0.18em] text-slate-400">
        {label}
      </span>
      <input
        value={value}
        onChange={(event) => onChange?.(event.target.value)}
        readOnly={!onChange}
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
      <p className="text-xs text-slate-400">PNG, JPG, WebP up to 5 MB</p>
    </div>
  );
}

function Leaderboard() {
  const [query, setQuery] = useState("");
  const filtered = teams.filter((team) => team.name.toLowerCase().includes(query.toLowerCase()));
  return (
    <Section
      id="leaderboard"
      eyebrow="Live leaderboard"
      title="Automatic placement plus finish scoring, penalties, tie-break signals, and mobile-ready standings."
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
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>
        </div>
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
              {filtered.map((team) => (
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
                  <td className="px-3 py-4 text-xl font-black text-cyan-200">
                    {totalPoints(team)}
                  </td>
                  <td className="px-3 py-4">
                    <FormPills form={team.form} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="grid gap-3 lg:hidden">
          {filtered.map((team) => (
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
      </Card>
    </Section>
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

function ScheduleAndRooms() {
  return (
    <Section
      id="schedule"
      eyebrow="Match control"
      title="Schedule, room-release timing, check-in status, and hidden credentials for approved teams only."
    >
      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <Card className="p-5">
          <div className="space-y-3">
            {schedules.map(([match, date, time, map, status, group]) => (
              <div
                key={match}
                className="grid gap-3 rounded-md border border-white/10 bg-white/[0.03] p-4 md:grid-cols-[1fr_auto_auto] md:items-center"
              >
                <div>
                  <p className="font-black uppercase text-white">{match}</p>
                  <p className="text-sm text-slate-400">
                    {date} - {time} - {group}
                  </p>
                </div>
                <span className="text-sm font-bold text-cyan-200">{map}</span>
                <StatusBadge status={status} />
              </div>
            ))}
          </div>
        </Card>
        <Card className="p-5">
          <div className="flex items-center gap-3">
            <Lock className="h-5 w-5 text-cyan-200" />
            <h3 className="text-xl font-black uppercase text-white">Room Vault</h3>
          </div>
          <div className="mt-5 space-y-3">
            <MiniMetric label="Room ID" value="7365 9821" />
            <MiniMetric label="Password" value="NBX#29" />
            <MiniMetric label="Release rule" value="Approved teams only" />
          </div>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button className="ghost-button">Copy ID</button>
            <button className="ghost-button">Check In</button>
          </div>
          <div className="mt-5 rounded-md border border-emerald-300/30 bg-emerald-300/10 p-4">
            <QrCode className="h-8 w-8 text-emerald-200" />
            <p className="mt-2 font-bold text-white">Team QR check-in generated</p>
            <p className="text-sm text-slate-400">Duplicate scans are blocked and logged.</p>
          </div>
        </Card>
      </div>
    </Section>
  );
}

function Dashboard() {
  const notices = [
    "Registration approved",
    "Payment verified",
    "Roster locks on 10 Aug",
    "Room M1 released at 6:40 PM",
  ];
  return (
    <Section
      id="teams"
      eyebrow="Captain dashboard"
      title="Captain workspace for roster, room details, penalties, notices, downloads, transfers, and settings."
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
            <Stat label="Team ID" value="BGM-2026-0001" icon={Shield} />
            <Stat label="Current rank" value="#1" icon={Crown} />
            <Stat label="Total points" value="170" icon={Zap} />
            <Stat label="WWCD" value="04" icon={Trophy} />
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
          <div className="grid gap-5 lg:grid-cols-2">
            <Card className="p-5">
              <h3 className="text-xl font-black uppercase text-white">Roster Lock</h3>
              <div className="mt-4 grid gap-3">
                {[
                  "VRN Blaze - IGL",
                  "VRN Venom - Assaulter",
                  "VRN Scope - Sniper",
                  "VRN Pulse - Support",
                  "VRN Echo - Substitute",
                ].map((player) => (
                  <div
                    key={player}
                    className="rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm font-bold text-slate-200"
                  >
                    {player}
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="text-xl font-black uppercase text-white">Latest Notices</h3>
              <div className="mt-4 space-y-3">
                {notices.map((notice) => (
                  <div
                    key={notice}
                    className="flex items-center gap-3 rounded-md border border-white/10 bg-white/[0.03] p-3"
                  >
                    <Bell className="h-4 w-4 text-cyan-200" />
                    <span className="text-sm font-bold text-slate-200">{notice}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
}

function DropMapAndStats() {
  const chartData = teams
    .slice(0, 6)
    .map((team) => ({ name: team.short, points: totalPoints(team), finishes: team.finishes }));
  const pieData = [
    { name: "Erangel", value: 42 },
    { name: "Miramar", value: 25 },
    { name: "Sanhok", value: 18 },
    { name: "Vikendi", value: 15 },
  ];
  return (
    <Section
      id="statistics"
      eyebrow="Strategy and analytics"
      title="Drop-location heatmaps, team statistics, points progression, finishes, and season ranking signals."
    >
      <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
        <Card className="relative min-h-[430px] overflow-hidden p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(34,211,238,0.16),transparent_22%),radial-gradient(circle_at_70%_60%,rgba(244,63,94,0.14),transparent_25%)]" />
          <div className="grid-overlay absolute inset-0 opacity-40" />
          <div className="relative z-10 flex items-center justify-between">
            <h3 className="text-xl font-black uppercase text-white">Erangel Drop Map</h3>
            <MapPinned className="h-5 w-5 text-cyan-200" />
          </div>
          {teams.slice(0, 7).map((team, index) => (
            <div
              key={team.name}
              className="absolute rounded-md border border-cyan-300/40 bg-cyan-300/15 px-2 py-1 text-xs font-black text-cyan-100 shadow-[0_0_18px_rgba(34,211,238,0.24)]"
              style={{ left: `${12 + ((index * 13) % 72)}%`, top: `${22 + ((index * 17) % 58)}%` }}
            >
              {team.short}
              <span className="ml-1 text-slate-300">{team.drop}</span>
            </div>
          ))}
          <div className="absolute bottom-5 left-5 right-5 z-10 rounded-md border border-white/10 bg-black/40 p-3 text-sm text-slate-300 backdrop-blur">
            Overlapping drops are highlighted with neon markers; split-drop paths render as glowing
            lines in admin strategy mode.
          </div>
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
              <p className="mt-4 text-sm text-slate-400">
                Formula: placement + finishes - penalties. Ties: WWCD, finishes, placement points,
                latest match.
              </p>
            </Card>
          </div>
        </div>
      </div>
    </Section>
  );
}

function ContentPages() {
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
    ["Behind The Scenes", CameraIcon],
    ["Tournament Moments", Zap],
    ["YouTube Embeds", Video],
  ] as Array<[string, Icon]>;
  return (
    <Section
      id="rules"
      eyebrow="Public content"
      title="Rules, announcements, hall of fame, media gallery, contact support, and notification surfaces."
    >
      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="p-5">
          <h3 className="text-xl font-black uppercase text-white">Announcements</h3>
          <div className="mt-4 space-y-3">
            {announcements.map(([category, title, state, date]) => (
              <div key={title} className="rounded-md border border-white/10 bg-white/[0.03] p-3">
                <div className="flex justify-between gap-3">
                  <span className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-200">
                    {category}
                  </span>
                  <span className="text-xs text-slate-500">{date}</span>
                </div>
                <p className="mt-2 text-sm font-bold text-white">{title}</p>
                <p className="mt-1 text-xs text-slate-400">{state}</p>
              </div>
            ))}
          </div>
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

function CameraIcon(props: SVGProps<SVGSVGElement>) {
  return <Image {...props} />;
}

function AdminPanel() {
  const revenueData = [
    { day: "Mon", registrations: 12, revenue: 18 },
    { day: "Tue", registrations: 19, revenue: 28 },
    { day: "Wed", registrations: 15, revenue: 24 },
    { day: "Thu", registrations: 28, revenue: 42 },
    { day: "Fri", registrations: 34, revenue: 55 },
    { day: "Sat", registrations: 41, revenue: 68 },
  ];
  return (
    <Section
      id="admin"
      eyebrow="Protected admin panel"
      title="Operations dashboard for tournaments, registrations, results, penalties, transfers, seasons, exports, and audit logs."
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
            <Stat label="Active events" value="03" icon={Trophy} />
            <Stat label="Pending regs" value="18" icon={ClipboardCheck} />
            <Stat label="Entry fees" value="₹1.84L" icon={Database} />
            <Stat label="Open appeals" value="04" icon={MessageCircle} />
          </div>
          <div className="grid gap-5 lg:grid-cols-[1fr_0.9fr]">
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
            <Card className="p-5">
              <h3 className="text-xl font-black uppercase text-white">Fast Result Entry</h3>
              <div className="mt-4 grid gap-3">
                <Field label="Match" value="Grand Final M1" />
                <Field label="Team" value="Velocity Reign" />
                <Field label="Placement" value="1" />
                <Field label="Finishes" value="14" />
                <Field label="Auto total" value={`${placementPoints[1] + 14} pts`} />
              </div>
              <button className="neon-button mt-4 w-full">Publish Result</button>
            </Card>
          </div>
          <Card className="p-5">
            <h3 className="text-xl font-black uppercase text-white">Production Modules</h3>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {[
                "RBAC and protected routes",
                "Zod form validation",
                "Secure uploads",
                "Room credential release",
                "Audit logs",
                "CSV and Excel exports",
                "Public read-only APIs",
                "API keys and rate limits",
                "Notifications and Discord hooks",
                "QR check-in scanner",
                "Transfer review history",
                "Multi-season rankings",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-md border border-white/10 bg-white/[0.03] p-3 text-sm font-bold text-slate-200"
                >
                  {item}
                </div>
              ))}
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
            Original esports tournament management platform for production demonstrations, organizer
            operations, and player-facing tournament experiences.
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
  return (
    <div className="min-h-screen bg-[#05060c] text-slate-100">
      <AppNav />
      <main>
        <Hero />
        <Tournaments />
        <Registration />
        <Leaderboard />
        <ScheduleAndRooms />
        <Dashboard />
        <DropMapAndStats />
        <ContentPages />
        <AdminPanel />
      </main>
      <Footer />
    </div>
  );
}
