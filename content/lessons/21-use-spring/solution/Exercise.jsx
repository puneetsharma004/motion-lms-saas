import { motion, useMotionValue, useSpring } from "motion/react";

export default function Exercise() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 200, damping: 20 });
  const sy = useSpring(y, { stiffness: 200, damping: 20 });

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left - 24);
    y.set(e.clientY - r.top - 24);
  };

  return (
    <div
      onPointerMove={onMove}
      className="relative w-full max-w-md h-56 rounded-xl border border-white/10 bg-black/40 overflow-hidden"
    >
      <motion.div
        style={{ x: sx, y: sy }}
        className="w-12 h-12 rounded-full bg-accent-rose pointer-events-none"
      />
    </div>
  );
}
