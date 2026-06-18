-- Coders Playground — Phase A billing/access schema.
-- Time-bound, per-product access (entitlements), coupons, purchases, admin.
-- Run in the Supabase SQL editor after 0001_init.sql.

-- Admin flag (seed real admins from the ADMIN_EMAILS allowlist in app code).
alter table public.profiles add column if not exists is_admin boolean not null default false;

-- 1) Entitlements — access to a product until expires_at. A purchase or coupon
--    extends this. Access(product) := exists row with expires_at > now().
create table if not exists public.entitlements (
  user_id    uuid not null references auth.users (id) on delete cascade,
  product    text not null,                         -- 'motion' (future: 'typescript', 'bundle')
  expires_at timestamptz not null,
  source     text not null default 'purchase',      -- purchase | coupon | admin
  updated_at timestamptz not null default now(),
  primary key (user_id, product)
);

-- 2) Purchases / transaction log.
create table if not exists public.purchases (
  id           uuid primary key default gen_random_uuid(),
  user_id      uuid not null references auth.users (id) on delete cascade,
  provider     text not null,                        -- razorpay | stripe
  provider_ref text,                                 -- order / session / payment id
  product      text not null,
  plan_id      text not null,                        -- e.g. 'motion-annual'
  amount       integer not null,                     -- minor units (paise / cents)
  currency     text not null,                        -- INR | USD
  coupon_code  text,
  status       text not null default 'created',      -- created | paid | failed
  created_at   timestamptz not null default now()
);

-- 3) Coupons — unified across gateways; supports free (no-payment) grants.
create table if not exists public.coupons (
  code            text primary key,
  description     text,
  kind            text not null,                     -- percent | fixed | free_months
  value           integer not null,                  -- percent (1-100) | minor units | months
  currency        text,                              -- for kind = 'fixed'
  products        text[] not null default '{}',      -- empty = applies to all products
  max_redemptions integer,
  redeemed_count  integer not null default 0,
  expires_at      timestamptz,
  active          boolean not null default true,
  created_at      timestamptz not null default now()
);

create table if not exists public.coupon_redemptions (
  id          uuid primary key default gen_random_uuid(),
  coupon_code text not null references public.coupons (code) on delete cascade,
  user_id     uuid not null references auth.users (id) on delete cascade,
  purchase_id uuid references public.purchases (id) on delete set null,
  created_at  timestamptz not null default now()
);

-- 4) RLS. Users may READ their own billing rows; coupons are world-readable so
--    checkout can validate a code. NO write policies → inserts/updates/deletes
--    are possible only via the service role (webhooks/admin), which bypasses RLS.
alter table public.entitlements       enable row level security;
alter table public.purchases          enable row level security;
alter table public.coupons            enable row level security;
alter table public.coupon_redemptions enable row level security;

drop policy if exists "entitlements_select_own" on public.entitlements;
create policy "entitlements_select_own" on public.entitlements
  for select using (auth.uid() = user_id);

drop policy if exists "purchases_select_own" on public.purchases;
create policy "purchases_select_own" on public.purchases
  for select using (auth.uid() = user_id);

drop policy if exists "redemptions_select_own" on public.coupon_redemptions;
create policy "redemptions_select_own" on public.coupon_redemptions
  for select using (auth.uid() = user_id);

drop policy if exists "coupons_select_all" on public.coupons;
create policy "coupons_select_all" on public.coupons
  for select using (true);

-- 5) Prevent privilege escalation: the existing profiles_update_own policy lets a
--    user update their own row, so block them from flipping is_admin / is_pro.
--    Only the service role may change those columns.
create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() is distinct from 'service_role' then
    new.is_admin := old.is_admin;
    new.is_pro := old.is_pro;
  end if;
  return new;
end;
$$;

drop trigger if exists protect_profile_privileges on public.profiles;
create trigger protect_profile_privileges
  before update on public.profiles
  for each row execute function public.protect_profile_privileges();
