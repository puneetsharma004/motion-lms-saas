// PRACTICE — Coordinated Layout (LayoutGroup)
//
//   1. import { motion, LayoutGroup } from "motion/react"
//   2. each Item is already a motion.div with `layout`
//   3. wrap the list of <Item /> in <LayoutGroup> so expanding one makes the
//      others animate to their new positions instead of jumping
//
// Open a row: siblings currently jump. Wrap them to make it smooth.

import { useState } from "react";
import { motion } from "motion/react";

function Item({ title }) {
  const [open, setOpen] = useState(false);
  return (
    <motion.div
      layout
      onClick={() => setOpen((o) => !o)}
      className="rounded-xl bg-black/40 border border-white/10 p-4 cursor-pointer"
    >
      <motion.h4 layout className="text-sm font-semibold text-white">
        {title}
      </motion.h4>
      {open && (
        <motion.p layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs text-on-surface-variant mt-2">
          Expanded detail for {title}. Click to collapse.
        </motion.p>
      )}
    </motion.div>
  );
}

export default function Exercise() {
  return (
    <div className="w-full max-w-md space-y-2">
      <Item title="First" />
      <Item title="Second" />
      <Item title="Third" />
    </div>
  );
}
