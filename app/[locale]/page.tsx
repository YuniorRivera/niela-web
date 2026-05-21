'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Image from 'next/image'
import Link from 'next/link'
import { useTranslations, useLocale } from 'next-intl'
import { LangSwitcher } from '@/components/LangSwitcher'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://medita-app-production.up.railway.app'
const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.yuniorrivera.niela'

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

/* ── SuccessState with confetti + viral share ── */
function SuccessState({ position, email = '' }: { position: number; email?: string }) {
  const [copied, setCopied] = useState(false)
  const t = useTranslations('success')

  useEffect(() => {
    import('canvas-confetti').then(({ default: confetti }) => {
      confetti({
        particleCount: 80, spread: 70, origin: { y: 0.6 },
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
      <motion.div
        initial={{ scale: 0, rotate: -15 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 400, damping: 14, delay: 0.05 }}
        style={{ fontSize: 40, marginBottom: 12, display: 'inline-block' }}
      >
        🪷
      </motion.div>
      <motion.p
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.15 }}
        style={{ fontSize: 20, fontWeight: 700, color: '#e8f1f5', margin: '0 0 6px' }}
      >
        {t('title')}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.3 }}
        style={{ fontSize: 14, color: '#a6c8dc', margin: '0 0 6px', fontWeight: 500 }}
      >
        {t('position', { position })}
      </motion.p>
      <motion.p
        initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1], delay: 0.45 }}
        style={{ fontSize: 13, color: 'rgba(232,241,245,0.6)', margin: '0 0 20px' }}
      >
        {t('subtitle')}
      </motion.p>
      <motion.p
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
        style={{ fontSize: 12, color: 'rgba(232,241,245,0.45)', margin: '0 0 14px' }}
      >
        {t('shareTitle')} · {t('shareSubtitle')}
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
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

/* ── WaitlistForm (keep as-is, used in roadmap section) ── */
function WaitlistForm({ dark = false, onSuccess }: { dark?: boolean; onSuccess?: (position: number) => void }) {
  const [email, setEmail] = useState('')
  const [accepted, setAccepted] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error' | 'ratelimit'>('idle')
  const [position, setPosition] = useState(0)
  const [submittedEmail, setSubmittedEmail] = useState('')
  const t = useTranslations('finalCta')
  const tErrors = useTranslations('errors')
  const locale = useLocale()

  const submit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    setStatus('idle')
    try {
      const r = await fetch(`${API_URL}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, locale }),
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
  }, [email, locale, onSuccess])

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
  const locale = useLocale()
  const [count, setCount] = useState<number | null>(null)
  const [heroMounted, setHeroMounted] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  // Exit-intent states
  const [exitModalOpen, setExitModalOpen] = useState(false)
  const [exitEmail, setExitEmail] = useState('')
  const [exitSubmitted, setExitSubmitted] = useState(false)
  const [exitLoading, setExitLoading] = useState(false)
  const [exitPosition, setExitPosition] = useState(0)
  const [lastSubmittedEmail, setLastSubmittedEmail] = useState('')

  // Sticky CTA states
  const [stickyVisible, setStickyVisible] = useState(false)

  // Fetch real count
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

  // Scroll listener for sticky CTA
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

  // Exit-intent listener (desktop only)
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
        body: JSON.stringify({ email, locale }),
      })
      const data = await res.json()
      if (res.ok || res.status === 409) {
        if (data.position != null) setCount(data.position)
        setLastSubmittedEmail(email)
        sessionStorage.setItem('emailSubmitted', '1')
        onSuccess(data.position ?? count ?? 1)
      }
    } catch {}
    finally { setLoading(false) }
  }, [count, locale])

  const handleExitSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    await handleEmailSubmit(
      exitEmail,
      (position) => { setExitPosition(position); setExitSubmitted(true) },
      setExitLoading
    )
  }, [exitEmail, handleEmailSubmit])

  /* section refs */
  const [sec2Ref, sec2In] = useInView(0.15)
  const [sec3Ref, sec3In] = useInView(0.1)
  const [secTradRef, secTradIn] = useInView(0.1)
  const [secHowRef, secHowIn] = useInView(0.1)
  const [secRoadRef, secRoadIn] = useInView(0.1)
  const [sec6Ref, sec6In] = useInView(0.1)
  const [secFounderRef, secFounderIn] = useInView(0.1)
  const [secFaqRef, secFaqIn] = useInView(0.1)

  /* Traditions data for cards */
  const traditionCards = [
    {
      key: 'zen',
      name: t('traditions2.zen.name'),
      desc: t('traditions2.zen.desc'),
      gradient: 'linear-gradient(160deg, #2c4a3a 0%, #1a3028 100%)',
    },
    {
      key: 'tibetana',
      name: t('traditions2.tibetana.name'),
      desc: t('traditions2.tibetana.desc'),
      gradient: 'linear-gradient(160deg, #4a2c5a 0%, #2a1840 100%)',
    },
    {
      key: 'andina',
      name: t('traditions2.andina.name'),
      desc: t('traditions2.andina.desc'),
      gradient: 'linear-gradient(160deg, #4a3020 0%, #2c1c10 100%)',
    },
    {
      key: 'sufi',
      name: t('traditions2.sufi.name'),
      desc: t('traditions2.sufi.desc'),
      gradient: 'linear-gradient(160deg, #4a3828 0%, #2c2018 100%)',
    },
    {
      key: 'cristiana',
      name: t('traditions2.cristiana.name'),
      desc: t('traditions2.cristiana.desc'),
      gradient: 'linear-gradient(160deg, #3a3a5a 0%, #1e1e40 100%)',
    },
    {
      key: 'islamica',
      name: t('traditions2.islamica.name'),
      desc: t('traditions2.islamica.desc'),
      gradient: 'linear-gradient(160deg, #1a4a3a 0%, #0a2820 100%)',
    },
    {
      key: 'laica',
      name: t('traditions2.laica.name'),
      desc: t('traditions2.laica.desc'),
      gradient: 'linear-gradient(160deg, #2a3a4a 0%, #1a2634 100%)',
    },
  ]

  /* FAQ items */
  const faqItems = [
    { q: t('faq.q1'), a: t('faq.a1') },
    { q: t('faq.q2'), a: t('faq.a2') },
    { q: t('faq.q3'), a: t('faq.a3') },
    { q: t('faq.q4'), a: t('faq.a4') },
    { q: t('faq.q5'), a: t('faq.a5') },
    { q: t('faq.q6'), a: t('faq.a6') },
    { q: t('faq.q7'), a: t('faq.a7') },
  ]

  return (
    <main style={{ margin: 0, minHeight: '100vh', background: '#1f2d3a', overflowX: 'hidden' }}>

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
          <div className="lang-switcher-wrap"><LangSwitcher /></div>
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener" style={{ background: '#a6c8dc', color: '#1f2d3a', border: 'none', padding: '10px 20px', borderRadius: 999, fontSize: 13, fontWeight: 600, textDecoration: 'none', transition: 'transform 150ms, opacity 150ms' }}>{t('nav.download')}</a>
        </div>
      </nav>

      {/* ══ SECTION 1: HERO ══ */}
      <section className="hero-section" style={{ minHeight: '100vh', background: 'linear-gradient(160deg, #1f2d3a 0%, #2c3e50 60%, #1a2e3b 100%)', position: 'relative', overflow: 'hidden', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40, alignItems: 'center', padding: '88px 64px 80px', maxWidth: 1240, margin: '0 auto' }}>
        {/* Decorative blur spheres */}
        <div style={{ position: 'absolute', top: '15%', right: '5%', width: 420, height: 420, borderRadius: '50%', background: 'radial-gradient(circle, rgba(166,200,220,0.18) 0%, rgba(166,200,220,0) 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '10%', left: '0%', width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(184,201,168,0.14) 0%, rgba(184,201,168,0) 70%)', pointerEvents: 'none' }} />

        {/* Left column */}
        <div style={{ position: 'relative', zIndex: 5 }}>
          {/* Users chip */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '7px 16px', background: 'rgba(166,200,220,0.12)', border: '1px solid rgba(166,200,220,0.25)', borderRadius: 999, fontSize: 13, color: '#a6c8dc', marginBottom: 28, backdropFilter: 'blur(12px)', fontWeight: 500 }}>
            {count != null && count > 0 ? t('hero.usersChip', { count: count.toLocaleString('es') }) : t('hero.usersChipFallback')}
          </div>

          {/* Headline */}
          <h1 className="hero-title" style={{ fontSize: 72, lineHeight: 1.0, fontWeight: 500, color: '#e8f1f5', margin: '0 0 24px', letterSpacing: '-2.5px' }}>
            <span className={`hero-line hero-line-1${heroMounted ? ' hero-line-visible' : ''}`} style={{ display: 'block' }}>{t('hero.title1')}</span>
            <span className={`hero-line hero-line-2${heroMounted ? ' hero-line-visible' : ''}`} style={{ display: 'block' }}>{t('hero.title2')}</span>
            {t('hero.title3') && (
              <span className={`hero-line hero-line-3${heroMounted ? ' hero-line-visible' : ''}`} style={{ display: 'block', color: '#a6c8dc', fontStyle: 'italic' }}>{t('hero.title3')}</span>
            )}
          </h1>

          <p style={{ fontSize: 17, lineHeight: 1.65, color: 'rgba(232,241,245,0.72)', margin: '0 0 32px', maxWidth: 440 }}>
            {t('hero.subtitle')}
          </p>

          {/* CTA buttons */}
          <div style={{ display: 'flex', gap: 14, marginBottom: 36, flexWrap: 'wrap', alignItems: 'center' }}>
            <a href={PLAY_STORE_URL} target="_blank" rel="noopener" className="btn-play">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.83 1.01-1.3 1.7-.76l14 8.5c.62.38.62 1.14 0 1.52l-14 8.5c-.69.54-1.7.07-1.7-.76z"/></svg>
              {t('hero.downloadPlay')}
            </a>
            <span className="btn-appstore-disabled">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" style={{ opacity: 0.4 }}><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
              {t('hero.appStoreSoon')}
            </span>
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

      {/* ══ SECTION 2: TRUST BAR ══ */}
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

      {/* ══ SECTION 3: TRADITIONS — 7 LARGE CARDS ══ */}
      <section
        id="tradiciones"
        ref={secTradRef as React.RefObject<HTMLElement>}
        className="traditions-section"
        style={{ padding: '100px 64px', background: 'linear-gradient(180deg, #1f2d3a 0%, #1a2635 100%)', position: 'relative' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 56, maxWidth: 720, margin: '0 auto 56px' }}>
          <h2 className={`fade-up${secTradIn ? ' in-view' : ''}`} style={{ fontSize: 44, fontWeight: 500, color: '#e8f1f5', margin: '0 0 16px', letterSpacing: '-1px' }}>
            {t('traditions2.title')}
          </h2>
          <p className={`fade-up stagger-2${secTradIn ? ' in-view' : ''}`} style={{ fontSize: 16, lineHeight: 1.65, color: 'rgba(232,241,245,0.6)', margin: 0 }}>
            {t('traditions2.subtitle')}
          </p>
        </div>

        <div className="traditions-grid" style={{ maxWidth: 1200, margin: '0 auto' }}>
          {traditionCards.map((card, i) => (
            <div
              key={card.key}
              className={`tradition-card fade-up stagger-${(i % 3) + 1}${secTradIn ? ' in-view' : ''}`}
              style={{
                height: 280,
                background: card.gradient,
                borderRadius: 20,
                position: 'relative',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'flex-end',
                padding: '24px 20px',
              }}
            >
              {/* dark overlay */}
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)', pointerEvents: 'none' }} />
              <div style={{ position: 'relative', zIndex: 2 }}>
                <p style={{ fontSize: 22, fontWeight: 700, color: '#ffffff', margin: '0 0 4px', lineHeight: 1.2 }}>{card.name}</p>
                <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0, lineHeight: 1.4 }}>{card.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SECTION 4: CÓMO FUNCIONA — 3 STEPS ══ */}
      <section
        id="como-funciona"
        ref={secHowRef as React.RefObject<HTMLElement>}
        className="roadmap-section"
        style={{ padding: '100px 64px', background: '#243344', position: 'relative' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 72, maxWidth: 720, margin: '0 auto 72px' }}>
          <p style={{ fontSize: 12, color: '#a6c8dc', textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 16px', fontWeight: 600 }}>{t('howItWorks2.eyebrow')}</p>
          <h2 className={`fade-up${secHowIn ? ' in-view' : ''}`} style={{ fontSize: 44, fontWeight: 500, color: '#e8f1f5', margin: 0, letterSpacing: '-1px' }}>
            {t('howItWorks2.title')}
          </h2>
        </div>

        <div className="roadmap-grid" style={{ maxWidth: 900, margin: '0 auto' }}>
          {[
            { num: '01', title: t('howItWorks2.step1Title'), desc: t('howItWorks2.step1Desc') },
            { num: '02', title: t('howItWorks2.step2Title'), desc: t('howItWorks2.step2Desc') },
            { num: '03', title: t('howItWorks2.step3Title'), desc: t('howItWorks2.step3Desc') },
          ].map((step, i) => (
            <div
              key={step.num}
              className={`fade-up stagger-${i + 1}${secHowIn ? ' in-view' : ''}`}
              style={{ padding: '32px 24px', position: 'relative' }}
            >
              <div style={{ fontSize: 80, fontWeight: 700, color: 'rgba(166,200,220,0.15)', lineHeight: 1, margin: '0 0 16px', fontVariantNumeric: 'tabular-nums' }}>{step.num}</div>
              <h3 style={{ fontSize: 20, fontWeight: 600, color: '#e8f1f5', margin: '0 0 12px' }}>{step.title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.65, color: 'rgba(232,241,245,0.6)', margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ SECTION 5: ROADMAP ══ */}
      <section
        ref={secRoadRef as React.RefObject<HTMLElement>}
        className="roadmap-section"
        style={{ padding: '100px 64px', background: '#1a2635', position: 'relative' }}
      >
        <div style={{ textAlign: 'center', marginBottom: 64, maxWidth: 720, margin: '0 auto 64px' }}>
          <p style={{ fontSize: 12, color: '#a6c8dc', textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 16px', fontWeight: 600 }}>{t('roadmap.eyebrow')}</p>
          <h2 className={`fade-up${secRoadIn ? ' in-view' : ''}`} style={{ fontSize: 44, fontWeight: 500, color: '#e8f1f5', margin: 0, letterSpacing: '-1px' }}>
            {t('roadmap.title')}
          </h2>
        </div>

        <div className="roadmap-grid" style={{ maxWidth: 1100, margin: '0 auto 64px' }}>
          {[
            {
              title: t('roadmap.col1Title'),
              items: [t('roadmap.col1Items.0'), t('roadmap.col1Items.1'), t('roadmap.col1Items.2')],
              done: [true, true, true],
              prefix: '✅',
            },
            {
              title: t('roadmap.col2Title'),
              items: [t('roadmap.col2Items.0'), t('roadmap.col2Items.1'), t('roadmap.col2Items.2')],
              done: [false, false, false],
              prefix: '🔜',
            },
            {
              title: t('roadmap.col3Title'),
              items: [t('roadmap.col3Items.0'), t('roadmap.col3Items.1'), t('roadmap.col3Items.2'), t('roadmap.col3Items.3')],
              done: [false, false, false, false],
              prefix: '🔜',
            },
          ].map((col, ci) => (
            <div
              key={ci}
              className={`fade-up stagger-${ci + 1}${secRoadIn ? ' in-view' : ''}`}
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(166,200,220,0.1)', borderRadius: 20, padding: '32px 28px' }}
            >
              <p style={{ fontSize: 13, fontWeight: 700, color: '#a6c8dc', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 20px' }}>
                {ci === 0 ? '✅ ' : ''}{col.title}
              </p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {col.items.map((item, ii) => (
                  <div key={ii} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                    <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{col.done[ii] ? '✅' : '🔜'}</span>
                    <span style={{ fontSize: 15, color: col.done[ii] ? 'rgba(232,241,245,0.85)' : 'rgba(232,241,245,0.5)', lineHeight: 1.45 }}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Email CTA below roadmap */}
        <div style={{ textAlign: 'center', maxWidth: 560, margin: '0 auto' }}>
          <p style={{ fontSize: 16, color: 'rgba(232,241,245,0.65)', margin: '0 0 24px', lineHeight: 1.6 }}>{t('roadmap.emailCta')}</p>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <WaitlistForm dark onSuccess={(pos) => setCount(pos)} />
          </div>
        </div>
      </section>

      {/* ══ SECTION 6: COMPARATIVA ══ */}
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
                { label: t('comparison.rowAi'), niela: '✓', calm: '✗', headspace: (
                  <span style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                    <span>✓</span>
                    <span style={{ fontSize: 10, color: 'rgba(232,241,245,0.3)', fontWeight: 400 }}>{t('comparison.ebbNote')}</span>
                  </span>
                )},
                { label: t('comparison.rowMultiTradition'), niela: '✓', calm: '✗', headspace: '✗' },
                { label: t('comparison.rowNativeLanguage'), niela: '✓', calm: partial, headspace: partial },
                { label: t('comparison.rowNoTemplates'), niela: '✓', calm: '✗', headspace: '✗' },
                { label: t('comparison.rowProgressiveLaunch'), niela: '✓', calm: '✗', headspace: '✗' },
                { label: t('comparison.rowNoTracking'), niela: '✓', calm: '✗', headspace: '✗' },
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
        <p style={{ textAlign: 'center', fontSize: 11, color: 'rgba(232,241,245,0.25)', marginTop: 20, fontStyle: 'italic', maxWidth: 720, margin: '20px auto 0' }}>
          {t('comparison.footer')}
        </p>
      </section>

      {/* ══ SECTION 7: FUNDADOR ══ */}
      <section
        ref={secFounderRef as React.RefObject<HTMLElement>}
        className="founder-section"
        style={{ padding: '100px 64px', background: '#1f2d3a' }}
      >
        <div style={{ maxWidth: 900, margin: '0 auto' }}>
          <p style={{ fontSize: 12, color: '#a6c8dc', textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 48px', fontWeight: 600, textAlign: 'center' }}>{t('founder.eyebrow')}</p>
          <div className={`founder-grid fade-up${secFounderIn ? ' in-view' : ''}`}>
            {/* Avatar */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16 }}>
              {/* founder-avatar: swap data-img to real photo when available */}
              <div
                className="founder-avatar"
                data-img="founder-yunior.jpg"
                style={{
                  width: 160, height: 160, borderRadius: '50%',
                  background: 'linear-gradient(135deg, #2c4a3a 0%, #4a6b80 100%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 40, fontWeight: 700, color: '#e8f1f5',
                  border: '3px solid rgba(166,200,220,0.2)',
                  flexShrink: 0,
                }}
              >
                YR
              </div>
              <p style={{ fontSize: 13, color: 'rgba(232,241,245,0.45)', margin: 0, textAlign: 'center' }}>Yunior Rivera</p>
            </div>

            {/* Text */}
            <div>
              <h2 style={{ fontSize: 36, fontWeight: 500, color: '#e8f1f5', margin: '0 0 24px', letterSpacing: '-0.5px' }}>
                {t('founder.title')}
              </h2>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(232,241,245,0.7)', margin: '0 0 16px' }}>{t('founder.text1')}</p>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(232,241,245,0.7)', margin: '0 0 16px' }}>{t('founder.text2')}</p>
              <p style={{ fontSize: 16, lineHeight: 1.75, color: 'rgba(232,241,245,0.7)', margin: '0 0 28px' }}>{t('founder.text3')}</p>
              <a href="mailto:hola@niela.app" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '12px 24px', background: 'rgba(166,200,220,0.1)', border: '1px solid rgba(166,200,220,0.25)', borderRadius: 12, color: '#a6c8dc', fontSize: 14, fontWeight: 600, textDecoration: 'none', transition: 'background 200ms' }}>
                ✉ {t('founder.cta')}
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ══ SECTION 8: FAQ ══ */}
      <section
        ref={secFaqRef as React.RefObject<HTMLElement>}
        className="faq-section"
        style={{ padding: '100px 64px', background: '#1a2635' }}
      >
        <div style={{ maxWidth: 720, margin: '0 auto' }}>
          <p style={{ fontSize: 12, color: '#a6c8dc', textTransform: 'uppercase', letterSpacing: '3px', margin: '0 0 16px', fontWeight: 600, textAlign: 'center' }}>{t('faq.eyebrow')}</p>
          <h2 className={`fade-up${secFaqIn ? ' in-view' : ''}`} style={{ fontSize: 44, fontWeight: 500, color: '#e8f1f5', margin: '0 0 56px', letterSpacing: '-1px', textAlign: 'center' }}>
            {t('faq.title')}
          </h2>

          <div>
            {faqItems.map((item, i) => (
              <div key={i} className="faq-item">
                <button
                  className="faq-question"
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  aria-expanded={openFaq === i}
                >
                  <span>{item.q}</span>
                  <span style={{ fontSize: 18, transition: 'transform 200ms', transform: openFaq === i ? 'rotate(45deg)' : 'none', flexShrink: 0, marginLeft: 16 }}>+</span>
                </button>
                {openFaq === i && (
                  <div className="faq-answer">
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ FOOTER RICO ══ */}
      <footer style={{ background: '#0d1821', borderTop: '1px solid rgba(166,200,220,0.07)', padding: '64px 64px 32px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 40, maxWidth: 1040, margin: '0 auto 48px' }}>

          {/* Col 1: Tradiciones */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(232,241,245,0.4)', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 16px' }}>{t('footer.traditionsHeader')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: t('footer.howToMeditateZen'), href: '/#tradiciones' },
                { label: t('footer.tibetanMeditation'), href: '/#tradiciones' },
                { label: t('footer.sufism'), href: '/#tradiciones' },
                { label: t('footer.andineTradition'), href: '/#tradiciones' },
                { label: t('footer.christianMeditation'), href: '/#tradiciones' },
                { label: t('footer.secularMindfulness'), href: '/#tradiciones' },
              ].map(({ label, href }) => (
                <a key={label} href={href} style={{ fontSize: 14, color: 'rgba(232,241,245,0.55)', textDecoration: 'none', transition: 'color 200ms' }}>{label}</a>
              ))}
            </div>
          </div>

          {/* Col 2: Recursos */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(232,241,245,0.4)', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 16px' }}>{t('footer.resourcesHeader')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: t('footer.blogSoon'), href: '#' },
                { label: t('footer.breathingGuide'), href: '#' },
                { label: t('footer.glossary'), href: '#' },
              ].map(({ label, href }) => (
                <a key={label} href={href} style={{ fontSize: 14, color: 'rgba(232,241,245,0.3)', textDecoration: 'none', cursor: 'default' }}>{label}</a>
              ))}
            </div>
          </div>

          {/* Col 3: Empresa */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(232,241,245,0.4)', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 16px' }}>{t('footer.companyHeader')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: t('footer.aboutNiela'), href: '#' },
                { label: t('footer.contact'), href: 'mailto:hola@niela.app' },
                { label: t('footer.privacidad'), href: '/legal/privacidad' },
                { label: t('footer.terminos'), href: '/legal/terminos' },
              ].map(({ label, href }) => (
                <a key={label} href={href} style={{ fontSize: 14, color: 'rgba(232,241,245,0.55)', textDecoration: 'none', transition: 'color 200ms' }}>{label}</a>
              ))}
            </div>
          </div>

          {/* Col 4: Descargar */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 600, color: 'rgba(232,241,245,0.4)', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 16px' }}>{t('footer.downloadHeader')}</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <a href={PLAY_STORE_URL} target="_blank" rel="noopener" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(166,200,220,0.1)', border: '1px solid rgba(166,200,220,0.2)', borderRadius: 10, color: '#a6c8dc', fontSize: 14, fontWeight: 600, textDecoration: 'none', width: 'fit-content' }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M3 20.5v-17c0-.83 1.01-1.3 1.7-.76l14 8.5c.62.38.62 1.14 0 1.52l-14 8.5c-.69.54-1.7.07-1.7-.76z"/></svg>
                {t('footer.googlePlay')}
              </a>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '10px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(166,200,220,0.08)', borderRadius: 10, color: 'rgba(232,241,245,0.25)', fontSize: 14, width: 'fit-content', cursor: 'not-allowed' }}>
                {t('footer.appStoreSoon')}
              </span>
              {/* Social icons */}
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                {[
                  { label: 'Instagram', href: '#', icon: '📸' },
                  { label: 'TikTok', href: '#', icon: '🎵' },
                  { label: 'X', href: '#', icon: '𝕏' },
                ].map(({ label, href, icon }) => (
                  <a key={label} href={href} title={label} style={{ fontSize: 18, color: 'rgba(232,241,245,0.35)', textDecoration: 'none', transition: 'color 200ms' }}>{icon}</a>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{ maxWidth: 1040, margin: '0 auto', paddingTop: 28, borderTop: '1px solid rgba(166,200,220,0.07)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
          <p style={{ fontSize: 13, color: 'rgba(232,241,245,0.35)', margin: 0 }}>{t('footer.copyright')}</p>
          <div><LangSwitcher /></div>
        </div>
      </footer>

      {/* ══ STICKY BAR ══ */}
      {stickyVisible && (
        <div className="sticky-mobile-cta" style={{
          position: 'fixed', bottom: 0, left: 0, right: 0,
          background: 'rgba(31,45,58,0.92)', backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(166,200,220,0.12)',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 20px', paddingBottom: 'env(safe-area-inset-bottom, 0px)',
          minHeight: 60, zIndex: 200,
        }}>
          <span style={{ fontSize: 13, color: 'rgba(232,241,245,0.6)' }}>{t('stickyBar.downloadText')}</span>
          <a href={PLAY_STORE_URL} target="_blank" rel="noopener" style={{ background: '#a6c8dc', color: '#1f2d3a', border: 'none', borderRadius: 999, padding: '10px 20px', fontWeight: 700, fontSize: 14, textDecoration: 'none' }}>
            {t('nav.download')}
          </a>
        </div>
      )}

      {/* ══ EXIT-INTENT MODAL (iOS notify) ══ */}
      {exitModalOpen && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', zIndex: 300, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
          onClick={() => setExitModalOpen(false)}>
          <div onClick={e => e.stopPropagation()} style={{ background: '#2c3e50', borderRadius: 24, padding: '40px 36px', maxWidth: 440, width: '90%', position: 'relative', border: '1px solid rgba(166,200,220,0.15)' }}>
            <button onClick={() => setExitModalOpen(false)} style={{ position: 'absolute', top: 16, right: 16, background: 'none', border: 'none', color: '#5a6f7d', fontSize: 20, cursor: 'pointer' }}>✕</button>
            <h3 style={{ fontSize: 24, fontWeight: 600, color: '#e8f1f5', margin: '0 0 8px' }}>{t('exitModal.iosTitle')}</h3>
            <p style={{ fontSize: 15, color: 'rgba(232,241,245,0.65)', margin: '0 0 24px' }}>{t('exitModal.iosSubtitle')}</p>
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

        /* nav link hover */
        nav a:hover { opacity: 1; color: #e8f1f5 !important; }

        /* 5.3 sticky bar hidden on desktop */
        .sticky-mobile-cta { display: flex; }
        @media (min-width: 768px) { .sticky-mobile-cta { display: none !important; } }

        /* comparativa scroll on mobile */
        .comparativa-wrap { overflow-x: auto; -webkit-overflow-scrolling: touch; }

        /* hero mockup hidden on mobile */
        @media (max-width: 768px) {
          .hero-mockup { display: none !important; }
          .hero-section { grid-template-columns: 1fr !important; min-height: unset !important; padding: 100px 24px 60px !important; }
        }

        /* hero title fluid font */
        .hero-title {
          font-size: clamp(28px, 9.5vw, 72px) !important;
          line-height: 1.1 !important;
          letter-spacing: clamp(-1px, -0.03em, -2.5px) !important;
          word-break: normal; overflow-wrap: normal;
        }

        /* tradition cards */
        .tradition-card {
          transition: transform 200ms cubic-bezier(0.23,1,0.32,1), box-shadow 200ms;
          cursor: default;
        }
        .tradition-card:hover {
          transform: scale(1.02);
          box-shadow: 0 20px 40px rgba(0,0,0,0.4);
        }

        /* FAQ accordion */
        .faq-item { border-bottom: 1px solid rgba(166,200,220,0.1); }
        .faq-question {
          cursor: pointer; padding: 20px 0;
          display: flex; justify-content: space-between; align-items: center;
          font-size: 16px; font-weight: 500; color: #e8f1f5;
          background: none; border: none; width: 100%; text-align: left;
          transition: color 200ms;
        }
        .faq-question:hover { color: #a6c8dc; }
        .faq-answer {
          padding: 0 0 20px; font-size: 15px; line-height: 1.7;
          color: rgba(232,241,245,0.65);
        }

        /* roadmap grid responsive */
        .roadmap-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 24px; }
        @media (max-width: 900px) { .roadmap-grid { grid-template-columns: 1fr; } }

        /* traditions grid responsive */
        .traditions-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 20px; }
        @media (max-width: 1100px) { .traditions-grid { grid-template-columns: repeat(3,1fr); } }
        @media (max-width: 700px) { .traditions-grid { grid-template-columns: 1fr; } }

        /* founder grid responsive */
        .founder-grid { display: grid; grid-template-columns: 200px 1fr; gap: 48px; align-items: start; }
        @media (max-width: 700px) { .founder-grid { grid-template-columns: 1fr; } .founder-avatar { margin: 0 auto; } }

        /* play store btn */
        .btn-play {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 28px; background: #a6c8dc; color: #1f2d3a;
          border: none; border-radius: 14px; font-size: 15px; font-weight: 700;
          text-decoration: none; cursor: pointer;
          transition: transform 150ms ease-out, opacity 150ms ease-out;
        }
        .btn-play:hover { transform: scale(1.02); }
        .btn-play:active { transform: scale(0.97); }

        .btn-appstore-disabled {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 14px 28px; background: rgba(255,255,255,0.04);
          color: rgba(232,241,245,0.35);
          border: 1px solid rgba(166,200,220,0.15); border-radius: 14px;
          font-size: 15px; font-weight: 500; cursor: not-allowed;
        }

        /* section responsive padding */
        @media (max-width: 900px) {
          .traditions-section { padding: 80px 24px !important; }
          .roadmap-section { padding: 80px 24px !important; }
          .founder-section { padding: 80px 24px !important; }
          .faq-section { padding: 80px 24px !important; }
        }
        @media (max-width: 600px) {
          .traditions-section { padding: 64px 20px !important; }
          .roadmap-section { padding: 64px 20px !important; }
        }

        /* fade-up / in-view animations */
        .fade-up { opacity: 0; transform: translateY(24px); transition: opacity 600ms cubic-bezier(0.23,1,0.32,1), transform 600ms cubic-bezier(0.23,1,0.32,1); }
        .fade-up.in-view { opacity: 1; transform: translateY(0); }
        .stagger-1 { transition-delay: 0ms; }
        .stagger-2 { transition-delay: 100ms; }
        .stagger-3 { transition-delay: 200ms; }

        /* responsive global */
        @media (max-width: 900px) {
          section[style*="grid-template-columns: 1fr 1fr"] { grid-template-columns: 1fr !important; padding: 80px 24px !important; }
          nav { padding: 16px 24px !important; }
          h2[style*="font-size: 44px"] { font-size: 32px !important; }
          h2[style*="font-size: 56px"] { font-size: 38px !important; }
          nav > div:last-child a:not(:last-child) { display: none !important; }
          footer { padding: 48px 24px 24px !important; }
          footer > div:first-child { grid-template-columns: repeat(2,1fr) !important; }
        }
        @media (max-width: 600px) {
          footer > div:first-child { grid-template-columns: 1fr !important; }
          section { padding: 64px 20px !important; max-width: 100vw !important; box-sizing: border-box !important; }
          nav { padding: 14px 20px !important; }
          h2[style*="font-size: 44px"] { font-size: 28px !important; }
          p[style*="font-size: 17px"] { font-size: 15px !important; }
          .comparativa-wrap { max-width: calc(100vw - 40px) !important; }
          .lang-switcher-wrap { min-height: 44px; display: flex; align-items: center; }
        }

        /* reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .hero-sphere, .orb-blue, .orb-green, .ring-big, .ring-small { animation: none !important; }
          .hero-line { opacity: 1 !important; transform: none !important; animation: none !important; }
          .tradition-card:hover { transform: none !important; }
          .fade-up { opacity: 1 !important; transform: none !important; transition: none !important; }
        }

        @keyframes rotate { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
        @keyframes heroFloat {
          0%, 100% { transform: translate(-50%,-50%) translateY(0px); }
          50% { transform: translate(-50%,-50%) translateY(-20px); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-12px); }
        }
        @keyframes heroLineIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </main>
  )
}
