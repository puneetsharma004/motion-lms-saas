import { useState } from "react";
import Exercise from "./Exercise";

export default function App() {
  const [active, setActive] = useState(true);

  const replay = () => {
    setActive(false);
    setTimeout(() => setActive(true), 50);
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full max-w-md">
      <div className="flex items-center justify-center w-full min-h-[220px] border border-white/10 rounded-xl bg-black/40 p-6">
        <Exercise active={active} />
      </div>
      <button
        onClick={replay}
        className="bg-white/5 border border-white/10 rounded px-4 py-1.5 text-xs text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        ↻ Replay
      </button>
    </div>
  );
}
