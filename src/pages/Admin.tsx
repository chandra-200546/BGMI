import { AnimatePresence, motion } from "framer-motion";
import { LockKeyhole, RefreshCw, SlidersHorizontal, Trash2, Users, X } from "lucide-react";
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
}: {
  data: PlatformData;
  open: boolean;
  onClose: () => void;
  onChanged: () => void;
}) {
  const [adminKey, setAdminKey] = useState("admin");
  const [unlocked, setUnlocked] = useState(false);
  const [activeTask, setActiveTask] = useState<
    "announcement" | "tournament" | "match" | "registrationStatus"
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
    registrationId: "",
    registrationStatus: "APPROVED",
  });

  useEffect(() => {
    if (!form.tournamentId && data.tournaments[0]?.id) {
      setForm((current) => ({ ...current, tournamentId: data.tournaments[0].id }));
    }
  }, [data.tournaments, form.tournamentId]);

  function updateField(key: keyof typeof form, value: string | boolean) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function unlock() {
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/auth", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ adminKey }),
      });
      if (!response.ok) throw new Error("Wrong admin key. Use 'admin' or 'nexbattles2026'.");
      setUnlocked(true);
      setStatus("Admin command deck unlocked.");
      await loadSnapshot();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Unable to unlock admin panel");
    } finally {
      setBusy(false);
    }
  }

  async function loadSnapshot() {
    const response = await fetch("/api/admin/snapshot", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ adminKey }),
    });
    const payload = (await response.json()) as { data?: AdminSnapshot; error?: string };
    if (!response.ok || !payload.data) throw new Error(payload.error ?? "Unable to load database");
    setSnapshot(payload.data);
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
      setStatus(`${activeTask} command completed.`);
      await loadSnapshot();
      onChanged();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Admin command failed");
    } finally {
      setBusy(false);
    }
  }

  async function deleteItem(table: "tournaments" | "announcements" | "registration_submissions", id: string) {
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
      }

      const response = await fetch("/api/admin/command", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ adminKey, action: actionName, [payloadKey]: id }),
      });
      const payload = (await response.json()) as { error?: string };
      if (!response.ok) throw new Error(payload.error ?? "Deletion failed");
      setStatus(`Entry deleted successfully.`);
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
      value: `${data.tournaments.reduce((sum, item) => sum + item.registered, 0)} squads`,
      note: "Approve, waitlist, or reject captain submissions.",
      icon: Users,
    },
    {
      label: "Room controls",
      value: `${data.schedules.length} matches`,
      note: "Prepare room IDs, passwords, release windows, and check-ins.",
      icon: LockKeyhole,
    },
    {
      label: "Live ops",
      value: `${pendingSignal} slots`,
      note: "Monitor slot pressure, announcements, scoring, and disputes.",
      icon: SlidersHorizontal,
    },
  ];

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

            <motion.div
              initial={{ y: 34, opacity: 0, rotateX: 6 }}
              animate={{ y: 0, opacity: 1, rotateX: 0 }}
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
                <div className="border border-green-300/25 bg-green-400/10 px-4 py-3 font-mono text-xs uppercase tracking-[0.18em] text-green-100">
                  {unlocked ? "Credentials accepted" : "Credentials required"}
                </div>
              </div>

              {!unlocked ? (
                <div className="mt-6 grid gap-4 md:grid-cols-[1fr_auto]">
                  <label className="field-shell">
                    Admin Key / Password
                    <input
                      type="password"
                      value={adminKey}
                      onChange={(event) => setAdminKey(event.target.value)}
                      placeholder="Enter 'admin' or 'nexbattles2026'"
                    />
                  </label>
                  <button
                    type="button"
                    onClick={unlock}
                    disabled={busy}
                    className="self-end border border-orange-300/50 bg-orange-500/15 px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-orange-100 disabled:opacity-50"
                  >
                    {busy ? "Checking" : "Unlock Command Deck"}
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
                    <div className="mb-4 flex flex-wrap gap-2">
                      {(["tournament", "announcement", "match", "registrationStatus"] as const).map(
                        (task) => (
                          <button
                            key={task}
                            type="button"
                            onClick={() => setActiveTask(task)}
                            className={`border px-4 py-3 font-mono text-[0.68rem] font-bold uppercase tracking-[0.18em] ${
                              activeTask === task
                                ? "border-orange-300/60 bg-orange-500/15 text-orange-100"
                                : "border-white/10 bg-white/[0.03] text-slate-400"
                            }`}
                          >
                            {task === "tournament"
                              ? "+ Announce Challenge"
                              : task === "announcement"
                                ? "+ Global News"
                                : task === "match"
                                  ? "+ Match Schedule"
                                  : "Registration Queue"}
                          </button>
                        ),
                      )}
                    </div>

                    <AdminTaskFields
                      activeTask={activeTask}
                      form={form}
                      tournaments={data.tournaments}
                      registrations={snapshot?.registrations ?? []}
                      updateField={updateField}
                    />

                    <button
                      type="button"
                      onClick={runCommand}
                      disabled={busy}
                      className="mt-5 w-full border border-green-300/40 bg-green-400/10 px-6 py-4 font-mono text-xs font-bold uppercase tracking-[0.2em] text-green-100 disabled:opacity-50 hover:bg-green-500 hover:text-black transition"
                    >
                      {busy ? "Executing..." : `Publish / Update ${activeTask}`}
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
                        Manage all tournaments, announcements, and registrations stored in Supabase.
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
  registrations,
  updateField,
}: {
  activeTask: "announcement" | "tournament" | "match" | "registrationStatus";
  form: Record<string, string | boolean>;
  tournaments: Tournament[];
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
          Max Team Slots
          <input
            type="text"
            value={String(form.maxTeams)}
            onChange={(e) => updateField("maxTeams", e.target.value)}
            placeholder="24"
          />
        </label>
        <label className="field-shell">
          Maps Rotation
          <input
            type="text"
            value={String(form.maps)}
            onChange={(e) => updateField("maps", e.target.value)}
            placeholder="Erangel, Miramar, Sanhok"
          />
        </label>
        <label className="field-shell">
          Start Date & Time
          <input
            type="datetime-local"
            value={String(form.startsAt)}
            onChange={(e) => updateField("startsAt", e.target.value)}
          />
        </label>
        <label className="field-shell">
          Registration Deadline
          <input
            type="datetime-local"
            value={String(form.registrationDeadline)}
            onChange={(e) => updateField("registrationDeadline", e.target.value)}
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
            onChange={(event) => updateField("registrationId", event.target.value)}
          >
            <option value="">Select captain submission</option>
            {registrations.map((item) => (
              <option key={String(item.id)} value={String(item.id)}>
                {String(item.team_name)} (Capt. {String(item.captain_name)}) - {String(item.status)}
              </option>
            ))}
          </select>
        </label>
        <label className="field-shell">
          Update Verification Status
          <select
            value={String(form.registrationStatus)}
            onChange={(event) => updateField("registrationStatus", event.target.value)}
          >
            <option value="APPROVED">APPROVED (Payment Verified & Slot Locked)</option>
            <option value="UNDER_REVIEW">UNDER REVIEW (Checking Screenshot)</option>
            <option value="WAITLISTED">WAITLISTED</option>
            <option value="REJECTED">REJECTED</option>
          </select>
        </label>
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2">
      <label className="field-shell col-span-2">
        Target Tournament
        <select
          value={String(form.tournamentId)}
          onChange={(event) => updateField("tournamentId", event.target.value)}
        >
          <option value="">Select tournament</option>
          {tournaments.map((tournament) => (
            <option key={tournament.id} value={tournament.id}>
              {tournament.name}
            </option>
          ))}
        </select>
      </label>
      <label className="field-shell">
        Match Title
        <input
          type="text"
          value={String(form.matchName)}
          onChange={(e) => updateField("matchName", e.target.value)}
          placeholder="e.g. Group A Match 1"
        />
      </label>
      <label className="field-shell">
        Map Name
        <input
          type="text"
          value={String(form.matchMap)}
          onChange={(e) => updateField("matchMap", e.target.value)}
        />
      </label>
      <label className="field-shell">
        Group Name
        <input
          type="text"
          value={String(form.matchGroup)}
          onChange={(e) => updateField("matchGroup", e.target.value)}
        />
      </label>
      <label className="field-shell">
        Match Starts At
        <input
          type="datetime-local"
          value={String(form.matchStartsAt)}
          onChange={(e) => updateField("matchStartsAt", e.target.value)}
        />
      </label>
    </div>
  );
}

function AdminDatabaseBrowser({
  snapshot,
  activeTab,
  setActiveTab,
  onDelete,
}: {
  snapshot?: AdminSnapshot;
  activeTab: AdminDataTab;
  setActiveTab: (tab: AdminDataTab) => void;
  onDelete: (table: "tournaments" | "announcements" | "registration_submissions", id: string) => void;
}) {
  const tabs: Array<{ key: AdminDataTab; label: string; columns: string[] }> = [
    {
      key: "tournaments",
      label: "Tournaments & Scrims",
      columns: [
        "id",
        "name",
        "mode",
        "status",
        "prize_pool",
        "entry_fee",
        "max_teams",
        "registered_teams",
        "starts_at",
      ],
    },
    {
      key: "announcements",
      label: "Announcements",
      columns: ["id", "category", "title", "body", "pinned", "publish_at"],
    },
    {
      key: "registrations",
      label: "Squad Registrations",
      columns: [
        "id",
        "team_name",
        "captain_name",
        "captain_email",
        "bgmi_uid",
        "players",
        "whatsapp",
        "payment_file_name",
        "status",
      ],
    },
    {
      key: "teams",
      label: "Teams Leaderboard",
      columns: [
        "rank",
        "name",
        "short_name",
        "region",
        "captain",
        "matches_played",
        "wwcd",
        "placement_points",
        "finishes",
        "total_points",
      ],
    },
    {
      key: "matches",
      label: "Match Schedule",
      columns: ["name", "group_name", "map", "status", "starts_at"],
    },
  ];

  const activeConfig = tabs.find((tab) => tab.key === activeTab) ?? tabs[0];
  const rows = snapshot?.[activeConfig.key] ?? [];

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`border px-3 py-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] ${
              activeTab === tab.key
                ? "border-green-300/50 bg-green-400/10 text-green-100"
                : "border-white/10 bg-white/[0.03] text-slate-400"
            }`}
          >
            {tab.label} {snapshot ? `(${snapshot[tab.key].length})` : ""}
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
              {activeTab === "tournaments" || activeTab === "announcements" || activeTab === "registrations" ? (
                <th className="p-3">Action</th>
              ) : null}
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
                  {activeTab === "tournaments" || activeTab === "announcements" || activeTab === "registrations" ? (
                    <td className="p-3 align-top">
                      <button
                        type="button"
                        onClick={() =>
                          onDelete(
                            activeTab === "registrations"
                              ? "registration_submissions"
                              : (activeTab as "tournaments" | "announcements"),
                            String(row.id),
                          )
                        }
                        className="flex items-center gap-1 border border-red-400/50 bg-red-500/10 px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-[0.14em] text-red-200 hover:bg-red-500 hover:text-black transition"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </td>
                  ) : null}
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
    <div className="pt-24 pb-16 px-4 lg:px-6">
      <div className="mx-auto max-w-6xl">
        <AdminPanelModal
          data={data}
          open={true}
          onClose={() => {}}
          onChanged={() => void refetch()}
        />
      </div>
    </div>
  );
}
