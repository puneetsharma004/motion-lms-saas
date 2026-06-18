// PRACTICE — Animated Number Counter
//
//   1. import { useInView, animate } from "motion/react"
//   2. const inView = useInView(ref, { once: true })
//   3. when inView turns true, run:
//        const controls = animate(0, 2847, {
//          duration: 1.5, ease: "easeOut",
//          onUpdate: (v) => setValue(Math.round(v)),
//        });
//      and return () => controls.stop()
//
// Right now the number is frozen at 0. Make it roll up to 2,847.

import { useRef, useState } from "react";

export default function Exercise() {
  const ref = useRef(null);
  const [value, setValue] = useState(0);

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-white/10 bg-black/40 px-8 py-6 text-center"
    >
      <p className="text-5xl font-extrabold text-accent-amber tabular-nums">
        {value.toLocaleString()}
      </p>
      <p className="text-xs text-on-surface-variant mt-1">happy developers</p>
    </div>
  );
}
