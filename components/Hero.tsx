import WaitlistForm from "./WaitlistForm";
import HeroSphere from "./HeroSphere";
import MobileMockup from "./MobileMockup";
import { getWaitlistCount } from "@/lib/waitlist";

export default async function Hero() {
  const count = await getWaitlistCount();

  return (
    <section
      id="waitlist"
      className="min-h-screen flex items-center pt-20 pb-16 px-6 bg-[var(--bg-cream)] overflow-hidden"
    >
      <div className="max-w-5xl mx-auto w-full grid lg:grid-cols-2 gap-12 items-center">
        {/* Left — copy + form */}
        <div className="space-y-6 text-center lg:text-left">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--accent-blue)]/25 text-[var(--primary)] text-xs font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
            Próximamente en español
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-[var(--primary)] leading-[1.1] tracking-tight">
            Medita con
            <br />
            <span className="text-[var(--accent-blue)] drop-shadow-sm">propósito</span>
          </h1>

          <p className="text-lg text-[var(--text-secondary)] max-w-lg lg:max-w-none leading-relaxed">
            Guías de meditación en español organizadas por tradición y propósito.
            Encuentra la práctica que resuena contigo.
          </p>

          {/* Form */}
          <div className="flex flex-col items-center lg:items-start gap-3">
            <WaitlistForm />
            {count > 0 && (
              <p className="text-sm text-[var(--text-secondary)]">
                <span className="font-semibold text-[var(--primary)]">{count}</span>{" "}
                personas ya en la lista
              </p>
            )}
          </div>

          {/* Trust badges */}
          <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-2">
            {[
              "Sin tarjeta requerida",
              "Acceso anticipado gratuito",
              "Solo en español",
            ].map((b) => (
              <span
                key={b}
                className="flex items-center gap-1.5 text-xs text-[var(--text-secondary)]"
              >
                <svg className="w-3.5 h-3.5 text-[var(--accent-green)] flex-shrink-0" fill="none" viewBox="0 0 16 16">
                  <path
                    d="M3 8l3.5 3.5L13 5"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                {b}
              </span>
            ))}
          </div>
        </div>

        {/* Right — visuals */}
        <div className="flex justify-center items-center relative">
          <HeroSphere />
          <div className="absolute -bottom-4 -right-2 sm:right-4 lg:-right-4 drop-shadow-2xl">
            <MobileMockup />
          </div>
        </div>
      </div>
    </section>
  );
}
