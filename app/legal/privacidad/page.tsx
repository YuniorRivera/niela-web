import { readFileSync } from 'fs'
import { join } from 'path'
import LegalContent from '../LegalContent'

export const metadata = {
  title: 'Política de Privacidad — Niela',
  description: 'Política de privacidad y tratamiento de datos de Niela (GDPR).',
}

export default function PrivacidadPage() {
  const content = readFileSync(join(process.cwd(), 'content/legal/privacidad.md'), 'utf-8')
  return <LegalContent content={content} />
}
