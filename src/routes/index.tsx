import { createFileRoute } from "@tanstack/react-router";
import type { FormEvent } from "react";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kos — Find what's past the milestone" },
      {
        name: "description",
        content:
          "Discover India's hidden villages, valleys and heritage sites — sorted by how far they are from wherever you're standing. In English, हिन्दी and ಕನ್ನಡ.",
      },
      { property: "og:title", content: "Kos — Find what's past the milestone" },
      {
        property: "og:description",
        content:
          "A travel app that starts with where you're standing and shows you the India that doesn't trend.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KosLanding,
});

type LanguageCode = "en" | "hi" | "kn";

const languageOptions: Array<{ code: LanguageCode; label: string; short: string }> = [
  { code: "en", label: "English", short: "EN" },
  { code: "hi", label: "हिन्दी", short: "हि" },
  { code: "kn", label: "ಕನ್ನಡ", short: "ಕ" },
];

const heroCopy: Record<
  LanguageCode,
  {
    kicker: string;
    titleStart: string;
    titleHighlight: string;
    body: string;
    note: string;
    primaryCta: string;
    secondaryCta: string;
    meta: string;
  }
> = {
  en: {
    kicker: "A travel app for the India you haven't seen",
    titleStart: "Find what's",
    titleHighlight: "past the milestone.",
    body:
      "The same 50 places keep showing up on every travel app. Kos maps the rest — villages, valleys, forts, waterfalls, heritage towns — and sorts them by how far they are from wherever you're standing right now.",
    note: "कोस · the old Indian unit of distance. The kos minar marked the road. We're marking what's beyond it.",
    primaryCta: "Explore near me →",
    secondaryCta: "How it works",
    meta: "Free · Works offline soon · English · हिन्दी · ಕನ್ನಡ",
  },
  hi: {
    kicker: "उस भारत के लिए यात्रा ऐप जिसे आपने अभी तक नहीं देखा",
    titleStart: "मील के पत्थर के",
    titleHighlight: "आगे क्या है खोजें.",
    body:
      "हर ट्रैवल ऐप पर वही 50 जगहें दिखती हैं। Kos बाकी जगहें दिखाता है — गांव, घाटियां, किले, झरने और विरासत शहर — और उन्हें आपकी मौजूदा जगह से दूरी के हिसाब से सजाता है।",
    note: "कोस · दूरी की पुरानी भारतीय इकाई। कोस मीनार रास्ता बताती थी। हम उसके आगे की जगहें दिखा रहे हैं।",
    primaryCta: "मेरे पास खोजें →",
    secondaryCta: "यह कैसे काम करता है",
    meta: "मुफ्त · ऑफलाइन जल्द · English · हिन्दी · ಕನ್ನಡ",
  },
  kn: {
    kicker: "ನೀವು ಇನ್ನೂ ನೋಡದ ಭಾರತದಿಗಾಗಿ ಪ್ರಯಾಣ ಆಪ್",
    titleStart: "ಮೈಲಿಗಲ್ಲಿನ",
    titleHighlight: "ಆಚೆಗೆ ಇರುವುದನ್ನು ಹುಡುಕಿ.",
    body:
      "ಪ್ರತಿ ಪ್ರಯಾಣ ಆಪ್‌ನಲ್ಲೂ ಅದೇ 50 ಸ್ಥಳಗಳು ಕಾಣಿಸುತ್ತವೆ. Kos ಉಳಿದ ಸ್ಥಳಗಳನ್ನು ತೋರಿಸುತ್ತದೆ — ಹಳ್ಳಿಗಳು, ಕಣಿವೆಗಳು, ಕೋಟೆಗಳು, ಜಲಪಾತಗಳು, ಪಾರಂಪರಿಕ ಪಟ್ಟಣಗಳು — ಮತ್ತು ನೀವು ಇರುವ ಸ್ಥಳದಿಂದ ದೂರದ ಪ್ರಕಾರ ಅವುಗಳನ್ನು ಸರಿಸುತ್ತದೆ.",
    note: "ಕೋಸ · ದೂರದ ಹಳೆಯ ಭಾರತೀಯ ಅಳತೆ. ಕೋಸ ಮಿನಾರ್ ದಾರಿಗೆ ಗುರುತು. ನಾವು ಅದರಾಚೆಯ ಸ್ಥಳಗಳನ್ನು ಗುರುತಿಸುತ್ತಿದ್ದೇವೆ.",
    primaryCta: "ನನ್ನ ಹತ್ತಿರ ಅನ್ವೇಷಿಸಿ →",
    secondaryCta: "ಹೇಗೆ ಕೆಲಸ ಮಾಡುತ್ತದೆ",
    meta: "ಉಚಿತ · ಆಫ್‌ಲೈನ್ ಶೀಘ್ರದಲ್ಲೇ · English · हिन्दी · ಕನ್ನಡ",
  },
};

/* --- Building blocks --- */

function Milestone({
  number,
  label,
  variant = "indigo",
}: {
  number: string;
  label: string;
  variant?: "indigo" | "cream";
}) {
  return (
    <div className={variant === "cream" ? "milestone milestone-cream" : "milestone"}>
      <span className="font-mono text-3xl font-semibold leading-none">{number}</span>
      <span className="mt-2 max-w-[8rem] text-center font-mono text-[0.62rem] uppercase tracking-[0.18em] opacity-85">
        {label}
      </span>
    </div>
  );
}

function KosMark({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 48" className={className} fill="none" aria-hidden="true">
      <path
        d="M20 2c-5 0-8 3-8 7v4h-3v3h3v3l-4 2v3h-3v22h30V24h-3v-3l-4-2v-3h3v-3h-3V9c0-4-3-7-8-7Z"
        fill="currentColor"
      />
      <circle cx="20" cy="10" r="1.8" fill="var(--color-marigold)" />
    </svg>
  );
}

/* --- Sections --- */

function Nav({
  activeLanguage,
  onLanguageChange,
}: {
  activeLanguage: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
}) {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-indigo)]/15 bg-[color:var(--color-cream)]/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3">
        <a href="#top" className="flex items-center gap-2">
          <KosMark className="h-7 w-6 text-[color:var(--color-indigo)]" />
          <div className="flex flex-col leading-none">
            <span className="font-display text-xl text-[color:var(--color-indigo)]">Kos</span>
            <span className="font-mono text-[0.55rem] uppercase tracking-[0.24em] text-[color:var(--color-vermillion)]">
              कोस · ಕೋಸ
            </span>
          </div>
        </a>
        <nav className="ml-auto hidden items-center gap-7 md:flex">
          {[
            ["How it works", "#how"],
            ["Discover", "#discover"],
            ["Languages", "#languages"],
            ["Coverage", "#coverage"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--color-indigo)]/80 hover:text-[color:var(--color-vermillion)]"
            >
              {label}
            </a>
          ))}
          <div className="flex gap-1 font-mono text-[0.65rem] font-medium" aria-label="Choose language">
            {languageOptions.map((language) => {
              const isActive = language.code === activeLanguage;
              return (
                <button
                  key={language.code}
                  type="button"
                  onClick={() => onLanguageChange(language.code)}
                  aria-pressed={isActive}
                  className={
                    isActive
                      ? "rounded-sm bg-[color:var(--color-indigo)] px-1.5 py-0.5 text-[color:var(--color-cream)]"
                      : "rounded-sm px-1.5 py-0.5 text-[color:var(--color-indigo)]/60 hover:bg-[color:var(--color-indigo)]/10 hover:text-[color:var(--color-indigo)]"
                  }
                >
                  <span className="sr-only">{language.label}</span>
                  {language.short}
                </button>
              );
            })}
          </div>
        </nav>
        <a href="#get" className="btn-vermillion text-sm">
          Explore near me →
        </a>
      </div>
    </header>
  );
}

function Hero({ activeLanguage }: { activeLanguage: LanguageCode }) {
  const copy = heroCopy[activeLanguage];

  return (
    <section id="top" className="paper-grain relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="section-label">{copy.kicker}</span>
          </div>

          <h1 className="mt-6 font-display text-5xl leading-[1.05] text-[color:var(--color-indigo)] md:text-7xl">
            {copy.titleStart}{" "}
            <span className="relative inline-block">
              <span className="relative z-10">{copy.titleHighlight}</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-[color:var(--color-marigold)]/70 md:h-4"
              />
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[color:var(--color-indigo)]/85">
            {copy.body}
          </p>

          <p className="mt-4 max-w-2xl font-mono text-sm text-[color:var(--color-indigo)]/70">
            {copy.note}
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#get" className="btn-vermillion">
              {copy.primaryCta}
            </a>
            <a href="#how" className="btn-outline-indigo">
              {copy.secondaryCta}
            </a>
          </div>

          <div className="mt-6 font-mono text-xs text-[color:var(--color-indigo)]/60">
            {copy.meta}
          </div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 md:mt-20">
          <Milestone number="51" label="Places · Karnataka" />
          <Milestone number="28" label="States seeded" />
          <Milestone number="3" label="Languages · EN · हि · ಕ" />
        </div>
      </div>

      <div className="absolute -right-24 top-16 hidden text-[color:var(--color-indigo)]/25 md:block">
        <svg width="380" height="380" viewBox="0 0 380 380" fill="none">
          <path
            d="M20 340 C 120 300, 80 200, 200 180 S 340 80, 360 20"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeDasharray="2 8"
            fill="none"
          />
          <circle cx="200" cy="180" r="4" fill="var(--color-vermillion)" />
          <circle cx="360" cy="20" r="4" fill="var(--color-vermillion)" />
          <circle cx="20" cy="340" r="4" fill="var(--color-vermillion)" />
        </svg>
      </div>
    </section>
  );
}

function HowItWorks() {
  const steps = [
    {
      n: "01",
      t: "Share your location",
      d: "Tap once. Kos reads your live GPS — nothing stored, nothing sold.",
    },
    {
      n: "02",
      t: "See what's actually near you",
      d: "Real places, real distances. Sorted from closest outward, not by paid listings.",
    },
    {
      n: "03",
      t: "Get there",
      d: "How to reach, permits, best season, and turn-by-turn directions from the exact spot you tapped from.",
    },
  ];
  return (
    <section id="how" className="paper-grain-deep border-y border-[color:var(--color-indigo)]/15">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <span className="section-label">How Kos works</span>
        <h2 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-[color:var(--color-indigo)] md:text-5xl">
          Three taps between you and somewhere you've never heard of.
        </h2>

        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {steps.map((s) => (
            <div key={s.n} className="border-l-2 border-[color:var(--color-vermillion)] pl-5">
              <div className="font-mono text-xs tracking-widest text-[color:var(--color-vermillion)]">
                Step {s.n}
              </div>
              <h3 className="mt-2 font-display text-2xl text-[color:var(--color-indigo)]">
                {s.t}
              </h3>
              <p className="mt-3 text-[color:var(--color-indigo)]/80">{s.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Discover() {
  const places = [
    { name: "Avani Kshetra", area: "Kolar", km: "68", type: "Heritage · Ramayana-linked hill temple", season: "Oct–Feb" },
    { name: "Muthyala Maduvu", area: "Anekal", km: "42", type: "Nature · Pearl-drop waterfall", season: "Jul–Nov" },
    { name: "Devarayanadurga", area: "Tumakuru", km: "74", type: "Heritage · Granite hill forts", season: "Oct–Mar" },
    { name: "Bilikal Rangaswamy Betta", area: "Kanakapura", km: "89", type: "Nature · Sholapith forest", season: "Sep–Feb" },
    { name: "Anthargange", area: "Kolar", km: "72", type: "Adventure · Cave-strewn hill", season: "Oct–Mar" },
    { name: "Hampi Byways", area: "Vijayanagara", km: "352", type: "Heritage · Off-circuit ruins", season: "Nov–Feb" },
  ];

  return (
    <section id="discover" className="paper-grain">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="section-label">A day in the app</span>
            <h2 className="mt-3 font-display text-4xl text-[color:var(--color-indigo)] md:text-5xl">
              What Kos looks like when you open it near Bengaluru.
            </h2>
          </div>
          <p className="max-w-md text-[color:var(--color-indigo)]/75">
            No feed. No influencers. Just places, and how far each one is from
            where your phone is right now.
          </p>
        </div>

        {/* Browser mockup */}
        <div className="mt-12 overflow-hidden rounded-md border border-[color:var(--color-indigo)]/20 bg-[color:var(--color-indigo)] shadow-[0_20px_60px_-20px_rgba(27,42,74,0.35)]">
          <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-vermillion)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-marigold)]" />
            <span className="h-2.5 w-2.5 rounded-full bg-[color:var(--color-pine)]" />
            <div className="ml-4 flex-1 rounded-sm bg-white/10 px-3 py-1 font-mono text-[0.7rem] text-[color:var(--color-cream)]/80">
              kos.travel / near-me · 📍 12.9716° N, 77.5946° E · Bengaluru
            </div>
            <div className="hidden gap-1 font-mono text-[0.65rem] text-[color:var(--color-cream)]/70 md:flex">
              <span className="rounded bg-[color:var(--color-marigold)] px-1.5 py-0.5 text-[color:var(--color-indigo)]">
                EN
              </span>
              <span className="px-1.5 py-0.5">हि</span>
              <span className="px-1.5 py-0.5">ಕ</span>
            </div>
          </div>

          <div className="grid gap-0 bg-[color:var(--color-cream)] md:grid-cols-[260px_1fr]">
            <aside className="hidden border-r border-[color:var(--color-indigo)]/15 p-5 md:block">
              <div className="section-label !text-[0.62rem]">Filter by</div>
              <ul className="mt-4 space-y-2 text-sm text-[color:var(--color-indigo)]/85">
                {[
                  ["Distance", "< 200 km"],
                  ["Type", "Heritage · Nature"],
                  ["Effort", "Weekend"],
                  ["Permits", "None required"],
                  ["Season", "Oct–Feb"],
                ].map(([k, v]) => (
                  <li
                    key={k}
                    className="flex items-center justify-between border-b border-dashed border-[color:var(--color-indigo)]/20 pb-2"
                  >
                    <span className="font-mono text-[0.7rem] uppercase tracking-widest text-[color:var(--color-indigo)]/60">
                      {k}
                    </span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
              <div className="stamp-border mt-6 bg-[color:var(--color-marigold)]/25 p-3 text-xs text-[color:var(--color-indigo)]">
                <div className="font-mono text-[0.62rem] uppercase tracking-widest">
                  Coverage near you
                </div>
                <div className="mt-1">Karnataka · deep</div>
                <div>Rest of India · seeded</div>
              </div>
            </aside>

            <div className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-display text-2xl text-[color:var(--color-indigo)]">
                    Near you, right now
                  </div>
                  <div className="mt-1 font-mono text-[0.7rem] uppercase tracking-widest text-[color:var(--color-indigo)]/60">
                    Sorted by live distance · 6 of 51
                  </div>
                </div>
                <div className="font-mono text-xs text-[color:var(--color-vermillion)]">
                  ● live GPS
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {places.map((p) => (
                  <div
                    key={p.name}
                    className="group border border-[color:var(--color-indigo)]/15 bg-[color:var(--color-cream)] p-4 transition-colors hover:border-[color:var(--color-vermillion)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="font-display text-lg text-[color:var(--color-indigo)]">
                          {p.name}
                        </div>
                        <div className="font-mono text-[0.65rem] uppercase tracking-widest text-[color:var(--color-indigo)]/60">
                          {p.area}
                        </div>
                      </div>
                      <div className="shrink-0 text-right">
                        <div className="font-mono text-2xl font-semibold text-[color:var(--color-vermillion)]">
                          {p.km}
                        </div>
                        <div className="font-mono text-[0.6rem] uppercase tracking-widest text-[color:var(--color-indigo)]/60">
                          km away
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-[color:var(--color-indigo)]/80">{p.type}</p>
                    <div className="mt-3 flex items-center justify-between font-mono text-[0.65rem] uppercase tracking-widest text-[color:var(--color-indigo)]/60">
                      <span>Best: {p.season}</span>
                      <span className="text-[color:var(--color-vermillion)]">Directions →</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Languages({
  activeLanguage,
  onLanguageChange,
}: {
  activeLanguage: LanguageCode;
  onLanguageChange: (language: LanguageCode) => void;
}) {
  const samples = [
    { lang: "en" as const, code: "EN", title: "English", head: "Places near you", body: "51 hand-picked spots across Karnataka, sorted by live distance." },
    { lang: "hi" as const, code: "हि", title: "हिन्दी", head: "आपके पास की जगहें", body: "कर्नाटक भर की ५१ चुनी हुई जगहें, आपकी दूरी के हिसाब से।" },
    { lang: "kn" as const, code: "ಕ", title: "ಕನ್ನಡ", head: "ನಿಮ್ಮ ಹತ್ತಿರದ ಸ್ಥಳಗಳು", body: "ಕರ್ನಾಟಕದಾದ್ಯಂತ ೫೧ ಆಯ್ದ ಸ್ಥಳಗಳು, ನಿಮ್ಮ ದೂರದ ಪ್ರಕಾರ." },
  ];
  return (
    <section id="languages" className="indigo-grain text-[color:var(--color-cream)]">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <span className="section-label !text-[color:var(--color-marigold)]">In your language</span>
        <h2 className="mt-3 max-w-3xl font-display text-4xl leading-tight md:text-5xl">
          The internet stopped being English.
          <br />
          So did we.
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-[color:var(--color-cream)]/85">
          Kos is trilingual from day one — because most people planning a
          weekend trip in India aren't planning it in English.
        </p>

        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {samples.map((s) => (
            <button
              key={s.code}
              type="button"
              onClick={() => onLanguageChange(s.lang)}
              aria-pressed={activeLanguage === s.lang}
              className={`border p-6 text-left transition-colors ${
                activeLanguage === s.lang
                  ? "border-[color:var(--color-marigold)] bg-[color:var(--color-marigold)]/15"
                  : "border-[color:var(--color-marigold)]/40 bg-[color:var(--color-indigo-soft)]/60 hover:border-[color:var(--color-marigold)]"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-sm bg-[color:var(--color-marigold)] font-mono text-sm font-semibold text-[color:var(--color-indigo)]">
                  {s.code}
                </span>
                <span className="font-display text-xl text-[color:var(--color-marigold)]">
                  {s.title}
                </span>
              </div>
              <div className="mt-5 font-display text-lg text-[color:var(--color-cream)]">
                {s.head}
              </div>
              <p className="mt-2 text-sm text-[color:var(--color-cream)]/80">{s.body}</p>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}

function Coverage() {
  const rows = [
    { r: "Karnataka", d: "Deep", n: "51 verified places · Ghats, coast, Deccan, North Karnataka heritage" },
    { r: "Kerala · Tamil Nadu · Goa", d: "Seeded", n: "Major places live · offbeat coverage rolling out" },
    { r: "Maharashtra · Rajasthan · MP", d: "Seeded", n: "Major places live · fort and heritage belts next" },
    { r: "Rest of India", d: "Seeded", n: "Every state has anchor places — full depth coming state by state" },
  ];
  return (
    <section id="coverage" className="paper-grain-deep border-y border-[color:var(--color-indigo)]/15">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <span className="section-label">Where Kos is live</span>
        <h2 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-[color:var(--color-indigo)] md:text-5xl">
          Karnataka first. Then the country, properly.
        </h2>
        <p className="mt-4 max-w-2xl text-[color:var(--color-indigo)]/80">
          We'd rather map one state so well you trust us with the rest, than
          spread thin across all 28 pretending we know.
        </p>

        <div className="mt-10 overflow-hidden border border-[color:var(--color-indigo)]/20 bg-[color:var(--color-cream)]">
          {rows.map((row, i) => (
            <div
              key={row.r}
              className={`grid grid-cols-[minmax(0,1.2fr)_auto_minmax(0,2fr)] items-center gap-4 px-5 py-4 ${
                i > 0 ? "border-t border-dashed border-[color:var(--color-indigo)]/20" : ""
              }`}
            >
              <div className="min-w-0 font-display text-lg text-[color:var(--color-indigo)]">
                {row.r}
              </div>
              <div
                className={`shrink-0 rounded-sm px-2 py-1 font-mono text-[0.62rem] uppercase tracking-widest ${
                  row.d === "Deep"
                    ? "bg-[color:var(--color-pine)] text-[color:var(--color-cream)]"
                    : "bg-[color:var(--color-marigold)]/30 text-[color:var(--color-indigo)]"
                }`}
              >
                {row.d}
              </div>
              <div className="min-w-0 text-sm text-[color:var(--color-indigo)]/80">{row.n}</div>
            </div>
          ))}
        </div>

        <p className="mt-6 font-mono text-xs text-[color:var(--color-indigo)]/60">
          → Missing your favourite corner of India? Tell us — user submissions
          open soon.
        </p>
      </div>
    </section>
  );
}

function Who() {
  const cards = [
    {
      t: "The weekend escapist",
      d: "Two days, one car, no idea where. Kos hands you five options between 40 and 200 km away.",
    },
    {
      t: "The slow traveller",
      d: "You've done Hampi and Coorg. Kos knows what's an hour past both of them, and whether it's worth it.",
    },
    {
      t: "The local rediscoverer",
      d: "You grew up somewhere. Kos shows you what's around it that you never bothered to visit.",
    },
  ];
  return (
    <section className="paper-grain">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <span className="section-label">Who Kos is for</span>
        <h2 className="mt-3 max-w-3xl font-display text-4xl text-[color:var(--color-indigo)] md:text-5xl">
          If you've ever opened Google Maps and thought "there has to be more."
        </h2>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {cards.map((c) => (
            <div
              key={c.t}
              className="border border-[color:var(--color-indigo)]/20 bg-[color:var(--color-cream)] p-6"
            >
              <h3 className="font-display text-xl text-[color:var(--color-indigo)]">{c.t}</h3>
              <p className="mt-3 text-sm text-[color:var(--color-indigo)]/80">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function GetTheApp() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent" | "error">("idle");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus("submitting");

    const form = event.currentTarget;
    const formData = new FormData(form);

    try {
      const response = await fetch("https://formspree.io/f/mgognqlb", {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Formspree submission failed");
      }

      form.reset();
      setStatus("sent");
    } catch {
      setStatus("error");
    }
  }

  return (
    <section id="get" className="indigo-grain text-[color:var(--color-cream)]">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
          <div>
            <span className="section-label !text-[color:var(--color-marigold)]">Start exploring</span>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
              The India that{" "}
              <span className="text-[color:var(--color-marigold)]">doesn't trend</span>
              <br /> is one tap away.
            </h2>
            <p className="mt-6 max-w-lg text-lg text-[color:var(--color-cream)]/85">
              Open Kos, share your location, and see what's actually near you.
              Free, no account needed to browse, and it works right in your
              browser.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a href="#" className="btn-vermillion">
                Open the web app →
              </a>
              <a href="#" className="btn-outline-indigo !border-[color:var(--color-marigold)] !text-[color:var(--color-marigold)] hover:!bg-[color:var(--color-marigold)] hover:!text-[color:var(--color-indigo)]">
                Get the Android app
              </a>
            </div>

            <p className="mt-6 font-mono text-xs text-[color:var(--color-cream)]/60">
              iOS + offline maps coming soon.
            </p>
          </div>

          <form
            action="https://formspree.io/f/mgognqlb"
            method="POST"
            onSubmit={handleSubmit}
            className="rounded-md border border-[color:var(--color-marigold)]/50 bg-[color:var(--color-indigo-soft)]/70 p-6 md:p-8"
          >
            <input type="hidden" name="_subject" value="New Kos launch notification signup" />
            <div className="font-display text-2xl text-[color:var(--color-marigold)]">
              Get notified when we launch in your state.
            </div>
            <p className="mt-2 text-sm text-[color:var(--color-cream)]/80">
              We ship state by state. Drop your email — we'll ping you the day
              your region goes deep.
            </p>
            <div className="mt-6 space-y-4">
              <label className="block">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-[color:var(--color-marigold)]">
                  Email
                </span>
                <input
                  name="email"
                  type="email"
                  required
                  maxLength={200}
                  className="mt-1 block w-full border-b border-[color:var(--color-marigold)]/40 bg-transparent px-1 py-2 text-[color:var(--color-cream)] outline-none placeholder:text-[color:var(--color-cream)]/40 focus:border-[color:var(--color-marigold)]"
                />
              </label>
              <label className="block">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-[color:var(--color-marigold)]">
                  State / region (optional)
                </span>
                <input
                  name="region"
                  type="text"
                  maxLength={100}
                  className="mt-1 block w-full border-b border-[color:var(--color-marigold)]/40 bg-transparent px-1 py-2 text-[color:var(--color-cream)] outline-none placeholder:text-[color:var(--color-cream)]/40 focus:border-[color:var(--color-marigold)]"
                />
              </label>
            </div>
            <button
              type="submit"
              disabled={status === "submitting" || status === "sent"}
              className="btn-vermillion mt-8 w-full disabled:opacity-60"
            >
              {status === "sent"
                ? "Got it — thanks ✓"
                : status === "error"
                  ? "Try again →"
                : status === "submitting"
                  ? "Sending…"
                  : "Keep me posted →"}
            </button>
            <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-widest text-[color:var(--color-cream)]/50">
              {status === "error"
                ? "Something went wrong. Please try again."
                : "Submissions go straight to the Kos Formspree inbox."}
            </p>
          </form>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[color:var(--color-ink)] text-[color:var(--color-cream)]/80">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <KosMark className="h-7 w-6 text-[color:var(--color-marigold)]" />
          <div className="leading-tight">
            <div className="font-display text-xl text-[color:var(--color-cream)]">Kos</div>
            <div className="font-mono text-[0.6rem] uppercase tracking-[0.24em] text-[color:var(--color-marigold)]">
              Find what's past the milestone.
            </div>
          </div>
        </div>
        <nav className="flex flex-wrap gap-6 font-mono text-xs uppercase tracking-widest">
          <a href="#how" className="hover:text-[color:var(--color-marigold)]">How it works</a>
          <a href="#discover" className="hover:text-[color:var(--color-marigold)]">Discover</a>
          <a href="#coverage" className="hover:text-[color:var(--color-marigold)]">Coverage</a>
          <a href="#" className="hover:text-[color:var(--color-marigold)]">Privacy</a>
          <a href="#" className="hover:text-[color:var(--color-marigold)]">Contact</a>
        </nav>
        <div className="font-mono text-[0.65rem] uppercase tracking-widest text-[color:var(--color-cream)]/50">
          © {new Date().getFullYear()} Kos · Bengaluru
        </div>
      </div>
    </footer>
  );
}

function KosLanding() {
  const [activeLanguage, setActiveLanguage] = useState<LanguageCode>("en");

  return (
    <div className="min-h-screen" lang={activeLanguage}>
      <Nav activeLanguage={activeLanguage} onLanguageChange={setActiveLanguage} />
      <main>
        <Hero activeLanguage={activeLanguage} />
        <HowItWorks />
        <Discover />
        <Languages activeLanguage={activeLanguage} onLanguageChange={setActiveLanguage} />
        <Coverage />
        <Who />
        <GetTheApp />
      </main>
      <Footer />
    </div>
  );
}
