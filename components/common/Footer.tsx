import Link from "next/link";
import { SITE } from "@/lib/site";

const product = [
  { href: "/learn", label: "Lessons" },
  { href: "/pricing", label: "Pricing" },
  { href: "/dashboard", label: "Dashboard" },
];

const legal = [
  { href: "/terms", label: "Terms & Conditions" },
  { href: "/privacy", label: "Privacy Policy" },
  { href: "/refund", label: "Refund & Cancellation" },
  { href: "/shipping", label: "Delivery Policy" },
  { href: "/contact", label: "Contact Us" },
];

const linkClass = "text-on-surface-variant hover:text-white transition-colors";
const headClass =
  "font-label-caps text-[10px] uppercase tracking-widest text-on-surface-variant/60 mb-3";

export default function Footer() {
  return (
    <footer className="bg-surface-container/85 backdrop-blur-md py-12 mt-20 border-t border-white/10 relative z-10">
      <div className="max-w-[1280px] mx-auto px-gutter">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="font-bold text-white text-base">{SITE.brand}</div>
            <p className="text-xs text-on-surface-variant mt-1 max-w-xs leading-relaxed">
              {SITE.product} — learn Framer Motion by building real, animated UI
              right in your browser.
            </p>
          </div>

          <div>
            <h4 className={headClass}>Product</h4>
            <ul className="space-y-2 text-sm">
              {product.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href="https://motion.dev"
                  target="_blank"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  Docs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={headClass}>Legal</h4>
            <ul className="space-y-2 text-sm">
              {legal.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className={linkClass}>
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-6 border-t border-white/10 flex flex-col sm:flex-row justify-between gap-2 text-xs text-on-surface-variant/50">
          <span>
            © {new Date().getFullYear()} {SITE.brand}. All rights reserved.
          </span>
          <span>{SITE.legalEntity}</span>
        </div>
      </div>
    </footer>
  );
}
