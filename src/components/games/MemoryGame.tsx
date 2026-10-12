"use client";

import { useEffect, useState, useCallback } from "react";

const EMOJIS = ["🐶","🐱","🦊","🐼","🦁","🐸","🐵","🐷"];
const PAIRS = 8;

function shuffled(): string[] {
  const deck = [...EMOJIS.slice(0, PAIRS), ...EMOJIS.slice(0, PAIRS)];
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

export default function MemoryGame() {
  const [deck, setDeck] = useState<string[]>(() => shuffled());
  const [open, setOpen] = useState<number[]>([]);
  const [matched, setMatched] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [best, setBest] = useState<number | null>(null);
  const [lock, setLock] = useState(false);

  useEffect(() => {
    const b = localStorage.getItem("playzone-memory-best");
    if (b) setBest(Number(b));
  }, []);

  const restart = () => {
    setDeck(shuffled()); setOpen([]); setMatched([]); setMoves(0); setWon(false); setLock(false);
  };

  const flip = useCallback((i: number) => {
    if (lock || won || open.includes(i) || matched.includes(i)) return;
    const no = [...open, i];
    setOpen(no);
    if (no.length === 2) {
      setMoves((m) => m + 1);
      if (deck[no[0]] === deck[no[1]]) {
        const nm = [...matched, ...no];
        setMatched(nm);
        setOpen([]);
        if (nm.length === PAIRS * 2) {
          setWon(true);
          setBest((b) => {
            const nb = b === null ? moves + 1 : Math.min(b, moves + 1);
            localStorage.setItem("playzone-memory-best", String(nb));
            return nb;
          });
        }
      } else {
        setLock(true);
        setTimeout(() => { setOpen([]); setLock(false); }, 700);
      }
    }
  }, [lock, won, open, matched, deck, moves]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="flex gap-6 text-lg font-bold">
        <span>Moves: <span className="text-fuchsia-400">{moves}</span></span>
        <span>Pairs: <span className="text-emerald-400">{matched.length / 2}/{PAIRS}</span></span>
        {best !== null && <span>Best: <span className="text-amber-400">{best}</span></span>}
        <button onClick={restart} className="rounded bg-slate-700 px-3 py-1 text-sm hover:bg-slate-600">↻ Restart</button>
      </div>
      {won && <p className="text-xl font-bold text-emerald-400">🎉 You found all pairs in {moves} moves!</p>}
      <div className="grid grid-cols-4 gap-2 sm:gap-3">
        {deck.map((e, i) => {
          const face = open.includes(i) || matched.includes(i);
          return (
            <button
              key={i}
              onClick={() => flip(i)}
              className={`flex h-16 w-16 items-center justify-center rounded-xl text-3xl transition-all sm:h-20 sm:w-20 sm:text-4xl ${
                face ? "bg-fuchsia-600/30 border-2 border-fuchsia-400" : "bg-slate-700 hover:bg-slate-600 border-2 border-transparent"
              } ${matched.includes(i) ? "opacity-70" : ""}`}
            >
              {face ? e : "❓"}
            </button>
          );
        })}
      </div>
      <p className="text-sm text-slate-400">Click cards to flip and find matching pairs</p>
    </div>
  );
}
