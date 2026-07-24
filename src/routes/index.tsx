import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Kos — Find what's past the milestone" },
      {
        name: "description",
        content:
          "India-focused travel discovery for the villages, valleys, and heritage sites mainstream apps miss. Investor page.",
      },
      { property: "og:title", content: "Kos — Find what's past the milestone" },
      {
        property: "og:description",
        content:
          "A trilingual travel discovery platform mapping India's hidden, offbeat destinations with live distance from wherever you stand.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: KosLanding,
});

/* --- Small building blocks --- */

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
      <span
        className="mt-2 max-w-[8rem] text-center font-mono text-[0.62rem] uppercase tracking-[0.18em] opacity-85"
      >
        {label}
      </span>
    </div>
  );
}

function KosMark({ className = "" }: { className?: string }) {
  // Stylized kos-minar mark
  return (
    <svg
      viewBox="0 0 40 48"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M20 2c-5 0-8 3-8 7v4h-3v3h3v3l-4 2v3h-3v22h30V24h-3v-3l-4-2v-3h3v-3h-3V9c0-4-3-7-8-7Z"
        fill="currentColor"
      />
      <circle cx="20" cy="10" r="1.8" fill="var(--color-marigold)" />
    </svg>
  );
}

/* --- Sections --- */

function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-[color:var(--color-indigo)]/15 backdrop-blur-md bg-[color:var(--color-cream)]/85">
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
            ["Problem", "#problem"],
            ["Product", "#product"],
            ["Why now", "#why-now"],
            ["Roadmap", "#roadmap"],
            ["Model", "#model"],
            ["Team", "#team"],
          ].map(([label, href]) => (
            <a
              key={href}
              href={href}
              className="font-mono text-xs uppercase tracking-[0.2em] text-[color:var(--color-indigo)]/80 hover:text-[color:var(--color-vermillion)]"
            >
              {label}
            </a>
          ))}
        </nav>
        <a href="#contact" className="btn-vermillion text-sm">
          Request the deck
        </a>
      </div>
    </header>
  );
}

function Hero() {
  return (
    <section id="top" className="paper-grain relative overflow-hidden">
      <div className="mx-auto max-w-6xl px-5 pt-16 pb-24 md:pt-24 md:pb-32">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3">
            <span className="section-label">Investor overview · 2026</span>
            <span className="h-px w-16 bg-[color:var(--color-vermillion)]/50" />
          </div>

          <h1 className="mt-6 font-display text-5xl leading-[1.05] text-[color:var(--color-indigo)] md:text-7xl">
            Find what's{" "}
            <span className="relative inline-block">
              <span className="relative z-10">past the milestone.</span>
              <span
                aria-hidden
                className="absolute inset-x-0 bottom-1 -z-0 h-3 bg-[color:var(--color-marigold)]/70 md:h-4"
              />
            </span>
          </h1>

          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-[color:var(--color-indigo)]/85">
            Every travel app in India shows you the same 200 places. Kos maps the other
            ones — the villages, valleys, heritage sites, and natural wonders that
            actually deserve the trip — and tells you exactly how far each is from
            wherever you happen to be standing.
          </p>

          <p className="mt-4 max-w-2xl font-mono text-sm text-[color:var(--color-indigo)]/70">
            कोस · the old Indian unit of distance. The kos minar marked the road.
            We're marking what's beyond it.
          </p>

          <div className="mt-10 flex flex-wrap items-center gap-4">
            <a href="#contact" className="btn-vermillion">
              Request the deck →
            </a>
            <a href="#product" className="btn-outline-indigo">
              See the product
            </a>
          </div>
        </div>

        <div className="mt-16 grid grid-cols-3 gap-4 sm:gap-8 md:mt-20">
          <Milestone number="51" label="Places mapped · Karnataka" />
          <Milestone number="28" label="States seeded" />
          <Milestone number="3" label="Languages · EN · हि · ಕ" />
        </div>
      </div>

      {/* decorative dashed route */}
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

function Problem() {
  return (
    <section id="problem" className="paper-grain-deep border-y border-[color:var(--color-indigo)]/15">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <span className="section-label">01 · The problem</span>
        <div className="mt-6 grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-16">
          <div>
            <h2 className="font-display text-4xl leading-tight text-[color:var(--color-indigo)] md:text-5xl">
              India has ~650,000 villages.
              <br />
              Your travel app shows you 200 places.
            </h2>
            <p className="mt-6 text-lg leading-relaxed text-[color:var(--color-indigo)]/85">
              Discovery on every mainstream travel platform collapses to the same
              handful of destinations, repeated across every listicle and every feed.
              The country's actual depth — heritage belts, tribal villages, coastal
              hamlets, riverine valleys, monolithic hills — is invisible to the
              people who want to go there.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-[color:var(--color-indigo)]/85">
              Meanwhile domestic tourism is one of the fastest growing travel
              segments in the world, and "offbeat travel" search intent in India has
              compounded post-pandemic. There is no dedicated product serving it well.
            </p>
          </div>

          <div className="space-y-4">
            {[
              ["~200", "Destinations dominating every travel app in India"],
              ["~650K", "Villages in India, most invisible to travel discovery"],
              ["#1", "Fastest-growing travel segment: domestic Indian travel"],
            ].map(([n, t]) => (
              <div
                key={t}
                className="stamp-border flex items-center gap-5 bg-[color:var(--color-cream)] p-5"
              >
                <span className="font-mono text-3xl font-semibold text-[color:var(--color-vermillion)]">
                  {n}
                </span>
                <span className="text-sm leading-snug text-[color:var(--color-indigo)]/85">
                  {t}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Product() {
  return (
    <section id="product" className="paper-grain">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <span className="section-label">02 · The product</span>
            <h2 className="mt-3 font-display text-4xl text-[color:var(--color-indigo)] md:text-5xl">
              A travel app that starts with where you're standing.
            </h2>
          </div>
          <p className="max-w-md text-[color:var(--color-indigo)]/75">
            Live location, real distances, and place detail written for people
            actually planning a trip — not for SEO.
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
              <span className="rounded bg-[color:var(--color-marigold)] px-1.5 py-0.5 text-[color:var(--color-indigo)]">EN</span>
              <span className="px-1.5 py-0.5">हि</span>
              <span className="px-1.5 py-0.5">ಕ</span>
            </div>
          </div>

          <div className="grid gap-0 bg-[color:var(--color-cream)] md:grid-cols-[260px_1fr]">
            {/* filters */}
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
                  <li key={k} className="flex items-center justify-between border-b border-dashed border-[color:var(--color-indigo)]/20 pb-2">
                    <span className="font-mono text-[0.7rem] uppercase tracking-widest text-[color:var(--color-indigo)]/60">{k}</span>
                    <span>{v}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-6 stamp-border bg-[color:var(--color-marigold)]/25 p-3 text-xs text-[color:var(--color-indigo)]">
                <div className="font-mono text-[0.62rem] uppercase tracking-widest">Coverage</div>
                <div className="mt-1">Karnataka · deep</div>
                <div>Rest of India · seeded</div>
              </div>
            </aside>

            {/* results */}
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
                {[
                  { name: "Avani Kshetra", area: "Kolar", km: "68", type: "Heritage · Ramayana-linked hill temple" },
                  { name: "Muthyala Maduvu", area: "Anekal", km: "42", type: "Nature · Pearl-drop falls" },
                  { name: "Devarayanadurga", area: "Tumakuru", km: "74", type: "Heritage · Granite hill forts" },
                  { name: "Bilikal Rangaswamy Betta", area: "Kanakapura", km: "89", type: "Nature · Sholapith forest" },
                ].map((p) => (
                  <div
                    key={p.name}
                    className="group border border-[color:var(--color-indigo)]/15 bg-[color:var(--color-cream)] p-4 transition-colors hover:border-[color:var(--color-vermillion)]"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-display text-lg text-[color:var(--color-indigo)]">{p.name}</div>
                        <div className="font-mono text-[0.65rem] uppercase tracking-widest text-[color:var(--color-indigo)]/60">
                          {p.area}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-mono text-2xl font-semibold text-[color:var(--color-vermillion)]">
                          {p.km}
                        </div>
                        <div className="font-mono text-[0.6rem] uppercase tracking-widest text-[color:var(--color-indigo)]/60">
                          km away
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-[color:var(--color-indigo)]/80">{p.type}</p>
                    <div className="mt-3 flex items-center gap-3 font-mono text-[0.65rem] uppercase tracking-widest text-[color:var(--color-indigo)]/60">
                      <span>Directions →</span>
                      <span>How to reach</span>
                      <span>Permits</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Feature callouts */}
        <div className="mt-16 grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Live distance & directions",
              d: "Every place is sorted by real distance from your current GPS, with turn-by-turn navigation the moment you tap.",
              n: "01",
            },
            {
              t: "Hyperlocal, verified coverage",
              d: "50+ hand-researched places across Karnataka's Ghats, coast, North Karnataka heritage belt, and the Deccan. Every state seeded and expanding.",
              n: "02",
            },
            {
              t: "Built in the languages people search in",
              d: "Trilingual from day one — English, हिन्दी, ಕನ್ನಡ. Because most of India's internet doesn't happen in English.",
              n: "03",
            },
          ].map((f) => (
            <div key={f.t} className="border-l-2 border-[color:var(--color-vermillion)] pl-5">
              <div className="font-mono text-xs tracking-widest text-[color:var(--color-vermillion)]">{f.n}</div>
              <h3 className="mt-2 font-display text-2xl text-[color:var(--color-indigo)]">{f.t}</h3>
              <p className="mt-3 text-[color:var(--color-indigo)]/80">{f.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function WhyNow() {
  return (
    <section id="why-now" className="indigo-grain text-[color:var(--color-cream)]">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <span className="section-label !text-[color:var(--color-marigold)]">03 · Why now</span>
        <h2 className="mt-3 max-w-3xl font-display text-4xl leading-tight md:text-5xl">
          Three curves finally lined up.
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-[color:var(--color-cream)]/85">
          Kos sits at the intersection of India's domestic-travel boom, deep
          smartphone penetration into tier-2 and tier-3 towns, and the arrival
          of regional-language internet as the majority default.
        </p>

        <div className="mt-14 grid grid-cols-2 gap-6 sm:grid-cols-4">
          <Milestone number="15%" label="CAGR · India domestic travel" />
          <Milestone number="820M" label="Smartphone users in India" />
          <Milestone number="57%" label="Regional-language internet share" />
          <Milestone number="0" label="Dedicated offbeat-discovery product" />
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {[
            {
              t: "Domestic travel is compounding",
              d: "One of the fastest-growing travel segments globally, with a structural post-pandemic shift toward road-trippable, in-country destinations.",
            },
            {
              t: "Mobile reached the interior",
              d: "Cheap data and cheap devices pushed smartphone-native discovery deep into tier-2, tier-3, and rural India — where travelers actually live.",
            },
            {
              t: "The internet stopped being English",
              d: "Regional-language internet users are already the majority in India. Any product that only speaks English is speaking to a shrinking slice.",
            },
          ].map((c) => (
            <div key={c.t} className="border border-[color:var(--color-marigold)]/40 bg-[color:var(--color-indigo-soft)]/60 p-6">
              <h3 className="font-display text-xl text-[color:var(--color-marigold)]">{c.t}</h3>
              <p className="mt-3 text-sm text-[color:var(--color-cream)]/85">{c.d}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Roadmap() {
  const phases = [
    {
      p: "Phase 0",
      when: "Live now",
      t: "Karnataka pilot",
      d: "50+ verified hidden-gem places · trilingual MVP · live-location distance & directions.",
    },
    {
      p: "Phase 1",
      when: "Next 6–9 mo",
      t: "Contribution & planning",
      d: "Crowdsourced submissions, trip planner, offline maps, 10–12 states in depth.",
    },
    {
      p: "Phase 2",
      when: "12–18 mo",
      t: "Marketplace",
      d: "Verified local guides and homestays. Commission-based monetization. Full state coverage.",
    },
    {
      p: "Phase 3",
      when: "24 mo+",
      t: "Village-level India",
      d: "Government data partnerships and community contribution. Down to village-level depth, nationwide.",
    },
  ];

  return (
    <section id="roadmap" className="paper-grain-deep border-y border-[color:var(--color-indigo)]/15">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <span className="section-label">04 · Traction & roadmap</span>
        <h2 className="mt-3 max-w-3xl font-display text-4xl leading-tight text-[color:var(--color-indigo)] md:text-5xl">
          One state, mapped for real. Then the country.
        </h2>

        <div className="relative mt-16">
          {/* dashed road */}
          <div className="absolute left-0 right-0 top-[52px] hidden h-px md:block">
            <div className="mx-8 h-full divider-stamp" />
          </div>

          <div className="grid gap-8 md:grid-cols-4 md:gap-4">
            {phases.map((ph, i) => (
              <div key={ph.p} className="relative flex flex-col items-center text-center">
                <div className="relative z-10">
                  <div className="milestone">
                    <KosMark className="h-8 w-6 text-[color:var(--color-marigold)]" />
                    <span className="mt-2 font-mono text-[0.62rem] uppercase tracking-[0.2em]">
                      {ph.p}
                    </span>
                  </div>
                </div>
                <div className="mt-5 font-mono text-[0.65rem] uppercase tracking-widest text-[color:var(--color-vermillion)]">
                  {ph.when}
                </div>
                <h3 className="mt-2 font-display text-xl text-[color:var(--color-indigo)]">
                  {ph.t}
                </h3>
                <p className="mt-3 max-w-xs text-sm text-[color:var(--color-indigo)]/80">
                  {ph.d}
                </p>
                {i === 0 && (
                  <span className="mt-3 inline-block bg-[color:var(--color-pine)] px-2 py-0.5 font-mono text-[0.6rem] uppercase tracking-widest text-[color:var(--color-cream)]">
                    You are here
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

function Model() {
  const items = [
    ["Free", "Core discovery product — search, sort by distance, directions, place detail."],
    ["Premium", "Offline maps, ad-free, saved trip lists. Monthly subscription."],
    ["Marketplace", "Commission on verified local guides and homestay bookings."],
    ["Partnerships", "Sponsored regional placement for state tourism boards."],
  ];
  return (
    <section id="model" className="paper-grain">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <span className="section-label">05 · Business model</span>
        <h2 className="mt-3 max-w-3xl font-display text-4xl text-[color:var(--color-indigo)] md:text-5xl">
          Freemium base. Marketplace upside.
        </h2>
        <p className="mt-6 max-w-2xl text-lg text-[color:var(--color-indigo)]/85">
          Discovery stays free so it stays sticky. Revenue comes from the layer
          above — where a traveler is already ready to book, guide, or stay.
        </p>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(([k, v], i) => (
            <div key={k} className="border border-[color:var(--color-indigo)]/20 bg-[color:var(--color-cream)] p-6">
              <div className="font-mono text-xs tracking-widest text-[color:var(--color-vermillion)]">
                0{i + 1}
              </div>
              <div className="mt-2 font-display text-2xl text-[color:var(--color-indigo)]">
                {k}
              </div>
              <p className="mt-3 text-sm text-[color:var(--color-indigo)]/80">{v}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Team() {
  return (
    <section id="team" className="paper-grain-deep border-y border-[color:var(--color-indigo)]/15">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <span className="section-label">06 · Team</span>
        <h2 className="mt-3 max-w-3xl font-display text-4xl text-[color:var(--color-indigo)] md:text-5xl">
          Built by someone who has actually done the work.
        </h2>

        <div className="mt-12 grid gap-8 md:grid-cols-2">
          {[1, 2].map((i) => (
            <div key={i} className="flex gap-6 border border-[color:var(--color-indigo)]/20 bg-[color:var(--color-cream)] p-6">
              <div className="h-24 w-24 shrink-0 rounded-full bg-[color:var(--color-indigo)]/10 stamp-border" />
              <div className="min-w-0">
                <div className="font-display text-2xl text-[color:var(--color-indigo)]">
                  [ Founder name ]
                </div>
                <div className="mt-1 font-mono text-[0.65rem] uppercase tracking-widest text-[color:var(--color-vermillion)]">
                  [ Role · Placeholder ]
                </div>
                <p className="mt-3 text-sm text-[color:var(--color-indigo)]/80">
                  One-line bio placeholder — background, what they've built
                  before, and why they're the one to map India this way.
                </p>
              </div>
            </div>
          ))}
        </div>
        <p className="mt-6 font-mono text-xs text-[color:var(--color-indigo)]/60">
          ↑ Placeholder team block — founder photos and bios to be filled in.
        </p>
      </div>
    </section>
  );
}

function Contact() {
  const [status, setStatus] = useState<"idle" | "submitting" | "sent">("idle");

  return (
    <section id="contact" className="indigo-grain text-[color:var(--color-cream)]">
      <div className="mx-auto max-w-6xl px-5 py-24">
        <div className="grid gap-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
          <div>
            <span className="section-label !text-[color:var(--color-marigold)]">07 · Get in touch</span>
            <h2 className="mt-4 font-display text-4xl leading-[1.05] md:text-6xl">
              We're mapping the India that{" "}
              <span className="text-[color:var(--color-marigold)]">doesn't trend.</span>
            </h2>
            <p className="mt-6 max-w-lg text-lg text-[color:var(--color-cream)]/85">
              If you invest at pre-seed or seed in consumer, travel, or India-first
              products — we'd like to send you the deck and walk you through what's
              already live.
            </p>

            <div className="mt-10 space-y-3 font-mono text-sm text-[color:var(--color-cream)]/80">
              <div className="flex items-center gap-3">
                <span className="text-[color:var(--color-marigold)]">→</span>
                <span>hello@kos.travel</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-[color:var(--color-marigold)]">→</span>
                <span>Bengaluru · India</span>
              </div>
            </div>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              setStatus("submitting");
              // Placeholder — backend wiring needed to send this somewhere.
              setTimeout(() => setStatus("sent"), 600);
            }}
            className="rounded-md border border-[color:var(--color-marigold)]/50 bg-[color:var(--color-indigo-soft)]/70 p-6 md:p-8"
          >
            <div className="space-y-4">
              {[
                { id: "name", label: "Name", type: "text", required: true },
                { id: "email", label: "Email", type: "email", required: true },
                { id: "firm", label: "Firm / fund (optional)", type: "text", required: false },
              ].map((f) => (
                <label key={f.id} className="block">
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-[color:var(--color-marigold)]">
                    {f.label}
                  </span>
                  <input
                    id={f.id}
                    name={f.id}
                    type={f.type}
                    required={f.required}
                    maxLength={200}
                    className="mt-1 block w-full border-b border-[color:var(--color-marigold)]/40 bg-transparent px-1 py-2 text-[color:var(--color-cream)] outline-none placeholder:text-[color:var(--color-cream)]/40 focus:border-[color:var(--color-marigold)]"
                  />
                </label>
              ))}
              <label className="block">
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.24em] text-[color:var(--color-marigold)]">
                  Message
                </span>
                <textarea
                  name="message"
                  rows={4}
                  maxLength={1000}
                  className="mt-1 block w-full border-b border-[color:var(--color-marigold)]/40 bg-transparent px-1 py-2 text-[color:var(--color-cream)] outline-none placeholder:text-[color:var(--color-cream)]/40 focus:border-[color:var(--color-marigold)]"
                />
              </label>
            </div>

            <button
              type="submit"
              disabled={status !== "idle"}
              className="btn-vermillion mt-8 w-full disabled:opacity-60"
            >
              {status === "sent"
                ? "Thanks — we'll be in touch ✓"
                : status === "submitting"
                  ? "Sending…"
                  : "Request the deck →"}
            </button>
            <p className="mt-4 font-mono text-[0.62rem] uppercase tracking-widest text-[color:var(--color-cream)]/50">
              Placeholder — connect this form to an inbox or CRM before launch.
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
        <nav className="flex gap-6 font-mono text-xs uppercase tracking-widest">
          <a href="#top" className="hover:text-[color:var(--color-marigold)]">About</a>
          <a href="#contact" className="hover:text-[color:var(--color-marigold)]">Contact</a>
          <a href="#" className="hover:text-[color:var(--color-marigold)]">Privacy</a>
        </nav>
        <div className="font-mono text-[0.65rem] uppercase tracking-widest text-[color:var(--color-cream)]/50">
          © {new Date().getFullYear()} Kos · Bengaluru
        </div>
      </div>
    </footer>
  );
}

function KosLanding() {
  return (
    <div className="min-h-screen">
      <Nav />
      <main>
        <Hero />
        <Problem />
        <Product />
        <WhyNow />
        <Roadmap />
        <Model />
        <Team />
        <Contact />
      </main>
      <Footer />
    </div>
  );
}
