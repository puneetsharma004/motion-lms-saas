// PRACTICE — Magnetic Button
//
//   1. import { motion, useMotionValue, useSpring } from "motion/react"
//   2. const x = useMotionValue(0), y = useMotionValue(0)
//      const sx = useSpring(x, { stiffness: 300, damping: 20 })  // + sy
//   3. onPointerMove: read ref.getBoundingClientRect(), then
//        x.set((e.clientX - (r.left + r.width / 2)) * 0.4)   // + y
//   4. onPointerLeave: x.set(0); y.set(0)
//      put style={{ x: sx, y: sy }} on the button
//
// Right now the button is inert. Make it lean toward the cursor.

import { useRef } from "react";

export default function Exercise() {
  const ref = useRef(null);

  return (
    <div className="h-40 flex items-center justify-center">
      <button
        ref={ref}
        className="px-6 py-3 rounded-full bg-primary text-on-primary font-bold cursor-pointer"
      >
        Hover me
      </button>
    </div>
  );
}
