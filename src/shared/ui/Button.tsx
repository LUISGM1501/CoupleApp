import { ButtonHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/shared/lib/utils'
import { Loader2 } from 'lucide-react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const variants: Record<Variant, string> = {
  primary:
    'bg-gradient-warm text-white shadow-soft hover:shadow-card-hover active:scale-[0.98]',
  secondary:
    'bg-white border border-primary/20 text-primary hover:bg-primary/5 active:scale-[0.98]',
  ghost:
    'text-primary hover:bg-primary/10 active:scale-[0.98]',
  danger:
    'bg-primary/10 text-primary hover:bg-primary/20 active:scale-[0.98]',
}

const sizes: Record<Size, string> = {
  sm: 'py-2 px-4 text-sm',
  md: 'py-3 px-6 text-base',
  lg: 'py-4 px-8 text-lg',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(function Button(
  { variant = 'primary', size = 'md', loading, fullWidth, className, children, disabled, ...rest },
  ref,
) {
  return (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-full font-sans font-semibold transition-all',
        'disabled:opacity-60 disabled:cursor-not-allowed',
        variants[variant],
        sizes[size],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {loading && <Loader2 className="w-4 h-4 animate-spin" />}
      {children}
    </button>
  )
})
