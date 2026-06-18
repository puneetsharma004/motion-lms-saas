import { createAdminClient } from "@/lib/supabase/admin";
import { createCoupon, toggleCoupon } from "@/app/admin/actions";

const input =
  "px-3 py-2 rounded-lg bg-black/40 border border-white/10 text-sm text-white placeholder:text-on-surface-variant/50 focus:outline-none focus:border-primary/50";

interface Coupon {
  code: string;
  kind: string;
  value: number;
  max_redemptions: number | null;
  redeemed_count: number;
  active: boolean;
  expires_at: string | null;
}

export default async function AdminCoupons() {
  const admin = createAdminClient();
  if (!admin) {
    return (
      <p className="text-sm text-on-surface-variant">
        Set <code className="text-primary">SUPABASE_SERVICE_ROLE_KEY</code> to manage coupons.
      </p>
    );
  }

  const { data } = await admin
    .from("coupons")
    .select("code, kind, value, max_redemptions, redeemed_count, active, expires_at")
    .order("created_at", { ascending: false });
  const coupons = (data ?? []) as Coupon[];

  return (
    <div className="space-y-8">
      {/* Create */}
      <form
        action={createCoupon}
        className="glass-card rounded-xl border border-white/10 p-5 flex flex-wrap items-end gap-3"
      >
        <div className="flex flex-col gap-1">
          <label className="text-xs text-on-surface-variant">Code</label>
          <input name="code" required placeholder="LAUNCH6" className={`${input} uppercase`} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-on-surface-variant">Type</label>
          <select name="kind" className={input} defaultValue="free_months">
            <option value="free_months">free_months</option>
            <option value="percent">percent</option>
            <option value="fixed">fixed</option>
          </select>
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-on-surface-variant">Value</label>
          <input name="value" type="number" required placeholder="6" className={`${input} w-24`} />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs text-on-surface-variant">Max uses (optional)</label>
          <input name="max_redemptions" type="number" placeholder="∞" className={`${input} w-28`} />
        </div>
        <button className="px-5 py-2 rounded-lg bg-primary text-on-primary text-sm font-bold cursor-pointer">
          Create coupon
        </button>
      </form>
      <p className="text-xs text-on-surface-variant/60 -mt-5">
        <code className="text-primary">free_months</code>: value = months granted on redeem.{" "}
        <code className="text-primary">percent</code>/<code className="text-primary">fixed</code>:
        applied at checkout (coming with Stripe).
      </p>

      {/* List */}
      <div className="glass-card rounded-xl border border-white/10 overflow-x-auto">
        <table className="w-full text-sm min-w-[640px]">
          <thead className="text-on-surface-variant/70 text-xs">
            <tr className="border-b border-white/10">
              <th className="text-left font-medium px-4 py-2.5">Code</th>
              <th className="text-left font-medium px-4 py-2.5">Type</th>
              <th className="text-left font-medium px-4 py-2.5">Value</th>
              <th className="text-left font-medium px-4 py-2.5">Used</th>
              <th className="text-left font-medium px-4 py-2.5">Status</th>
              <th className="text-right font-medium px-4 py-2.5">Action</th>
            </tr>
          </thead>
          <tbody>
            {coupons.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-on-surface-variant">
                  No coupons yet.
                </td>
              </tr>
            )}
            {coupons.map((c) => (
              <tr key={c.code} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-2.5 font-mono text-white">{c.code}</td>
                <td className="px-4 py-2.5 text-on-surface-variant">{c.kind}</td>
                <td className="px-4 py-2.5 text-white">{c.value}</td>
                <td className="px-4 py-2.5 text-on-surface-variant tabular-nums">
                  {c.redeemed_count}
                  {c.max_redemptions != null ? ` / ${c.max_redemptions}` : ""}
                </td>
                <td className="px-4 py-2.5">
                  <span className={c.active ? "text-accent-lime" : "text-on-surface-variant/60"}>
                    {c.active ? "active" : "disabled"}
                  </span>
                </td>
                <td className="px-4 py-2.5 text-right">
                  <form action={toggleCoupon} className="inline">
                    <input type="hidden" name="code" value={c.code} />
                    <input type="hidden" name="active" value={c.active ? "" : "1"} />
                    <button className="px-2.5 py-1 rounded-md text-xs font-semibold border border-white/10 bg-white/5 text-white hover:bg-white/10 transition-colors cursor-pointer">
                      {c.active ? "Disable" : "Enable"}
                    </button>
                  </form>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
