"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES } from "@/lib/games";

export default function Header() {
  const [q, setQ] = useState("");
  const router = useRouter();

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = q.trim();
    router.push(query ? `/?q=${encodeURIComponent(query)}` : "/");
  };

  return (
    <header className="sticky top-0 z-50 bg-[#141a30]/95 backdrop-blur border-b border-[#2a3560]">
      {/* Top bar: logo | search | links */}
      <div className="mx-auto flex max-w-[1400px] items-center gap-4 px-4 py-3">
        <Link href="/" className="flex shrink-0 items-center gap-2" aria-label="PlayZone home">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-[#7c6cf8] to-[#38e1ff] text-2xl shadow-lg">
            🎮
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-white">
            Play<span className="text-[#7c6cf8]">Zone</span>
          </span>
        </Link>

        <form onSubmit={submit} className="mx-auto flex w-full max-w-xl items-center" role="search">
          <div className="relative w-full">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search games..."
              aria-label="Search games"
              className="w-full rounded-full border border-[#35406e] bg-[#1b2138] py-2.5 pl-5 pr-12 text-sm text-white outline-none placeholder:text-[#a3adc9]/60 focus:border-[#7c6cf8]"
            />
            <button
              type="submit"
              aria-label="Search"
              className="absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-full bg-[#7c6cf8] text-white hover:bg-[#6a5ae0]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M17 10a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </form>

        <nav className="hidden shrink-0 items-center gap-5 text-sm font-semibold text-[#a3adc9] lg:flex" aria-label="Top">
          <Link href="/#new" className="hover:text-white">New Games</Link>
          <Link href="/#popular" className="hover:text-white">Popular</Link>
        </nav>
      </div>

      {/* Category pills row */}
      <div className="border-t border-[#232b4d]">
        <div className="no-scrollbar mx-auto flex max-w-[1400px] items-center gap-2 overflow-x-auto px-4 py-2.5">
          <Link
            href="/"
            className="cat-pill shrink-0 rounded-full bg-[#2a3560] px-4 py-1.5 text-sm font-semibold text-white"
          >
            🏠 Home
          </Link>
          {CATEGORIES.map((c) => (
            <Link
              key={c.slug}
              href={`/category/${c.slug}`}
              className="cat-pill shrink-0 rounded-full bg-[#2a3560] px-4 py-1.5 text-sm font-semibold text-[#dfe4f5]"
            >
              {c.emoji} {c.name}
            </Link>
          ))}
        </div>
      </div>
    </header>
  );
}
