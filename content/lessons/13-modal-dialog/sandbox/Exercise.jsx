// PRACTICE — Modal Dialog (Exit Animations)
//
//   1. import { motion, AnimatePresence } from "motion/react"
//   2. wrap the {open && (...)} block in <AnimatePresence>
//   3. backdrop -> motion.div with initial / animate / exit opacity
//   4. dialog -> motion.div with initial / animate / exit (scale + y) + a spring
//
// Right now the dialog pops in and out instantly. Give it a smooth open AND
// close (exit) animation.

import { useState } from "react";

export default function Exercise() {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full flex justify-center">
      <button
        onClick={() => setOpen(true)}
        className="px-4 py-2 rounded-lg bg-accent-rose text-white text-sm font-semibold cursor-pointer"
      >
        Open dialog
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 w-72 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-surface-container p-5 shadow-2xl">
            <h3 className="text-white font-bold mb-1">Delete project?</h3>
            <p className="text-xs text-on-surface-variant mb-4">
              This can&apos;t be undone.
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 rounded-md text-xs text-on-surface-variant hover:text-white cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => setOpen(false)}
                className="px-3 py-1.5 rounded-md text-xs font-semibold bg-accent-rose text-white cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
