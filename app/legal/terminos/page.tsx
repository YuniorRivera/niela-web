import { readFileSync } from 'fs'
import { join } from 'path'
import LegalContent from '../LegalContent'

export const metadata = {
  title: 'Términos y Condiciones — Niela',
  description: 'Términos y condiciones de uso del servicio Niela.',
}

export default function TerminosPage() {
  const content = readFileSync(join(process.cwd(), 'content/legal/terminos.md'), 'utf-8')
  return <LegalContent content={content} />
}
