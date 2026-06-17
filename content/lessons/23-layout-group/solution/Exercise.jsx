import { useState } from "react";
import { motion, LayoutGroup } from "motion/react";

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
    <LayoutGroup>
      <div className="w-full max-w-md space-y-2">
        <Item title="First" />
        <Item title="Second" />
        <Item title="Third" />
      </div>
    </LayoutGroup>
  );
}
