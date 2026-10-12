"use client";

import { useState, useRef, useCallback } from "react";

const PADS = [
  { id: 0, color: "bg-red-600", active: "bg-red-300", sound: 262 },
  { id: 1, color: "bg-green-600", active: "bg-green-300", sound: 330 },
  { id: 2, color: "bg-blue-600", active: "bg-blue-300", sound: 392 },
  { id: 3, color: "bg-yellow-500", active: "bg-yellow-200", sound: 494 },
];

export default function SimonGame() {
  const [seq, setSeq] = useState<number[]>([]);
  const [input, setInput] = useState<number[]>([]);
  const [playing, setPlaying] = useState(false);
  const [showing, setShowing] = useState(false);
  const [lit, setLit] = useState<number | null>(null);
  const [round, setRound] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [best, setBest] = useState(0);
  const audioRef = useRef<AudioContext | null>(null);

  const beep = (freq: number, ms = 220) => {
    try {
      if (!audioRef.current) audioRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const ctx = audioRef.current;
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.connect(g); g.connect(ctx.destination);
      o.frequency.value = freq; o.type = "sine";
      g.gain.setValueAtTime(0.25, ctx.currentTime);
      g.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + ms / 1000);
      o.start(); o.stop(ctx.currentTime + ms / 1000);
    } catch { /* audio unavailable */ }
  };

  const playSeq = useCallback((s: number[]) => {
    setShowing(true); setInput([]);
    s.forEach((pad, i) => {
      setTimeout(() => {
        setLit(pad); beep(PADS[pad].sound);
        setTimeout(() => setLit(null), 320);
        if (i === s.length - 1) setTimeout(() => setShowing(false), 420);
      }, 600 * (i + 1));
    });
  }, []);

  const start = () => {
    const s = [Math.floor(Math.random() * 4)];
    setSeq(s); setRound(1); setPlaying(true); setGameOver(false);
    setBest(Number(localStorage.getItem("playzone-simon-best") || 0));
    playSeq(s);
  };

  const press = (id: number) => {
    if (!playing || showing || gameOver) return;
    beep(PADS[id].sound, 160);
    setLit(id); setTimeout(() => setLit(null), 180);
    const ni = [...input, id];
    setInput(ni);
    if (ni[ni.length - 1] !== seq[ni.length - 1]) {
      setGameOver(true); setPlaying(false);
      setBest((b) => { const nb = Math.max(b, round - 1); localStorage.setItem("playzone-simon-best", String(nb)); return nb; });
      return;
    }
    if (ni.length === seq.length) {
      const ns = [...seq, Math.floor(Math.random() * 4)];
      setSeq(ns); setRound((r) => r + 1);
      setTimeout(() => playSeq(ns), 800);
    }
  };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-6 text-lg font-bold">
        <span>Round: <span className="text-lime-400">{playing || gameOver ? round : "—"}</span></span>
        <span>Best: <span className="text-amber-400">{best}</span></span>
      </div>
      {gameOver && <p className="text-xl font-bold text-red-400">Wrong pad! You reached round {round}.</p>}
      {!playing && !gameOver && (
        <button onClick={start} className="rounded-lg bg-lime-600 px-8 py-3 text-lg font-bold hover:bg-lime-500">▶ Start</button>
      )}
      <div className="grid grid-cols-2 gap-3">
        {PADS.map((p) => (
          <button key={p.id} onClick={() => press(p.id)}
            className={`h-32 w-32 rounded-2xl transition-all sm:h-36 sm:w-36 ${lit === p.id ? p.active + " scale-105 brightness-125" : p.color} ${showing ? "cursor-default" : "hover:brightness-110 active:scale-95"}`}
            aria-label={`pad ${p.id + 1}`} />
        ))}
      </div>
      {gameOver && (
        <button onClick={start} className="rounded-lg bg-lime-600 px-6 py-2 font-bold hover:bg-lime-500">↻ Try Again</button>
      )}
      <p className="text-sm text-slate-400">{showing ? "👀 Watch the sequence…" : playing ? "👆 Repeat the sequence!" : "Watch, then repeat the flashing pads"}</p>
    </div>
  );
}
