// PRACTICE — Accordion / FAQ
//
//   1. import { motion, AnimatePresence } from "motion/react"
//   2. wrap each open answer in <AnimatePresence initial={false}>
//   3. animate the panel: initial height 0 -> animate height "auto" -> exit 0
//   4. keep overflow-hidden so it clips while it slides
//
// Right now answers snap open/closed. Make them ease open and shut.

import { useState } from "react";

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

          {open === i && (
            <div className="overflow-hidden">
              <p className="px-4 pb-3 text-xs text-on-surface-variant">{f.a}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
