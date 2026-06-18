import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";
import PricingCards from "@/components/pricing/PricingCards";
import RedeemCoupon from "@/components/pricing/RedeemCoupon";
import { getUser } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/env";

export const metadata = { title: "Pricing — The Coders Playground" };

export default async function PricingPage() {
  const user = isSupabaseConfigured ? await getUser() : null;

  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-5xl w-full mx-auto px-gutter py-14">
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-3">
            Learn Motion by building
          </h1>
          <p className="text-on-surface-variant max-w-xl mx-auto">
            Start free with the first three lessons. Unlock all 29 — including the
            Real-World projects — with a single subscription.
          </p>
        </div>
        <PricingCards signedIn={Boolean(user)} />
        <RedeemCoupon signedIn={Boolean(user)} />
      </main>
      <Footer />
    </>
  );
}
