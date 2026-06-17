import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function Exercise() {
  const containerRef = useRef(null);
  const targetRef = useRef(null);

  const { scrollYProgress } = useScroll({
    container: containerRef,
    target: targetRef,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], ["-30%", "30%"]);

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
        <motion.div
          style={{ y }}
          className="absolute -inset-y-12 inset-x-0 bg-gradient-to-br from-accent-teal/50 to-accent-cyan/30"
        />
        <div className="relative z-10 p-4 text-white font-bold">Parallax card</div>
      </div>
      <div className="h-64" />
    </div>
  );
}
