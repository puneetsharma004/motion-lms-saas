import { motion } from "motion/react";

const gridVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const cellVariants = {
  hidden: { opacity: 0, scale: 0.3 },
  show: {
    opacity: 1,
    scale: 1,
    transition: { type: "spring", stiffness: 150, damping: 12 },
  },
};

export default function Exercise({ active }) {
  const cells = Array.from({ length: 9 });

  return (
    <motion.div
      variants={gridVariants}
      initial="hidden"
      animate={active ? "show" : "hidden"}
      className="grid grid-cols-3 gap-2 p-4 bg-white/5 rounded-xl border border-white/10"
    >
      {cells.map((_, i) => (
        <motion.div
          key={i}
          variants={cellVariants}
          className="w-8 h-8 bg-accent-rose/60 rounded-md border border-accent-rose"
        />
      ))}
    </motion.div>
  );
}
