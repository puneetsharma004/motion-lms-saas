export default function Footer() {
  return (
    <footer className="bg-surface-container/85 backdrop-blur-md text-primary py-10 mt-20 border-t border-white/10 relative z-10">
      <div className="max-w-[1280px] mx-auto px-gutter flex flex-col md:flex-row justify-between items-center gap-6 text-sm">
        <div className="font-bold text-white">Motion Playground</div>
        <div className="flex gap-6 text-on-surface-variant">
          <a
            href="https://motion.dev"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white transition-colors"
          >
            Documentation
          </a>
        </div>
      </div>
    </footer>
  );
}
