import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";

/** Add `months` to the later of (now, current expiry) — access stacks. */
export function addMonths(currentExpiry: string | null, months: number): string {
  const now = new Date();
  const base =
    currentExpiry && new Date(currentExpiry) > now ? new Date(currentExpiry) : now;
  base.setMonth(base.getMonth() + months);
  return base.toISOString();
}

/**
 * Grant or extend a user's product entitlement by `months`, using a service-role
 * client (the only role allowed to write entitlements). Returns the new expiry.
 */
export async function grantEntitlement(
  admin: SupabaseClient,
  userId: string,
  product: string,
  months: number,
  source: string,
): Promise<string> {
  const { data: ent } = await admin
    .from("entitlements")
    .select("expires_at")
    .eq("user_id", userId)
    .eq("product", product)
    .maybeSingle();

  const expires = addMonths((ent?.expires_at as string) ?? null, months);

  await admin.from("entitlements").upsert({
    user_id: userId,
    product,
    expires_at: expires,
    source,
    updated_at: new Date().toISOString(),
  });

  return expires;
}
