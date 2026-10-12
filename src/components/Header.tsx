"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Header() {
  const [q, setQ] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(`/?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-violet-500/20 bg-[#0b0f1a]/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-3">
        <Link href="/" className="flex items-center gap-2 text-2xl font-extrabold">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 text-xl">🎮</span>
          <span className="bg-gradient-to-r from-violet-400 to-cyan-300 bg-clip-text text-transparent">PlayZone</span>
        </Link>
        <nav className="hidden items-center gap-4 text-sm font-semibold text-slate-300 md:flex" aria-label="Categories">
          <Link href="/category/arcade" className="hover:text-white">Arcade</Link>
          <Link href="/category/puzzle" className="hover:text-white">Puzzle</Link>
          <Link href="/category/classic" className="hover:text-white">Classic</Link>
          <Link href="/category/action" className="hover:text-white">Action</Link>
        </nav>
        <form onSubmit={submit} className="ml-auto flex w-full max-w-xs items-center" role="search">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search games…"
            aria-label="Search games"
            className="w-full rounded-l-lg border border-slate-700 bg-slate-800/70 px-3 py-2 text-sm outline-none placeholder:text-slate-500 focus:border-violet-500"
          />
          <button type="submit" aria-label="Search" className="rounded-r-lg bg-violet-600 px-3 py-2 text-sm font-bold hover:bg-violet-500">
            🔍
          </button>
        </form>
      </div>
    </header>
  );
}
