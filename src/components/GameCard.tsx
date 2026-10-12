import Link from "next/link";
import type { Game } from "@/lib/games";

export default function GameCard({ game }: { game: Game }) {
  return (
    <Link
      href={`/play/${game.slug}`}
      className="game-card group block overflow-hidden rounded-xl bg-[#17203a] border border-slate-700/50"
    >
      <div className={`flex h-32 items-center justify-center bg-gradient-to-br ${game.gradient} text-6xl`}>
        <span className="transition-transform group-hover:scale-125">{game.emoji}</span>
      </div>
      <div className="p-3">
        <h3 className="font-bold text-white group-hover:text-cyan-300">{game.title}</h3>
        <p className="mt-1 line-clamp-2 text-xs text-slate-400">{game.description}</p>
        <span className="mt-2 inline-block rounded-full bg-violet-600/20 px-2.5 py-0.5 text-xs font-semibold text-violet-300 capitalize">
          {game.category}
        </span>
      </div>
    </Link>
  );
}
