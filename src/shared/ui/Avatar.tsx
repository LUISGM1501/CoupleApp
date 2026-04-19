import { cn, initials } from '@/shared/lib/utils'

interface AvatarProps {
  src?: string | null
  name?: string | null
  size?: number
  className?: string
  ring?: boolean
}

export function Avatar({ src, name, size = 48, className, ring }: AvatarProps) {
  return (
    <div
      className={cn(
        'relative inline-flex items-center justify-center rounded-full bg-gradient-warm text-white font-serif font-semibold overflow-hidden',
        ring && 'ring-4 ring-white shadow-soft',
        className,
      )}
      style={{ width: size, height: size, fontSize: size * 0.38 }}
    >
      {src ? (
        <img
          src={src}
          alt={name ?? ''}
          className="absolute inset-0 w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <span>{initials(name)}</span>
      )}
    </div>
  )
}
