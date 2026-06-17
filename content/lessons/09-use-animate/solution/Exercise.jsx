import { useAnimate } from "motion/react";

export default function Exercise() {
  const [scope, animate] = useAnimate();

  const handleJump = () => {
    animate(
      scope.current,
      { y: [-25, 0] },
      { type: "spring", stiffness: 350, damping: 12 }
    );
  };

  const handleSpin = () => {
    animate(scope.current, { rotate: [0, 360] }, { duration: 0.5, ease: "easeInOut" });
  };

  const handleShake = () => {
    animate(
      scope.current,
      { x: [0, -10, 10, -10, 10, 0] },
      { duration: 0.4, ease: "linear" }
    );
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full h-full p-4">
      <div
        ref={scope}
        className="w-12 h-12 bg-accent-orange rounded-xl shadow-[0_0_20px_rgba(249,115,22,0.4)]"
      />

      <div className="flex gap-2">
        <button
          onClick={handleJump}
          className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs hover:bg-accent-orange/20 text-white transition-colors cursor-pointer"
        >
          Jump
        </button>
        <button
          onClick={handleSpin}
          className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs hover:bg-accent-orange/20 text-white transition-colors cursor-pointer"
        >
          Spin
        </button>
        <button
          onClick={handleShake}
          className="px-3 py-1 bg-white/5 border border-white/10 rounded text-xs hover:bg-accent-orange/20 text-white transition-colors cursor-pointer"
        >
          Shake
        </button>
      </div>
    </div>
  );
}
