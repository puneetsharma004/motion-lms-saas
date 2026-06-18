import Navbar from "@/components/common/Navbar";
import Footer from "@/components/common/Footer";

/** Shared shell for the legal/policy pages. */
export default function LegalPage({
  title,
  updated,
  children,
}: {
  title: string;
  updated: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main className="flex-1 max-w-3xl w-full mx-auto px-gutter py-12">
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">{title}</h1>
        <p className="text-xs text-on-surface-variant/60 mb-8">Last updated: {updated}</p>
        <div className="space-y-4 text-sm text-on-surface-variant leading-relaxed [&_h2]:text-white [&_h2]:font-bold [&_h2]:text-lg [&_h2]:mt-8 [&_h2]:mb-2 [&_a]:text-primary [&_a]:underline [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_strong]:text-white">
          {children}
        </div>
      </main>
      <Footer />
    </>
  );
}
