import Link from "next/link";
import { ArrowUpRight, LogOut } from "lucide-react";
import { getUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { isAdminUser } from "@/lib/admin";
import MobileNav from "@/components/common/MobileNav";

export default async function Navbar() {
  // Only hits cookies (and goes dynamic) when Supabase is configured.
  const user = isSupabaseConfigured ? await getUser() : null;
  const admin = await isAdminUser(user);

  return (
    <header className="bg-surface-container/60 backdrop-blur-xl sticky top-0 w-full z-50 border-b border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
      <div className="flex justify-between items-center px-gutter h-[64px] max-w-[1280px] mx-auto">
        <Link
          href="/"
          className="font-headline-md text-lg md:text-xl font-extrabold text-on-surface tracking-tighter hover:text-primary transition-colors"
        >
          Motion Playground
        </Link>

        {/* Desktop nav */}
        <div className="hidden sm:flex items-center gap-3">
          <Link
            href="/learn"
            className="text-on-surface-variant hover:text-white text-sm transition-colors"
          >
            Lessons
          </Link>
          <Link
            href="/pricing"
            className="text-on-surface-variant hover:text-white text-sm transition-colors"
          >
            Pricing
          </Link>

          {isSupabaseConfigured &&
            (user ? (
              <div className="flex items-center gap-3">
                <Link
                  href="/dashboard"
                  className="text-on-surface-variant hover:text-white text-sm transition-colors"
                >
                  Dashboard
                </Link>
                {admin && (
                  <Link
                    href="/admin"
                    className="text-primary hover:text-white text-sm transition-colors"
                  >
                    Admin
                  </Link>
                )}
                <span className="text-xs text-on-surface-variant max-w-[140px] truncate">
                  {user.email}
                </span>
                <form action="/auth/signout" method="post">
                  <button
                    type="submit"
                    title="Sign out"
                    className="flex items-center gap-1.5 text-on-surface-variant hover:text-white text-xs border border-white/10 bg-white/5 px-3 py-1.5 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
                  >
                    <LogOut size={13} />
                    <span>Sign out</span>
                  </button>
                </form>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-on-surface-variant hover:text-white text-sm transition-colors"
              >
                Sign in
              </Link>
            ))}

          <a
            href="https://motion.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-xs md:text-sm border border-primary/30 bg-primary/10 px-4 py-2 rounded-full hover:bg-primary/20 transition-colors flex items-center gap-1.5"
          >
            <span>motion.dev</span>
            <ArrowUpRight size={14} />
          </a>
        </div>

        {/* Mobile nav */}
        <MobileNav
          email={user?.email ?? null}
          isConfigured={isSupabaseConfigured}
          isAdmin={admin}
        />
      </div>
    </header>
  );
}
