"use client";

import { useEffect, useState } from "react";
import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackPreview,
  useSandpack,
  type SandpackTheme,
} from "@codesandbox/sandpack-react";
import {
  Settings,
  Eye,
  RotateCcw,
  Play,
  Maximize2,
  Minimize2,
  Check,
  Circle,
  PartyPopper,
} from "lucide-react";
import { useProgress } from "@/lib/useProgress";
import { runChecks } from "@/lib/validators";

export type SandboxFiles = Record<string, string>;

interface SandboxProps {
  /** Lesson slug — used to look up the auto-validation checks. */
  slug: string;
  /** Editable "Practice" file set (filename -> code). */
  starter: SandboxFiles;
  /** Reference "Solution" file set (filename -> code). */
  solution: SandboxFiles;
  /** Extra npm deps for the sandbox. `motion` is included by default. */
  dependencies?: Record<string, string>;
  /** Tailwind accent token name, e.g. "blue" | "violet". Styles the toggle. */
  accent?: string;
}

/**
 * Tailwind CSS v4 input for the preview. Pulls in preflight + utilities, then
 * registers the accent palette + fonts via `@theme` so exercise markup
 * (e.g. `bg-accent-blue`, `text-on-surface-variant`) resolves. v4 is configured
 * with CSS, not the v3 `tailwind.config` JS object.
 */
const PREVIEW_TW_CSS = `@import "tailwindcss";
@theme {
  --font-sans: "Inter", system-ui, sans-serif;
  --font-mono: "JetBrains Mono", monospace;

  --color-on-surface-variant: #cbc3d7;
  --color-primary: #d0bcff;

  --color-accent-blue: #3b82f6;
  --color-accent-violet: #8b5cf6;
  --color-accent-coral: #fb7185;
  --color-accent-lime: #84cc16;
  --color-accent-amber: #f59e0b;
  --color-accent-teal: #14b8a6;
  --color-accent-rose: #f43f5e;
  --color-accent-indigo: #6366f1;
  --color-accent-orange: #f97316;
  --color-accent-cyan: #06b6d4;
}`;

/**
 * Dark shell styling for the preview iframe. Injected at runtime (see INDEX_JS)
 * because Sandpack strips class/style attributes off the index.html <body>.
 * Left unlayered on purpose: unlayered rules win over Tailwind's `@layer base`
 * preflight, so the dark background + centering always stick.
 */
const PREVIEW_SHELL_CSS = `html, body { margin: 0; background: #0d0d0d; color: #e7e0ed; }
body {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  font-family: "Inter", system-ui, sans-serif;
}
#root { width: 100%; display: flex; align-items: center; justify-content: center; }`;

/**
 * Shared HTML shell for every sandbox preview. Tailwind and the dark shell are
 * injected at runtime from the entry module (see INDEX_JS) rather than declared
 * here, because the Sandpack bundler does not reliably execute external scripts
 * or honor <body> attributes placed in index.html.
 */
const PREVIEW_HTML = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet" />
  </head>
  <body>
    <div id="root"></div>
  </body>
</html>`;

/**
 * Entry file shared by every sandbox. Injects the dark shell + the Tailwind v4
 * standalone browser build at runtime (guaranteed to run, unlike a <script> in
 * index.html) then mounts <App /> into #root. The browser build reads the
 * injected @theme <style>, then scans + observes the DOM as React renders.
 */
const INDEX_JS = `import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App";

if (!document.getElementById("preview-shell")) {
  const shell = document.createElement("style");
  shell.id = "preview-shell";
  shell.textContent = ${JSON.stringify(PREVIEW_SHELL_CSS)};
  document.head.appendChild(shell);
}

if (!document.getElementById("tw-theme")) {
  const theme = document.createElement("style");
  theme.id = "tw-theme";
  theme.setAttribute("type", "text/tailwindcss");
  theme.textContent = ${JSON.stringify(PREVIEW_TW_CSS)};
  document.head.appendChild(theme);
}

if (!document.getElementById("tw-cdn")) {
  const cdn = document.createElement("script");
  cdn.id = "tw-cdn";
  cdn.src = "https://cdn.jsdelivr.net/npm/@tailwindcss/browser@4";
  document.head.appendChild(cdn);
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <App />
  </StrictMode>
);`;

/** Editor/preview chrome themed to match the app's Material-dark palette. */
const sandpackTheme: SandpackTheme = {
  colors: {
    surface1: "#1a1720",
    surface2: "#262230",
    surface3: "#2c2832",
    clickable: "#cbc3d7",
    base: "#e7e0ed",
    disabled: "#494454",
    hover: "#ffffff",
    accent: "#d0bcff",
    error: "#ffb4ab",
    errorSurface: "#93000a",
  },
  syntax: {
    plain: "#e7e0ed",
    comment: { color: "#6b6676", fontStyle: "italic" },
    keyword: "#d0bcff",
    tag: "#fb7185",
    punctuation: "#cbc3d7",
    definition: "#84cc16",
    property: "#06b6d4",
    static: "#f59e0b",
    string: "#84cc16",
  },
  font: {
    body: "Inter, system-ui, sans-serif",
    mono: "'JetBrains Mono', monospace",
    size: "13px",
    lineHeight: "20px",
  },
};

const accentClass: Record<string, string> = {
  blue: "bg-accent-blue",
  violet: "bg-accent-violet",
  coral: "bg-accent-coral",
  lime: "bg-accent-lime",
  amber: "bg-accent-amber",
  teal: "bg-accent-teal",
  rose: "bg-accent-rose",
  indigo: "bg-accent-indigo",
  orange: "bg-accent-orange",
  cyan: "bg-accent-cyan",
};

/** Toolbar rendered inside the provider so it can drive the bundler. */
function SandboxBar({
  view,
  accent,
  fullscreen,
  onView,
  onToggleFullscreen,
}: {
  view: "practice" | "solution";
  accent: string;
  fullscreen: boolean;
  onView: (v: "practice" | "solution") => void;
  onToggleFullscreen: () => void;
}) {
  const { sandpack } = useSandpack();
  const activeAccent = accentClass[accent] ?? accentClass.blue;

  return (
    <div className="flex justify-between items-center gap-2 px-3 py-2 border-b border-white/10 bg-black/30">
      <div className="flex bg-black/40 border border-white/5 p-1 rounded-lg">
        <button
          onClick={() => onView("practice")}
          className={`px-2.5 sm:px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            view === "practice"
              ? `${activeAccent} text-white`
              : "text-on-surface-variant hover:text-white"
          }`}
        >
          <Settings size={12} /> Practice
        </button>
        <button
          onClick={() => onView("solution")}
          className={`px-2.5 sm:px-3 py-1 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer ${
            view === "solution"
              ? `${activeAccent} text-white`
              : "text-on-surface-variant hover:text-white"
          }`}
        >
          <Eye size={12} /> Solution
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => sandpack.runSandpack()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-bold bg-accent-lime/15 border border-accent-lime/40 text-accent-lime hover:bg-accent-lime/25 transition-colors cursor-pointer"
          title="Run the code"
        >
          <Play size={12} /> Run
        </button>
        <button
          onClick={() => sandpack.resetAllFiles()}
          className="p-1.5 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
          title="Reset code"
        >
          <RotateCcw size={14} />
        </button>
        <button
          onClick={onToggleFullscreen}
          className="p-1.5 bg-white/5 border border-white/10 rounded-md hover:bg-white/10 text-on-surface-variant hover:text-white transition-colors cursor-pointer"
          title={fullscreen ? "Exit full screen (Esc)" : "Full screen"}
        >
          {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
        </button>
      </div>
    </div>
  );
}

/**
 * Goals checklist for the Practice view. Reads the live Exercise.jsx code and
 * lights up each concept as the student satisfies it (tolerant of any approach
 * — see lib/validators). When every goal is met the lesson is auto-marked done.
 */
function GoalsPanel({ slug, accent }: { slug: string; accent: string }) {
  const { sandpack } = useSandpack();
  const { complete } = useProgress();
  const code = sandpack.files["/Exercise.jsx"]?.code ?? "";
  const { checks, passed, allPassed } = runChecks(slug, code);

  useEffect(() => {
    if (allPassed) complete(slug);
  }, [allPassed, slug, complete]);

  if (checks.length === 0) return null;

  const accentColor = `var(--color-accent-${accent})`;
  const doneCount = passed.filter(Boolean).length;

  return (
    <div className="border-t border-white/10 bg-black/30 px-4 py-3">
      <div className="flex items-center justify-between mb-2.5">
        <span className="font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant/70">
          Goals
        </span>
        <span
          className="text-[11px] font-semibold tabular-nums"
          style={{ color: allPassed ? accentColor : undefined }}
        >
          {doneCount}/{checks.length}
        </span>
      </div>

      {allPassed ? (
        <div
          className="flex items-center gap-2 text-sm font-semibold"
          style={{ color: accentColor }}
        >
          <PartyPopper size={15} /> Nice — all goals met. Lesson marked complete!
        </div>
      ) : (
        <ul className="space-y-1.5">
          {checks.map((c, i) => (
            <li key={c.id} className="flex items-start gap-2 text-xs">
              {passed[i] ? (
                <Check size={14} className="mt-px shrink-0 text-accent-lime" />
              ) : (
                <Circle size={13} className="mt-px shrink-0 text-on-surface-variant/40" />
              )}
              <span className={passed[i] ? "text-on-surface-variant/60" : "text-on-surface-variant"}>
                {c.label}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function Sandbox({
  slug,
  starter,
  solution,
  dependencies,
  accent = "blue",
}: SandboxProps) {
  const [view, setView] = useState<"practice" | "solution">("practice");
  const [fullscreen, setFullscreen] = useState(false);

  const lessonFiles = view === "solution" ? solution : starter;
  const isSolution = view === "solution";

  const files: SandboxFiles = {
    "/public/index.html": PREVIEW_HTML,
    "/index.js": INDEX_JS,
    ...lessonFiles,
  };

  // While full screen: Esc closes it and the page scroll is locked.
  useEffect(() => {
    if (!fullscreen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreen(false);
    };
    window.addEventListener("keydown", onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [fullscreen]);

  const paneHeight = fullscreen ? "calc(100vh - 53px)" : 480;

  return (
    <div
      className={`glass-card border border-white/10 overflow-hidden flex flex-col ${
        fullscreen ? "fixed inset-0 z-80 rounded-none bg-[#0d0d0d]" : "rounded-xl"
      }`}
    >
      <SandpackProvider
        key={view}
        template="react"
        theme={sandpackTheme}
        files={files}
        customSetup={{ dependencies: { motion: "latest", ...dependencies } }}
        options={{
          // Both views render on mount so the preview is never blank. Only the
          // Solution auto-reloads on edits; in Practice the student clicks Run
          // to apply their changes (so it doesn't thrash on every keystroke).
          autorun: true,
          autoReload: isSolution,
          activeFile: "/Exercise.jsx",
          visibleFiles: ["/Exercise.jsx", "/App.js"],
        }}
      >
        <SandboxBar
          view={view}
          accent={accent}
          fullscreen={fullscreen}
          onView={setView}
          onToggleFullscreen={() => setFullscreen((f) => !f)}
        />
        <SandpackLayout className="sandbox-layout">
          <SandpackCodeEditor
            showTabs
            showLineNumbers
            showRunButton={false}
            style={{ height: paneHeight }}
          />
          <SandpackPreview
            showOpenInCodeSandbox={false}
            showRefreshButton
            style={{ height: paneHeight }}
          />
        </SandpackLayout>
        {!isSolution && !fullscreen && <GoalsPanel slug={slug} accent={accent} />}
      </SandpackProvider>
    </div>
  );
}
