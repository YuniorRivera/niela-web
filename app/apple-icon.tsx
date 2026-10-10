import { ImageResponse } from 'next/og'

// Icono que usa iOS al guardar la web en la pantalla de inicio. Se generaba un
// 404 porque el layout declaraba /apple-touch-icon.png y ese archivo no existía.
export const size = { width: 180, height: 180 }
export const contentType = 'image/png'

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%', height: '100%', display: 'flex',
          alignItems: 'center', justifyContent: 'center',
          background: '#0A0E14', color: '#D4A857',
          fontSize: 104, fontFamily: 'sans-serif', fontWeight: 600,
        }}
      >
        N
      </div>
    ),
    size,
  )
}
