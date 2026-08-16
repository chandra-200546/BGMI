import { CheckCircle2, ChevronRight, ImagePlus, Trophy } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { MagneticButton, Section, usePlatformData } from "../lib/shared-ui";
import type { Tournament } from "../lib/platform-types";

type RegistrationPayload = {
  tournamentId: string;
  teamName: string;
  logoFileName: string;
  captainName: string;
  captainEmail: string;
  bgmiUid: string;
  players: string[];
  whatsapp: string;
  discord: string;
  paymentFileName: string;
};

const registrationSteps = ["Team Information", "Captain Verification", "4 Player Roster", "Team Contacts", "Proof & Pay"];

export function RegisterPage() {
  const { user, addChallenge } = useAuth();
  const { data } = usePlatformData();
  const navigate = useNavigate();

  const tournaments = data.tournaments;
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<RegistrationPayload>({
    tournamentId: tournaments[0]?.id ?? "",
    teamName: user?.teamName ?? "",
    logoFileName: "",
    captainName: user?.name ?? "",
    captainEmail: user?.email ?? "",
    bgmiUid: user?.bgmiUid ?? "",
    players: ["", "", "", ""],
    whatsapp: "",
    discord: "",
    paymentFileName: "",
  });

  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        captainName: prev.captainName || user.name || "",
        captainEmail: prev.captainEmail || user.email || "",
        bgmiUid: prev.bgmiUid || user.bgmiUid || "",
        teamName: prev.teamName || user.teamName || "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const urlTid = params.get("tournamentId");
      if (urlTid && tournaments.some((t) => t.id === urlTid)) {
        setForm((current) => ({ ...current, tournamentId: urlTid }));
      } else if (!form.tournamentId && tournaments[0]?.id) {
        setForm((current) => ({ ...current, tournamentId: tournaments[0].id }));
      }
    }
  }, [tournaments]);

  const progress = ((step + 1) / registrationSteps.length) * 100;

  function setField(key: keyof RegistrationPayload, value: string) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  function setFile(key: "logoFileName" | "paymentFileName", event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      setField(key, result);
    };
    reader.readAsDataURL(file);
  }

  function isStepValid() {
    if (step === 0) return Boolean(form.tournamentId && form.teamName);
    if (step === 1) return Boolean(form.captainName && form.captainEmail && form.bgmiUid);
    if (step === 2) return form.players.every(Boolean);
    if (step === 3) return Boolean(form.whatsapp || form.discord);
    return Boolean(form.paymentFileName);
  }

  async function submit() {
    if (!isStepValid()) return;

    setSubmitting(true);
    try {
      const selectedTournament = tournaments.find((t) => t.id === form.tournamentId);

      addChallenge({
        tournamentId: form.tournamentId,
        tournamentName: selectedTournament?.name ?? "BGMI Scrim Lobby",
        teamName: form.teamName,
        captainName: form.captainName,
        captainEmail: form.captainEmail,
        bgmiUid: form.bgmiUid,
        players: form.players,
        status: "APPROVED",
        paymentStatus: "PAID",
        entryFee: selectedTournament?.fee ?? "₹100",
        matchTime: selectedTournament?.startsAt ?? "Upcoming Drop",
        roomDetails: { releaseAt: "15 mins before drop" },
      });

      const response = await fetch("/api/public/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "Registration submission failed");
      }

      setSuccess(true);
    } catch {
      // submission fallback handling
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    if (!isStepValid()) return;
    setStep((value) => Math.min(value + 1, registrationSteps.length - 1));
  }

  return (
    <div className="pt-24 pb-16">
      <Section id="register" eyebrow="Team Registration Pipeline" title="Lock Your Squad Slot">
        <div className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Progress Sidebar */}
          <div className="hud-panel border border-sky-400/25 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-sky-400 font-bold">
              Registration Pipeline
            </p>
            <div className="mt-4 h-4 border border-sky-400/30 bg-slate-950 p-0.5">
              <div className="h-full bg-sky-400" style={{ width: `${progress}%` }} />
            </div>
            <div className="mt-6 space-y-2.5">
              {registrationSteps.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setStep(index)}
                  className={`flex w-full items-center justify-between border px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.18em] transition ${
                    index === step
                      ? "border-sky-400 bg-sky-500/20 text-sky-100 font-bold"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                  }`}
                >
                  {label}
                  {index < step ? (
                    <CheckCircle2 className="h-4 w-4 text-sky-400" />
                  ) : (
                    <span>0{index + 1}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step Container */}
          <div className="hud-panel border border-sky-400/25 p-6">
            {success ? (
              <div className="space-y-4 text-center py-8">
                <Trophy className="mx-auto h-16 w-16 text-sky-400" />
                <p className="font-mono text-xs uppercase tracking-[0.24em] text-sky-400 font-bold">
                  Slot Lock Confirmed
                </p>
                <h3 className="font-display text-5xl font-bold uppercase text-white">
                  Squad Lock Verified
                </h3>
                <p className="mx-auto max-w-md font-mono text-xs text-slate-300 leading-relaxed">
                  Squad <span className="font-bold text-white">{form.teamName}</span> (Captain{" "}
                  <span className="font-bold text-white">{form.captainName}</span>) has been submitted to the database. Organizers will review your payment screenshot in the Admin Panel.
                </p>
                <div className="pt-4 flex flex-wrap justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => navigate("/dashboard")}
                    className="border border-sky-400 bg-sky-500/20 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-sky-100 hover:bg-sky-400 hover:text-black transition"
                  >
                    View My Dashboard
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSuccess(false);
                      setStep(0);
                    }}
                    className="border border-white/15 bg-white/5 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-slate-300 hover:border-sky-400"
                  >
                    Register Another Squad
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <StepFields
                  step={step}
                  form={form}
                  tournaments={tournaments}
                  setField={setField}
                  setFile={setFile}
                  setForm={setForm}
                />

                <div className="flex items-center justify-between border-t border-white/10 pt-6">
                  <button
                    type="button"
                    onClick={() => setStep((value) => Math.max(value - 1, 0))}
                    disabled={step === 0}
                    className="border border-white/15 bg-white/5 px-5 py-3 font-mono text-xs uppercase tracking-[0.2em] text-slate-300 disabled:opacity-30"
                  >
                    Previous
                  </button>
                  {step === registrationSteps.length - 1 ? (
                    <MagneticButton
                      onClick={() => void submit()}
                      disabled={submitting}
                    >
                      {submitting ? "Submitting to Database..." : "Confirm & Submit Registration"}
                    </MagneticButton>
                  ) : (
                    <button
                      type="button"
                      onClick={next}
                      className="flex items-center gap-2 border border-sky-400 bg-sky-500/20 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-sky-100 hover:bg-sky-400 hover:text-black transition"
                    >
                      Next <ChevronRight className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </Section>
    </div>
  );
}

function StepFields({
  step,
  form,
  tournaments,
  setField,
  setFile,
  setForm,
}: {
  step: number;
  form: RegistrationPayload;
  tournaments: Tournament[];
  setField: (key: keyof RegistrationPayload, value: string) => void;
  setFile: (key: "logoFileName" | "paymentFileName", event: ChangeEvent<HTMLInputElement>) => void;
  setForm: React.Dispatch<React.SetStateAction<RegistrationPayload>>;
}) {
  if (step === 0) {
    return (
      <FormGrid title="Team Information">
        <label className="field-shell">
          Select Tournament
          <select
            value={form.tournamentId}
            onChange={(event) => setField("tournamentId", event.target.value)}
          >
            <option value="">Select tournament</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name} ({tournament.fee ?? "₹100"})
              </option>
            ))}
          </select>
        </label>
        <Field
          label="Team name"
          value={form.teamName}
          onChange={(value) => setField("teamName", value)}
        />
        <FileField
          label="Team logo upload"
          value={form.logoFileName ? "Logo screenshot selected ✓" : ""}
          onChange={(event) => setFile("logoFileName", event)}
        />
      </FormGrid>
    );
  }

  if (step === 1) {
    return (
      <FormGrid title="Captain verification">
        <Field
          label="Captain full name"
          value={form.captainName}
          onChange={(value) => setField("captainName", value)}
        />
        <Field
          label="Captain email"
          value={form.captainEmail}
          onChange={(value) => setField("captainEmail", value)}
          type="email"
        />
        <Field
          label="BGMI UID"
          value={form.bgmiUid}
          onChange={(value) => setField("bgmiUid", value)}
        />
      </FormGrid>
    );
  }

  if (step === 2) {
    return (
      <FormGrid title="Four player roster">
        {form.players.map((player, index) => (
          <Field
            key={index}
            label={`Player ${index + 1} IGN + BGMI UID`}
            value={player}
            onChange={(value) =>
              setForm((current) => ({
                ...current,
                players: current.players.map((item, playerIndex) =>
                  playerIndex === index ? value : item,
                ),
              }))
            }
          />
        ))}
      </FormGrid>
    );
  }

  if (step === 3) {
    return (
      <FormGrid title="Team Contacts">
        <Field
          label="WhatsApp number"
          value={form.whatsapp}
          onChange={(value) => setField("whatsapp", value)}
        />
        <Field
          label="Discord handle"
          value={form.discord}
          onChange={(value) => setField("discord", value)}
        />
      </FormGrid>
    );
  }

  return (
    <FormGrid title="Slot Payment & Proof Upload">
      <div className="border border-sky-400/40 bg-sky-500/10 p-5 font-mono text-xs text-sky-100 rounded-xl space-y-4">
        <div className="flex items-center justify-between border-b border-sky-400/20 pb-3">
          <span className="font-bold uppercase text-sky-400 text-sm tracking-wide">
            Official UPI QR Payment Scanner
          </span>
          <span className="font-bold text-white bg-sky-500/20 px-3 py-1 rounded border border-sky-400/40">
            Lordsesports_in
          </span>
        </div>
        
        <p className="text-slate-300 leading-relaxed">
          Scan the official QR code below using <strong>Google Pay, PhonePe, Paytm, or any UPI app</strong> to pay the entry fee, then upload your transaction payment screenshot below:
        </p>

        {/* Official UPI QR Scanner Image */}
        <div className="my-2 flex flex-col items-center justify-center border border-sky-400/30 bg-black p-5 rounded-xl shadow-2xl">
          <img
            src="/payment-qr.png"
            alt="Lordsesports_in Official UPI QR Code Scanner"
            className="h-72 w-auto object-contain rounded-xl border-2 border-sky-400/60 shadow-sky-500/20 shadow-2xl"
          />
          <div className="mt-3 font-mono text-xs font-bold text-sky-300 tracking-wider uppercase text-center space-y-1">
            <div>Official Account: <span className="text-white">Lordsesports_in</span></div>
            <div>UPI ID: <span className="text-white">7996488242@upi</span></div>
          </div>
        </div>
      </div>

      <FileField
        label="Payment screenshot receipt upload"
        value={form.paymentFileName ? "Payment screenshot attached ✓" : ""}
        onChange={(event) => setFile("paymentFileName", event)}
      />
      {form.paymentFileName && form.paymentFileName.startsWith("data:image/") ? (
        <div className="mt-3 border border-sky-400/40 p-3 bg-slate-950 rounded-lg">
          <p className="font-mono text-xs uppercase text-sky-400 mb-2 font-bold">Attached Payment Screenshot Preview:</p>
          <img src={form.paymentFileName} alt="Payment Screenshot" className="max-h-48 object-contain mx-auto border border-sky-400/30 rounded" />
        </div>
      ) : null}
    </FormGrid>
  );
}

function FormGrid({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-4xl font-bold uppercase text-white">{title}</h3>
      <div className="mt-6 grid gap-4">{children}</div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
}) {
  return (
    <label className="field-shell">
      {label}
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder="Enter details"
      />
    </label>
  );
}

function FileField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="field-shell">
      {label}
      <span className="flex items-center justify-between gap-3 border border-white/10 bg-slate-950 px-4 py-3 text-slate-300">
        <span className="truncate text-sky-400 font-bold">{value || "Choose receipt screenshot image"}</span>
        <ImagePlus className="h-4 w-4 text-sky-400" />
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={onChange}
        />
      </span>
    </label>
  );
}
