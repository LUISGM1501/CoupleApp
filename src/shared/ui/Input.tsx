import { InputHTMLAttributes, TextareaHTMLAttributes, ReactNode, forwardRef } from 'react'
import { cn } from '@/shared/lib/utils'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  icon?: ReactNode
  error?: string | null
}

export const Input = forwardRef<HTMLInputElement, InputProps>(function Input(
  { label, icon, error, className, id, ...rest },
  ref,
) {
  const inputId = id || label?.replace(/\s+/g, '-').toLowerCase()
  return (
    <label htmlFor={inputId} className="block">
      {label && (
        <span className="block text-sm font-sans text-dark/70 mb-1.5 ml-1">{label}</span>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-primary/60 pointer-events-none">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          id={inputId}
          className={cn(
            'w-full rounded-3xl bg-white border border-primary/10 px-4 py-3',
            !!icon && 'pl-11',
            'text-dark placeholder:text-dark/30',
            'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30',
            error && 'border-primary/40 focus:ring-primary/40',
            className,
          )}
          {...rest}
        />
      </div>
      {error && <span className="block text-xs text-primary mt-1 ml-1">{error}</span>}
    </label>
  )
})

interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string | null
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(function Textarea(
  { label, error, className, id, ...rest },
  ref,
) {
  const inputId = id || label?.replace(/\s+/g, '-').toLowerCase()
  return (
    <label htmlFor={inputId} className="block">
      {label && (
        <span className="block text-sm font-sans text-dark/70 mb-1.5 ml-1">{label}</span>
      )}
      <textarea
        ref={ref}
        id={inputId}
        className={cn(
          'w-full rounded-3xl bg-white border border-primary/10 px-4 py-3',
          'text-dark placeholder:text-dark/30 resize-none',
          'focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/30',
          error && 'border-primary/40 focus:ring-primary/40',
          className,
        )}
        {...rest}
      />
      {error && <span className="block text-xs text-primary mt-1 ml-1">{error}</span>}
    </label>
  )
})
