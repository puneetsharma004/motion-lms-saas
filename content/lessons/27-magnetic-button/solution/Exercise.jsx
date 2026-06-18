import { useRef } from "react";
import { motion, useMotionValue, useSpring } from "motion/react";

export default function Exercise() {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 300, damping: 20 });
  const sy = useSpring(y, { stiffness: 300, damping: 20 });

  const onPointerMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.4);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.4);
  };

  const onPointerLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div className="h-40 flex items-center justify-center">
      <motion.button
        ref={ref}
        onPointerMove={onPointerMove}
        onPointerLeave={onPointerLeave}
        style={{ x: sx, y: sy }}
        className="px-6 py-3 rounded-full bg-primary text-on-primary font-bold cursor-pointer"
      >
        Hover me
      </motion.button>
    </div>
  );
}
