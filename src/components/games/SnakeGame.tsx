"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const CELL = 20;
const COLS = 20;
const ROWS = 20;

type Point = { x: number; y: number };
type Phase = "idle" | "countdown" | "ready" | "playing" | "over";

export default function SnakeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const [count, setCount] = useState(3);
  const phaseRef = useRef<Phase>("idle");
  const stateRef = useRef<{ snake: Point[]; dir: Point; nextDir: Point; apple: Point }>({
    snake: [{ x: 10, y: 10 }],
    dir: { x: 1, y: 0 },
    nextDir: { x: 1, y: 0 },
    apple: { x: 15, y: 10 },
  });
  const touchRef = useRef<Point | null>(null);

  const setPhaseBoth = (p: Phase) => {
    phaseRef.current = p;
    setPhase(p);
  };

  const placeApple = useCallback((snake: Point[]): Point => {
    while (true) {
      const p = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
      if (!snake.some((s) => s.x === p.x && s.y === p.y)) return p;
    }
  }, []);

  const draw = useCallback(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const s = stateRef.current;
    ctx.fillStyle = "#0d1122";
    ctx.fillRect(0, 0, cv.width, cv.height);
    // subtle grid
    ctx.strokeStyle = "rgba(255,255,255,0.04)";
    ctx.lineWidth = 1;
    for (let i = 1; i < COLS; i++) {
      ctx.beginPath(); ctx.moveTo(i * CELL, 0); ctx.lineTo(i * CELL, cv.height); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, i * CELL); ctx.lineTo(cv.width, i * CELL); ctx.stroke();
    }
    // apple
    ctx.fillStyle = "#ef4444";
    ctx.beginPath();
    ctx.arc(s.apple.x * CELL + CELL / 2, s.apple.y * CELL + CELL / 2, CELL / 2 - 2, 0, Math.PI * 2);
    ctx.fill();
    // snake
    s.snake.forEach((p, i) => {
      ctx.fillStyle = i === 0 ? "#4ade80" : "#22c55e";
      const r = 4;
      const x = p.x * CELL + 1, y = p.y * CELL + 1, w = CELL - 2, h = CELL - 2;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fill();
    });
  }, []);

  const drawOverlay = useCallback((text: string, sub?: string) => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    ctx.fillStyle = "rgba(13,17,34,0.72)";
    ctx.fillRect(0, 0, cv.width, cv.height);
    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 64px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, cv.width / 2, cv.height / 2 - (sub ? 18 : 0));
    if (sub) {
      ctx.fillStyle = "#a3adc9";
      ctx.font = "16px sans-serif";
      ctx.fillText(sub, cv.width / 2, cv.height / 2 + 34);
    }
  }, []);

  const startCountdown = useCallback(() => {
    const snake = [{ x: 10, y: 10 }];
    stateRef.current = {
      snake,
      dir: { x: 1, y: 0 },
      nextDir: { x: 1, y: 0 },
      apple: placeApple(snake),
    };
    setScore(0);
    setPhaseBoth("countdown");
    setCount(3);
    draw();
  }, [placeApple, draw]);

  // countdown ticker
  useEffect(() => {
    if (phase !== "countdown") return;
    draw();
    drawOverlay(String(count));
    if (count <= 0) {
      setPhaseBoth("ready");
      return;
    }
    const id = setTimeout(() => setCount((c) => c - 1), 700);
    return () => clearTimeout(id);
  }, [phase, count, draw, drawOverlay]);

  // draw static board when ready
  useEffect(() => {
    if (phase !== "ready") return;
    draw();
    drawOverlay("▶", "Press an arrow key or tap to begin");
  }, [phase, draw, drawOverlay]);

  // draw idle board on mount
  useEffect(() => {
    draw();
    setBest(Number(localStorage.getItem("playzone-snake-best") || 0));
  }, [draw]);

  const beginPlaying = useCallback(() => {
    if (phaseRef.current === "ready") setPhaseBoth("playing");
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
        if (phaseRef.current === "ready") {
          if (nd.x !== -s.dir.x || nd.y !== -s.dir.y) s.nextDir = nd;
          beginPlaying();
        } else if (phaseRef.current === "playing") {
          if (nd.x !== -s.dir.x || nd.y !== -s.dir.y) s.nextDir = nd;
        } else if (phaseRef.current === "idle" || phaseRef.current === "over") {
          startCountdown();
        }
      }
      if ((e.key === " " || e.key === "Enter") && (phaseRef.current === "idle" || phaseRef.current === "over")) {
        e.preventDefault();
        startCountdown();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [startCountdown, beginPlaying]);

  // game loop — only runs in "playing" phase
  useEffect(() => {
    if (phase !== "playing") return;
    const id = setInterval(() => {
      const s = stateRef.current;
      s.dir = s.nextDir;
      const head = { x: s.snake[0].x + s.dir.x, y: s.snake[0].y + s.dir.y };
      if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS || s.snake.some((p) => p.x === head.x && p.y === head.y)) {
        setPhaseBoth("over");
        setBest((b) => {
          const nb = Math.max(b, score);
          localStorage.setItem("playzone-snake-best", String(nb));
          return nb;
        });
        draw();
        drawOverlay("Game Over", `Score: ${score} — press Space to retry`);
        return;
      }
      s.snake.unshift(head);
      if (head.x === s.apple.x && head.y === s.apple.y) {
        setScore((sc) => sc + 10);
        s.apple = placeApple(s.snake);
      } else {
        s.snake.pop();
      }
      draw();
    }, 110);
    return () => clearInterval(id);
  }, [phase, placeApple, score, draw, drawOverlay]);

  const onTouchStart = (e: React.TouchEvent) => {
    touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dx = e.changedTouches[0].clientX - touchRef.current.x;
    const dy = e.changedTouches[0].clientY - touchRef.current.y;
    const s = stateRef.current;
    const p = phaseRef.current;
    if (p === "idle" || p === "over") { startCountdown(); touchRef.current = null; return; }
    if (Math.abs(dx) < 12 && Math.abs(dy) < 12) {
      // treat as tap
      if (p === "ready") beginPlaying();
      touchRef.current = null;
      return;
    }
    const nd = Math.abs(dx) > Math.abs(dy) ? { x: Math.sign(dx), y: 0 } : { x: 0, y: Math.sign(dy) };
    if (nd.x !== 0 || nd.y !== 0) {
      if (p === "ready") {
        if (nd.x !== -s.dir.x || nd.y !== -s.dir.y) s.nextDir = nd;
        beginPlaying();
      } else if (p === "playing") {
        if (nd.x !== -s.dir.x || nd.y !== -s.dir.y) s.nextDir = nd;
      }
    }
    touchRef.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-6 text-lg font-bold text-white">
        <span>Score: <span className="text-green-400">{score}</span></span>
        <span>Best: <span className="text-amber-400">{best}</span></span>
      </div>
      <div className="w-full rounded-xl border-2 border-[#35406e] bg-[#0d1122] p-2 shadow-[0_0_40px_rgba(0,0,0,0.5)]">
        <canvas
          ref={canvasRef}
          width={COLS * CELL}
          height={ROWS * CELL}
          className="game-canvas mx-auto block max-w-full rounded-lg"
          style={{ height: "auto", maxHeight: "60vh", aspectRatio: "1/1" }}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
          onClick={() => {
            const p = phaseRef.current;
            if (p === "idle" || p === "over") startCountdown();
            else if (p === "ready") beginPlaying();
          }}
        />
      </div>
      {(phase === "idle" || phase === "over") && (
        <button onClick={startCountdown} className="rounded-full bg-[#7c6cf8] px-8 py-2.5 font-bold text-white shadow-lg hover:bg-[#6a5ae0]">
          {phase === "over" ? "↻ Play Again" : "▶ Start Game"}
        </button>
      )}
      {phase === "countdown" && (
        <p className="text-sm font-semibold text-[#a3adc9]">Get ready…</p>
      )}
      {phase === "ready" && (
        <p className="animate-pulse text-sm font-semibold text-[#a3adc9]">Press an arrow key or tap to begin</p>
      )}
      <p className="text-xs text-[#a3adc9]/70">Arrow keys / WASD or swipe to move</p>
    </div>
  );
}
