# The Coders Playground — Business & Monetization Plan

**Vision:** "The Coders Playground" — a family of practice-first LMS products (Motion
Playground is the first; TypeScript, Vue, etc. to follow). Coders come to
*practice* a stack hands-on. Revenue via **time-bound subscriptions** per product,
plus a cross-product **bundle ("Family Pack")**, sold to a YouTube-built audience,
with coupons + referrals and an admin panel. Gateways: **Razorpay (India)** then
**Stripe (international)**.

---

## 1. Product & pricing

**Model: time-bound subscription access (NOT lifetime).** Each plan is a one-time
charge that grants access for a validity window (simple, no auto-renew mandate
complexity to start; true auto-renew can be added later).

**Plans (per product, e.g. Motion):**
- **Free** — Lessons 1–3 (taster). No account needed.
- **Monthly** — 1 month of access.
- **Annual** — pay for 12 months, **get 14** (2 months free). The headline offer.

**Future:**
- **Bundle / "Family Pack"** — one purchase unlocks *all* products for a validity
  window, at a blended price. Modeled as an entitlement granted across products.
- Optional true auto-renewing subscriptions (Razorpay Subscriptions / Stripe
  Billing) once there's volume.

**Regional pricing (PPP-aware), filled in before launch:**
- India (Razorpay, INR): monthly ₹___, annual ₹___.
- International (Stripe, USD): monthly $___, annual $___.

---

## 2. Access model — entitlements (the key change)

Access is **time-bound and per-product**, so it extends naturally to many products
and the bundle:

`entitlements(user_id, product, expires_at, source)` — a user can access `product`
while `expires_at > now()`. A purchase or a coupon **extends** `expires_at`
(stacking: extend from the later of now / current expiry).

- `product = 'motion'` today; `'typescript'`, … later; bundle grants several.
- Replaces the boolean `is_pro` seam from Phase 3a.
- **Security:** entitlements are writable only by the service role (webhooks /
  admin). Users can only read their own. A trigger also blocks users from setting
  `is_admin` / `is_pro` on their own profile.

---

## 3. Payments architecture

- **Razorpay** (INR, India) first; **Stripe** (USD, international) next.
- `/pricing` with **₹ India / $ International** toggle → routes to the gateway.
- One-time charge per plan → on verified webhook, **extend the entitlement**.

**Razorpay:** `POST /api/checkout/razorpay` creates an Order → client opens
Razorpay Checkout → **webhook** verifies signature on `payment.captured` →
records purchase → extends entitlement (idempotent).

**Stripe:** `POST /api/checkout/stripe` creates a Checkout Session → hosted
checkout → **webhook** verifies `checkout.session.completed` → same.

**Security:** grants happen only via signature-verified webhooks; RLS blocks
client writes; webhooks are idempotent (dedupe by event id).

---

## 4. Coupons & referrals

**Coupons** (unified, cross-gateway, supports free grants):
`coupons(code, kind, value, products, max_redemptions, redeemed_count, expires_at, active)`
- `kind`: `percent` (% off) | `fixed` (amount off) | `free_months` (grant N months
  of access with **no payment**).
- Your "6-month access" code = `free_months`, value `6` → extends entitlement by
  6 months, skipping the gateway entirely.
- Validated server-side at checkout; redemptions tracked + attributable (YouTube).

**Referral program (Phase C):** each user gets a `referral_code`; `?ref=CODE` is
remembered; a referred purchase rewards the referrer (account credit / extra
months) and gives the referee a discount.

---

## 5. Admin panel (`/admin`)

Locked to admins (`profiles.is_admin`, seeded from an `ADMIN_EMAILS` allowlist),
server components + Supabase service role:
- **Overview:** users, active subscribers, revenue (INR & USD split), free→paid
  conversion, signups & active learners over time.
- **Users:** search, `expires_at` per product, progress %, **grant/extend/revoke
  access** manually.
- **Coupons:** create/edit/disable, redemptions + attribution.
- **Purchases:** transaction log.
- Later: products/content & video management, referral payouts.

---

## 6. Legal/policy pages (REQUIRED for Razorpay activation)

Razorpay KYC won't activate without these (Stripe expects most too). Footer-linked
static routes: **Terms**, **Privacy**, **Refund & Cancellation**, **Shipping/
Delivery** (digital: instant access), **Contact Us** (business name/address/email/
phone), **Pricing**.

---

## 7. Go-to-market — YouTube

- Tutorial / build-in-public videos → tracked coupon → site. Free tier (1–3) is
  the lead magnet; Real-World projects are the paid hook.
- **Per-exercise embeds (Phase D):** `youtubeId` in each lesson `meta.json`,
  rendered as a lazy, click-to-load `youtube-nocookie` "Watch walkthrough".

---

## Execution roadmap

**Phase A — Revenue MVP** (start = DB + legal + pricing)
1. DB: `entitlements`, `purchases`, `coupons`, `coupon_redemptions`, `is_admin`
   + RLS + privilege-guard trigger. *(migration `0002_billing.sql`)*
2. Access helper (`hasAccess(product)` from entitlements) + flip gating from
   "logged in" to "active entitlement"; paywall CTA on locked lessons.
3. Legal pages + `/pricing` (₹/$ toggle, Monthly/Annual) + footer links.
4. Razorpay: checkout route + webhook → extend entitlement.
5. Stripe: checkout route + webhook → extend entitlement.
6. Coupons: server-side validation incl. `free_months` grant path.

**Phase B — Admin panel.**
**Phase C — Referrals.**
**Phase D — YouTube embeds per exercise.**
**Phase E — Scale:** receipt/welcome emails (Resend), analytics, SEO,
certificates, multi-product + Family Pack, optional auto-renew.

---

## Inputs needed from you (to finish Phase A)

- **Razorpay** keys (test + live) + KYC in progress (legal pages unblock this).
- **Stripe** keys (test + live).
- **Admin email(s)** for `ADMIN_EMAILS`.
- **Prices**: monthly + annual, in INR and USD.
- **Launch coupon** code(s) (e.g. a YouTube discount + a 6-month free code).
- **Business contact details** for the legal/contact pages.

Built against test keys now; live keys swap in at launch.
