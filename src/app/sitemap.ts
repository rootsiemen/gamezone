import type { MetadataRoute } from "next";
import { GAMES, CATEGORIES } from "@/lib/games";

const SITE_URL = "https://games.tempmaill.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const staticPages = ["", "/about", "/privacy", "/terms", "/contact"].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.5,
  }));
  const gamePages = GAMES.map((g) => ({
    url: `${SITE_URL}/play/${g.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }));
  const catPages = CATEGORIES.map((c) => ({
    url: `${SITE_URL}/category/${c.slug}`,
    lastModified: now,
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));
  return [...staticPages, ...gamePages, ...catPages];
}
