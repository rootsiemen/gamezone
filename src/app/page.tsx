"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { GAMES, CATEGORIES, searchGames } from "@/lib/games";
import GameCard from "@/components/GameCard";
import Link from "next/link";

function HomeContent() {
  const params = useSearchParams();
  const q = params.get("q") || "";
  const results = searchGames(q);
  const featured = GAMES.filter((g) => g.featured);
  const popular = GAMES.filter((g) => g.popular);

  if (q) {
    return (
      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-2xl font-extrabold">Search results for “{q}”</h1>
        <p className="mt-1 text-slate-400">{results.length} game{results.length !== 1 ? "s" : ""} found</p>
        {results.length === 0 ? (
          <p className="mt-6 text-slate-400">No games found. Try “snake”, “puzzle”, or “tetris”.</p>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {results.map((g) => <GameCard key={g.slug} game={g} />)}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-violet-900 via-[#17203a] to-cyan-900 p-8 sm:p-12">
        <h1 className="max-w-2xl text-4xl font-extrabold sm:text-5xl">
          Free Online Games — <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">Play Instantly</span>
        </h1>
        <p className="mt-4 max-w-xl text-slate-300">
          {GAMES.length} free browser games: Snake, 2048, Tetris, Flappy Wings and more.
          No downloads, no signup — just pick a game and play!
        </p>
        <div className="mt-6 flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`}
              className="rounded-full bg-white/10 px-4 py-2 text-sm font-bold hover:bg-white/20">
              {c.emoji} {c.name}
            </Link>
          ))}
        </div>
      </section>

      {/* Featured */}
      <section className="mt-10" aria-labelledby="featured">
        <h2 id="featured" className="text-2xl font-extrabold">⭐ Featured Games</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {featured.map((g) => <GameCard key={g.slug} game={g} />)}
        </div>
      </section>

      {/* Popular */}
      <section className="mt-10" aria-labelledby="popular">
        <h2 id="popular" className="text-2xl font-extrabold">🔥 Popular Right Now</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {popular.map((g) => <GameCard key={g.slug} game={g} />)}
        </div>
      </section>

      {/* Categories */}
      {CATEGORIES.map((c) => {
        const games = GAMES.filter((g) => g.category === c.slug).slice(0, 4);
        return (
          <section key={c.slug} className="mt-10" aria-labelledby={`cat-${c.slug}`}>
            <div className="flex items-center justify-between">
              <h2 id={`cat-${c.slug}`} className="text-2xl font-extrabold">{c.emoji} {c.name} Games</h2>
              <Link href={`/category/${c.slug}`} className="text-sm font-bold text-cyan-300 hover:text-cyan-200">View all →</Link>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
              {games.map((g) => <GameCard key={g.slug} game={g} />)}
            </div>
          </section>
        );
      })}

      {/* SEO intro */}
      <section className="mt-12 rounded-2xl bg-[#131a2c] p-6 text-sm leading-relaxed text-slate-400">
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
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading games…</div>}>
      <HomeContent />
    </Suspense>
  );
}
