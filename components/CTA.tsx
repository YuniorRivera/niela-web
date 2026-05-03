import WaitlistForm from "./WaitlistForm";
import { getWaitlistCount } from "@/lib/waitlist";

export default async function CTA() {
  const count = await getWaitlistCount();

  return (
    <section className="py-24 px-6 bg-[var(--primary)]">
      <div className="max-w-2xl mx-auto text-center space-y-7">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 text-white/80 text-xs font-medium">
          <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-green)] animate-pulse" />
          Acceso anticipado
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold text-white leading-tight">
          Sé de los primeros
          <br />
          en acceder
        </h2>

        <p className="text-white/60 text-lg max-w-md mx-auto leading-relaxed">
          Niela está en desarrollo. Deja tu email y te avisamos cuando abramos el acceso.
        </p>

        <div className="flex flex-col items-center gap-3">
          <WaitlistForm dark />
          {count > 0 && (
            <p className="text-sm text-white/50">
              <span className="font-semibold text-white/80">{count}</span> personas ya en la lista
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
