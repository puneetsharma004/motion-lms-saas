import { motion, useReducedMotion } from "motion/react";

export default function Exercise() {
  const reduce = useReducedMotion();

  return (
    <div className="flex flex-col items-center gap-4">
      <motion.div
        className="w-16 h-16 bg-accent-teal rounded-xl"
        animate={
          reduce
            ? { opacity: [0.5, 1, 0.5] }
            : { rotate: 360, scale: [1, 1.3, 1] }
        }
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
      />
      <p className="text-xs text-on-surface-variant">
        Reduced motion:{" "}
        <span className="text-white font-semibold">{reduce ? "on" : "off"}</span>
      </p>
    </div>
  );
}
