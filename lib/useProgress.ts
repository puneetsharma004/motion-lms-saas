"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { createClient } from "@/lib/supabase/client";

/** localStorage key holding the per-lesson completion map (slug -> boolean). */
export const PROGRESS_KEY = "motion_playground_completed";

export type CompletionMap = Record<string, boolean>;

const EMPTY: CompletionMap = {};

/**
 * Module-level store. Lives for the whole client session and survives App Router
 * navigations (which don't reload JS), so an optimistic change — especially an
 * *untick* — persists as you move between pages instead of being resurrected by
 * a fresh DB read. The DB is reconciled once per auth state (see hydrateFromDB),
 * not on every mount, which is what previously undid unticks.
 */
let cache: CompletionMap | null = null;
const listeners = new Set<() => void>();
/** undefined = not yet hydrated; otherwise the userId|null we last hydrated for. */
let hydratedFor: string | null | undefined = undefined;
let hydrating = false;

function readLocal(): CompletionMap {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function persistLocal(map: CompletionMap) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
  } catch {
    /* ignore quota / unavailable */
  }
}

function getSnapshot(): CompletionMap {
  if (cache === null) cache = readLocal();
  return cache;
}

function getServerSnapshot(): CompletionMap {
  return EMPTY;
}

// Hydration-safe "running on the client" flag (false on the server, true after
// mount) without setState-in-effect.
const noopSubscribe = () => () => {};
const clientTrue = () => true;
const clientFalse = () => false;

function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}

function emit() {
  listeners.forEach((l) => l());
}

function setCache(next: CompletionMap) {
  cache = next;
  persistLocal(next);
  emit();
}

// Cross-tab sync: pick up changes made in other tabs.
if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === PROGRESS_KEY) {
      cache = readLocal();
      emit();
    }
  });
}

/**
 * Reconcile with the DB once per auth state. First time signed in we union the
 * pre-login local progress with the DB (and push local-only completions up), so
 * nothing done before signing in is lost. After that the in-memory cache is the
 * session's source of truth — we do NOT re-pull on later navigations, which is
 * what used to resurrect unticked lessons.
 */
async function hydrateFromDB() {
  if (hydrating) return;
  const supabase = createClient();
  if (!supabase) return;
  hydrating = true;
  try {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    const userId = session?.user?.id ?? null;
    if (hydratedFor === userId) return;
    if (!userId) {
      hydratedFor = null;
      return;
    }

    const { data } = await supabase
      .from("lesson_progress")
      .select("lesson_slug")
      .eq("user_id", userId);
    const dbSlugs = ((data ?? []) as { lesson_slug: string }[]).map(
      (r) => r.lesson_slug,
    );

    const local = getSnapshot();
    const merged: CompletionMap = {};
    for (const s of dbSlugs) merged[s] = true;
    for (const s of Object.keys(local)) if (local[s]) merged[s] = true;

    const toPush = Object.keys(local).filter(
      (s) => local[s] && !dbSlugs.includes(s),
    );
    if (toPush.length) {
      await supabase
        .from("lesson_progress")
        .upsert(toPush.map((s) => ({ user_id: userId, lesson_slug: s })));
    }

    hydratedFor = userId;
    setCache(merged);
  } finally {
    hydrating = false;
  }
}

function writeRemote(slug: string, done: boolean) {
  const supabase = createClient();
  if (!supabase) return;
  void supabase.auth.getSession().then(({ data: { session } }) => {
    const userId = session?.user?.id;
    if (!userId) return;
    if (done) {
      void supabase
        .from("lesson_progress")
        .upsert({ user_id: userId, lesson_slug: slug });
    } else {
      void supabase
        .from("lesson_progress")
        .delete()
        .eq("user_id", userId)
        .eq("lesson_slug", slug);
    }
  });
}

/**
 * Reactive lesson-completion shared across components. Offline-first (instant
 * localStorage) with background DB mirroring when signed in. `ready` flips true
 * after the first client mount so consumers can prefer a server-provided
 * snapshot until then (avoids flashes without re-introducing the untick bug).
 */
export function useProgress() {
  const completed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(noopSubscribe, clientTrue, clientFalse);

  useEffect(() => {
    void hydrateFromDB();
  }, []);

  const persist = useCallback((slug: string, done: boolean) => {
    const next = { ...getSnapshot() };
    if (done) next[slug] = true;
    else delete next[slug];
    setCache(next);
    writeRemote(slug, done);
  }, []);

  const toggle = useCallback(
    (slug: string) => persist(slug, !getSnapshot()[slug]),
    [persist],
  );

  /** Mark a lesson done idempotently — used by auto-validation. Never un-marks. */
  const complete = useCallback(
    (slug: string) => {
      if (getSnapshot()[slug]) return;
      persist(slug, true);
    },
    [persist],
  );

  return { completed, ready, toggle, complete };
}
