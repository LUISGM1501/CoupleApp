import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Calendar, MapPin, Images } from 'lucide-react'
import type { Memory } from '@/types/database'
import { shortDate } from '@/shared/lib/dates'

export function MemoryCard({ memory }: { memory: Memory }) {
  const cover = memory.photos[0]
  return (
    <Link to={`/recuerdos/${memory.id}`}>
      <motion.article
        whileTap={{ scale: 0.98 }}
        className="bg-white rounded-4xl overflow-hidden shadow-card hover:shadow-card-hover border border-primary/10 transition-all"
      >
        {cover ? (
          <div className="aspect-[4/3] relative bg-primary/5">
            <img src={cover} alt={memory.title} className="absolute inset-0 w-full h-full object-cover" loading="lazy" />
            {memory.photos.length > 1 && (
              <div className="absolute top-2 right-2 bg-black/55 text-white text-xs rounded-full px-2 py-1 flex items-center gap-1">
                <Images size={12} /> {memory.photos.length}
              </div>
            )}
          </div>
        ) : (
          <div className="aspect-[4/3] bg-gradient-blush flex items-center justify-center text-primary/40">
            <Images size={32} />
          </div>
        )}
        <div className="p-4">
          <h3 className="font-serif font-semibold text-lg text-dark truncate">{memory.title}</h3>
          <div className="flex items-center gap-3 text-xs text-dark/50 mt-1">
            <span className="flex items-center gap-1"><Calendar size={12} />{shortDate(memory.date)}</span>
            {memory.location && (
              <span className="flex items-center gap-1 truncate">
                <MapPin size={12} />{memory.location}
              </span>
            )}
          </div>
        </div>
      </motion.article>
    </Link>
  )
}
