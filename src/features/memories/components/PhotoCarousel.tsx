import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

export function PhotoCarousel({ photos }: { photos: string[] }) {
  const [open, setOpen] = useState(false)
  const [idx, setIdx]   = useState(0)
  const [active, setActive] = useState(0)
  const scrollRef = useRef<HTMLDivElement>(null)

  // seguir el scroll para indicar qué foto está activa
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const onScroll = () => {
      const w = el.clientWidth
      setActive(Math.round(el.scrollLeft / w))
    }
    el.addEventListener('scroll', onScroll, { passive: true })
    return () => el.removeEventListener('scroll', onScroll)
  }, [])

  function goTo(i: number) {
    const el = scrollRef.current
    if (!el) return
    el.scrollTo({ left: i * el.clientWidth, behavior: 'smooth' })
  }

  if (!photos.length) return null

  return (
    <>
      <div className="relative">
        <div
          ref={scrollRef}
          className="flex overflow-x-auto snap-x snap-mandatory rounded-4xl bg-primary/5 no-scrollbar shadow-card"
        >
          {photos.map((url, i) => (
            <button
              type="button"
              key={url + i}
              onClick={() => { setIdx(i); setOpen(true) }}
              className="relative shrink-0 w-full snap-center aspect-[4/5] sm:aspect-[16/10]"
            >
              <img
                src={url}
                alt=""
                className="absolute inset-0 w-full h-full object-cover"
                loading={i === 0 ? 'eager' : 'lazy'}
              />
            </button>
          ))}
        </div>

        {photos.length > 1 && (
          <>
            {/* dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => goTo(i)}
                  className={cn(
                    'h-1.5 rounded-full transition-all',
                    i === active ? 'w-5 bg-white' : 'w-1.5 bg-white/60',
                  )}
                  aria-label={`Foto ${i + 1}`}
                />
              ))}
            </div>
            {/* flechas en desktop */}
            <button
              onClick={() => goTo(Math.max(0, active - 1))}
              disabled={active === 0}
              className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-soft text-dark/80 disabled:opacity-0 transition-opacity"
              aria-label="Anterior"
            ><ChevronLeft size={18} /></button>
            <button
              onClick={() => goTo(Math.min(photos.length - 1, active + 1))}
              disabled={active === photos.length - 1}
              className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-9 h-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-soft text-dark/80 disabled:opacity-0 transition-opacity"
              aria-label="Siguiente"
            ><ChevronRight size={18} /></button>
            {/* contador */}
            <div className="absolute top-3 right-3 bg-black/45 text-white text-xs rounded-full px-2.5 py-1 font-sans">
              {active + 1} / {photos.length}
            </div>
          </>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center"
            onClick={() => setOpen(false)}
          >
            <button
              onClick={(e) => { e.stopPropagation(); setOpen(false) }}
              className="absolute top-4 right-4 z-10 text-white p-2 rounded-full bg-white/10"
              aria-label="Cerrar"
            ><X size={22} /></button>

            {idx > 0 && (
              <button
                onClick={(e) => { e.stopPropagation(); setIdx(idx - 1) }}
                className="absolute left-2 z-10 text-white p-3 rounded-full bg-white/10"
                aria-label="Anterior"
              ><ChevronLeft size={28} /></button>
            )}
            {idx < photos.length - 1 && (
              <button
                onClick={(e) => { e.stopPropagation(); setIdx(idx + 1) }}
                className="absolute right-2 z-10 text-white p-3 rounded-full bg-white/10"
                aria-label="Siguiente"
              ><ChevronRight size={28} /></button>
            )}

            <motion.img
              key={photos[idx]}
              src={photos[idx]}
              alt=""
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="max-h-[88vh] max-w-[94vw] object-contain rounded-lg"
              onClick={(e) => e.stopPropagation()}
            />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/80 text-sm font-sans">
              {idx + 1} / {photos.length}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
