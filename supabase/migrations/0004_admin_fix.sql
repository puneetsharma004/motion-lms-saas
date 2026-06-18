-- Fix the privilege-guard so it only blocks the client-facing roles
-- (authenticated / anon) from escalating their own row. The SQL editor
-- (postgres) and the service role can now set is_admin / is_pro — needed to
-- bootstrap the first admin and for admin grants.
create or replace function public.protect_profile_privileges()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.role() in ('authenticated', 'anon') then
    new.is_admin := old.is_admin;
    new.is_pro := old.is_pro;
  end if;
  return new;
end;
$$;
