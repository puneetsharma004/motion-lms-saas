"use client";

import { useCallback, useEffect, useState } from "react";
import { createClient } from "@/lib/supabase/client";

/** localStorage key holding the per-lesson completion map (slug -> boolean). */
export const PROGRESS_KEY = "motion_playground_completed";
/** Same-tab change signal — the `storage` event only fires in *other* tabs. */
const PROGRESS_EVENT = "motion-progress-change";

export type CompletionMap = Record<string, boolean>;

function readProgress(): CompletionMap {
  try {
    return JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? "{}");
  } catch {
    return {};
  }
}

function writeProgress(map: CompletionMap) {
  localStorage.setItem(PROGRESS_KEY, JSON.stringify(map));
  window.dispatchEvent(new Event(PROGRESS_EVENT));
}

/**
 * Reactive lesson-completion shared across components.
 *
 * Offline-first: localStorage is the instant source of truth (no spinners,
 * works signed-out). When Supabase is configured AND the user is signed in,
 * progress is mirrored to the DB so it follows them across devices:
 *  - on mount we union the DB rows with local (and push local-only completions
 *    up, so anything done before signing in is kept);
 *  - each change is written through to the DB in the background.
 *
 * Starts empty on the server / first paint to avoid hydration mismatch.
 */
export function useProgress() {
  const [completed, setCompleted] = useState<CompletionMap>({});

  useEffect(() => {
    const sync = () => setCompleted(readProgress());
    sync();
    window.addEventListener(PROGRESS_EVENT, sync);
    window.addEventListener("storage", sync);

    // Background two-way merge with the DB when signed in.
    const supabase = createClient();
    if (supabase) {
      (async () => {
        const {
          data: { session },
        } = await supabase.auth.getSession();
        const user = session?.user;
        if (!user) return;

        const { data } = await supabase
          .from("lesson_progress")
          .select("lesson_slug")
          .eq("user_id", user.id);

        const rows = (data ?? []) as { lesson_slug: string }[];
        const dbSlugs = new Set(rows.map((r) => r.lesson_slug));

        const local = readProgress();
        const localSlugs = Object.keys(local).filter((s) => local[s]);

        // Push local-only completions up to the DB.
        const toPush = localSlugs.filter((s) => !dbSlugs.has(s));
        if (toPush.length) {
          await supabase
            .from("lesson_progress")
            .upsert(toPush.map((s) => ({ user_id: user.id, lesson_slug: s })));
        }

        // Pull DB completions down into local.
        let changed = false;
        for (const slug of dbSlugs) {
          if (!local[slug]) {
            local[slug] = true;
            changed = true;
          }
        }
        if (changed) writeProgress(local);
        else setCompleted(local);
      })();
    }

    return () => {
      window.removeEventListener(PROGRESS_EVENT, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);

  const persist = useCallback((slug: string, done: boolean) => {
    const next = { ...readProgress() };
    if (done) next[slug] = true;
    else delete next[slug];
    writeProgress(next);
    setCompleted(next);

    // Mirror to the DB in the background (RLS scopes it to this user).
    const supabase = createClient();
    if (!supabase) return;
    void supabase.auth.getSession().then(({ data: { session } }) => {
      const user = session?.user;
      if (!user) return;
      if (done) {
        void supabase
          .from("lesson_progress")
          .upsert({ user_id: user.id, lesson_slug: slug });
      } else {
        void supabase
          .from("lesson_progress")
          .delete()
          .eq("user_id", user.id)
          .eq("lesson_slug", slug);
      }
    });
  }, []);

  const toggle = useCallback(
    (slug: string) => persist(slug, !readProgress()[slug]),
    [persist],
  );

  /** Mark a lesson done idempotently — used by auto-validation. Never un-marks. */
  const complete = useCallback(
    (slug: string) => {
      if (readProgress()[slug]) return;
      persist(slug, true);
    },
    [persist],
  );

  return { completed, toggle, complete };
}
