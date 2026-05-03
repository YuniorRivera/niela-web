import { readFileSync } from 'fs'
import { join } from 'path'
import LegalContent from '../LegalContent'

export const metadata = {
  title: 'Política de Cookies — Niela',
  description: 'Política de cookies de Niela.',
}

export default function CookiesPage() {
  const content = readFileSync(join(process.cwd(), 'content/legal/cookies.md'), 'utf-8')
  return <LegalContent content={content} />
}
