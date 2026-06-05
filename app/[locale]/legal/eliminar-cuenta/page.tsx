import { getTranslations } from 'next-intl/server'
import type { Metadata } from 'next'

type Props = { params: Promise<{ locale: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'deleteAccount' })
  const privacyUrls: Record<string, string> = {
    es: '/es/legal/privacidad',
    en: '/en/legal/privacidad',
    it: '/it/legal/privacidad',
  }
  return {
    title: t('metaTitle'),
    description: t('metaDesc'),
    alternates: {
      canonical: `https://niela.app/${locale}/legal/eliminar-cuenta`,
      languages: {
        'es': 'https://niela.app/es/legal/eliminar-cuenta',
        'en': 'https://niela.app/en/legal/eliminar-cuenta',
        'it': 'https://niela.app/it/legal/eliminar-cuenta',
      },
    },
  }
}

export function generateStaticParams() {
  return [{ locale: 'es' }, { locale: 'en' }, { locale: 'it' }]
}

export default async function DeleteAccountPage({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'deleteAccount' })

  const privacyUrl = `/legal/privacidad`

  return (
    <div style={{ background: '#f0ebe0', minHeight: '100vh' }}>
      {/* Nav */}
      <nav style={{
        padding: '20px 40px',
        borderBottom: '1px solid rgba(44,62,80,0.1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}>
        <a href={`/${locale}`} style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{
            width: 28, height: 28, borderRadius: '50%',
            background: 'linear-gradient(135deg, #a6c8dc 0%, #b8c9a8 60%, #d4b896 100%)',
            position: 'relative', flexShrink: 0,
          }}>
            <div style={{
              position: 'absolute', top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 10, height: 10, borderRadius: '50%', background: '#f5f1ea',
            }} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 500, color: '#2c3e50', letterSpacing: '0.5px' }}>niela</span>
        </a>
        <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#5a6f7d' }}>
          <a href="/legal/terminos"  style={{ color: '#5a6f7d', textDecoration: 'none' }}>Términos</a>
          <a href="/legal/privacidad" style={{ color: '#5a6f7d', textDecoration: 'none' }}>Privacidad</a>
          <a href="/legal/cookies"   style={{ color: '#5a6f7d', textDecoration: 'none' }}>Cookies</a>
        </div>
      </nav>

      {/* Content */}
      <main style={{ maxWidth: 720, margin: '0 auto', padding: '80px 24px 80px', color: '#1f2d3a', lineHeight: 1.75, fontSize: 15 }}>

        {/* Title */}
        <h1 style={{ fontSize: 32, fontWeight: 500, color: '#2c3e50', marginBottom: 12, letterSpacing: '-0.5px' }}>
          {t('title')}
        </h1>
        <p style={{ color: '#3d4f5e', marginBottom: 40, lineHeight: 1.75 }}>
          {t('intro')}
        </p>

        {/* Data deleted */}
        <h2 style={{
          fontSize: 20, fontWeight: 600, color: '#2c3e50',
          marginBottom: 12, paddingBottom: 6,
          borderBottom: '1px solid rgba(44,62,80,0.1)',
        }}>
          {t('dataTitle')}
        </h2>
        <ul style={{ paddingLeft: 20, marginBottom: 40, color: '#3d4f5e' }}>
          {(['data1','data2','data3','data4','data5'] as const).map(k => (
            <li key={k} style={{ marginBottom: 6, lineHeight: 1.6 }}>{t(k)}</li>
          ))}
        </ul>

        {/* How to delete */}
        <h2 style={{
          fontSize: 20, fontWeight: 600, color: '#2c3e50',
          marginBottom: 20, paddingBottom: 6,
          borderBottom: '1px solid rgba(44,62,80,0.1)',
        }}>
          {t('howTitle')}
        </h2>

        {/* Option 1 */}
        <div style={{
          background: 'rgba(44,62,80,0.04)',
          border: '1px solid rgba(44,62,80,0.1)',
          borderRadius: 12,
          padding: '24px 28px',
          marginBottom: 16,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#2c3e50', marginBottom: 10 }}>
            {t('opt1Title')}
          </h3>
          <p style={{ color: '#3d4f5e', marginBottom: 12 }}>{t('opt1Desc')}</p>
          <div style={{
            background: 'rgba(44,62,80,0.07)',
            borderRadius: 8,
            padding: '12px 16px',
            fontFamily: 'monospace',
            fontSize: 14,
            color: '#2c3e50',
            letterSpacing: '0.2px',
          }}>
            {t('opt1Step')}
          </div>
        </div>

        {/* Option 2 */}
        <div style={{
          background: 'rgba(44,62,80,0.04)',
          border: '1px solid rgba(44,62,80,0.1)',
          borderRadius: 12,
          padding: '24px 28px',
          marginBottom: 40,
        }}>
          <h3 style={{ fontSize: 16, fontWeight: 600, color: '#2c3e50', marginBottom: 10 }}>
            {t('opt2Title')}
          </h3>
          <p style={{ color: '#3d4f5e', marginBottom: 4 }}>
            {t('opt2Desc')}{' '}
            <a
              href={`mailto:${t('opt2Email')}?subject=${encodeURIComponent(t('opt2Subject'))}`}
              style={{ color: '#4a6b80', textDecoration: 'underline', fontWeight: 500 }}
            >
              {t('opt2Email')}
            </a>
            {' '}{t('opt2WithSubject')}{' '}
            <strong style={{ color: '#1f2d3a' }}>"{t('opt2Subject')}"</strong>
          </p>
          <p style={{ color: '#3d4f5e', marginBottom: 0 }}>{t('opt2Details')}</p>
        </div>

        {/* Legal note */}
        <div style={{
          borderLeft: '3px solid #d4b896',
          paddingLeft: 16,
          marginBottom: 40,
          background: 'rgba(212,184,150,0.08)',
          borderRadius: '0 8px 8px 0',
          padding: '16px 16px 16px 20px',
        }}>
          <p style={{ color: '#5a6f7d', margin: 0, lineHeight: 1.7, fontSize: 14 }}>
            ⚠️ {t('legalNote')}
          </p>
        </div>

        {/* Privacy link */}
        <p style={{ marginBottom: 0 }}>
          <a
            href={privacyUrl}
            style={{ color: '#4a6b80', textDecoration: 'underline' }}
          >
            {t('privacyLink')}
          </a>
        </p>
      </main>

      {/* Footer */}
      <footer style={{
        padding: '24px 40px',
        borderTop: '1px solid rgba(44,62,80,0.1)',
        textAlign: 'center',
        fontSize: 13,
        color: '#5a6f7d',
      }}>
        <a href={`/${locale}`} style={{ color: '#2c3e50', textDecoration: 'none', fontWeight: 500 }}>
          {t('back')}
        </a>
      </footer>
    </div>
  )
}
