import Link from "next/link";
import { Lock, Check } from "lucide-react";

/**
 * Shown in place of a gated lesson's content + sandbox when a signed-out user
 * opens a non-free lesson. Keeps the teaser visible so it's an invitation, not
 * a dead end.
 */
export default function LessonLocked({
  slug,
  summary,
  accent,
}: {
  slug: string;
  summary: string;
  accent: string;
}) {
  const accentVar = `var(--color-accent-${accent})`;
  const perks = [
    "Unlock all 10 lessons",
    "Save progress across devices",
    "Auto-graded exercises",
  ];

  return (
    <div className="mt-6 glass-card rounded-2xl border border-white/10 p-8 text-center max-w-2xl mx-auto">
      <div
        className="mx-auto mb-4 w-12 h-12 rounded-full flex items-center justify-center"
        style={{ background: `color-mix(in srgb, ${accentVar} 18%, transparent)` }}
      >
        <Lock size={20} style={{ color: accentVar }} />
      </div>

      <h2 className="text-xl font-bold text-white mb-2">
        Create a free account to continue
      </h2>
      <p className="text-sm text-on-surface-variant mb-6 max-w-md mx-auto">
        {summary}
      </p>

      <ul className="inline-flex flex-col gap-2 text-left mb-7">
        {perks.map((perk) => (
          <li key={perk} className="flex items-center gap-2 text-sm text-on-surface-variant">
            <Check size={15} style={{ color: accentVar }} /> {perk}
          </li>
        ))}
      </ul>

      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          href={`/login?next=/learn/${slug}`}
          className="px-6 py-3 rounded-full bg-primary text-[#3c0091] text-sm font-bold hover:shadow-[0_0_24px_rgba(208,188,255,0.35)] transition-all"
        >
          Sign in — it&apos;s free
        </Link>
        <Link
          href="/learn"
          className="px-6 py-3 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-on-surface-variant hover:text-white transition-colors"
        >
          Back to free lessons
        </Link>
      </div>
    </div>
  );
}
