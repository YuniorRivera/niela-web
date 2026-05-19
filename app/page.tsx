'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://medita-app-production.up.railway.app'

/* ── useInView hook ── */
function useInView(threshold = 0.1): [React.RefObject<HTMLElement | null>, boolean] {
  const ref = useRef<HTMLElement | null>(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setInView(true) },
      { threshold }
    )
    if (ref.current) obs.observe(ref.current)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

/* ── PhoneMockup placeholder ── */
function PhoneMockup({ label }: { label: string }) {
  return (
    <div style={{
      width: 160, height: 300, borderRadius: 28,
      border: '2px solid rgba(166,200,220,0.3)',
      background: 'rgba(31,45,58,0.85)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      flexDirection: 'column', gap: 8,
      backdropFilter: 'blur(8px)',
      flexShrink: 0,
    }}>
      <span style={{ fontSize: 28 }}>📱</span>
      <span style={{ color: '#a6c8dc', fontSize: 10, textAlign: 'center', padding: '0 14px', lineHeight: 1.4 }}>{label}</span>
    </div>
  )
}

/* ── Waitlist form ── */
function WaitlistForm({ dark = false }: { dark?: boolean }) {
  const [email, setEmail] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const submit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    setStatus('idle')
    try {
      const r = await fetch(`${API_URL}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      if (r.ok) { setStatus('success'); setEmail('') }
      else setStatus('error')
    } catch { setStatus('error') }
    setSubmitting(false)
  }, [email])

  const inputBg = dark ? 'rgba(232,241,245,0.08)' : 'rgba(255,255,255,0.7)'
  const inputBorder = dark ? '1px solid rgba(232,241,245,0.18)' : '1px solid rgba(44,62,80,0.18)'
  const inputColor = dark ? '#e8f1f5' : '#2c3e50'
  const btnBg = dark ? '#e8f1f5' : '#a6c8dc'
  const btnColor = dark ? '#1f2d3a' : '#1f2d3a'
  const legalColor = dark ? 'rgba(232,241,245,0.5)' : '#6b7c8a'
  const linkColor = dark ? '#a6c8dc' : '#4a6b80'

  return (
    <div style={{ width: '100%', maxWidth: 460 }}>
      <form onSubmit={submit} style={{ display: 'flex', gap: 10, marginBottom: 10 }}>
        <input
          type="email" required value={email}
          onChange={e => setEmail(e.target.value)}
          placeholder="tu@email.com"
          style={{ flex: 1, padding: '13px 18px', borderRadius: 999, border: inputBorder, background: inputBg, fontSize: 14, color: inputColor, backdropFilter: 'blur(8px)', outline: 'none' }}
        />
        <button
          type="submit" disabled={submitting || !accepted}
          className="btn-primary"
          style={{ background: btnBg, color: btnColor, border: 'none', padding: '13px 24px', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: submitting || !accepted ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', opacity: submitting || !accepted ? 0.45 : 1, transition: 'transform 150ms ease-out, opacity 150ms ease-out' }}
        >{submitting ? '...' : 'Empezar gratis'}</button>
      </form>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', marginBottom: 8 }}>
        <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} style={{ marginTop: 2, accentColor: '#a6c8dc', flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: legalColor, lineHeight: 1.5 }}>
          Al unirme acepto los{' '}
          <a href="/legal/terminos" style={{ color: linkColor }}>Términos</a>
          {' '}y la{' '}
          <a href="/legal/privacidad" style={{ color: linkColor }}>Política de Privacidad</a>
        </span>
      </label>
      {status === 'success' && <p style={{ fontSize: 12, color: dark ? '#b8c9a8' : '#3d5538', margin: 0 }}>¡Listo! Te avisamos cuando lancemos.</p>}
      {status === 'error' && <p style={{ fontSize: 12, color: '#e08080', margin: 0 }}>No pudimos conectar. Intenta de nuevo.</p>}
      {status === 'idle' && <p style={{ fontSize: 12, color: legalColor, margin: 0 }}>Sin spam. Aviso una sola vez al lanzar.</p>}
    </div>
  )
}

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export default function Home() {
  const [count, setCount] = useState<number>(327)
  const [heroMounted, setHeroMounted] = useState(false)
  const [hoveredTradition, setHoveredTradition] = useState<string | null>(null)

  useEffect(() => {
    fetch(`${API_URL}/api/waitlist/count`)
      .then(r => r.json())
      .then(d => { if (d?.count != null) setCount(d.count) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const raf = requestAnimationFrame(() => setHeroMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  /* section refs for IntersectionObserver */
  const [sec2Ref, sec2In] = useInView(0.15)
  const [sec3Ref, sec3In] = useInView(0.1)
  const [sec4Ref, sec4In] = useInView(0.1)
  const [sec6Ref, sec6In] = useInView(0.1)
  const [sec7Ref, sec7In] = useInView(0.1)
  const [sec8Ref, sec8In] = useInView(0.1)

  const traditions = [
    { name: 'Zen',       desc: 'Quietud, impermanencia, presencia plena' },
    { name: 'Budista',   desc: 'Atención plena, compasión, desapego' },
    { name: 'Cristiana', desc: 'Lectio divina, contemplación, presencia divina' },
    { name: 'Hindú',     desc: 'Pranayama, mantra, conexión con el Ser' },
    { name: 'Estoica',   desc: 'Memento mori, dicotomía del control, virtud' },
    { name: 'Secular',   desc: 'Mindfulness basado en evidencia, sin dogma' },
    { name: 'Sufí',      desc: 'Dhikr, amor divino, disolución del ego' },
  ]

  return (
    <main style={{ margin: 0, minHeight: '100vh', background: '#1f2d3a', overflow: 'hidden' }}>

      {/* ══ NAV ══ */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(31,45,58,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(166,200,220,0.08)' }}>
        <Link href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <Image src="/logo-leaf.png" alt="Niela" width={32} height={32} priority style={{ borderRadius: 6 }} />
          <span style={{ fontSize: 18, fontWeight: 500, color: '#e8f1f5', letterSpacing: '0.5px' }}>niela</span>
        </Link>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a href="#como-funciona" style={{ fontSize: 14, color: 'rgba(232,241,245,0.65)', textDecoration: 'none', transition: 'color 200ms' }}>Cómo funciona</a>
          <a href="#tradiciones" style={{ fontSize: 14, color: 'rgba(232,241,245,0.65)', textDecoration: 'none', transition: 'color 200ms' }}>Tradiciones</a>
          <a href="#comparativa" style={{ fontSize: 14, color: 'rgba(232,241,245,0.65)', textDecoration: 'none', transition: 'color 200ms' }}>Comparativa</a>
          <a href="#cta" style={{ background: '#a6c8dc', color: '#1f2d3a', border: 'none', padding: '10px 20px', borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'transform 150ms, opacity 150ms' }}>Empezar gratis</a>
        </div>
      </nav>

      {/* ══ SECCIÓN 1: HERO ══ */}
      <section style={{ minHeight: '100vh', paddingTop: 88, background: 'linear-gradient(160deg, #1f2d3a 0%, #2c3e50 60%, #1a2e3b 100%)', position: 'relative', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', padding: '88px 64px 80px', maxWidth: 1240, margin: '0 auto' }}>
        {/* Decorative blur sphere */}
        <div style={{ position: 'absolute', top: '15%', right: '5%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(166,200,220,0.18) 0%, rgba(166,200,220,0) 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '0%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,201,168,0.14) 0%, rgba(184,201,168,0) 70%)', pointerEvents: 'none' }} />

        {/* Left column */}
        <div style={{ position: 'relative', zIndex: 5 }}>
          {/* Pill waitlist */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'rgba(166,200,220,0.12)', border: '1px solid rgba(166,200,220,0.25)', borderRadius: 999, fontSize: 13, color: '#a6c8dc', marginBottom: 28, backdropFilter: 'blur(12px)', fontWeight: 500 }}>
            ✦ {count} personas en lista de espera
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 72, lineHeight: 1.0, fontWeight: 500, color: '#e8f1f5', margin: '0 0 24px', letterSpacing: '-2.5px' }}>
            <span className={`hero-line hero-line-1${heroMounted ? ' hero-line-visible' : ''}`} style={{ display: 'block' }}>Tu meditación,</span>
            <span className={`hero-line hero-line-2${heroMounted ? ' hero-line-visible' : ''}`} style={{ display: 'block' }}>tu tradición,</span>
            <span className={`hero-line hero-line-3${heroMounted ? ' hero-line-visible' : ''}`} style={{ display: 'block', color: '#a6c8dc', fontStyle: 'italic' }}>tu momento.</span>
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.65, color: 'rgba(232,241,245,0.72)', margin: '0 0 36px', maxWidth: 440 }}>
            Sesiones de meditación generadas por IA, adaptadas a tu tradición espiritual y a cómo te sentís hoy.
          </p>

          <div style={{ display: 'flex', gap: 14, marginBottom: 36, flexWrap: 'wrap' }}>
            <a
              href="#cta"
              className="btn-primary"
              style={{ background: '#a6c8dc', color: '#1f2d3a', padding: '14px 28px', borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: 'none', transition: 'transform 150ms ease-out, opacity 150ms ease-out' }}
            >
              Empezar gratis
            </a>
            <a
              href="#como-funciona"
              style={{ color: 'rgba(232,241,245,0.75)', padding: '14px 0', fontSize: 15, textDecoration: 'none', transition: 'color 200ms' }}
            >
              Ver cómo funciona ↓
            </a>
          </div>

          {/* Trust micro-signals */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { icon: '🔒', label: 'GDPR compliant' },
              { icon: '🔬', label: 'Basado en evidencia' },
              { icon: '🌍', label: '7 tradiciones' },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13 }}>{icon}</span>
                <span style={{ fontSize: 12, color: 'rgba(232,241,245,0.5)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — floating iPhone mockup */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
          <div className="ring-big" />
          <div className="ring-small" />
          <div className="hero-sphere" />
          <div className="float-anim" style={{ position: 'relative', zIndex: 5, width: 290, height: 580, background: '#0d1821', borderRadius: 44, padding: 10, boxShadow: '0 40px 80px rgba(0,0,0,0.45), 0 12px 32px rgba(0,0,0,0.3)' }}>
            <div style={{ background: 'linear-gradient(180deg, #e8f1f5 0%, #f0ebe0 100%)', borderRadius: 34, height: '100%', padding: '18px 16px', display: 'flex', flexDirection: 'column', gap: 12, overflow: 'hidden', position: 'relative' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 9, color: '#2c3e50', fontWeight: 500 }}>9:41</span>
                <div style={{ width: 14, height: 7, border: '1px solid #2c3e50', borderRadius: 2, position: 'relative' }}>
                  <div style={{ position: 'absolute', top: 1, left: 1, width: 9, height: 3, background: '#2c3e50', borderRadius: 1 }} />
                </div>
              </div>
              <div style={{ marginTop: 4 }}>
                <p style={{ fontSize: 11, color: '#4a6b80', margin: '0 0 2px' }}>Hola Sofía</p>
                <h4 style={{ fontSize: 15, color: '#1f2d3a', margin: 0, fontWeight: 500 }}>¿Qué sientes hoy?</h4>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: 10, border: '1px solid rgba(44,62,80,0.06)' }}>
                <p style={{ fontSize: 10, color: '#5a6f7d', margin: '0 0 6px' }}>Tu intención</p>
                <p style={{ fontSize: 11, color: '#2c3e50', margin: 0, lineHeight: 1.4 }}>&quot;Ansiedad antes de dormir y rumiación sobre el trabajo&quot;</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p style={{ fontSize: 9, color: '#4a6b80', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Tradición</p>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <span style={{ padding: '4px 9px', background: '#b8c9a8', borderRadius: 999, fontSize: 9, color: '#2d3d24', fontWeight: 500 }}>Zen ✓</span>
                  <span style={{ padding: '4px 9px', background: 'rgba(212,184,150,0.4)', borderRadius: 999, fontSize: 9, color: '#5a4530' }}>Hindú</span>
                  <span style={{ padding: '4px 9px', background: 'rgba(180,180,180,0.3)', borderRadius: 999, fontSize: 9, color: '#2c3e50' }}>Secular</span>
                </div>
              </div>
              <div style={{ marginTop: 'auto', background: 'linear-gradient(135deg, #2c3e50 0%, #4a6b80 100%)', borderRadius: 14, padding: 14, color: '#f0ebe0', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 60, height: 60, borderRadius: '50%', background: 'rgba(212,184,150,0.2)' }} />
                <p style={{ fontSize: 9, opacity: 0.7, margin: '0 0 4px', position: 'relative' }}>Generando tu sesión</p>
                <p style={{ fontSize: 11, margin: '0 0 10px', lineHeight: 1.4, position: 'relative' }}>&quot;Hojas que flotan por un río...&quot;</p>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, position: 'relative' }}>
                  <div style={{ width: 30, height: 30, borderRadius: '50%', background: '#f0ebe0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="#2c3e50"><polygon points="6 4 20 12 6 20 6 4" /></svg>
                  </div>
                  <div style={{ flex: 1, height: 3, background: 'rgba(240,235,224,0.3)', borderRadius: 999, position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', left: 0, top: 0, height: '100%', width: '35%', background: '#f0ebe0', borderRadius: 999 }} />
                  </div>
                  <span style={{ fontSize: 9 }}>3:42</span>
                </div>
              </div>
            </div>
          </div>
          <div className="orb-blue" />
          <div className="orb-green" />
        </div>
      </section>

      {/* ══ SECCIÓN 2: TRUST BAR ══ */}
      <section
        ref={sec2Ref as React.RefObject<HTMLElement>}
        style={{ padding: '48px 64px', background: 'rgba(255,255,255,0.03)', borderTop: '1px solid rgba(166,200,220,0.08)', borderBottom: '1px solid rgba(166,200,220,0.08)' }}
      >
        <div className={`fade-up${sec2In ? ' in-view' : ''}`} style={{ textAlign: 'center' }}>
          <div style={{ display: 'flex', gap: 0, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
            {['Basado en evidencia', 'GDPR Compliant', 'Cifrado end-to-end', 'Comité asesor cultural'].map((item, i, arr) => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 14, color: 'rgba(232,241,245,0.65)', fontWeight: 400, letterSpacing: '0.2px' }}>{item}</span>
                {i < arr.length - 1 && <span style={{ color: 'rgba(166,200,220,0.3)', margin: '0 16px', fontSize: 12 }}>·</span>}
              </span>
            ))}
          </div>
          <p style={{ fontSize: 11, color: 'rgba(232,241,245,0.3)', margin: '0 0 20px', textTransform: 'uppercase', letterSpacing: '2px' }}>Próximamente en medios</p>
          <div style={{ display: 'flex', gap: 36, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', opacity: 0.3 }}>
            {['TechCrunch', 'El País', 'Forbes Wellness', 'Wired Health'].map(m => (
              <span key={m} style={{ fontSize: 14, color: '#e8f1f5', fontWeight: 600, fontStyle: 'italic', letterSpacing: '0.5px' }}>{m}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECCIÓN 3: CÓMO FUNCIONA ══ */}
      <section
        id="como-funciona"
        ref={sec3Ref as React.RefObject<HTMLElement>}
        style={{ padding: '100px 64px', background: 'linear-gradient(180deg, #1f2d3a 0%, #243344 100%)', position: 'relative' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 12, color: '#a6c8dc', textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 16px', fontWeight: 600 }}>Cómo funciona</p>
          <h2 className={`fade-up${sec3In ? ' in-view' : ''}`} style={{ fontSize: 44, fontWeight: 500, color: '#e8f1f5', margin: 0, letterSpacing: '-1px' }}>Tres pasos hacia tu práctica</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24, maxWidth: 1040, margin: '0 auto' }}>
          {[
            { num: '01', title: 'Elegí tu tradición', desc: 'En el onboarding, seleccionás de 7 tradiciones espirituales. La app aprende tu estilo.', label: 'Onboarding · Tradiciones' },
            { num: '02', title: 'Describí tu momento', desc: 'Escribís cómo te sentís hoy. La IA genera una sesión única para ti.', label: 'IA · Sesión personalizada' },
            { num: '03', title: 'Escuchá y soltá', desc: 'Audio guiado, voz cálida, sin distracciones. Solo vos y tu práctica.', label: 'Audio guiado · Voz cálida' },
          ].map((step, i) => (
            <div
              key={step.num}
              className={`fade-up stagger-${i + 1 as 1|2|3}${sec3In ? ' in-view' : ''}`}
              style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 24, padding: '40px 32px', border: '1px solid rgba(166,200,220,0.1)', position: 'relative', overflow: 'hidden' }}
            >
              <div style={{ fontSize: 72, fontWeight: 700, color: '#a6c8dc', opacity: 0.15, lineHeight: 1, marginBottom: 8, userSelect: 'none' }}>{step.num}</div>
              <h3 style={{ fontSize: 20, fontWeight: 500, color: '#e8f1f5', margin: '0 0 12px' }}>{step.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(232,241,245,0.6)', margin: '0 0 28px' }}>{step.desc}</p>
              <PhoneMockup label={step.label} />
            </div>
          ))}
        </div>
      </section>

      {/* ══ SECCIÓN 4: FEATURES GRID ══ */}
      <section
        ref={sec4Ref as React.RefObject<HTMLElement>}
        style={{ padding: '100px 64px', background: '#1a2635' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 12, color: '#a6c8dc', textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 16px', fontWeight: 600 }}>Features</p>
          <h2 className={`fade-up${sec4In ? ' in-view' : ''}`} style={{ fontSize: 44, fontWeight: 500, color: '#e8f1f5', margin: 0, letterSpacing: '-1px', maxWidth: 600, marginLeft: 'auto', marginRight: 'auto' }}>Todo lo que necesitás para meditar con intención</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2,1fr)', gap: 20, maxWidth: 960, margin: '0 auto' }}>
          {[
            { icon: '🌏', title: '7 tradiciones espirituales', desc: 'Zen, Budista, Cristiana, Hindú, Estoica, Secular y Sufí. Cada una con su voz, metáforas y silencio propios.', label: 'Selector · 7 tradiciones' },
            { icon: '🧠', title: 'IA que entiende tu momento', desc: 'Describís cómo te sentís y la IA genera una sesión única. No plantillas. No genérico. Solo para vos.', label: 'IA · Sesión única' },
            { icon: '📚', title: 'Cursos por tradición', desc: 'Un módulo de 7 días por tradición, con teoría, práctica y reflexión guiada. Un camino completo.', label: 'Cursos · 7 días' },
            { icon: '💾', title: 'Tu biblioteca personal', desc: 'Guardá meditaciones, notas y sesiones favoritas. Tu práctica siempre disponible offline.', label: 'Biblioteca · Guardados' },
          ].map((feat, i) => (
            <div
              key={feat.title}
              className={`fade-up stagger-${(i % 2 + 1) as 1|2}${sec4In ? ' in-view' : ''} feature-card`}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(166,200,220,0.12)', borderRadius: 24, padding: '36px 32px', display: 'flex', gap: 32, alignItems: 'flex-start', transition: 'transform 200ms cubic-bezier(0.23,1,0.32,1), border-color 200ms' }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 28, marginBottom: 16 }}>{feat.icon}</div>
                <h3 style={{ fontSize: 20, fontWeight: 500, color: '#e8f1f5', margin: '0 0 12px' }}>{feat.title}</h3>
                <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(232,241,245,0.6)', margin: 0 }}>{feat.desc}</p>
              </div>
              <PhoneMockup label={feat.label} />
            </div>
          ))}
        </div>
      </section>

      {/* ══ SECCIÓN 6: COMPARATIVA ══ */}
      <section
        id="comparativa"
        ref={sec6Ref as React.RefObject<HTMLElement>}
        style={{ padding: '100px 64px', background: '#243344' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <p style={{ fontSize: 12, color: '#a6c8dc', textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 16px', fontWeight: 600 }}>Comparativa</p>
          <h2 className={`fade-up${sec6In ? ' in-view' : ''}`} style={{ fontSize: 44, fontWeight: 500, color: '#e8f1f5', margin: 0, letterSpacing: '-1px' }}>Por qué Niela es diferente</h2>
        </div>
        <div className={`fade-up${sec6In ? ' in-view' : ''}`} style={{ maxWidth: 720, margin: '0 auto', borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(166,200,220,0.12)' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: 'rgba(166,200,220,0.06)', borderBottom: '1px solid rgba(166,200,220,0.1)' }}>
            {['Feature', 'Niela', 'Calm', 'Headspace'].map((h, i) => (
              <div key={h} style={{ padding: '18px 24px', fontSize: 13, fontWeight: 600, color: i === 1 ? '#a6c8dc' : 'rgba(232,241,245,0.5)', textAlign: i === 0 ? 'left' : 'center', background: i === 1 ? 'rgba(166,200,220,0.06)' : 'transparent' }}>{h}</div>
            ))}
          </div>
          {(() => {
            const cellStyle = (ci: number, last: boolean) => ({
              padding: '16px 24px',
              fontSize: 14,
              textAlign: (ci === 0 ? 'left' : 'center') as React.CSSProperties['textAlign'],
              color: ci === 1 ? '#b8c9a8' : ci === 0 ? 'rgba(232,241,245,0.75)' : 'rgba(232,241,245,0.35)',
              fontWeight: ci === 1 ? 600 : 400,
              background: ci === 1 ? 'rgba(166,200,220,0.04)' : 'transparent',
              borderBottom: last ? 'none' : '1px solid rgba(166,200,220,0.06)',
            });
            const partial = (
              <span style={{ fontSize: 13, color: 'rgba(232,241,245,0.4)', fontWeight: 400 }}>Parcial</span>
            );
            const rows: { label: string; niela: React.ReactNode; calm: React.ReactNode; headspace: React.ReactNode }[] = [
              { label: 'Personalización por tradición', niela: '✓', calm: '✗', headspace: '✗' },
              { label: 'Sesiones generadas por IA',     niela: '✓', calm: '✗', headspace: (
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <span>✓</span>
                  <span style={{ fontSize: 10, color: 'rgba(232,241,245,0.3)', fontWeight: 400 }}>Ebb · solo EN</span>
                </span>
              )},
              { label: 'Multi-tradición',               niela: '✓', calm: '✗', headspace: '✗' },
              { label: 'Contenido nativo en español',   niela: '✓', calm: partial, headspace: partial },
              { label: 'Sin plantillas genéricas',      niela: '✓', calm: '✗', headspace: '✗' },
            ];
            return rows.map((row, ri) => (
              <div key={ri} style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr' }}>
                <div style={cellStyle(0, ri === rows.length - 1)}>{row.label}</div>
                <div style={cellStyle(1, ri === rows.length - 1)}>{row.niela}</div>
                <div style={cellStyle(2, ri === rows.length - 1)}>{row.calm}</div>
                <div style={cellStyle(3, ri === rows.length - 1)}>{row.headspace}</div>
              </div>
            ));
          })()}
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(232,241,245,0.25)', marginTop: 20, fontStyle: 'italic' }}>
          Comparación basada en información pública al 18 de mayo de 2026. Headspace Ebb (AI companion) disponible solo en inglés según anuncio oficial de Headspace Health, octubre 2024.
        </p>
      </section>

      {/* ══ SECCIÓN 7: POR QUÉ NIELA EXISTE ══ */}
      <section
        id="tradiciones"
        ref={sec7Ref as React.RefObject<HTMLElement>}
        style={{ padding: '100px 64px', background: 'linear-gradient(180deg, #243344 0%, #1f2d3a 100%)' }}
      >
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#a6c8dc', textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 24px', fontWeight: 600 }}>Por qué existimos</p>
          <h2 className={`fade-up${sec7In ? ' in-view' : ''}`} style={{ fontSize: 44, fontWeight: 500, color: '#e8f1f5', margin: '0 0 28px', letterSpacing: '-1px', lineHeight: 1.1 }}>
            La meditación es universal.<br />Pero las apps no lo son.
          </h2>
          <p className={`fade-up stagger-2${sec7In ? ' in-view' : ''}`} style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(232,241,245,0.65)', margin: '0 0 56px' }}>
            Las grandes apps de meditación están diseñadas para un solo perfil: occidental, secular, angloparlante. Niela nació para todos los demás — para quienes meditan en árabe, rezan en swahili, practican zazen en Buenos Aires o contemplan en silencio en Ciudad de México.
          </p>
          {/* Tradition pills */}
          <div className={`fade-up stagger-3${sec7In ? ' in-view' : ''}`} style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center' }}>
            {traditions.map(t => (
              <div
                key={t.name}
                style={{ position: 'relative', display: 'inline-block' }}
                onMouseEnter={() => setHoveredTradition(t.name)}
                onMouseLeave={() => setHoveredTradition(null)}
              >
                <span style={{
                  display: 'inline-block',
                  padding: '10px 22px',
                  background: hoveredTradition === t.name ? 'rgba(166,200,220,0.2)' : 'rgba(166,200,220,0.08)',
                  border: '1px solid rgba(166,200,220,0.2)',
                  borderRadius: 999,
                  fontSize: 14,
                  color: '#a6c8dc',
                  fontWeight: 500,
                  cursor: 'default',
                  transition: 'background 200ms',
                }}>
                  {t.name}
                </span>
                {hoveredTradition === t.name && (
                  <div style={{ position: 'absolute', bottom: 'calc(100% + 10px)', left: '50%', transform: 'translateX(-50%)', background: '#2c3e50', border: '1px solid rgba(166,200,220,0.2)', borderRadius: 10, padding: '8px 14px', whiteSpace: 'nowrap', fontSize: 12, color: 'rgba(232,241,245,0.8)', zIndex: 50, boxShadow: '0 8px 24px rgba(0,0,0,0.3)', pointerEvents: 'none' }}>
                    {t.desc}
                    <div style={{ position: 'absolute', bottom: -5, left: '50%', transform: 'translateX(-50%)', width: 10, height: 10, background: '#2c3e50', borderRight: '1px solid rgba(166,200,220,0.2)', borderBottom: '1px solid rgba(166,200,220,0.2)', rotate: '45deg' }} />
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ SECCIÓN 8: CTA FINAL ══ */}
      <section
        id="cta"
        ref={sec8Ref as React.RefObject<HTMLElement>}
        style={{ padding: '120px 64px', background: 'linear-gradient(135deg, #0d1821 0%, #1a3040 50%, #0d1821 100%)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}
      >
        {/* Decorative sphere */}
        <div style={{ position: 'absolute', top: '-30%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 600, borderRadius: '50%', background: 'radial-gradient(circle, rgba(166,200,220,0.12) 0%, rgba(166,200,220,0) 65%)', pointerEvents: 'none' }} />

        <div className={`fade-up${sec8In ? ' in-view' : ''}`} style={{ position: 'relative', zIndex: 5, maxWidth: 640, margin: '0 auto' }}>
          <h2 style={{ fontSize: 56, fontWeight: 500, color: '#e8f1f5', margin: '0 0 20px', letterSpacing: '-1.5px', lineHeight: 1.05 }}>
            Empezá tu práctica hoy
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(232,241,245,0.65)', margin: '0 0 48px', lineHeight: 1.6 }}>
            Únete a {count} personas que ya están esperando Niela.
          </p>

          {/* App store placeholders */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 48, flexWrap: 'wrap' }}>
            {[
              { label: 'App Store', icon: '🍎' },
              { label: 'Google Play', icon: '▶' },
            ].map(btn => (
              <button key={btn.label} disabled style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px', borderRadius: 14, border: '1px solid rgba(166,200,220,0.2)', background: 'rgba(255,255,255,0.04)', color: 'rgba(232,241,245,0.4)', fontSize: 15, fontWeight: 500, cursor: 'not-allowed' }}>
                <span style={{ fontSize: 18 }}>{btn.icon}</span>
                <span>
                  <span style={{ display: 'block', fontSize: 10, opacity: 0.7, textAlign: 'left' }}>Próximamente</span>
                  {btn.label}
                </span>
              </button>
            ))}
          </div>

          {/* Waitlist form */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WaitlistForm dark />
          </div>
        </div>
      </section>

      {/* ══ FOOTER ══ */}
      <footer style={{ background: '#0d1821', borderTop: '1px solid rgba(166,200,220,0.07)', padding: '64px 64px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 40, maxWidth: 1040, margin: '0 auto', marginBottom: 48 }}>
          {[
            { heading: 'Producto', links: ['Cómo funciona', 'Tradiciones', 'Precios', 'App móvil'] },
            { heading: 'Empresa',  links: ['Sobre nosotros', 'Manifiesto', 'Carreras'] },
            { heading: 'Recursos', links: ['Blog', 'FAQ', 'Soporte'] },
            { heading: 'Legal',    links: ['Términos', 'Privacidad', 'Cookies'] },
          ].map(col => (
            <div key={col.heading}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(232,241,245,0.4)', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 16px' }}>{col.heading}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(link => (
                  <a key={link} href="#" style={{ fontSize: 14, color: 'rgba(232,241,245,0.55)', textDecoration: 'none', transition: 'color 200ms' }}>{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 1040, margin: '0 auto', paddingTop: 28, borderTop: '1px solid rgba(166,200,220,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 13, color: 'rgba(232,241,245,0.35)', margin: 0 }}>Niela © 2026 · Hecho con cuidado en Italia 🇮🇹</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {['Instagram', 'TikTok', 'X', 'YouTube'].map(sn => (
              <a key={sn} href="#" style={{ fontSize: 13, color: 'rgba(232,241,245,0.35)', textDecoration: 'none', transition: 'color 200ms' }}>{sn}</a>
            ))}
          </div>
        </div>
      </footer>

      {/* ══ SCOPED STYLES ══ */}
      <style jsx>{`
        /* rings */
        .ring-big {
          position: absolute; top: 50%; left: 50%; width: 540px; height: 540px;
          border: 1px solid rgba(166,200,220,0.2); border-radius: 50%;
          animation: rotate 80s linear infinite; pointer-events: none;
          transform: translate(-50%,-50%);
        }
        .ring-small {
          position: absolute; top: 50%; left: 50%; width: 380px; height: 380px;
          border: 1px solid rgba(184,201,168,0.2); border-radius: 50%;
          animation: rotate 55s linear infinite reverse; pointer-events: none;
          transform: translate(-50%,-50%);
        }
        .hero-sphere {
          position: absolute; top: 50%; left: 50%; width: 300px; height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(212,184,150,0.3) 0%, rgba(166,200,220,0.35) 50%, rgba(184,201,168,0.25) 100%);
          animation: heroFloat 10s cubic-bezier(0.34, 1.56, 0.64, 1) infinite;
          pointer-events: none; transform: translate(-50%,-50%);
        }
        .orb-blue {
          position: absolute; top: 14%; right: 8%; width: 48px; height: 48px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #c4dde8 0%, #8fb5c8 70%);
          animation: orbFloat 7s ease-in-out infinite; pointer-events: none;
        }
        .orb-green {
          position: absolute; bottom: 12%; left: 8%; width: 36px; height: 36px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #d8e5d0 0%, #a8c0a0 70%);
          animation: orbFloat 9s ease-in-out infinite reverse; pointer-events: none;
        }

        /* hero title stagger */
        .hero-line { opacity: 0; transform: translateY(10px); }
        .hero-line-visible.hero-line-1 { animation: heroLineIn 320ms cubic-bezier(0.23,1,0.32,1) forwards; animation-delay: 0ms; }
        .hero-line-visible.hero-line-2 { animation: heroLineIn 320ms cubic-bezier(0.23,1,0.32,1) forwards; animation-delay: 80ms; }
        .hero-line-visible.hero-line-3 { animation: heroLineIn 320ms cubic-bezier(0.23,1,0.32,1) forwards; animation-delay: 160ms; }

        /* feature card hover */
        .feature-card:hover {
          transform: translateY(-4px);
          border-color: rgba(166,200,220,0.3) !important;
        }

        /* nav link hover */
        nav a:hover { opacity: 1; color: #e8f1f5 !important; }

        /* responsive */
        @media (max-width: 900px) {
          section[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; padding: 80px 24px !important; }
          div[style*="repeat(3,1fr)"] { grid-template-columns: 1fr !important; }
          div[style*="repeat(2,1fr)"] { grid-template-columns: 1fr !important; }
          div[style*="repeat(4,1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
          nav { padding: 16px 24px !important; }
          h1[style*="font-size: 72px"] { font-size: 44px !important; letter-spacing: -1.5px !important; }
          h2[style*="font-size: 44px"] { font-size: 32px !important; }
          h2[style*="font-size: 56px"] { font-size: 38px !important; }
          nav > div:last-child a:not(:last-child) { display: none !important; }
        }
        @media (max-width: 600px) {
          div[style*="repeat(4,1fr)"] { grid-template-columns: 1fr !important; }
          section { padding: 64px 20px !important; }
          nav { padding: 14px 20px !important; }
        }

        /* reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .hero-sphere, .orb-blue, .orb-green, .ring-big, .ring-small { animation: none !important; }
          .hero-line { opacity: 1 !important; transform: none !important; animation: none !important; }
          .feature-card:hover { transform: none !important; }
        }
      `}</style>
    </main>
  )
}
