"use client";

import { motion, useScroll, useSpring } from "motion/react";

/**
 * Fixed reading-progress bar that fills as you scroll the page. Built with
 * Motion's useScroll + useSpring (dogfooding the library the course teaches).
 * Styled via `.progress-bar-fixed` in globals.css; the accent overrides its color.
 */
export default function ReadingProgress({ accent = "primary" }: { accent?: string }) {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    mass: 0.3,
  });

  const background =
    accent === "primary"
      ? "var(--color-primary)"
      : `var(--color-accent-${accent})`;

  return (
    <motion.div
      className="progress-bar-fixed"
      style={{ scaleX, background }}
      aria-hidden
    />
  );
}
