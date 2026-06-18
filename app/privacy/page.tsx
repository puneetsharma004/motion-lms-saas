import LegalPage from "@/components/common/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = { title: "Privacy Policy — The Coders Playground" };

export default function PrivacyPage() {
  return (
    <LegalPage title="Privacy Policy" updated="June 18, 2026">
      <p>
        This policy explains how {SITE.legalEntity} ({SITE.product}) handles your
        data. We collect only what we need to run the service.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>Account:</strong> your email address (for sign-in via magic link
          or Google).
        </li>
        <li>
          <strong>Learning:</strong> which lessons you complete, to sync progress.
        </li>
        <li>
          <strong>Payments:</strong> processed by Razorpay and Stripe. We do not
          store your card details; we keep a record of the transaction (amount,
          status, plan).
        </li>
      </ul>

      <h2>How we use it</h2>
      <p>
        To authenticate you, provide access, sync progress, process payments,
        provide support, and send essential service emails (e.g. receipts).
      </p>

      <h2>Processors we use</h2>
      <ul>
        <li>Supabase — authentication &amp; database.</li>
        <li>Razorpay, Stripe — payment processing.</li>
      </ul>

      <h2>Cookies</h2>
      <p>
        We use essential cookies to keep you signed in. We do not sell your data.
      </p>

      <h2>Your rights</h2>
      <p>
        You may request access to, correction of, or deletion of your data by
        emailing <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
        Deleting your account removes your profile and progress.
      </p>

      <h2>Contact</h2>
      <p>
        {SITE.legalEntity}, {SITE.address}. Email{" "}
        <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>.
      </p>
    </LegalPage>
  );
}
