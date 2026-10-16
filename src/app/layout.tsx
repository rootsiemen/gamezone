import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

const SITE_URL = "https://games.tempmaill.tech";
const SITE_NAME = "PlayZone";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PlayZone: Free Online Games — Play Instantly, No Download",
    template: "%s | PlayZone",
  },
  description:
    "Play free online games at PlayZone! Snake, 2048, Tetris, Flappy Wings, Minesweeper, Breakout and more — no downloads, no signup. Play instantly in your browser.",
  keywords: ["free online games", "play games online", "browser games", "snake game", "2048 game", "tetris online", "flappy bird", "minesweeper", "breakout game"],
  authors: [{ name: "PlayZone" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    title: "PlayZone: Free Online Games — Play Instantly, No Download",
    description: "Play free online games instantly in your browser. No downloads, no signup.",
    url: SITE_URL,
    siteName: SITE_NAME,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "PlayZone: Free Online Games — Play Instantly, No Download",
    description: "Play free online games instantly in your browser. No downloads, no signup.",
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
  description: "Free online games playable instantly in your browser.",
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
      </head>
      <body className="flex min-h-screen flex-col">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        {/* Ad slot placeholder — enable after AdSense approval
        <ins className="adsbygoogle" data-ad-client="ca-pub-0000000000000000" data-ad-slot="0000000000" />
        */}
      </body>
    </html>
  );
}
