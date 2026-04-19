import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Plus, LayoutGrid, BookOpen, Images } from 'lucide-react'
import { Shell } from '@/shared/ui/Shell'
import { Skeleton } from '@/shared/ui/Skeleton'
import { MemoryCard } from '@/features/memories/components/MemoryCard'
import { MemoryJournalRow } from '@/features/memories/components/MemoryJournalRow'
import { useMyProfile } from '@/features/auth/hooks'
import { useMemories, useMemoriesRealtime } from '@/features/memories/hooks'
import { cn } from '@/shared/lib/utils'

type View = 'grid' | 'journal'

export default function Memories() {
  const { data: me } = useMyProfile()
  useMemoriesRealtime(me?.couple_id)
  const { data, isLoading } = useMemories(me?.couple_id)
  const [view, setView] = useState<View>('grid')

  return (
    <Shell>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-32 lg:pb-16 safe-top">

        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-dark">Nuestros recuerdos</h1>
            <p className="text-sm text-dark/55 mt-1">Lo que vamos construyendo, juntos 💕</p>
          </div>
          <Link
            to="/recuerdos/nuevo"
            className="w-12 h-12 rounded-full bg-gradient-warm text-white flex items-center justify-center shadow-soft hover:shadow-card-hover transition-shadow"
            aria-label="Nuevo recuerdo"
          ><Plus size={22} /></Link>
        </div>

        {/* Toggle */}
        <div className="inline-flex bg-white rounded-full border border-primary/10 p-1 shadow-card mb-5">
          <ToggleBtn active={view === 'grid'}    onClick={() => setView('grid')}><LayoutGrid size={15} /> Grid</ToggleBtn>
          <ToggleBtn active={view === 'journal'} onClick={() => setView('journal')}><BookOpen size={15} /> Diario</ToggleBtn>
        </div>

        {isLoading ? (
          view === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} className="aspect-[4/3]" />)}
            </div>
          ) : (
            <div className="space-y-3 max-w-3xl">
              {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
            </div>
          )
        ) : data && data.length > 0 ? (
          view === 'grid' ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
              {data.map((m) => <MemoryCard key={m.id} memory={m} />)}
            </div>
          ) : (
            <div className="space-y-3 max-w-3xl">
              {data.map((m) => <MemoryJournalRow key={m.id} memory={m} />)}
            </div>
          )
        ) : (
          <EmptyState />
        )}
      </div>
    </Shell>
  )
}

function ToggleBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={cn(
        'px-4 py-1.5 rounded-full text-xs font-sans font-medium inline-flex items-center gap-1.5 transition-colors',
        active ? 'bg-gradient-warm text-white shadow-soft' : 'text-dark/60 hover:text-dark',
      )}
    >{children}</button>
  )
}

function EmptyState() {
  return (
    <Link to="/recuerdos/nuevo">
      <div className="bg-gradient-card rounded-4xl p-10 text-center border border-primary/10 shadow-card max-w-xl mx-auto">
        <div className="w-20 h-20 mx-auto bg-white rounded-full flex items-center justify-center shadow-soft mb-4">
          <Images className="text-primary" size={32} />
        </div>
        <h3 className="font-serif font-semibold text-xl text-dark">Aquí van nuestros momentos 💕</h3>
        <p className="text-sm text-dark/60 mt-2 text-balance">
          Guardá el primero y empezamos a construir nuestra pequeña historia.
        </p>
      </div>
    </Link>
  )
}
