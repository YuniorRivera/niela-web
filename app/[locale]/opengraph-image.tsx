import { ImageResponse } from 'next/og'
import { getTranslations } from 'next-intl/server'

// Imagen que se ve al compartir el enlace. Se genera aquí en vez de guardar un
// .jpg: así cambia con el idioma y no se queda desfasada como la anterior
// (/og-image.jpg, que además daba 404).
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'
export const alt = 'Niela'

export default async function Image({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const t = await getTranslations({ locale, namespace: 'meta' })

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
          justifyContent: 'center', padding: '80px 90px',
          background: 'linear-gradient(160deg, #0A0E14 0%, #0c1420 60%, #0A0E14 100%)',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', color: '#D4A857', fontSize: 34, letterSpacing: 2, marginBottom: 36 }}>
          niela
        </div>
        <div style={{ display: 'flex', color: '#ffffff', fontSize: 62, lineHeight: 1.15, maxWidth: 940 }}>
          {t('ogTitle')}
        </div>
        <div style={{ display: 'flex', color: 'rgba(255,255,255,0.55)', fontSize: 28, marginTop: 34 }}>
          niela.app
        </div>
      </div>
    ),
    size,
  )
}
