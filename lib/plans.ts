/**
 * Products + plans for The Coders Playground (Motion Playground = first product).
 *
 * Access is VALIDITY-BASED: buying a plan extends the user's entitlement by
 * `months` (no auto-renew). Prices are in MINOR units (paise for INR, cents for
 * USD). These are PLACEHOLDERS — set real launch prices here.
 */
export const PRODUCT = "motion";

export type Currency = "INR" | "USD";

export interface Plan {
  id: string;
  label: string;
  /** Months of access this plan grants (annual = 14 → "2 months free"). */
  months: number;
  price: Record<Currency, number>;
  badge?: string;
  highlight?: boolean;
  perks: string[];
}

export const PLANS: Plan[] = [
  {
    id: "motion-monthly",
    label: "Monthly",
    months: 1,
    price: { INR: 19900, USD: 500 }, // ₹199 / $5  (placeholder)
    perks: [
      "All 29 lessons",
      "Real-World projects",
      "Auto-graded exercises",
      "Progress synced across devices",
    ],
  },
  {
    id: "motion-annual",
    label: "Annual",
    months: 14,
    price: { INR: 99900, USD: 2900 }, // ₹999 / $29 (placeholder)
    badge: "14 months for 12",
    highlight: true,
    perks: [
      "Everything in Monthly",
      "14 months of access (2 free)",
      "Best value",
    ],
  },
];

export const CURRENCY_META: Record<Currency, { symbol: string; label: string }> = {
  INR: { symbol: "₹", label: "India" },
  USD: { symbol: "$", label: "International" },
};

/** Format minor units into a display price (no decimals for whole amounts). */
export function formatPrice(minor: number, currency: Currency): string {
  const major = minor / 100;
  return `${CURRENCY_META[currency].symbol}${
    Number.isInteger(major) ? major : major.toFixed(2)
  }`;
}

export function getPlan(id: string): Plan | undefined {
  return PLANS.find((p) => p.id === id);
}
