import { cn } from '@/shared/lib/utils'

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-primary/5 via-primary/10 to-primary/5 bg-[length:200%_100%] animate-pulse rounded-2xl',
        className,
      )}
    />
  )
}
