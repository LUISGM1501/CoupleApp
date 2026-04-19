import { useState } from 'react'
import { Input, Textarea } from '@/shared/ui/Input'
import { Button } from '@/shared/ui/Button'
import { PhotoPicker } from './PhotoPicker'
import { Calendar, MapPin, Heart } from 'lucide-react'
import { todayISO } from '@/shared/lib/dates'

export interface MemoryFormValues {
  title: string
  date: string
  description: string
  location: string
  newPhotos: File[]
  keepPhotos: string[]
}

interface Props {
  initial?: Partial<MemoryFormValues>
  existingPhotos?: string[]
  submitting?: boolean
  onSubmit: (v: MemoryFormValues) => void
  submitLabel?: string
}

export function MemoryForm({ initial, existingPhotos = [], submitting, onSubmit, submitLabel = 'Guardarlo 💕' }: Props) {
  const [title, setTitle]             = useState(initial?.title ?? '')
  const [date, setDate]               = useState(initial?.date ?? todayISO())
  const [description, setDescription] = useState(initial?.description ?? '')
  const [location, setLocation]       = useState(initial?.location ?? '')
  const [newPhotos, setNewPhotos]     = useState<File[]>([])
  const [keepPhotos, setKeepPhotos]   = useState<string[]>(existingPhotos)

  function submit(e: React.FormEvent) {
    e.preventDefault()
    onSubmit({ title, date, description, location, newPhotos, keepPhotos })
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div>
        <label className="block text-sm font-sans text-dark/70 mb-2 ml-1">Fotos (hasta 10)</label>
        <PhotoPicker
          value={newPhotos}
          onChange={setNewPhotos}
          existing={keepPhotos}
          onRemoveExisting={(url) => setKeepPhotos(keepPhotos.filter((u) => u !== url))}
          max={10}
        />
      </div>

      <Input
        label="¿Cómo le ponemos?"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        required
        maxLength={120}
        icon={<Heart size={18} />}
        placeholder="Un título dulce"
      />

      <Input
        label="Fecha"
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        required
        icon={<Calendar size={18} />}
        max={todayISO()}
      />

      <Textarea
        label="Cuéntalo con tus palabras (opcional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        rows={4}
        placeholder="Lo que quieras recordar…"
        maxLength={2000}
      />

      <Input
        label="Lugar (opcional)"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
        icon={<MapPin size={18} />}
        placeholder="Dónde pasó"
        maxLength={120}
      />

      <Button type="submit" loading={submitting} fullWidth>{submitLabel}</Button>
    </form>
  )
}
