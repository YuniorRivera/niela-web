import { motion } from "framer-motion";
import WaitlistForm from "./WaitlistForm";
import { getWaitlistCount } from "@/lib/waitlist";

export default async function Hero() {
  const count = await getWaitlistCount();

  return (
    <section
      id="waitlist"
      className="min-h-screen flex flex-col items-center justify-center pt-20 pb-24 px-6 text-center bg-[var(--bg-cream)]"
    >
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--accent-blue)]/30 text-[var(--primary)] text-xs font-medium mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] inline-block" />
          Próximamente en español
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-[var(--primary)] leading-tight">
          Medita con propósito
        </h1>
        <p className="text-lg text-[var(--text-secondary)] max-w-xl mx-auto">
          Guías de meditación en español, organizadas por tradición y propósito.
          Encontrá la práctica que resuena con vos.
        </p>

        <div className="flex flex-col items-center gap-4 pt-2">
          <WaitlistForm />
          {count > 0 && (
            <p className="text-sm text-[var(--text-secondary)]">
              <span className="font-semibold text-[var(--primary)]">{count}</span> personas ya en la lista
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
