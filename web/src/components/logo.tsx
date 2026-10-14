import { Link as LinkIcon } from '@phosphor-icons/react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  iconOnly?: boolean
}

export function Logo({ className, iconOnly = false }: LogoProps) {
  return (
    <div className={cn('flex items-center gap-2 text-blue-base', className)}>
      <LinkIcon weight="bold" className={iconOnly ? 'size-12' : 'size-6'} aria-hidden />
      {iconOnly ? null : <span className="text-xl font-bold">brev.ly</span>}
    </div>
  )
}
