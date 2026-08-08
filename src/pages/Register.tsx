import { AnimatePresence, motion } from "framer-motion";
import { CheckCircle2, ChevronRight, ImagePlus, Trophy, Upload } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type ReactNode } from "react";
import {
  MagneticButton,
  Section,
  usePlatformData,
  useSoundDesign,
} from "../lib/shared-ui";
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

const registrationSteps = ["Squad", "Captain", "Roster", "Comms", "Proof"];

export function RegisterPage() {
  const { data } = usePlatformData();
  const sound = useSoundDesign();
  const tournaments = data.tournaments;

  const [step, setStep] = useState(0);
  const [shake, setShake] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [form, setForm] = useState<RegistrationPayload>({
    tournamentId: tournaments[0]?.id ?? "",
    teamName: "",
    logoFileName: "",
    captainName: "",
    captainEmail: "",
    bgmiUid: "",
    players: ["", "", "", ""],
    whatsapp: "",
    discord: "",
    paymentFileName: "",
  });

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
    setField(key, event.target.files?.[0]?.name ?? "");
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
      const response = await fetch("/api/public/register", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify(form),
      });
      if (!response.ok) throw new Error("Registration API rejected the submission");
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
    <div className="pt-20">
      <Section id="register" eyebrow="Team registration" title="Lock your squad.">
        <div data-weapon-reload className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr]">
          <div data-gsap-reveal className="clip-panel hud-panel p-6">
            <p className="font-mono text-xs uppercase tracking-[0.22em] text-green-300">
              Health bar progress
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

          <motion.div
            data-gsap-reveal
            className={`clip-panel hud-panel p-6 ${shake ? "shake-error" : ""}`}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -48 }}
                transition={{ duration: 0.24 }}
              >
                <RegistrationStep
                  step={step}
                  form={form}
                  tournaments={tournaments}
                  setField={setField}
                  setFile={setFile}
                  setForm={setForm}
                />
              </motion.div>
            </AnimatePresence>

            <div className="mt-8 flex flex-wrap justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep((value) => Math.max(0, value - 1))}
                className="border border-white/15 bg-white/5 px-5 py-3 font-mono text-xs font-bold uppercase tracking-[0.18em] text-white disabled:opacity-35"
                disabled={step === 0}
              >
                Back
              </button>
              {step === registrationSteps.length - 1 ? (
                <MagneticButton
                  onClick={submit}
                  playSound={sound.play}
                  sound="reload"
                  className={submitting ? "opacity-70" : ""}
                >
                  {submitting ? "Submitting" : "Submit Squad"} <Upload className="h-5 w-5" />
                </MagneticButton>
              ) : (
                <MagneticButton onClick={next} playSound={sound.play} sound="reload">
                  Continue <ChevronRight className="h-5 w-5" />
                </MagneticButton>
              )}
            </div>
          </motion.div>
        </div>

        <AnimatePresence>
          {success ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[90] grid place-items-center bg-black/80 px-4 backdrop-blur-md"
            >
              <div className="victory-confetti" />
              <motion.div
                initial={{ scale: 0.8, rotateX: -16 }}
                animate={{ scale: 1, rotateX: 0 }}
                className="clip-panel hud-panel max-w-lg p-8 text-center"
              >
                <Trophy className="mx-auto h-14 w-14 text-orange-300" />
                <h3 className="mt-4 font-display text-6xl font-bold uppercase text-white">
                  Victory Queue
                </h3>
                <p className="mt-3 text-slate-300">
                  Your registration entered the live review pipeline. Organizer approval and room
                  alerts will use the contact details you submitted.
                </p>
                <button
                  type="button"
                  onClick={() => setSuccess(false)}
                  className="mt-6 border border-green-300/40 bg-green-400/10 px-6 py-3 font-mono text-xs font-bold uppercase tracking-[0.2em] text-green-100"
                >
                  Continue
                </button>
              </motion.div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </Section>
    </div>
  );
}

function RegistrationStep({
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
      <FormGrid title="Squad identity">
        <label className="field-shell">
          Tournament
          <select
            value={form.tournamentId}
            onChange={(event) => setField("tournamentId", event.target.value)}
          >
            <option value="">Select live tournament</option>
            {tournaments.map((tournament) => (
              <option key={tournament.id} value={tournament.id}>
                {tournament.name}
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
          value={form.logoFileName}
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
      <FormGrid title="Four player slots">
        {form.players.map((player, index) => (
          <Field
            key={index}
            label={`Player ${index + 1} IGN + UID`}
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
    <FormGrid title="Payment proof">
      <FileField
        label="Payment screenshot upload"
        value={form.paymentFileName}
        onChange={(event) => setFile("paymentFileName", event)}
      />
      <div className="border border-orange-300/25 bg-orange-500/10 p-4 text-sm text-orange-50">
        Screenshots are queued as registration evidence. Connect Supabase Storage later for full
        binary file storage; the production API already records this submission metadata.
      </div>
    </FormGrid>
  );
}

function FormGrid({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h3 className="font-display text-5xl font-bold uppercase text-white">{title}</h3>
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
        <span className="truncate">{value || "Choose file"}</span>
        <ImagePlus className="h-4 w-4 text-orange-300" />
      </span>
      <input className="sr-only" type="file" accept="image/*" onChange={onChange} />
    </label>
  );
}
