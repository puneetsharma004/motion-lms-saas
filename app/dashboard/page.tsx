import { redirect } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { getAllLessonMeta } from "@/lib/content";
import { getUser, createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import DashboardStats from "@/components/dashboard/DashboardStats";

export const metadata = { title: "Dashboard — Motion Playground" };

export default async function DashboardPage() {
  // Dashboard only exists when auth is configured + the user is signed in.
  if (!isSupabaseConfigured) redirect("/learn");
  const user = await getUser();
  if (!user) redirect("/login?next=/dashboard");

  const supabase = await createClient();
  const { data } = await supabase!
    .from("lesson_progress")
    .select("lesson_slug")
    .eq("user_id", user.id);
  const initialCompleted = ((data ?? []) as { lesson_slug: string }[]).map(
    (r) => r.lesson_slug,
  );

  const lessons = getAllLessonMeta().map((l) => ({
    slug: l.slug,
    title: l.title,
    summary: l.summary,
    category: l.category,
  }));

  const name = user.email?.split("@")[0] ?? "there";

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-gutter py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
          Welcome back, {name}
        </h1>
        <DashboardStats lessons={lessons} initialCompleted={initialCompleted} />
      </main>
      <Footer />
    </>
  );
}
