import "server-only";
import type { User } from "@supabase/supabase-js";
import { createClient, getUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { PRODUCT } from "@/lib/plans";

/**
 * Does the current user have active (non-expired) access to `product`?
 *
 * - Supabase not configured → open local playground, always true.
 * - No user / no entitlement / expired → false.
 *
 * Pass an already-fetched `user` to avoid a duplicate auth round-trip.
 */
export async function hasAccess(
  product: string = PRODUCT,
  user?: User | null,
): Promise<boolean> {
  if (!isSupabaseConfigured) return true;

  const u = user ?? (await getUser());
  if (!u) return false;

  const supabase = await createClient();
  if (!supabase) return false;

  const { data } = await supabase
    .from("entitlements")
    .select("expires_at")
    .eq("user_id", u.id)
    .eq("product", product)
    .maybeSingle();

  if (!data) return false;
  return new Date(data.expires_at as string).getTime() > Date.now();
}
