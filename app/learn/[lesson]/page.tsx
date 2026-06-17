import Link from "next/link";
import { notFound } from "next/navigation";
import { MDXRemote } from "next-mdx-remote/rsc";
import { ChevronLeft, ChevronRight, BookOpen, Code2 } from "lucide-react";
import { getAllLessonMeta, getLesson, isLessonFree } from "@/lib/content";
import { mdxComponents } from "@/components/lesson/mdx-components";
import Sandbox from "@/components/sandbox/Sandbox";
import CompletionToggle from "@/components/lesson/CompletionToggle";
import ReadingProgress from "@/components/common/ReadingProgress";
import LessonLocked from "@/components/lesson/LessonLocked";
import { getUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export function generateStaticParams() {
  return getAllLessonMeta().map((m) => ({ lesson: m.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const { lesson: slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) return {};
  return { title: `${lesson.meta.title} — Motion Playground` };
}

export default async function LessonPage({
  params,
}: {
  params: Promise<{ lesson: string }>;
}) {
  const { lesson: slug } = await params;
  const lesson = getLesson(slug);
  if (!lesson) notFound();

  const all = getAllLessonMeta();
  const index = all.findIndex((m) => m.slug === slug);
  const prev = index > 0 ? all[index - 1] : null;
  const next = index < all.length - 1 ? all[index + 1] : null;

  const accentVar = `var(--color-accent-${lesson.meta.accent})`;

  // Gate non-free lessons behind a (free) account — only when auth is set up.
  const user = isSupabaseConfigured ? await getUser() : null;
  const locked = isSupabaseConfigured && !user && !isLessonFree(lesson.meta);

  return (
    <article className="max-w-5xl mx-auto px-gutter py-10">
      <ReadingProgress accent={lesson.meta.accent} />
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <span
          className="font-label-caps text-xs tracking-widest uppercase font-bold"
          style={{ color: accentVar }}
        >
          {lesson.meta.category}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-white">
          {lesson.meta.title}
        </h1>
        <div className="h-px bg-white/10 flex-grow" />
        {!locked && <CompletionToggle slug={lesson.meta.slug} />}
      </div>

      {locked ? (
        <LessonLocked
          slug={lesson.meta.slug}
          summary={lesson.meta.summary}
          accent={lesson.meta.accent}
        />
      ) : (
        <>
          {/* 1. TEACH — full-width, readable line length */}
          <section>
            <div className="flex items-center gap-2 mb-4 text-on-surface-variant">
              <BookOpen size={16} style={{ color: accentVar }} />
              <span className="font-label-caps text-xs uppercase tracking-widest">
                Lesson
              </span>
            </div>
            <div className="prose-lesson max-w-3xl">
              <MDXRemote source={lesson.content} components={mdxComponents} />
            </div>
          </section>

          {/* 2. PRACTICE — full-width sandbox below the lesson */}
          <section className="mt-12 pt-8 border-t border-white/10">
            <div className="flex items-center gap-2 mb-2 text-on-surface-variant">
              <Code2 size={16} style={{ color: accentVar }} />
              <span className="font-label-caps text-xs uppercase tracking-widest">
                Practice
              </span>
            </div>
            <p className="text-sm text-on-surface-variant mb-5 max-w-2xl">
              Edit <code className="text-primary bg-white/5 px-1.5 py-0.5 rounded text-xs">Exercise.jsx</code>{" "}
              and watch the live preview update. Stuck? Switch to{" "}
              <span className="text-primary">Solution</span> to see the answer.
            </p>
            <Sandbox
              slug={lesson.meta.slug}
              starter={lesson.starter}
              solution={lesson.solution}
              accent={lesson.meta.accent}
            />
          </section>
        </>
      )}

      {/* Prev / Next */}
      <nav className="flex justify-between items-center mt-12 pt-6 border-t border-white/10">
        {prev ? (
          <Link
            href={`/learn/${prev.slug}`}
            className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-white transition-colors"
          >
            <ChevronLeft size={16} />
            <span>{prev.title}</span>
          </Link>
        ) : (
          <span />
        )}
        {next ? (
          <Link
            href={`/learn/${next.slug}`}
            className="flex items-center gap-2 text-sm text-on-surface-variant hover:text-white transition-colors"
          >
            <span>{next.title}</span>
            <ChevronRight size={16} />
          </Link>
        ) : (
          <span />
        )}
      </nav>
    </article>
  );
}
