import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const faqs = [
  { q: "Is there a free tier?", a: "Yes — the first three lessons are free, no account needed." },
  { q: "Do I need to install anything?", a: "No. Everything runs in your browser with a live preview." },
  { q: "Will my progress save?", a: "Sign in and it syncs across your devices automatically." },
];

export default function Exercise() {
  const [open, setOpen] = useState(0);

  return (
    <div className="w-full max-w-md space-y-2">
      {faqs.map((f, i) => (
        <div key={i} className="rounded-xl border border-white/10 bg-black/40 overflow-hidden">
          <button
            onClick={() => setOpen(open === i ? -1 : i)}
            className="w-full flex justify-between items-center px-4 py-3 text-sm font-semibold text-white cursor-pointer"
          >
            {f.q}
            <span className="text-accent-amber">{open === i ? "−" : "+"}</span>
          </button>

          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="px-4 pb-3 text-xs text-on-surface-variant">{f.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}
