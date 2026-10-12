"use client";

import { useEffect, useRef, useState, useCallback } from "react";

const COLS = 10, ROWS = 20, CELL = 24;
const SHAPES: number[][][] = [
  [[1,1,1,1]], [[1,1],[1,1]], [[0,1,0],[1,1,1]],
  [[1,0,0],[1,1,1]], [[0,0,1],[1,1,1]], [[1,1,0],[0,1,1]], [[0,1,1],[1,1,0]],
];
const COLORS = ["#22d3ee","#facc15","#a78bfa","#60a5fa","#fb923c","#4ade80","#f87171"];

type Piece = { shape: number[][]; x: number; y: number; color: string };

function rotate(m: number[][]): number[][] {
  return m[0].map((_, i) => m.map((row) => row[i]).reverse());
}

export default function TetrisGame() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [level, setLevel] = useState(1);
  const [gameOver, setGameOver] = useState(false);
  const [started, setStarted] = useState(false);
  const [paused, setPaused] = useState(false);
  const st = useRef<{ board: string[][]; piece: Piece | null; drop: number }>({ board: Array.from({length: ROWS}, () => Array(COLS).fill("")), piece: null, drop: 0 });
  const scoreRef = useRef(0);
  const linesRef = useRef(0);

  const newPiece = useCallback((): Piece => {
    const i = Math.floor(Math.random() * SHAPES.length);
    return { shape: SHAPES[i], x: 3, y: 0, color: COLORS[i] };
  }, []);

  const collides = (board: string[][], p: Piece, dx = 0, dy = 0, shape = p.shape) => {
    for (let r = 0; r < shape.length; r++) for (let c = 0; c < shape[r].length; c++) {
      if (!shape[r][c]) continue;
      const nx = p.x + c + dx, ny = p.y + r + dy;
      if (nx < 0 || nx >= COLS || ny >= ROWS || (ny >= 0 && board[ny][nx])) return true;
    }
    return false;
  };

  const draw = useCallback(() => {
    const cv = canvasRef.current; if (!cv) return;
    const ctx = cv.getContext("2d")!;
    const { board, piece } = st.current;
    ctx.fillStyle = "#0b0f1a"; ctx.fillRect(0, 0, cv.width, cv.height);
    board.forEach((row, r) => row.forEach((cell, c) => {
      if (cell) { ctx.fillStyle = cell; ctx.fillRect(c*CELL+1, r*CELL+1, CELL-2, CELL-2); }
    }));
    if (piece) piece.shape.forEach((row, r) => row.forEach((v, c) => {
      if (v && piece.y + r >= 0) { ctx.fillStyle = piece.color; ctx.fillRect((piece.x+c)*CELL+1, (piece.y+r)*CELL+1, CELL-2, CELL-2); }
    }));
  }, []);

  const lockPiece = useCallback(() => {
    const { board, piece } = st.current;
    if (!piece) return;
    piece.shape.forEach((row, r) => row.forEach((v, c) => {
      if (v && piece.y + r >= 0) board[piece.y + r][piece.x + c] = piece.color;
    }));
    let cleared = 0;
    for (let r = ROWS - 1; r >= 0; r--) {
      if (board[r].every((cell) => cell)) { board.splice(r, 1); board.unshift(Array(COLS).fill("")); cleared++; r++; }
    }
    if (cleared > 0) {
      const pts = [0, 100, 300, 500, 800][cleared] * level;
      scoreRef.current += pts; setScore(scoreRef.current);
      linesRef.current += cleared; setLines(linesRef.current);
      setLevel(Math.floor(linesRef.current / 10) + 1);
    }
    const np = newPiece();
    if (collides(board, np)) { setGameOver(true); st.current.piece = null; }
    else st.current.piece = np;
    draw();
  }, [draw, level, newPiece]);

  const reset = useCallback(() => {
    st.current = { board: Array.from({length: ROWS}, () => Array(COLS).fill("")), piece: newPiece(), drop: 0 };
    scoreRef.current = 0; linesRef.current = 0;
    setScore(0); setLines(0); setLevel(1); setGameOver(false); setPaused(false); setStarted(true);
    draw();
  }, [draw, newPiece]);

  useEffect(() => {
    if (!started || gameOver || paused) return;
    const speed = Math.max(100, 800 - (level - 1) * 70);
    const id = setInterval(() => {
      const { board, piece } = st.current;
      if (!piece) return;
      if (collides(board, piece, 0, 1)) lockPiece();
      else { piece.y++; draw(); }
    }, speed);
    return () => clearInterval(id);
  }, [started, gameOver, paused, level, draw, lockPiece]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!started || gameOver) { if (e.key === " " || e.key === "Enter") reset(); return; }
      if (e.key === "p" || e.key === "P") { setPaused((p) => !p); return; }
      if (paused) return;
      const { board, piece } = st.current;
      if (!piece) return;
      if (e.key === "ArrowLeft" && !collides(board, piece, -1, 0)) piece.x--;
      else if (e.key === "ArrowRight" && !collides(board, piece, 1, 0)) piece.x++;
      else if (e.key === "ArrowDown" && !collides(board, piece, 0, 1)) { piece.y++; scoreRef.current += 1; setScore(scoreRef.current); }
      else if ((e.key === "ArrowUp" || e.key === "x" || e.key === "X")) { const r = rotate(piece.shape); if (!collides(board, piece, 0, 0, r)) piece.shape = r; }
      else if (e.key === "z" || e.key === "Z") { const r = rotate(rotate(rotate(piece.shape))); if (!collides(board, piece, 0, 0, r)) piece.shape = r; }
      else if (e.key === " ") { while (!collides(board, piece, 0, 1)) { piece.y++; scoreRef.current += 2; } setScore(scoreRef.current); lockPiece(); e.preventDefault(); return; }
      else return;
      e.preventDefault(); draw();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [started, gameOver, paused, draw, lockPiece, reset]);

  // touch controls
  const touchRef = useRef<{x:number;y:number;t:number}|null>(null);
  const onTouchStart = (e: React.TouchEvent) => { touchRef.current = {x: e.touches[0].clientX, y: e.touches[0].clientY, t: Date.now()}; if (!started || gameOver) reset(); };
  const onTouchMove = (e: React.TouchEvent) => {
    if (!touchRef.current || !started || gameOver || paused) return;
    const dx = e.touches[0].clientX - touchRef.current.x;
    const dy = e.touches[0].clientY - touchRef.current.y;
    const { board, piece } = st.current; if (!piece) return;
    if (Math.abs(dx) > 24) {
      const d = Math.sign(dx);
      if (!collides(board, piece, d, 0)) { piece.x += d; draw(); }
      touchRef.current.x = e.touches[0].clientX;
    } else if (dy > 30) {
      if (!collides(board, piece, 0, 1)) { piece.y++; draw(); }
      touchRef.current.y = e.touches[0].clientY;
    }
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touchRef.current) return;
    const dt = Date.now() - touchRef.current.t;
    const dx = Math.abs(e.changedTouches[0].clientX - touchRef.current.x);
    const dy = Math.abs(e.changedTouches[0].clientY - touchRef.current.y);
    const { board, piece } = st.current;
    if (dt < 250 && dx < 12 && dy < 12 && piece && started && !gameOver && !paused) {
      const r = rotate(piece.shape);
      if (!collides(board, piece, 0, 0, r)) { piece.shape = r; draw(); }
    }
    touchRef.current = null;
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-5 text-lg font-bold">
        <span>Score: <span className="text-cyan-400">{score}</span></span>
        <span>Lines: <span className="text-emerald-400">{lines}</span></span>
        <span>Level: <span className="text-violet-400">{level}</span></span>
      </div>
      <div className="relative">
        <canvas ref={canvasRef} width={COLS*CELL} height={ROWS*CELL}
          className="game-canvas rounded-lg border-2 border-cyan-500/40"
          style={{ maxHeight: "62vh", width: "auto", maxWidth: "90vw" }}
          onTouchStart={onTouchStart} onTouchMove={onTouchMove} onTouchEnd={onTouchEnd} />
        {!started && (
          <button onClick={reset} className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 text-xl font-bold">
            ▶ Start Tetris
          </button>
        )}
        {paused && !gameOver && (
          <button onClick={() => setPaused(false)} className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/60 text-xl font-bold">⏸ Paused — tap to resume</button>
        )}
        {gameOver && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-lg bg-black/70">
            <p className="text-xl font-bold text-red-400">Game Over!</p>
            <p className="font-bold">Score: {score}</p>
            <button onClick={reset} className="rounded-lg bg-cyan-600 px-6 py-2 font-bold hover:bg-cyan-500">↻ Play Again</button>
          </div>
        )}
      </div>
      <p className="text-sm text-slate-400">←→ move · ↑/X rotate · ↓ soft drop · Space hard drop · P pause · tap to rotate on mobile</p>
    </div>
  );
}
