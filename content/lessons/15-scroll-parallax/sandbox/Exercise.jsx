// PRACTICE — Scroll Parallax
//
//   1. import { motion, useScroll, useTransform } from "motion/react"
//   2. const { scrollYProgress } = useScroll({
//        container: containerRef, target: targetRef,
//        offset: ["start end", "end start"],
//      })
//   3. const y = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"])
//   4. make the background layer a <motion.div style={{ y }} />
//
// Right now the background is static. Make it drift as the card scrolls by.

import { useRef } from "react";

export default function Exercise() {
  const containerRef = useRef(null);
  const targetRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className="w-full max-w-md h-64 overflow-y-scroll rounded-xl border border-white/10 bg-black/40"
    >
      <div className="h-40" />
      <div
        ref={targetRef}
        className="relative h-48 mx-4 rounded-xl overflow-hidden border border-white/10"
      >
        <div className="absolute -inset-y-12 inset-x-0 bg-gradient-to-br from-accent-teal/50 to-accent-cyan/30" />
        <div className="relative z-10 p-4 text-white font-bold">Parallax card</div>
      </div>
      <div className="h-64" />
    </div>
  );
}
