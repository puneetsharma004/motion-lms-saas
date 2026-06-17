import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

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

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 bg-black/60 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setOpen(false)}
            />
            <motion.div
              role="dialog"
              className="fixed left-1/2 top-1/2 w-72 -translate-x-1/2 -translate-y-1/2 rounded-2xl border border-white/10 bg-surface-container p-5 shadow-2xl"
              initial={{ opacity: 0, scale: 0.92, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 8 }}
              transition={{ type: "spring", bounce: 0.3, duration: 0.4 }}
            >
              <h3 className="text-white font-bold mb-1">Delete project?</h3>
              <p className="text-xs text-on-surface-variant mb-4">
                This can&apos;t be undone. The dialog eases out on close because
                of the exit prop.
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
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
