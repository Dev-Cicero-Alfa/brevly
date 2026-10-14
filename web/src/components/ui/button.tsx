import { CircleNotch } from '@phosphor-icons/react'
import type { ButtonHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary'
  isLoading?: boolean
}

export function Button({
  variant = 'primary',
  isLoading = false,
  className,
  children,
  disabled,
  ...props
}: ButtonProps) {
  return (
    <button
      type="button"
      disabled={disabled || isLoading}
      className={cn(
        'inline-flex items-center justify-center gap-1.5 rounded-lg font-semibold transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-base/50',
        variant === 'primary' &&
          'h-12 w-full bg-blue-base px-5 text-md text-white hover:not-disabled:bg-blue-dark',
        variant === 'secondary' &&
          'h-8 bg-gray-200 px-2 text-sm text-gray-500 hover:not-disabled:border hover:not-disabled:border-blue-base',
        className
      )}
      {...props}
    >
      {isLoading ? <CircleNotch className="size-4 animate-spin" /> : null}
      {children}
    </button>
  )
}
