import LegalPage from "@/components/common/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Refund & Cancellation Policy — The Coders Playground",
};

export default function RefundPage() {
  return (
    <LegalPage title="Refund & Cancellation Policy" updated="June 18, 2026">
      <p>
        {SITE.product} sells digital, validity-based access that is delivered
        instantly. The first three lessons are free so you can evaluate the
        product before paying.
      </p>

      <h2>Cancellation</h2>
      <p>
        Plans are one-time purchases for a fixed validity period and do not
        auto-renew, so there is nothing to cancel — access simply ends when the
        validity expires.
      </p>

      <h2>Refunds</h2>
      <ul>
        <li>
          Because access is granted immediately and the free tier lets you try
          before you buy, purchases are generally non-refundable.
        </li>
        <li>
          If you were charged in error, charged twice, or could not access the
          content due to a fault on our side, contact us within{" "}
          <strong>7 days</strong> for a full review and, where due, a refund.
        </li>
        <li>
          Approved refunds are issued to the original payment method via Razorpay
          or Stripe, typically within 5–10 business days.
        </li>
      </ul>

      <h2>How to request</h2>
      <p>
        Email <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> from
        your account email with your order details. We respond within 2–3 business
        days.
      </p>
    </LegalPage>
  );
}
