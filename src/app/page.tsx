"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { GAMES, CATEGORIES, searchGames } from "@/lib/games";
import GameCard from "@/components/GameCard";
import Link from "next/link";

function Section({
  id,
  title,
  icon,
  games,
  link,
}: {
  id?: string;
  title: string;
  icon: string;
  games: typeof GAMES;
  link?: string;
}) {
  if (games.length === 0) return null;
  return (
    <section id={id} className="mt-8" aria-label={title}>
      <div className="mb-3 flex items-center justify-between">
        <h2 className="flex items-center gap-2 text-xl font-extrabold text-white">
          <span>{icon}</span> {title}
        </h2>
        {link && (
          <Link href={link} className="text-sm font-bold text-[#7c6cf8] hover:text-[#9a8fff]">
            View all →
          </Link>
        )}
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {games.map((g) => (
          <GameCard key={g.slug} game={g} />
        ))}
      </div>
    </section>
  );
}

function HomeContent() {
  const params = useSearchParams();
  const q = params.get("q") || "";
  const results = searchGames(q);

  const trending = GAMES.filter((g) => g.popular);
  const featured = GAMES.filter((g) => g.featured);
  const newest = [...GAMES].reverse().slice(0, 6);

  if (q) {
    return (
      <div className="mx-auto max-w-[1400px] px-4 py-6">
        <h1 className="text-2xl font-extrabold text-white">Search results for “{q}”</h1>
        <p className="mt-1 text-sm text-[#a3adc9]">
          {results.length} game{results.length !== 1 ? "s" : ""} found
        </p>
        {results.length === 0 ? (
          <p className="mt-6 text-[#a3adc9]">No games found. Try “snake”, “puzzle”, or “tetris”.</p>
        ) : (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
            {results.map((g) => (
              <GameCard key={g.slug} game={g} />
            ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-4 py-6">
      {/* Slim welcome strip */}
      <div className="rounded-2xl border border-[#2a3560] bg-gradient-to-r from-[#232b4d] to-[#1b2138] px-6 py-5">
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">
          🎮 Free Online Games — <span className="text-[#7c6cf8]">Play Instantly</span>
        </h1>
        <p className="mt-1 text-sm text-[#a3adc9]">
          {GAMES.length} free browser games. No downloads, no signup — just pick a game and play!
        </p>
      </div>

      <Section id="trending" title="Trending Now" icon="🔥" games={trending} />
      <Section id="new" title="New Games" icon="✨" games={newest} />
      <Section id="popular" title="Popular Games" icon="⭐" games={featured} />

      {CATEGORIES.map((c) => (
        <Section
          key={c.slug}
          title={`${c.name} Games`}
          icon={c.emoji}
          games={GAMES.filter((g) => g.category === c.slug)}
          link={`/category/${c.slug}`}
        />
      ))}

      {/* SEO intro */}
      <section className="mt-10 rounded-2xl border border-[#2a3560] bg-[#1b2138] p-6 text-sm leading-relaxed text-[#a3adc9]">
        <h2 className="text-lg font-bold text-white">Play Free Browser Games on PlayZone</h2>
        <p className="mt-2">
          PlayZone is your home for free online games you can play instantly in any modern browser —
          on desktop, tablet, or mobile. Our collection includes arcade hits like Snake, Flappy Wings,
          Breakout and Dodge; brain-training puzzlers like 2048, Tetris, Memory Match and Minesweeper;
          and timeless classics like Tic Tac Toe, Simon Says and Pong. Every game is free, loads fast,
          and needs no downloads or accounts. New games are added regularly — bookmark PlayZone and come back for more!
        </p>
      </section>
    </div>
  );
}

export default function Home() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-[#a3adc9]">Loading games…</div>}>
      <HomeContent />
    </Suspense>
  );
}
