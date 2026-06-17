"use client";

import { CheckCircle2 } from "lucide-react";
import { useProgress } from "@/lib/useProgress";

/**
 * Phase 1: progress in localStorage (parity with the original prototype).
 * Phase 3 replaces this with a DB-backed, auth-aware toggle.
 *
 * Backed by the shared {@link useProgress} hook so marking a lesson done
 * instantly updates the course progress bar in the sidebar.
 */
export default function CompletionToggle({ slug }: { slug: string }) {
  const { completed, toggle } = useProgress();
  const done = Boolean(completed[slug]);

  return (
    <button
      onClick={() => toggle(slug)}
      className={`flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs cursor-pointer transition-all shrink-0 ${
        done
          ? "bg-accent-lime/20 border-accent-lime text-accent-lime"
          : "border-white/10 bg-white/5 text-on-surface-variant hover:text-white"
      }`}
    >
      <CheckCircle2 size={14} />
      <span>{done ? "Completed" : "Mark Done"}</span>
    </button>
  );
}
