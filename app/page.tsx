import Navbar from "@/components/common/Navbar";
import Hero from "@/components/common/Hero";
import Footer from "@/components/common/Footer";
import LessonCard from "@/components/lesson/LessonCard";
import { getAllLessonMeta } from "@/lib/content";

export default function Home() {
  const lessons = getAllLessonMeta();

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <section className="max-w-[1280px] mx-auto px-gutter py-12">
          <h2 className="text-2xl font-bold text-white mb-6">What you will build</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {lessons.map((lesson) => (
              <LessonCard key={lesson.slug} lesson={lesson} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
