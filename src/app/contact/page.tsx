import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact PlayZone — game suggestions, bug reports, and feedback.",
  alternates: { canonical: "https://games.tempmaill.tech/contact" },
};

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">Contact Us</h1>
      <div className="mt-4 space-y-4 leading-relaxed text-slate-300">
        <p>
          Have a game suggestion, found a bug, or just want to say hi? We'd love to hear from you.
          The fastest way to reach the PlayZone team is by email:
        </p>
        <p className="rounded-xl bg-[#17203a] p-4 text-center text-lg font-bold text-cyan-300">
          📧 hello@games.tempmaill.tech
        </p>
        <p>
          When reporting a bug, please include the game name, your device (phone or computer),
          and what happened. For game requests, tell us the title and why you love it —
          popular requests get built first!
        </p>
      </div>
    </div>
  );
}
