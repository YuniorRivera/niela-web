"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const steps = [
  {
    label: "¿Qué necesitas hoy?",
    content: (
      <div className="space-y-2 mt-3">
        {["Reducir el estrés", "Mejorar el sueño", "Cultivar la calma"].map((s, i) => (
          <div
            key={i}
            className={`text-xs px-3 py-2 rounded-lg ${i === 0 ? "bg-[#a6c8dc]/30 border border-[#a6c8dc]/60 font-medium" : "bg-white/40 border border-white/30"}`}
          >
            {s}
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "Elige tradición",
    content: (
      <div className="flex flex-wrap gap-1.5 mt-3">
        {["Zen", "Tibetana", "Andina", "Laica"].map((t, i) => (
          <span
            key={i}
            className={`text-xs px-2.5 py-1 rounded-full ${i === 0 ? "bg-[#2c3e50] text-white" : "bg-white/50 text-[#1f2d3a]"}`}
          >
            {t}
          </span>
        ))}
      </div>
    ),
  },
  {
    label: "Duración",
    content: (
      <div className="flex gap-2 mt-3">
        {["5 min", "15 min", "30 min"].map((d, i) => (
          <div
            key={i}
            className={`flex-1 text-center text-xs py-2 rounded-lg ${i === 1 ? "bg-[#a6c8dc]/40 border border-[#a6c8dc]/70 font-semibold" : "bg-white/30"}`}
          >
            {d}
          </div>
        ))}
      </div>
    ),
  },
  {
    label: "Reproduciendo",
    content: (
      <div className="mt-3 space-y-2">
        <div className="text-xs text-center font-medium text-[#2c3e50]">Calma profunda · Zen</div>
        <div className="h-1 w-full bg-white/30 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-[#a6c8dc] rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: "55%" }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          />
        </div>
        <div className="flex justify-center gap-6 mt-2">
          <span className="text-base">⏮</span>
          <span className="text-base bg-[#2c3e50] text-white w-7 h-7 rounded-full flex items-center justify-center">▶</span>
          <span className="text-base">⏭</span>
        </div>
      </div>
    ),
  },
];

export default function MobileMockup() {
  const [step, setStep] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => (s + 1) % steps.length);
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="relative w-[160px] sm:w-[180px] select-none"
      style={{ perspective: "800px" }}
    >
      {/* Phone frame */}
      <div
        className="rounded-[32px] border-2 border-[#2c3e50]/20 overflow-hidden shadow-2xl"
        style={{
          background: "linear-gradient(145deg, #e8f1f5, #f0ebe0)",
          boxShadow: "0 30px 60px #2c3e5040, 0 0 0 1px #2c3e5015",
        }}
      >
        {/* Notch */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-16 h-1.5 bg-[#2c3e50]/20 rounded-full" />
        </div>

        {/* Screen content */}
        <div className="mx-2 mb-3 rounded-2xl bg-[#f0ebe0]/90 border border-[#a6c8dc]/20 overflow-hidden min-h-[200px] sm:min-h-[220px] p-3">
          {/* Status bar */}
          <div className="flex justify-between text-[9px] text-[#5a6f7d] mb-2">
            <span>9:41</span>
            <span>niela</span>
            <span>●●●</span>
          </div>

          {/* Step indicator */}
          <div className="flex gap-1 mb-2">
            {steps.map((_, i) => (
              <div
                key={i}
                className={`h-0.5 flex-1 rounded-full transition-colors duration-300 ${i === step ? "bg-[#2c3e50]" : "bg-[#2c3e50]/20"}`}
              />
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.3 }}
            >
              <p className="text-[10px] font-semibold text-[#2c3e50]">{steps[step].label}</p>
              {steps[step].content}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Home bar */}
        <div className="flex justify-center pb-3">
          <div className="w-10 h-1 bg-[#2c3e50]/20 rounded-full" />
        </div>
      </div>
    </div>
  );
}
