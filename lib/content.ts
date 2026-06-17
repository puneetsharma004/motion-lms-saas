import "server-only";
import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

const LESSONS_DIR = path.join(process.cwd(), "content", "lessons");

export interface LessonMeta {
  /** URL slug, e.g. "basics". */
  slug: string;
  /** Folder name on disk, e.g. "01-basics". */
  dir: string;
  title: string;
  order: number;
  /** Accent token, e.g. "blue" | "violet" (see globals.css). */
  accent: string;
  /** Grouping for the sidebar, e.g. "Fundamentals". */
  category: string;
  summary: string;
  duration?: string;
}

export interface Lesson {
  meta: LessonMeta;
  /** MDX body (frontmatter stripped). */
  content: string;
  /** Editable "Practice" files for the sandbox. */
  starter: Record<string, string>;
  /** Reference "Solution" files for the sandbox. */
  solution: Record<string, string>;
}

function listLessonDirs(): string[] {
  if (!fs.existsSync(LESSONS_DIR)) return [];
  return fs
    .readdirSync(LESSONS_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);
}

function readMeta(dir: string): LessonMeta {
  const raw = JSON.parse(
    fs.readFileSync(path.join(LESSONS_DIR, dir, "meta.json"), "utf8"),
  );
  return { dir, slug: raw.slug ?? dir, ...raw };
}

/** Map every file in `dir` to `{ "/<filename>": contents }`. Non-recursive. */
function readDirFiles(dir: string): Record<string, string> {
  if (!fs.existsSync(dir)) return {};
  const out: Record<string, string> = {};
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (entry.isFile()) {
      out[`/${entry.name}`] = fs.readFileSync(path.join(dir, entry.name), "utf8");
    }
  }
  return out;
}

/**
 * Lessons with `order <= FREE_LESSON_COUNT` are open to everyone; the rest
 * require a (free) account. Change this one number to widen/narrow the free tier.
 */
export const FREE_LESSON_COUNT = 3;

/** Whether a lesson is in the free tier (no account required). */
export function isLessonFree(meta: Pick<LessonMeta, "order">): boolean {
  return meta.order <= FREE_LESSON_COUNT;
}

export function getAllLessonMeta(): LessonMeta[] {
  return listLessonDirs()
    .map(readMeta)
    .sort((a, b) => a.order - b.order);
}

/** Lessons grouped by category, preserving order, for the sidebar. */
export function getLessonsByCategory(): { category: string; lessons: LessonMeta[] }[] {
  const groups: { category: string; lessons: LessonMeta[] }[] = [];
  for (const meta of getAllLessonMeta()) {
    let group = groups.find((g) => g.category === meta.category);
    if (!group) {
      group = { category: meta.category, lessons: [] };
      groups.push(group);
    }
    group.lessons.push(meta);
  }
  return groups;
}

export function getLesson(slug: string): Lesson | null {
  const dir = listLessonDirs().find((d) => readMeta(d).slug === slug);
  if (!dir) return null;

  const meta = readMeta(dir);
  const lessonDir = path.join(LESSONS_DIR, dir);

  const { content } = matter(
    fs.readFileSync(path.join(lessonDir, "lesson.mdx"), "utf8"),
  );

  const starter = readDirFiles(path.join(lessonDir, "sandbox"));
  // Solution = sandbox harness with reference files layered on top.
  const solution = { ...starter, ...readDirFiles(path.join(lessonDir, "solution")) };

  return { meta, content, starter, solution };
}
