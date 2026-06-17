import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function Exercise() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({ container: containerRef });

  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.3, 1, 0.3]);
  const backgroundColor = useTransform(
    scrollYProgress,
    [0, 0.5, 1],
    ["#f59e0b", "#fb7185", "#3b82f6"]
  );

  return (
    <div className="w-full flex flex-col items-center gap-2">
      {/* Scroll indicator bar */}
      <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-accent-amber origin-left"
          style={{ scaleX: scrollYProgress }}
        />
      </div>

      {/* Scrollable container */}
      <div
        ref={containerRef}
        className="w-full h-44 overflow-y-scroll border border-white/10 rounded-lg bg-black/40 p-4 space-y-16"
      >
        <div className="text-center py-4 text-xs text-on-surface-variant">
          Scroll down to see linked animations...
        </div>

        <motion.div
          style={{ opacity, backgroundColor }}
          className="w-full h-10 rounded-md flex items-center justify-center text-black font-bold text-xs shadow-md"
        >
          Dynamic Scroll Color
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ root: containerRef, once: false, margin: "-10px" }}
          transition={{ duration: 0.5 }}
          className="w-full h-10 bg-accent-amber/20 border border-accent-amber/40 rounded-md flex items-center justify-center text-xs font-semibold text-accent-amber"
        >
          Slide In On View
        </motion.div>

        <div className="h-12" />
      </div>
    </div>
  );
}
