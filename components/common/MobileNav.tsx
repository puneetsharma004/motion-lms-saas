"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import { Menu, X, ArrowUpRight, LogOut } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

/**
 * Mobile header menu (hamburger → slide-in drawer). Receives serializable auth
 * state from the server Navbar. Shown below `sm`; the inline links take over at
 * `sm+`.
 */
export default function MobileNav({
  email,
  isConfigured,
  isAdmin = false,
}: {
  email: string | null;
  isConfigured: boolean;
  isAdmin?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  // Lock the page while the drawer is open so scrolling the overlay doesn't move
  // the page behind it — the blurred backdrop stays put.
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  const linkClass =
    "px-3 py-2 rounded-lg text-sm text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors";

  // Portaled to <body> so the fixed overlay escapes the navbar's backdrop-filter
  // (an ancestor with backdrop-filter becomes the containing block for fixed
  // descendants, which would otherwise pin the drawer to the 64px header).
  const overlay = (
    <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-60 bg-black/60 backdrop-blur-md"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            {/* top-0 + bottom-0 (no h-screen) pins the drawer to the *visible*
                viewport — correct under the mobile address bar. Scrolls
                internally if the menu ever outgrows the screen. */}
            <motion.div
              className="fixed top-0 right-0 bottom-0 z-61 w-64 max-w-[80vw] overflow-y-auto bg-surface-container border-l border-white/10 p-5 flex flex-col gap-1"
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex justify-end mb-2">
                <button
                  onClick={close}
                  aria-label="Close menu"
                  className="p-1 text-on-surface-variant hover:text-white transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <Link href="/learn" onClick={close} className={linkClass}>
                Lessons
              </Link>

              {isConfigured && email && (
                <Link href="/dashboard" onClick={close} className={linkClass}>
                  Dashboard
                </Link>
              )}
              {isConfigured && email && isAdmin && (
                <Link href="/admin" onClick={close} className={`${linkClass} text-primary`}>
                  Admin
                </Link>
              )}
              {isConfigured && !email && (
                <Link href="/login" onClick={close} className={linkClass}>
                  Sign in
                </Link>
              )}

              <Link
                href="https://motion.dev"
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} flex items-center gap-1.5`}
              >
                motion.dev <ArrowUpRight size={14} />
              </Link>

              {isConfigured && email && (
                <form
                  action="/auth/signout"
                  method="post"
                  className="mt-auto pt-3 border-t border-white/10"
                >
                  <p className="px-3 pb-2 text-xs text-on-surface-variant/70 truncate">
                    {email}
                  </p>
                  <button
                    type="submit"
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-on-surface-variant hover:text-white hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <LogOut size={14} /> Sign out
                  </button>
                </form>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
  );

  return (
    <div className="sm:hidden">
      <button
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="p-2 -mr-2 text-on-surface-variant hover:text-white transition-colors"
      >
        <Menu size={22} />
      </button>
      {typeof document !== "undefined" && createPortal(overlay, document.body)}
    </div>
  );
}
