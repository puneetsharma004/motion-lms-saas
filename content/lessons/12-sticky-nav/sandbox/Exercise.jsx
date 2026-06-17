// PRACTICE — Shrinking Sticky Navbar
//
//   1. import { motion, useScroll, useTransform } from "motion/react"
//   2. const { scrollY } = useScroll({ container: containerRef })
//   3. map scrollY -> header height (72 -> 52), brand scale (1 -> 0.85),
//      and a backgroundColor ramp, all with useTransform
//   4. turn <header> into <motion.header style={{ height, backgroundColor }}>
//      and the brand into <motion.span style={{ scale }}>
//
// Right now the header is static. Make it condense as you scroll the panel.

import { useRef } from "react";

export default function Exercise() {
  const containerRef = useRef(null);

  return (
    <div
      ref={containerRef}
      className="relative w-full max-w-md h-64 overflow-y-scroll rounded-xl border border-white/10 bg-[#0d0d0d]"
    >
      <header
        className="sticky top-0 z-10 flex items-center justify-between px-4 border-b border-white/10 bg-[#15121b]"
        style={{ height: 72 }}
      >
        <span className="origin-left font-bold text-white">◆ Acme</span>
        <nav className="flex gap-3 text-xs text-on-surface-variant">
          <span>Docs</span>
          <span>Pricing</span>
        </nav>
      </header>

      <div className="p-4 space-y-3 text-sm text-on-surface-variant">
        <p className="text-white font-semibold">Scroll this panel ↑</p>
        {Array.from({ length: 12 }).map((_, i) => (
          <p key={i}>Line {i + 1} — watch the header condense as you scroll.</p>
        ))}
      </div>
    </div>
  );
}
