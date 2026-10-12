"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const W = 480, H = 560;
const PADDLE_W = 80, PADDLE_H = 12, BALL_R = 8;
const BRICK_ROWS = 5, BRICK_COLS = 8;
const COLORS = ["#f87171", "#fb923c", "#facc15", "#4ade80", "#22d3ee"];

interface PowerUp { x: number; y: number; type: "wide" | "multi" | "slow"; }

export default function BreakoutGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(3);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [started, setStarted] = useState(false);
  const st = useRef({
    px: W / 2 - PADDLE_W / 2, pw: PADDLE_W,
    balls: [] as { x: number; y: number; vx: number; vy: number }[],
    bricks: [] as { x: number; y: number; alive: boolean; color: string }[],
    powers: [] as PowerUp[],
    slowUntil: 0,
  });

  const makeBricks = (lvl: number) => {
    const bw = (W - 40) / BRICK_COLS;
    const bricks: { x: number; y: number; alive: boolean; color: string }[] = [];
    for (let r = 0; r < BRICK_ROWS + Math.min(lvl - 1, 3); r++)
      for (let c = 0; c < BRICK_COLS; c++)
        bricks.push({ x: 20 + c * bw, y: 60 + r * 26, alive: true, color: COLORS[r % COLORS.length] });
    return bricks;
  };

  const reset = useCallback((lvl = 1) => {
    st.current = {
      px: W / 2 - PADDLE_W / 2, pw: PADDLE_W,
      balls: [{ x: W / 2, y: H - 60, vx: 3, vy: -3.4 }],
      bricks: makeBricks(lvl), powers: [], slowUntil: 0,
    };
    if (lvl === 1) { setScore(0); setLives(3); }
    setLevel(lvl); setGameOver(false); setWon(false); setStarted(true);
  }, []);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "a") { st.current.px = Math.max(0, st.current.px - 24); e.preventDefault(); }
      if (e.key === "ArrowRight" || e.key === "d") { st.current.px = Math.min(W - st.current.pw, st.current.px + 24); e.preventDefault(); }
      if ((e.key === " " || e.key === "Enter") && (!started || gameOver || won)) reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, gameOver, won, reset]);

  useEffect(() => {
    if (!started || gameOver || won) return;
    let raf: number;
    const loop = () => {
      const s = st.current;
      const spMul = Date.now() < s.slowUntil ? 0.6 : 1;
      // powers
      s.powers.forEach((p) => { p.y += 2; });
      s.powers = s.powers.filter((p) => {
        if (p.y > H - 30 && p.x > s.px && p.x < s.px + s.pw) {
          if (p.type === "wide") s.pw = Math.min(160, s.pw + 30);
          if (p.type === "slow") s.slowUntil = Date.now() + 8000;
          if (p.type === "multi") {
            const b = s.balls[0];
            if (b) { s.balls.push({ ...b, vx: -b.vx }, { ...b, vx: b.vx * 0.5, vy: -Math.abs(b.vy) }); }
          }
          return false;
        }
        return p.y < H;
      });
      // balls
      for (const b of s.balls) {
        b.x += b.vx * spMul; b.y += b.vy * spMul;
        if (b.x < BALL_R || b.x > W - BALL_R) b.vx *= -1;
        if (b.y < BALL_R) b.vy *= -1;
        if (b.y + BALL_R > H - 24 && b.y + BALL_R < H - 8 && b.x > s.px && b.x < s.px + s.pw && b.vy > 0) {
          const rel = (b.x - (s.px + s.pw / 2)) / (s.pw / 2);
          const ang = rel * 1.1;
          const sp = Math.hypot(b.vx, b.vy);
          b.vx = Math.sin(ang) * sp; b.vy = -Math.cos(ang) * sp;
        }
        const bw = (W - 40) / BRICK_COLS;
        for (const br of s.bricks) {
          if (!br.alive) continue;
          if (b.x > br.x && b.x < br.x + bw && b.y - BALL_R < br.y + 24 && b.y + BALL_R > br.y) {
            br.alive = false; b.vy *= -1;
            setScore((sc) => sc + 10);
            if (Math.random() < 0.14) {
              const types: PowerUp["type"][] = ["wide", "multi", "slow"];
              s.powers.push({ x: br.x + bw / 2, y: br.y, type: types[Math.floor(Math.random() * 3)] });
            }
            break;
          }
        }
      }
      s.balls = s.balls.filter((b) => b.y < H + 20);
      if (s.balls.length === 0) {
        setLives((l) => {
          if (l <= 1) { setGameOver(true); return 0; }
          s.balls = [{ x: s.px + s.pw / 2, y: H - 60, vx: 3, vy: -3.4 }];
          return l - 1;
        });
      }
      if (s.bricks.every((b) => !b.alive)) {
        if (level >= 3) setWon(true);
        else { setScore((sc) => sc + 100); reset(level + 1); return; }
      }
      const cv = canvasRef.current;
      if (cv) {
        const ctx = cv.getContext("2d")!;
        ctx.fillStyle = "#0b0f1a"; ctx.fillRect(0, 0, W, H);
        const bw = (W - 40) / BRICK_COLS;
        s.bricks.forEach((br) => {
          if (!br.alive) return;
          ctx.fillStyle = br.color;
          ctx.fillRect(br.x + 2, br.y + 2, bw - 4, 20);
        });
        ctx.fillStyle = "#e2e8f0";
        ctx.fillRect(s.px, H - 20, s.pw, PADDLE_H);
        ctx.fillStyle = "#fbbf24";
        s.balls.forEach((b) => { ctx.beginPath(); ctx.arc(b.x, b.y, BALL_R, 0, Math.PI * 2); ctx.fill(); });
        s.powers.forEach((p) => {
          ctx.fillStyle = p.type === "wide" ? "#4ade80" : p.type === "multi" ? "#a78bfa" : "#22d3ee";
          ctx.beginPath(); ctx.arc(p.x, p.y, 8, 0, Math.PI * 2); ctx.fill();
          ctx.fillStyle = "#0b0f1a"; ctx.font = "bold 10px sans-serif"; ctx.textAlign = "center";
          ctx.fillText(p.type === "wide" ? "W" : p.type === "multi" ? "×" : "S", p.x, p.y + 3.5);
        });
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [started, gameOver, won, level, reset]);

  const movePaddle = (clientX: number) => {
    const cv = canvasRef.current; if (!cv) return;
    const rect = cv.getBoundingClientRect();
    const x = ((clientX - rect.left) / rect.width) * W;
    st.current.px = Math.max(0, Math.min(W - st.current.pw, x - st.current.pw / 2));
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-5 text-lg font-bold">
        <span>Score: <span className="text-rose-400">{score}</span></span>
        <span>Lives: <span className="text-emerald-400">{"❤️".repeat(Math.max(0, lives)) || "—"}</span></span>
        <span>Level: <span className="text-violet-400">{level}/3</span></span>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} width={W} height={H}
          className="game-canvas max-w-full rounded-lg border-2 border-rose-500/40"
          style={{ height: "auto", maxHeight: "62vh" }}
          onPointerMove={(e) => { if (e.buttons || e.pointerType === "touch") movePaddle(e.clientX); }}
          onPointerDown={(e) => { movePaddle(e.clientX); if (!started || gameOver || won) reset(); }} />
        {!started && (
          <button onClick={() => reset()} className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 text-xl font-bold">🧱 Tap to Start</button>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-black/70">
            <p className="text-xl font-bold text-red-400">Game Over!</p>
            <p className="font-bold">Score: {score}</p>
            <button onClick={() => reset()} className="rounded-lg bg-rose-600 px-6 py-2 font-bold hover:bg-rose-500">↻ Play Again</button>
          </div>
        )}
        {won && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-black/70">
            <p className="text-xl font-bold text-emerald-400">🎉 You cleared all levels!</p>
            <p className="font-bold">Score: {score}</p>
            <button onClick={() => reset()} className="rounded-lg bg-rose-600 px-6 py-2 font-bold hover:bg-rose-500">↻ Play Again</button>
          </div>
        )}
      </div>
      <p className="text-sm text-slate-400">Move mouse / arrows / drag to move paddle · W wide · × multi-ball · S slow</p>
    </div>
  );
}
