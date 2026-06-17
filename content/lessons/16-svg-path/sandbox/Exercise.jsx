// PRACTICE — SVG Line Drawing
//
//   1. import { motion } from "motion/react"
//   2. turn <circle> and <path> into motion.circle / motion.path
//   3. animate each with initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
//   4. delay the check so it draws after the circle
//
// Right now the check is just drawn statically. Make it animate on.

export default function Exercise() {
  return (
    <svg width="160" height="160" viewBox="0 0 100 100">
      <circle
        cx="50"
        cy="50"
        r="40"
        fill="none"
        stroke="#84cc16"
        strokeWidth="6"
      />
      <path
        d="M30 52 L45 67 L72 38"
        fill="none"
        stroke="#84cc16"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
