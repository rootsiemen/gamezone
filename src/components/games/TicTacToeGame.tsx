"use client";

import { useState, useCallback } from "react";

type Cell = "X" | "O" | null;
type Diff = "easy" | "medium" | "hard";

const LINES = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]];

function winner(b: Cell[]): "X" | "O" | "draw" | null {
  for (const [a, c, d] of LINES) if (b[a] && b[a] === b[c] && b[a] === b[d]) return b[a];
  return b.every((x) => x) ? "draw" : null;
}
function minimax(b: Cell[], isMax: boolean, depth: number): number {
  const w = winner(b);
  if (w === "O") return 10 - depth;
  if (w === "X") return depth - 10;
  if (w === "draw") return 0;
  let best = isMax ? -Infinity : Infinity;
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue;
    b[i] = isMax ? "O" : "X";
    const s = minimax(b, !isMax, depth + 1);
    b[i] = null;
    best = isMax ? Math.max(best, s) : Math.min(best, s);
  }
  return best;
}
function bestMove(b: Cell[]): number {
  let bi = -1, bs = -Infinity;
  for (let i = 0; i < 9; i++) {
    if (b[i]) continue;
    b[i] = "O";
    const s = minimax(b, false, 0);
    b[i] = null;
    if (s > bs) { bs = s; bi = i; }
  }
  return bi;
}

export default function TicTacToeGame() {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [diff, setDiff] = useState<Diff>("medium");
  const [result, setResult] = useState<"X" | "O" | "draw" | null>(null);
  const [stats, setStats] = useState({ w: 0, d: 0, l: 0 });

  const aiMove = useCallback((b: Cell[], d: Diff): Cell[] => {
    const empty = b.map((v, i) => (v ? -1 : i)).filter((i) => i >= 0);
    if (empty.length === 0) return b;
    let pick: number;
    if (d === "easy") pick = empty[Math.floor(Math.random() * empty.length)];
    else if (d === "medium") {
      // win if possible, block if needed, else random
      const nb = [...b];
      for (const i of empty) { nb[i] = "O"; if (winner(nb) === "O") return nb; nb[i] = null; }
      for (const i of empty) { nb[i] = "X"; if (winner(nb) === "X") { nb[i] = "O"; return nb; } nb[i] = null; }
      pick = empty[Math.floor(Math.random() * empty.length)];
    } else pick = bestMove([...b]);
    const nb = [...b]; nb[pick] = "O";
    return nb;
  }, []);

  const play = (i: number) => {
    if (board[i] || result) return;
    const nb: Cell[] = [...board]; nb[i] = "X";
    let w = winner(nb);
    if (w) return finish(nb, w);
    const after = aiMove(nb, diff);
    w = winner(after);
    finish(after, w);
  };

  const finish = (b: Cell[], w: "X" | "O" | "draw" | null) => {
    setBoard(b); setResult(w);
    if (w) setStats((s) => ({ w: s.w + (w === "X" ? 1 : 0), d: s.d + (w === "draw" ? 1 : 0), l: s.l + (w === "O" ? 1 : 0) }));
  };

  const reset = () => { setBoard(Array(9).fill(null)); setResult(null); };

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="flex gap-2">
        {(["easy", "medium", "hard"] as Diff[]).map((d) => (
          <button key={d} onClick={() => { setDiff(d); reset(); }}
            className={`rounded-lg px-4 py-1.5 font-bold capitalize ${diff === d ? "bg-indigo-600" : "bg-slate-700 hover:bg-slate-600"}`}>
            {d}
          </button>
        ))}
      </div>
      <div className="text-sm font-bold text-slate-300">
        You {stats.w} · Draws {stats.d} · AI {stats.l}
      </div>
      {result && (
        <p className={`text-xl font-bold ${result === "X" ? "text-emerald-400" : result === "O" ? "text-red-400" : "text-amber-400"}`}>
          {result === "X" ? "🎉 You win!" : result === "O" ? "🤖 AI wins!" : "🤝 Draw!"}
        </p>
      )}
      <div className="grid grid-cols-3 gap-2">
        {board.map((v, i) => (
          <button key={i} onClick={() => play(i)}
            className="flex h-24 w-24 items-center justify-center rounded-xl bg-slate-800 text-5xl font-extrabold hover:bg-slate-700 sm:h-28 sm:w-28">
            {v === "X" ? <span className="text-cyan-400">✕</span> : v === "O" ? <span className="text-rose-400">◯</span> : ""}
          </button>
        ))}
      </div>
      <button onClick={reset} className="rounded-lg bg-slate-700 px-6 py-2 font-bold hover:bg-slate-600">↻ New Game</button>
      <p className="text-sm text-slate-400">You are ✕ · Click a square to play</p>
    </div>
  );
}
