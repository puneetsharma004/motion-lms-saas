import LessonCard from "@/components/lesson/LessonCard";
import { getLessonsByCategory } from "@/lib/content";

export const metadata = {
  title: "Lessons — Motion Playground",
};

export default function LearnIndexPage() {
  const groups = getLessonsByCategory();

  return (
    <div className="px-gutter py-10 max-w-5xl">
      <h1 className="text-3xl font-bold text-white mb-2">Course overview</h1>
      <p className="text-on-surface-variant text-sm mb-10 max-w-2xl">
        Work through each lesson in the live sandbox: read the concept, edit the{" "}
        <span className="text-primary">Practice</span> file, watch it animate,
        then compare against the <span className="text-primary">Solution</span>.
      </p>

      {groups.map((group) => (
        <section key={group.category} className="mb-10">
          <h2 className="font-label-caps text-xs uppercase tracking-widest text-on-surface-variant/70 mb-4">
            {group.category}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {group.lessons.map((lesson) => (
              <LessonCard key={lesson.slug} lesson={lesson} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
