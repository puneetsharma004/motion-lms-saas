import { motion } from "motion/react";

export default function Exercise({ opacity, x, y, scale, rotate }) {
  return (
    <motion.div
      className="w-24 h-24 bg-accent-blue rounded-xl"
      animate={{ opacity, x, y, scale, rotate }}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    />
  );
}
