'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { LangSwitcher } from '@/components/LangSwitcher'

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

/* ── 5.5 SuccessState with confetti + viral share ── */
function SuccessState({ position, email = '' }: { position: number; email?: string }) {
  const [copied, setCopied] = useState(false)
  const t = useTranslations('success')

  // Confetti al montar
  useEffect(() => {
    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#d4e3d4', '#e8d9b5', '#a8c9a8', '#ffffff', '#a6c8dc'],
      })
      setTimeout(() => {
        confetti({ particleCount: 50, angle: 60, spread: 55, origin: { x: 0, y: 0.7 } })
        confetti({ particleCount: 50, angle: 120, spread: 55, origin: { x: 1, y: 0.7 } })
      }, 300)
    })
  }, [])

  const hashEmail = (e: string) => {
    let hash = 0
    for (let i = 0; i < e.length; i++) hash = ((hash << 5) - hash) + e.charCodeAt(i)
    return Math.abs(hash).toString(16).slice(0, 8)
  }

  const refUrl = `https://niela.app?ref=${hashEmail(email)}`
  const shareText = t('shareText')
  const waUrl = `https://wa.me/?text=${encodeURIComponent(shareText + ' ' + refUrl)}`
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(refUrl)}`

  const copyLink = async () => {
    await navigator.clipboard.writeText(refUrl)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div style={{ textAlign: 'center', padding: '8px 0' }}>
      {/* Emoji con bounce usando framer-motion */}
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.05 }}
        style={{ fontSize: 40, marginBottom: 12, display: 'inline-block' }}
      >
        🪷
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
        style={{ fontSize: 20, fontWeight: 700, color: '#e8f1f5', margin: '0 0 6px' }}
      >
        {t('title')}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
        style={{ fontSize: 14, color: '#a6c8dc', margin: '0 0 6px', fontWeight: 500 }}
      >
        {t('position', { position })}
      </motion.p>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.45 }}
        style={{ fontSize: 13, color: 'rgba(232,241,245,0.6)', margin: '0 0 20px' }}
      >
        {t('subtitle')}
      </motion.p>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ fontSize: 12, color: 'rgba(232,241,245,0.45)', margin: '0 0 14px' }}
      >
        {t('shareTitle')} · {t('shareSubtitle')}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: 0.7 }}
        style={{ display: 'flex', gap: 8, justifyContent: 'center', flexWrap: 'wrap' }}
      >
        <a href={waUrl} target="_blank" rel="noopener" style={{ padding: '10px 16px', borderRadius: 12, background: '#25D366', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>{t('whatsappButton')}</a>
        <a href={twitterUrl} target="_blank" rel="noopener" style={{ padding: '10px 16px', borderRadius: 12, background: '#000', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none', border: '1px solid #333' }}>{t('twitterButton')}</a>
        <button onClick={copyLink} style={{ padding: '10px 16px', borderRadius: 12, background: 'rgba(166,200,220,0.15)', color: '#a6c8dc', fontSize: 13, fontWeight: 600, border: '1px solid rgba(166,200,220,0.3)', cursor: 'pointer' }}>
          {copied ? t('copied') : t('copyButton')}
        </button>
      </motion.div>
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
  const t = useTranslations('finalCta')
  const tErrors = useTranslations('errors')

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
          placeholder={t('emailPlaceholder')}
          style={{ flex: 1, padding: '13px 18px', borderRadius: 999, border: inputBorder, background: inputBg, fontSize: 14, color: inputColor, backdropFilter: 'blur(8px)', outline: 'none' }}
        />
        <button
          type="submit" disabled={submitting || !accepted}
          className="btn-primary"
          style={{ background: btnBg, color: btnColor, border: 'none', padding: '13px 24px', borderRadius: 999, fontSize: 14, fontWeight: 600, cursor: submitting || !accepted ? 'not-allowed' : 'pointer', whiteSpace: 'nowrap', opacity: submitting || !accepted ? 0.45 : 1, transition: 'transform 150ms ease-out, opacity 150ms ease-out' }}
        >{submitting ? '...' : t('submitButton')}</button>
      </form>
      <label style={{ display: 'flex', alignItems: 'flex-start', gap: 8, cursor: 'pointer', marginBottom: 8 }}>
        <input type="checkbox" checked={accepted} onChange={e => setAccepted(e.target.checked)} style={{ marginTop: 2, accentColor: '#a6c8dc', flexShrink: 0 }} />
        <span style={{ fontSize: 11, color: legalColor, lineHeight: 1.5 }}>
          {t('terms')}{' '}
          <a href="/legal/terminos" style={{ color: linkColor }}>{t('termsLink')}</a>
          {' '}{t('and')}{' '}
          <a href="/legal/privacidad" style={{ color: linkColor }}>{t('privacyLink')}</a>
        </span>
      </label>
      {status === 'error' && <p style={{ fontSize: 12, color: '#e08080', margin: 0 }}>{tErrors('generic')}</p>}
      {status === 'ratelimit' && <p style={{ fontSize: 12, color: '#e08080', margin: 0 }}>{tErrors('rateLimit')}</p>}
      {status === 'idle' && <p style={{ fontSize: 12, color: legalColor, margin: 0 }}>{t('footnote')}</p>}
    </div>
  )
}

/* ══════════════════════════════════════════════
   PAGE
══════════════════════════════════════════════ */
export default function Home() {
  const t = useTranslations()
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
    { name: t('traditions.zen.name'),      desc: t('traditions.zen.desc') },
    { name: t('traditions.budista.name'),  desc: t('traditions.budista.desc') },
    { name: t('traditions.cristiana.name'),desc: t('traditions.cristiana.desc') },
    { name: t('traditions.hindu.name'),    desc: t('traditions.hindu.desc') },
    { name: t('traditions.estoica.name'),  desc: t('traditions.estoica.desc') },
    { name: t('traditions.secular.name'),  desc: t('traditions.secular.desc') },
    { name: t('traditions.sufi.name'),     desc: t('traditions.sufi.desc') },
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
          <a href="#como-funciona" style={{ fontSize: 14, color: 'rgba(232,241,245,0.65)', textDecoration: 'none', transition: 'color 200ms' }}>{t('nav.comoFunciona')}</a>
          <a href="#tradiciones" style={{ fontSize: 14, color: 'rgba(232,241,245,0.65)', textDecoration: 'none', transition: 'color 200ms' }}>{t('nav.tradiciones')}</a>
          <a href="#comparativa" style={{ fontSize: 14, color: 'rgba(232,241,245,0.65)', textDecoration: 'none', transition: 'color 200ms' }}>{t('nav.comparativa')}</a>
          <LangSwitcher />
          <a href="#cta" style={{ background: '#a6c8dc', color: '#1f2d3a', border: 'none', padding: '10px 20px', borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'transform 150ms, opacity 150ms' }}>{t('nav.cta')}</a>
        </div>
      </nav>

      {/* ══ SECCIÓN 1: HERO ══ */}
      <section className="hero-section" style={{ minHeight: '100vh', paddingTop: 88, background: 'linear-gradient(160deg, #1f2d3a 0%, #2c3e50 60%, #1a2e3b 100%)', position: 'relative', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', padding: '88px 64px 80px', maxWidth: 1240, margin: '0 auto' }}>
        {/* Decorative blur sphere */}
        <div style={{ position: 'absolute', top: '15%', right: '5%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(166,200,220,0.18) 0%, rgba(166,200,220,0) 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '0%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,201,168,0.14) 0%, rgba(184,201,168,0) 70%)', pointerEvents: 'none' }} />

        {/* Left column */}
        <div style={{ position: 'relative', zIndex: 5 }}>
          {/* Pill waitlist */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'rgba(166,200,220,0.12)', border: '1px solid rgba(166,200,220,0.25)', borderRadius: 999, fontSize: 13, color: '#a6c8dc', marginBottom: 28, backdropFilter: 'blur(12px)', fontWeight: 500 }}>
            {count != null && count > 0 ? t('hero.waitlistChip', { count: count.toLocaleString('es') }) : t('hero.waitlistChipFallback')}
          </div>

          {/* Headline */}
          <h1 style={{ fontSize: 72, lineHeight: 1.0, fontWeight: 500, color: '#e8f1f5', margin: '0 0 24px', letterSpacing: '-2.5px' }}>
            <span className={`hero-line hero-line-1${heroMounted ? ' hero-line-visible' : ''}`} style={{ display: 'block' }}>{t('hero.title1')}</span>
            <span className={`hero-line hero-line-2${heroMounted ? ' hero-line-visible' : ''}`} style={{ display: 'block' }}>{t('hero.title2')}</span>
            <span className={`hero-line hero-line-3${heroMounted ? ' hero-line-visible' : ''}`} style={{ display: 'block', color: '#a6c8dc', fontStyle: 'italic' }}>{t('hero.title3')}</span>
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.65, color: 'rgba(232,241,245,0.72)', margin: '0 0 24px', maxWidth: 440 }}>
            {t('hero.subtitle')}
          </p>

          {/* 5.2 Hero email form */}
          {!heroSubmitted ? (
            <form onSubmit={handleHeroSubmit} style={{ display: 'flex', gap: 8, marginBottom: 8, maxWidth: 440 }}>
              <input
                type="email"
                value={heroEmail}
                onChange={e => setHeroEmail(e.target.value)}
                placeholder={t('hero.emailPlaceholder')}
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
                {heroLoading ? '...' : t('hero.submitButton')}
              </button>
            </form>
          ) : (
            <div style={{ marginBottom: 8, maxWidth: 440 }}>
              <SuccessState position={heroPosition} email={lastSubmittedEmail} />
            </div>
          )}
          <p style={{ fontSize: 12, color: 'rgba(232,241,245,0.4)', margin: '0 0 24px' }}>{t('hero.footnote')}</p>

          <div style={{ display: 'flex', gap: 14, marginBottom: 36, flexWrap: 'wrap' }}>
            <a
              href="#cta"
              className="btn-primary"
              style={{ background: 'rgba(166,200,220,0.15)', color: '#a6c8dc', padding: '14px 28px', borderRadius: 999, fontSize: 15, fontWeight: 600, textDecoration: 'none', transition: 'transform 150ms ease-out, opacity 150ms ease-out', border: '1px solid rgba(166,200,220,0.3)' }}
            >
              {t('hero.viewHow')}
            </a>
          </div>

          {/* Trust micro-signals */}
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { icon: '🔒', label: t('hero.badgeGdpr') },
              { icon: '🔬', label: t('hero.badgeEvidence') },
              { icon: '🌍', label: t('hero.badgeTraditions') },
            ].map(({ icon, label }) => (
              <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 13 }}>{icon}</span>
                <span style={{ fontSize: 12, color: 'rgba(232,241,245,0.5)' }}>{label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right column — floating iPhone mockup */}
        <div className="hero-mockup" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', position: 'relative' }}>
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
                <p style={{ fontSize: 11, color: '#4a6b80', margin: '0 0 2px' }}>{t('phoneMockup.greeting')}</p>
                <h4 style={{ fontSize: 15, color: '#1f2d3a', margin: 0, fontWeight: 500 }}>{t('phoneMockup.question')}</h4>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.7)', borderRadius: 14, padding: 10, border: '1px solid rgba(44,62,80,0.06)' }}>
                <p style={{ fontSize: 10, color: '#5a6f7d', margin: '0 0 6px' }}>{t('phoneMockup.intentLabel')}</p>
                <p style={{ fontSize: 11, color: '#2c3e50', margin: 0, lineHeight: 1.4 }}>{t('phoneMockup.intentText')}</p>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p style={{ fontSize: 9, color: '#4a6b80', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{t('phoneMockup.traditionLabel')}</p>
                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                  <span style={{ padding: '4px 9px', background: '#b8c9a8', borderRadius: 999, fontSize: 9, color: '#2d3d24', fontWeight: 500 }}>{t('heroMockup.chipZen')}</span>
                  <span style={{ padding: '4px 9px', background: 'rgba(212,184,150,0.4)', borderRadius: 999, fontSize: 9, color: '#5a4530' }}>{t('heroMockup.chipHindu')}</span>
                  <span style={{ padding: '4px 9px', background: 'rgba(180,180,180,0.3)', borderRadius: 999, fontSize: 9, color: '#2c3e50' }}>{t('heroMockup.chipSecular')}</span>
                </div>
              </div>
              <div style={{ marginTop: 'auto', background: 'linear-gradient(135deg, #2c3e50 0%, #4a6b80 100%)', borderRadius: 14, padding: 14, color: '#f0ebe0', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -20, right: -20, width: 60, height: 60, borderRadius: '50%', background: 'rgba(212,184,150,0.2)' }} />
                <p style={{ fontSize: 9, opacity: 0.7, margin: '0 0 4px', position: 'relative' }}>{t('phoneMockup.generatingLabel')}</p>
                <p style={{ fontSize: 11, margin: '0 0 10px', lineHeight: 1.4, position: 'relative' }}>{t('phoneMockup.meditationSnippet')}</p>
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
            {[t('trustBar.evidence'), t('trustBar.gdpr'), t('trustBar.encryption'), t('trustBar.advisory')].map((item, i, arr) => (
              <span key={item} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <span style={{ fontSize: 14, color: 'rgba(232,241,245,0.65)', fontWeight: 400, letterSpacing: '0.2px' }}>{item}</span>
                {i < arr.length - 1 && <span style={{ color: 'rgba(166,200,220,0.3)', margin: '0 16px', fontSize: 12 }}>·</span>}
              </span>
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
          <p style={{ fontSize: 12, color: '#a6c8dc', textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 16px', fontWeight: 600 }}>{t('howItWorks.eyebrow')}</p>
          <h2 className={`fade-up${sec3In ? ' in-view' : ''}`} style={{ fontSize: 44, fontWeight: 500, color: '#e8f1f5', margin: 0, letterSpacing: '-1px' }}>
            {t('howItWorks.title').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </h2>
        </div>
        <div className="como-funciona-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 1100, margin: '0 auto' }}>
          {([
            { emoji: '🪷', titleKey: 'howItWorks.card1Title', descKey: 'howItWorks.card1Text', screen: 'perfil-tradiciones', stagger: 1 },
            { emoji: '✨', titleKey: 'howItWorks.card2Title', descKey: 'howItWorks.card2Text', screen: 'niela-ai',            stagger: 2 },
            { emoji: '📚', titleKey: 'howItWorks.card3Title', descKey: 'howItWorks.card3Text', screen: 'inicio-curso-zen',    stagger: 3 },
            { emoji: '🔖', titleKey: 'howItWorks.card4Title', descKey: 'howItWorks.card4Text', screen: 'historial-sesiones',  stagger: 1 },
            { emoji: '📔', titleKey: 'howItWorks.card5Title', descKey: 'howItWorks.card5Text', screen: 'diario-mood',         stagger: 2 },
          ] as const).map((card) => (
            <div
              key={card.titleKey}
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
              <h3 style={{ fontSize: 18, fontWeight: 600, color: '#e8f1f5', margin: 0 }}>{t(card.titleKey)}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.65, color: 'rgba(232,241,245,0.6)', margin: 0 }}>{t(card.descKey)}</p>
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
                  alt={t(card.titleKey)}
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
          <p style={{ fontSize: 12, color: '#a6c8dc', textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 16px', fontWeight: 600 }}>{t('comparison.eyebrow')}</p>
          <h2 className={`fade-up${sec6In ? ' in-view' : ''}`} style={{ fontSize: 44, fontWeight: 500, color: '#e8f1f5', margin: 0, letterSpacing: '-1px' }}>{t('comparison.title')}</h2>
        </div>
        <div className="comparativa-wrap" style={{ maxWidth: 720, margin: '0 auto' }}>
        <div className={`fade-up${sec6In ? ' in-view' : ''}`} style={{ minWidth: 480, borderRadius: 20, overflow: 'hidden', border: '1px solid rgba(166,200,220,0.12)' }}>
          {/* Header */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', background: 'rgba(166,200,220,0.06)', borderBottom: '1px solid rgba(166,200,220,0.1)' }}>
            {[t('comparison.headerFeature'), t('comparison.headerNiela'), t('comparison.headerCalm'), t('comparison.headerHeadspace')].map((h, i) => (
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
              <span style={{ fontSize: 13, color: 'rgba(232,241,245,0.4)', fontWeight: 400 }}>{t('comparison.partial')}</span>
            );
            const rows: { label: string; niela: React.ReactNode; calm: React.ReactNode; headspace: React.ReactNode }[] = [
              { label: t('comparison.rowTradition'), niela: '✓', calm: '✗', headspace: '✗' },
              { label: t('comparison.rowAi'),        niela: '✓', calm: '✗', headspace: (
                <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                  <span>✓</span>
                  <span style={{ fontSize: 10, color: 'rgba(232,241,245,0.3)', fontWeight: 400 }}>{t('comparison.ebbNote')}</span>
                </span>
              )},
              { label: t('comparison.rowMultiTradition'),  niela: '✓', calm: '✗', headspace: '✗' },
              { label: t('comparison.rowNativeLanguage'),  niela: '✓', calm: partial, headspace: partial },
              { label: t('comparison.rowNoTemplates'),     niela: '✓', calm: '✗', headspace: '✗' },
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
        </div>
        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(232,241,245,0.25)', marginTop: 20, fontStyle: 'italic' }}>
          {t('comparison.footer')}
        </p>
      </section>

      {/* ══ SECCIÓN 7: POR QUÉ NIELA EXISTE ══ */}
      <section
        id="tradiciones"
        ref={sec7Ref as React.RefObject<HTMLElement>}
        style={{ padding: '100px 64px', background: 'linear-gradient(180deg, #243344 0%, #1f2d3a 100%)' }}
      >
        <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
          <p style={{ fontSize: 12, color: '#a6c8dc', textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 24px', fontWeight: 600 }}>{t('whyExist.eyebrow')}</p>
          <h2 className={`fade-up${sec7In ? ' in-view' : ''}`} style={{ fontSize: 44, fontWeight: 500, color: '#e8f1f5', margin: '0 0 28px', letterSpacing: '-1px', lineHeight: 1.1 }}>
            {t('whyExist.title').split('\n').map((line, i) => <span key={i}>{line}{i === 0 && <br />}</span>)}
          </h2>
          <p className={`fade-up stagger-2${sec7In ? ' in-view' : ''}`} style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(232,241,245,0.65)', margin: '0 0 56px' }}>
            {t('whyExist.text')}
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
            {t('finalCta.title')}
          </h2>
          <p style={{ fontSize: 18, color: 'rgba(232,241,245,0.65)', margin: '0 0 48px', lineHeight: 1.6 }}>
            {count != null && count > 0 ? t('finalCta.subtitleWithCount', { count: count.toLocaleString('es') }) : t('finalCta.subtitleFallback')}
          </p>

          {/* App store placeholders */}
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', marginBottom: 48, flexWrap: 'wrap' }}>
            {[
              { labelKey: 'finalCta.appStore', icon: '🍎' },
              { labelKey: 'finalCta.googlePlay', icon: '▶' },
            ].map(btn => (
              <button key={btn.labelKey} disabled style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '14px 28px', borderRadius: 14, border: '1px solid rgba(166,200,220,0.2)', background: 'rgba(255,255,255,0.04)', color: 'rgba(232,241,245,0.4)', fontSize: 15, fontWeight: 500, cursor: 'not-allowed' }}>
                <span style={{ fontSize: 18 }}>{btn.icon}</span>
                <span>
                  <span style={{ display: 'block', fontSize: 10, opacity: 0.7, textAlign: 'left' }}>{t('finalCta.appStoreSoon')}</span>
                  {t(btn.labelKey)}
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
            { headingKey: 'footer.productHeader', links: [t('footer.comoFunciona'), t('footer.tradiciones'), t('footer.precios'), t('footer.appMovil')] },
            { headingKey: 'footer.companyHeader',  links: [t('footer.sobreNosotros'), t('footer.manifiesto'), t('footer.carreras')] },
            { headingKey: 'footer.resourcesHeader', links: [t('footer.blog'), t('footer.faq'), t('footer.soporte')] },
            { headingKey: 'footer.legalHeader',    links: [t('footer.terminos'), t('footer.privacidad'), t('footer.cookies')] },
          ].map(col => (
            <div key={col.headingKey}>
              <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(232,241,245,0.4)', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 16px' }}>{t(col.headingKey)}</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(link => (
                  <a key={link} href="#" style={{ fontSize: 14, color: 'rgba(232,241,245,0.55)', textDecoration: 'none', transition: 'color 200ms' }}>{link}</a>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div style={{ maxWidth: 1040, margin: '0 auto', paddingTop: 28, borderTop: '1px solid rgba(166,200,220,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 13, color: 'rgba(232,241,245,0.35)', margin: 0 }}>{t('footer.copyright')}</p>
          <div style={{ display: 'flex', gap: 20 }}>
            {[t('footer.instagram'), t('footer.tiktok'), t('footer.x'), t('footer.youtube')].map(sn => (
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
          <span style={{ fontSize: 13, color: 'rgba(232,241,245,0.6)' }}>{count != null && count > 0 ? t('stickyBar.waitingText', { count: count.toLocaleString('es') }) : t('stickyBar.waitingFallback')}</span>
          <button onClick={() => setStickyModalOpen(true)} style={{ background: '#a6c8dc', color: '#1f2d3a', border: 'none', borderRadius: 999, padding: '10px 20px', fontWeight: 700, fontSize: 14, cursor: 'pointer' }}>
            {t('stickyBar.submitButton')}
          </button>
        </div>
      )}

      {/* ══ 5.3 STICKY MODAL ══ */}
      {stickyModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'flex-end', justifyContent: 'center' }}
          onClick={() => setStickyModalOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#2c3e50', borderRadius: '24px 24px 0 0', padding: '32px 28px 40px', width: '100%', maxWidth: 480, position: 'relative', border: '1px solid rgba(166,200,220,0.15)', borderBottom: 'none' }}>
            <button onClick={() => setStickyModalOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#5a6f7d', fontSize: 20, cursor: 'pointer' }}>✕</button>
            <h3 style={{ fontSize: 22, fontWeight: 600, color: '#e8f1f5', margin: '0 0 8px' }}>{t('stickyModal.title')}</h3>
            <p style={{ fontSize: 14, color: 'rgba(232,241,245,0.65)', margin: '0 0 20px' }}>{t('stickyModal.subtitle')}</p>
            {!stickySubmitted ? (
              <form onSubmit={handleStickySubmit} style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <input type="email" value={stickyEmail} onChange={e => setStickyEmail(e.target.value)} placeholder={t('hero.emailPlaceholder')} required style={{ width: '100%', padding: '13px 16px', borderRadius: 12, border: '1px solid rgba(166,200,220,0.3)', background: 'rgba(255,255,255,0.06)', color: '#e8f1f5', fontSize: 15, boxSizing: 'border-box', outline: 'none' }} />
                <button type="submit" disabled={stickyLoading} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#a6c8dc', color: '#1f2d3a', fontWeight: 700, fontSize: 15, cursor: stickyLoading ? 'not-allowed' : 'pointer', opacity: stickyLoading ? 0.6 : 1 }}>
                  {stickyLoading ? '...' : t('stickyModal.submitButton')}
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
            <h3 style={{ fontSize: 24, fontWeight: 600, color: '#e8f1f5', margin: '0 0 8px' }}>{t('exitModal.title')}</h3>
            <p style={{ fontSize: 15, color: 'rgba(232,241,245,0.65)', margin: '0 0 24px' }}>{t('exitModal.subtitle')}</p>
            {!exitSubmitted ? (
              <form onSubmit={handleExitSubmit}>
                <input type="email" value={exitEmail} onChange={e => setExitEmail(e.target.value)} placeholder={t('hero.emailPlaceholder')} required style={{ width: '100%', padding: '12px 16px', borderRadius: 12, border: '1px solid rgba(166,200,220,0.3)', background: 'rgba(255,255,255,0.06)', color: '#e8f1f5', fontSize: 15, marginBottom: 12, boxSizing: 'border-box', outline: 'none' }} />
                <button type="submit" disabled={exitLoading} style={{ width: '100%', padding: '14px', borderRadius: 12, border: 'none', background: '#a6c8dc', color: '#1f2d3a', fontWeight: 700, fontSize: 15, cursor: exitLoading ? 'not-allowed' : 'pointer', opacity: exitLoading ? 0.6 : 1 }}>
                  {exitLoading ? '...' : t('exitModal.submitButton')}
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

        /* como-funciona grid responsive */
        .como-funciona-grid { grid-template-columns: repeat(3,1fr) !important; }
        @media (max-width: 900px) {
          .como-funciona-grid { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          .como-funciona-grid { grid-template-columns: 1fr !important; }
        }

        /* comparativa scroll on mobile */
        .comparativa-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }

        /* hero mockup — hidden on mobile so hero fits in 1 viewport */
        @media (max-width: 768px) {
          .hero-mockup { display: none !important; }
          .hero-section { grid-template-columns: 1fr !important; min-height: unset !important; padding: 100px 24px 60px !important; }
        }

        /* responsive */
        @media (max-width: 900px) {
          section[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; padding: 80px 24px !important; }
          div[style*="repeat(3,1fr)"] { grid-template-columns: 1fr !important; }
          div[style*="repeat(2,1fr)"] { grid-template-columns: 1fr !important; }
          div[style*="repeat(4,1fr)"] { grid-template-columns: repeat(2,1fr) !important; }
          nav { padding: 16px 24px !important; }
          h1[style*="font-size: 72px"] { font-size: 44px !important; letter-spacing: -1.5px !important; line-height: 1.1 !important; }
          h2[style*="font-size: 44px"] { font-size: 32px !important; }
          h2[style*="font-size: 56px"] { font-size: 38px !important; }
          nav > div:last-child a:not(:last-child) { display: none !important; }
        }
        @media (max-width: 600px) {
          div[style*="repeat(4,1fr)"] { grid-template-columns: 1fr !important; }
          section { padding: 64px 20px !important; }
          nav { padding: 14px 20px !important; }
          h1[style*="font-size: 72px"] { font-size: 36px !important; letter-spacing: -1px !important; line-height: 1.15 !important; }
          h2[style*="font-size: 44px"] { font-size: 28px !important; }
          p[style*="font-size: 17px"] { font-size: 15px !important; }
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
