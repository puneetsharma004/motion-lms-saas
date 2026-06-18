"use server";

import { revalidatePath } from "next/cache";
import { getUser } from "@/lib/supabase/server";
import { isAdminUser } from "@/lib/admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { grantEntitlement } from "@/lib/entitlements";
import { PRODUCT } from "@/lib/plans";

/** Re-check admin inside every action (server actions aren't covered by page gates). */
async function ensureAdmin() {
  const user = await getUser();
  if (!(await isAdminUser(user))) throw new Error("Not authorized");
  return createAdminClient();
}

export async function grantAccess(formData: FormData) {
  const admin = await ensureAdmin();
  if (!admin) return;
  const userId = String(formData.get("userId") ?? "");
  const months = Number(formData.get("months") ?? 0);
  if (!userId || !months) return;
  await grantEntitlement(admin, userId, PRODUCT, months, "admin");
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function revokeAccess(formData: FormData) {
  const admin = await ensureAdmin();
  if (!admin) return;
  const userId = String(formData.get("userId") ?? "");
  if (!userId) return;
  await admin.from("entitlements").delete().eq("user_id", userId).eq("product", PRODUCT);
  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function createCoupon(formData: FormData) {
  const admin = await ensureAdmin();
  if (!admin) return;
  const code = String(formData.get("code") ?? "").trim().toUpperCase();
  const kind = String(formData.get("kind") ?? "free_months");
  const value = Number(formData.get("value") ?? 0);
  const maxRaw = String(formData.get("max_redemptions") ?? "").trim();
  if (!code || !value) return;
  await admin.from("coupons").insert({
    code,
    kind,
    value,
    max_redemptions: maxRaw ? Number(maxRaw) : null,
    active: true,
  });
  revalidatePath("/admin/coupons");
}

export async function toggleCoupon(formData: FormData) {
  const admin = await ensureAdmin();
  if (!admin) return;
  const code = String(formData.get("code") ?? "");
  const active = String(formData.get("active") ?? "") === "1";
  if (!code) return;
  await admin.from("coupons").update({ active }).eq("code", code);
  revalidatePath("/admin/coupons");
}
