// PRACTICE — Motion Values & 3D Tilt
//
//   1. import { motion, useMotionValue, useTransform } from "motion/react"
//   2. const x = useMotionValue(0); const y = useMotionValue(0)
//   3. rotateX = useTransform(y, [-100,100], [15,-15]); rotateY = useTransform(x, [-100,100], [-15,15])
//   4. handleMouseMove -> x.set(mouseX), y.set(mouseY); handleMouseLeave -> reset to 0
//   5. card -> motion.div style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}

export default function Exercise() {
  // TODO: const x = useMotionValue(0); const y = useMotionValue(0);
  // TODO: const rotateX = ...; const rotateY = ...;

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - rect.width / 2;
    const mouseY = event.clientY - rect.top - rect.height / 2;

    // TODO: x.set(mouseX); y.set(mouseY);
  };

  const handleMouseLeave = () => {
    // TODO: x.set(0); y.set(0);
  };

  return (
    <div
      style={{ perspective: 600 }}
      className="flex items-center justify-center w-full h-full p-4"
    >
      {/* TODO: motion.div + style rotateX/rotateY + onMouseMove/onMouseLeave */}
      <div className="w-44 h-28 bg-gradient-to-br from-accent-cyan/30 to-accent-blue/30 border border-accent-cyan/50 rounded-xl flex flex-col items-center justify-center cursor-pointer relative shadow-[0_0_30px_rgba(6,182,212,0.15)] select-none">
        <div style={{ transform: "translateZ(30px)" }} className="text-center">
          <div className="font-bold text-sm text-white">PARALLAX TILT</div>
          <div className="text-[10px] text-accent-cyan">Move cursor here</div>
        </div>
      </div>
    </div>
  );
}
