import { motion, useMotionValue, useTransform } from "motion/react";

export default function Exercise() {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  // Map cursor offset (px) to degrees of tilt.
  const rotateX = useTransform(y, [-100, 100], [15, -15]);
  const rotateY = useTransform(x, [-100, 100], [-15, 15]);

  const handleMouseMove = (event) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const mouseX = event.clientX - rect.left - rect.width / 2;
    const mouseY = event.clientY - rect.top - rect.height / 2;

    x.set(mouseX);
    y.set(mouseY);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <div
      style={{ perspective: 600 }}
      className="flex items-center justify-center w-full h-full p-4"
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="w-44 h-28 bg-gradient-to-br from-accent-cyan/30 to-accent-blue/30 border border-accent-cyan/50 rounded-xl flex flex-col items-center justify-center cursor-pointer relative shadow-[0_0_30px_rgba(6,182,212,0.15)] select-none hover:shadow-[0_0_40px_rgba(6,182,212,0.3)] transition-shadow duration-300"
      >
        <div style={{ transform: "translateZ(30px)" }} className="text-center">
          <div className="font-bold text-sm text-white">PARALLAX TILT</div>
          <div className="text-[10px] text-accent-cyan">Move cursor here</div>
        </div>
      </motion.div>
    </div>
  );
}
