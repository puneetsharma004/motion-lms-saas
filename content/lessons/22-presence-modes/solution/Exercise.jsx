import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const slides = ["Design", "Animate", "Ship"];

export default function Exercise() {
  const [i, setI] = useState(0);

  return (
    <div className="flex flex-col items-center gap-4">
      <div className="relative h-20 w-64 flex items-center justify-center rounded-xl border border-white/10 bg-black/40 overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.span
            key={i}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.25 }}
            className="text-xl font-bold text-white"
          >
            {slides[i]}
          </motion.span>
        </AnimatePresence>
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
