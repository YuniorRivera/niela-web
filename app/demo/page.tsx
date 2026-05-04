'use client'

import { useState, useRef, useEffect } from 'react'

const API = process.env.NEXT_PUBLIC_API_URL || 'https://medita-app-production.up.railway.app'

const TRADITIONS = [
  { id: 'zen',      label: 'Zen',      bg: 'rgba(212,184,150,0.35)', color: '#5a4530' },
  { id: 'tibetana', label: 'Tibetana', bg: 'rgba(184,201,168,0.4)',  color: '#2d3d24' },
  { id: 'andina',   label: 'Andina',   bg: 'rgba(232,185,150,0.35)', color: '#6b3f1c' },
  { id: 'sufi',     label: 'Sufí',     bg: 'rgba(180,170,200,0.35)', color: '#3d2a52' },
  { id: 'cristiana',label: 'Cristiana',bg: 'rgba(206,196,178,0.4)',  color: '#4a3a26' },
  { id: 'islamica', label: 'Islámica', bg: 'rgba(166,200,220,0.45)', color: '#1f3a4d' },
  { id: 'laica',    label: 'Laica',    bg: 'rgba(180,180,180,0.3)',  color: '#2c3e50' },
]

type Step = 'problem' | 'tradition' | 'duration' | 'loading' | 'player' | 'error'

export default function DemoPage() {
  const [step, setStep] = useState<Step>('problem')
  const [problem, setProblem] = useState('')
  const [tradition, setTradition] = useState('laica')
  const [script, setScript] = useState('')
  const [audioUrl, setAudioUrl] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [loadingMsg, setLoadingMsg] = useState('')
  const [playing, setPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const [duration, setDuration] = useState(0)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    const onTime = () => setProgress(audio.currentTime)
    const onDur  = () => setDuration(audio.duration)
    const onEnd  = () => setPlaying(false)
    audio.addEventListener('timeupdate', onTime)
    audio.addEventListener('loadedmetadata', onDur)
    audio.addEventListener('ended', onEnd)
    return () => {
      audio.removeEventListener('timeupdate', onTime)
      audio.removeEventListener('loadedmetadata', onDur)
      audio.removeEventListener('ended', onEnd)
    }
  }, [audioUrl])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) { audio.pause(); setPlaying(false) }
    else { audio.play(); setPlaying(true) }
  }

  const fmt = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = Math.floor(s % 60)
    return `${m}:${sec.toString().padStart(2, '0')}`
  }

  const generate = async () => {
    setStep('loading')
    setLoadingMsg('Escribiendo tu meditación...')
    try {
      const r1 = await fetch(`${API}/api/demo/meditation`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ problem, tradition, tone: 'tranquilo' }),
      })
      if (r1.status === 429) {
        setErrorMsg('Ya usaste tu demo hoy. Vuelve mañana o únete a la lista de espera para acceso completo.')
        setStep('error')
        return
      }
      if (!r1.ok) throw new Error('generation_failed')
      const data = await r1.json()
      if (data.crisis) {
        setErrorMsg(data.message || 'Detectamos que podrías estar pasando por un momento difícil. Por favor contacta a un profesional de salud mental.')
        setStep('error')
        return
      }
      setScript(data.script)

      setLoadingMsg('Generando el audio...')
      // Truncar a 1500 chars para TTS demo
      const ttsText = data.script.slice(0, 1500)
      const r2 = await fetch(`${API}/api/demo/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text: ttsText }),
      })
      if (r2.status === 429) {
        // Script disponible aunque TTS haya llegado al límite
        setAudioUrl('')
        setStep('player')
        return
      }
      if (!r2.ok) throw new Error('tts_failed')

      const blob = await r2.blob()
      setAudioUrl(URL.createObjectURL(blob))
      setStep('player')
    } catch {
      setErrorMsg('No pudimos conectar con el servidor. Intenta de nuevo.')
      setStep('error')
    }
  }

  const tradObj = TRADITIONS.find(t => t.id === tradition) || TRADITIONS[6]

  return (
    <div style={{ minHeight: '100vh', background: 'linear-gradient(180deg, #e8f1f5 0%, #f0ebe0 100%)', fontFamily: 'system-ui, sans-serif' }}>
      {/* Nav */}
      <nav style={{ padding: '20px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #a6c8dc, #b8c9a8, #d4b896)', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 10, height: 10, borderRadius: '50%', background: '#f5f1ea' }} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 500, color: '#2c3e50' }}>niela</span>
        </a>
        <span style={{ fontSize: 12, color: '#5a6f7d', background: 'rgba(166,200,220,0.3)', padding: '4px 12px', borderRadius: 999 }}>Demo gratuita · 5 min</span>
      </nav>

      <div style={{ maxWidth: 560, margin: '0 auto', padding: '40px 24px 80px' }}>

        {/* PASO 1 — Problema */}
        {step === 'problem' && (
          <div>
            <p style={{ fontSize: 12, color: '#4a6b80', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 12px' }}>Paso 1 de 3</p>
            <h1 style={{ fontSize: 28, fontWeight: 500, color: '#1f2d3a', margin: '0 0 8px', letterSpacing: '-0.5px' }}>¿Qué necesitas trabajar hoy?</h1>
            <p style={{ fontSize: 14, color: '#5a6f7d', margin: '0 0 28px' }}>Descríbelo con tus palabras. Puede ser algo pequeño o algo que llevas tiempo cargando.</p>
            <textarea
              value={problem}
              onChange={e => setProblem(e.target.value)}
              placeholder="Ej: Siento ansiedad antes de dormir y no puedo apagar la mente..."
              rows={4}
              style={{ width: '100%', padding: '14px 16px', borderRadius: 16, border: '1px solid rgba(44,62,80,0.2)', background: 'rgba(255,255,255,0.7)', fontSize: 14, color: '#1f2d3a', resize: 'none', outline: 'none', boxSizing: 'border-box', lineHeight: 1.6 }}
            />
            <button
              onClick={() => setStep('tradition')}
              disabled={problem.trim().length < 5}
              style={{ marginTop: 16, width: '100%', padding: '14px', borderRadius: 999, border: 'none', background: problem.trim().length >= 5 ? '#2c3e50' : 'rgba(44,62,80,0.2)', color: problem.trim().length >= 5 ? '#f0ebe0' : '#5a6f7d', fontSize: 15, fontWeight: 500, cursor: problem.trim().length >= 5 ? 'pointer' : 'default', transition: 'all 0.2s' }}
            >
              Continuar →
            </button>
          </div>
        )}

        {/* PASO 2 — Tradición */}
        {step === 'tradition' && (
          <div>
            <p style={{ fontSize: 12, color: '#4a6b80', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 12px' }}>Paso 2 de 3</p>
            <h1 style={{ fontSize: 28, fontWeight: 500, color: '#1f2d3a', margin: '0 0 8px', letterSpacing: '-0.5px' }}>¿Desde qué tradición?</h1>
            <p style={{ fontSize: 14, color: '#5a6f7d', margin: '0 0 28px' }}>Niela respeta cada camino. Elige el que resuene contigo hoy.</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
              {TRADITIONS.map(t => (
                <button
                  key={t.id}
                  onClick={() => setTradition(t.id)}
                  style={{ padding: '10px 20px', borderRadius: 999, border: tradition === t.id ? `2px solid ${t.color}` : '2px solid transparent', background: tradition === t.id ? t.bg : 'rgba(255,255,255,0.5)', color: t.color, fontSize: 14, fontWeight: tradition === t.id ? 600 : 400, cursor: 'pointer', transition: 'all 0.15s' }}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
              <button onClick={() => setStep('problem')} style={{ flex: 1, padding: '13px', borderRadius: 999, border: '1px solid rgba(44,62,80,0.2)', background: 'transparent', color: '#5a6f7d', fontSize: 14, cursor: 'pointer' }}>← Atrás</button>
              <button onClick={() => setStep('duration')} style={{ flex: 2, padding: '13px', borderRadius: 999, border: 'none', background: '#2c3e50', color: '#f0ebe0', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Continuar →</button>
            </div>
          </div>
        )}

        {/* PASO 3 — Duración (fija en demo) */}
        {step === 'duration' && (
          <div>
            <p style={{ fontSize: 12, color: '#4a6b80', textTransform: 'uppercase', letterSpacing: '2px', margin: '0 0 12px' }}>Paso 3 de 3</p>
            <h1 style={{ fontSize: 28, fontWeight: 500, color: '#1f2d3a', margin: '0 0 8px', letterSpacing: '-0.5px' }}>Duración de la sesión</h1>
            <p style={{ fontSize: 14, color: '#5a6f7d', margin: '0 0 28px' }}>La demo incluye una sesión de 5 minutos. La app completa ofrece 10, 20 y 30 min.</p>
            <div style={{ padding: '20px 24px', borderRadius: 20, background: '#a6c8dc', border: '2px solid rgba(31,58,77,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ margin: 0, fontSize: 20, fontWeight: 600, color: '#1f3a4d' }}>5 minutos</p>
                <p style={{ margin: '4px 0 0', fontSize: 13, color: 'rgba(31,58,77,0.7)' }}>Tradición {tradObj.label} · Tono tranquilo</p>
              </div>
              <span style={{ fontSize: 24 }}>✓</span>
            </div>
            <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 12, background: 'rgba(166,200,220,0.2)', fontSize: 12, color: '#4a6b80' }}>
              En la app completa también puedes elegir 10, 20 o 30 minutos y combinar hasta 3 tradiciones.
            </div>
            <div style={{ display: 'flex', gap: 10, marginTop: 24 }}>
              <button onClick={() => setStep('tradition')} style={{ flex: 1, padding: '13px', borderRadius: 999, border: '1px solid rgba(44,62,80,0.2)', background: 'transparent', color: '#5a6f7d', fontSize: 14, cursor: 'pointer' }}>← Atrás</button>
              <button onClick={generate} style={{ flex: 2, padding: '13px', borderRadius: 999, border: 'none', background: '#2c3e50', color: '#f0ebe0', fontSize: 15, fontWeight: 500, cursor: 'pointer' }}>Generar mi meditación ✦</button>
            </div>
          </div>
        )}

        {/* LOADING */}
        {step === 'loading' && (
          <div style={{ textAlign: 'center', paddingTop: 60 }}>
            <div style={{ width: 64, height: 64, borderRadius: '50%', background: 'radial-gradient(circle at 30% 30%, #d4b896, #a6c8dc, #b8c9a8)', margin: '0 auto 24px', animation: 'pulse 2s ease-in-out infinite' }} />
            <h2 style={{ fontSize: 22, fontWeight: 500, color: '#1f2d3a', margin: '0 0 8px' }}>{loadingMsg}</h2>
            <p style={{ fontSize: 14, color: '#5a6f7d' }}>Esto toma entre 10 y 20 segundos.</p>
            <style>{`@keyframes pulse { 0%,100%{transform:scale(1);opacity:1} 50%{transform:scale(1.1);opacity:0.8} }`}</style>
          </div>
        )}

        {/* PLAYER */}
        {step === 'player' && (
          <div>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ width: 72, height: 72, borderRadius: '50%', background: `radial-gradient(circle at 30% 30%, ${tradObj.bg}, #a6c8dc)`, margin: '0 auto 16px', border: `2px solid ${tradObj.color}30` }} />
              <h1 style={{ fontSize: 24, fontWeight: 500, color: '#1f2d3a', margin: '0 0 4px' }}>Tu meditación está lista</h1>
              <p style={{ fontSize: 13, color: '#5a6f7d' }}>Tradición {tradObj.label} · 5 minutos</p>
            </div>

            {/* Audio player */}
            {audioUrl ? (
              <div style={{ background: 'linear-gradient(135deg, #2c3e50, #4a6b80)', borderRadius: 24, padding: '28px 24px', marginBottom: 20 }}>
                <audio ref={audioRef} src={audioUrl} preload="auto" />
                <p style={{ fontSize: 12, color: 'rgba(232,241,245,0.6)', margin: '0 0 16px', textAlign: 'center' }}>{fmt(progress)} / {fmt(duration || 0)}</p>
                <div
                  style={{ height: 4, background: 'rgba(232,241,245,0.2)', borderRadius: 999, marginBottom: 20, cursor: 'pointer', position: 'relative' }}
                  onClick={e => {
                    const rect = (e.target as HTMLDivElement).getBoundingClientRect()
                    const ratio = (e.clientX - rect.left) / rect.width
                    if (audioRef.current) audioRef.current.currentTime = ratio * (audioRef.current.duration || 0)
                  }}
                >
                  <div style={{ height: '100%', width: duration ? `${(progress / duration) * 100}%` : '0%', background: '#a6c8dc', borderRadius: 999, transition: 'width 0.5s linear' }} />
                </div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <button
                    onClick={togglePlay}
                    style={{ width: 56, height: 56, borderRadius: '50%', background: '#e8f1f5', border: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                  >
                    {playing
                      ? <svg width="18" height="18" viewBox="0 0 24 24" fill="#2c3e50"><rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/></svg>
                      : <svg width="18" height="18" viewBox="0 0 24 24" fill="#2c3e50"><polygon points="6 4 20 12 6 20 6 4"/></svg>
                    }
                  </button>
                </div>
              </div>
            ) : (
              <div style={{ background: 'rgba(166,200,220,0.2)', borderRadius: 16, padding: '16px 20px', marginBottom: 20, fontSize: 13, color: '#4a6b80', textAlign: 'center' }}>
                Audio no disponible en este momento. Puedes leer el guion abajo.
              </div>
            )}

            {/* Script preview */}
            <details style={{ marginBottom: 24 }}>
              <summary style={{ fontSize: 13, color: '#4a6b80', cursor: 'pointer', padding: '8px 0' }}>Ver guion escrito</summary>
              <div style={{ marginTop: 12, padding: '16px', background: 'rgba(255,255,255,0.6)', borderRadius: 16, fontSize: 13, color: '#3d4f5e', lineHeight: 1.7, whiteSpace: 'pre-wrap', maxHeight: 300, overflowY: 'auto' }}>
                {script}
              </div>
            </details>

            {/* CTA */}
            <div style={{ background: 'linear-gradient(135deg, #1f2d3a, #2c4a5e)', borderRadius: 24, padding: '28px 24px', textAlign: 'center' }}>
              <h2 style={{ fontSize: 20, fontWeight: 500, color: '#e8f1f5', margin: '0 0 8px' }}>¿Te gustó? Descargá la app</h2>
              <p style={{ fontSize: 13, color: 'rgba(232,241,245,0.65)', margin: '0 0 20px', lineHeight: 1.5 }}>Sesiones de 5, 10, 20 y 30 min. Diario personal. Las 7 tradiciones. Sin límites.</p>
              <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button style={{ padding: '11px 20px', borderRadius: 999, background: 'rgba(232,241,245,0.12)', border: '1px solid rgba(232,241,245,0.25)', color: '#e8f1f5', fontSize: 13, cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/></svg>
                  App Store (próximamente)
                </button>
                <button style={{ padding: '11px 20px', borderRadius: 999, background: 'rgba(232,241,245,0.12)', border: '1px solid rgba(232,241,245,0.25)', color: '#e8f1f5', fontSize: 13, cursor: 'not-allowed', display: 'flex', alignItems: 'center', gap: 6 }}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M3.18 23.76c.3.17.65.19.96.07l12.45-7.2-2.78-2.78-10.63 9.91zM.5 1.4C.19 1.72 0 2.2 0 2.82v18.36c0 .62.19 1.1.51 1.42l.08.07 10.28-10.28v-.24L.58 1.33.5 1.4zM19.37 10.06l-2.9-1.68-3.07 3.07 3.07 3.07 2.91-1.68c.83-.48.83-1.27-.01-1.78zM4.14.24L16.59 7.44 13.81 10.22 3.18.31c.31-.13.67-.1.96.07v-.14z"/></svg>
                  Google Play (próximamente)
                </button>
              </div>
              <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(232,241,245,0.1)' }}>
                <a href="/#waitlist" style={{ fontSize: 13, color: '#a6c8dc', textDecoration: 'none' }}>← Unirme a la lista de espera</a>
              </div>
            </div>
          </div>
        )}

        {/* ERROR */}
        {step === 'error' && (
          <div style={{ textAlign: 'center', paddingTop: 40 }}>
            <div style={{ fontSize: 40, marginBottom: 16 }}>🌿</div>
            <h2 style={{ fontSize: 22, fontWeight: 500, color: '#1f2d3a', margin: '0 0 12px' }}>Un momento</h2>
            <p style={{ fontSize: 15, color: '#5a6f7d', margin: '0 0 28px', lineHeight: 1.6 }}>{errorMsg}</p>
            <a href="/#waitlist" style={{ display: 'inline-block', padding: '13px 28px', borderRadius: 999, background: '#2c3e50', color: '#f0ebe0', textDecoration: 'none', fontSize: 14, fontWeight: 500 }}>Unirme a la lista</a>
            <br />
            <button onClick={() => { setStep('problem'); setErrorMsg('') }} style={{ marginTop: 12, background: 'none', border: 'none', color: '#4a6b80', fontSize: 13, cursor: 'pointer', textDecoration: 'underline' }}>Intentar de nuevo</button>
          </div>
        )}
      </div>
    </div>
  )
}
