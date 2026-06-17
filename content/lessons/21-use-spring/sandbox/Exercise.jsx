// PRACTICE — Smoothing with useSpring
//
//   1. import { motion, useMotionValue, useSpring } from "motion/react"
//   2. wrap the raw values:
//        const sx = useSpring(x, { stiffness: 200, damping: 20 })
//        const sy = useSpring(y, { stiffness: 200, damping: 20 })
//   3. point the dot at the springs: style={{ x: sx, y: sy }}
//
// Right now the dot locks exactly to the pointer. Make it trail smoothly.

import { motion, useMotionValue } from "motion/react";

export default function Exercise() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left - 24);
    y.set(e.clientY - r.top - 24);
  };

  return (
    <div
      onPointerMove={onMove}
      className="relative w-full max-w-md h-56 rounded-xl border border-white/10 bg-black/40 overflow-hidden"
    >
      <motion.div
        style={{ x, y }}
        className="w-12 h-12 rounded-full bg-accent-rose pointer-events-none"
      />
    </div>
  );
}
