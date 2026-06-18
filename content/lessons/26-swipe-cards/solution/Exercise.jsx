import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";

const cards = [
  { id: 1, label: "Swipe me", color: "bg-accent-rose" },
  { id: 2, label: "Then me", color: "bg-accent-violet" },
  { id: 3, label: "One more", color: "bg-accent-cyan" },
];

export default function Exercise() {
  const [items, setItems] = useState(cards);

  return (
    <div className="relative w-56 h-64 flex items-center justify-center">
      {items.length === 0 && (
        <p className="text-on-surface-variant text-sm">No more cards 🎉</p>
      )}
      <AnimatePresence>
        {items.slice(-3).map((card, idx, arr) => {
          const depth = arr.length - 1 - idx;
          const isTop = depth === 0;
          return (
            <motion.div
              key={card.id}
              style={{ zIndex: idx }}
              drag={isTop ? "x" : false}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.6}
              onDragEnd={(_, info) => {
                if (isTop && Math.abs(info.offset.x) > 100) {
                  setItems((prev) => prev.filter((c) => c.id !== card.id));
                }
              }}
              initial={{ scale: 0.9, y: -16, opacity: 0 }}
              animate={{ scale: 1 - depth * 0.05, y: depth * -8, opacity: 1 }}
              exit={{ x: 300, opacity: 0, rotate: 18 }}
              transition={{ type: "spring", stiffness: 300, damping: 26 }}
              whileDrag={{ cursor: "grabbing" }}
              className={`absolute w-52 h-60 rounded-2xl ${card.color} flex items-center justify-center text-white font-bold text-lg shadow-xl ${isTop ? "cursor-grab" : ""}`}
            >
              {card.label}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}
