import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export function IconButton({ className, ...props }: ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      type="button"
      className={cn(
        'flex size-8 shrink-0 items-center justify-center rounded-sm bg-gray-200 text-gray-600 transition-colors',
        'border border-transparent hover:not-disabled:border-blue-base disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base/50',
        className
      )}
      {...props}
    />
  )
}
