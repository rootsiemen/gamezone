import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { GAMES, CATEGORIES } from "@/lib/games";
import GameCard from "@/components/GameCard";
import Link from "next/link";

const SITE_URL = "https://games.tempmaill.tech";

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) return {};
  const url = `${SITE_URL}/category/${cat.slug}`;
  return {
    title: `Free ${cat.name} Games Online`,
    description: `Play free ${cat.name.toLowerCase()} games online at PlayZone. ${cat.description} No downloads, no signup.`,
    alternates: { canonical: url },
    openGraph: {
      title: `Free ${cat.name} Games Online | PlayZone`,
      description: cat.description,
      url,
      siteName: "PlayZone",
      type: "website",
      images: [{ url: `${SITE_URL}/opengraph-image.jpg`, alt: `Free ${cat.name} games on PlayZone` }],
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const cat = CATEGORIES.find((c) => c.slug === slug);
  if (!cat) notFound();
  const games = GAMES.filter((g) => g.category === cat.slug);

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${cat.name} Games`,
    description: cat.description,
    itemListElement: games.map((g, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: g.title,
      url: `${SITE_URL}/play/${g.slug}`,
    })),
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
      <nav aria-label="Breadcrumb" className="text-sm text-slate-400">
        <Link href="/" className="hover:text-white">Home</Link> / <span className="text-slate-200">{cat.name} Games</span>
      </nav>
      <header className="mt-4">
        <h1 className="text-3xl font-extrabold">{cat.emoji} Free {cat.name} Games Online</h1>
        <p className="mt-2 max-w-2xl text-slate-300">{cat.description} All {games.length} games below are free to play instantly in your browser.</p>
      </header>
      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {games.map((g) => <GameCard key={g.slug} game={g} />)}
      </div>
    </div>
  );
}
