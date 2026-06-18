import Link from "next/link";
import { ArrowUpRight, Crown } from "lucide-react";

/**
 * "Your plan" summary on the dashboard: current validity + amount, with an
 * upgrade CTA when applicable (nothing to upgrade once on the top plan).
 */
export default function MyPlanCard({
  active,
  expiresAt,
  planLabel,
  amountLabel,
  canUpgrade,
}: {
  active: boolean;
  expiresAt: string | null;
  planLabel: string | null;
  amountLabel: string | null;
  canUpgrade: boolean;
}) {
  return (
    <div className="glass-card rounded-2xl border border-white/10 p-5 mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant/70">
          Your plan
        </span>
        {active ? (
          <>
            <p className="text-lg font-bold text-white mt-1">
              {planLabel ?? "Full access"}
            </p>
            <p className="text-sm text-on-surface-variant">
              Active until {new Date(expiresAt as string).toLocaleDateString()}
              {amountLabel ? ` · paid ${amountLabel}` : ""}
            </p>
          </>
        ) : (
          <>
            <p className="text-lg font-bold text-white mt-1">Free tier</p>
            <p className="text-sm text-on-surface-variant">
              Lessons 1–3. Unlock all 29 with a plan.
            </p>
          </>
        )}
      </div>

      {active ? (
        canUpgrade ? (
          <Link
            href="/pricing"
            className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm font-bold hover:shadow-[0_0_24px_rgba(208,188,255,0.35)] transition-all"
          >
            Upgrade to Annual <ArrowUpRight size={16} />
          </Link>
        ) : (
          <span className="self-start inline-flex items-center gap-2 text-sm text-on-surface-variant">
            <Crown size={16} className="text-accent-amber" /> You&apos;re on the top plan
          </span>
        )
      ) : (
        <Link
          href="/pricing"
          className="self-start inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-on-primary text-sm font-bold hover:shadow-[0_0_24px_rgba(208,188,255,0.35)] transition-all"
        >
          View plans <ArrowUpRight size={16} />
        </Link>
      )}
    </div>
  );
}
