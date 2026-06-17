import { motion } from "motion/react";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100 },
  },
};

export default function Exercise({ active }) {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate={active ? "show" : "hidden"}
      className="flex flex-col gap-4 w-full max-w-[200px] bg-white/5 p-6 rounded-xl border border-white/10"
    >
      <motion.div variants={itemVariants} className="h-10 bg-accent-violet/40 rounded-md" />
      <motion.div variants={itemVariants} className="h-10 bg-accent-violet/40 rounded-md" />
      <motion.div variants={itemVariants} className="h-10 bg-accent-violet/40 rounded-md" />
    </motion.div>
  );
}
