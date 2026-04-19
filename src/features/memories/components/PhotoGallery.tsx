import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'

export function PhotoGallery({ photos }: { photos: string[] }) {
  const [open, setOpen] = useState(false)
  const [idx, setIdx]   = useState(0)

  if (!photos.length) return null

  return (
    <>
      {/* Abanico tipo polaroid */}
      <div className="relative h-64 flex items-center justify-center">
        {photos.slice(0, 5).map((url, i) => {
          const count = Math.min(photos.length, 5)
          const mid = (count - 1) / 2
          const offset = i - mid
          const rotate = offset * 6
          const translateX = offset * 18
          return (
            <motion.button
              key={url + i}
              type="button"
              onClick={() => { setIdx(i); setOpen(true) }}
              initial={{ opacity: 0, y: 20, rotate: 0 }}
              animate={{ opacity: 1, y: 0, rotate }}
              transition={{ delay: i * 0.05, duration: 0.4 }}
              whileHover={{ scale: 1.05, rotate: rotate * 0.5, zIndex: 20 }}
              whileTap={{ scale: 0.98 }}
              className="absolute bg-white p-2 pb-6 rounded-lg shadow-card-hover"
              style={{ transform: `translateX(${translateX}px)`, zIndex: 10 - Math.abs(offset) }}
            >
              <img src={url} alt="" className="w-40 h-40 object-cover rounded" loading="lazy" />
            </motion.button>
          )
        })}
        {photos.length > 5 && (
          <button
            onClick={() => { setIdx(5); setOpen(true) }}
            className="absolute bottom-2 right-2 z-30 bg-black/60 text-white text-xs rounded-full px-3 py-1"
          >
            +{photos.length - 5}
          </button>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center"
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
