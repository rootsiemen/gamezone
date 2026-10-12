"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CELL = 20;
const COLS = 20;
const ROWS = 20;

type Point = { x: number; y: number };

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const stateRef = useRef<{ snake: Point[]; dir: Point; nextDir: Point; apple: Point; alive: boolean }>({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    apple: { x: 15, y: 10 },
    alive: true,
  });
  const touchRef = useRef<Point | null>(null);

  const placeApple = useCallback((snake: Point[]): Point => {
    while (true) {
      const p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
    }
  }, []);

  const reset = useCallback(() => {
    const snake = [{ x: 10, y: 10 }];
    stateRef.current = {
      snake,
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      apple: placeApple(snake),
      alive: true,
    };
    setScore(0);
    setGameOver(false);
    setStarted(true);
  }, [placeApple]);

  useEffect(() => {
    setBest(Number(localStorage.getItem("playzone-snake-best") || 0));
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const s = stateRef.current;
      const map: Record<string, Point> = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
      };
      const nd = map[e.key];
      if (nd) {
        e.preventDefault();
        if (!started && !gameOver) reset();
        if (nd.x !== -s.dir.x || nd.y !== -s.dir.y) s.nextDir = nd;
      }
      if (e.key === " " || e.key === "Enter") {
        if (gameOver) reset();
        else if (!started) reset();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, gameOver, reset]);

  useEffect(() => {
    if (!started || gameOver) return;
    const id = setInterval(() => {
      const s = stateRef.current;
      s.dir = s.nextDir;
      const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
      if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS || s.snake.some((p) => p.x === head.x && p.y === head.y)) {
        s.alive = false;
        setGameOver(true);
        setBest((b) => {
          const nb = Math.max(b, score);
          localStorage.setItem("playzone-snake-best", String(nb));
          return nb;
        });
        return;
      }
      s.snake.unshift(head);
      if (head.x === s.apple.x && head.y === s.apple.y) {
        setScore((sc) => sc + 10);
        s.apple = placeApple(s.snake);
      } else {
        s.snake.pop();
      }
      const cv = canvasRef.current;
      if (cv) {
        const ctx = cv.getContext("2d")!;
        ctx.fillStyle = "#0b0f1a";
        ctx.fillRect(0, 0, cv.width, cv.height);
        ctx.fillStyle = "#ef4444";
        ctx.beginPath();
        ctx.arc(s.apple.x * CELL + CELL / 2, s.apple.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
        ctx.fill();
        s.snake.forEach((p, i) => {
          ctx.fillStyle = i === 0 ? "#4ade80" : "#22c55e";
          ctx.fillRect(p.x * CELL + 1, p.y * CELL + 1, CELL - 2, CELL - 2);
        });
      }
    }, 110);
    return () => clearInterval(id);
  }, [started, gameOver, placeApple, score]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    const s = stateRef.current;
    if (!started && !gameOver) { reset(); return; }
    const nd = Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) };
    if (nd.x !== 0 || nd.y !== 0) {
      if (nd.x !== -s.dir.x || nd.y !== -s.dir.y) s.nextDir = nd;
    }
    touchRef.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-6 text-lg font-bold">
        <span>Score: <span className="text-green-400">{score}</span></span>
        <span>Best: <span className="text-amber-400">{best}</span></span>
      </div>
      <canvas
        ref={canvasRef}
        width={COLS * CELL}
        height={ROWS * CELL}
        className="game-canvas max-w-full rounded-lg border-2 border-green-500/40"
        style={{ height: "auto", maxHeight: "60vh", aspectRatio: "1/1" }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
        onClick={() => { if (!started || gameOver) reset(); }}
      />
      {!started && !gameOver && (
        <button onClick={reset} className="rounded-lg bg-green-600 px-6 py-2 font-bold hover:bg-green-500">
          ▶ Start Game
        </button>
      )}
      {gameOver && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-xl font-bold text-red-400">Game Over! Score: {score}</p>
          <button onClick={reset} className="rounded-lg bg-green-600 px-6 py-2 font-bold hover:bg-green-500">
            ↻ Play Again
          </button>
        </div>
      )}
      <p className="text-sm text-slate-400">Arrow keys / WASD or swipe to move</p>
    </div>
  );
}
