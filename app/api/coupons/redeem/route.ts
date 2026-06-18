import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { grantEntitlement } from "@/lib/entitlements";
import { PRODUCT } from "@/lib/plans";

/**
 * Redeem a `free_months` coupon → instantly grant/extend access, no payment.
 * (Percent/fixed coupons are applied at checkout instead.)
 *
 * Order matters: we insert the redemption FIRST so the unique index
 * (coupon_redemptions_unique_user_coupon) atomically blocks double-redeems
 * before we grant anything.
 */
export async function POST(req: Request) {
  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Please sign in first." }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Coupons aren't available right now." }, { status: 503 });
  }

  let raw: string;
  try {
    ({ code: raw } = await req.json());
  } catch {
    return NextResponse.json({ error: "Bad request." }, { status: 400 });
  }
  const code = (raw ?? "").trim().toUpperCase();
  if (!code) {
    return NextResponse.json({ error: "Enter a coupon code." }, { status: 400 });
  }

  const { data: coupon } = await admin
    .from("coupons")
    .select("code, kind, value, products, max_redemptions, redeemed_count, expires_at, active")
    .eq("code", code)
    .maybeSingle();

  if (!coupon || !coupon.active) {
    return NextResponse.json({ error: "Invalid coupon code." }, { status: 404 });
  }
  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    return NextResponse.json({ error: "This coupon has expired." }, { status: 400 });
  }
  if (
    coupon.max_redemptions != null &&
    coupon.redeemed_count >= coupon.max_redemptions
  ) {
    return NextResponse.json({ error: "This coupon has reached its limit." }, { status: 400 });
  }
  const products: string[] = coupon.products ?? [];
  if (products.length && !products.includes(PRODUCT)) {
    return NextResponse.json({ error: "This coupon isn't valid here." }, { status: 400 });
  }
  if (coupon.kind !== "free_months") {
    return NextResponse.json(
      { error: "Apply this coupon at checkout." },
      { status: 400 },
    );
  }

  // Claim the redemption first — unique index blocks a second use by this user.
  const { error: claimError } = await admin
    .from("coupon_redemptions")
    .insert({ coupon_code: code, user_id: user.id });
  if (claimError) {
    return NextResponse.json(
      { error: "You've already used this coupon." },
      { status: 400 },
    );
  }

  const months = coupon.value;
  const expiresAt = await grantEntitlement(admin, user.id, PRODUCT, months, "coupon");
  await admin
    .from("coupons")
    .update({ redeemed_count: coupon.redeemed_count + 1 })
    .eq("code", code);

  return NextResponse.json({ ok: true, months, expiresAt });
}
