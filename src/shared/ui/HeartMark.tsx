import { cn } from '@/shared/lib/utils'

export function HeartMark({ size = 40, className, animate = true }: { size?: number; className?: string; animate?: boolean }) {
  return (
    <div
      className={cn(
        'inline-flex items-center justify-center rounded-full bg-gradient-romantic text-white shadow-soft',
        animate && 'animate-pulse-soft',
        className,
      )}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <svg viewBox="0 0 24 24" width={size * 0.55} height={size * 0.55} fill="currentColor">
        <path d="M12 21s-7.5-4.5-9.5-9.5C1 7.5 4 4.5 7.5 4.5c2 0 3.5 1 4.5 2.5 1-1.5 2.5-2.5 4.5-2.5 3.5 0 6.5 3 5 7C19.5 16.5 12 21 12 21z" />
      </svg>
    </div>
  )
}
