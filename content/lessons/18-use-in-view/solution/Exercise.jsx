import { useRef } from "react";
import { motion, useInView } from "motion/react";

export default function Exercise() {
  const containerRef = useRef(null);
  const ref = useRef(null);
  const inView = useInView(ref, { root: containerRef, amount: 0.6 });

  return (
    <div
      ref={containerRef}
      className="w-full max-w-md h-64 overflow-y-scroll rounded-xl border border-white/10 bg-black/40 p-4"
    >
      <p className="text-center text-xs text-on-surface-variant py-2">Scroll down ↓</p>
      <div className="h-56" />
      <motion.div
        ref={ref}
        animate={inView ? { opacity: 1, y: 0, scale: 1 } : { opacity: 0, y: 40, scale: 0.9 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="h-24 rounded-xl bg-accent-blue/30 border border-accent-blue/50 flex items-center justify-center text-sm font-semibold text-white"
      >
        {inView ? "I'm in view! 👋" : "..."}
      </motion.div>
      <div className="h-40" />
    </div>
  );
}
