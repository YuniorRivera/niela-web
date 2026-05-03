'use client'

import ReactMarkdown from 'react-markdown'

const prose: React.CSSProperties = {
  fontFamily: 'inherit',
  color: '#1f2d3a',
  lineHeight: 1.75,
  fontSize: 15,
}

export default function LegalContent({ content }: { content: string }) {
  return (
    <div style={prose}>
      <ReactMarkdown
        components={{
          h1: ({ children }) => (
            <h1 style={{ fontSize: 32, fontWeight: 500, color: '#2c3e50', marginBottom: 8, letterSpacing: '-0.5px' }}>{children}</h1>
          ),
          h2: ({ children }) => (
            <h2 style={{ fontSize: 20, fontWeight: 600, color: '#2c3e50', marginTop: 40, marginBottom: 12, paddingBottom: 6, borderBottom: '1px solid rgba(44,62,80,0.1)' }}>{children}</h2>
          ),
          h3: ({ children }) => (
            <h3 style={{ fontSize: 16, fontWeight: 600, color: '#2c3e50', marginTop: 24, marginBottom: 8 }}>{children}</h3>
          ),
          p: ({ children }) => (
            <p style={{ margin: '0 0 16px', color: '#3d4f5e', lineHeight: 1.75 }}>{children}</p>
          ),
          strong: ({ children }) => (
            <strong style={{ color: '#1f2d3a', fontWeight: 600 }}>{children}</strong>
          ),
          ul: ({ children }) => (
            <ul style={{ paddingLeft: 20, margin: '0 0 16px', color: '#3d4f5e' }}>{children}</ul>
          ),
          ol: ({ children }) => (
            <ol style={{ paddingLeft: 20, margin: '0 0 16px', color: '#3d4f5e' }}>{children}</ol>
          ),
          li: ({ children }) => (
            <li style={{ marginBottom: 6, lineHeight: 1.6 }}>{children}</li>
          ),
          a: ({ href, children }) => (
            <a href={href} style={{ color: '#4a6b80', textDecoration: 'underline' }} target="_blank" rel="noopener noreferrer">{children}</a>
          ),
          table: ({ children }) => (
            <div style={{ overflowX: 'auto', margin: '0 0 24px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead style={{ background: 'rgba(44,62,80,0.06)' }}>{children}</thead>
          ),
          th: ({ children }) => (
            <th style={{ padding: '10px 14px', textAlign: 'left', fontWeight: 600, color: '#2c3e50', borderBottom: '1px solid rgba(44,62,80,0.15)' }}>{children}</th>
          ),
          td: ({ children }) => (
            <td style={{ padding: '10px 14px', borderBottom: '1px solid rgba(44,62,80,0.08)', color: '#3d4f5e', verticalAlign: 'top' }}>{children}</td>
          ),
          blockquote: ({ children }) => (
            <blockquote style={{ borderLeft: '3px solid #a6c8dc', paddingLeft: 16, margin: '0 0 16px', color: '#5a6f7d' }}>{children}</blockquote>
          ),
          code: ({ children }) => (
            <code style={{ background: 'rgba(44,62,80,0.08)', padding: '2px 6px', borderRadius: 4, fontSize: 13, fontFamily: 'monospace', color: '#2c3e50' }}>{children}</code>
          ),
          hr: () => (
            <hr style={{ border: 'none', borderTop: '1px solid rgba(44,62,80,0.1)', margin: '32px 0' }} />
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
