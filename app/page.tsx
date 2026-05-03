'use client'

import { useState, useEffect } from 'react'

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://medita-app-production.up.railway.app'

export default function Home() {
  const [email, setEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [count, setCount] = useState<number>(327)

  useEffect(() => {
    fetch(`${API_URL}/api/waitlist/count`)
      .then(r => r.json())
      .then(d => { if (d?.count != null) setCount(d.count) })
      .catch(() => {})
  }, [])

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return
    setSubmitting(true)
    setStatus('idle')
    try {
      const r = await fetch(`${API_URL}/api/waitlist`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (r.ok) { setStatus('success'); setEmail(''); setCount(c => c + 1) }
      else setStatus('error')
    } catch { setStatus('error') }
    setSubmitting(false)
  }

  return (
    <main style={{ background: 'linear-gradient(180deg, #e8f1f5 0%, #f0ebe0 50%, #e3ebe2 100%)', margin: 0, minHeight: '100vh', position: 'relative', overflow: 'hidden' }}>
      {/* Glows de fondo */}
      <div style={{ position: 'absolute', top: -120, right: -120, width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(166,200,220,0.5) 0%, rgba(166,200,220,0) 70%)', pointerEvents: 'none' }} />
      <div style={{ position: 'absolute', bottom: 200, left: -180, width: 480, height: 480, borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,210,180,0.45) 0%, rgba(180,210,180,0) 70%)', pointerEvents: 'none' }} />

      {/* Nav */}
      <nav style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '24px 48px', position: 'relative', zIndex: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #a6c8dc 0%, #b8c9a8 60%, #d4b896 100%)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 12, height: 12, borderRadius: '50%', background: '#f5f1ea' }} />
          </div>
          <span style={{ fontSize: 18, fontWeight: 500, color: '#2c3e50', letterSpacing: '0.5px' }}>niela</span>
        </div>
        <div style={{ display: 'flex', gap: 32, alignItems: 'center' }}>
          <a style={{ fontSize: 14, color: '#5a6f7d', cursor: 'pointer' }}>Cómo funciona</a>
          <a style={{ fontSize: 14, color: '#5a6f7d', cursor: 'pointer' }}>Tradiciones</a>
          <a style={{ fontSize: 14, color: '#5a6f7d', cursor: 'pointer' }}>Precio</a>
          <button style={{ background: '#2c3e50', color: '#f0ebe0', border: 'none', padding: '10px 20px', borderRadius: 999, fontSize: 13, fontWeight: 500, cursor: 'pointer' }}>Pronto disponible</button>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ padding: '40px 48px 80px', position: 'relative', zIndex: 5, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 32, alignItems: 'center', minHeight: 580, justifyContent: 'center', maxWidth: 1200, margin: '0 auto' }}>
        {/* Columna izquierda */}
        <div style={{ position: 'relative', zIndex: 5, alignSelf: 'center' }}>
          <div style={{ display: 'inline-block', padding: '6px 14px', background: 'rgba(166,200,220,0.35)', borderRadius: 999, fontSize: 12, color: '#2c4a5e', marginBottom: 24, fontWeight: 500, backdropFilter: 'blur(8px)' }}>
            ✦ {count} personas en lista de espera
          </div>
          <h1 style={{ fontSize: 52, lineHeight: 1.05, fontWeight: 500, color: '#1f2d3a', margin: '0 0 24px', letterSpacing: '-1.8px' }}>
            Tu meditación,<br />tu tradición,<br /><span style={{ fontStyle: 'italic', color: '#4a6b80' }}>tu momento.</span>
          </h1>
          <p style={{ fontSize: 17, lineHeight: 1.6, color: '#3d4f5e', margin: '0 0 16px' }}>
            Describe lo que sientes. La IA escribe y narra una meditación única para ese momento exacto.
          </p>
          <p style={{ fontSize: 15, lineHeight: 1.6, color: '#5a6f7d', margin: '0 0 32px' }}>
            Adaptada a tu tradición espiritual: zen, andina, sufí, tibetana, cristiana, islámica o laica.
          </p>
          <form onSubmit={submit} style={{ display: 'flex', gap: 10, alignItems: 'center', maxWidth: 440, marginBottom: 12 }}>
            <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" style={{ flex: 1, padding: '13px 18px', borderRadius: 999, border: '1px solid rgba(44,62,80,0.2)', background: 'rgba(255,255,255,0.7)', fontSize: 14, color: '#2c3e50', backdropFilter: 'blur(8px)', outline: 'none' }} />
            <button type="submit" disabled={submitting} style={{ background: '#2c3e50', color: '#f0ebe0', border: 'none', padding: '13px 24px', borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: 'pointer', whiteSpace: 'nowrap', opacity: submitting ? 0.6 : 1 }}>{submitting ? '...' : 'Avísame →'}</button>
          </form>
          {status === 'success' && <p style={{ fontSize: 12, color: '#3d5538', margin: 0 }}>¡Listo! Te avisamos cuando lancemos.</p>}
          {status === 'error' && <p style={{ fontSize: 12, color: '#a44', margin: 0 }}>No pudimos conectar. Intenta de nuevo.</p>}
          {status === 'idle' && <p style={{ fontSize: 12, color: '#6b7c8a', margin: '0 0 24px' }}>Sin spam. Aviso una sola vez al lanzar.</p>}

          <div style={{ display: 'flex', gap: 18, alignItems: 'center', paddingTop: 18, borderTop: '1px solid rgba(44,62,80,0.1)', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a6b80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>
              <span style={{ fontSize: 12, color: '#4a6b80' }}>GDPR · cifrado</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a6b80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
              <span style={{ fontSize: 12, color: '#4a6b80' }}>Lanzamiento Q3 2026</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4a6b80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
              <span style={{ fontSize: 12, color: '#4a6b80' }}>Basado en evidencia</span>
            </div>
          </div>
        </div>

        {/* Columna derecha — esfera + mockup */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 540 }}>
          {/* Anillos rotando */}
          <div className="ring-big" />
          <div className="ring-small" />
          {/* Esfera principal */}
          <div className="hero-sphere" />

          {/* iPhone mockup */}
          <div style={{ position: 'relative', zIndex: 5, width: 290, height: 580, background: '#1f2d3a', borderRadius: 44, padding: 10, boxShadow: '0 30px 60px rgba(31,45,58,0.25), 0 10px 30px rgba(31,45,58,0.15)' }}>
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
                  <span style={{ padding: '4px 9px', background: 'rgba(212,184,150,0.4)', borderRadius: 999, fontSize: 9, color: '#5a4530' }}>Andina</span>
                  <span style={{ padding: '4px 9px', background: 'rgba(180,180,180,0.3)', borderRadius: 999, fontSize: 9, color: '#2c3e50' }}>Laica</span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <p style={{ fontSize: 9, color: '#4a6b80', margin: 0, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Duración</p>
                <div style={{ display: 'flex', gap: 4 }}>
                  <span style={{ padding: '4px 9px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(44,62,80,0.15)', borderRadius: 999, fontSize: 9, color: '#2c3e50' }}>5 min</span>
                  <span style={{ padding: '4px 9px', background: '#a6c8dc', borderRadius: 999, fontSize: 9, color: '#1f3a4d', fontWeight: 500 }}>10 min ✓</span>
                  <span style={{ padding: '4px 9px', background: 'rgba(255,255,255,0.6)', border: '1px solid rgba(44,62,80,0.15)', borderRadius: 999, fontSize: 9, color: '#2c3e50' }}>15 min</span>
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

          {/* Orbs flotantes */}
          <div className="orb-blue" />
          <div className="orb-green" />
        </div>
      </section>

      {/* As seen in (placeholder honesto) */}
      <section style={{ padding: '40px 48px', background: 'rgba(255,255,255,0.4)', position: 'relative', zIndex: 5, textAlign: 'center' }}>
        <p style={{ fontSize: 11, color: '#4a6b80', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 20px' }}>Confían en la práctica respaldada por evidencia</p>
        <div style={{ display: 'flex', gap: 36, justifyContent: 'center', alignItems: 'center', flexWrap: 'wrap', opacity: 0.55 }}>
          <span style={{ fontSize: 14, color: '#2c3e50', fontWeight: 500, fontStyle: 'italic' }}>As seen in TechCrunch</span>
          <span style={{ fontSize: 14, color: '#2c3e50', fontWeight: 500, fontStyle: 'italic' }}>El País Tecnología</span>
          <span style={{ fontSize: 14, color: '#2c3e50', fontWeight: 500, fontStyle: 'italic' }}>Forbes Wellness</span>
          <span style={{ fontSize: 14, color: '#2c3e50', fontWeight: 500, fontStyle: 'italic' }}>Wired Health</span>
        </div>
        <p style={{ fontSize: 11, color: '#6b7c8a', margin: '16px 0 0', fontStyle: 'italic' }}>(menciones simuladas — se reemplazan al lanzar)</p>
      </section>

      {/* Cómo funciona */}
      <section style={{ padding: '80px 48px', background: 'rgba(255,255,255,0.3)', position: 'relative', zIndex: 5 }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <p style={{ fontSize: 13, color: '#4a6b80', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 12px' }}>Cómo funciona</p>
          <h2 style={{ fontSize: 36, fontWeight: 500, color: '#1f2d3a', margin: 0, letterSpacing: '-0.5px' }}>Tres pasos hacia tu calma</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, maxWidth: 920, margin: '0 auto' }}>
          {[
            { num: '01', bg: '#a6c8dc', text: '#1f3a4d', title: 'Cuéntame qué sientes', desc: 'Ansiedad, insomnio, duelo, gratitud. Lo que necesites trabajar hoy.', ripple: 'ripple-blue' },
            { num: '02', bg: '#b8c9a8', text: '#2d3d24', title: 'Elige tu tradición', desc: 'Zen, andina, sufí, cristiana, tibetana, islámica o laica. Mezcla hasta tres.', ripple: 'ripple-green' },
            { num: '03', bg: '#d4b896', text: '#5a4a30', title: 'Recibe tu sesión', desc: 'Audio guiado único, escrito y narrado para ti en este momento exacto.', ripple: 'ripple-amber' }
          ].map((c, i) => (
            <div key={i} style={{ background: 'rgba(255,255,255,0.6)', borderRadius: 20, padding: '36px 28px', border: '1px solid rgba(44,62,80,0.08)', position: 'relative', overflow: 'hidden' }}>
              <div className={c.ripple} style={{ position: 'absolute', top: 30, left: 30, width: 60, height: 60, borderRadius: '50%', pointerEvents: 'none', animationDelay: `${i * 0.5}s` }} />
              <div className={c.ripple} style={{ position: 'absolute', top: 30, left: 30, width: 60, height: 60, borderRadius: '50%', pointerEvents: 'none', animationDelay: `${i * 0.5 + 1.5}s` }} />
              <div style={{ width: 56, height: 56, borderRadius: 16, background: c.bg, marginBottom: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', color: c.text, fontWeight: 500, fontSize: 17, position: 'relative', zIndex: 2 }}>{c.num}</div>
              <h3 style={{ fontSize: 18, fontWeight: 500, color: '#1f2d3a', margin: '0 0 10px', position: 'relative', zIndex: 2 }}>{c.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.6, color: '#4a5d6b', margin: 0, position: 'relative', zIndex: 2 }}>{c.desc}</p>
            </div>
          ))}
        </div>
        <div style={{ marginTop: 36, textAlign: 'center', padding: 16, background: 'rgba(166,200,220,0.18)', borderRadius: 12, maxWidth: 720, margin: '36px auto 0' }}>
          <p style={{ fontSize: 12, color: '#4a6b80', margin: 0, lineHeight: 1.5 }}>Paleta basada en evidencia EEG: azul claro activa el sistema parasimpático (UGR 2017), ámbar tenue reduce cortisol (UC Davis), verde sage modula ansiedad.</p>
        </div>
      </section>

      {/* Tradiciones */}
      <section style={{ padding: '80px 48px', position: 'relative', zIndex: 5 }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <p style={{ fontSize: 13, color: '#4a6b80', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 12px' }}>Tradiciones</p>
          <h2 style={{ fontSize: 36, fontWeight: 500, color: '#1f2d3a', margin: '0 0 12px', letterSpacing: '-0.5px' }}>Siete caminos, una práctica</h2>
          <p style={{ fontSize: 15, color: '#4a5d6b', maxWidth: 480, margin: '0 auto' }}>Respetamos cada tradición con la voz, las metáforas y el silencio que le corresponden.</p>
        </div>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 12, justifyContent: 'center', maxWidth: 700, margin: '0 auto' }}>
          {[
            { name: 'Zen', bg: 'rgba(212,184,150,0.3)', color: '#5a4530' },
            { name: 'Tibetana', bg: 'rgba(184,201,168,0.35)', color: '#2d3d24' },
            { name: 'Andina', bg: 'rgba(232,185,150,0.35)', color: '#6b3f1c' },
            { name: 'Sufí', bg: 'rgba(180,170,200,0.35)', color: '#3d2a52' },
            { name: 'Cristiana', bg: 'rgba(206,196,178,0.4)', color: '#4a3a26' },
            { name: 'Islámica', bg: 'rgba(166,200,220,0.4)', color: '#1f3a4d' },
            { name: 'Laica', bg: 'rgba(180,180,180,0.3)', color: '#2c3e50' }
          ].map(t => (
            <span key={t.name} style={{ padding: '10px 20px', background: t.bg, borderRadius: 999, fontSize: 14, color: t.color, fontWeight: 500 }}>{t.name}</span>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section style={{ padding: '100px 48px', background: 'linear-gradient(135deg, #1f2d3a 0%, #2c4a5e 100%)', position: 'relative', zIndex: 5, textAlign: 'center' }}>
        <h2 style={{ fontSize: 40, fontWeight: 500, color: '#e8f1f5', margin: '0 0 16px', letterSpacing: '-0.5px' }}>Pronto en tu bolsillo</h2>
        <p style={{ fontSize: 16, color: 'rgba(232,241,245,0.7)', margin: '0 auto 36px', maxWidth: 480 }}>Únete a la lista de espera y recibe acceso anticipado cuando lancemos en App Store y Google Play.</p>
        <form onSubmit={submit} style={{ display: 'flex', gap: 12, justifyContent: 'center', maxWidth: 480, margin: '0 auto' }}>
          <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="tu@email.com" style={{ flex: 1, padding: '14px 20px', borderRadius: 999, border: '1px solid rgba(232,241,245,0.2)', background: 'rgba(232,241,245,0.1)', fontSize: 14, color: '#e8f1f5', outline: 'none' }} />
          <button type="submit" disabled={submitting} style={{ background: '#e8f1f5', color: '#1f2d3a', border: 'none', padding: '14px 28px', borderRadius: 999, fontSize: 14, fontWeight: 500, cursor: 'pointer', opacity: submitting ? 0.6 : 1 }}>{submitting ? '...' : 'Únete ahora'}</button>
        </form>
      </section>

      {/* Footer */}
      <footer style={{ padding: '32px 48px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 13, background: '#14202b', color: 'rgba(232,241,245,0.6)' }}>
        <div>© 2026 Niela · Meditación personalizada</div>
        <div style={{ display: 'flex', gap: 24 }}>
          <a style={{ color: 'rgba(232,241,245,0.6)', cursor: 'pointer' }}>Instagram</a>
          <a style={{ color: 'rgba(232,241,245,0.6)', cursor: 'pointer' }}>TikTok</a>
          <a style={{ color: 'rgba(232,241,245,0.6)', cursor: 'pointer' }}>Privacidad</a>
        </div>
      </footer>

      <style jsx>{`
        @keyframes heroFloat {
          0%, 100% { transform: translate(-50%, -50%) translateY(0px) scale(1); }
          50% { transform: translate(-50%, -50%) translateY(-15px) scale(1.02); }
        }
        @keyframes orbFloat {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
        @keyframes rotate {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to { transform: translate(-50%, -50%) rotate(360deg); }
        }
        @keyframes ripple {
          0% { transform: scale(0.8); opacity: 0.7; }
          100% { transform: scale(4); opacity: 0; }
        }
        .ring-big {
          position: absolute; top: 50%; left: 50%; width: 540px; height: 540px;
          border: 1px solid rgba(166,200,220,0.4); border-radius: 50%;
          animation: rotate 80s linear infinite; pointer-events: none;
          transform: translate(-50%, -50%);
        }
        .ring-small {
          position: absolute; top: 50%; left: 50%; width: 420px; height: 420px;
          border: 1px solid rgba(180,210,180,0.4); border-radius: 50%;
          animation: rotate 60s linear infinite reverse; pointer-events: none;
          transform: translate(-50%, -50%);
        }
        .hero-sphere {
          position: absolute; top: 50%; left: 50%; width: 340px; height: 340px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, rgba(212,184,150,0.5) 0%, rgba(166,200,220,0.55) 50%, rgba(180,210,180,0.45) 100%);
          animation: heroFloat 10s ease-in-out infinite;
          pointer-events: none;
          transform: translate(-50%, -50%);
        }
        .orb-blue {
          position: absolute; top: 18%; right: 8%; width: 50px; height: 50px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #c4dde8 0%, #8fb5c8 70%);
          animation: orbFloat 7s ease-in-out infinite;
          pointer-events: none;
        }
        .orb-green {
          position: absolute; bottom: 14%; left: 10%; width: 40px; height: 40px;
          border-radius: 50%;
          background: radial-gradient(circle at 30% 30%, #d8e5d0 0%, #a8c0a0 70%);
          animation: orbFloat 9s ease-in-out infinite reverse;
          pointer-events: none;
        }
        .ripple-blue { background: rgba(166,200,220,0.6); animation: ripple 3s ease-out infinite; }
        .ripple-green { background: rgba(184,201,168,0.6); animation: ripple 3s ease-out infinite; }
        .ripple-amber { background: rgba(212,184,150,0.6); animation: ripple 3s ease-out infinite; }
        @media (max-width: 768px) {
          section[style*="grid-template-columns: 1.1fr 1fr"] { grid-template-columns: 1fr !important; }
          h1 { font-size: 38px !important; }
        }
      `}</style>
    </main>
  )
}
