import WaitlistForm from "./WaitlistForm";

export default function CTA() {
  return (
    <section className="py-24 px-6 bg-[var(--bg-light)]">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <h2 className="text-3xl font-bold text-[var(--primary)]">
          Sé de los primeros en acceder
        </h2>
        <p className="text-[var(--text-secondary)]">
          Niela está en desarrollo. Dejá tu email y te avisamos cuando esté lista.
        </p>
        <div className="flex justify-center">
          <WaitlistForm />
        </div>
      </div>
    </section>
  );
}
