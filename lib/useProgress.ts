"use client";

import { useCallback, useEffect, useSyncExternalStore } from "react";
import { createClient } from "@/lib/supabase/client";

/**
 * Per-user lesson completion, offline-first with DB sync.
 *
 * Progress is namespaced per identity in localStorage (`mp_progress_<uid>`, or
 * `mp_progress_anon` when logged out) and reset whenever the signed-in user
 * changes — so two accounts on the same browser never share progress. The DB is
 * the source of truth when signed in; anonymous (pre-login) progress is migrated
 * up once on sign-in and then cleared so it can't leak to the next account.
 */
const ANON_KEY = "mp_progress_anon";
const keyFor = (uid: string | null) => (uid ? `mp_progress_${uid}` : ANON_KEY);

export type CompletionMap = Record<string, boolean>;
const EMPTY: CompletionMap = {};

let cache: CompletionMap | null = null;
let currentKey = ANON_KEY;
let currentUserId: string | null | undefined = undefined; // undefined = unknown
let authWired = false;
const listeners = new Set<() => void>();

function read(key: string): CompletionMap {
  try {
    return JSON.parse(localStorage.getItem(key) ?? "{}");
  } catch {
    return {};
  }
}
function write(key: string, map: CompletionMap) {
  try {
    localStorage.setItem(key, JSON.stringify(map));
  } catch {
    /* ignore */
  }
}
function emit() {
  listeners.forEach((l) => l());
}
function subscribe(cb: () => void) {
  listeners.add(cb);
  return () => {
    listeners.delete(cb);
  };
}
function getSnapshot(): CompletionMap {
  if (cache === null) cache = read(currentKey);
  return cache;
}
function getServerSnapshot(): CompletionMap {
  return EMPTY;
}
function setCache(map: CompletionMap) {
  cache = map;
  write(currentKey, map);
  emit();
}

// Hydration-safe "on the client" flag.
const noopSubscribe = () => () => {};
const clientTrue = () => true;
const clientFalse = () => false;

if (typeof window !== "undefined") {
  window.addEventListener("storage", (e) => {
    if (e.key === currentKey) {
      cache = read(currentKey);
      emit();
    }
  });
}

/** Switch active identity and load its progress (DB is truth when signed in). */
async function switchUser(userId: string | null) {
  if (currentUserId === userId) return;
  currentUserId = userId;
  currentKey = keyFor(userId);

  if (!userId) {
    cache = read(ANON_KEY);
    emit();
    return;
  }

  const next = read(currentKey);
  const supabase = createClient();

  if (supabase) {
    const { data } = await supabase
      .from("lesson_progress")
      .select("lesson_slug")
      .eq("user_id", userId);
    const dbSlugs = ((data ?? []) as { lesson_slug: string }[]).map((r) => r.lesson_slug);
    for (const s of dbSlugs) next[s] = true;

    // One-time migration of anonymous (pre-login) progress into this account.
    const anon = read(ANON_KEY);
    const anonSlugs = Object.keys(anon).filter((s) => anon[s]);
    for (const s of anonSlugs) next[s] = true;

    const toPush = [...new Set(Object.keys(next).filter((s) => next[s]))].filter(
      (s) => !dbSlugs.includes(s),
    );
    if (toPush.length) {
      await supabase
        .from("lesson_progress")
        .upsert(toPush.map((s) => ({ user_id: userId, lesson_slug: s })));
    }
    // Clear anon so it never carries over to a different account on this browser.
    write(ANON_KEY, {});
  }

  write(currentKey, next);
  cache = next;
  emit();
}

function wireAuth() {
  if (authWired) return;
  authWired = true;
  const supabase = createClient();
  if (!supabase) {
    void switchUser(null);
    return;
  }
  void supabase.auth.getSession().then(({ data: { session } }) => {
    void switchUser(session?.user?.id ?? null);
  });
  supabase.auth.onAuthStateChange((_event, session) => {
    void switchUser(session?.user?.id ?? null);
  });
}

function writeRemote(slug: string, done: boolean) {
  if (!currentUserId) return; // anonymous → localStorage only
  const supabase = createClient();
  if (!supabase) return;
  const uid = currentUserId;
  if (done) {
    void supabase.from("lesson_progress").upsert({ user_id: uid, lesson_slug: slug });
  } else {
    void supabase
      .from("lesson_progress")
      .delete()
      .eq("user_id", uid)
      .eq("lesson_slug", slug);
  }
}

export function useProgress() {
  const completed = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const ready = useSyncExternalStore(noopSubscribe, clientTrue, clientFalse);

  useEffect(() => {
    wireAuth();
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

  const complete = useCallback(
    (slug: string) => {
      if (getSnapshot()[slug]) return;
      persist(slug, true);
    },
    [persist],
  );

  return { completed, ready, toggle, complete };
}
