import LegalPage from "@/components/common/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = { title: "Terms & Conditions — The Coders Playground" };

export default function TermsPage() {
  return (
    <LegalPage title="Terms & Conditions" updated="June 18, 2026">
      <p>
        These Terms govern your use of {SITE.product}, operated by{" "}
        {SITE.legalEntity} (&quot;we&quot;, &quot;us&quot;). By creating an account
        or purchasing access, you agree to these Terms.
      </p>

      <h2>Accounts</h2>
      <p>
        You are responsible for activity under your account and for keeping your
        sign-in details secure. You must provide accurate information and be able
        to form a binding contract.
      </p>

      <h2>Access &amp; licence</h2>
      <p>
        A purchase grants you a personal, non-transferable, time-bound licence to
        access the lessons for the validity period of the plan. Access is
        validity-based and does not auto-renew. We may add, change, or remove
        lessons over time.
      </p>

      <h2>Acceptable use</h2>
      <ul>
        <li>Do not share, resell, or redistribute the content or your account.</li>
        <li>Do not attempt to bypass payment or access controls.</li>
        <li>Do not misuse the platform or disrupt other learners.</li>
      </ul>

      <h2>Payments</h2>
      <p>
        Prices are shown at checkout in INR (via Razorpay) or USD (via Stripe).
        Applicable taxes may be added. Coupons and offers are subject to their own
        terms and may be withdrawn at any time.
      </p>

      <h2>Intellectual property</h2>
      <p>
        All course content, code, and branding are owned by {SITE.legalEntity} and
        protected by law. The licence above does not transfer ownership.
      </p>

      <h2>Disclaimer &amp; liability</h2>
      <p>
        The service is provided &quot;as is&quot; without warranties. To the extent
        permitted by law, our liability is limited to the amount you paid for
        access in the preceding 12 months.
      </p>

      <h2>Changes &amp; governing law</h2>
      <p>
        We may update these Terms; continued use means acceptance. These Terms are
        governed by the laws of {SITE.country}. Questions? Email{" "}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
      </p>
    </LegalPage>
  );
}
