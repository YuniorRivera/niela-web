import { getTranslations } from 'next-intl/server'
import { LangSwitcher } from '@/components/LangSwitcher'

// Portada de niela.app. Secciones en una columna, sin comparativas con otras
// apps ni promesas de futuro: solo lo que la app hace hoy.
const APP_STORE_URL = 'https://apps.apple.com/app/id6783303694'
const SUPPORT_EMAIL = 'soporte@niela.app'

// Misma paleta que la app: fondo casi negro y dorado de acento.
const BG = '#0A0E14'
const GOLD = '#D4A857'
const TEXT = '#ffffff'
const MUTED = 'rgba(255,255,255,0.62)'
const FAINT = 'rgba(255,255,255,0.38)'
const LINE = 'rgba(255,255,255,0.10)'

type Props = { params: Promise<{ locale: string }> }

// Botón de descarga con el logotipo de Apple y el texto traducido.
function AppStoreButton({ label }: { label: string }) {
  return (
    <a
      href={APP_STORE_URL}
      target="_blank"
      rel="noopener"
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 10,
        background: TEXT, color: '#000', textDecoration: 'none',
        padding: '14px 24px', borderRadius: 999, fontSize: 15.5, fontWeight: 600,
        minHeight: 48,
      }}
    >
      <svg width="18" height="22" viewBox="0 0 384 512" fill="currentColor" aria-hidden="true">
        <path d="M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z" />
      </svg>
      {label}
    </a>
  )
}

function Section({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <section id={id} style={{ maxWidth: 820, margin: '0 auto', padding: '68px 24px', borderTop: `1px solid ${LINE}` }}>
      {children}
    </section>
  )
}

function Title({ children }: { children: React.ReactNode }) {
  return (
    <h2 style={{ fontSize: 30, lineHeight: 1.2, fontWeight: 400, color: TEXT, margin: '0 0 20px', letterSpacing: '-0.5px' }}>
      {children}
    </h2>
  )
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: 12 }}>
      {items.map((text) => (
        <li key={text} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
          <span style={{ color: GOLD, fontSize: 14, lineHeight: '24px' }}>✦</span>
          <span style={{ color: MUTED, fontSize: 16, lineHeight: 1.55 }}>{text}</span>
        </li>
      ))}
    </ul>
  )
}

export default async function Home({ params }: Props) {
  const { locale } = await params
  const t = await getTranslations({ locale })

  return (
    <main style={{ background: BG, minHeight: '100vh', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      {/* ── Cabecera ── */}
      <header style={{ position: 'sticky', top: 0, zIndex: 10, background: 'rgba(10,14,20,0.92)', backdropFilter: 'blur(8px)', borderBottom: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '12px 24px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <a href={locale === 'es' ? '/' : `/${locale}`} style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
            {/* Logotipo actual de la app (la doble onda). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/niela-logo.png" alt="Niela" width={30} height={30} style={{ display: 'block' }} />
            <span style={{ color: GOLD, fontSize: 17, fontWeight: 600, letterSpacing: '0.5px' }}>niela</span>
          </a>
          <nav className="nav-links" style={{ display: 'flex', gap: 18, marginLeft: 'auto' }}>
            <a href="#tradiciones" style={{ color: FAINT, fontSize: 13.5, textDecoration: 'none' }}>{t('nav.tradiciones')}</a>
            <a href="#como-funciona" style={{ color: FAINT, fontSize: 13.5, textDecoration: 'none' }}>{t('nav.comoFunciona')}</a>
            <a href="#precio" style={{ color: FAINT, fontSize: 13.5, textDecoration: 'none' }}>{t('nav.precio')}</a>
          </nav>
          <div style={{ marginLeft: 'auto' }}><LangSwitcher /></div>
        </div>
      </header>

      {/* ── 1. Inicio ── */}
      <section style={{ maxWidth: 820, margin: '0 auto', padding: '72px 24px 56px' }}>
        <h1 style={{ fontSize: 42, lineHeight: 1.12, fontWeight: 400, color: TEXT, margin: '0 0 20px', letterSpacing: '-1px' }}>
          {t('hero.title')}
        </h1>
        <p style={{ fontSize: 18, lineHeight: 1.6, color: MUTED, margin: '0 0 32px', maxWidth: 620 }}>
          {t('hero.subtitle')}
        </p>
        <AppStoreButton label={t('hero.cta')} />
        <p style={{ fontSize: 13, color: FAINT, margin: '14px 0 0' }}>{t('hero.note')}</p>

        {/* CAPTURAS: hueco reservado hasta que lleguen las de la app real. */}
        <div
          aria-label={t('hero.screenshotAlt')}
          style={{
            marginTop: 44, border: `1px solid ${LINE}`, borderRadius: 20,
            background: 'rgba(255,255,255,0.03)', aspectRatio: '16 / 9',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}
        >
          <span style={{ color: FAINT, fontSize: 13 }}>{t('hero.screenshotAlt')}</span>
        </div>
      </section>

      {/* ── 2. La idea ── */}
      <Section>
        <Title>{t('idea.title')}</Title>
        <p style={{ fontSize: 17, lineHeight: 1.65, color: MUTED, margin: 0 }}>{t('idea.text')}</p>
      </Section>

      {/* ── 3. Tradiciones ── */}
      <Section id="tradiciones">
        <Title>{t('traditions.title')}</Title>
        <div className="trad-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {[
            { key: 'zen', img: '/traditions/zen.webp', title: t('traditions.zenTitle'), text: t('traditions.zenText') },
            { key: 'cristiana', img: '/traditions/cristiana.webp', title: t('traditions.christianTitle'), text: t('traditions.christianText') },
          ].map((tr) => (
            <div key={tr.key} style={{ border: `1px solid ${LINE}`, borderRadius: 18, overflow: 'hidden', background: 'rgba(255,255,255,0.03)' }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={tr.img} alt={tr.title} style={{ width: '100%', height: 180, objectFit: 'cover', opacity: 0.85 }} />
              <div style={{ padding: '18px 20px 22px' }}>
                <h3 style={{ color: GOLD, fontSize: 18, fontWeight: 600, margin: '0 0 8px' }}>{tr.title}</h3>
                <p style={{ color: MUTED, fontSize: 15, lineHeight: 1.55, margin: 0 }}>{tr.text}</p>
              </div>
            </div>
          ))}
        </div>
        <p style={{ color: FAINT, fontSize: 13.5, margin: '18px 0 0' }}>{t('traditions.note')}</p>
      </Section>

      {/* ── 4. Cómo funciona ── */}
      <Section id="como-funciona">
        <Title>{t('how.title')}</Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 26 }}>
          {[1, 2, 3].map((n) => (
            <div key={n} style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
              <span style={{
                flexShrink: 0, width: 30, height: 30, borderRadius: 999, border: `1px solid ${GOLD}`,
                color: GOLD, fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>{n}</span>
              <div>
                <h3 style={{ color: TEXT, fontSize: 17, fontWeight: 600, margin: '2px 0 6px' }}>{t(`how.step${n}Title`)}</h3>
                <p style={{ color: MUTED, fontSize: 16, lineHeight: 1.55, margin: 0 }}>{t(`how.step${n}Text`)}</p>
              </div>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 5. Todo lo que incluye ── */}
      <Section>
        <Title>{t('includes.title')}</Title>
        <Bullets items={[1, 2, 3, 4, 5, 6, 7].map((n) => t(`includes.i${n}`))} />
      </Section>

      {/* ── 6. Privacidad y cuidado ── */}
      <Section>
        <Title>{t('privacy.title')}</Title>
        <Bullets items={[1, 2, 3, 4].map((n) => t(`privacy.p${n}`))} />
        <p style={{ color: FAINT, fontSize: 13.5, lineHeight: 1.5, margin: '20px 0 0' }}>{t('privacy.note')}</p>
      </Section>

      {/* ── 7. Precio ── */}
      <Section id="precio">
        <Title>{t('pricing.title')}</Title>
        <div style={{ border: '1px solid rgba(212,168,87,0.3)', background: 'rgba(212,168,87,0.06)', borderRadius: 18, padding: '24px 24px 26px' }}>
          <p style={{ color: TEXT, fontSize: 28, fontWeight: 400, margin: '0 0 6px' }}>{t('pricing.monthly')}</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'baseline', gap: 10, marginBottom: 18 }}>
            <span style={{ color: TEXT, fontSize: 20 }}>{t('pricing.yearly')}</span>
            <span style={{ color: FAINT, fontSize: 14 }}>({t('pricing.yearlyPerMonth')})</span>
            <span style={{ color: GOLD, fontSize: 13, fontWeight: 600 }}>{t('pricing.saving')}</span>
          </div>
          <Bullets items={[1, 2, 3, 4].map((n) => t(`pricing.p${n}`))} />
          <p style={{ color: FAINT, fontSize: 13, margin: '18px 0 0' }}>{t('pricing.note')}</p>
        </div>
      </Section>

      {/* ── 8. Quién hace Niela ── */}
      <Section>
        <Title>{t('founder.title')}</Title>
        <p style={{ fontSize: 17, lineHeight: 1.65, color: MUTED, margin: '0 0 16px' }}>{t('founder.text')}</p>
        <p style={{ fontSize: 16, color: MUTED, margin: 0 }}>
          {t('founder.contact')}{' '}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: GOLD }}>{SUPPORT_EMAIL}</a>
        </p>
      </Section>

      {/* ── 9. Preguntas frecuentes ── */}
      <Section id="faq">
        <Title>{t('faq.title')}</Title>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <div key={n}>
              <h3 style={{ color: TEXT, fontSize: 16, fontWeight: 600, margin: '0 0 6px' }}>{t(`faq.q${n}`)}</h3>
              <p style={{ color: MUTED, fontSize: 15.5, lineHeight: 1.55, margin: 0 }}>{t(`faq.a${n}`)}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── 10. Llamada final ── */}
      <Section>
        <Title>{t('finalCta.title')}</Title>
        <p style={{ fontSize: 17, lineHeight: 1.6, color: MUTED, margin: '0 0 26px' }}>{t('finalCta.text')}</p>
        <AppStoreButton label={t('finalCta.cta')} />
      </Section>

      {/* ── Pie ── */}
      <footer style={{ borderTop: `1px solid ${LINE}` }}>
        <div style={{ maxWidth: 820, margin: '0 auto', padding: '30px 24px 44px', display: 'flex', flexWrap: 'wrap', gap: 14, alignItems: 'center' }}>
          {([
            ['terminos', t('footer.terminos')],
            ['privacidad', t('footer.privacidad')],
            ['cookies', t('footer.cookies')],
            ['soporte', t('footer.soporte')],
            ['eliminar-cuenta', t('footer.eliminarCuenta')],
          ] as const).map(([slug, label]) => (
            <a key={slug} href={`/legal/${slug}`} style={{ color: FAINT, fontSize: 13.5, textDecoration: 'none' }}>{label}</a>
          ))}
          <a href={`mailto:${SUPPORT_EMAIL}`} style={{ color: FAINT, fontSize: 13.5, textDecoration: 'none' }}>{SUPPORT_EMAIL}</a>
          <span style={{ color: 'rgba(255,255,255,0.25)', fontSize: 13, marginLeft: 'auto' }}>{t('footer.copyright')}</span>
        </div>
      </footer>

      {/* En móvil: una columna de tradiciones y sin navegación de anclas. */}
      <style>{`
        @media (max-width: 680px) {
          .trad-grid { grid-template-columns: 1fr !important; }
          .nav-links { display: none !important; }
          h1 { font-size: 32px !important; }
        }
      `}</style>
    </main>
  )
}
