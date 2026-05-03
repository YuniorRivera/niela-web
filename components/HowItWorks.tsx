"use client";

import { motion } from "framer-motion";

const steps = [
  {
    icon: "🎯",
    title: "Elegí tu intención",
    desc: "Reducir el estrés, mejorar el sueño, cultivar la gratitud o simplemente estar presente.",
  },
  {
    icon: "🎧",
    title: "Escuchá la guía",
    desc: "Meditaciones en español narradas con claridad, desde 5 hasta 45 minutos.",
  },
  {
    icon: "📓",
    title: "Llevá un registro",
    desc: "Seguí tu progreso y descubrí qué prácticas te funcionan mejor con el tiempo.",
  },
];

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-[var(--bg-light)]">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-[var(--primary)] text-center mb-12">
          Así funciona
        </h2>
        <div className="grid sm:grid-cols-3 gap-8">
          {steps.map((s, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className="bg-white/70 rounded-2xl p-6 text-center space-y-3 border border-[var(--accent-blue)]/20"
            >
              <span className="text-4xl">{s.icon}</span>
              <h3 className="font-semibold text-[var(--primary)]">{s.title}</h3>
              <p className="text-sm text-[var(--text-secondary)]">{s.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
