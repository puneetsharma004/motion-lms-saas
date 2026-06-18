import { NextResponse } from "next/server";
import crypto from "node:crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlan } from "@/lib/plans";
import { grantEntitlement } from "@/lib/entitlements";

const WEBHOOK_SECRET = process.env.RAZORPAY_WEBHOOK_SECRET;

/**
 * Razorpay webhook. Verifies the HMAC signature, then on a captured payment
 * grants/extends the buyer's entitlement (idempotently). This is the ONLY place
 * paid access is granted, using the service role.
 */
export async function POST(req: Request) {
  if (!WEBHOOK_SECRET) {
    return NextResponse.json({ error: "Webhook not configured" }, { status: 503 });
  }

  const raw = await req.text();
  const signature = req.headers.get("x-razorpay-signature") ?? "";
  const expected = crypto
    .createHmac("sha256", WEBHOOK_SECRET)
    .update(raw)
    .digest("hex");

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expected);
  if (sigBuf.length !== expBuf.length || !crypto.timingSafeEqual(sigBuf, expBuf)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  const event = JSON.parse(raw);
  if (event.event !== "payment.captured" && event.event !== "order.paid") {
    return NextResponse.json({ received: true });
  }

  const orderId: string | undefined =
    event.payload?.payment?.entity?.order_id ?? event.payload?.order?.entity?.id;
  if (!orderId) return NextResponse.json({ received: true });

  const admin = createAdminClient();
  if (!admin) {
    return NextResponse.json({ error: "Service role missing" }, { status: 503 });
  }

  const { data: purchase } = await admin
    .from("purchases")
    .select("user_id, product, plan_id, status")
    .eq("provider_ref", orderId)
    .maybeSingle();

  if (!purchase) return NextResponse.json({ received: true });
  if (purchase.status === "paid") return NextResponse.json({ received: true }); // idempotent

  const months = getPlan(purchase.plan_id)?.months ?? 1;

  await grantEntitlement(admin, purchase.user_id, purchase.product, months, "purchase");

  await admin
    .from("purchases")
    .update({ status: "paid" })
    .eq("provider_ref", orderId);

  return NextResponse.json({ received: true });
}
