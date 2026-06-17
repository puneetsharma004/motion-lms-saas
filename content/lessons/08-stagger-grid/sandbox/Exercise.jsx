// PRACTICE — Grid Stagger Cascade
//
//   1. import { motion } from "motion/react"
//   2. gridVariants: hidden / show with transition.staggerChildren = 0.08
//   3. cellVariants: hidden { opacity:0, scale:0.3 } / show { opacity:1, scale:1, spring }
//   4. parent grid -> motion.div variants/initial/animate
//   5. each cell -> motion.div variants={cellVariants}

// TODO: define your variant objects
const gridVariants = {
  // hidden / show with staggerChildren
};

const cellVariants = {
  // hidden / show with scale + spring
};

export default function Exercise({ active }) {
  const cells = Array.from({ length: 9 });

  return (
    <div className="grid grid-cols-3 gap-2 p-4 bg-white/5 rounded-xl border border-white/10">
      {cells.map((_, i) => (
        <div
          key={i}
          className="w-8 h-8 bg-accent-rose/60 rounded-md border border-accent-rose"
        />
      ))}
    </div>
  );
}
