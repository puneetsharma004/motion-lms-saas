import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getUser, createClient } from "@/lib/supabase/server";

/** Admins are identified by an email allowlist (env) OR profiles.is_admin (DB). */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

/** Async admin check: email allowlist first (cheap), then the DB is_admin flag. */
export async function isAdminUser(user: User | null): Promise<boolean> {
  if (!user) return false;
  const email = user.email?.toLowerCase();
  if (email && adminEmails().includes(email)) return true;

  // DB fallback — the user can read their own profile row via RLS.
  const supabase = await createClient();
  if (!supabase) return false;
  const { data } = await supabase
    .from("profiles")
    .select("is_admin")
    .eq("id", user.id)
    .maybeSingle();
  return Boolean(data?.is_admin);
}

/** For admin pages: returns the admin user, or redirects away. */
export async function requireAdmin(): Promise<User> {
  const user = await getUser();
  if (!(await isAdminUser(user))) redirect("/");
  return user as User;
}
