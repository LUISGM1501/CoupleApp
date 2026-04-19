import { Avatar } from '@/shared/ui/Avatar'
import { MoodBadge } from '@/features/mood/components/MoodBadge'
import type { Profile } from '@/types/database'
import { Heart } from 'lucide-react'
import { motion } from 'framer-motion'

interface Props {
  me: Profile
  partner: Profile | null
}

export function CoupleHero({ me, partner }: Props) {
  return (
    <div className="relative bg-white/60 backdrop-blur-sm border border-primary/10 rounded-5xl p-6 shadow-card">
      <div className="flex items-center justify-around">
        <PersonBlock profile={me} me />
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 1.4, repeat: Infinity, ease: 'easeInOut' }}
          className="text-primary"
        >
          <Heart size={34} fill="currentColor" />
        </motion.div>
        <PersonBlock profile={partner} />
      </div>
    </div>
  )
}

function PersonBlock({ profile, me }: { profile: Profile | null; me?: boolean }) {
  return (
    <div className="flex flex-col items-center gap-2 min-w-[90px]">
      <div className="relative">
        <Avatar src={profile?.photo_url} name={profile?.display_name} size={72} ring />
        {profile?.mood && (
          <div className="absolute -bottom-1 -right-1">
            <MoodBadge mood={profile.mood} size="sm" />
          </div>
        )}
      </div>
      <div className="text-center">
        <div className="font-serif font-semibold text-dark text-sm truncate max-w-[90px]">
          {profile?.display_name ?? '…'}
        </div>
        {me && <div className="text-[10px] text-dark/40 uppercase tracking-wider">tú</div>}
      </div>
    </div>
  )
}
