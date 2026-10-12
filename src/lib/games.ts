export type Category = "arcade" | "puzzle" | "classic" | "action";

export interface Game {
  slug: string;
  title: string;
  description: string;
  howToPlay: string[];
  controls: string;
  category: Category;
  emoji: string;
  gradient: string;
  tags: string[];
  featured?: boolean;
  popular?: boolean;
}

export const CATEGORIES: { slug: Category; name: string; description: string; emoji: string }[] = [
  { slug: "arcade", name: "Arcade", description: "Fast-paced arcade classics. Quick reflexes, high scores, endless fun.", emoji: "🕹️" },
  { slug: "puzzle", name: "Puzzle", description: "Brain teasers and logic games that challenge your mind.", emoji: "🧩" },
  { slug: "classic", name: "Classic", description: "Timeless classics everyone knows and loves.", emoji: "♟️" },
  { slug: "action", name: "Action", description: "High-energy action games. Dodge, smash, and survive.", emoji: "⚡" },
];

export const GAMES: Game[] = [
  {
    slug: "snake",
    title: "Snake",
    description: "The legendary Snake game. Guide the snake to eat the red apples, grow longer, and don't hit the walls or your own tail!",
    howToPlay: [
      "Use arrow keys or swipe to change the snake's direction.",
      "Eat the red apples to grow longer and score points.",
      "Every apple is worth 10 points.",
      "The game ends if you hit a wall or your own tail.",
      "Try to beat your high score!",
    ],
    controls: "Arrow keys / WASD or swipe on mobile",
    category: "arcade",
    emoji: "🐍",
    gradient: "from-green-500 to-emerald-700",
    tags: ["snake", "classic", "arcade", "high score"],
    featured: true,
    popular: true,
  },
  {
    slug: "2048",
    title: "2048",
    description: "Join the numbers and get to the 2048 tile! Slide the tiles in four directions — matching numbers merge into their sum.",
    howToPlay: [
      "Use arrow keys or swipe to slide all tiles in one direction.",
      "Tiles with the same number merge into one tile with their sum.",
      "After every move, a new 2 or 4 tile appears.",
      "Reach the 2048 tile to win — keep going for even higher tiles!",
      "The game ends when the board is full and no moves are possible.",
    ],
    controls: "Arrow keys / WASD or swipe on mobile",
    category: "puzzle",
    emoji: "🔢",
    gradient: "from-amber-500 to-orange-700",
    tags: ["2048", "numbers", "merge", "brain"],
    featured: true,
    popular: true,
  },
  {
    slug: "tetris",
    title: "Tetris",
    description: "The world's most famous falling-block puzzle. Rotate and place the tetrominoes to complete full lines and clear them.",
    howToPlay: [
      "Arrow keys: left/right to move, down for soft drop.",
      "Up arrow or X to rotate the piece, Z for counter-rotate.",
      "Spacebar for a hard drop.",
      "Complete horizontal lines to clear them and score.",
      "Clear 4 lines at once (a Tetris) for a big bonus. Survive as long as you can!",
    ],
    controls: "Arrow keys, Z/X rotate, Space hard drop",
    category: "puzzle",
    emoji: "🧱",
    gradient: "from-cyan-500 to-blue-700",
    tags: ["tetris", "blocks", "lines", "classic"],
    featured: true,
    popular: true,
  },
  {
    slug: "flappy-wings",
    title: "Flappy Wings",
    description: "Flap your wings and fly through the pipes! Tap to keep the bird in the air and score a point for every pipe you pass.",
    howToPlay: [
      "Press Space, click, or tap to flap your wings.",
      "Each flap gives the bird a small upward boost.",
      "Gravity pulls you down — keep tapping to stay airborne.",
      "Fly through the gaps in the pipes to score points.",
      "Hitting a pipe or the ground ends the run.",
    ],
    controls: "Space / click / tap to flap",
    category: "arcade",
    emoji: "🐤",
    gradient: "from-sky-400 to-indigo-600",
    tags: ["flappy", "bird", "tap", "reflex"],
    featured: true,
    popular: true,
  },
  {
    slug: "memory-match",
    title: "Memory Match",
    description: "Flip the cards and find all matching pairs. Test your memory — fewer moves and less time means a better score!",
    howToPlay: [
      "Click or tap a card to flip it over.",
      "Flip a second card — if they match, both stay face up.",
      "If they don't match, they flip back over.",
      "Clear all 8 pairs to finish the game.",
      "Your score rewards fewer moves and faster times.",
    ],
    controls: "Click / tap cards",
    category: "puzzle",
    emoji: "🃏",
    gradient: "from-fuchsia-500 to-purple-700",
    tags: ["memory", "cards", "pairs", "brain"],
    popular: true,
  },
  {
    slug: "minesweeper",
    title: "Minesweeper",
    description: "The classic logic puzzle. Clear the minefield using the numbered clues — flag the mines, reveal the safe tiles.",
    howToPlay: [
      "Click a tile to reveal it.",
      "Numbers show how many mines touch that tile.",
      "Right-click (or long-press) to place a flag on suspected mines.",
      "Reveal every safe tile to win.",
      "Click a mine and it's game over — good luck!",
    ],
    controls: "Click to reveal, right-click / long-press to flag",
    category: "classic",
    emoji: "💣",
    gradient: "from-slate-500 to-slate-800",
    tags: ["mines", "logic", "flags", "classic"],
    featured: true,
  },
  {
    slug: "breakout",
    title: "Breakout",
    description: "Smash every brick! Bounce the ball with your paddle, grab power-ups, and clear all levels of colorful bricks.",
    howToPlay: [
      "Move the paddle with your mouse, arrow keys, or finger.",
      "Keep the ball in play — don't let it fall past the paddle.",
      "Break all bricks to clear the level.",
      "Catch falling power-ups: wider paddle, multi-ball, slow ball.",
      "You have 3 lives. Clear all levels to win!",
    ],
    controls: "Mouse / arrow keys / touch drag",
    category: "arcade",
    emoji: "🧱",
    gradient: "from-rose-500 to-red-700",
    tags: ["breakout", "bricks", "paddle", "ball"],
    popular: true,
  },
  {
    slug: "tic-tac-toe",
    title: "Tic Tac Toe",
    description: "The timeless game of X's and O's. Play against a smart AI on easy, medium, or hard difficulty — can you beat it?",
    howToPlay: [
      "Choose your difficulty: Easy, Medium, or Hard.",
      "You play as X, the AI plays as O.",
      "Click an empty square to place your X.",
      "Get three in a row — horizontally, vertically, or diagonally — to win.",
      "Hard mode uses perfect play. A draw is a moral victory!",
    ],
    controls: "Click / tap squares",
    category: "classic",
    emoji: "⭕",
    gradient: "from-indigo-500 to-violet-700",
    tags: ["xo", "strategy", "ai", "classic"],
  },
  {
    slug: "simon-says",
    title: "Simon Says",
    description: "Watch the flashing sequence, then repeat it back. Each round adds one more step — how long a chain can you remember?",
    howToPlay: [
      "Press Start and watch the colored pads light up in sequence.",
      "Repeat the sequence by clicking the pads in the same order.",
      "Each round adds one new step to the sequence.",
      "One wrong pad and the game is over.",
      "Score a point for every round you complete.",
    ],
    controls: "Click / tap the colored pads",
    category: "classic",
    emoji: "🔴",
    gradient: "from-lime-500 to-green-700",
    tags: ["simon", "memory", "sequence", "colors"],
  },
  {
    slug: "whack-a-mole",
    title: "Whack-a-Mole",
    description: "The moles are popping up everywhere! Whack them as fast as you can in 60 seconds — but watch out for the bombs!",
    howToPlay: [
      "Click or tap moles as they pop out of their holes.",
      "Each mole is worth 10 points.",
      "Golden moles are worth 30 — whack them fast!",
      "Never whack a bomb — it costs you 20 points.",
      "You have 60 seconds. How high can you score?",
    ],
    controls: "Click / tap moles",
    category: "action",
    emoji: "🔨",
    gradient: "from-yellow-500 to-amber-700",
    tags: ["whack", "mole", "reflex", "timed"],
    featured: true,
    popular: true,
  },
  {
    slug: "pong",
    title: "Pong",
    description: "The original video game. Rally the ball past the AI opponent's paddle — first to 7 points wins the match.",
    howToPlay: [
      "Move your paddle up and down with arrow keys, W/S, or your mouse/finger.",
      "Hit the ball back toward the AI's side.",
      "Score when the AI misses the ball.",
      "The ball speeds up slightly after every rally.",
      "First to 7 points wins!",
    ],
    controls: "Up/Down arrows, W/S, mouse or touch",
    category: "classic",
    emoji: "🏓",
    gradient: "from-teal-500 to-cyan-700",
    tags: ["pong", "paddle", "ai", "retro"],
  },
  {
    slug: "dodge",
    title: "Dodge",
    description: "How long can you survive? Pilot your ship through a storm of falling meteors. One hit and it's over — pure reflex survival.",
    howToPlay: [
      "Move your ship with arrow keys, WASD, mouse, or touch.",
      "Dodge the falling meteors — one collision ends the run.",
      "Meteors fall faster and more densely over time.",
      "Your score is your survival time in seconds.",
      "Near misses give bonus points. Stay sharp!",
    ],
    controls: "Arrow keys / WASD / mouse / touch",
    category: "action",
    emoji: "🚀",
    gradient: "from-purple-600 to-pink-700",
    tags: ["dodge", "survival", "meteor", "reflex"],
    featured: true,
  },
];

export function getGame(slug: string): Game | undefined {
  return GAMES.find((g) => g.slug === slug);
}

export function getRelated(game: Game, count = 4): Game[] {
  const sameCat = GAMES.filter((g) => g.slug !== game.slug && g.category === game.category);
  const others = GAMES.filter((g) => g.slug !== game.slug && g.category !== game.category);
  return [...sameCat, ...others].slice(0, count);
}

export function searchGames(query: string): Game[] {
  const q = query.trim().toLowerCase();
  if (!q) return GAMES;
  return GAMES.filter(
    (g) =>
      g.title.toLowerCase().includes(q) ||
      g.description.toLowerCase().includes(q) ||
      g.tags.some((t) => t.toLowerCase().includes(q))
  );
}
