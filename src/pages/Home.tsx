import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Calendar as CalIcon, ChevronRight, Heart } from 'lucide-react'
import { Shell } from '@/shared/ui/Shell'
import { Skeleton } from '@/shared/ui/Skeleton'
import { Modal } from '@/shared/ui/Modal'
import { HeartMark } from '@/shared/ui/HeartMark'
import { Avatar } from '@/shared/ui/Avatar'
import { DaysCounter } from '@/features/couple/components/DaysCounter'
import { PartnerMoodCard } from '@/features/mood/components/PartnerMoodCard'
import { MoodPicker } from '@/features/mood/components/MoodPicker'
import { MoodBadge } from '@/features/mood/components/MoodBadge'
import { useMyProfile } from '@/features/auth/hooks'
import { useCouple, usePartnerRealtime } from '@/features/couple/hooks'
import { useMemories, useMemoriesRealtime } from '@/features/memories/hooks'
import { nextAnniversary, prettyDate, shortDate } from '@/shared/lib/dates'

function greeting(): string {
  const h = new Date().getHours()
  if (h < 6)  return 'Buenas noches'
  if (h < 12) return 'Buen día'
  if (h < 19) return 'Buenas tardes'
  return 'Buenas noches'
}

export default function Home() {
  const { data: me } = useMyProfile()
  const { couple, members } = useCouple()
  usePartnerRealtime(me?.couple_id)
  useMemoriesRealtime(me?.couple_id)
  const memories = useMemories(me?.couple_id)
  const [moodOpen, setMoodOpen] = useState(false)

  const partner = useMemo(
    () => members.data?.find((m) => m.id !== me?.id) ?? null,
    [members.data, me?.id],
  )
  const recent = memories.data?.[0]
  const anni = couple.data ? nextAnniversary(couple.data.start_date) : null
  const firstName = me?.display_name.split(' ')[0]

  return (
    <Shell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-32 lg:pb-16 safe-top">

        {/* Saludo */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-dark text-balance">
              {greeting()}, {firstName ?? 'mi amor'}
            </h1>
            <p className="text-sm text-dark/55 mt-1">Te cuento lo de nosotros 💕</p>
          </div>
          <button
            onClick={() => setMoodOpen(true)}
            className="group flex items-center gap-2 bg-white hover:bg-primary/5 border border-primary/15 rounded-full pl-1.5 pr-4 py-1.5 shadow-card transition"
          >
            {me?.mood
              ? <MoodBadge mood={me.mood} size="sm" />
              : <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center"><Heart size={16} className="text-primary"/></div>
            }
            <span className="text-xs font-sans text-dark/70">
              {me?.mood ? 'Tu mood' : '¿Cómo te sientes?'}
            </span>
          </button>
        </div>

        {/* Pareja + contador destacado */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          {couple.data && (
            <div className="md:col-span-2">
              <DaysCounter startDate={couple.data.start_date} />
            </div>
          )}
          <div className="bg-white rounded-5xl p-5 shadow-card border border-primary/10 flex flex-col items-center justify-center text-center">
            <div className="flex -space-x-3 mb-2">
              <Avatar src={me?.photo_url} name={me?.display_name} size={56} ring />
              <Avatar src={partner?.photo_url} name={partner?.display_name} size={56} ring />
            </div>
            <div className="font-serif font-semibold text-dark text-sm mt-1">
              {couple.data?.user1_name} &amp; {couple.data?.user2_name}
            </div>
          </div>
        </div>

        {/* Mood de la pareja */}
        <div className="mb-4">
          <PartnerMoodCard partner={partner} />
        </div>

        {/* Grid principal: recuerdo + aniversario */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Recuerdo reciente */}
          <section className="md:col-span-2">
            <div className="flex items-center justify-between mb-2.5 px-1">
              <h2 className="font-serif font-semibold text-dark text-lg">Lo último que guardamos</h2>
              <Link to="/recuerdos" className="text-xs text-primary font-sans flex items-center gap-1">
                Ver todos <ChevronRight size={14} />
              </Link>
            </div>
            {memories.isLoading ? (
              <Skeleton className="h-52" />
            ) : recent ? (
              <Link to={`/recuerdos/${recent.id}`}>
                <motion.article
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.99 }}
                  className="bg-white rounded-4xl overflow-hidden shadow-card hover:shadow-card-hover border border-primary/10 transition-all"
                >
                  {recent.photos[0] && (
                    <div className="aspect-[16/10] relative">
                      <img src={recent.photos[0]} alt={recent.title} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                  )}
                  <div className="p-5">
                    <h3 className="font-serif font-semibold text-lg text-dark">{recent.title}</h3>
                    <p className="text-xs text-dark/50 mt-0.5">{prettyDate(recent.date)}</p>
                  </div>
                </motion.article>
              </Link>
            ) : (
              <Link to="/recuerdos/nuevo">
                <div className="bg-gradient-blush rounded-4xl p-6 flex items-center gap-4 shadow-card">
                  <Sparkles className="text-primary" size={28} />
                  <div>
                    <p className="font-serif font-semibold text-dark">Guardemos el primero 💕</p>
                    <p className="text-xs text-dark/60 mt-0.5">Una foto, un título, y ya está.</p>
                  </div>
                </div>
              </Link>
            )}
          </section>

          {/* Aniversario + prompt mood */}
          <aside className="space-y-4">
            {anni && (
              <section className="bg-gradient-romantic rounded-4xl p-5 text-white shadow-card">
                <div className="text-[11px] uppercase tracking-widest opacity-80 mb-1 flex items-center gap-1.5">
                  <CalIcon size={12} /> Aniversario
                </div>
                <div className="font-serif font-bold text-xl">{anni.yearsTurning}°</div>
                <div className="text-sm opacity-90">{shortDate(anni.date)}</div>
                <div className="mt-4 pt-3 border-t border-white/25 flex items-baseline gap-1.5">
                  <span className="font-serif font-bold text-3xl tabular-nums">{anni.daysLeft}</span>
                  <span className="text-xs opacity-80">días para celebrar</span>
                </div>
              </section>
            )}
            {me && !me.mood && (
              <button
                onClick={() => setMoodOpen(true)}
                className="w-full bg-white rounded-4xl p-4 shadow-card border border-dashed border-primary/30 flex items-center gap-3 hover:bg-primary/5 transition"
              >
                <HeartMark size={40} />
                <div className="flex-1 text-left">
                  <p className="font-serif font-semibold text-dark text-sm">¿Cómo te sientes?</p>
                  <p className="text-xs text-dark/55 mt-0.5">Contale con un toque 💕</p>
                </div>
              </button>
            )}
          </aside>
        </div>
      </div>

      <Modal open={moodOpen} onClose={() => setMoodOpen(false)} title="¿Cómo te sientes?">
        <MoodPicker
          currentMood={me?.mood}
          currentMessage={me?.mood_message}
          onDone={() => setMoodOpen(false)}
        />
      </Modal>
    </Shell>
  )
}
