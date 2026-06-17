// PRACTICE — Variants & Orchestration
//
//   1. import { motion } from "motion/react"
//   2. fill in containerVariants (stagger its children by 0.15s)
//   3. fill in itemVariants (hidden -> show, spring)
//   4. wire variants / initial / animate on the container and each child

// TODO: define your variant objects
const containerVariants = {
  // hidden / show with staggerChildren
};

const itemVariants = {
  // hidden / show
};

export default function Exercise({ active }) {
  return (
    <div className="flex flex-col gap-4 w-full max-w-[200px] bg-white/5 p-6 rounded-xl border border-white/10">
      <div className="h-10 bg-accent-violet/40 rounded-md" />
      <div className="h-10 bg-accent-violet/40 rounded-md" />
      <div className="h-10 bg-accent-violet/40 rounded-md" />
    </div>
  );
}
