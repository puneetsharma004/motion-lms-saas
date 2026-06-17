import { motion } from "motion/react";

export default function Exercise() {
  return (
    <svg width="160" height="160" viewBox="0 0 100 100">
      <motion.circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#84cc16"
        strokeWidth="6"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.2, ease: "easeInOut" }}
      />
      <motion.path
        d="M30 52 L45 67 L72 38"
        fill="none"
        stroke="#84cc16"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 1 }}
      />
    </svg>
  );
}
