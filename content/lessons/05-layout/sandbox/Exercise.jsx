// PRACTICE — Magic Layout
//
//   1. import { motion } from "motion/react"
//   2. turn the three boxes into motion.div
//   3. add the `layout` prop to each — that's all it takes

export default function Exercise({ isColumn }) {
  return (
    <div
      className={`flex gap-4 p-4 rounded-lg bg-black/20 ${
        isColumn ? "flex-col" : "flex-row"
      }`}
    >
      {/* TODO: motion.div + layout */}
      <div className="w-12 h-12 bg-accent-lime/40 rounded border border-accent-lime/60" />
      <div className="w-12 h-12 bg-accent-lime/40 rounded border border-accent-lime/60" />
      <div className="w-12 h-12 bg-accent-lime/40 rounded border border-accent-lime/60" />
    </div>
  );
}
