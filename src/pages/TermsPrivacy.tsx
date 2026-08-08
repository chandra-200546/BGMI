import { Section } from "../lib/shared-ui";

export function TermsPage() {
  return (
    <div className="pt-24 pb-16">
      <Section eyebrow="Legal Notice" title="Terms of Service">
        <div className="max-w-3xl space-y-6 font-mono text-xs leading-relaxed text-slate-300">
          <p>
            Welcome to NexBattles BGMI. By participating in any tournament, daily scrim, or registered lobby hosted on our platform, you agree to comply with these terms.
          </p>
          <h3 className="font-display text-2xl font-bold uppercase text-white">1. Fair Play & Emulators</h3>
          <p>
            Strict zero-tolerance policy against cheating, third-party software, radar hacks, or unapproved emulator usage. All matches are monitored and logged.
          </p>
          <h3 className="font-display text-2xl font-bold uppercase text-white">2. Prize Pool & Wallet</h3>
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
            NexBattles BGMI respects your privacy. We collect minimal player data required for tournament verification, room credentials distribution, and prize payouts.
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
          <div className="grid gap-4 md:grid-cols-2">
            <div className="border border-white/10 bg-black/50 p-4">
              <h4 className="font-display text-2xl font-bold uppercase text-white">WhatsApp Support</h4>
              <p className="mt-2 text-green-300">+91 98765 43210</p>
              <p className="mt-1 text-slate-400">Available 10:00 AM – 11:00 PM IST</p>
            </div>
            <div className="border border-white/10 bg-black/50 p-4">
              <h4 className="font-display text-2xl font-bold uppercase text-white">Official Email</h4>
              <p className="mt-2 text-orange-300">support@nexbattles.in</p>
              <p className="mt-1 text-slate-400">Response within 24 hours</p>
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
      <Section eyebrow="About Us" title="NexBattles BGMI">
        <div className="max-w-3xl space-y-6 font-mono text-xs leading-relaxed text-slate-300">
          <p>
            NexBattles BGMI is a premier Indian esports tournament platform dedicated to grassroots and elite mobile battle-royale competition.
          </p>
          <p>
            Engineered with real-time Supabase infrastructure, live points table calculation, instant room release vaults, and official tournament management pipelines.
          </p>
        </div>
      </Section>
    </div>
  );
}
