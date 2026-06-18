import { motion } from "motion/react";

const tiles = [
  { label: "Analytics", span: "col-span-2", accent: "bg-accent-blue/20 border-accent-blue/40" },
  { label: "Fast", span: "", accent: "bg-accent-lime/20 border-accent-lime/40" },
  { label: "Secure", span: "", accent: "bg-accent-rose/20 border-accent-rose/40" },
  { label: "Scales", span: "col-span-2", accent: "bg-accent-violet/20 border-accent-violet/40" },
];

export default function Exercise() {
  return (
    <div className="grid grid-cols-3 gap-3 w-full max-w-md">
      {tiles.map((t) => (
        <motion.div
          key={t.label}
          whileHover={{ scale: 1.05, y: -4 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className={`${t.span} h-24 rounded-2xl border ${t.accent} p-3 flex items-end text-sm font-semibold text-white cursor-pointer`}
        >
          {t.label}
        </motion.div>
      ))}
    </div>
  );
}
