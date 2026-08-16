import { Section } from "../lib/shared-ui";

export function TermsPage() {
  return (
    <div className="pt-24 pb-16">
      <Section eyebrow="Legal Notice" title="Terms of Service">
        <div className="max-w-3xl space-y-6 font-mono text-xs leading-relaxed text-slate-300">
          <p>
            Welcome to LordsEsports BGMI. By participating in any tournament, daily scrim, or registered lobby hosted on our platform, you agree to comply with these terms.
          </p>
          <h3 className="font-display text-2xl font-bold uppercase text-white">1. Fair Play & Emulators</h3>
          <p>
            Strict zero-tolerance policy against cheating, third-party software, radar hacks, or unapproved emulator usage. All matches are monitored and logged.
          </p>
          <h3 className="font-display text-2xl font-bold uppercase text-white">2. Prize Pool & Payments</h3>
          <p>
            Prize distributions are processed to approved captains after verification of match recordings and screenshot evidence within 48 hours.
          </p>
          <h3 className="font-display text-2xl font-bold uppercase text-white">3. Conduct</h3>
          <p>
            Toxic behavior, lobby disruption, or deliberate griefing will result in immediate disqualification and player ban across all seasons.
          </p>
        </div>
      </Section>
    </div>
  );
}

export function PrivacyPage() {
  return (
    <div className="pt-24 pb-16">
      <Section eyebrow="Data Security" title="Privacy Policy">
        <div className="max-w-3xl space-y-6 font-mono text-xs leading-relaxed text-slate-300">
          <p>
            LordsEsports BGMI respects your privacy. We collect minimal player data required for tournament verification, room credentials distribution, and prize payouts.
          </p>
          <h3 className="font-display text-2xl font-bold uppercase text-white">Information Collected</h3>
          <p>
            Captain name, BGMI UID, WhatsApp contact, Discord handle, team roster IGNs, and optional payment verification screenshots.
          </p>
          <h3 className="font-display text-2xl font-bold uppercase text-white">Protected Credentials</h3>
          <p>
            Match room IDs and passwords are cryptographically restricted and strictly delivered to confirmed captains 15 minutes before drop time.
          </p>
        </div>
      </Section>
    </div>
  );
}

export function ContactPage() {
  return (
    <div className="pt-24 pb-16">
      <Section eyebrow="Support Desk" title="Contact Us">
        <div className="max-w-3xl space-y-6 font-mono text-xs leading-relaxed text-slate-300">
          <p>
            Need help with team registration, match disputes, room access, or sponsorship inquiries? Reach out to our 24/7 battle operations team.
          </p>
          <div className="grid gap-4 md:grid-cols-3">
            <div className="border border-sky-400/20 bg-slate-950 p-5">
              <h4 className="font-display text-2xl font-bold uppercase text-white">WhatsApp Support</h4>
              <p className="mt-2 text-sky-400 font-bold">+91 7996488242</p>
              <a
                href="https://wa.me/917996488242"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block border border-sky-400/40 bg-sky-500/10 px-3 py-1.5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] text-sky-200 hover:bg-sky-400 hover:text-black"
              >
                Chat on WhatsApp
              </a>
            </div>
            <div className="border border-sky-400/20 bg-slate-950 p-5">
              <h4 className="font-display text-2xl font-bold uppercase text-white">Official Email</h4>
              <p className="mt-2 text-sky-400 font-bold">Lordsesports3@gmail.com</p>
              <a
                href="mailto:Lordsesports3@gmail.com"
                className="mt-3 inline-block border border-sky-400/40 bg-sky-500/10 px-3 py-1.5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] text-sky-200 hover:bg-sky-400 hover:text-black"
              >
                Send Email
              </a>
            </div>
            <div className="border border-sky-400/20 bg-slate-950 p-5">
              <h4 className="font-display text-2xl font-bold uppercase text-white">WhatsApp Channel</h4>
              <p className="mt-2 text-slate-300 font-bold">Official Announcements</p>
              <a
                href="https://whatsapp.com/channel/0029VanlLBL9RZARIMR3Vm2W"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-3 inline-block border border-sky-400/40 bg-sky-500/10 px-3 py-1.5 font-mono text-[0.65rem] font-bold uppercase tracking-[0.16em] text-sky-200 hover:bg-sky-400 hover:text-black"
              >
                Join Channel
              </a>
            </div>
          </div>
        </div>
      </Section>
    </div>
  );
}

export function AboutPage() {
  return (
    <div className="pt-24 pb-16">
      <Section eyebrow="About Us" title="LordsEsports BGMI">
        <div className="max-w-3xl space-y-6 font-mono text-xs leading-relaxed text-slate-300">
          <p>
            LordsEsports BGMI is a premier Indian esports tournament platform dedicated to grassroots and elite mobile battle-royale competition.
          </p>
          <p>
            Engineered with real-time Supabase infrastructure, live points table calculation, instant room release vaults, and official tournament management pipelines.
          </p>
        </div>
      </Section>
    </div>
  );
}
