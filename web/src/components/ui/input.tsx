import { Warning } from '@phosphor-icons/react'
import { type InputHTMLAttributes, forwardRef, useId } from 'react'
import { cn } from '@/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string
  prefix?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, prefix, error, className, id, ...props }, ref) => {
    const generatedId = useId()
    const inputId = id ?? generatedId
    const hasError = Boolean(error)

    return (
      <div className="group flex flex-col gap-2">
        <label
          htmlFor={inputId}
          className={cn(
            'text-xs font-normal uppercase text-gray-500 transition-colors',
            'group-focus-within:font-semibold group-focus-within:text-blue-base',
            hasError && 'font-semibold text-danger group-focus-within:text-danger'
          )}
        >
          {label}
        </label>

        <div
          className={cn(
            'flex h-12 items-center rounded-lg border border-gray-300 bg-white px-4 transition-colors',
            'group-focus-within:border-[1.5px] group-focus-within:border-blue-base',
            hasError && 'border-[1.5px] border-danger group-focus-within:border-danger'
          )}
        >
          {prefix ? <span className="text-md text-gray-400">{prefix}</span> : null}
          <input
            ref={ref}
            id={inputId}
            aria-invalid={hasError}
            className={cn(
              'h-full min-w-0 flex-1 bg-transparent text-md text-gray-600 outline-none placeholder:text-gray-400',
              className
            )}
            {...props}
          />
        </div>

        {hasError ? (
          <span className="flex items-center gap-2 text-sm text-gray-500">
            <Warning className="size-4 shrink-0 text-danger" />
            {error}
          </span>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
