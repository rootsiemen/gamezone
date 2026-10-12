"use client";

import { useState, useCallback, useEffect } from "react";

const ROWS = 9, COLS = 9, MINES = 10;

interface Cell { mine: boolean; open: boolean; flag: boolean; n: number; }

function build(firstR: number, firstC: number): Cell[][] {
  const g: Cell[][] = Array.from({ length: ROWS }, () =>
    Array.from({ length: COLS }, () => ({ mine: false, open: false, flag: false, n: 0 }))
  );
  let placed = 0;
  while (placed < MINES) {
    const r = Math.floor(Math.random() * ROWS), c = Math.floor(Math.random() * COLS);
    if (g[r][c].mine || (Math.abs(r - firstR) <= 1 && Math.abs(c - firstC) <= 1)) continue;
    g[r][c].mine = true; placed++;
  }
  for (let r = 0; r < ROWS; r++) for (let c = 0; c < COLS; c++) {
    if (g[r][c].mine) continue;
    let n = 0;
    for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) {
      const nr = r + dr, nc = c + dc;
      if (nr >= 0 && nr < ROWS && nc >= 0 && nc < COLS && g[nr][nc].mine) n++;
    }
    g[r][c].n = n;
  }
  return g;
}

export default function MinesweeperGame() {
  const [grid, setGrid] = useState<Cell[][] | null>(null);
  const [started, setStarted] = useState(false);
  const [over, setOver] = useState(false);
  const [won, setWon] = useState(false);
  const [flags, setFlags] = useState(0);
  const [best, setBest] = useState<number | null>(null);
  const [startTime, setStartTime] = useState(0);

  useEffect(() => {
    const b = localStorage.getItem("playzone-mines-best");
    if (b) setBest(Number(b));
  }, []);

  const reset = () => { setGrid(null); setStarted(false); setOver(false); setWon(false); setFlags(0); };

  const flood = (g: Cell[][], r: number, c: number) => {
    if (r < 0 || r >= ROWS || c < 0 || c >= COLS || g[r][c].open || g[r][c].flag) return;
    g[r][c].open = true;
    if (g[r][c].n === 0 && !g[r][c].mine) {
      for (let dr = -1; dr <= 1; dr++) for (let dc = -1; dc <= 1; dc++) flood(g, r + dr, c + dc);
    }
  };

  const reveal = useCallback((r: number, c: number) => {
    if (over || won) return;
    let g = grid;
    if (!g) {
      g = build(r, c);
      setStarted(true);
      setStartTime(Date.now());
    } else {
      g = g.map((row) => row.map((cell) => ({ ...cell })));
    }
    const cell = g[r][c];
    if (cell.open || cell.flag) { setGrid(g); return; }
    if (cell.mine) {
      g.forEach((row) => row.forEach((cl) => { if (cl.mine) cl.open = true; }));
      setGrid(g); setOver(true); return;
    }
    flood(g, r, c);
    setGrid(g);
    const safeTotal = ROWS * COLS - MINES;
    const openCount = g.flat().filter((cl) => cl.open).length;
    if (openCount === safeTotal) {
      const secs = Math.round((Date.now() - (startTime || Date.now())) / 1000);
      setWon(true);
      setBest((b) => {
        const nb = b === null ? secs : Math.min(b, secs);
        localStorage.setItem("playzone-mines-best", String(nb));
        return nb;
      });
    }
  }, [grid, over, won, startTime]);

  const toggleFlag = (r: number, c: number, e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault();
    if (over || won || !grid) return;
    const cell = grid[r][c];
    if (cell.open) return;
    const g = grid.map((row) => row.map((cl) => ({ ...cl })));
    g[r][c].flag = !g[r][c].flag;
    setGrid(g);
    setFlags(g.flat().filter((cl) => cl.flag).length);
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-5 text-lg font-bold">
        <span>💣 {MINES - flags}</span>
        {best !== null && <span>Best: <span className="text-amber-400">{best}s</span></span>}
        <button onClick={reset} className="rounded bg-slate-700 px-3 py-1 text-sm hover:bg-slate-600">↻ New Game</button>
      </div>
      {over && <p className="text-xl font-bold text-red-400">💥 Boom! You hit a mine.</p>}
      {won && <p className="text-xl font-bold text-emerald-400">🎉 Minefield cleared!</p>}
      <div className="grid rounded-xl bg-slate-800/60 p-2" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))`, gap: 2 }}>
        {Array.from({ length: ROWS * COLS }, (_, i) => {
          const r = Math.floor(i / COLS), c = i % COLS;
          const cell = grid?.[r][c];
          return (
            <button
              key={i}
              onClick={() => reveal(r, c)}
              onContextMenu={(e) => toggleFlag(r, c, e)}
              className={`flex h-8 w-8 items-center justify-center rounded text-sm font-bold sm:h-9 sm:w-9 ${
                cell?.open ? (cell.mine ? "bg-red-600" : "bg-slate-600 text-cyan-300") : "bg-slate-700 hover:bg-slate-600"
              }`}
            >
              {!cell || !cell.open ? (cell?.flag ? "🚩" : "") : cell.mine ? "💣" : cell.n > 0 ? cell.n : ""}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-slate-400">Click to reveal · Right-click or long-press to flag 🚩</p>
    </div>
  );
}
