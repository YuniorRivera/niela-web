export default function Footer() {
  return (
    <footer className="py-10 px-6 bg-[var(--primary)]">
      <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-white/40">
        <span className="font-semibold text-white/70 text-base tracking-tight">niela</span>

        <div className="flex items-center gap-6">
          <a
            href="https://instagram.com/niela.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 transition-colors"
          >
            Instagram
          </a>
          <a
            href="https://tiktok.com/@niela.app"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-white/70 transition-colors"
          >
            TikTok
          </a>
          <a
            href="/privacidad"
            className="hover:text-white/70 transition-colors"
          >
            Privacidad
          </a>
        </div>

        <span>© {new Date().getFullYear()} Niela</span>
      </div>
    </footer>
  );
}
