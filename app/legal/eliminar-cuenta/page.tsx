import type { Metadata } from 'next'
import LegalContent from '../LegalContent'

// Versión en español de /legal/eliminar-cuenta. El proxy manda /es/legal/* aquí
// (localePrefix 'as-needed'), así que esta ES la página en español; inglés e
// italiano se sirven desde app/[locale]/legal/eliminar-cuenta con el namespace
// deleteAccount de messages/*.json. Los tres textos deben decir lo mismo.
export const metadata: Metadata = {
  title: 'Eliminar tu cuenta — Niela',
  description: 'Cómo eliminar tu cuenta de Niela y todos tus datos, desde la app o por correo.',
}

const content = `# Eliminar tu cuenta

Puedes eliminar tu cuenta de Niela cuando quieras. Al hacerlo borramos tus datos personales de forma permanente: no es una desactivación temporal y no se puede deshacer.

## Qué se elimina

- Tu cuenta: email, nombre y contraseña.
- Tus respuestas del registro: tradición, objetivos, duración y notas.
- Tu diario, tus meditaciones guardadas y tu progreso del curso.
- Tu dirección postal, si diste una para la carta de bienvenida.
- Tus créditos de IA y el historial de uso asociado a tu cuenta.

## Cómo hacerlo

### Desde la app

Es la vía más rápida y surte efecto al instante:

**Perfil → Ajustes → Eliminar cuenta**

### Por correo

Si ya no tienes acceso a la app, escríbenos a **appniela@gmail.com** con el asunto «Eliminar mi cuenta de Niela».

Escribe desde el mismo correo con el que te registraste, para poder confirmar que la cuenta es tuya. Respondemos en un máximo de 30 días, normalmente mucho antes.

---

## Nota legal

> La suscripción se gestiona desde tu ID de Apple o Google: eliminar la cuenta no la cancela. Conservamos las facturas durante 10 años por obligación fiscal, sin usarlas para ninguna otra cosa. Más detalles en nuestra [Política de Privacidad](/legal/privacidad).
`

export default function EliminarCuentaPage() {
  return <LegalContent content={content} />
}
