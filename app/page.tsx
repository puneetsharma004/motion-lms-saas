import { redirect } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Hero from "@/components/common/Hero";
import Footer from "@/components/common/Footer";
import LessonCard from "@/components/lesson/LessonCard";
import { getAllLessonMeta } from "@/lib/content";
import { createClient } from "@/lib/supabase/server";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ code?: string }>;
}) {
  // Resilience for auth redirects that land on "/" (e.g. Supabase falling back
  // to the Site URL instead of /auth/callback): exchange the code here too.
  const { code } = await searchParams;
  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) redirect("/learn");
    }
    redirect("/login?error=auth");
  }

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
