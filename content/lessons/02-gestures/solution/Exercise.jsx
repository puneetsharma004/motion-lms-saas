import { useRef } from "react";
import { motion } from "motion/react";

const card =
  "w-20 h-20 bg-accent-coral/20 border-2 border-accent-coral rounded-2xl";

export default function Exercise() {
  const constraintsRef = useRef(null);

  return (
    <div
      ref={constraintsRef}
      className="flex flex-wrap items-center justify-center gap-8 w-full h-full p-4 overflow-hidden"
    >
      <div className="flex flex-col items-center gap-2">
        <motion.div
          whileHover={{ scale: 1.1, boxShadow: "0 0 30px rgba(251, 113, 133, 0.6)" }}
          className={card + " cursor-pointer"}
        />
        <span className="text-xs text-on-surface-variant">Hover</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <motion.div whileTap={{ scale: 0.9 }} className={card + " cursor-pointer"} />
        <span className="text-xs text-on-surface-variant">Tap</span>
      </div>

      <div className="flex flex-col items-center gap-2">
        <motion.div
          drag
          dragConstraints={constraintsRef}
          dragElastic={0.1}
          whileDrag={{ scale: 1.1 }}
          className={card + " cursor-grab active:cursor-grabbing"}
        />
        <span className="text-xs text-on-surface-variant">Drag</span>
      </div>
    </div>
  );
}
