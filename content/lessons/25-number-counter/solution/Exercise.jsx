import { useEffect, useRef, useState } from "react";
import { useInView, animate } from "motion/react";

export default function Exercise() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, 2847, {
      duration: 1.5,
      ease: "easeOut",
      onUpdate: (v) => setValue(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView]);

  return (
    <div
      ref={ref}
      className="rounded-2xl border border-white/10 bg-black/40 px-8 py-6 text-center"
    >
      <p className="text-5xl font-extrabold text-accent-amber tabular-nums">
        {value.toLocaleString()}
      </p>
      <p className="text-xs text-on-surface-variant mt-1">happy developers</p>
    </div>
  );
}
