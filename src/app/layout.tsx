import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { GAMES } from "@/lib/games";

const SITE_URL = "https://games.tempmaill.tech";
const SITE_NAME = "PlayZone";
const OG_IMAGE = `${SITE_URL}/thumbnails/snake.jpg`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PlayZone — Free Online Games, No Download Needed",
    template: "%s | PlayZone",
  },
  description:
    "Play free online games at PlayZone! Snake, 2048, Tetris, Flappy Wings, Minesweeper, Breakout and more — play games online instantly with no downloads and no signup.",
  keywords: ["free online games", "play games online", "no download games", "browser games", "free browser games", "snake game", "2048 game", "tetris online", "flappy bird", "minesweeper", "breakout game"],
  authors: [{ name: "PlayZone" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "PlayZone — Free Online Games, No Download Needed",
    description: "Play free online games instantly in your browser. No downloads, no signup — just play.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
    images: [{ url: OG_IMAGE, alt: "PlayZone — free online games, no download needed" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "PlayZone — Free Online Games, No Download Needed",
    description: "Play free online games instantly in your browser. No downloads, no signup — just play.",
    images: [OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  verification: {
    google: "WJfsQ2_qRNJmlkRiUTtLJ4SOtunciiV5nMdTX7ED86w",
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: SITE_NAME,
  url: SITE_URL,
  description: "PlayZone — free online browser games. No downloads, no signup.",
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: SITE_URL,
  description: "Free online games playable instantly in your browser — no downloads, no signup.",
};

const itemListSchema = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Free Online Games on PlayZone",
  description: "Play these free online games instantly in your browser — no downloads, no signup.",
  itemListElement: GAMES.map((g, i) => ({
    "@type": "ListItem",
    position: i + 1,
    name: g.title,
    url: `${SITE_URL}/play/${g.slug}`,
  })),
};

const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: [
    {
      "@type": "Question",
      name: "Do I need to download anything to play games on PlayZone?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No. Every game on PlayZone runs instantly in your web browser — no downloads, no installs, and no plugins required.",
      },
    },
    {
      "@type": "Question",
      name: "Is PlayZone really free?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Yes. All games on PlayZone are 100% free to play, with no hidden costs, no paywalls, and no premium tiers.",
      },
    },
    {
      "@type": "Question",
      name: "Which devices can I play PlayZone games on?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "Any modern device with a web browser — desktop computers, laptops, tablets, and smartphones. Keyboard, mouse, and touch controls are all supported.",
      },
    },
    {
      "@type": "Question",
      name: "Do I need an account or signup to play?",
      acceptedAnswer: {
        "@type": "Answer",
        text: "No account needed. Just open a game and start playing — no signup, no email, and no login required.",
      },
    },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9075805757065172"
          crossOrigin="anonymous"
        />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }} />
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Ad slot placeholder — enable after AdSense approval
        <ins className="adsbygoogle" data-ad-client="ca-pub-0000000000000000" data-ad-slot="0000000000" />
        */}
        {/* 100% privacy-first analytics */}
        <script async src="https://scripts.simpleanalyticscdn.com/latest.js" />
      </body>
    </html>
  );
}
