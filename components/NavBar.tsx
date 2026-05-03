"use client";

import { motion } from "framer-motion";

export default function NavBar() {
  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 inset-x-0 z-50 bg-[var(--bg-cream)]/90 backdrop-blur border-b border-[var(--accent-blue)]/30"
    >
      <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
        <span className="font-semibold text-[var(--primary)] text-lg tracking-tight">
          niela
        </span>
        <a
          href="#waitlist"
          className="text-sm px-4 py-1.5 rounded-full bg-[var(--primary)] text-white hover:bg-[var(--primary)]/90 transition"
        >
          Unirme
        </a>
      </div>
    </motion.nav>
  );
}
