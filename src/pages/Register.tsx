import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronRight, ImagePlus, ShieldCheck, Trophy, Upload, User } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../lib/auth-context";
import { MagneticButton, Section, usePlatformData, useSoundDesign } from "../lib/shared-ui";
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

const registrationSteps = ["Squad", "Captain", "Roster", "Comms", "Proof & Pay"];

export function RegisterPage() {
  const { user, addChallenge } = useAuth();
  const { data } = usePlatformData();
  const sound = useSoundDesign();
  const navigate = useNavigate();

  const tournaments = data.tournaments;
  const [step, setStep] = useState(0);
  const [shake, setShake] = useState(false);
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
    if (!form.tournamentId && tournaments[0]?.id) {
      setForm((current) => ({ ...current, tournamentId: tournaments[0].id }));
    }
  }, [form.tournamentId, tournaments]);

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

  function failValidation() {
    setShake(true);
    window.setTimeout(() => setShake(false), 450);
  }

  async function submit() {
    if (!isStepValid()) {
      failValidation();
      return;
    }

    setSubmitting(true);
    try {
      const selectedTournament = tournaments.find((t) => t.id === form.tournamentId);

      // Record in user context if logged in or default
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

      // Submit squad registration to Supabase database
      const response = await fetch("/api/public/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        const payload = (await response.json().catch(() => ({}))) as { error?: string };
        throw new Error(payload.error ?? "Registration submission failed");
      }

      sound.play("victory");
      setSuccess(true);
    } catch {
      failValidation();
    } finally {
      setSubmitting(false);
    }
  }

  function next() {
    if (!isStepValid()) {
      failValidation();
      return;
    }
    setStep((value) => Math.min(value + 1, registrationSteps.length - 1));
  }

  return (
    <div className="pt-24 pb-16">
      <Section id="register" eyebrow="Team registration pipeline" title="Lock your squad slot.">
        <div data-weapon-reload className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          {/* Progress Sidebar */}
          <div data-gsap-reveal className="clip-panel hud-panel p-6">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-green-300">
              Registration Pipeline
            </p>
            <div className="mt-4 h-5 border border-orange-300/30 bg-black/60 p-1">
              <motion.div className="health-fill h-full" animate={{ width: `${progress}%` }} />
            </div>
            <div className="mt-6 space-y-3">
              {registrationSteps.map((label, index) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setStep(index)}
                  className={`flex w-full items-center justify-between border px-4 py-3 text-left font-mono text-xs uppercase tracking-[0.18em] transition ${
                    index === step
                      ? "border-orange-300/60 bg-orange-500/15 text-orange-100"
                      : "border-white/10 bg-white/[0.03] text-slate-400 hover:text-white"
                  }`}
                >
                  {label}
                  {index < step ? (
                    <CheckCircle2 className="h-4 w-4 text-green-300" />
                  ) : (
                    <span>0{index + 1}</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Step Container */}
          <motion.div
            data-gsap-reveal
            className={`clip-panel hud-panel p-6 ${shake ? "shake-error" : ""}`}
          >
            <AnimatePresence mode="wait">
              {success ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-4 text-center py-8"
                >
                  <Trophy className="mx-auto h-16 w-16 text-orange-400 animate-bounce" />
                  <p className="font-mono text-xs uppercase tracking-[0.24em] text-green-300">
                    Slot Lock Confirmed
                  </p>
                  <h3 className="font-display text-5xl font-bold uppercase text-white">
                    Squad Lock Verified
                  </h3>
                  <p className="mx-auto max-w-md font-mono text-xs text-slate-300 leading-relaxed">
                    Squad <span className="font-bold text-white">{form.teamName}</span> (Captain{" "}
                    <span className="font-bold text-white">{form.captainName}</span>) has been submitted to the Supabase database. Organizers will review your payment screenshot in the Admin Panel.
                  </p>
                  <div className="pt-4 flex flex-wrap justify-center gap-3">
                    <button
                      type="button"
                      onClick={() => navigate("/dashboard")}
                      className="border border-green-400 bg-green-500/20 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-green-100 hover:bg-green-500 hover:text-black transition"
                    >
                      View My Dashboard
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSuccess(false);
                        setStep(0);
                      }}
                      className="border border-white/15 bg-white/5 px-6 py-3 font-mono text-xs uppercase tracking-[0.2em] text-slate-300 hover:border-orange-400"
                    >
                      Register Another Squad
                    </button>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key={step}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="space-y-6"
                >
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
                        playSound={sound.play}
                        onClick={() => void submit()}
                        disabled={submitting}
                      >
                        {submitting ? "Submitting to Database..." : "Confirm & Submit Registration"}
                      </MagneticButton>
                    ) : (
                      <button
                        type="button"
                        onClick={next}
                        className="flex items-center gap-2 border border-orange-400/60 bg-orange-500/20 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-orange-100 hover:bg-orange-500 hover:text-black transition"
                      >
                        Next <ChevronRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
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
      <FormGrid title="Squad Profile">
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
      <FormGrid title="Comms channel">
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
      <div className="border border-orange-400/40 bg-orange-500/10 p-4 font-mono text-xs text-orange-100">
        <span className="font-bold uppercase block text-orange-300">UPI Slot Payment</span>
        Transfer entry fee to UPI ID <span className="font-bold text-white">7996488242@upi</span> or <span className="font-bold text-white">nexbattles@upi</span>, then upload your transaction screenshot below.
      </div>
      <FileField
        label="Payment screenshot receipt upload"
        value={form.paymentFileName ? "Payment screenshot attached ✓" : ""}
        onChange={(event) => setFile("paymentFileName", event)}
      />
      {form.paymentFileName && form.paymentFileName.startsWith("data:image/") ? (
        <div className="mt-3 border border-green-400/30 p-2 bg-black/60">
          <p className="font-mono text-[0.65rem] uppercase text-green-300 mb-1">Attached Screenshot Preview:</p>
          <img src={form.paymentFileName} alt="Payment Screenshot" className="max-h-36 object-contain mx-auto border" />
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
      <span className="flex items-center justify-between gap-3 border border-white/10 bg-black/55 px-4 py-3 text-slate-300">
        <span className="truncate text-green-300 font-bold">{value || "Choose receipt screenshot image"}</span>
        <ImagePlus className="h-4 w-4 text-orange-300" />
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
