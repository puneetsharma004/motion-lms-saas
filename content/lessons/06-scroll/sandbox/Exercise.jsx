// PRACTICE — Scroll-Driven Animations
//
//   1. import { motion, useScroll, useTransform } from "motion/react"
//   2. const { scrollYProgress } = useScroll({ container: containerRef })
//   3. progress bar -> motion.div style={{ scaleX: scrollYProgress }}
//   4. map opacity + backgroundColor with useTransform
//   5. Box 1 -> style={{ opacity, backgroundColor }}
//   6. Box 2 -> initial / whileInView, viewport.root = containerRef

import { useRef } from "react";

export default function Exercise() {
  const containerRef = useRef(null);

  // TODO: set up useScroll + useTransform here

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* Scroll indicator bar */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        {/* TODO: motion.div with scaleX: scrollYProgress */}
        <div className="h-full bg-accent-amber origin-left" style={{ width: "0%" }} />
      </div>

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="w-full h-44 overflow-y-scroll border border-white/10 rounded-lg bg-black/40 p-4 space-y-16"
      >
        <div className="text-center py-4 text-xs text-on-surface-variant">
          Scroll down to see linked animations...
        </div>

        {/* Box 1: dynamic scroll styles */}
        <div className="w-full h-10 bg-accent-amber rounded-md flex items-center justify-center text-black font-bold text-xs shadow-md">
          Dynamic Scroll Color
        </div>

        {/* Box 2: whileInView */}
        <div className="w-full h-10 bg-accent-amber/20 border border-accent-amber/40 rounded-md flex items-center justify-center text-xs font-semibold text-accent-amber">
          Slide In On View
        </div>

        <div className="h-12" />
      </div>
    </div>
  );
}
