import { useState } from "react";
import { motion } from "motion/react";

const tabs = ["Overview", "Analytics", "Reports", "Settings"];

export default function Exercise() {
  const [active, setActive] = useState(0);

  return (
    <div className="flex gap-1 p-1 bg-black/40 border border-white/10 rounded-xl">
      {tabs.map((tab, i) => (
        <button
          key={tab}
          onClick={() => setActive(i)}
          className="relative flex-1 px-3 py-2 text-xs font-semibold rounded-lg text-white cursor-pointer"
        >
          {i === active && (
            <motion.span
              layoutId="pill"
              className="absolute inset-0 bg-accent-indigo rounded-lg"
              transition={{ type: "spring", bounce: 0.2, duration: 0.5 }}
            />
          )}
          <span className="relative z-10">{tab}</span>
        </button>
      ))}
    </div>
  );
}
