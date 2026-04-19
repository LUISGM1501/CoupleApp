import type { Profile } from '@/types/database'
import { MoodBadge } from './MoodBadge'
import { moodDef } from '../types'
import { relativeAgo } from '@/shared/lib/dates'

export function PartnerMoodCard({ partner }: { partner: Profile | null }) {
  if (!partner) return null
  const def = moodDef(partner.mood)
  if (!def) {
    return (
      <div className="bg-white rounded-4xl p-5 shadow-card border border-primary/10">
        <p className="text-sm text-dark/60">
          <span className="font-serif font-semibold text-dark">{partner.display_name}</span>{' '}
          todavía no ha contado cómo se siente hoy.
        </p>
      </div>
    )
  }
  return (
    <div
      className="rounded-4xl p-5 shadow-card border border-white"
      style={{ background: `linear-gradient(135deg, ${def.bg} 0%, white 130%)` }}
    >
      <div className="flex items-center gap-4">
        <MoodBadge mood={partner.mood!} size="lg" />
        <div className="flex-1 min-w-0">
          <div className="text-xs text-dark/60 uppercase tracking-wider font-sans">
            {partner.display_name} se siente
          </div>
          <div className="font-serif font-bold text-2xl" style={{ color: def.color }}>{def.label}</div>
          {partner.mood_message && (
            <p className="text-sm text-dark/75 mt-1 italic">"{partner.mood_message}"</p>
          )}
          {partner.mood_updated_at && (
            <div className="text-[11px] text-dark/45 mt-1.5">{relativeAgo(partner.mood_updated_at)}</div>
          )}
        </div>
      </div>
    </div>
  )
}
