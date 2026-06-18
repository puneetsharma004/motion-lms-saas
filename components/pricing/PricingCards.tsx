"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Loader2 } from "lucide-react";
import { PLANS, CURRENCY_META, formatPrice, type Currency, type Plan } from "@/lib/plans";

interface RazorpayOptions {
  key: string;
  order_id: string;
  amount: number;
  currency: string;
  name: string;
  description?: string;
  theme?: { color?: string };
  handler: () => void;
}

function loadRazorpay(): Promise<boolean> {
  return new Promise((resolve) => {
    const w = window as unknown as { Razorpay?: unknown };
    if (w.Razorpay) return resolve(true);
    const s = document.createElement("script");
    s.src = "https://checkout.razorpay.com/v1/checkout.js";
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

/**
 * Pricing cards with an India ₹ / International $ toggle. INR checkout goes
 * through Razorpay; USD will go through Stripe (coming next). Access is granted
 * by the webhook after payment, so we just redirect to the lessons afterwards.
 */
export default function PricingCards({ signedIn }: { signedIn: boolean }) {
  const [currency, setCurrency] = useState<Currency>("INR");
  const [busy, setBusy] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  async function subscribe(plan: Plan) {
    setNotice(null);
    if (currency !== "INR") {
      setNotice("International checkout (Stripe) is coming soon — switch to ₹ India for now.");
      return;
    }
    setBusy(plan.id);
    try {
      const res = await fetch("/api/checkout/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId: plan.id }),
      });
      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "" }));
        setNotice(error || "Could not start checkout. Please try again.");
        return;
      }
      const { orderId, amount, currency: cur, keyId } = await res.json();
      const ok = await loadRazorpay();
      if (!ok) {
        setNotice("Couldn't load the payment window. Check your connection.");
        return;
      }
      const Razorpay = (
        window as unknown as { Razorpay: new (o: RazorpayOptions) => { open: () => void } }
      ).Razorpay;
      new Razorpay({
        key: keyId,
        order_id: orderId,
        amount,
        currency: cur,
        name: "The Coders Playground",
        description: `${plan.label} — Motion Playground`,
        theme: { color: "#d0bcff" },
        handler: () => {
          window.location.href = "/learn?welcome=1";
        },
      }).open();
    } finally {
      setBusy(null);
    }
  }

  return (
    <div>
      <div className="flex justify-center mb-8">
        <div className="inline-flex bg-black/40 border border-white/10 p-1 rounded-full">
          {(Object.keys(CURRENCY_META) as Currency[]).map((c) => (
            <button
              key={c}
              onClick={() => setCurrency(c)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors cursor-pointer ${
                currency === c
                  ? "bg-primary text-on-primary"
                  : "text-on-surface-variant hover:text-white"
              }`}
            >
              {CURRENCY_META[c].symbol} {CURRENCY_META[c].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 max-w-3xl mx-auto">
        {PLANS.map((plan) => {
          const ctaClass = plan.highlight
            ? "bg-primary text-on-primary hover:shadow-[0_0_24px_rgba(208,188,255,0.35)]"
            : "border border-white/15 bg-white/5 text-white hover:bg-white/10";
          return (
            <div
              key={plan.id}
              className={`glass-card rounded-2xl p-6 flex flex-col ${
                plan.highlight ? "border border-primary/50" : "border border-white/10"
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-lg font-bold text-white">{plan.label}</h3>
                {plan.badge && (
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded-full bg-primary/15 text-primary">
                    {plan.badge}
                  </span>
                )}
              </div>
              <div className="mb-4">
                <span className="text-3xl font-extrabold text-white">
                  {formatPrice(plan.price[currency], currency)}
                </span>
                <span className="text-sm text-on-surface-variant"> / {plan.months} mo</span>
              </div>
              <ul className="space-y-2 mb-6 flex-1">
                {plan.perks.map((p) => (
                  <li key={p} className="flex items-start gap-2 text-sm text-on-surface-variant">
                    <Check size={15} className="mt-0.5 shrink-0 text-accent-lime" /> {p}
                  </li>
                ))}
              </ul>
              {signedIn ? (
                <button
                  onClick={() => subscribe(plan)}
                  disabled={busy === plan.id}
                  className={`w-full px-5 py-2.5 rounded-full text-sm font-bold transition-all cursor-pointer disabled:opacity-60 flex items-center justify-center gap-2 ${ctaClass}`}
                >
                  {busy === plan.id && <Loader2 size={15} className="animate-spin" />}
                  {busy === plan.id ? "Starting…" : `Choose ${plan.label}`}
                </button>
              ) : (
                <Link
                  href="/login?next=/pricing"
                  className={`block text-center w-full px-5 py-2.5 rounded-full text-sm font-bold transition-all ${ctaClass}`}
                >
                  Sign in to subscribe
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {notice && (
        <p className="text-center text-xs text-on-surface-variant mt-6">{notice}</p>
      )}

      <p className="text-center text-xs text-on-surface-variant/60 mt-8">
        Validity-based access — no auto-renewal. Lessons 1–3 are free forever.
      </p>
    </div>
  );
}
