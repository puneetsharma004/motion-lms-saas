/**
 * Public Supabase config. Both vars are `NEXT_PUBLIC_*` so they're available in
 * the browser and server. When either is missing the whole auth/DB layer stays
 * dormant — the app runs as a local-only playground (no login, no gating,
 * progress in localStorage). This is what makes "add keys later" seamless.
 */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const isSupabaseConfigured = Boolean(SUPABASE_URL && SUPABASE_ANON_KEY);
