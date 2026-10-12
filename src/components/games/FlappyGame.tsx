"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const W = 400, H = 500;
const BIRD_X = 80, BIRD_R = 14, GRAV = 0.45, FLAP = -7.5, PIPE_W = 60, GAP = 150, SPEED = 2.4;

export default function FlappyGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const st = useRef({ y: H / 2, v: 0, pipes: [] as { x: number; gapY: number; scored: boolean }[], frame: 0 });

  useEffect(() => { setBest(Number(localStorage.getItem("playzone-flappy-best") || 0)); }, []);

  const reset = useCallback(() => {
    st.current = { y: H / 2, v: 0, pipes: [], frame: 0 };
    setScore(0); setGameOver(false); setStarted(true);
  }, []);

  const flap = useCallback(() => {
    if (gameOver) { reset(); return; }
    if (!started) { reset(); return; }
    st.current.v = FLAP;
  }, [gameOver, started, reset]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (e.key === " " || e.key === "ArrowUp") { e.preventDefault(); flap(); } };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [flap]);

  useEffect(() => {
    if (!started) {
      const cv = canvasRef.current;
      if (cv) {
        const ctx = cv.getContext("2d")!;
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, "#0ea5e9"); grad.addColorStop(1, "#1e3a8a");
        ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath(); ctx.arc(BIRD_X, H/2, BIRD_R, 0, Math.PI*2); ctx.fill();
      }
      return;
    }
    let raf: number;
    const loop = () => {
      if (gameOver) return;
      const s = st.current;
      s.frame++;
      s.v += GRAV; s.y += s.v;
      if (s.frame % 110 === 0) {
        const gapY = 90 + Math.random() * (H - 180 - GAP);
        s.pipes.push({ x: W, gapY, scored: false });
      }
      s.pipes.forEach((p) => {
        p.x -= SPEED;
        if (!p.scored && p.x + PIPE_W < BIRD_X) { p.scored = true; setScore((sc) => sc + 1); }
      });
      s.pipes = s.pipes.filter((p) => p.x + PIPE_W > 0);
      let dead = s.y + BIRD_R >= H || s.y - BIRD_R <= 0;
      for (const p of s.pipes) {
        if (BIRD_X + BIRD_R > p.x && BIRD_X - BIRD_R < p.x + PIPE_W &&
            (s.y - BIRD_R < p.gapY || s.y + BIRD_R > p.gapY + GAP)) { dead = true; break; }
      }
      const cv = canvasRef.current;
      if (cv) {
        const ctx = cv.getContext("2d")!;
        const grad = ctx.createLinearGradient(0, 0, 0, H);
        grad.addColorStop(0, "#0ea5e9"); grad.addColorStop(1, "#1e3a8a");
        ctx.fillStyle = grad; ctx.fillRect(0, 0, W, H);
        ctx.fillStyle = "#22c55e";
        s.pipes.forEach((p) => {
          ctx.fillRect(p.x, 0, PIPE_W, p.gapY);
          ctx.fillRect(p.x, p.gapY + GAP, PIPE_W, H - p.gapY - GAP);
          ctx.fillStyle = "#15803d";
          ctx.fillRect(p.x - 3, p.gapY - 18, PIPE_W + 6, 18);
          ctx.fillRect(p.x - 3, p.gapY + GAP, PIPE_W + 6, 18);
          ctx.fillStyle = "#22c55e";
        });
        ctx.fillStyle = "#fbbf24";
        ctx.beginPath(); ctx.arc(BIRD_X, s.y, BIRD_R, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#f97316";
        ctx.beginPath(); ctx.arc(BIRD_X + 6, s.y - 4, 4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff";
        ctx.beginPath(); ctx.arc(BIRD_X + 8, s.y - 6, 2.4, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#fff"; ctx.font = "bold 36px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(String(score), W / 2, 60);
      }
      if (dead) {
        setGameOver(true);
        setBest((b) => { const nb = Math.max(b, score); localStorage.setItem("playzone-flappy-best", String(nb)); return nb; });
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [started, gameOver, score]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-6 text-lg font-bold">
        <span>Score: <span className="text-sky-400">{score}</span></span>
        <span>Best: <span className="text-amber-400">{best}</span></span>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} width={W} height={H}
          className="game-canvas max-w-full rounded-lg border-2 border-sky-500/40"
          style={{ height: "auto", maxHeight: "60vh" }}
          onPointerDown={flap} />
        {!started && (
          <button onClick={reset} className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 text-xl font-bold">
            🐤 Tap to Start
          </button>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-black/60">
            <p className="text-xl font-bold text-red-400">Game Over!</p>
            <p className="font-bold">Score: {score} · Best: {Math.max(best, score)}</p>
            <button onClick={reset} className="rounded-lg bg-sky-600 px-6 py-2 font-bold hover:bg-sky-500">↻ Fly Again</button>
          </div>
        )}
      </div>
      <p className="text-sm text-slate-400">Space / click / tap to flap</p>
    </div>
  );
}
