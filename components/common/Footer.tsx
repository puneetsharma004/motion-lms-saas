import Link from "next/link";
import { SITE } from "@/lib/site";

const links = [
  { href: "/pricing", label: "Pricing" },
  { href: "/terms", label: "Terms" },
  { href: "/privacy", label: "Privacy" },
  { href: "/refund", label: "Refunds" },
  { href: "/shipping", label: "Delivery" },
  { href: "/contact", label: "Contact" },
];

export default function Footer() {
  return (
    <footer className="bg-surface-container/85 backdrop-blur-md py-10 mt-20 border-t border-white/10 relative z-10">
      <div className="max-w-[1280px] mx-auto px-gutter flex flex-col gap-6 text-sm">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-center md:text-left">
            <div className="font-bold text-white">{SITE.brand}</div>
            <div className="text-xs text-on-surface-variant">
              {SITE.product} — learn Framer Motion by building.
            </div>
          </div>
          <nav className="flex flex-wrap justify-center gap-x-5 gap-y-2 text-on-surface-variant">
            {links.map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
                {l.label}
              </Link>
            ))}
            <a
              href="https://motion.dev"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              Docs
            </a>
          </nav>
        </div>
        <p className="text-xs text-on-surface-variant/50 text-center md:text-left">
          © {new Date().getFullYear()} {SITE.brand}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
