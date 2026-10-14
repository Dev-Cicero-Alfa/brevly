import { twMerge } from 'tailwind-merge'
import { env } from '@/env'

export function cn(...classes: Array<string | false | null | undefined>) {
  return twMerge(classes.filter(Boolean).join(' '))
}

/** Domínio exibido antes do slug (ex.: brev.ly/) — derivado da URL do front-end */
export const shortDomain = env.VITE_FRONTEND_URL.replace(/^https?:\/\//, '').replace(/\/$/, '')

export function buildShortLink(shortUrl: string) {
  return `${env.VITE_FRONTEND_URL.replace(/\/$/, '')}/${shortUrl}`
}

export function formatAccessCount(count: number) {
  return `${count} ${count === 1 ? 'acesso' : 'acessos'}`
}
