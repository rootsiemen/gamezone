"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const W = 420, H = 560;
const SHIP_R = 12;

interface Meteor { x: number; y: number; r: number; vy: number; vx: number; }

export default function DodgeGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const st = useRef({
    sx: W / 2, sy: H - 80,
    meteors: [] as Meteor[],
    t: 0, keys: {} as Record<string, boolean>,
  });

  useEffect(() => { setBest(Number(localStorage.getItem("playzone-dodge-best") || 0)); }, []);

  const reset = useCallback(() => {
    st.current = { sx: W / 2, sy: H - 80, meteors: [], t: 0, keys: {} };
    setScore(0); setGameOver(false); setStarted(true);
  }, []);

  useEffect(() => {
    const kd = (e: KeyboardEvent) => {
      st.current.keys[e.key.toLowerCase()] = true;
      if (["arrowup","arrowdown","arrowleft","arrowright"," "].includes(e.key.toLowerCase())) e.preventDefault();
      if (!started || gameOver) { if (e.key === " " || e.key === "Enter") reset(); }
    };
    const ku = (e: KeyboardEvent) => { st.current.keys[e.key.toLowerCase()] = false; };
    window.addEventListener("keydown", kd);
    window.addEventListener("keyup", ku);
    return () => { window.removeEventListener("keydown", kd); window.removeEventListener("keyup", ku); };
  }, [started, gameOver, reset]);

  useEffect(() => {
    if (!started || gameOver) return;
    let raf: number;
    let last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(50, now - last); last = now;
      const s = st.current;
      s.t += dt;
      const sp = 5;
      if (s.keys["arrowleft"] || s.keys["a"]) s.sx -= sp;
      if (s.keys["arrowright"] || s.keys["d"]) s.sx += sp;
      if (s.keys["arrowup"] || s.keys["w"]) s.sy -= sp;
      if (s.keys["arrowdown"] || s.keys["s"]) s.sy += sp;
      s.sx = Math.max(SHIP_R, Math.min(W - SHIP_R, s.sx));
      s.sy = Math.max(SHIP_R, Math.min(H - SHIP_R, s.sy));
      // spawn meteors — denser & faster over time
      const elapsed = s.t / 1000;
      const rate = Math.min(0.9, 0.25 + elapsed * 0.008);
      if (Math.random() < rate) {
        s.meteors.push({
          x: Math.random() * W, y: -20,
          r: 10 + Math.random() * 16,
          vy: 2 + Math.random() * 2 + elapsed * 0.02,
          vx: (Math.random() - 0.5) * 1.6,
        });
      }
      let dead = false;
      for (const m of s.meteors) {
        m.y += m.vy * (dt / 16.7); m.x += m.vx * (dt / 16.7);
        const dx = m.x - s.sx, dy = m.y - s.sy;
        if (Math.hypot(dx, dy) < m.r + SHIP_R - 3) { dead = true; break; }
      }
      s.meteors = s.meteors.filter((m) => m.y < H + 40);
      setScore(Math.floor(elapsed * 10));

      const cv = canvasRef.current;
      if (cv) {
        const ctx = cv.getContext("2d")!;
        ctx.fillStyle = "#0b0f1a"; ctx.fillRect(0, 0, W, H);
        // stars
        ctx.fillStyle = "#1e293b";
        for (let i = 0; i < 40; i++) {
          const sx = (i * 97) % W, sy = (i * 53 + s.t * 0.05) % H;
          ctx.fillRect(sx, sy, 2, 2);
        }
        // meteors
        for (const m of s.meteors) {
          const g = ctx.createRadialGradient(m.x, m.y, 2, m.x, m.y, m.r);
          g.addColorStop(0, "#fb923c"); g.addColorStop(1, "#7c2d12");
          ctx.fillStyle = g;
          ctx.beginPath(); ctx.arc(m.x, m.y, m.r, 0, Math.PI * 2); ctx.fill();
        }
        // ship
        ctx.fillStyle = "#22d3ee";
        ctx.beginPath();
        ctx.moveTo(s.sx, s.sy - SHIP_R);
        ctx.lineTo(s.sx - SHIP_R, s.sy + SHIP_R);
        ctx.lineTo(s.sx + SHIP_R, s.sy + SHIP_R);
        ctx.closePath(); ctx.fill();
        ctx.fillStyle = "#f0abfc";
        ctx.beginPath(); ctx.arc(s.sx, s.sy + 2, 4, 0, Math.PI * 2); ctx.fill();
      }
      if (dead) {
        setGameOver(true);
        const final = Math.floor(elapsed * 10);
        setBest((b) => { const nb = Math.max(b, final); localStorage.setItem("playzone-dodge-best", String(nb)); return nb; });
        return;
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [started, gameOver]);

  const moveShip = (clientX: number, clientY: number) => {
    const cv = canvasRef.current; if (!cv) return;
    const rect = cv.getBoundingClientRect();
    st.current.sx = ((clientX - rect.left) / rect.width) * W;
    st.current.sy = ((clientY - rect.top) / rect.height) * H;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-6 text-lg font-bold">
        <span>Score: <span className="text-purple-400">{score}</span></span>
        <span>Best: <span className="text-amber-400">{best}</span></span>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} width={W} height={H}
          className="game-canvas max-w-full rounded-lg border-2 border-purple-500/40"
          style={{ height: "auto", maxHeight: "62vh" }}
          onPointerMove={(e) => { if (started && !gameOver) moveShip(e.clientX, e.clientY); }}
          onPointerDown={(e) => { if (!started || gameOver) reset(); else moveShip(e.clientX, e.clientY); }} />
        {!started && (
          <button onClick={reset} className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 text-xl font-bold">🚀 Tap to Launch</button>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-black/70">
            <p className="text-xl font-bold text-red-400">💥 Hit! Survived {Math.floor(score / 10)}s</p>
            <p className="font-bold">Score: {score}</p>
            <button onClick={reset} className="rounded-lg bg-purple-600 px-6 py-2 font-bold hover:bg-purple-500">↻ Fly Again</button>
          </div>
        )}
      </div>
      <p className="text-sm text-slate-400">Arrow keys / WASD / move mouse or finger to dodge</p>
    </div>
  );
}
