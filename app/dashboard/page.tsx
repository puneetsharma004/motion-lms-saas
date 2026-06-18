import { redirect } from "next/navigation";
import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import { getAllLessonMeta } from "@/lib/content";
import { getUser, createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import DashboardStats from "@/components/dashboard/DashboardStats";
import MyPlanCard from "@/components/dashboard/MyPlanCard";
import { getPlan, formatPrice, PRODUCT, type Currency } from "@/lib/plans";

export const metadata = { title: "Dashboard — Motion Playground" };

export default async function DashboardPage() {
  // Dashboard only exists when auth is configured + the user is signed in.
  if (!isSupabaseConfigured) redirect("/learn");
  const user = await getUser();
  if (!user) redirect("/login?next=/dashboard");

  const supabase = await createClient();
  const { data } = await supabase!
    .from("lesson_progress")
    .select("lesson_slug")
    .eq("user_id", user.id);
  const initialCompleted = ((data ?? []) as { lesson_slug: string }[]).map(
    (r) => r.lesson_slug,
  );

  // "Your plan" — current entitlement + latest paid purchase.
  const { data: ent } = await supabase!
    .from("entitlements")
    .select("expires_at")
    .eq("user_id", user.id)
    .eq("product", PRODUCT)
    .maybeSingle();
  const { data: lastPurchase } = await supabase!
    .from("purchases")
    .select("plan_id, amount, currency")
    .eq("user_id", user.id)
    .eq("status", "paid")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  const planActive = ent ? new Date(ent.expires_at as string) > new Date() : false;
  const purchasedPlan = lastPurchase ? getPlan(lastPurchase.plan_id as string) : null;
  const planLabel = purchasedPlan?.label ?? (planActive ? "Full access" : null);
  const amountLabel = lastPurchase
    ? formatPrice(lastPurchase.amount as number, lastPurchase.currency as Currency)
    : null;
  const isTopPlan = lastPurchase?.plan_id === "motion-annual";
  const canUpgrade = planActive && !isTopPlan;

  const lessons = getAllLessonMeta().map((l) => ({
    slug: l.slug,
    title: l.title,
    summary: l.summary,
    category: l.category,
  }));

  const name = user.email?.split("@")[0] ?? "there";

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-gutter py-10">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-5">
          Welcome back, {name}
        </h1>
        <MyPlanCard
          active={planActive}
          expiresAt={(ent?.expires_at as string) ?? null}
          planLabel={planLabel}
          amountLabel={amountLabel}
          canUpgrade={canUpgrade}
        />
        <DashboardStats lessons={lessons} initialCompleted={initialCompleted} />
      </main>
      <Footer />
    </>
  );
}
