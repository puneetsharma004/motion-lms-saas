"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { ArrowRight } from "lucide-react";

const badges = [
  "10+ Interactive Lessons",
  "In-browser code editor",
  "Live preview",
];

export default function Hero() {
  return (
    <section className="relative min-h-[72vh] flex flex-col justify-center items-center pt-[80px] z-10 text-center px-4 max-w-[1280px] mx-auto space-y-stack-lg">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="flex flex-wrap justify-center gap-2 mb-2"
      >
        {badges.map((b) => (
          <span
            key={b}
            className="px-3.5 py-1 rounded-full bg-white/5 border border-white/10 font-label-caps text-[10px] uppercase tracking-wider text-on-surface-variant backdrop-blur-md"
          >
            {b}
          </span>
        ))}
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.05 }}
        className="font-display-lg text-4xl md:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-white to-on-surface-variant leading-tight"
      >
        Master Framer Motion
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.12 }}
        className="font-body-lg text-sm md:text-lg text-on-surface-variant max-w-2xl mx-auto leading-relaxed"
      >
        Learn modern Motion (motion.dev) hands-on. Edit real code in the browser,
        watch it animate instantly, and build production-ready UI interactions.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.18 }}
        className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4"
      >
        <Link
          href="/learn"
          className="px-8 py-4 bg-primary text-[#3c0091] font-bold text-sm rounded-full hover:shadow-[0_0_30px_rgba(208,188,255,0.4)] hover:scale-105 transition-all duration-300 flex items-center gap-2"
        >
          Start learning
          <ArrowRight size={16} />
        </Link>
      </motion.div>
    </section>
  );
}
