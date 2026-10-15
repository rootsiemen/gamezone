export interface BlogPost {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  readMinutes: number;
  emoji: string;
  content: { heading?: string; paragraphs: string[] }[];
}

export const POSTS: BlogPost[] = [
  {
    slug: "best-free-browser-games-2026",
    title: "10 Best Free Browser Games to Play in 2026 (No Download Needed)",
    excerpt:
      "No installs, no signups, no waiting — just click and play. Here are the ten best free browser games worth your time in 2026.",
    date: "2026-10-15",
    readMinutes: 6,
    emoji: "🎮",
    content: [
      {
        paragraphs: [
          "Browser games have quietly become one of the best ways to kill fifteen minutes — or lose an entire evening. No downloads, no 50 GB updates, no accounts. You open a tab, you play. Here are ten free browser games that are actually worth your time in 2026, starting with the classics you can play right here on PlayZone.",
        ],
      },
      {
        heading: "The timeless classics",
        paragraphs: [
          "Snake remains the king of 'one more try.' The rules fit in a sentence — eat, grow, don't crash — but chasing a high score never gets old. Tetris-style block stackers and Minesweeper scratch the same itch: simple rules, endless depth, and a score to beat.",
          "What makes these classics survive is that they respect your time. A round takes two minutes, you can pause anytime, and they run on anything — a school Chromebook, an old phone, a work laptop on lunch break.",
        ],
      },
      {
        heading: "Puzzle games that respect your brain",
        paragraphs: [
          "2048 is the perfect coffee-break game: one mechanic, escalating tension, and that beautiful moment when two 1024 tiles finally meet. Sudoku and nonogram-style logic puzzles offer slower, deeper sessions for when you want to think instead of react.",
          "The best puzzle games share a trait — they teach you without a tutorial. You learn the rules by playing, which means zero friction between 'I'm bored' and 'I'm playing.'",
        ],
      },
      {
        heading: "Quick arcade action",
        paragraphs: [
          "Breakout clones, endless runners, and aim trainers are perfect for short bursts. They load instantly, the controls are one or two keys, and the feedback loop is immediate: miss, retry, improve.",
          "Pro tip: arcade games are also the best way to test a new keyboard or mouse. If you can beat your Snake high score, the hardware is fine.",
        ],
      },
      {
        heading: "Why browser games win in 2026",
        paragraphs: [
          "Big game installs keep getting bigger, but browser games go the other direction: instant, free, and private. Nothing to install means nothing to uninstall, no launchers phoning home, and no storage anxiety on a full phone.",
          "So next time you have ten minutes and a browser, skip the app store. The best games of 2026 might already be one click away — start with the classics on PlayZone and see how long 'just one more round' lasts.",
        ],
      },
    ],
  },
  {
    slug: "why-browser-games-are-back-2026",
    title: "Why Browser Games Are Making a Huge Comeback in 2026",
    excerpt:
      "After a decade of app stores and 100 GB installs, players are rediscovering the humble browser tab. Here's what's driving the comeback.",
    date: "2026-10-15",
    readMinutes: 5,
    emoji: "🚀",
    content: [
      {
        paragraphs: [
          "Ten years ago, the browser game looked dead. Flash was gone, app stores ruled, and 'real' gaming meant downloads measured in gigabytes. But in 2026, browser games are back — bigger than ever. Here's why the simplest platform in gaming is winning again.",
        ],
      },
      {
        heading: "Zero friction beats everything",
        paragraphs: [
          "Every step between 'I want to play' and 'I'm playing' loses players. Download, install, account, tutorial, update — each one is a chance to quit. Browser games collapse all of it into a single click. That advantage compounds: a game your friend links you is a game you actually try.",
          "This is why viral hits still start in browsers. The share link IS the game. No one forwards a 40 GB download; everyone forwards a URL.",
        ],
      },
      {
        heading: "The tech finally caught up",
        paragraphs: [
          "Modern browsers run circles around the old Flash era. WebGL and WebGPU deliver real 3D, WebAssembly runs near-native code, and even mid-range phones handle complex games at 60 fps. The gap between 'browser game' and 'real game' has shrunk to almost nothing for casual genres.",
          "Developers noticed. Small teams can now ship polished games to every device at once — no app-store review, no platform fees, no porting.",
        ],
      },
      {
        heading: "Privacy and storage",
        paragraphs: [
          "Players are tired of games that demand accounts, track everything, and eat 20 GB. A browser game asks for nothing: no install, no permissions, no personal data. Close the tab and it's gone — no uninstaller, no leftover files.",
          "On phones with full storage and laptops with spinning disks, 'no download' isn't just convenient. It's the only option that fits.",
        ],
      },
      {
        heading: "What this means for you",
        paragraphs: [
          "The comeback means more choice, not less. The same classics — Snake, Tetris-style puzzlers, arcade shooters — now run better than ever, alongside a wave of new indie browser games pushing what a tab can do.",
          "If you haven't played in a browser in years, you're in for a surprise. Open PlayZone, pick a game, and remember why the simplest ideas are usually the most fun.",
        ],
      },
    ],
  },
];

export function getPost(slug: string): BlogPost | undefined {
  return POSTS.find((p) => p.slug === slug);
}

export function formatPostDate(iso: string): string {
  const d = new Date(iso + "T00:00:00");
  return d.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
