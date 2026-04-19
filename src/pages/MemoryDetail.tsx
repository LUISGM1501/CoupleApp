import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Edit3, Trash2, Calendar, MapPin, ChevronLeft } from 'lucide-react'
import { Shell } from '@/shared/ui/Shell'
import { Skeleton } from '@/shared/ui/Skeleton'
import { Modal } from '@/shared/ui/Modal'
import { Button } from '@/shared/ui/Button'
import { PhotoCarousel } from '@/features/memories/components/PhotoCarousel'
import { MemoryForm, MemoryFormValues } from '@/features/memories/components/MemoryForm'
import { CommentSection } from '@/features/comments/components/CommentSection'
import { useMemory, useUpdateMemory, useDeleteMemory } from '@/features/memories/hooks'
import { useMyProfile } from '@/features/auth/hooks'
import { prettyDate } from '@/shared/lib/dates'
import { toHumanError } from '@/shared/lib/async'

export default function MemoryDetail() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const { data: me } = useMyProfile()
  const { data: memory, isLoading } = useMemory(id)
  const update = useUpdateMemory()
  const del = useDeleteMemory()
  const [editOpen, setEditOpen] = useState(false)
  const [delOpen, setDelOpen] = useState(false)

  async function onUpdate(v: MemoryFormValues) {
    if (!memory) return
    try {
      await update.mutateAsync({
        id: memory.id,
        coupleId: memory.couple_id,
        title: v.title,
        description: v.description,
        location: v.location,
        date: v.date,
        keepPhotos: v.keepPhotos,
        newPhotos: v.newPhotos,
      })
      toast.success('Actualizado 💕')
      setEditOpen(false)
    } catch (err) {
      console.error('update error', err)
      toast.error(toHumanError(err))
    }
  }

  async function onDelete() {
    if (!memory) return
    try {
      await del.mutateAsync(memory)
      toast.success('Eliminado')
      navigate('/recuerdos', { replace: true })
    } catch (err) {
      console.error('delete error', err)
      toast.error(toHumanError(err))
    }
  }

  if (isLoading) {
    return (
      <Shell>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-32 lg:pb-16 space-y-5">
          <Skeleton className="h-72" />
          <Skeleton className="h-8 w-2/3" />
          <Skeleton className="h-4 w-1/2" />
          <Skeleton className="h-24" />
        </div>
      </Shell>
    )
  }

  if (!memory || !me) return null

  return (
    <Shell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-32 lg:pb-16 safe-top">

        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1 text-dark/60 hover:text-dark -ml-1 text-sm"
          >
            <ChevronLeft size={18} /> Volver
          </button>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setEditOpen(true)}
              className="p-2 rounded-full hover:bg-primary/10 text-dark/70"
              aria-label="Editar"
            ><Edit3 size={20} /></button>
            <button
              onClick={() => setDelOpen(true)}
              className="p-2 rounded-full hover:bg-primary/10 text-primary"
              aria-label="Eliminar"
            ><Trash2 size={20} /></button>
          </div>
        </div>

        <PhotoCarousel photos={memory.photos} />

        <div className="mt-6">
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-dark text-balance">{memory.title}</h1>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-sm text-dark/60 mt-2">
            <span className="flex items-center gap-1.5"><Calendar size={14} />{prettyDate(memory.date)}</span>
            {memory.location && (
              <span className="flex items-center gap-1.5"><MapPin size={14} />{memory.location}</span>
            )}
          </div>
        </div>

        {memory.description && (
          <p className="text-dark/85 leading-relaxed whitespace-pre-wrap font-sans mt-5 text-[15px]">
            {memory.description}
          </p>
        )}

        <div className="mt-8">
          <CommentSection memoryId={memory.id} me={me} />
        </div>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar recuerdo" size="lg">
        <MemoryForm
          initial={{
            title: memory.title,
            date: memory.date,
            description: memory.description ?? '',
            location: memory.location ?? '',
          }}
          existingPhotos={memory.photos}
          submitting={update.isPending}
          onSubmit={onUpdate}
          submitLabel="Guardar cambios"
        />
      </Modal>

      <Modal open={delOpen} onClose={() => setDelOpen(false)} title="¿Eliminar este recuerdo?" size="sm">
        <p className="text-sm text-dark/70 mb-5">
          Se borra para los dos, y también las fotos. Esto no se puede deshacer.
        </p>
        <div className="flex gap-2">
          <Button variant="secondary" fullWidth onClick={() => setDelOpen(false)}>Cancelar</Button>
          <Button variant="primary" fullWidth onClick={onDelete} loading={del.isPending}>
            Sí, eliminar
          </Button>
        </div>
      </Modal>
    </Shell>
  )
}
