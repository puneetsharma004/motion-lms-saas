// PRACTICE — Trigger on View (useInView)
//
//   1. import { motion, useInView } from "motion/react"
//   2. const inView = useInView(ref, { root: containerRef, amount: 0.6 })
//   3. make the card a motion.div:
//        animate={inView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
//   4. show {inView ? "..." : "..."} in the label
//
// Right now the card is always visible. Make it react to entering the panel.

import { useRef } from "react";

export default function Exercise() {
  const containerRef = useRef(null);
  const ref = useRef(null);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-md h-64 overflow-y-scroll rounded-xl border border-white/10 bg-black/40 p-4"
    >
      <p className="text-center text-xs text-on-surface-variant py-2">Scroll down ↓</p>
      <div className="h-56" />
      <div
        ref={ref}
        className="h-24 rounded-xl bg-accent-blue/30 border border-accent-blue/50 flex items-center justify-center text-sm font-semibold text-white"
      >
        Card
      </div>
      <div className="h-40" />
    </div>
  );
}
