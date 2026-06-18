import Link from "next/link";
import Navbar from "@/components/common/Navbar";
import { requireAdmin } from "@/lib/admin";

export const metadata = { title: "Admin — The Coders Playground" };

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin(); // redirects non-admins

  const nav = [
    { href: "/admin", label: "Overview" },
    { href: "/admin/users", label: "Users" },
    { href: "/admin/coupons", label: "Coupons" },
  ];

  return (
    <>
      <Navbar />
      <main className="max-w-[1100px] mx-auto w-full px-gutter py-8 flex-1">
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-7">
          <h1 className="text-lg font-bold text-white">Admin</h1>
          <nav className="flex gap-4 text-sm">
            {nav.map((n) => (
              <Link
                key={n.href}
                href={n.href}
                className="text-on-surface-variant hover:text-white transition-colors"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
        {children}
      </main>
    </>
  );
}
