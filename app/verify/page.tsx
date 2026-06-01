import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Verificación de email — Niela',
  description: 'Confirmá tu email para activar tu cuenta de Niela.',
  robots: { index: false, follow: false },
}

type Status = 'success' | 'already' | 'expired' | 'invalid' | 'unknown'

const COPY: Record<Status, { title: string; body: string; tone: 'ok' | 'warn' | 'err' }> = {
  success: {
    title: 'Email confirmado ✓',
    body: 'Tu cuenta de Niela ya está activa. Abrí Niela en tu teléfono y empezá a meditar.',
    tone: 'ok',
  },
  already: {
    title: 'Ya estaba verificada',
    body: 'Tu email ya estaba confirmado. Abrí Niela en tu teléfono cuando quieras.',
    tone: 'ok',
  },
  expired: {
    title: 'El link expiró',
    body: 'Los links de verificación duran 24 horas. Pedile a la app que te envíe uno nuevo desde el banner de tu pantalla principal.',
    tone: 'warn',
  },
  invalid: {
    title: 'Link inválido',
    body: 'No pudimos verificar este link. Si copiaste la URL a mano, revisá que esté completa o reintentá desde tu email.',
    tone: 'err',
  },
  unknown: {
    title: 'Verificación de email',
    body: 'Si querés confirmar tu email, abrí el link que te llegó por mail.',
    tone: 'warn',
  },
}

// Deep link scheme de la app mobile (definido en app.config.js: scheme: "niela")
const APP_DEEP_LINK = 'niela://'

export default async function VerifyPage({
  searchParams,
}: { searchParams: Promise<{ status?: string }> }) {
  const { status: raw } = await searchParams
  const valid: Status[] = ['success', 'already', 'expired', 'invalid']
  const status: Status = (valid.includes(raw as Status) ? raw : 'unknown') as Status
  const c = COPY[status]

  const accent =
    c.tone === 'ok'   ? '#D4A857' :
    c.tone === 'warn' ? '#E8B872' : '#E8736B'

  return (
    <main
      style={{
        minHeight: '100vh',
        background: '#0A0E14',
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
          padding: '40px 28px',
          borderRadius: 20,
          border: '0.5px solid rgba(255,255,255,0.1)',
          background: 'rgba(255,255,255,0.025)',
        }}
      >
        <div
          aria-hidden
          style={{
            width: 72,
            height: 72,
            borderRadius: '50%',
            margin: '0 auto 24px',
            background: `${accent}22`,
            border: `0.5px solid ${accent}55`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: accent,
            fontSize: 32,
          }}
        >
          {c.tone === 'ok' ? '✓' : c.tone === 'warn' ? '!' : '×'}
        </div>

        <div style={{ color: accent, fontSize: 12, letterSpacing: 2.5, fontWeight: 600, marginBottom: 14 }}>
          NIELA
        </div>

        <h1 style={{ fontSize: 24, fontWeight: 600, letterSpacing: -0.3, margin: '0 0 12px' }}>
          {c.title}
        </h1>

        <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, fontWeight: 300, lineHeight: 1.55, margin: '0 0 28px' }}>
          {c.body}
        </p>

        {(status === 'success' || status === 'already') ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, alignItems: 'center' }}>
            {/* CTA principal: abrir la app via deep link niela:// */}
            <a
              href={APP_DEEP_LINK}
              style={{
                display: 'inline-block',
                padding: '14px 32px',
                borderRadius: 999,
                background: '#D4A857',
                color: '#1a1a1a',
                fontSize: 15,
                fontWeight: 600,
                letterSpacing: 0.2,
                textDecoration: 'none',
                minWidth: 200,
              }}
            >
              Abrí Niela
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
        ) : (
          <Link
            href="/"
            style={{
              display: 'inline-block',
              padding: '13px 24px',
              borderRadius: 999,
              background: 'rgba(255,255,255,0.05)',
              border: '0.5px solid rgba(255,255,255,0.15)',
              color: '#FFFFFF',
              fontSize: 14,
              fontWeight: 500,
              textDecoration: 'none',
            }}
          >
            Ir a niela.app
          </Link>
        )}
      </div>
    </main>
  )
}
