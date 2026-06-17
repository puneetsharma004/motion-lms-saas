import { useRef } from "react";
import { motion, useScroll, useTransform } from "motion/react";

export default function Exercise() {
  const containerRef = useRef(null);
  const { scrollY } = useScroll({ container: containerRef });

  const height = useTransform(scrollY, [0, 80], [72, 52]);
  const backgroundColor = useTransform(
    scrollY,
    [0, 80],
    ["rgba(21,18,27,0)", "rgba(21,18,27,0.92)"],
  );
  const scale = useTransform(scrollY, [0, 80], [1, 0.85]);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md h-64 overflow-y-scroll rounded-xl border border-white/10 bg-[#0d0d0d]"
    >
      <motion.header
        style={{ height, backgroundColor }}
        className="sticky top-0 z-10 flex items-center justify-between px-4 border-b border-white/10 backdrop-blur"
      >
        <motion.span style={{ scale }} className="origin-left font-bold text-white">
          ◆ Acme
        </motion.span>
        <nav className="flex gap-3 text-xs text-on-surface-variant">
          <span>Docs</span>
          <span>Pricing</span>
        </nav>
      </motion.header>

      <div className="p-4 space-y-3 text-sm text-on-surface-variant">
        <p className="text-white font-semibold">Scroll this panel ↑</p>
        {Array.from({ length: 12 }).map((_, i) => (
          <p key={i}>Line {i + 1} — watch the header condense as you scroll.</p>
        ))}
      </div>
    </div>
  );
}
