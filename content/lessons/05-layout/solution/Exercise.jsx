import { motion } from "motion/react";

export default function Exercise({ isColumn }) {
  return (
    <div
      className={`flex gap-4 p-4 rounded-lg bg-black/20 ${
        isColumn ? "flex-col" : "flex-row"
      }`}
    >
      <motion.div layout className="w-12 h-12 bg-accent-lime/40 rounded border border-accent-lime/60" />
      <motion.div layout className="w-12 h-12 bg-accent-lime/40 rounded border border-accent-lime/60" />
      <motion.div layout className="w-12 h-12 bg-accent-lime/40 rounded border border-accent-lime/60" />
    </div>
  );
}
