"use client";

import { motion } from "framer-motion";

const traditions = [
  { name: "Zen", desc: "Presencia plena en el momento.", color: "var(--accent-blue)" },
  { name: "Budismo Tibetano", desc: "Compasión y visualización.", color: "var(--accent-amber)" },
  { name: "Vipassana", desc: "Observación clara de la mente.", color: "var(--accent-green)" },
  { name: "Mindfulness", desc: "Atención abierta y sin juicio.", color: "var(--accent-blue)" },
  { name: "Vedanta", desc: "Autoindagación y no-dualidad.", color: "var(--accent-amber)" },
];

export default function Traditions() {
  return (
    <section className="py-24 px-6 bg-[var(--bg-cream)]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-[var(--primary)] text-center mb-4">
          Múltiples tradiciones
        </h2>
        <p className="text-center text-[var(--text-secondary)] mb-12 max-w-xl mx-auto">
          Niela reúne las grandes tradiciones contemplativas para que explorés la que más resuena con vos.
        </p>
        <div className="flex flex-wrap justify-center gap-4">
          {traditions.map((t, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              className="rounded-2xl px-6 py-4 border text-center min-w-[140px]"
              style={{ borderColor: t.color, background: `${t.color}22` }}
            >
              <p className="font-semibold text-[var(--primary)] text-sm">{t.name}</p>
              <p className="text-xs text-[var(--text-secondary)] mt-1">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
