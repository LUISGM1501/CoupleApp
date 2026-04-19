import { moodDef } from '../types'
import { MoodIcon } from '@/shared/ui/MoodIcon'
import type { MoodKey } from '@/types/database'
import { cn } from '@/shared/lib/utils'

interface Props {
  mood: MoodKey
  size?: 'sm' | 'md' | 'lg'
  showLabel?: boolean
  className?: string
}

const sizes = {
  sm: { box: 'w-9 h-9',  icon: 18 },
  md: { box: 'w-12 h-12', icon: 22 },
  lg: { box: 'w-16 h-16', icon: 30 },
}

export function MoodBadge({ mood, size = 'md', showLabel, className }: Props) {
  const def = moodDef(mood)
  if (!def) return null
  const s = sizes[size]
  return (
    <div className={cn('inline-flex items-center gap-2.5', className)}>
      <div
        className={cn('rounded-full flex items-center justify-center shadow-soft ring-2 ring-white', s.box)}
        style={{ backgroundColor: def.bg, color: def.color }}
        aria-label={def.label}
      >
        <MoodIcon mood={mood} size={s.icon} />
      </div>
      {showLabel && (
        <span className="font-sans font-medium text-sm text-dark/80">{def.label}</span>
      )}
    </div>
  )
}
