// PRACTICE — Imperative animate() + stagger()
//
//   1. import { useAnimate, stagger } from "motion/react"
//   2. const [scope, animate] = useAnimate()  // put ref={scope} on the wrapper
//   3. in play(): animate(".dot", { y: [0, -24, 0] },
//                          { duration: 0.6, delay: stagger(0.1) })
//
// Right now the button does nothing. Make the dots bounce in a wave.

export default function Exercise() {
  const play = () => {
    // TODO: call animate(".dot", ...) with a stagger delay
  };

  return (
    <div className="flex flex-col items-center gap-5">
      <div className="flex gap-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="dot w-6 h-6 rounded-full bg-accent-lime" />
        ))}
      </div>
      <button
        onClick={play}
        className="bg-white/5 border border-white/10 rounded px-4 py-1.5 text-xs text-white hover:bg-white/10 transition-colors cursor-pointer"
      >
        Play wave
      </button>
    </div>
  );
}
