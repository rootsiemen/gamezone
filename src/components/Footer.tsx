import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-violet-500/20 bg-[#0d1322]">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:grid-cols-4">
        <div>
          <p className="text-xl font-extrabold">🎮 PlayZone</p>
          <p className="mt-2 text-sm text-slate-400">Free online games — play instantly in your browser. No downloads, no signup.</p>
        </div>
        <nav aria-label="Games">
          <p className="mb-3 font-bold">Popular Games</p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link href="/play/snake" className="hover:text-white">Snake</Link></li>
            <li><Link href="/play/2048" className="hover:text-white">2048</Link></li>
            <li><Link href="/play/tetris" className="hover:text-white">Tetris</Link></li>
            <li><Link href="/play/flappy-wings" className="hover:text-white">Flappy Wings</Link></li>
          </ul>
        </nav>
        <nav aria-label="Categories">
          <p className="mb-3 font-bold">Categories</p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link href="/category/arcade" className="hover:text-white">Arcade</Link></li>
            <li><Link href="/category/puzzle" className="hover:text-white">Puzzle</Link></li>
            <li><Link href="/category/classic" className="hover:text-white">Classic</Link></li>
            <li><Link href="/category/action" className="hover:text-white">Action</Link></li>
          </ul>
        </nav>
        <nav aria-label="About">
          <p className="mb-3 font-bold">PlayZone</p>
          <ul className="space-y-2 text-sm text-slate-400">
            <li><Link href="/about" className="hover:text-white">About</Link></li>
            <li><Link href="/contact" className="hover:text-white">Contact</Link></li>
            <li><Link href="/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link href="/terms" className="hover:text-white">Terms of Service</Link></li>
          </ul>
        </nav>
      </div>
      <div className="border-t border-slate-800 py-4 text-center text-xs text-slate-500">
        © {new Date().getFullYear()} PlayZone — Free Online Games. All games are free to play.
      </div>
    </footer>
  );
}
