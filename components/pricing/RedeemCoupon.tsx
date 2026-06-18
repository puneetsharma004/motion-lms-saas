"use client";

import { useState } from "react";
import { Loader2, Check } from "lucide-react";

/** Redeem a free-access coupon (e.g. a YouTube code) → instant unlock. */
export default function RedeemCoupon({ signedIn }: { signedIn: boolean }) {
  const [code, setCode] = useState("");
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState<{ ok: boolean; text: string } | null>(null);

  async function redeem(e: React.FormEvent) {
    e.preventDefault();
    if (!signedIn) {
      window.location.href = "/login?next=/pricing";
      return;
    }
    if (!code.trim()) return;
    setBusy(true);
    setMsg(null);
    try {
      const res = await fetch("/api/coupons/redeem", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok) {
        setMsg({
          ok: true,
          text: `Unlocked — ${data.months} months added. Taking you to the lessons…`,
        });
        setTimeout(() => {
          window.location.href = "/learn?welcome=1";
        }, 1200);
      } else {
        setMsg({ ok: false, text: data.error || "Couldn't redeem this code." });
      }
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={redeem} className="mt-12 max-w-sm mx-auto">
      <label className="block text-xs text-on-surface-variant mb-2 text-center">
        Have a coupon?
      </label>
      <div className="flex gap-2">
        <input
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Enter code"
          aria-label="Coupon code"
          className="flex-1 px-4 py-2.5 rounded-full bg-black/40 border border-white/10 text-sm text-white placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50 uppercase"
        />
        <button
          type="submit"
          disabled={busy}
          className="px-5 py-2.5 rounded-full bg-white/10 border border-white/15 text-sm font-bold text-white hover:bg-white/15 transition-colors disabled:opacity-60 flex items-center gap-2 cursor-pointer"
        >
          {busy && <Loader2 size={14} className="animate-spin" />} Redeem
        </button>
      </div>
      {msg && (
        <p
          className={`text-xs text-center mt-3 ${
            msg.ok ? "text-accent-lime" : "text-on-surface-variant"
          }`}
        >
          {msg.ok && <Check size={13} className="inline mr-1 -mt-0.5" />}
          {msg.text}
        </p>
      )}
    </form>
  );
}
