"use client";

import { motion } from "framer-motion";

export default function HeroSphere() {
  return (
    <div className="relative w-64 h-64 sm:w-80 sm:h-80 flex items-center justify-center">
      {/* Glow central */}
      <div className="absolute inset-0 rounded-full bg-[var(--accent-blue)]/20 blur-2xl" />

      {/* Núcleo */}
      <div
        className="relative w-36 h-36 sm:w-44 sm:h-44 rounded-full"
        style={{
          background:
            "radial-gradient(circle at 35% 35%, #e8f1f5, #a6c8dc 50%, #2c3e50)",
          boxShadow: "0 0 40px #a6c8dc55, inset 0 0 24px #ffffff33",
        }}
      />

      {/* Anillo 1 */}
      <motion.div
        animate={{ rotateZ: 360 }}
        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute rounded-full border border-[var(--accent-blue)]/50"
          style={{
            width: "78%",
            height: "78%",
            transform: "rotateX(70deg)",
          }}
        />
      </motion.div>

      {/* Anillo 2 */}
      <motion.div
        animate={{ rotateZ: -360 }}
        transition={{ duration: 18, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute rounded-full border border-[var(--accent-green)]/40"
          style={{
            width: "92%",
            height: "92%",
            transform: "rotateX(55deg) rotateZ(30deg)",
          }}
        />
      </motion.div>

      {/* Anillo 3 */}
      <motion.div
        animate={{ rotateZ: 360 }}
        transition={{ duration: 24, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 flex items-center justify-center"
        style={{ transformStyle: "preserve-3d" }}
      >
        <div
          className="absolute rounded-full border border-[var(--accent-amber)]/30"
          style={{
            width: "110%",
            height: "110%",
            transform: "rotateX(60deg) rotateZ(-20deg)",
          }}
        />
      </motion.div>

      {/* Partículas orbitando */}
      {[0, 120, 240].map((deg, i) => (
        <motion.div
          key={i}
          animate={{ rotate: 360 }}
          transition={{ duration: 10 + i * 3, repeat: Infinity, ease: "linear" }}
          className="absolute inset-0"
          style={{ transformOrigin: "center" }}
        >
          <div
            className="absolute w-2 h-2 rounded-full bg-[var(--accent-blue)]"
            style={{
              top: "50%",
              left: "50%",
              transform: `rotate(${deg}deg) translateX(120px) translateY(-4px)`,
              opacity: 0.7,
            }}
          />
        </motion.div>
      ))}
    </div>
  );
}
