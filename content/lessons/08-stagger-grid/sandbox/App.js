import { useState } from "react";
import Exercise from "./Exercise";

export default function App() {
  const [active, setActive] = useState(true);

  const trigger = () => {
    setActive(false);
    setTimeout(() => setActive(true), 50);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md">
      <div className="flex items-center justify-center w-full min-h-[220px] border border-white/10 rounded-xl bg-black/40 p-6">
        <Exercise active={active} />
      </div>
      <button
        onClick={trigger}
        className="bg-accent-rose/10 border border-accent-rose/30 text-accent-rose rounded px-4 py-1.5 text-xs font-bold hover:bg-accent-rose/20 transition-colors cursor-pointer"
      >
        Trigger Grid
      </button>
    </div>
  );
}
