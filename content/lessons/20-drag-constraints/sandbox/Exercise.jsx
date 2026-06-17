// PRACTICE — Drag: Constraints & Momentum
//
//   1. add `drag` to the puck
//   2. bound it: dragConstraints={constraintsRef}
//   3. give it feel: dragElastic={0.2} and
//      dragTransition={{ bounceStiffness: 400, bounceDamping: 18 }}
//   4. whileDrag={{ scale: 1.1 }} for grab feedback
//
// Right now the puck can't move. Make it draggable, bounded, and springy.

import { useRef } from "react";
import { motion } from "motion/react";

export default function Exercise() {
  const constraintsRef = useRef(null);

  return (
    <div
      ref={constraintsRef}
      className="relative w-full max-w-md h-56 rounded-xl border border-white/10 bg-black/40 p-2"
    >
      <motion.div className="w-16 h-16 bg-accent-orange rounded-2xl cursor-grab active:cursor-grabbing" />
    </div>
  );
}
