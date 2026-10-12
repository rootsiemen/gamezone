import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "PlayZone terms of service — rules for using our free online games.",
  alternates: { canonical: "https://games.tempmaill.tech/terms" },
};

export default function TermsPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Terms of Service</h1>
      <p className="mt-2 text-sm text-slate-400">Last updated: October 12, 2026</p>
      <div className="mt-4 space-y-4 leading-relaxed text-slate-300">
        <section>
          <h2 className="text-xl font-bold text-white">1. Free play</h2>
          <p className="mt-1">All games on PlayZone are free to play for personal, non-commercial use. No account or payment is required.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white">2. Acceptable use</h2>
          <p className="mt-1">You agree not to abuse, disrupt, or attempt to hack the site or its games — including automated play bots, score manipulation, or scraping game content at unreasonable rates.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white">3. Intellectual property</h2>
          <p className="mt-1">The games on PlayZone are original implementations created for this site. The PlayZone name, logo, and design are our property. You may not copy or redistribute our games without permission.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white">4. No warranties</h2>
          <p className="mt-1">Games are provided "as is" without warranties of any kind. We do our best to keep the site running smoothly but cannot guarantee uninterrupted availability.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white">5. Changes</h2>
          <p className="mt-1">We may update these terms from time to time. Continued use of the site after changes means you accept the updated terms.</p>
        </section>
      </div>
    </div>
  );
}
