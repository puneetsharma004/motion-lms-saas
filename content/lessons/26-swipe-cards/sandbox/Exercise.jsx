// PRACTICE — Swipeable Card Stack
//
//   1. import { motion, AnimatePresence } from "motion/react"
//   2. wrap the stack in <AnimatePresence>; top card gets drag="x"
//   3. onDragEnd: if Math.abs(info.offset.x) > 100 -> remove that card
//   4. exit={{ x: 300, opacity: 0, rotate: 18 }} so it flies away
//
// Right now the cards are a static stack. Make the top one swipeable.

import { useState } from "react";

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
      {items.slice(-3).map((card, idx, arr) => {
        const depth = arr.length - 1 - idx;
        return (
          <div
            key={card.id}
            style={{ zIndex: idx, transform: `translateY(${depth * -8}px) scale(${1 - depth * 0.05})` }}
            className={`absolute w-52 h-60 rounded-2xl ${card.color} flex items-center justify-center text-white font-bold text-lg shadow-xl`}
          >
            {card.label}
          </div>
        );
      })}
    </div>
  );
}
