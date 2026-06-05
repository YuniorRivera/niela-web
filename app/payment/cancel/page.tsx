import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Pago cancelado — Niela',
  description: 'No se realizó ningún cargo.',
  robots: { index: false, follow: false },
}

const GOLD = '#C8A96E'

export default function PaymentCancelPage() {
  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0A0A0F',
        color: '#FFFFFF',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      }}
    >
      <div
        style={{
          maxWidth: 460,
          width: '100%',
          textAlign: 'center',
          padding: '48px 28px',
          borderRadius: 20,
          border: '0.5px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.025)',
        }}
      >
        {/* Niela icon — esfera sumi-e, atenuada */}
        <div
          aria-hidden
          style={{
            width: 84,
            height: 84,
            borderRadius: '50%',
            margin: '0 auto 28px',
            background: `radial-gradient(circle at 35% 30%, ${GOLD}33, ${GOLD}08 70%)`,
            border: '0.5px solid rgba(255,255,255,0.15)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'rgba(255,255,255,0.5)',
            fontSize: 34,
            fontWeight: 300,
          }}
        >
          ○
        </div>

        <div style={{ color: GOLD, fontSize: 12, letterSpacing: 2.5, fontWeight: 600, marginBottom: 14 }}>
          NIELA
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.3, margin: '0 0 14px' }}>
          Pago cancelado
        </h1>

        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: 300, lineHeight: 1.55, margin: '0 0 32px' }}>
          No se realizó ningún cargo. Puedes suscribirte cuando quieras.
        </p>

        <Link
          href="/"
          style={{
            display: 'inline-block',
            padding: '14px 32px',
            borderRadius: 999,
            background: 'rgba(255,255,255,0.05)',
            border: '0.5px solid rgba(255,255,255,0.15)',
            color: '#FFFFFF',
            fontSize: 15,
            fontWeight: 500,
            textDecoration: 'none',
            minWidth: 200,
          }}
        >
          Volver
        </Link>
      </div>
    </main>
  )
}
