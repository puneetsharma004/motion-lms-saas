import { motion } from "motion/react";

export default function Exercise() {
  return (
    <div className="flex items-center justify-center w-full h-full p-8">
      <motion.div
        animate={{
          scale: [1, 1.2, 1.2, 0.8, 1],
          rotate: [0, 90, 180, 270, 0],
          borderRadius: ["20%", "20%", "50%", "50%", "20%"],
          backgroundColor: ["#14b8a6", "#06b6d4", "#3b82f6", "#8b5cf6", "#14b8a6"],
        }}
        transition={{
          duration: 3,
          ease: "easeInOut",
          times: [0, 0.25, 0.5, 0.75, 1],
          repeat: Infinity,
          repeatDelay: 0.5,
        }}
        className="w-16 h-16 shadow-[0_0_20px_rgba(20,184,166,0.4)]"
      />
    </div>
  );
}
