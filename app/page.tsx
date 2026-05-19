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

/* ── 5.5 SuccessState with viral share ── */
function SuccessState({ position, email = '' }: { position: number; email?: string }) {
  const [copied, setCopied] = useState(false)

  const hashEmail = (e: string) => {
    let hash = 0
    for (let i = 0; i < e.length; i++) hash = ((hash << 5) - hash) + e.charCodeAt(i)
    return Math.abs(hash).toString(16).slice(0, 8)
  }

  const refUrl = `https://niela.app?ref=${hashEmail(email)}`
  const shareText = `Me anoté en la lista de espera de Niela, una app de meditación con IA en español. ¿Te sumás?`
  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + refUrl)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(refUrl)}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(refUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      <div style={{ fontSize: 28, marginBottom: 8 }}>✨</div>
      <p style={{ fontSize: 17, fontWeight: 600, color: '#e8f1f5', margin: '0 0 4px' }}>Estás en la lista</p>
      <p style={{ fontSize: 13, color: '#a6c8dc', margin: '0 0 20px' }}>Posición #{position}</p>
      <p style={{ fontSize: 13, color: 'rgba(232,241,245,0.6)', margin: '0 0 16px' }}>Invitá amigos y subí en la lista. Por cada amigo que se una, subís 5 posiciones.</p>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}>
        <a href={waUrl} target="_blank" rel="noopener" style={{ padding: '10px 16px', borderRadius: 12, background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>💬 WhatsApp</a>
        <a href={twitterUrl} target="_blank" rel="noopener" style={{ padding: '10px 16px', borderRadius: 12, background: '#000', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', border: '1px solid #333' }}>𝕏 Twitter</a>
        <button onClick={copyLink} style={{ padding: '10px 16px', borderRadius: 12, background: 'rgba(166,200,220,0.15)', color: '#a6c8dc', fontSize: 13, fontWeight: 600, border: '1px solid rgba(166,200,220,0.3)', cursor: 'pointer' }}>
          {copied ? '✓ Copiado' : '🔗 Copiar link'}
        </button>
      </div>
    </div>
  )
}

/* ── Waitlist form (original, bottom CTA) ── */
function WaitlistForm({ dark = false, onSuccess }: { dark?: boolean; onSuccess?: (position: number) => void }) {
  const [email, setEmail] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'ratelimit'>('idle')
  const [position, setPosition] = useState(0)
  const [submittedEmail, setSubmittedEmail] = useState('')

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
      const data = await r.json()
      if (r.ok || r.status === 409) {
        setPosition(data.position ?? 0)
        setSubmittedEmail(email)
        setStatus('success')
        setEmail('')
        sessionStorage.setItem('emailSubmitted', '1')
        if (onSuccess) onSuccess(data.position ?? 0)
      } else if (r.status === 429) {
        setStatus('ratelimit')
      } else {
        setStatus('error')
      }
    } catch { setStatus('error') }
    setSubmitting(false)
  }, [email, onSuccess])

  const inputBg = dark ? 'rgba(232,241,245,0.08)' : 'rgba(255,255,255,0.7)'
  const inputBorder = dark ? '1px solid rgba(232,241,245,0.18)' : '1px solid rgba(44,62,80,0.18)'
  const inputColor = dark ? '#e8f1f5' : '#2c3e50'
  const btnBg = dark ? '#e8f1f5' : '#a6c8dc'
  const btnColor = dark ? '#1f2d3a' : '#1f2d3a'
  const legalColor = dark ? 'rgba(232,241,245,0.5)' : '#6b7c8a'
  const linkColor = dark ? '#a6c8dc' : '#4a6b80'

  if (status === 'success') {
    return <SuccessState position={position} email={submittedEmail} />
  }

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
        >{submitting ? '...' : 'Unirme a la lista'}</button>
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
      {status === 'error' && <p style={{ fontSize: 12, color: '#e08080', margin: 0 }}>Algo salió mal. Intentá de nuevo en unos segundos.</p>}
      {status === 'ratelimit' && <p style={{ fontSize: 12, color: '#e08080', margin: 0 }}>Demasiados intentos. Esperá unos minutos e intentá de nuevo.</p>}
      {status === 'idle' && <p style={{ fontSize: 12, color: legalColor, margin: 0 }}>Sin spam. Aviso una sola vez al lanzar.</p>}
    </div>
  )
}

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export default function Home() {
  const [count, setCount] = useState<number | null>(null)
  const [heroMounted, setHeroMounted] = useState(false)
  const [hoveredTradition, setHoveredTradition] = useState<string | null>(null)

  // 5.2 Hero form states
  const [heroEmail, setHeroEmail] = useState('')
  const [heroSubmitted, setHeroSubmitted] = useState(false)
  const [heroLoading, setHeroLoading] = useState(false)
  const [heroPosition, setHeroPosition] = useState(0)
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState('')

  // 5.4 Exit-intent states
  const [exitModalOpen, setExitModalOpen] = useState(false)
  const [exitEmail, setExitEmail] = useState('')
  const [exitSubmitted, setExitSubmitted] = useState(false)
  const [exitLoading, setExitLoading] = useState(false)
  const [exitPosition, setExitPosition] = useState(0)

  // 5.3 Sticky CTA states
  const [stickyVisible, setStickyVisible] = useState(false)
  const [stickyModalOpen, setStickyModalOpen] = useState(false)
  const [stickyEmail, setStickyEmail] = useState('')
  const [stickySubmitted, setStickySubmitted] = useState(false)
  const [stickyLoading, setStickyLoading] = useState(false)
  const [stickyPosition, setStickyPosition] = useState(0)

  // 5.1 Fetch real count from DB
  useEffect(() => {
    fetch(`${API_URL}/api/waitlist/count`)
      .then(r => r.ok ? r.json() : null)
      .then(d => { if (d?.count != null) setCount(d.count) })
      .catch(() => {})
  }, [])

  useEffect(() => {
    const raf = requestAnimationFrame(() => setHeroMounted(true))
    return () => cancelAnimationFrame(raf)
  }, [])

  // 5.3 Scroll listener for sticky CTA
  useEffect(() => {
    let ticking = false
    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          setStickyVisible(window.scrollY > window.innerHeight * 0.3)
          ticking = false
        })
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 5.4 Exit-intent listener (desktop only)
  useEffect(() => {
    if (typeof window === 'undefined') return
    if (window.innerWidth < 768) return
    if (sessionStorage.getItem('exitShown')) return

    const handler = (e: MouseEvent) => {
      if (e.clientY < 10) {
        if (sessionStorage.getItem('emailSubmitted')) return
        sessionStorage.setItem('exitShown', '1')
        setExitModalOpen(true)
        document.removeEventListener('mouseleave', handler)
      }
    }
    document.addEventListener('mouseleave', handler)
    return () => document.removeEventListener('mouseleave', handler)
  }, [])

  // Generic email submit handler
  const handleEmailSubmit = useCallback(async (
    email: string,
    onSuccess: (position: number) => void,
    setLoading: (b: boolean) => void
  ) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return
    setLoading(true)
    try {
      const res = await fetch(`${API_URL}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      })
      const data = await res.json()
      if (res.ok || res.status === 409) {
        if (data.position != null) {
          setCount(data.position)
        }
        setLastSubmittedEmail(email)
        sessionStorage.setItem('emailSubmitted', '1')
        onSuccess(data.position ?? count ?? 1)
      }
    } catch {}
    finally { setLoading(false) }
  }, [count])

  const handleHeroSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    await handleEmailSubmit(
      heroEmail,
      (position) => { setHeroPosition(position); setHeroSubmitted(true) },
      setHeroLoading
    )
  }, [heroEmail, handleEmailSubmit])

  const handleExitSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    await handleEmailSubmit(
      exitEmail,
      (position) => { setExitPosition(position); setExitSubmitted(true) },
      setExitLoading
    )
  }, [exitEmail, handleEmailSubmit])

  const handleStickySubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    await handleEmailSubmit(
      stickyEmail,
      (position) => { setStickyPosition(position); setStickySubmitted(true) },
      setStickyLoading
    )
  }, [stickyEmail, handleEmailSubmit])

  /* section refs for IntersectionObserver */
  const [sec2Ref, sec2In] = useInView(0.15)
  const [sec3Ref, sec3In] = useInView(0.1)
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
          <a href="#cta" style={{ background: '#a6c8dc', color: '#1f2d3a', border: 'none', padding: '10px 20px', borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'transform 150ms, opacity 150ms' }}>Unirme a la lista</a>
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
            {count != null && count > 0 ? `✦ ${count.toLocaleString('es')} personas en lista de espera` : '✦ Lista de espera abierta'}
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 72, lineHeight: 1.0, fontWeight: 500, color: '#e8f1f5', margin: '0 0 24px', letterSpacing: '-2.5px' }}>
            <span className={`hero-line hero-line-1${heroMounted ? ' hero-line-visible' : ''}`} style={{ display: 'block' }}>Tu meditación,</span>
            <span className={`hero-line hero-line-2${heroMounted ? ' hero-line-visible' : ''}`} style={{ display: 'block' }}>tu tradición,</span>
            <span className={`hero-line hero-line-3${heroMounted ? ' hero-line-visible' : ''}`} style={{ display: 'block', color: '#a6c8dc', fontStyle: 'italic' }}>tu momento.</span>
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.65, color: 'rgba(232,241,245,0.72)', margin: '0 0 24px', maxWidth: 440 }}>
            Sesiones de meditación generadas por IA, adaptadas a tu tradición espiritual y a cómo te sentís hoy.
          </p>

          {/* 5.2 Hero email form */}
          {!heroSubmitted ? (
            <form onSubmit={handleHeroSubmit} style={{ display: 'flex', gap: 8, marginBottom: 8, maxWidth: 440 }}>
              <input
                type="email"
                value={heroEmail}
                onChange={e => setHeroEmail(e.target.value)}
                placeholder="tu@email.com"
                required
                style={{
                  flex: 1,
                  padding: '12px 16px',
                  borderRadius: 12,
                  border: '1px solid rgba(166,200,220,0.3)',
                  background: 'rgba(255,255,255,0.06)',
                  color: '#e8f1f5',
                  fontSize: 15,
                  outline: 'none',
                }}
              />
              <button type="submit" disabled={heroLoading} style={{
                padding: '12px 20px',
                borderRadius: 12,
                border: 'none',
                background: '#a6c8dc',
                color: '#1f2d3a',
                fontWeight: 700,
                fontSize: 14,
                cursor: heroLoading ? 'not-allowed' : 'pointer',
                whiteSpace: 'nowrap',
                opacity: heroLoading ? 0.6 : 1,
              }}>
                {heroLoading ? '...' : 'Unirme a la lista'}
              </button>
            </form>
          ) : (
            <div style={{ marginBottom: 8, maxWidth: 440 }}>
              <SuccessState position={heroPosition} email={lastSubmittedEmail} />
            </div>
          )}
          <p style={{ fontSize: 12, color: 'rgba(232,241,245,0.4)', margin: '0 0 24px' }}>Sin spam. Aviso cuando lancemos.</p>

          <div style={{ display: 'flex', gap: 14, marginBottom: 36, flexWrap: 'wrap' }}>
            <a
              href="#cta"
              className="btn-primary"
              style={{ background: 'rgba(166,200,220,0.15)', color: '#a6c8dc', padding: '14px 28px', borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: 'none', transition: 'transform 150ms ease-out, opacity 150ms ease-out', border: '1px solid rgba(166,200,220,0.3)' }}
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

      {/* ══ SECCIÓN 3+4: CÓMO FUNCIONA — 5 CARDS CON SCREENSHOTS REALES ══ */}
      <section
        id="como-funciona"
        ref={sec3Ref as React.RefObject<HTMLElement>}
        style={{ padding: '100px 64px', background: 'linear-gradient(180deg, #1f2d3a 0%, #1a2635 100%)', position: 'relative' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <p style={{ fontSize: 12, color: '#a6c8dc', textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 16px', fontWeight: 600 }}>Cómo funciona</p>
          <h2 className={`fade-up${sec3In ? ' in-view' : ''}`} style={{ fontSize: 44, fontWeight: 500, color: '#e8f1f5', margin: 0, letterSpacing: '-1px' }}>
            Cinco pantallas.<br />Una práctica que se adapta a vos.
          </h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
          {([
            { emoji: '🪷', title: 'Elegí tu tradición',        desc: '7 tradiciones espirituales. Configurás tu camino: Zen, Tibetana, Andina, Sufí, Cristiana contemplativa, Islámica o Laica.', screen: 'perfil-tradiciones', stagger: 1 },
            { emoji: '✨', title: 'La IA entiende tu momento', desc: 'Describís cómo te sentís. Niela AI genera una sesión única, adaptada a tu tradición y a tu día.',                              screen: 'niela-ai',            stagger: 2 },
            { emoji: '📚', title: 'Cursos por tradición',       desc: '20 lecciones por tradición. Teoría, práctica y reflexión guiada. Un camino completo.',                                        screen: 'inicio-curso-zen',    stagger: 3 },
            { emoji: '🔖', title: 'Tu biblioteca de sesiones',  desc: 'Guardá tus meditaciones favoritas. Etiquetas por estado emocional. Volvé a las que más te ayudaron.',                          screen: 'historial-sesiones',  stagger: 1 },
            { emoji: '📔', title: 'Diario de tu práctica',      desc: 'Registrá cómo te sentís. Niela aprende de tu evolución para personalizar mejor cada sesión.',                                  screen: 'diario-mood',         stagger: 2 },
          ] as const).map((card) => (
            <div
              key={card.title}
              className={`fade-up stagger-${card.stagger}${sec3In ? ' in-view' : ''}`}
              style={{
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(166,200,220,0.1)',
                borderRadius: 24,
                padding: '32px 28px',
                display: 'flex',
                flexDirection: 'column',
                gap: 16,
                transition: 'transform 200ms cubic-bezier(0.23,1,0.32,1), border-color 200ms',
              }}
            >
              <div style={{ fontSize: 28 }}>{card.emoji}</div>
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#e8f1f5', margin: 0 }}>{card.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(232,241,245,0.6)', margin: 0 }}>{card.desc}</p>
              {/* Mockup de teléfono con screenshot real */}
              <div style={{
                marginTop: 8,
                borderRadius: 36,
                border: '8px solid #0a0a0a',
                padding: 4,
                boxShadow: '0 24px 48px rgba(0,0,0,0.5)',
                overflow: 'hidden',
                alignSelf: 'center',
                width: '100%',
                maxWidth: 220,
              }}>
                <Image
                  src={`/screens/${card.screen}.webp`}
                  alt={card.title}
                  width={300}
                  height={560}
                  style={{ width: '100%', height: 'auto', borderRadius: 28, display: 'block' }}
                />
              </div>
            </div>
          ))}
          {/* 6ª celda vacía para centrar la fila de 2 */}
          <div style={{ display: 'none' }} aria-hidden="true" />
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
            Sé de los primeros en probar Niela
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(232,241,245,0.65)', margin: '0 0 48px', lineHeight: 1.6 }}>
            {count != null && count > 0 ? `Únete a ${count.toLocaleString('es')} personas que ya están esperando Niela.` : 'Sé de los primeros en probar Niela.'}
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
            <WaitlistForm dark onSuccess={(pos) => setCount(pos)} />
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

      {/* ══ 5.3 STICKY MOBILE CTA ══ */}
      {stickyVisible && (
        <div className="sticky-mobile-cta" style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: 60,
          background: 'rgba(31,45,58,0.92)',
          backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(166,200,220,0.12)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          zIndex: 200,
        }}>
          <span style={{ fontSize: 13, color: 'rgba(232,241,245,0.6)' }}>{count != null && count > 0 ? `${count.toLocaleString('es')} personas ya esperan` : 'Unite gratis'}</span>
          <button onClick={() => setStickyModalOpen(true)} style={{ background: '#a6c8dc', color: '#1f2d3a', border: 'none', borderRadius: 999, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            Únete gratis
          </button>
        </div>
      )}

      {/* ══ 5.3 STICKY MODAL ══ */}
      {stickyModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={() => setStickyModalOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#2c3e50', borderRadius: '24px 24px 0 0', padding: '32px 28px 40px', width: '100%', maxWidth: 480, position: 'relative', border: '1px solid rgba(166,200,220,0.15)', borderBottom: 'none' }}>
            <button onClick={() => setStickyModalOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#5a6f7d', fontSize: 20, cursor: 'pointer' }}>✕</button>
            <h3 style={{ fontSize: 22, fontWeight: 600, color: '#e8f1f5', margin: '0 0 8px' }}>Únete a la lista de espera</h3>
            <p style={{ fontSize: 14, color: 'rgba(232,241,245,0.65)', margin: '0 0 20px' }}>Gratis. Sin spam. Avisamos cuando lancemos.</p>
            {!stickySubmitted ? (
              <form onSubmit={handleStickySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input type="email" value={stickyEmail} onChange={e => setStickyEmail(e.target.value)} placeholder="tu@email.com" required style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: '1px solid rgba(166,200,220,0.3)', background: 'rgba(255,255,255,0.06)', color: '#e8f1f5', fontSize: 15, boxSizing: 'border-box', outline: 'none' }} />
                <button type="submit" disabled={stickyLoading} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#a6c8dc', color: '#1f2d3a', fontWeight: 700, fontSize: 15, cursor: stickyLoading ? 'not-allowed' : 'pointer', opacity: stickyLoading ? 0.6 : 1 }}>
                  {stickyLoading ? '...' : 'Unirme'}
                </button>
              </form>
            ) : (
              <SuccessState position={stickyPosition} email={lastSubmittedEmail} />
            )}
          </div>
        </div>
      )}

      {/* ══ 5.4 EXIT-INTENT MODAL ══ */}
      {exitModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setExitModalOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#2c3e50', borderRadius: 24, padding: '40px 36px', maxWidth: 440, width: '90%', position: 'relative', border: '1px solid rgba(166,200,220,0.15)' }}>
            <button onClick={() => setExitModalOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#5a6f7d', fontSize: 20, cursor: 'pointer' }}>✕</button>
            <h3 style={{ fontSize: 24, fontWeight: 600, color: '#e8f1f5', margin: '0 0 8px' }}>¿Te vas sin Niela?</h3>
            <p style={{ fontSize: 15, color: 'rgba(232,241,245,0.65)', margin: '0 0 24px' }}>Dejá tu email. Cuando lancemos, sos de los primeros en probarla.</p>
            {!exitSubmitted ? (
              <form onSubmit={handleExitSubmit}>
                <input type="email" value={exitEmail} onChange={e => setExitEmail(e.target.value)} placeholder="tu@email.com" required style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(166,200,220,0.3)', background: 'rgba(255,255,255,0.06)', color: '#e8f1f5', fontSize: 15, marginBottom: 12, boxSizing: 'border-box', outline: 'none' }} />
                <button type="submit" disabled={exitLoading} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#a6c8dc', color: '#1f2d3a', fontWeight: 700, fontSize: 15, cursor: exitLoading ? 'not-allowed' : 'pointer', opacity: exitLoading ? 0.6 : 1 }}>
                  {exitLoading ? '...' : 'Unirme a la lista'}
                </button>
              </form>
            ) : (
              <SuccessState position={exitPosition} email={lastSubmittedEmail} />
            )}
          </div>
        </div>
      )}

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

        /* 5.3 sticky bar hidden on desktop */
        .sticky-mobile-cta {
          display: flex;
        }
        @media (min-width: 768px) {
          .sticky-mobile-cta { display: none !important; }
        }

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
