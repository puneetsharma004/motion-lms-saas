"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Check, Lock } from "lucide-react";
import { useProgress } from "@/lib/useProgress";
import CourseProgress from "@/components/course/CourseProgress";

export interface SidebarLesson {
  slug: string;
  title: string;
  accent: string;
  /** Free tier (no account needed). Defaults to true when omitted. */
  free?: boolean;
}

export interface SidebarGroup {
  category: string;
  lessons: SidebarLesson[];
}

export default function Sidebar({
  groups,
  locked = false,
}: {
  groups: SidebarGroup[];
  /** Gating is active (Supabase configured + signed out): lock gated lessons. */
  locked?: boolean;
}) {
  const pathname = usePathname();
  const { completed } = useProgress();
  const slugs = groups.flatMap((group) => group.lessons.map((l) => l.slug));

  return (
    <nav className="text-sm">
      <Link
        href="/learn"
        className={`block px-3 py-2 rounded-lg mb-4 font-semibold transition-colors ${
          pathname === "/learn"
            ? "bg-white/10 text-white"
            : "text-on-surface-variant hover:text-white hover:bg-white/5"
        }`}
      >
        Course overview
      </Link>

      <CourseProgress slugs={slugs} />

      {groups.map((group) => (
        <div key={group.category} className="mb-6">
          <p className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant/70 px-3 mb-2">
            {group.category}
          </p>
          <ul className="space-y-0.5">
            {group.lessons.map((lesson) => {
              const href = `/learn/${lesson.slug}`;
              const active = pathname === href;
              const done = Boolean(completed[lesson.slug]);
              const isLocked = locked && lesson.free === false;
              return (
                <li key={lesson.slug}>
                  <Link
                    href={href}
                    className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg transition-colors ${
                      active
                        ? "bg-white/10 text-white"
                        : "text-on-surface-variant hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <span className="flex w-4 shrink-0 items-center justify-center">
                      {done ? (
                        <Check size={14} className="text-accent-lime" />
                      ) : (
                        <span
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: `var(--color-accent-${lesson.accent})` }}
                        />
                      )}
                    </span>
                    <span className={`truncate flex-1 ${done && !active ? "text-on-surface-variant/70" : ""}`}>
                      {lesson.title}
                    </span>
                    {isLocked && (
                      <Lock size={12} className="shrink-0 text-on-surface-variant/40" />
                    )}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
