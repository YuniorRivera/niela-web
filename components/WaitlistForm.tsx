"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { joinWaitlist } from "@/lib/waitlist";

export default function WaitlistForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ text: string; type: "success" | "warn" | "error" } | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const result = await joinWaitlist(email);
      if (result.status === 201) {
        setMessage({ text: `¡Eres el #${result.position} en la lista!`, type: "success" });
        setEmail("");
      } else if (result.status === 409) {
        setMessage({ text: `Ya estás registrado en el puesto #${result.position}`, type: "warn" });
      } else {
        setMessage({ text: "Ocurrió un error. Intentá de nuevo.", type: "error" });
      }
    } catch {
      setMessage({ text: "No pudimos conectar. Intentá de nuevo.", type: "error" });
    } finally {
      setLoading(false);
    }
  }

  const colorMap = {
    success: "text-[var(--accent-green)] font-medium",
    warn: "text-[var(--accent-amber)] font-medium",
    error: "text-red-500 font-medium",
  };

  return (
    <div className="w-full max-w-md">
      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          className="flex-1 px-4 py-3 rounded-xl border border-[var(--accent-blue)] bg-white/70 text-[var(--text-primary)] placeholder-[var(--text-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--accent-blue)] text-sm"
        />
        <button
          type="submit"
          disabled={loading}
          className="px-5 py-3 rounded-xl bg-[var(--primary)] text-white text-sm font-medium hover:bg-[var(--primary)]/90 transition disabled:opacity-60"
        >
          {loading ? "..." : "Unirme"}
        </button>
      </form>
      <AnimatePresence>
        {message && (
          <motion.p
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mt-3 text-sm ${colorMap[message.type]}`}
          >
            {message.text}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}
