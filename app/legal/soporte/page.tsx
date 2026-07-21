import { readFileSync } from 'fs'
import { join } from 'path'
import LegalContent from '../LegalContent'

export const metadata = {
  title: 'Soporte — Niela',
  description: 'Ayuda y contacto de soporte de Niela.',
}

export default function SoportePage() {
  const content = readFileSync(join(process.cwd(), 'content/legal/soporte.md'), 'utf-8')
  return <LegalContent content={content} />
}
