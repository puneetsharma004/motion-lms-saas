import { NextResponse } from "next/server";
import { getUser } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPlan, PRODUCT } from "@/lib/plans";

const KEY_ID = process.env.RAZORPAY_KEY_ID;
const KEY_SECRET = process.env.RAZORPAY_KEY_SECRET;

/**
 * Create a Razorpay order for the chosen plan (INR only — USD goes via Stripe).
 * We record a `created` purchase keyed by the order id so the webhook can later
 * find the user/plan and grant access. Access is NOT granted here — only the
 * signature-verified webhook does that.
 */
export async function POST(req: Request) {
  if (!KEY_ID || !KEY_SECRET) {
    return NextResponse.json({ error: "Payments not configured" }, { status: 503 });
  }

  const user = await getUser();
  if (!user) {
    return NextResponse.json({ error: "Sign in required" }, { status: 401 });
  }

  const admin = createAdminClient();
  if (!admin) {
    // Without the service role we can't record the order → webhook couldn't
    // fulfil it. Fail closed rather than take an unfulfillable payment.
    return NextResponse.json({ error: "Billing not fully configured" }, { status: 503 });
  }

  let planId: string;
  try {
    ({ planId } = await req.json());
  } catch {
    return NextResponse.json({ error: "Bad request" }, { status: 400 });
  }

  const plan = getPlan(planId);
  if (!plan) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const amount = plan.price.INR; // paise

  const orderRes = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization:
        "Basic " + Buffer.from(`${KEY_ID}:${KEY_SECRET}`).toString("base64"),
    },
    body: JSON.stringify({
      amount,
      currency: "INR",
      receipt: `${user.id.slice(0, 8)}-${Date.now()}`,
      notes: { userId: user.id, planId: plan.id, product: PRODUCT },
    }),
  });

  if (!orderRes.ok) {
    return NextResponse.json({ error: "Could not create order" }, { status: 502 });
  }

  const order = (await orderRes.json()) as { id: string };

  await admin.from("purchases").insert({
    user_id: user.id,
    provider: "razorpay",
    provider_ref: order.id,
    product: PRODUCT,
    plan_id: plan.id,
    amount,
    currency: "INR",
    status: "created",
  });

  return NextResponse.json({
    orderId: order.id,
    amount,
    currency: "INR",
    keyId: KEY_ID,
  });
}
