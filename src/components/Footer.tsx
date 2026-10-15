import Link from "next/link";
import { GAMES, CATEGORIES } from "@/lib/games";

export default function Footer() {
  const popular = GAMES.filter((g) => g.popular).slice(0, 5);

  return (
    <footer className="mt-12 border-t border-[#2a3560] bg-[#141a30]">
      <div className="mx-auto grid max-w-[1400px] gap-8 px-4 py-10 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <p className="flex items-center gap-2 text-xl font-extrabold text-white">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-[#7c6cf8] to-[#38e1ff] text-lg">🎮</span>
            Play<span className="text-[#7c6cf8]">Zone</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-[#a3adc9]">
            Free online games — play instantly in your browser. No downloads, no signup, no hassle.
          </p>
        </div>
        <nav aria-label="Popular games">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Popular Games</p>
          <ul className="space-y-2 text-sm text-[#a3adc9]">
            {popular.map((g) => (
              <li key={g.slug}>
                <Link href={`/play/${g.slug}`} className="hover:text-white">{g.title}</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Categories">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Categories</p>
          <ul className="space-y-2 text-sm text-[#a3adc9]">
            {CATEGORIES.map((c) => (
              <li key={c.slug}>
                <Link href={`/category/${c.slug}`} className="hover:text-white">{c.emoji} {c.name} Games</Link>
              </li>
            ))}
          </ul>
        </nav>
        <nav aria-label="Company">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">PlayZone</p>
          <ul className="space-y-2 text-sm text-[#a3adc9]">
            <li><Link href="/about" className="hover:text-white">About Us</Link></li>
            <li><Link href="/blog" className="hover:text-white">Blog</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
          </ul>
        </nav>
        <nav aria-label="Our sites">
          <p className="mb-3 text-sm font-bold uppercase tracking-wider text-white">Our Sites</p>
          <ul className="space-y-2 text-sm text-[#a3adc9]">
            <li><a href="https://tempmaill.tech" target="_blank" rel="noopener" className="hover:text-white">Temp Mail — Free Disposable Email</a></li>
            <li><a href="https://frinjo.me" target="_blank" rel="noopener" className="hover:text-white">Frinjo — Web Development</a></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-[#232b4d] py-4 text-center text-xs text-[#a3adc9]/70">
        © {new Date().getFullYear()} PlayZone — Free Online Games. All games are free to play.
      </div>
    </footer>
  );
}
