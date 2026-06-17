import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { LessonMeta } from "@/lib/content";

export default function LessonCard({ lesson }: { lesson: LessonMeta }) {
  return (
    <Link
      href={`/learn/${lesson.slug}`}
      className="glass-card rounded-xl border border-white/10 p-5 flex flex-col gap-3 group"
    >
      <div className="flex items-center justify-between">
        <span
          className="font-label-caps text-[10px] uppercase tracking-widest font-bold"
          style={{ color: `var(--color-accent-${lesson.accent})` }}
        >
          {String(lesson.order).padStart(2, "0")}
        </span>
        <ArrowUpRight
          size={16}
          className="text-on-surface-variant group-hover:text-white transition-colors"
        />
      </div>
      <h3 className="font-bold text-white text-base">{lesson.title}</h3>
      <p className="text-xs text-on-surface-variant leading-relaxed flex-grow">
        {lesson.summary}
      </p>
      {lesson.duration && (
        <span className="text-[10px] text-on-surface-variant/70">
          {lesson.duration}
        </span>
      )}
    </Link>
  );
}
