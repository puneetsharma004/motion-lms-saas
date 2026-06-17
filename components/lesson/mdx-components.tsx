import type { ComponentProps, ReactNode } from "react";
import { Sparkles } from "lucide-react";

/** Highlighted instructions box used inside lesson MDX. */
export function Instructions({ children }: { children: ReactNode }) {
  return (
    <div className="not-prose bg-white/5 border border-white/10 p-4 rounded-xl my-6 space-y-3">
      <h4 className="text-xs font-bold uppercase tracking-wider text-primary flex items-center gap-1.5">
        <Sparkles size={12} /> Instructions
      </h4>
      <div className="text-sm text-on-surface-variant leading-relaxed space-y-2">
        {children}
      </div>
    </div>
  );
}

export const mdxComponents = {
  Instructions,
  h1: (props: ComponentProps<"h1">) => (
    <h1 className="text-3xl font-bold text-white mb-4" {...props} />
  ),
  h2: (props: ComponentProps<"h2">) => (
    <h2 className="text-xl font-bold text-white mt-8 mb-3" {...props} />
  ),
  h3: (props: ComponentProps<"h3">) => (
    <h3 className="text-base font-bold text-white mt-6 mb-2" {...props} />
  ),
  p: (props: ComponentProps<"p">) => (
    <p className="text-sm text-on-surface-variant leading-relaxed my-3" {...props} />
  ),
  ul: (props: ComponentProps<"ul">) => (
    <ul className="list-disc pl-5 text-sm text-on-surface-variant space-y-1.5 my-3" {...props} />
  ),
  ol: (props: ComponentProps<"ol">) => (
    <ol className="list-decimal pl-5 text-sm text-on-surface-variant space-y-1.5 my-3" {...props} />
  ),
  a: (props: ComponentProps<"a">) => (
    <a className="text-primary underline underline-offset-2 hover:text-white transition-colors" {...props} />
  ),
  strong: (props: ComponentProps<"strong">) => (
    <strong className="text-white font-semibold" {...props} />
  ),
  code: (props: ComponentProps<"code">) => (
    <code className="text-primary bg-white/5 px-1.5 py-0.5 rounded text-[0.85em] font-mono" {...props} />
  ),
  pre: (props: ComponentProps<"pre">) => (
    <pre className="bg-[#1a1a1a] border border-white/10 rounded-lg p-4 overflow-x-auto text-xs font-mono my-4 leading-relaxed" {...props} />
  ),
};
