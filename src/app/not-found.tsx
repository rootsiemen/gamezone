import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-xl flex-col items-center px-4 py-20 text-center">
      <p className="text-7xl">👾</p>
      <h1 className="mt-4 text-3xl font-extrabold">Game Over — Page Not Found</h1>
      <p className="mt-2 text-slate-400">This level doesn't exist. Let's get you back to the fun.</p>
      <Link href="/" className="mt-6 rounded-lg bg-violet-600 px-6 py-2.5 font-bold hover:bg-violet-500">
        🎮 Back to Games
      </Link>
    </div>
  );
}
