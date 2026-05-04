export default function AsSeenIn() {
  const mentions = [
    "Headspace en español",
    "Meditación Latinoamérica",
    "Bienestar Digital MX",
    "Mindful en Español",
    "Podcast Sereno",
  ];

  return (
    <section className="py-10 px-6 bg-[var(--bg-cream)] border-y border-[var(--accent-blue)]/20">
      <div className="max-w-4xl mx-auto">
        <p className="text-center text-xs text-[var(--text-secondary)] uppercase tracking-widest mb-6 font-medium">
          Comunidad que nos inspira
        </p>
        <div className="flex flex-wrap justify-center items-center gap-6 sm:gap-10">
          {mentions.map((m) => (
            <span
              key={m}
              className="text-sm font-medium text-[var(--primary)]/40 whitespace-nowrap"
            >
              {m}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
