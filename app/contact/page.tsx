import LegalPage from "@/components/common/LegalPage";
import { SITE } from "@/lib/site";

export const metadata = { title: "Contact Us — The Coders Playground" };

export default function ContactPage() {
  return (
    <LegalPage title="Contact Us" updated="June 18, 2026">
      <p>
        Questions about a lesson, your account, or a payment? We&apos;re happy to
        help.
      </p>

      <h2>Reach us</h2>
      <ul>
        <li>
          <strong>Business:</strong> {SITE.legalEntity}
        </li>
        <li>
          <strong>Email:</strong>{" "}
          <a href={`mailto:${SITE.supportEmail}`}>{SITE.supportEmail}</a>
        </li>
        <li>
          <strong>Phone:</strong> {SITE.phone}
        </li>
        <li>
          <strong>Address:</strong> {SITE.address}
        </li>
      </ul>

      <p>We aim to respond within 2–3 business days.</p>
    </LegalPage>
  );
}
