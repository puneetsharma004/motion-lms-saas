// PRACTICE — Gestures
//
// Make these three cards interactive:
//   - import { motion } from "motion/react"  and  useRef from "react"
//   - bind ref={constraintsRef} on the wrapper
//   - Hover  -> motion.div + whileHover
//   - Tap    -> motion.div + whileTap
//   - Drag   -> motion.div + drag + dragConstraints={constraintsRef}

import { useRef } from "react";

const card =
  "w-20 h-20 bg-accent-coral/20 border-2 border-accent-coral rounded-2xl";

export default function Exercise() {
  const constraintsRef = useRef(null);

  return (
    <div
      // TODO: bind constraintsRef here
      className="flex flex-wrap items-center justify-center gap-8 w-full h-full p-4 overflow-hidden"
    >
      <div className="flex flex-col items-center gap-2">
        {/* TODO: motion.div + whileHover */}
        <div className={card + " cursor-pointer"} />
        <span className="text-xs text-on-surface-variant">Hover</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        {/* TODO: motion.div + whileTap */}
        <div className={card + " cursor-pointer"} />
        <span className="text-xs text-on-surface-variant">Tap</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        {/* TODO: motion.div + drag + dragConstraints */}
        <div className={card + " cursor-grab active:cursor-grabbing"} />
        <span className="text-xs text-on-surface-variant">Drag</span>
      </div>
    </div>
  );
}
