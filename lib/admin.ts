import "server-only";
import { redirect } from "next/navigation";
import type { User } from "@supabase/supabase-js";
import { getUser } from "@/lib/supabase/server";

/** Admins are identified by an allowlist of emails (comma-separated env var). */
export function adminEmails(): string[] {
  return (process.env.ADMIN_EMAILS ?? "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
}

export function isAdmin(user: User | null): boolean {
  const email = user?.email?.toLowerCase();
  return Boolean(email && adminEmails().includes(email));
}

/** For admin pages: returns the admin user, or redirects away. */
export async function requireAdmin(): Promise<User> {
  const user = await getUser();
  if (!isAdmin(user)) redirect("/");
  return user as User;
}
