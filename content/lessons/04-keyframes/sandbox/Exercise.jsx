// PRACTICE — Keyframe Cycles
//
//   1. import { motion } from "motion/react"
//   2. turn the box into a motion.div
//   3. animate with arrays: scale / rotate / borderRadius / backgroundColor
//   4. repeat the transition forever (repeat: Infinity)

export default function Exercise() {
  return (
    <div className="flex items-center justify-center w-full h-full p-8">
      {/* TODO: motion.div with keyframe arrays + infinite repeat */}
      <div className="w-16 h-16 bg-accent-teal rounded-lg shadow-[0_0_20px_rgba(20,184,166,0.4)]" />
    </div>
  );
}
