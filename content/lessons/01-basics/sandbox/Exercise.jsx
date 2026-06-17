// PRACTICE — Basic Animations
//
// Right now this box uses a clunky CSS transition. Upgrade it to Motion:
//   1. import { motion } from "motion/react"
//   2. turn the <div> into a <motion.div>
//   3. drive it with the `animate` prop and add a `transition`
//
// (Flip to the Solution tab if you get stuck.)

export default function Exercise({ opacity, x, y, scale, rotate }) {
  return (
    <div
      className="w-24 h-24 bg-accent-blue rounded-xl"
      style={{
        opacity,
        transform: `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`,
        transition: "transform 0.1s, opacity 0.1s",
      }}
    />
  );
}
