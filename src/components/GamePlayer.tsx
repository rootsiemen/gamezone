"use client";

import dynamic from "next/dynamic";

const COMPONENTS: Record<string, React.ComponentType> = {
  snake: dynamic(() => import("@/components/games/SnakeGame"), { ssr: false }),
  "2048": dynamic(() => import("@/components/games/Game2048"), { ssr: false }),
  tetris: dynamic(() => import("@/components/games/TetrisGame"), { ssr: false }),
  "flappy-wings": dynamic(() => import("@/components/games/FlappyGame"), { ssr: false }),
  "memory-match": dynamic(() => import("@/components/games/MemoryGame"), { ssr: false }),
  minesweeper: dynamic(() => import("@/components/games/MinesweeperGame"), { ssr: false }),
  breakout: dynamic(() => import("@/components/games/BreakoutGame"), { ssr: false }),
  "tic-tac-toe": dynamic(() => import("@/components/games/TicTacToeGame"), { ssr: false }),
  "simon-says": dynamic(() => import("@/components/games/SimonGame"), { ssr: false }),
  "whack-a-mole": dynamic(() => import("@/components/games/WhackGame"), { ssr: false }),
  pong: dynamic(() => import("@/components/games/PongGame"), { ssr: false }),
  dodge: dynamic(() => import("@/components/games/DodgeGame"), { ssr: false }),
};

export default function GamePlayer({ slug }: { slug: string }) {
  const C = COMPONENTS[slug];
  if (!C) return <p className="text-center text-slate-400">Game not found.</p>;
  return <C />;
}
