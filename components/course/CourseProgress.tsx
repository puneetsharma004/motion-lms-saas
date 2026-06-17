"use client";

import { useProgress } from "@/lib/useProgress";

/**
 * Course completion meter for the sidebar. Reads the shared completion map and
 * renders the share of lessons marked done. Updates live as the learner toggles
 * the "Mark Done" button on a lesson.
 */
export default function CourseProgress({ slugs }: { slugs: string[] }) {
  const { completed } = useProgress();

  const total = slugs.length;
  const done = slugs.filter((slug) => completed[slug]).length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);

  return (
    <div className="px-3 mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant/70">
          Your progress
        </span>
        <span className="text-[11px] font-semibold text-primary tabular-nums">
          {done}/{total}
        </span>
      </div>

      <div
        className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden"
        role="progressbar"
        aria-valuenow={pct}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`${pct}% of lessons completed`}
      >
        <div
          className="h-full rounded-full bg-primary transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>

      <p className="mt-1.5 text-[10px] text-on-surface-variant/60">
        {pct === 100 ? "Course complete 🎉" : `${pct}% complete`}
      </p>
    </div>
  );
}
