import { useEffect, useState } from 'react'
import { ImagePlus, X } from 'lucide-react'
import { pickPhotos } from '@/shared/lib/images'
import { cn } from '@/shared/lib/utils'
import toast from 'react-hot-toast'

interface Props {
  value: File[]
  onChange: (files: File[]) => void
  max?: number
  existing?: string[]
  onRemoveExisting?: (url: string) => void
  className?: string
}

export function PhotoPicker({ value, onChange, max = 10, existing = [], onRemoveExisting, className }: Props) {
  const [previews, setPreviews] = useState<string[]>([])
  const totalCount = value.length + existing.length

  useEffect(() => {
    const urls = value.map((f) => URL.createObjectURL(f))
    setPreviews(urls)
    return () => { urls.forEach((u) => URL.revokeObjectURL(u)) }
  }, [value])

  async function add() {
    try {
      const picked = await pickPhotos(true)
      const room = max - totalCount
      if (picked.length > room) toast(`Solo caben ${room} más`, { icon: '📸' })
      onChange([...value, ...picked.slice(0, room)])
    } catch (err) {
      console.error('pick error', err)
      toast.error('No se pudieron seleccionar las fotos')
    }
  }

  function removeNew(idx: number) {
    const next = [...value]; next.splice(idx, 1); onChange(next)
  }

  return (
    <div className={cn('grid grid-cols-3 gap-2', className)}>
      {existing.map((url) => (
        <div key={url} className="relative aspect-square rounded-2xl overflow-hidden bg-primary/5 group">
          <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
          {onRemoveExisting && (
            <button
              type="button"
              onClick={() => onRemoveExisting(url)}
              className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
              aria-label="Quitar foto"
            >
              <X size={14} />
            </button>
          )}
        </div>
      ))}
      {previews.map((url, idx) => (
        <div key={url} className="relative aspect-square rounded-2xl overflow-hidden bg-primary/5">
          <img src={url} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => removeNew(idx)}
            className="absolute top-1 right-1 bg-black/60 text-white rounded-full p-1 hover:bg-black/80"
            aria-label="Quitar foto"
          >
            <X size={14} />
          </button>
        </div>
      ))}
      {totalCount < max && (
        <button
          type="button"
          onClick={add}
          className="aspect-square rounded-2xl bg-primary/5 border-2 border-dashed border-primary/30 text-primary flex flex-col items-center justify-center gap-1 hover:bg-primary/10 transition"
        >
          <ImagePlus size={22} />
          <span className="text-[11px] font-sans">Agregar</span>
        </button>
      )}
    </div>
  )
}
