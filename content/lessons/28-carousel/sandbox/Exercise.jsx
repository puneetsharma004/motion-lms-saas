// PRACTICE — Directional Carousel
//
//   1. import { motion, AnimatePresence } from "motion/react"
//   2. wrap the slide in <AnimatePresence custom={direction}>
//   3. give the motion.div key={page} + custom={direction} and variants:
//        enter:  (d) => ({ x: d > 0 ? 260 : -260, opacity: 0 })
//        center: { x: 0, opacity: 1 }
//        exit:   (d) => ({ x: d > 0 ? -260 : 260, opacity: 0 })
//      initial="enter" animate="center" exit="exit"
//
// Right now Next/Prev jump with no motion. Make slides come from the right
// direction.

import { useState } from "react";

const slides = [
  { color: "from-accent-blue to-accent-violet", label: "01" },
  { color: "from-accent-rose to-accent-orange", label: "02" },
  { color: "from-accent-teal to-accent-cyan", label: "03" },
];

export default function Exercise() {
  const [[page, direction], setPage] = useState([0, 0]);
  const idx = ((page % slides.length) + slides.length) % slides.length;
  const paginate = (dir) => setPage([page + dir, dir]);

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative w-64 h-40 overflow-hidden rounded-xl border border-white/10">
        <div
          className={`absolute inset-0 bg-gradient-to-br ${slides[idx].color} flex items-center justify-center text-4xl font-bold text-white`}
        >
          {slides[idx].label}
        </div>
      </div>
      <div className="flex gap-2">
        <button
          onClick={() => paginate(-1)}
          className="bg-white/5 border border-white/10 rounded px-4 py-1.5 text-xs text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          Prev
        </button>
        <button
          onClick={() => paginate(1)}
          className="bg-white/5 border border-white/10 rounded px-4 py-1.5 text-xs text-white hover:bg-white/10 transition-colors cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
