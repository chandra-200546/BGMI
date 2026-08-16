import { AnimatePresence } from "framer-motion";
import { CheckCircle, Eye, ImagePlus, LockKeyhole, RefreshCw, SlidersHorizontal, Trash2, X, XCircle } from "lucide-react";
import { useEffect, useState, type ChangeEvent } from "react";
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
  const [adminKey, setAdminKey] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [activeTask, setActiveTask] = useState<
    "tournament" | "announcement" | "match" | "registrationStatus" | "roomCredentials" | "updateTournamentTimings"
  >("tournament");
  const [activeDataTab, setActiveDataTab] = useState<AdminDataTab>("registrations");
  const [snapshot, setSnapshot] = useState<AdminSnapshot | undefined>();
  const [status, setStatus] = useState("");
  const [busy, setBusy] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: "",
    body: "",
    category: "Tournament",
    pinned: true,
    tournamentId: "",
    tournamentName: "",
    mode: "Squad",
    prizePool: "",
    entryFee: "",
    maxTeams: "24",
    startsAt: "",
    registrationDeadline: "",
    maps: "Erangel, Miramar",
    mediaUrl: "",
    idpTimings: "1:23 PM, 1:54 PM, 2:24 PM, 3:02 PM",
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

  useEffect(() => {
    if (open) {
      setUnlocked(false);
      setAdminKey("");
      setStatus("");
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

  async function deleteRow(
    table: "tournaments" | "announcements" | "registration_submissions" | "matches" | "teams",
    id: string,
  ) {
    if (!confirm(`Are you sure you want to delete row ${id} from database?`)) return;
    setBusy(true);
    setStatus("");
    try {
      const actionMap = {
        tournaments: "deleteTournament",
        announcements: "deleteAnnouncement",
        registration_submissions: "deleteRegistration",
        matches: "deleteMatch",
        teams: "deleteTeam",
      } as const;

      const action = actionMap[table];
      const payloadKey =
        table === "tournaments"
          ? "tournamentId"
          : table === "announcements"
          ? "announcementId"
          : table === "registration_submissions"
          ? "registrationId"
          : table === "matches"
          ? "matchId"
          : "teamId";

      const response = await fetch("/api/admin/command", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ adminKey, action, [payloadKey]: id }),
      });
      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errorData.error ?? "Delete failed");
      }
      setStatus(`Row deleted successfully.`);
      await loadSnapshot();
      onChanged();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  async function updateRegistrationStatus(id: string, newStatus: string) {
    setBusy(true);
    setStatus("");
    try {
      const response = await fetch("/api/admin/command", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          adminKey,
          action: "registrationStatus",
          registrationId: id,
          registrationStatus: newStatus,
        }),
      });
      if (!response.ok) {
        const errorData = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(errorData.error ?? "Status update failed");
      }
      setStatus(`Registration status updated to ${newStatus}.`);
      await loadSnapshot();
      onChanged();
    } catch (error) {
      setStatus(error instanceof Error ? error.message : "Status update failed");
    } finally {
      setBusy(false);
    }
  }

  const contentUI = (
    <div className="space-y-6">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-sky-400/20 pb-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.24em] text-sky-400 font-bold">
            Real Supabase Operations Deck
          </p>
          <h2 className="font-display text-4xl font-bold uppercase text-white">
            Organizer Admin Panel
          </h2>
        </div>
        <button
          type="button"
          onClick={() => void loadSnapshot()}
          disabled={busy || !unlocked}
          className="flex items-center gap-2 border border-sky-400/30 bg-sky-500/10 px-3 py-2 font-mono text-xs uppercase tracking-[0.16em] text-sky-200 hover:bg-sky-400 hover:text-black disabled:opacity-40"
        >
          <RefreshCw className={`h-4 w-4 ${busy ? "animate-spin text-sky-400" : ""}`} /> Sync DB
        </button>
      </div>

      {!unlocked ? (
        <div className="hud-panel border border-sky-400/40 p-6 space-y-4">
          <div className="flex items-center gap-3 text-sky-400">
            <LockKeyhole className="h-6 w-6" />
            <span className="font-mono text-xs uppercase tracking-[0.2em] font-bold">
              Admin Security Verification Required
            </span>
          </div>
          <p className="font-mono text-xs text-slate-300">
            Enter the official admin passcode to access live challenge management, squad registration reviews, and database tables.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              void unlock();
            }}
            className="flex flex-col sm:flex-row gap-3"
          >
            <input
              type="password"
              autoFocus
              value={adminKey}
              onChange={(e) => setAdminKey(e.target.value)}
              placeholder="Enter admin passcode"
              className="flex-1 border border-sky-400/30 bg-slate-950 px-4 py-3 font-mono text-xs text-white outline-none focus:border-sky-400"
            />
            <button
              type="submit"
              disabled={busy}
              className="border border-sky-400 bg-sky-500/20 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-sky-100 hover:bg-sky-400 hover:text-black transition"
            >
              {busy ? "Verifying..." : "Unlock Deck"}
            </button>
          </form>
          {status ? (
            <p className="font-mono text-xs text-sky-200 border border-sky-400/30 bg-slate-950 p-3">
              {status}
            </p>
          ) : null}
        </div>
      ) : (
        <div className="space-y-6">
          {/* Action Tasks Navigation */}
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-6 font-mono text-[0.68rem] uppercase tracking-[0.14em]">
            {[
              { id: "tournament", label: "Create Challenge" },
              { id: "updateTournamentTimings", label: "Edit IDP Timings" },
              { id: "announcement", label: "Broadcast News" },
              { id: "match", label: "Schedule Match" },
              { id: "registrationStatus", label: "Queue Manager" },
              { id: "roomCredentials", label: "Room ID & Pass" },
            ].map((task) => (
              <button
                key={task.id}
                type="button"
                onClick={() =>
                  setActiveTask(
                    task.id as
                      | "tournament"
                      | "announcement"
                      | "match"
                      | "registrationStatus"
                      | "roomCredentials"
                      | "updateTournamentTimings",
                  )
                }
                className={`border p-3 text-center transition ${
                  activeTask === task.id
                    ? "border-sky-400 bg-sky-500/20 font-bold text-sky-100"
                    : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                }`}
              >
                {task.label}
              </button>
            ))}
          </div>

          {/* Active Task Form */}
          <div className="hud-panel border border-sky-400/25 p-5 space-y-4">
            <AdminTaskFields
              activeTask={activeTask}
              form={form}
              tournaments={data.tournaments}
              schedules={data.schedules}
              registrations={snapshot?.registrations ?? []}
              updateField={updateField}
            />
            <div className="pt-2 flex items-center justify-between border-t border-white/10">
              <span className="font-mono text-[0.68rem] uppercase tracking-[0.16em] text-slate-400">
                Action: {activeTask}
              </span>
              <button
                type="button"
                onClick={() => void runCommand()}
                disabled={busy}
                className="border border-sky-400 bg-sky-500/20 px-6 py-2.5 font-mono text-xs font-bold uppercase tracking-[0.2em] text-sky-100 hover:bg-sky-400 hover:text-black transition"
              >
                {busy ? "Executing..." : "Execute Command"}
              </button>
            </div>
            {status ? (
              <p className="font-mono text-xs text-sky-200 border border-sky-400/30 bg-slate-950 p-3">
                {status}
              </p>
            ) : null}
          </div>

          {/* Database Inspector */}
          <div className="hud-panel border border-sky-400/25 p-5">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-2xl font-bold uppercase text-white flex items-center gap-2">
                <SlidersHorizontal className="h-5 w-5 text-sky-400" /> Database Table Browser
              </h3>
              <span className="font-mono text-xs text-sky-400 uppercase tracking-widest font-bold">
                Connected to Supabase REST API
              </span>
            </div>

            <AdminDatabaseBrowser
              snapshot={snapshot}
              activeTab={activeDataTab}
              setActiveTab={setActiveDataTab}
              onDelete={deleteRow}
              onUpdateStatus={updateRegistrationStatus}
              onOpenScreenshot={(url) => setSelectedScreenshot(url)}
            />
          </div>
        </div>
      )}

      {/* Payment Screenshot / Media Modal */}
      <AnimatePresence>
        {selectedScreenshot ? (
          <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm">
            <div className="relative max-h-[90vh] max-w-3xl overflow-hidden border border-sky-400/60 bg-black p-6">
              <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-4">
                <h4 className="font-display text-2xl font-bold uppercase text-sky-400 flex items-center gap-2">
                  <ImagePlus className="h-6 w-6" /> Media Preview
                </h4>
                <button
                  type="button"
                  onClick={() => setSelectedScreenshot(null)}
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
              <div className="max-h-[70vh] overflow-auto flex items-center justify-center border border-white/10 bg-slate-950 p-2">
                <img
                  src={selectedScreenshot}
                  alt="Media Preview"
                  className="max-h-[65vh] w-auto object-contain"
                />
              </div>
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedScreenshot(null)}
                  className="border border-white/20 bg-white/10 px-5 py-2 font-mono text-xs uppercase text-white hover:bg-white/20"
                >
                  Close Preview
                </button>
              </div>
            </div>
          </div>
        ) : null}
      </AnimatePresence>
    </div>
  );

  if (inline) {
    return <div className="space-y-6">{contentUI}</div>;
  }

  return (
    <AnimatePresence>
      {open ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-md">
          <div className="relative max-h-[90vh] w-full max-w-5xl overflow-y-auto border border-sky-400/40 bg-slate-950 p-6">
            <div className="absolute right-4 top-4">
              <button
                type="button"
                onClick={onClose}
                className="border border-white/10 p-2 text-slate-300 hover:border-sky-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {contentUI}
          </div>
        </div>
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
  schedules: Array<{ id: string; title?: string; match?: string }>;
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
            placeholder="e.g. 50000"
          />
        </label>
        <label className="field-shell">
          Entry Fee (INR)
          <input
            type="text"
            value={String(form.entryFee)}
            onChange={(e) => updateField("entryFee", e.target.value)}
            placeholder="e.g. 100"
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
        <label className="field-shell">
          IDP Match Timings (Comma-separated)
          <input
            type="text"
            value={String(form.idpTimings)}
            onChange={(e) => updateField("idpTimings", e.target.value)}
            placeholder="1:23 PM, 1:54 PM, 2:24 PM, 3:02 PM"
          />
        </label>
        
        {/* Tournament Media (Poster / Banner Image Upload) */}
        <label className="field-shell md:col-span-2">
          Tournament Banner / Poster Media File (Image Upload)
          <span className="mt-1 flex items-center justify-between gap-3 border border-sky-400/30 bg-slate-950 px-4 py-3 text-slate-300 cursor-pointer">
            <span className="truncate text-sky-300 font-bold">
              {form.mediaUrl ? "Tournament Poster Attached ✓" : "Upload Banner/Poster Image File"}
            </span>
            <ImagePlus className="h-4 w-4 text-sky-400" />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(event: ChangeEvent<HTMLInputElement>) => {
                const file = event.target.files?.[0];
                if (!file) return;
                const reader = new FileReader();
                reader.onload = () => {
                  updateField("mediaUrl", reader.result as string);
                };
                reader.readAsDataURL(file);
              }}
            />
          </span>
        </label>

        {form.mediaUrl && String(form.mediaUrl).startsWith("data:image/") ? (
          <div className="md:col-span-2 border border-sky-400/40 p-2 bg-slate-950">
            <p className="font-mono text-[0.65rem] uppercase text-sky-400 mb-1">
              Attached Tournament Media Preview:
            </p>
            <img
              src={String(form.mediaUrl)}
              alt="Tournament Poster Preview"
              className="max-h-40 w-auto object-contain mx-auto border"
            />
          </div>
        ) : null}
      </div>
    );
  }

  if (activeTask === "updateTournamentTimings") {
    return (
      <div className="grid gap-4 md:grid-cols-2">
        <label className="field-shell">
          Select Challenge / Tournament
          <select
            value={String(form.tournamentId)}
            onChange={(e) => {
              const selectedTid = e.target.value;
              updateField("tournamentId", selectedTid);
              const found = tournaments.find((t) => t.id === selectedTid);
              if (found && found.idpTimings) {
                updateField("idpTimings", found.idpTimings);
              }
            }}
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
          IDP Match Timings (Comma-separated)
          <input
            type="text"
            value={String(form.idpTimings)}
            onChange={(e) => updateField("idpTimings", e.target.value)}
            placeholder="e.g. 1:23 PM, 1:54 PM, 2:24 PM, 3:02 PM"
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
                {m.title || m.match}
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
    columns: ["id", "name", "mode", "status", "prize_pool", "entry_fee", "media_url", "registered_teams", "max_teams", "starts_at"],
  },
  announcements: {
    label: "Announcements",
    columns: ["id", "title", "category", "pinned", "publish_at"],
  },
  registrations: {
    label: "Squad Registrations",
    columns: ["id", "team_name", "captain_name", "captain_email", "bgmi_uid", "players", "whatsapp", "payment_file_name", "status", "created_at"],
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
  onUpdateStatus,
  onOpenScreenshot,
}: {
  snapshot?: AdminSnapshot;
  activeTab: AdminDataTab;
  setActiveTab: (tab: AdminDataTab) => void;
  onDelete: (table: "tournaments" | "announcements" | "registration_submissions" | "matches" | "teams", id: string) => void;
  onUpdateStatus: (id: string, status: string) => void;
  onOpenScreenshot: (url: string) => void;
}) {
  const activeConfig = tableConfigs[activeTab];
  const rows = snapshot ? (snapshot[activeTab] as Array<Record<string, unknown>>) : [];

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2">
        {(
          [
            { key: "registrations", label: "Squad Registrations" },
            { key: "tournaments", label: "Tournaments" },
            { key: "matches", label: "Matches" },
            { key: "announcements", label: "Announcements" },
            { key: "teams", label: "Teams Leaderboard" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveTab(tab.key)}
            className={`border px-3.5 py-2 font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] ${
              activeTab === tab.key
                ? "border-sky-400 bg-sky-500/20 text-sky-100 font-bold"
                : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-slate-200"
            }`}
          >
            {tab.label} {snapshot ? `(${snapshot[tab.key]?.length ?? 0})` : ""}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto border border-sky-400/20 bg-slate-950">
        <table className="w-full min-w-[980px] text-left">
          <thead className="bg-white/[0.04] font-mono text-[0.62rem] uppercase tracking-[0.18em] text-slate-400">
            <tr>
              {activeConfig.columns.map((column) => (
                <th key={column} className="p-3">
                  {column.replaceAll("_", " ")}
                </th>
              ))}
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {rows.length ? (
              rows.map((row, index) => {
                const rowId = String(row.id ?? index);
                const isReg = activeTab === "registrations";

                return (
                  <tr key={rowId} className="border-t border-white/10 hover:bg-sky-950/20">
                    {activeConfig.columns.map((column) => {
                      const val = row[column];
                      const strVal = String(val ?? "");

                      if ((column === "payment_file_name" || column === "media_url") && strVal) {
                        return (
                          <td key={column} className="p-3 align-top">
                            <button
                              type="button"
                              onClick={() => onOpenScreenshot(strVal)}
                              className="inline-flex items-center gap-1.5 border border-sky-400/50 bg-sky-500/20 px-2.5 py-1 font-mono text-[0.65rem] font-bold uppercase tracking-wider text-sky-100 hover:bg-sky-400 hover:text-black transition"
                            >
                              <Eye className="h-3.5 w-3.5" /> View Media
                            </button>
                          </td>
                        );
                      }
                      if (column === "status" && isReg) {
                        const statusVal = String(val ?? "SUBMITTED");
                        return (
                          <td key={column} className="p-3 align-top">
                            <span
                              className={`inline-block border px-2 py-0.5 font-mono text-[0.65rem] font-bold uppercase tracking-wider ${
                                statusVal === "APPROVED"
                                  ? "border-sky-400 bg-sky-500/20 text-sky-200"
                                  : statusVal === "REJECTED"
                                  ? "border-red-400 bg-red-500/20 text-red-200"
                                  : "border-sky-400/50 bg-sky-500/10 text-sky-300"
                              }`}
                            >
                              {statusVal}
                            </span>
                          </td>
                        );
                      }
                      return (
                        <td key={column} className="max-w-[18rem] p-3 align-top text-xs text-slate-200 truncate">
                          {formatAdminCell(val)}
                        </td>
                      );
                    })}
                    <td className="p-3 align-top flex items-center gap-1.5 flex-wrap">
                      {isReg ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(rowId, "APPROVED")}
                            className="flex items-center gap-1 border border-sky-400/50 bg-sky-500/10 px-2 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-sky-200 hover:bg-sky-400 hover:text-black transition"
                            title="Approve & Confirm Slot"
                          >
                            <CheckCircle className="h-3 w-3" /> Approve
                          </button>
                          <button
                            type="button"
                            onClick={() => onUpdateStatus(rowId, "REJECTED")}
                            className="flex items-center gap-1 border border-red-400/50 bg-red-500/10 px-2 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-red-200 hover:bg-red-500 hover:text-black transition"
                            title="Reject Submission"
                          >
                            <XCircle className="h-3 w-3" /> Reject
                          </button>
                        </>
                      ) : null}
                      <button
                        type="button"
                        onClick={() =>
                          onDelete(
                            activeTab === "registrations"
                              ? "registration_submissions"
                              : (activeTab as "tournaments" | "announcements" | "matches" | "teams"),
                            rowId,
                          )
                        }
                        className="flex items-center gap-1 border border-red-400/50 bg-red-500/10 px-2 py-1 font-mono text-[0.62rem] font-bold uppercase tracking-[0.14em] text-red-200 hover:bg-red-500 hover:text-black transition"
                      >
                        <Trash2 className="h-3 w-3" /> Delete
                      </button>
                    </td>
                  </tr>
                );
              })
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
        <div className="mt-3 border border-sky-400/30 bg-sky-500/10 p-3 text-sm text-sky-100">
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
  const str = String(value);
  if (str.startsWith("data:image/")) return "[Image Media Data]";
  return str;
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
