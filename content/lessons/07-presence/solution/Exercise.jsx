import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

export default function Exercise() {
  const [toasts, setToasts] = useState([]);

  const addToast = () => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, text: `Toast #${prev.length + 1}` }]);
  };

  const removeToast = (id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="flex flex-col items-center gap-4 w-full p-4">
      <button
        onClick={addToast}
        className="px-4 py-2 border border-accent-indigo text-accent-indigo rounded-lg bg-accent-indigo/10 hover:bg-accent-indigo/20 transition-all text-xs"
      >
        Trigger Toast Notification
      </button>

      <div className="flex flex-col gap-2 w-full max-w-[240px]">
        <AnimatePresence>
          {toasts.map((toast) => (
            <motion.div
              key={toast.id}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9, y: -15 }}
              transition={{ duration: 0.2 }}
              onClick={() => removeToast(toast.id)}
              className="px-3 py-2 bg-accent-indigo text-white text-xs rounded shadow-lg flex items-center justify-between cursor-pointer hover:bg-accent-indigo/90 transition-colors"
            >
              <span>{toast.text}</span>
              <span aria-hidden>×</span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
