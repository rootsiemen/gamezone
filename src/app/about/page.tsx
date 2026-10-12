import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About PlayZone",
  description: "About PlayZone — free online games playable instantly in your browser. No downloads, no signup.",
  alternates: { canonical: "https://games.tempmaill.tech/about" },
};

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="text-3xl font-extrabold">About PlayZone</h1>
      <div className="mt-4 space-y-4 leading-relaxed text-slate-300">
        <p>
          <strong className="text-white">PlayZone</strong> is a free online games portal. Our mission is simple:
          great games that anyone can play instantly, on any device, without downloads, installs, or accounts.
        </p>
        <p>
          Our collection includes arcade favorites like Snake, Flappy Wings, Breakout, and Dodge;
          brain-training puzzlers like 2048, Tetris, Memory Match, and Minesweeper; and timeless
          classics like Tic Tac Toe, Simon Says, and Pong. Every game runs right in your browser
          using modern web technology, with touch controls for mobile and keyboard controls for desktop.
        </p>
        <p>
          All games on PlayZone are completely free to play. We are constantly adding new titles,
          so bookmark us and check back often. Have a suggestion or found a bug? Head over to our{" "}
          <a href="/contact" className="text-cyan-300 hover:underline">contact page</a> and let us know!
        </p>
      </div>
    </div>
  );
}
