"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const W = 480, H = 360, PADDLE_W = 12, PADDLE_H = 70, BALL_R = 8, WIN = 7;

export default function PongGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [player, setPlayer] = useState(0);
  const [ai, setAi] = useState(0);
  const [over, setOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [difficulty, setDifficulty] = useState<"easy" | "medium" | "hard">("medium");
  const st = useRef({
    py: H / 2 - PADDLE_H / 2, ay: H / 2 - PADDLE_H / 2,
    bx: W / 2, by: H / 2, vx: 4, vy: 2.5, targetY: H / 2,
  });

  const reset = useCallback(() => {
    st.current = { py: H / 2 - PADDLE_H / 2, ay: H / 2 - PADDLE_H / 2, bx: W / 2, by: H / 2, vx: 4 * (Math.random() < 0.5 ? -1 : 1), vy: 2.5 * (Math.random() < 0.5 ? -1 : 1), targetY: H / 2 };
    setPlayer(0); setAi(0); setOver(false); setStarted(true);
  }, []);

  const serve = (dir: 1 | -1) => {
    const s = st.current;
    s.bx = W / 2; s.by = H / 2;
    const sp = 4 + (player + ai) * 0.25;
    s.vx = dir * sp; s.vy = (Math.random() * 4 - 2);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") { st.current.py = Math.max(0, st.current.py - 22); e.preventDefault(); }
      if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") { st.current.py = Math.min(H - PADDLE_H, st.current.py + 22); e.preventDefault(); }
      if ((e.key === " " || e.key === "Enter") && (!started || over)) reset();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, over, reset]);

  useEffect(() => {
    if (!started || over) return;
    let raf: number;
    const aiSpeed = difficulty === "easy" ? 2.2 : difficulty === "medium" ? 3.4 : 4.6;
    const aiErr = difficulty === "easy" ? 46 : difficulty === "medium" ? 24 : 8;
    const loop = () => {
      const s = st.current;
      s.bx += s.vx; s.by += s.vy;
      if (s.by < BALL_R || s.by > H - BALL_R) s.vy *= -1;
      // player paddle
      if (s.bx - BALL_R < PADDLE_W + 8 && s.by > s.py && s.by < s.py + PADDLE_H && s.vx < 0) {
        const rel = (s.by - (s.py + PADDLE_H / 2)) / (PADDLE_H / 2);
        const sp = Math.hypot(s.vx, s.vy) * 1.04;
        s.vx = Math.abs(Math.cos(rel * 1.0)) * sp;
        s.vy = Math.sin(rel * 1.0) * sp;
        s.bx = PADDLE_W + 8 + BALL_R;
      }
      // ai paddle
      if (s.bx + BALL_R > W - PADDLE_W - 8 && s.by > s.ay && s.by < s.ay + PADDLE_H && s.vx > 0) {
        const rel = (s.by - (s.ay + PADDLE_H / 2)) / (PADDLE_H / 2);
        const sp = Math.hypot(s.vx, s.vy) * 1.04;
        s.vx = -Math.abs(Math.cos(rel * 1.0)) * sp;
        s.vy = Math.sin(rel * 1.0) * sp;
        s.bx = W - PADDLE_W - 8 - BALL_R;
      }
      if (s.bx < 0) { setAi((a) => { if (a + 1 >= WIN) setOver(true); return a + 1; }); serve(1); }
      if (s.bx > W) { setPlayer((p) => { if (p + 1 >= WIN) setOver(true); return p + 1; }); serve(-1); }
      // ai movement
      if (s.vx > 0) s.targetY = s.by + (Math.random() - 0.5) * aiErr;
      const center = s.ay + PADDLE_H / 2;
      if (Math.abs(center - s.targetY) > 6) s.ay += Math.sign(s.targetY - center) * aiSpeed;
      s.ay = Math.max(0, Math.min(H - PADDLE_H, s.ay));

      const cv = canvasRef.current;
      if (cv) {
        const ctx = cv.getContext("2d")!;
        ctx.fillStyle = "#0b0f1a"; ctx.fillRect(0, 0, W, H);
        ctx.strokeStyle = "#334155"; ctx.setLineDash([8, 8]);
        ctx.beginPath(); ctx.moveTo(W / 2, 0); ctx.lineTo(W / 2, H); ctx.stroke();
        ctx.setLineDash([]);
        ctx.fillStyle = "#22d3ee"; ctx.fillRect(8, s.py, PADDLE_W, PADDLE_H);
        ctx.fillStyle = "#f87171"; ctx.fillRect(W - 8 - PADDLE_W, s.ay, PADDLE_W, PADDLE_H);
        ctx.fillStyle = "#f8fafc";
        ctx.beginPath(); ctx.arc(s.bx, s.by, BALL_R, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = "#e2e8f0"; ctx.font = "bold 40px sans-serif"; ctx.textAlign = "center";
        ctx.fillText(String(player), W / 2 - 50, 55);
        ctx.fillText(String(ai), W / 2 + 50, 55);
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [started, over, difficulty, player, ai]);

  const movePlayer = (clientY: number) => {
    const cv = canvasRef.current; if (!cv) return;
    const rect = cv.getBoundingClientRect();
    st.current.py = Math.max(0, Math.min(H - PADDLE_H, ((clientY - rect.top) / rect.height) * H - PADDLE_H / 2));
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex items-center gap-4">
        <span className="text-lg font-bold">You <span className="text-cyan-400">{player}</span> : <span className="text-rose-400">{ai}</span> AI</span>
        <div className="flex gap-1">
          {(["easy", "medium", "hard"] as const).map((d) => (
            <button key={d} onClick={() => { setDifficulty(d); }}
              className={`rounded px-2.5 py-1 text-xs font-bold capitalize ${difficulty === d ? "bg-teal-600" : "bg-slate-700 hover:bg-slate-600"}`}>{d}</button>
          ))}
        </div>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} width={W} height={H}
          className="game-canvas max-w-full rounded-lg border-2 border-teal-500/40"
          style={{ height: "auto", maxHeight: "58vh" }}
          onPointerMove={(e) => movePlayer(e.clientY)}
          onPointerDown={(e) => { movePlayer(e.clientY); if (!started || over) reset(); }} />
        {!started && (
          <button onClick={reset} className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/50 text-xl font-bold">🏓 Tap to Start</button>
        )}
        {over && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-black/70">
            <p className={`text-xl font-bold ${player >= WIN ? "text-emerald-400" : "text-red-400"}`}>
              {player >= WIN ? "🎉 You win the match!" : "🤖 AI wins the match!"}
            </p>
            <button onClick={reset} className="rounded-lg bg-teal-600 px-6 py-2 font-bold hover:bg-teal-500">↻ Rematch</button>
          </div>
        )}
      </div>
      <p className="text-sm text-slate-400">Move mouse / arrows / W-S / touch · First to {WIN} wins</p>
    </div>
  );
}
