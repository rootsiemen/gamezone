"use client";

import { useEffect, useState, useCallback, useRef } from "react";

const SIZE = 4;
type Grid = number[][];

const TILE_COLORS: Record<number, string> = {
  0: "bg-slate-700/40", 2: "bg-slate-200 text-slate-800", 4: "bg-amber-200 text-slate-800",
  8: "bg-orange-400 text-white", 16: "bg-orange-500 text-white", 32: "bg-red-400 text-white",
  64: "bg-red-500 text-white", 128: "bg-yellow-300 text-slate-900", 256: "bg-yellow-400 text-slate-900",
  512: "bg-emerald-400 text-white", 1024: "bg-emerald-500 text-white", 2048: "bg-violet-500 text-white",
};

function emptyGrid(): Grid {
  return Array.from({ length: SIZE }, () => Array(SIZE).fill(0));
}
function addRandom(grid: Grid): Grid {
  const g = grid.map((r) => [...r]);
  const empties: [number, number][] = [];
  g.forEach((row, r) => row.forEach((v, c) => { if (v === 0) empties.push([r, c]); }));
  if (empties.length === 0) return g;
  const [r, c] = empties[Math.floor(Math.random() * empties.length)];
  g[r][c] = Math.random() < 0.9 ? 2 : 4;
  return g;
}
function slide(row: number[]): { row: number[]; gained: number } {
  const vals = row.filter((v) => v !== 0);
  const out: number[] = [];
  let gained = 0;
  for (let i = 0; i < vals.length; i++) {
    if (vals[i] === vals[i + 1]) { out.push(vals[i] * 2); gained += vals[i] * 2; i++; }
    else out.push(vals[i]);
  }
  while (out.length < SIZE) out.push(0);
  return { row: out, gained };
}
function move(grid: Grid, dir: "up" | "down" | "left" | "right"): { grid: Grid; gained: number; moved: boolean } {
  let g = grid.map((r) => [...r]);
  let gained = 0;
  const before = JSON.stringify(g);
  if (dir === "left" || dir === "right") {
    g = g.map((row) => {
      const r = dir === "right" ? [...row].reverse() : row;
      const { row: nr, gained: gn } = slide(r);
      gained += gn;
      return dir === "right" ? nr.reverse() : nr;
    });
  } else {
    for (let c = 0; c < SIZE; c++) {
      const col = g.map((row) => row[c]);
      const cc = dir === "down" ? [...col].reverse() : col;
      const { row: nc, gained: gn } = slide(cc);
      gained += gn;
      const fin = dir === "down" ? nc.reverse() : nc;
      for (let r = 0; r < SIZE; r++) g[r][c] = fin[r];
    }
  }
  return { grid: g, gained, moved: JSON.stringify(g) !== before };
}
function canMove(grid: Grid): boolean {
  for (let r = 0; r < SIZE; r++) for (let c = 0; c < SIZE; c++) {
    if (grid[r][c] === 0) return true;
    if (c + 1 < SIZE && grid[r][c] === grid[r][c + 1]) return true;
    if (r + 1 < SIZE && grid[r][r] !== undefined && grid[r][c] === grid[r + 1][c]) return true;
  }
  return false;
}

export default function Game2048() {
  const [grid, setGrid] = useState<Grid>(() => addRandom(addRandom(emptyGrid())));
  const [score, setScore] = useState(0);
  const [best, setBest] = useState(0);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const gridRef = useRef(grid);
  gridRef.current = grid;
  const touchRef = useRef<{ x: number; y: number } | null>(null);

  useEffect(() => { setBest(Number(localStorage.getItem("playzone-2048-best") || 0)); }, []);

  const doMove = useCallback((dir: "up" | "down" | "left" | "right") => {
    if (over) return;
    const { grid: ng, gained, moved } = move(gridRef.current, dir);
    if (!moved) return;
    const withNew = addRandom(ng);
    setGrid(withNew);
    setScore((s) => {
      const ns = s + gained;
      setBest((b) => { const nb = Math.max(b, ns); localStorage.setItem("playzone-2048-best", String(nb)); return nb; });
      return ns;
    });
    if (!won && withNew.flat().includes(2048)) setWon(true);
    if (!canMove(withNew)) setOver(true);
  }, [over, won]);

  const restart = () => {
    setGrid(addRandom(addRandom(emptyGrid())));
    setScore(0); setOver(false); setWon(false);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const map: Record<string, "up" | "down" | "left" | "right"> = {
        ArrowUp: "up", w: "up", W: "up", ArrowDown: "down", s: "down", S: "down",
        ArrowLeft: "left", a: "left", A: "left", ArrowRight: "right", d: "right", D: "right",
      };
      const dir = map[e.key];
      if (dir) { e.preventDefault(); doMove(dir); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [doMove]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-6 text-lg font-bold">
        <span>Score: <span className="text-amber-400">{score}</span></span>
        <span>Best: <span className="text-violet-400">{best}</span></span>
        <button onClick={restart} className="rounded bg-slate-700 px-3 py-1 text-sm hover:bg-slate-600">↻ Restart</button>
      </div>
      {won && !over && <p className="font-bold text-emerald-400">🎉 You reached 2048! Keep going!</p>}
      <div
        className="grid grid-cols-4 gap-2 rounded-xl bg-slate-800/60 p-3"
        style={{ touchAction: "none" }}
        onTouchStart={(e) => { touchRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }}
        onTouchEnd={(e) => {
          if (!touchRef.current) return;
          const dx = e.changedTouches[0].clientX - touchRef.current.x;
          const dy = e.changedTouches[0].clientY - touchRef.current.y;
          if (Math.abs(dx) < 20 && Math.abs(dy) < 20) return;
          doMove(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? "right" : "left") : (dy > 0 ? "down" : "up"));
          touchRef.current = null;
        }}
      >
        {grid.flat().map((v, i) => (
          <div key={i} className={`flex h-16 w-16 sm:h-20 sm:w-20 items-center justify-center rounded-lg text-2xl font-extrabold ${TILE_COLORS[v] || "bg-purple-600 text-white"}`}>
            {v !== 0 ? v : ""}
          </div>
        ))}
      </div>
      {over && <p className="text-xl font-bold text-red-400">Game Over! Final score: {score}</p>}
      <p className="text-sm text-slate-400">Arrow keys / WASD or swipe to slide tiles</p>
    </div>
  );
}
