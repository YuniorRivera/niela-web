export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ background: '#f0ebe0', minHeight: '100vh' }}>
      <nav style={{ padding: '20px 40px', borderBottom: '1px solid rgba(44,62,80,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <a href="/" style={{ display: 'flex', alignItems: 'center', gap: 10, textDecoration: 'none' }}>
          <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #a6c8dc 0%, #b8c9a8 60%, #d4b896 100%)', position: 'relative', flexShrink: 0 }}>
            <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 10, height: 10, borderRadius: '50%', background: '#f5f1ea' }} />
          </div>
          <span style={{ fontSize: 16, fontWeight: 500, color: '#2c3e50', letterSpacing: '0.5px' }}>niela</span>
        </a>
        <div style={{ display: 'flex', gap: 20, fontSize: 13, color: '#5a6f7d' }}>
          <a href="/legal/terminos" style={{ color: '#5a6f7d', textDecoration: 'none' }}>Términos</a>
          <a href="/legal/privacidad" style={{ color: '#5a6f7d', textDecoration: 'none' }}>Privacidad</a>
          <a href="/legal/cookies" style={{ color: '#5a6f7d', textDecoration: 'none' }}>Cookies</a>
        </div>
      </nav>
      <main style={{ maxWidth: 780, margin: '0 auto', padding: '56px 40px 80px' }}>
        {children}
      </main>
      <footer style={{ padding: '24px 40px', borderTop: '1px solid rgba(44,62,80,0.1)', textAlign: 'center', fontSize: 13, color: '#5a6f7d' }}>
        <a href="/" style={{ color: '#2c3e50', textDecoration: 'none', fontWeight: 500 }}>← Volver a niela.app</a>
      </footer>
    </div>
  )
}
