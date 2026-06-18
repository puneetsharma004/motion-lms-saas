import LegalPage from "@/components/common/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = {
  title: "Delivery Policy — The Coders Playground",
};

export default function ShippingPage() {
  return (
    <LegalPage title="Delivery Policy" updated="June 18, 2026">
      <p>
        {SITE.product} is a fully digital product. There is no physical shipment.
      </p>

      <h2>Digital delivery</h2>
      <ul>
        <li>
          Access is granted <strong>instantly</strong> after a successful payment —
          the lessons unlock on your account automatically.
        </li>
        <li>
          If access doesn&apos;t unlock within a few minutes, refresh the page or
          sign out and back in. Payment confirmations can occasionally lag.
        </li>
        <li>
          Still stuck? Email{" "}
          <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a> with your
          order details and we&apos;ll sort it out quickly.
        </li>
      </ul>
    </LegalPage>
  );
}
