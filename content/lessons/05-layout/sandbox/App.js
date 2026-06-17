import { useState } from "react";
import Exercise from "./Exercise";

export default function App() {
  const [isColumn, setIsColumn] = useState(false);

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md">
      <div className="flex items-center justify-center w-full min-h-[220px] border border-white/10 rounded-xl bg-black/40 p-6">
        <Exercise isColumn={isColumn} />
      </div>
      <button
        onClick={() => setIsColumn((c) => !c)}
        className="bg-accent-lime/10 border border-accent-lime/30 text-accent-lime rounded px-4 py-1.5 text-xs font-bold hover:bg-accent-lime/20 transition-colors cursor-pointer"
      >
        Toggle Direction
      </button>
    </div>
  );
}
