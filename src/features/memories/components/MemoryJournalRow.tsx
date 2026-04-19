import { Link } from 'react-router-dom'
import { Calendar, MapPin } from 'lucide-react'
import type { Memory } from '@/types/database'
import { prettyDate } from '@/shared/lib/dates'
import { truncate } from '@/shared/lib/utils'

export function MemoryJournalRow({ memory }: { memory: Memory }) {
  return (
    <Link to={`/recuerdos/${memory.id}`} className="block">
      <article className="bg-white rounded-4xl p-5 shadow-card hover:shadow-card-hover border border-primary/10 transition-all">
        <div className="flex gap-4">
          {memory.photos[0] && (
            <div className="w-20 h-20 rounded-3xl overflow-hidden bg-primary/5 shrink-0">
              <img src={memory.photos[0]} alt="" className="w-full h-full object-cover" loading="lazy" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-serif font-semibold text-lg text-dark truncate">{memory.title}</h3>
            <div className="flex items-center gap-3 text-xs text-dark/50 mt-0.5">
              <span className="flex items-center gap-1"><Calendar size={12} />{prettyDate(memory.date)}</span>
              {memory.location && (
                <span className="flex items-center gap-1 truncate">
                  <MapPin size={12} />{memory.location}
                </span>
              )}
            </div>
            {memory.description && (
              <p className="text-sm text-dark/70 mt-2 leading-snug">{truncate(memory.description, 140)}</p>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}
