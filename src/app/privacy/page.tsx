import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "PlayZone privacy policy — how we handle data, cookies, and advertising.",
  alternates: { canonical: "https://games.tempmaill.tech/privacy" },
};

export default function PrivacyPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-400">Last updated: October 12, 2026</p>
      <div className="mt-4 space-y-4 leading-relaxed text-slate-300">
        <section>
          <h2 className="text-xl font-bold text-white">1. What we collect</h2>
          <p className="mt-1">PlayZone does not require accounts and does not collect personal information such as your name or email. Game high scores are stored only in your own browser's local storage and never leave your device.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white">2. Cookies</h2>
          <p className="mt-1">We use a minimal set of cookies and local storage for site functionality (for example, remembering your high scores). If we show advertising in the future, our advertising partners may use cookies to serve personalized ads. You can disable cookies in your browser settings at any time.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white">3. Advertising</h2>
          <p className="mt-1">We may display ads from third-party vendors, including Google AdSense. Google uses cookies to serve ads based on your prior visits to this and other websites. You may opt out of personalized advertising by visiting Google's Ads Settings.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white">4. Analytics</h2>
          <p className="mt-1">We may use privacy-friendly analytics to understand which games are popular. This data is aggregated and cannot identify you personally.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white">5. Children</h2>
          <p className="mt-1">PlayZone games are family-friendly, but our site is intended for a general audience. We do not knowingly collect personal information from children under 13.</p>
        </section>
        <section>
          <h2 className="text-xl font-bold text-white">6. Contact</h2>
          <p className="mt-1">Questions about this policy? Reach us via the <a href="/contact" className="text-cyan-300 hover:underline">contact page</a>.</p>
        </section>
      </div>
    </div>
  );
}
