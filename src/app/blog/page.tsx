import type { Metadata } from "next";
import Link from "next/link";
import { POSTS, formatPostDate } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Gaming Blog — Tips, Lists & Browser Game News | PlayZone",
  description:
    "PlayZone blog: best free browser games, gaming tips, and why browser gaming is booming. Fresh articles for casual gamers.",
  alternates: { canonical: "https://games.tempmaill.tech/blog" },
};

export default function BlogPage() {
  const posts = [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  return (
    <div className="mx-auto max-w-4xl px-4 py-10">
      <h1 className="text-3xl font-extrabold text-white">🎮 PlayZone Blog</h1>
      <p className="mt-2 text-[#a3adc9]">
        Gaming tips, best-of lists, and browser game news — fresh articles for
        casual gamers.
      </p>
      <div className="mt-8 grid gap-5 sm:grid-cols-2">
        {posts.map((p) => (
          <Link
            key={p.slug}
            href={`/blog/${p.slug}`}
            className="rounded-2xl border border-[#35406e] bg-[#2a3560] p-6 transition hover:border-[#7c6cf8] hover:bg-[#323d6e]"
          >
            <div className="text-4xl">{p.emoji}</div>
            <h2 className="mt-3 text-xl font-bold text-white">{p.title}</h2>
            <p className="mt-2 line-clamp-3 text-sm text-[#a3adc9]">
              {p.excerpt}
            </p>
            <div className="mt-4 flex items-center gap-3 text-xs text-[#a3adc9]">
              <span>{formatPostDate(p.date)}</span>
              <span>•</span>
              <span>{p.readMinutes} min read</span>
            </div>
          </Link>
        ))}
      </div>
      {posts.length === 0 && (
        <p className="mt-8 text-[#a3adc9]">
          No articles yet — check back soon!
        </p>
      )}
    </div>
  );
}
