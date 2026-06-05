import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: '¡Bienvenido a Niela Plus! — Niela',
  description: 'Tu suscripción a Niela Plus está activa.',
  robots: { index: false, follow: false },
}

const GOLD = '#C8A96E'
const APP_DEEP_LINK = 'niela://home'

export default function PaymentSuccessPage() {
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
        {/* Niela icon — esfera sumi-e */}
        <div
          aria-hidden
          style={{
            width: 84,
            height: 84,
            borderRadius: '50%',
            margin: '0 auto 28px',
            background: `radial-gradient(circle at 35% 30%, ${GOLD}55, ${GOLD}11 70%)`,
            border: `0.5px solid ${GOLD}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: GOLD,
            fontSize: 34,
            fontWeight: 300,
          }}
        >
          ✓
        </div>

        <div style={{ color: GOLD, fontSize: 12, letterSpacing: 2.5, fontWeight: 600, marginBottom: 14 }}>
          NIELA PLUS
        </div>

        <h1 style={{ fontSize: 26, fontWeight: 600, letterSpacing: -0.3, margin: '0 0 14px' }}>
          ¡Bienvenido a Niela Plus!
        </h1>

        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: 300, lineHeight: 1.55, margin: '0 0 32px' }}>
          Tu suscripción está activa. Abre la app para empezar.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
          <a
            href={APP_DEEP_LINK}
            style={{
              display: 'inline-block',
              padding: '14px 32px',
              borderRadius: 999,
              background: GOLD,
              color: '#1a1a1a',
              fontSize: 15,
              fontWeight: 600,
              letterSpacing: 0.2,
              textDecoration: 'none',
              minWidth: 200,
            }}
          >
            Abrir Niela
          </a>
          <Link
            href="/"
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: 13,
              textDecoration: 'none',
              padding: 8,
            }}
          >
            Ir a niela.app
          </Link>
        </div>
      </div>
    </main>
  )
}
