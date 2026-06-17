// PRACTICE — Transitions & Springs
//
//   The box already animates with a plain tween. Make it feel alive:
//   1. change the transition to type: "spring"
//   2. tune it with stiffness + damping (try 300 / 18), or a bounce
//
// Toggle and compare the spring against the old tween.

import { useState } from "react";
import { motion } from "motion/react";

export default function Exercise() {
  const [on, setOn] = useState(false);

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <div className="w-full h-24 rounded-xl border border-white/10 bg-black/40 flex items-center px-2">
        <motion.div
          className="w-16 h-16 bg-accent-violet rounded-xl"
          animate={{ x: on ? 200 : 0 }}
          transition={{ duration: 0.3 }}
        />
      </div>
      <button
        onClick={() => setOn((v) => !v)}
        className="bg-white/5 border border-white/10 rounded px-4 py-1.5 text-xs text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        Toggle
      </button>
    </div>
  );
}
