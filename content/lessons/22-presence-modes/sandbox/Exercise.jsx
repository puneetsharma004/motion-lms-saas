// PRACTICE — Swapping Content (mode="wait")
//
//   1. import { motion, AnimatePresence } from "motion/react"
//   2. wrap the word in <AnimatePresence mode="wait">
//   3. give the motion.span key={i} + initial/animate/exit (opacity + y)
//
// Right now the word swaps instantly. Make each one leave before the next enters.

import { useState } from "react";

const slides = ["Design", "Animate", "Ship"];

export default function Exercise() {
  const [i, setI] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-20 w-64 flex items-center justify-center rounded-xl border border-white/10 bg-black/40 overflow-hidden">
        <span className="text-xl font-bold text-white">{slides[i]}</span>
      </div>
      <button
        onClick={() => setI((p) => (p + 1) % slides.length)}
        className="bg-white/5 border border-white/10 rounded px-4 py-1.5 text-xs text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        Next
      </button>
    </div>
  );
}
