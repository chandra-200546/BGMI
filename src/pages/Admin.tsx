import { AnimatePresence, motion } from "framer-motion";
import { LockKeyhole, RefreshCw, ShieldCheck, SlidersHorizontal, Trash2, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import {
  formatUpdatedAt,
  usePlatformData,
} from "../lib/shared-ui";
import type { PlatformData, Tournament } from "../lib/platform-types";

type AdminSnapshot = {
  tournaments: Array<Record<string, unknown>>;
  teams: Array<Record<string, unknown>>;
  registrations: Array<Record<string, unknown>>;
  matches: Array<Record<string, unknown>>;
  announcements: Array<Record<string, unknown>>;
  generatedAt: string;
  warnings?: string[];
};

type AdminDataTab = "registrations" | "teams" | "tournaments" | "matches" | "announcements";

export function AdminPanelModal({
  data,
  open,
  onClose,
  onChanged,
  inline = false,
}: {
  data: PlatformData;
  open: boolean;
  onClose: () => void;
  onChanged: () => void;
  inline?: boolean;
}) {
  const [adminKey, setAdminKey] = useState(() => {
    if (typeof window !== "undefined") {
      return sessionStorage.getItem("nexbattles_admin_pass") || "vinaygbmi!@#$%^&*";
    }
    return "vinaygbmi!@#$%^&*";
  });
  const [unlocked, setUnlocked] = useState(false);
  const [activeTask, setActiveTask] = useState<
    "tournament" | "announcement" | "match" | "registrationStatus" | "roomCredentials"
  >("tournament");
  const [activeDataTab, setActiveDataTab] = useState<AdminDataTab>("tournaments");
  const [snapshot, setSnapshot] = useState<AdminSnapshot | undefined>();
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: "",
    category: "Tournament",
    pinned: true,
    tournamentId: data.tournaments[0]?.id ?? "",
    tournamentName: "",
    mode: "Squad",
    prizePool: "50000",
    entryFee: "100",
    maxTeams: "24",
    startsAt: "",
    registrationDeadline: "",
    maps: "Erangel, Miramar, Sanhok",
    matchName: "",
    matchMap: "Erangel",
    matchGroup: "Group A",
    matchStartsAt: "",
    matchId: "",
    teamId: "",
    registrationId: "",
    registrationStatus: "APPROVED",
    roomId: "",
    roomPassword: "",
  });

  useEffect(() => {
    if (!form.tournamentId && data.tournaments[0]?.id) {
      setForm((current) => ({ ...current, tournamentId: data.tournaments[0].id }));
    }
  }, [data.tournaments, form.tournamentId]);

  // Auto-attempt unlock if adminKey is already set
  useEffect(() => {
    if (open && adminKey && !unlocked) {
      void unlockWithKey(adminKey);
    }
  }, [open]);

  function updateField(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function unlockWithKey(keyToTry: string) {
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ adminKey: keyToTry }),
      });
      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errorData.error ?? "Invalid admin password. Check your password.");
      }
      setUnlocked(true);
      if (typeof window !== "undefined") {
        sessionStorage.setItem("nexbattles_admin_pass", keyToTry);
      }
      setStatus("Admin Command Deck unlocked successfully.");
      await loadSnapshotWithKey(keyToTry);
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to unlock admin panel");
    } finally {
      setBusy(false);
    }
  }

  async function unlock() {
    await unlockWithKey(adminKey);
  }

  async function loadSnapshotWithKey(keyToUse: string) {
    const response = await fetch("/api/admin/snapshot", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ adminKey: keyToUse }),
    });
    const payload = (await response.json()) as { data?: AdminSnapshot; error?: string };
    if (!response.ok || !payload.data) throw new Error(payload.error ?? "Unable to load database");
    setSnapshot(payload.data);
  }

  async function loadSnapshot() {
    await loadSnapshotWithKey(adminKey);
  }

  async function runCommand() {
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/command", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ adminKey, action: activeTask, ...form }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Admin command failed");
      setStatus(`Success: ${activeTask} action executed.`);
      await loadSnapshot();
      onChanged();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Admin command failed");
    } finally {
      setBusy(false);
    }
  }

  async function deleteItem(table: "tournaments" | "announcements" | "registration_submissions" | "matches" | "teams", id: string) {
    if (!confirm(`Are you sure you want to delete this ${table} entry?`)) return;
    setBusy(true);
    setStatus("");
    try {
      let actionName = "deleteTournament";
      let payloadKey = "tournamentId";
      if (table === "announcements") {
        actionName = "deleteAnnouncement";
        payloadKey = "announcementId";
      } else if (table === "registration_submissions") {
        actionName = "deleteRegistration";
        payloadKey = "registrationId";
      } else if (table === "matches") {
        actionName = "deleteMatch";
        payloadKey = "matchId";
      } else if (table === "teams") {
        actionName = "deleteTeam";
        payloadKey = "teamId";
      }

      const response = await fetch("/api/admin/command", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ adminKey, action: actionName, [payloadKey]: id }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Deletion failed");
      setStatus(`Entry deleted successfully from ${table}.`);
      await loadSnapshot();
      onChanged();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Deletion failed");
    } finally {
      setBusy(false);
    }
  }

  const pendingSignal = data.tournaments.reduce(
    (sum, tournament) => sum + Math.max(tournament.slots - tournament.registered, 0),
    0,
  );

  const adminCards = [
    {
      label: "Registration queue",
      value: `${snapshot?.registrations?.length ?? data.tournaments.reduce((sum, item) => sum + item.registered, 0)} squads`,
      note: "Approve, waitlist, or reject captain submissions.",
      icon: Users,
    },
    {
      label: "Room controls",
      value: `${snapshot?.matches?.length ?? data.schedules.length} matches`,
      note: "Prepare room IDs, passwords, release windows, and check-ins.",
      icon: LockKeyhole,
    },
    {
      label: "Live ops",
      value: `${pendingSignal} slots open`,
      note: "Monitor slot pressure, announcements, scoring, and disputes.",
      icon: SlidersHorizontal,
    },
  ];

  const contentUI = (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="clip-panel hud-panel p-5 md:p-7"
    >
      <div className="flex flex-col gap-4 border-b border-white/10 pb-5 md:flex-row md:items-start md:justify-between">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-orange-300">
            Admin Panel
          </p>
          <h2 className="mt-2 font-display text-5xl font-bold uppercase leading-none text-white md:text-7xl">
            Organizer Command Deck
          </h2>
        </div>
        <div className="border border-green-300/25 bg-green-400/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-green-100 flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-green-400" />
          {unlocked ? "Passcode Verified" : "Passcode Required"}
        </div>
      </div>

      {!unlocked ? (
        <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
          <label className="field-shell">
            Supabase Admin Password
            <input
              type="password"
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              placeholder="Enter official admin password"
            />
          </label>
          <button
            type="button"
            onClick={unlock}
            disabled={busy}
            className="self-end border border-orange-300/50 bg-orange-500/15 px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-orange-100 disabled:opacity-50 hover:bg-orange-500 hover:text-black transition"
          >
            {busy ? "Authenticating..." : "Unlock Command Deck"}
          </button>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 xl:grid-cols-[0.75fr_1.25fr]">
          <div className="grid gap-3">
            {adminCards.map((card) => {
              const Icon = card.icon;
              return (
                <div key={card.label} className="border border-white/10 bg-black/45 p-4">
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-[0.65rem] uppercase tracking-[0.2em] text-green-300">
                        {card.label}
                      </p>
                      <p className="mt-1 font-display text-4xl font-bold uppercase text-white">
                        {card.value}
                      </p>
                    </div>
                    <Icon className="h-5 w-5 text-orange-300" />
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-400">{card.note}</p>
                </div>
              );
            })}
          </div>

          <div>
            {/* Task Selector Tabs */}
            <div className="mb-4 flex flex-wrap gap-2">
              {[
                { key: "tournament", label: "+ Challenge / Tournament" },
                { key: "announcement", label: "+ Broadcast News" },
                { key: "match", label: "+ Match Schedule" },
                { key: "registrationStatus", label: "Registration Queue" },
                { key: "roomCredentials", label: "Room Credentials" },
              ].map((task) => (
                <button
                  key={task.key}
                  type="button"
                  onClick={() => setActiveTask(task.key as typeof activeTask)}
                  className={`border px-3.5 py-2.5 font-mono text-[0.68rem] font-bold uppercase tracking-[0.16em] transition ${
                    activeTask === task.key
                      ? "border-orange-300/60 bg-orange-500/20 text-orange-100"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200"
                  }`}
                >
                  {task.label}
                </button>
              ))}
            </div>

            <AdminTaskFields
              activeTask={activeTask}
              form={form}
              tournaments={data.tournaments}
              schedules={data.schedules}
              registrations={snapshot?.registrations ?? []}
              updateField={updateField}
            />

            <button
              type="button"
              onClick={runCommand}
              disabled={busy}
              className="mt-5 w-full border border-green-300/40 bg-green-400/10 px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-green-100 disabled:opacity-50 hover:bg-green-500 hover:text-black transition"
            >
              {busy ? "Executing..." : `Execute ${activeTask} Command`}
            </button>
          </div>
        </div>
      )}

      {unlocked ? (
        <div className="mt-8 border-t border-white/10 pt-6">
          <div className="mb-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="font-mono text-xs uppercase tracking-[0.22em] text-orange-300">
                Database Control Room
              </p>
              <p className="mt-1 text-sm text-slate-400">
                Live Supabase tables viewer with instant record deletion.
              </p>
            </div>
            <button
              type="button"
              onClick={() => {
                setBusy(true);
                loadSnapshot()
                  .then(() => setStatus("Database snapshot refreshed."))
                  .catch((error: unknown) =>
                    setStatus(error instanceof Error ? error.message : "Refresh failed"),
                  )
                  .finally(() => setBusy(false));
              }}
              disabled={busy}
              className="inline-flex items-center justify-center gap-2 border border-white/15 bg-white/5 px-4 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white disabled:opacity-50 hover:border-orange-400"
            >
              <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin" : ""}`} />
              Refresh Snapshot
            </button>
          </div>

          <AdminDatabaseBrowser
            snapshot={snapshot}
            activeTab={activeDataTab}
            setActiveTab={setActiveDataTab}
            onDelete={deleteItem}
          />
        </div>
      ) : null}

      {status ? (
        <p className="mt-5 border border-white/10 bg-black/45 p-3 font-mono text-xs uppercase tracking-[0.16em] text-orange-100">
          {status}
        </p>
      ) : null}
    </motion.div>
  );

  if (inline) {
    return contentUI;
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[95] overflow-y-auto bg-black/82 px-4 py-8 backdrop-blur-xl"
        >
          <div className="mx-auto max-w-6xl">
            <div className="mb-4 flex justify-end">
              <button
                type="button"
                onClick={onClose}
                className="grid h-11 w-11 place-items-center border border-white/15 bg-white/5 text-white hover:border-orange-300/50"
                aria-label="Close admin panel"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {contentUI}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

function AdminTaskFields({
  activeTask,
  form,
  tournaments,
  schedules,
  registrations,
  updateField,
}: {
  activeTask: "tournament" | "announcement" | "match" | "registrationStatus" | "roomCredentials";
  form: Record<string, string | boolean>;
  tournaments: Tournament[];
  schedules: Array<{ id: string; title: string }>;
  registrations: Array<Record<string, unknown>>;
  updateField: (key: keyof typeof form, value: string | boolean) => void;
}) {
  if (activeTask === "announcement") {
    return (
      <div className="grid gap-4">
        <label className="field-shell">
          Announcement Title
          <input
            type="text"
            value={String(form.title)}
            onChange={(e) => updateField("title", e.target.value)}
            placeholder="e.g. Season 4 Slot Lock Warning"
          />
        </label>
        <label className="field-shell">
          Announcement Details
          <input
            type="text"
            value={String(form.body)}
            onChange={(e) => updateField("body", e.target.value)}
            placeholder="Full announcement body"
          />
        </label>
        <label className="field-shell">
          Category Tag
          <input
            type="text"
            value={String(form.category)}
            onChange={(e) => updateField("category", e.target.value)}
          />
        </label>
        <label className="field-shell">
          Tournament Target
          <select
            value={String(form.tournamentId)}
            onChange={(event) => updateField("tournamentId", event.target.value)}
          >
            <option value="">Global announcement</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name}
              </option>
            ))}
          </select>
        </label>
      </div>
    );
  }

  if (activeTask === "tournament") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-shell">
          Challenge / Tournament Name
          <input
            type="text"
            value={String(form.tournamentName)}
            onChange={(e) => updateField("tournamentName", e.target.value)}
            placeholder="e.g. Weekend War Championship S4"
          />
        </label>
        <label className="field-shell">
          Match Mode
          <input
            type="text"
            value={String(form.mode)}
            onChange={(e) => updateField("mode", e.target.value)}
            placeholder="Squad / Duo"
          />
        </label>
        <label className="field-shell">
          Prize Pool (INR)
          <input
            type="text"
            value={String(form.prizePool)}
            onChange={(e) => updateField("prizePool", e.target.value)}
            placeholder="50000"
          />
        </label>
        <label className="field-shell">
          Entry Fee (INR)
          <input
            type="text"
            value={String(form.entryFee)}
            onChange={(e) => updateField("entryFee", e.target.value)}
            placeholder="100"
          />
        </label>
        <label className="field-shell">
          Maximum Slots / Squads
          <input
            type="text"
            value={String(form.maxTeams)}
            onChange={(e) => updateField("maxTeams", e.target.value)}
            placeholder="24"
          />
        </label>
        <label className="field-shell">
          Map Rotation
          <input
            type="text"
            value={String(form.maps)}
            onChange={(e) => updateField("maps", e.target.value)}
            placeholder="Erangel, Miramar, Sanhok"
          />
        </label>
      </div>
    );
  }

  if (activeTask === "match") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-shell">
          Match Title
          <input
            type="text"
            value={String(form.matchName)}
            onChange={(e) => updateField("matchName", e.target.value)}
            placeholder="e.g. Lobby 1 - Group Stage"
          />
        </label>
        <label className="field-shell">
          Tournament
          <select
            value={String(form.tournamentId)}
            onChange={(e) => updateField("tournamentId", e.target.value)}
          >
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field-shell">
          Map
          <input
            type="text"
            value={String(form.matchMap)}
            onChange={(e) => updateField("matchMap", e.target.value)}
            placeholder="Erangel"
          />
        </label>
        <label className="field-shell">
          Group
          <input
            type="text"
            value={String(form.matchGroup)}
            onChange={(e) => updateField("matchGroup", e.target.value)}
            placeholder="Group A"
          />
        </label>
      </div>
    );
  }

  if (activeTask === "registrationStatus") {
    return (
      <div className="grid gap-4">
        <label className="field-shell">
          Select Registration Submission
          <select
            value={String(form.registrationId)}
            onChange={(e) => updateField("registrationId", e.target.value)}
          >
            <option value="">Select a registration submission</option>
            {registrations.map((reg) => (
              <option key={String(reg.id)} value={String(reg.id)}>
                {String(reg.team_name ?? "Team")} - {String(reg.captain_name ?? "Captain")} ({String(reg.status ?? "SUBMITTED")})
              </option>
            ))}
          </select>
        </label>
        <label className="field-shell">
          Update Verification Status
          <select
            value={String(form.registrationStatus)}
            onChange={(e) => updateField("registrationStatus", e.target.value)}
          >
            <option value="APPROVED">APPROVED (Payment Verified & Slot Confirmed)</option>
            <option value="UNDER_REVIEW">UNDER REVIEW (Checking Screenshot)</option>
            <option value="WAITLISTED">WAITLISTED</option>
            <option value="REJECTED">REJECTED (Invalid Screenshot/UID)</option>
          </select>
        </label>
      </div>
    );
  }

  if (activeTask === "roomCredentials") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-shell">
          Tournament / Challenge
          <select
            value={String(form.tournamentId)}
            onChange={(e) => updateField("tournamentId", e.target.value)}
          >
            <option value="">Select Tournament</option>
            {tournaments.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </select>
        </label>
        <label className="field-shell">
          Match Schedule (Optional)
          <select
            value={String(form.matchId)}
            onChange={(e) => updateField("matchId", e.target.value)}
          >
            <option value="">All Matches in Tournament</option>
            {schedules.map((m) => (
              <option key={m.id} value={m.id}>
                {m.title}
              </option>
            ))}
          </select>
        </label>
        <label className="field-shell">
          BGMI Room ID
          <input
            type="text"
            value={String(form.roomId)}
            onChange={(e) => updateField("roomId", e.target.value)}
            placeholder="e.g. 8492041"
          />
        </label>
        <label className="field-shell">
          BGMI Room Password
          <input
            type="text"
            value={String(form.roomPassword)}
            onChange={(e) => updateField("roomPassword", e.target.value)}
            placeholder="e.g. LORDS2026"
          />
        </label>
      </div>
    );
  }

  return null;
}

const tableConfigs: Record<
  AdminDataTab,
  { label: string; columns: string[] }
> = {
  tournaments: {
    label: "Tournaments",
    columns: ["id", "name", "mode", "status", "prize_pool", "entry_fee", "registered_teams", "max_teams", "starts_at"],
  },
  announcements: {
    label: "Announcements",
    columns: ["id", "title", "category", "pinned", "publish_at"],
  },
  registrations: {
    label: "Squad Registrations",
    columns: ["id", "team_name", "captain_name", "captain_email", "bgmi_uid", "status", "created_at"],
  },
  matches: {
    label: "Match Schedules",
    columns: ["id", "name", "map", "group_name", "status", "starts_at"],
  },
  teams: {
    label: "Teams Leaderboard",
    columns: ["id", "name", "short_name", "captain", "placement_points", "finishes", "wwcd"],
  },
};

function AdminDatabaseBrowser({
  snapshot,
  activeTab,
  setActiveTab,
  onDelete,
}: {
  snapshot?: AdminSnapshot;
  activeTab: AdminDataTab;
  setActiveTab: (tab: AdminDataTab) => void;
  onDelete: (table: "tournaments" | "announcements" | "registration_submissions" | "matches" | "teams", id: string) => void;
}) {
  const activeConfig = tableConfigs[activeTab];
  const rows = snapshot ? (snapshot[activeTab] as Array<Record<string, unknown>>) : [];

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            { key: "tournaments", label: "Tournaments" },
            { key: "registrations", label: "Registrations" },
            { key: "matches", label: "Matches" },
            { key: "announcements", label: "Announcements" },
            { key: "teams", label: "Teams Leaderboard" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`border px-3 py-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] ${
              activeTab === tab.key
                ? "border-green-300/50 bg-green-400/10 text-green-100"
                : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label} {snapshot ? `(${snapshot[tab.key]?.length ?? 0})` : ""}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto border border-white/10 bg-black/45">
        <table className="w-full min-w-[980px] text-left">
          <thead className="bg-white/[0.04] font-mono text-[0.62rem] uppercase tracking-[0.18em] text-slate-500">
            <tr>
              {activeConfig.columns.map((column) => (
                <th key={column} className="p-3">
                  {column.replaceAll("_", " ")}
                </th>
              ))}
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, index) => (
                <tr key={String(row.id ?? index)} className="border-t border-white/10">
                  {activeConfig.columns.map((column) => (
                    <td key={column} className="max-w-[18rem] p-3 align-top text-xs text-slate-200">
                      {formatAdminCell(row[column])}
                    </td>
                  ))}
                  <td className="p-3 align-top">
                    <button
                      type="button"
                      onClick={() =>
                        onDelete(
                          activeTab === "registrations"
                            ? "registration_submissions"
                            : (activeTab as "tournaments" | "announcements" | "matches" | "teams"),
                          String(row.id),
                        )
                      }
                      className="flex items-center gap-1 border border-red-400/50 bg-red-500/10 px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.14em] text-red-200 hover:bg-red-500 hover:text-black transition"
                    >
                      <Trash2 className="h-3 w-3" /> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td className="p-5 text-sm text-slate-400" colSpan={activeConfig.columns.length + 1}>
                  {snapshot ? "No rows in this table yet." : "Unlocking database snapshot..."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <p className="mt-3 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-slate-500">
        Snapshot: {snapshot ? formatUpdatedAt(snapshot.generatedAt) : "not loaded"}
      </p>
      {snapshot?.warnings?.length ? (
        <div className="mt-3 border border-orange-300/30 bg-orange-500/10 p-3 text-sm text-orange-100">
          {snapshot.warnings.map((warning) => (
            <p key={warning}>{warning}</p>
          ))}
        </div>
      ) : null}
    </div>
  );
}

function formatAdminCell(value: unknown) {
  if (Array.isArray(value)) return value.join(", ");
  if (value === null || value === undefined || value === "") return "-";
  if (typeof value === "boolean") return value ? "Yes" : "No";
  return String(value);
}

export function AdminPage() {
  const { data, refetch } = usePlatformData();

  return (
    <div className="pt-24 pb-16 px-4 lg:px-6 min-h-screen">
      <div className="mx-auto max-w-6xl">
        <AdminPanelModal
          data={data}
          open={true}
          onClose={() => {}}
          onChanged={() => void refetch()}
          inline={true}
        />
      </div>
    </div>
  );
}
