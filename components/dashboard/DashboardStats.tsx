"use client";

import Link from "next/link";
import { ArrowRight, CheckCircle2, Circle, Trophy } from "lucide-react";
import { useProgress } from "@/lib/useProgress";

export interface DashLesson {
  slug: string;
  title: string;
  summary: string;
  category: string;
}

/**
 * Renders the dashboard numbers from the **union** of the server's DB snapshot
 * (`initialCompleted`) and the client's localStorage (`useProgress`). The DB
 * write on completion is fire-and-forget, so right after finishing a lesson the
 * DB can be one behind — localStorage is the instant source of truth, so the
 * union always reflects what the learner actually did. First render uses only
 * `initialCompleted` (matches SSR → no hydration mismatch), then localStorage
 * merges in on mount.
 */
export default function DashboardStats({
  lessons,
  initialCompleted,
}: {
  lessons: DashLesson[];
  initialCompleted: string[];
}) {
  const { completed } = useProgress();

  const done = new Set<string>(initialCompleted);
  for (const [slug, isDone] of Object.entries(completed)) {
    if (isDone) done.add(slug);
  }

  const total = lessons.length;
  const completedCount = lessons.filter((l) => done.has(l.slug)).length;
  const pct = total ? Math.round((completedCount / total) * 100) : 0;
  const next = lessons.find((l) => !done.has(l.slug)) ?? null;

  // Group by category, preserving lesson order.
  const groups: { category: string; lessons: DashLesson[] }[] = [];
  for (const l of lessons) {
    let g = groups.find((x) => x.category === l.category);
    if (!g) {
      g = { category: l.category, lessons: [] };
      groups.push(g);
    }
    g.lessons.push(l);
  }

  const R = 52;
  const CIRC = 2 * Math.PI * R;

  return (
    <>
      <p className="text-sm text-on-surface-variant mb-8">
        {completedCount === total
          ? "You've completed every lesson. Legend."
          : `${total - completedCount} lesson${total - completedCount === 1 ? "" : "s"} left to master Motion.`}
      </p>

      {/* Overview: ring + continue */}
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-5 mb-10">
        <div className="glass-card rounded-2xl border border-white/10 p-6 flex items-center gap-5">
          <div className="relative w-[120px] h-[120px] shrink-0">
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r={R} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="8" />
              <circle
                cx="60"
                cy="60"
                r={R}
                fill="none"
                stroke="var(--color-primary)"
                strokeWidth="8"
                strokeLinecap="round"
                strokeDasharray={CIRC}
                strokeDashoffset={CIRC - (pct / 100) * CIRC}
                transform="rotate(-90 60 60)"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-white tabular-nums">{pct}%</span>
              <span className="text-[10px] uppercase tracking-widest text-on-surface-variant/70">
                done
              </span>
            </div>
          </div>
          <div>
            <p className="text-3xl font-bold text-white tabular-nums">
              {completedCount}
              <span className="text-on-surface-variant/50">/{total}</span>
            </p>
            <p className="text-sm text-on-surface-variant">lessons completed</p>
          </div>
        </div>

        <div className="glass-card rounded-2xl border border-white/10 p-6 flex flex-col justify-center">
          {next ? (
            <>
              <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant/70 mb-1">
                Continue where you left off
              </span>
              <h2 className="text-lg font-bold text-white mb-1">{next.title}</h2>
              <p className="text-sm text-on-surface-variant mb-4">{next.summary}</p>
              <Link
                href={`/learn/${next.slug}`}
                className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm font-bold hover:shadow-[0_0_24px_rgba(208,188,255,0.35)] transition-all"
              >
                Resume lesson <ArrowRight size={16} />
              </Link>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Trophy size={28} className="text-accent-amber" />
              <div>
                <h2 className="text-lg font-bold text-white">Course complete 🎉</h2>
                <p className="text-sm text-on-surface-variant">
                  Every lesson done. Revisit any time, or wait for new projects.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Per-category breakdown */}
      <div className="space-y-8">
        {groups.map((group) => {
          const gTotal = group.lessons.length;
          const gDone = group.lessons.filter((l) => done.has(l.slug)).length;
          const gPct = gTotal ? Math.round((gDone / gTotal) * 100) : 0;
          return (
            <section key={group.category}>
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant/70">
                  {group.category}
                </h3>
                <span className="text-[11px] text-on-surface-variant tabular-nums">
                  {gDone}/{gTotal}
                </span>
              </div>
              <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden mb-3">
                <div className="h-full rounded-full bg-primary" style={{ width: `${gPct}%` }} />
              </div>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {group.lessons.map((lesson) => {
                  const isDone = done.has(lesson.slug);
                  return (
                    <li key={lesson.slug}>
                      <Link
                        href={`/learn/${lesson.slug}`}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-lg border border-white/5 bg-white/[0.02] hover:bg-white/5 transition-colors"
                      >
                        {isDone ? (
                          <CheckCircle2 size={15} className="shrink-0 text-accent-lime" />
                        ) : (
                          <Circle size={15} className="shrink-0 text-on-surface-variant/40" />
                        )}
                        <span className={`text-sm truncate ${isDone ? "text-on-surface-variant" : "text-white"}`}>
                          {lesson.title}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          );
        })}
      </div>
    </>
  );
}
