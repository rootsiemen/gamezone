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
  const related = getRelated(game);
  const cat = CATEGORIES.find((c) => c.slug === game.category);

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
    <article className="mx-auto max-w-6xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoGameSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />

      <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
        <Link href="/" className="hover:text-white">Home</Link>
        {" / "}
        <Link href={`/category/${game.category}`} className="hover:text-white capitalize">{cat?.name} Games</Link>
        {" / "}
        <span className="text-slate-200">{game.title}</span>
      </nav>

      <header className="mt-4 flex items-center gap-4">
        <span className={`flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${game.gradient} text-4xl`}>{game.emoji}</span>
        <div>
          <h1 className="text-3xl font-extrabold">Play {game.title} Online</h1>
          <p className="text-sm text-slate-400">Free to play · No downloads · {game.controls}</p>
        </div>
      </header>

      <div className="mt-6 rounded-2xl border border-slate-700/60 bg-[#131a2c] p-4 sm:p-6">
        <GamePlayer slug={game.slug} />
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section aria-labelledby="about-game">
          <h2 id="about-game" className="text-xl font-bold">About {game.title}</h2>
          <p className="mt-2 leading-relaxed text-slate-300">{game.description}</p>
          <div className="mt-3 flex flex-wrap gap-2">
            {game.tags.map((t) => (
              <span key={t} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{t}</span>
            ))}
          </div>
        </section>
        <section aria-labelledby="how-to">
          <h2 id="how-to" className="text-xl font-bold">How to Play {game.title}</h2>
          <ol className="mt-2 list-decimal space-y-1.5 pl-5 leading-relaxed text-slate-300">
            {game.howToPlay.map((step, i) => <li key={i}>{step}</li>)}
          </ol>
        </section>
      </div>

      <section className="mt-10" aria-labelledby="related">
        <h2 id="related" className="text-2xl font-extrabold">🎯 Related Games</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {related.map((g) => <GameCard key={g.slug} game={g} />)}
        </div>
      </section>
    </article>
  );
}
