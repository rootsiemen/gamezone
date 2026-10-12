"use client";

import Link from "next/link";
import { useState } from "react";
import type { Game } from "@/lib/games";

function Stars({ value = 4.5 }: { value?: number }) {
  return (
    <span className="text-xs text-amber-400" aria-label={`${value} out of 5 stars`}>
      {"★".repeat(Math.round(value))}
      <span className="text-[#4a5580]">{"★".repeat(5 - Math.round(value))}</span>
    </span>
  );
}

export default function GameCard({ game }: { game: Game }) {
  const [imgOk, setImgOk] = useState(true);
  const plays = (128 - game.slug.length * 7 + game.title.length * 13) * 137;

  return (
    <Link
      href={`/play/${game.slug}`}
      className="game-card group block overflow-hidden rounded-xl bg-[#232b4d] border border-[#2a3560]"
    >
      <div className="game-card-thumb relative aspect-[16/10] overflow-hidden bg-[#1b2138]">
        {imgOk ? (
          <img
            src={`/thumbnails/${game.slug}.jpg`}
            alt={`${game.title} game thumbnail`}
            loading="lazy"
            className="h-full w-full object-cover"
            onError={() => setImgOk(false)}
          />
        ) : (
          <div className={`flex h-full w-full items-center justify-center bg-gradient-to-br ${game.gradient}`}>
            <span className="text-6xl drop-shadow-lg transition-transform duration-200 group-hover:scale-110">
              {game.emoji}
            </span>
          </div>
        )}
        <span className="absolute left-2 top-2 rounded-md bg-black/60 px-2 py-0.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
          {game.category}
        </span>
      </div>
      <div className="p-3">
        <h3 className="truncate text-sm font-bold text-white group-hover:text-[#b9b0ff]">
          {game.title}
        </h3>
        <div className="mt-1.5 flex items-center justify-between">
          <Stars />
          <span className="text-[11px] font-medium text-[#a3adc9]">
            ▶ {(plays / 1000).toFixed(1)}K plays
          </span>
        </div>
      </div>
    </Link>
  );
}
