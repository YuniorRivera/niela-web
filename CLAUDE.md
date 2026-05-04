# Niela Web (niela-web)

## Stack
- Next.js 14+ App Router
- TypeScript
- Tailwind CSS (instalado pero la página principal usa CSS-in-JS por simplicidad)
- Deploy: Vercel (auto-deploy desde master)
- API backend: NEXT_PUBLIC_API_URL → https://medita-app-production.up.railway.app

## Reglas anti-token-waste
- Respondé en 1-3 oraciones. Sin preámbulos.
- No halagues. Trabajo directo.
- No narres plan, solo ejecutá.
- No releas archivos ya leídos.
- Edits parciales con `str_replace`, no reescribir archivos completos.
- No dupliques código en la respuesta si ya lo editaste.
- No instales libs nuevas si CSS puro alcanza (no Framer Motion para animaciones simples — bastan keyframes CSS).

## Convenciones del proyecto
- Página principal `app/page.tsx` es Client Component ('use client') con todo en un archivo (decisión consciente: legibilidad > splitting prematuro).
- Animaciones: keyframes CSS en `<style jsx>`. NO Framer Motion.
- Forms de waitlist: POST a `${API_URL}/api/waitlist` con `{ email }`.
- Counter dinámico: GET a `${API_URL}/api/waitlist/count`, fallback a 327 si falla.
- Páginas legales en `app/legal/{terminos,privacidad,cookies}/page.tsx` con react-markdown.

## Paleta canónica (sincronizada con mobile)
- primary: #2c3e50
- accent-blue: #a6c8dc
- accent-green: #b8c9a8
- accent-amber: #d4b896
- bg-light: #e8f1f5
- bg-cream: #f0ebe0
- text-primary: #1f2d3a
- text-secondary: #5a6f7d

## Tradiciones canónicas (NO cambiar, NO inventar otras)
1. Zen
2. Tibetana
3. Andina
4. Sufí
5. Cristiana
6. Islámica
7. Laica

NO existen en Niela: Vipassana, Vedanta, Mindfulness (como tradición separada). Si alguna se sugiere, RECHAZAR.

## Reglas críticas
1. Antes de cambiar el diseño de la landing: leer este archivo + ver versión en producción (https://niela-web.vercel.app).
2. NO inventar componentes que no estén en el diseño aprobado.
3. NO improvisar copy: el copy del hero es: "Tu meditación, tu tradición, tu momento."
4. NO improvisar tradiciones (ver lista canónica arriba).
5. Mockup mobile en hero: dimensiones específicas (290x580, padding 10, borderRadius 44). NO reducir.
6. Esfera + 2 anillos: animación rotate (60s y 80s) y heroFloat (10s). NO simplificar.
7. Cards 01/02/03 en "Cómo funciona": cada una con 2 ondas ripple (animación 3s, delays distintos). NO emojis genéricos.

## Estructura
```
app/
  page.tsx              # landing principal (todo en un archivo)
  layout.tsx
  legal/
    terminos/page.tsx
    privacidad/page.tsx
    cookies/page.tsx
  demo/page.tsx         # modo demo sin registro (futuro)
public/
```

## Deploy
- Push a `master` → Vercel deploy automático.
- ENV vars en Vercel: NEXT_PUBLIC_API_URL.

## Estado actual
- Landing v3 deployada
- Form waitlist conectado al backend
- Counter dinámico
- Responsive mobile fix aplicado
- Pendiente: integrar páginas legales (/legal/*), modo demo (/demo)
