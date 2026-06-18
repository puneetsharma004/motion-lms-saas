-- One redemption per user per coupon. The unique index makes double-redeem
-- impossible even under a race (the second insert fails).
create unique index if not exists coupon_redemptions_unique_user_coupon
  on public.coupon_redemptions (coupon_code, user_id);
