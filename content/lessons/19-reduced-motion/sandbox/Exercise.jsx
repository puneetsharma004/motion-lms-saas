// PRACTICE — Respecting Reduced Motion
//
//   1. import { motion, useReducedMotion } from "motion/react"
//   2. const reduce = useReducedMotion()
//   3. branch animate: reduce ? { opacity: [0.5, 1, 0.5] }
//                              : { rotate: 360, scale: [1, 1.3, 1] }
//   4. show the detected value in the label
//
// Right now it always spins. Make it fall back to a gentle fade when the user
// prefers reduced motion.

import { motion } from "motion/react";

export default function Exercise() {
  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="w-16 h-16 bg-accent-teal rounded-xl"
        animate={{ rotate: 360, scale: [1, 1.3, 1] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <p className="text-xs text-on-surface-variant">
        Reduced motion: <span className="text-white font-semibold">off</span>
      </p>
    </div>
  );
}
