"use client";

import { motion } from "framer-motion";

const traditions = [
  { name: "Zen", desc: "Presencia plena en el instante.", bg: "#a6c8dc", text: "#1f2d3a" },
  { name: "Budismo Tibetano", desc: "Compasión y visualización.", bg: "#d4b896", text: "#1f2d3a" },
  { name: "Andina", desc: "Armonía con la naturaleza y la Pachamama.", bg: "#b8c9a8", text: "#1f2d3a" },
  { name: "Sufí", desc: "Devoción y amor espiritual.", bg: "#c4a8d4", text: "#1f2d3a" },
  { name: "Cristiana", desc: "Contemplación y silencio interior.", bg: "#d4c4a8", text: "#1f2d3a" },
  { name: "Islámica", desc: "Dhikr y remembranza de lo sagrado.", bg: "#a8d4c4", text: "#1f2d3a" },
  { name: "Laica", desc: "Ciencia, respiración y atención plena.", bg: "#e8f1f5", text: "#1f2d3a" },
];

export default function Traditions() {
  return (
    <section className="py-24 px-6 bg-[var(--bg-cream)]">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl sm:text-4xl font-bold text-[var(--primary)]">
            Múltiples tradiciones
          </h2>
          <p className="mt-3 text-[var(--text-secondary)] max-w-xl mx-auto">
            Niela reúne las grandes tradiciones contemplativas del mundo para que explores la que más resuena contigo.
          </p>
        </motion.div>

        <div className="flex flex-wrap justify-center gap-4">
          {traditions.map((t, i) => (
            <motion.div
              key={t.name}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.4 }}
              whileHover={{ scale: 1.05, transition: { duration: 0.15 } }}
              className="rounded-2xl px-6 py-4 text-center min-w-[140px] cursor-default shadow-sm"
              style={{ backgroundColor: t.bg, color: t.text }}
            >
              <p className="font-semibold text-sm">{t.name}</p>
              <p className="text-xs mt-1 opacity-70 leading-snug max-w-[120px] mx-auto">{t.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
