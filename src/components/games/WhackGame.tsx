"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const HOLES = 9;
const DURATION = 60;

interface Mole { hole: number; golden: boolean; bomb: boolean; born: number; ttl: number; }

export default function WhackGame() {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(DURATION);
  const [moles, setMoles] = useState<Mole[]>([]);
  const [playing, setPlaying] = useState(false);
  const [best, setBest] = useState(0);
  const idRef = useRef(0);
  const scoreRef = useRef(0);
  scoreRef.current = score;

  useEffect(() => { setBest(Number(localStorage.getItem("playzone-whack-best") || 0)); }, []);

  const start = useCallback(() => {
    setScore(0); setTime(DURATION); setMoles([]); setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = setInterval(() => {
      setTime((t) => {
        if (t <= 1) {
          setPlaying(false);
          const nb = Math.max(Number(localStorage.getItem("playzone-whack-best") || 0), scoreRef.current);
          localStorage.setItem("playzone-whack-best", String(nb));
          setBest(nb);
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [playing]);

  useEffect(() => {
    if (!playing) return;
    const spawner = setInterval(() => {
      setMoles((ms) => {
        const now = Date.now();
        const alive = ms.filter((m) => now - m.born < m.ttl);
        if (alive.length >= 4) return alive;
        const hole = Math.floor(Math.random() * HOLES);
        if (alive.some((m) => m.hole === hole)) return alive;
        const roll = Math.random();
        ++idRef.current;        return [...alive, {
          hole,
          golden: roll < 0.12,
          bomb: roll >= 0.12 && roll < 0.26,
          born: now,
          ttl: Math.max(600, 1100 - (DURATION - time) * 6),
        }];
      });
    }, 420);
    return () => clearInterval(spawner);
  }, [playing, time]);

  const whack = (hole: number) => {
    if (!playing) return;
    setMoles((ms) => {
      const m = ms.find((x) => x.hole === hole);
      if (!m) return ms;
      if (m.bomb) setScore((s) => Math.max(0, s - 20));
      else if (m.golden) setScore((s) => s + 30);
      else setScore((s) => s + 10);
      return ms.filter((x) => x.hole !== hole);
    });
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6 text-lg font-bold">
        <span>Score: <span className="text-yellow-400">{score}</span></span>
        <span>Time: <span className={time <= 10 ? "text-red-400" : "text-sky-400"}>{time}s</span></span>
        <span>Best: <span className="text-amber-400">{best}</span></span>
      </div>
      {!playing && time === DURATION && (
        <button onClick={start} className="rounded-lg bg-yellow-600 px-8 py-3 text-lg font-bold hover:bg-yellow-500">🔨 Start Whacking!</button>
      )}
      {!playing && time === 0 && (
        <div className="flex flex-col items-center gap-2">
          <p className="text-xl font-bold text-emerald-400">⏰ Time's up! Final score: {score}</p>
          <button onClick={start} className="rounded-lg bg-yellow-600 px-6 py-2 font-bold hover:bg-yellow-500">↻ Play Again</button>
        </div>
      )}
      <div className="grid grid-cols-3 gap-3">
        {Array.from({ length: HOLES }, (_, h) => {
          const m = moles.find((x) => x.hole === h);
          return (
            <button key={h} onClick={() => whack(h)}
              className="flex h-24 w-24 items-center justify-center rounded-full bg-amber-950 text-5xl shadow-inner sm:h-28 sm:w-28"
              style={{ boxShadow: "inset 0 6px 12px rgba(0,0,0,0.7)" }}>
              {m ? (m.bomb ? "💣" : m.golden ? "🌟" : "🐹") : ""}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-slate-400">Whack moles 🐹 +10 · golden 🌟 +30 · avoid bombs 💣 −20</p>
    </div>
  );
}
