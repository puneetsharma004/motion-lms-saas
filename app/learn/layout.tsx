import Navbar from "@/components/common/Navbar";
import Sidebar from "@/components/course/Sidebar";
import MobileSidebar from "@/components/course/MobileSidebar";
import { getLessonsByCategory, isLessonFree } from "@/lib/content";
import { getUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export default async function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const groups = getLessonsByCategory().map((g) => ({
    category: g.category,
    lessons: g.lessons.map((l) => ({
      slug: l.slug,
      title: l.title,
      accent: l.accent,
      free: isLessonFree(l),
    })),
  }));

  // Lock icons appear on gated lessons only while gating is active.
  const user = isSupabaseConfigured ? await getUser() : null;
  const locked = isSupabaseConfigured && !user;

  return (
    <>
      <Navbar />
      <div className="max-w-[1280px] mx-auto w-full flex flex-1">
        <aside className="hidden lg:block w-64 shrink-0 border-r border-white/10 p-4 sticky top-[64px] h-[calc(100vh-64px)] overflow-y-auto">
          <Sidebar groups={groups} locked={locked} />
        </aside>
        <main className="flex-1 min-w-0">
          <MobileSidebar groups={groups} locked={locked} />
          {children}
        </main>
      </div>
    </>
  );
}
