import { useState } from "react";
import Exercise from "./Exercise";

const btn =
  "bg-white/5 border border-white/10 rounded px-3 py-1.5 text-xs text-white hover:bg-white/10 transition-colors cursor-pointer";

export default function App() {
  const [opacity, setOpacity] = useState(1);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);
  const [scale, setScale] = useState(1);
  const [rotate, setRotate] = useState(0);

  const reset = () => {
    setOpacity(1);
    setX(0);
    setY(0);
    setScale(1);
    setRotate(0);
  };

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-md">
      <div className="flex items-center justify-center w-full h-48 rounded-xl border border-white/10 bg-black/40">
        <Exercise opacity={opacity} x={x} y={y} scale={scale} rotate={rotate} />
      </div>
      <div className="flex flex-wrap gap-2 justify-center">
        <button className={btn} onClick={() => setOpacity((o) => (o === 1 ? 0.2 : 1))}>
          Opacity
        </button>
        <button className={btn} onClick={() => setX(Math.random() * 120 - 60)}>
          Random X
        </button>
        <button className={btn} onClick={() => setY(Math.random() * 120 - 60)}>
          Random Y
        </button>
        <button className={btn} onClick={() => setScale(Math.random() * 1.2 + 0.4)}>
          Scale
        </button>
        <button className={btn} onClick={() => setRotate(Math.random() * 360)}>
          Rotate
        </button>
        <button className={btn} onClick={reset}>
          Reset
        </button>
      </div>
    </div>
  );
}
