import Link from "next/link";
import { redirect } from "next/navigation";
import { Sparkles } from "lucide-react";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import LoginForm from "@/components/auth/LoginForm";
import { getUser } from "@/lib/supabase/server";

export const metadata = {
  title: "Sign in — Motion Playground",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>;
}) {
  const { next = "/learn", error } = await searchParams;

  // Already signed in? Skip the form.
  const user = await getUser();
  if (user) redirect(next);

  return (
    <>
      <Navbar />
      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-sm glass-card rounded-2xl border border-white/10 p-8">
          <div className="flex items-center gap-2 mb-1.5 text-primary">
            <Sparkles size={16} />
            <span className="font-label-caps text-[10px] uppercase tracking-widest">
              Motion Playground
            </span>
          </div>
          <h1 className="text-xl font-bold text-white mb-1">Sign in to continue</h1>
          <p className="text-sm text-on-surface-variant mb-6">
            Free account — unlocks the full course and saves your progress across
            devices.
          </p>

          {error && (
            <p className="mb-4 text-xs text-error bg-error-container/30 border border-error/30 rounded-lg px-3 py-2">
              Something went wrong signing you in. Please try again.
            </p>
          )}

          <LoginForm next={next} />

          <p className="mt-6 text-xs text-on-surface-variant/70 text-center">
            Lessons 1–3 are free without an account.{" "}
            <Link href="/learn" className="text-primary hover:text-white transition-colors">
              Browse lessons
            </Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
