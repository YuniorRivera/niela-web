"use client";

import { motion } from "framer-motion";

const steps = [
  {
    num: "01",
    title: "Elige tu intención",
    desc: "Reducir el estrés, mejorar el sueño, cultivar la gratitud o simplemente estar presente.",
    color: "var(--accent-blue)",
  },
  {
    num: "02",
    title: "Escucha la guía",
    desc: "Meditaciones en español narradas con claridad, desde 5 hasta 45 minutos.",
    color: "var(--accent-green)",
  },
  {
    num: "03",
    title: "Lleva un registro",
    desc: "Sigue tu progreso y descubre qué prácticas te funcionan mejor con el tiempo.",
    color: "var(--accent-amber)",
  },
];

function RippleCard({ step, index }: { step: (typeof steps)[0]; index: number }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.15, duration: 0.5 }}
      className="relative bg-white/60 rounded-2xl p-7 border border-white/80 shadow-sm overflow-hidden"
    >
      {/* Ripple rings */}
      {[1, 2, 3].map((i) => (
        <motion.div
          key={i}
          className="absolute rounded-full border"
          style={{
            borderColor: `${step.color}30`,
            width: i * 60,
            height: i * 60,
            top: "50%",
            left: "50%",
            x: "-50%",
            y: "-50%",
          }}
          animate={{ scale: [1, 1.4, 1], opacity: [0.4, 0, 0.4] }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: i * 0.6 + index * 0.3,
            ease: "easeInOut",
          }}
        />
      ))}

      <div className="relative z-10 space-y-3">
        <span
          className="text-3xl font-black"
          style={{ color: step.color }}
        >
          {step.num}
        </span>
        <h3 className="font-semibold text-[var(--primary)] text-lg">{step.title}</h3>
        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">{step.desc}</p>
      </div>
    </motion.div>
  );
}

export default function HowItWorks() {
  return (
    <section className="py-24 px-6 bg-[var(--bg-light)]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-14"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--primary)]">
            Así funciona
          </h2>
          <p className="mt-3 text-[var(--text-secondary)] max-w-md mx-auto">
            Tres pasos para hacer de la meditación un hábito real.
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-3 gap-6">
          {steps.map((s, i) => (
            <RippleCard key={i} step={s} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}
