import type { Metadata } from 'next'
import LegalContent from '../LegalContent'

export const metadata: Metadata = {
  title: 'Eliminar cuenta — Niela',
  description: 'Instrucciones para eliminar tu cuenta y datos personales de Niela.',
}

const content = `# Eliminar tu cuenta de Niela

Si querés eliminar tu cuenta, todos tus datos personales serán borrados de manera permanente e irreversible de nuestros servidores.

## Datos que se eliminan

- Perfil y datos personales
- Historial de sesiones de meditación
- Entradas del diario
- Meditaciones generadas por IA
- Suscripciones y créditos

## ¿Cómo eliminar tu cuenta?

### Opción 1 — Desde la app

Abrí la app Niela y seguí estos pasos:

**Perfil → Ajustes → Eliminar cuenta**

### Opción 2 — Por email

Enviá un email a **soporte@niela.app** con asunto: **"Solicitud eliminación de cuenta"** indicando tu email de registro.

Procesamos tu solicitud en 48 horas.

---

## Nota legal

> ⚠️ Eliminar tu cuenta es permanente e irreversible. Todos tus datos serán borrados de nuestros servidores en 30 días según nuestra [Política de Privacidad](/legal/privacidad).
`

export default function EliminarCuentaPage() {
  return <LegalContent content={content} />
}
