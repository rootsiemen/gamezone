# PlayZone — Free Online Games

🌐 **Play now:** https://games.tempmaill.tech

A Next.js 16 games portal (CrazyGames-style, smaller). Dark gaming theme, 12 fully playable
HTML5 games, SEO-ready, AdSense-ready.

## Games (12)
| # | Game | Slug | Category |
|---|------|------|----------|
| 1 | Snake | /play/snake | arcade |
| 2 | 2048 | /play/2048 | puzzle |
| 3 | Tetris | /play/tetris | puzzle |
| 4 | Flappy Wings | /play/flappy-wings | arcade |
| 5 | Memory Match | /play/memory-match | puzzle |
| 6 | Minesweeper | /play/minesweeper | classic |
| 7 | Breakout | /play/breakout | arcade |
| 8 | Tic Tac Toe (vs AI, 3 difficulties) | /play/tic-tac-toe | classic |
| 9 | Simon Says | /play/simon-says | classic |
| 10 | Whack-a-Mole | /play/whack-a-mole | action |
| 11 | Pong (vs AI, 3 difficulties) | /play/pong | classic |
| 12 | Dodge (meteor survival) | /play/dodge | action |

All games: real game logic, scoring, high scores (localStorage), game over/restart,
keyboard + touch/mouse controls.

## Pages
- `/` — homepage (hero, featured, popular, categories, search via `?q=`)
- `/play/[slug]` — game page (playable canvas, description, how-to, related games)
- `/category/[slug]` — arcade / puzzle / classic / action
- `/about`, `/privacy`, `/terms`, `/contact`

## SEO
- Metadata + canonical + OpenGraph + Twitter cards on all pages
- `sitemap.xml` + `robots.txt`
- JSON-LD: Organization + WebSite (layout), VideoGame + BreadcrumbList (game pages), ItemList (category pages)

## AdSense
- `public/ads.txt` placeholder (replace `pub-0000000000000000` with real publisher ID)
- Commented ad-script + ad-slot placeholders in `src/app/layout.tsx`

## Before going live
1. Replace `https://playzone.example.com` with the real domain (layout.tsx, sitemap.ts,
   robots.ts, play/[slug]/page.tsx, category/[slug]/page.tsx, about/privacy/terms/contact pages).
2. Replace the ads.txt publisher ID + uncomment ad code after AdSense approval.
3. Update contact email in `src/app/contact/page.tsx`.

## Dev
```bash
npm install
npm run dev
npm run build
```

## Our Sites

- [PlayZone](https://games.tempmaill.tech) — free online games
- [Temp Mail](https://tempmaill.tech) — free temporary email addresses
- [Frinjo](https://frinjo.me) — web development agency
- [WebStore Dev](https://tarm.tech) — web development agency
