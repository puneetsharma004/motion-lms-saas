// PRACTICE — Animated Tabs (Shared Layout)
//
//   1. import { motion } from "motion/react"
//   2. inside the active tab, render <motion.span layoutId="pill" /> as the
//      absolute inset-0 background (only when i === active)
//   3. add a spring transition; keep the label on top with relative z-10
//
// Right now the active background just jumps between tabs. Make it slide.

import { useState } from "react";

const tabs = ["Overview", "Analytics", "Reports", "Settings"];

export default function Exercise() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-1 p-1 bg-black/40 border border-white/10 rounded-xl">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => setActive(i)}
          className="relative flex-1 px-3 py-2 text-xs font-semibold rounded-lg text-white cursor-pointer"
        >
          {/* TODO: replace this with a <motion.span layoutId="pill" /> */}
          {i === active && (
            <span className="absolute inset-0 bg-accent-indigo rounded-lg" />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  );
}
