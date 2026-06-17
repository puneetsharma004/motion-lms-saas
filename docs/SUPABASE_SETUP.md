# Supabase setup (Phase 3a — auth + progress)

The app runs **without** Supabase (local-only: no login, no gating, progress in
localStorage). Follow these steps to turn on accounts, cross-device progress, and
the free/gated tier.

## 1. Create a project
1. Go to <https://supabase.com/dashboard> → **New project**.
2. Pick a name + database password, wait for it to provision.

## 2. Add your keys
1. **Project Settings → API.** Copy the **Project URL** and the **anon public** key.
2. Copy `.env.example` to `.env.local` and fill them in:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://YOUR-PROJECT.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
   ```
3. Restart `next dev` (env vars are read at boot).

## 3. Create the tables
**SQL Editor → New query**, paste the contents of
[`supabase/migrations/0001_init.sql`](../supabase/migrations/0001_init.sql), run it.
This creates `profiles` + `lesson_progress` with Row Level Security and a
signup trigger.

## 4. Configure auth
**Authentication → URL Configuration:**
- **Site URL:** `http://localhost:3000` (and your production URL later).
- **Redirect URLs:** add `http://localhost:3000/auth/callback`
  (and `https://YOURDOMAIN/auth/callback` for prod).

**Magic link** works out of the box (email provider is on by default).

**Google** (optional, for the "Continue with Google" button):
1. Google Cloud Console → create OAuth credentials (Web application).
2. Authorized redirect URI: `https://YOUR-PROJECT.supabase.co/auth/v1/callback`.
3. In Supabase: **Authentication → Providers → Google** → paste the Client ID +
   Secret, enable.

## How it behaves
- **Not configured:** everything open, progress local only. Great for dev.
- **Configured, signed out:** lessons 1–3 free; 4–10 show a "create a free
  account" gate; sidebar shows a lock on gated lessons.
- **Signed in:** all lessons open; progress syncs both ways with the DB (anything
  completed before signing in is pushed up on first load).

## Knobs
- Free-tier size: `FREE_LESSON_COUNT` in [`lib/content.ts`](../lib/content.ts).
- Paid gating later (Phase 3b): the `profiles.is_pro` flag is already in the
  schema — gate premium lessons on it once Stripe is wired.
