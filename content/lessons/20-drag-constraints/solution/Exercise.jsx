import { useRef } from "react";
import { motion } from "motion/react";

export default function Exercise() {
  const constraintsRef = useRef(null);

  return (
    <div
      ref={constraintsRef}
      className="relative w-full max-w-md h-56 rounded-xl border border-white/10 bg-black/40 p-2"
    >
      <motion.div
        drag
        dragConstraints={constraintsRef}
        dragElastic={0.2}
        dragTransition={{ bounceStiffness: 400, bounceDamping: 18 }}
        whileDrag={{ scale: 1.1 }}
        className="w-16 h-16 bg-accent-orange rounded-2xl cursor-grab active:cursor-grabbing"
      />
    </div>
  );
}
