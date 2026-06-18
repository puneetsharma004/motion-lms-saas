import { createAdminClient } from "@/lib/supabase/admin";
import { formatPrice, type Currency } from "@/lib/plans";

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="glass-card rounded-xl border border-white/10 p-5">
      <p className="text-2xl font-bold text-white tabular-nums">{value}</p>
      <p className="text-xs text-on-surface-variant mt-1">{label}</p>
    </div>
  );
}

export default async function AdminOverview() {
  const admin = createAdminClient();
  if (!admin) {
    return (
      <p className="text-sm text-on-surface-variant">
        Set <code className="text-primary">SUPABASE_SERVICE_ROLE_KEY</code> to enable
        the admin panel.
      </p>
    );
  }

  const nowIso = new Date().toISOString();
  const [users, active, paid, redemptions, recent] = await Promise.all([
    admin.from("profiles").select("*", { count: "exact", head: true }),
    admin
      .from("entitlements")
      .select("*", { count: "exact", head: true })
      .gt("expires_at", nowIso),
    admin.from("purchases").select("amount, currency").eq("status", "paid"),
    admin.from("coupon_redemptions").select("*", { count: "exact", head: true }),
    admin
      .from("purchases")
      .select("created_at, provider, plan_id, amount, currency, status")
      .order("created_at", { ascending: false })
      .limit(10),
  ]);

  const revenue: Record<string, number> = {};
  for (const p of (paid.data ?? []) as { amount: number; currency: string }[]) {
    revenue[p.currency] = (revenue[p.currency] ?? 0) + p.amount;
  }
  const revenueStr =
    Object.keys(revenue).length === 0
      ? "—"
      : Object.entries(revenue)
          .map(([cur, amt]) => formatPrice(amt, cur as Currency))
          .join(" + ");

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Stat label="Total users" value={users.count ?? 0} />
        <Stat label="Active subscribers" value={active.count ?? 0} />
        <Stat label="Revenue (paid)" value={revenueStr} />
        <Stat label="Coupon redemptions" value={redemptions.count ?? 0} />
      </div>

      <div>
        <h2 className="text-sm font-bold text-white mb-3">Recent purchases</h2>
        <div className="glass-card rounded-xl border border-white/10 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="text-on-surface-variant/70 text-xs">
              <tr className="border-b border-white/10">
                <th className="text-left font-medium px-4 py-2.5">When</th>
                <th className="text-left font-medium px-4 py-2.5">Plan</th>
                <th className="text-left font-medium px-4 py-2.5">Provider</th>
                <th className="text-right font-medium px-4 py-2.5">Amount</th>
                <th className="text-left font-medium px-4 py-2.5">Status</th>
              </tr>
            </thead>
            <tbody>
              {(recent.data ?? []).length === 0 && (
                <tr>
                  <td colSpan={5} className="px-4 py-6 text-center text-on-surface-variant">
                    No purchases yet.
                  </td>
                </tr>
              )}
              {((recent.data ?? []) as {
                created_at: string;
                provider: string;
                plan_id: string;
                amount: number;
                currency: string;
                status: string;
              }[]).map((p, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="px-4 py-2.5 text-on-surface-variant">
                    {new Date(p.created_at).toLocaleDateString()}
                  </td>
                  <td className="px-4 py-2.5 text-white">{p.plan_id}</td>
                  <td className="px-4 py-2.5 text-on-surface-variant">{p.provider}</td>
                  <td className="px-4 py-2.5 text-right text-white tabular-nums">
                    {formatPrice(p.amount, p.currency as Currency)}
                  </td>
                  <td className="px-4 py-2.5">
                    <span
                      className={
                        p.status === "paid" ? "text-accent-lime" : "text-on-surface-variant"
                      }
                    >
                      {p.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
