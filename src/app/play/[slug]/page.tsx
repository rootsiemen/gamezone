import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GAMES, getGame, getRelated, CATEGORIES } from "@/lib/games";
import GamePlayer from "@/components/GamePlayer";
import GameCard from "@/components/GameCard";
import Link from "next/link";

const SITE_URL = "https://games.tempmaill.tech";

export function generateStaticParams() {
  return GAMES.map((g) => ({ slug: g.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) return {};
  const url = `${SITE_URL}/play/${game.slug}`;
  return {
    title: `Play ${game.title} Online — Free`,
    description: `Play ${game.title} free online at PlayZone. ${game.description} No downloads, no signup.`,
    keywords: [game.title.toLowerCase(), "free online games", "play " + game.title.toLowerCase() + " online", ...game.tags],
    alternates: { canonical: url },
    openGraph: {
      title: `Play ${game.title} Online — Free | PlayZone`,
      description: game.description,
      url,
      siteName: "PlayZone",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `Play ${game.title} Online — Free | PlayZone`,
      description: game.description,
    },
  };
}

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const game = getGame(slug);
  if (!game) notFound();
  const related = getRelated(game, 6);
  const cat = CATEGORIES.find((c) => c.slug === game.category);
  const plays = (128 - game.slug.length * 7 + game.title.length * 13) * 137;

  const videoGameSchema = {
    "@context": "https://schema.org",
    "@type": "VideoGame",
    name: game.title,
    url: `${SITE_URL}/play/${game.slug}`,
    description: game.description,
    applicationCategory: "Game",
    operatingSystem: "Web Browser",
    genre: cat?.name,
    offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
    aggregateRating: { "@type": "AggregateRating", ratingValue: "4.6", ratingCount: "128" },
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: SITE_URL },
      { "@type": "ListItem", position: 2, name: `${cat?.name} Games`, item: `${SITE_URL}/category/${game.category}` },
      { "@type": "ListItem", position: 3, name: game.title, item: `${SITE_URL}/play/${game.slug}` },
    ],
  };

  return (
    <div className="mx-auto max-w-[1200px] px-4 py-6">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-[#a3adc9]">
        <Link href="/" className="hover:text-white">Home</Link>
        <span className="mx-2">›</span>
        <Link href={`/category/${game.category}`} className="hover:text-white capitalize">{cat?.name} Games</Link>
        <span className="mx-2">›</span>
        <span className="text-white font-semibold">{game.title}</span>
      </nav>

      {/* Game player frame — 16:9, visible bordered panel */}
      <div className="game-frame mt-4 overflow-hidden rounded-2xl">
        <div className="flex items-center justify-between border-b border-[#2a3560] bg-[#141a30] px-4 py-2.5">
          <span className="flex items-center gap-2 text-sm font-bold text-white">
            <span className="text-lg">{game.emoji}</span> {game.title}
          </span>
          <span className="rounded-md bg-[#7c6cf8]/20 px-2.5 py-1 text-xs font-bold text-[#b9b0ff] uppercase tracking-wide">
            {game.category}
          </span>
        </div>
        <div className="flex min-h-[420px] items-center justify-center p-4 sm:p-8">
          <div className="w-full max-w-3xl">
            <GamePlayer slug={game.slug} />
          </div>
        </div>
      </div>

      {/* Title + rating row */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-extrabold text-white sm:text-3xl">Play {game.title} Online</h1>
      </div>
      <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-[#a3adc9]">
        <span className="text-amber-400 text-base" aria-label="Rated 4.6 out of 5">★★★★★</span>
        <span className="font-semibold text-white">4.6</span>
        <span>▶ {(plays / 1000).toFixed(1)}K plays</span>
        <span>🎮 {game.controls}</span>
        <span className="rounded-full bg-[#2a3560] px-3 py-0.5 text-xs font-bold text-white">Free to play</span>
      </div>

      {/* About + How to play */}
      <div className="mt-6 grid gap-6 md:grid-cols-2">
        <section aria-labelledby="about-game" className="rounded-2xl border border-[#2a3560] bg-[#1b2138] p-5">
          <h2 id="about-game" className="text-lg font-bold text-white">About {game.title}</h2>
          <p className="mt-2 text-sm leading-relaxed text-[#c6cde6]">{game.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {game.tags.map((t) => (
              <span key={t} className="rounded-full bg-[#2a3560] px-3 py-1 text-xs font-medium text-[#c6cde6]">{t}</span>
            ))}
          </div>
        </section>
        <section aria-labelledby="how-to" className="rounded-2xl border border-[#2a3560] bg-[#1b2138] p-5">
          <h2 id="how-to" className="text-lg font-bold text-white">How to Play {game.title}</h2>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 text-sm leading-relaxed text-[#c6cde6]">
            {game.howToPlay.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </section>
      </div>

      {/* Related games */}
      <section className="mt-10" aria-labelledby="related">
        <h2 id="related" className="mb-3 flex items-center gap-2 text-xl font-extrabold text-white">
          🎯 Related Games
        </h2>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
          {related.map((g) => <GameCard key={g.slug} game={g} />)}
        </div>
      </section>
    </div>
  );
}
