"use client";

import { useState } from "react";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Sidebar, { type SidebarGroup } from "@/components/course/Sidebar";

/**
 * Mobile-only lesson navigation: a "Lessons" trigger that opens a slide-in
 * drawer wrapping the same {@link Sidebar} used on desktop. Hidden on `lg+`
 * where the persistent sidebar is shown instead.
 */
export default function MobileSidebar({
  groups,
  locked = false,
}: {
  groups: SidebarGroup[];
  locked?: boolean;
}) {
  const [open, setOpen] = useState(false);

  return (
    <div className="lg:hidden">
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 mx-gutter mt-4 px-3 py-2 rounded-lg border border-white/10 bg-white/5 text-sm text-on-surface-variant hover:text-white transition-colors"
      >
        <Menu size={16} /> Lessons
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="fixed inset-0 z-70 bg-black/60 backdrop-blur-sm"
              onClick={() => setOpen(false)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            />
            <motion.aside
              className="fixed left-0 top-0 bottom-0 z-71 w-72 max-w-[80vw] bg-surface-container border-r border-white/10 p-4 overflow-y-auto"
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
            >
              <div className="flex justify-between items-center mb-4">
                <span className="font-semibold text-white">Lessons</span>
                <button
                  onClick={() => setOpen(false)}
                  className="p-1 rounded-md text-on-surface-variant hover:text-white hover:bg-white/10 transition-colors"
                  aria-label="Close menu"
                >
                  <X size={18} />
                </button>
              </div>
              {/* Close the drawer when a lesson link is tapped. */}
              <div onClick={() => setOpen(false)}>
                <Sidebar groups={groups} locked={locked} />
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
