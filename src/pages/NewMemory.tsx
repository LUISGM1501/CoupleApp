import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { ChevronLeft } from 'lucide-react'
import { Shell } from '@/shared/ui/Shell'
import { MemoryForm, MemoryFormValues } from '@/features/memories/components/MemoryForm'
import { useMyProfile } from '@/features/auth/hooks'
import { useCreateMemory } from '@/features/memories/hooks'
import { toHumanError } from '@/shared/lib/async'

export default function NewMemory() {
  const { data: me } = useMyProfile()
  const create = useCreateMemory()
  const navigate = useNavigate()

  async function submit(v: MemoryFormValues) {
    if (!me?.couple_id) return
    try {
      const m = await create.mutateAsync({
        coupleId: me.couple_id,
        createdBy: me.id,
        title: v.title,
        description: v.description,
        location: v.location,
        date: v.date,
        photos: v.newPhotos,
      })
      toast.success('Guardado 💕')
      navigate(`/recuerdos/${m.id}`, { replace: true })
    } catch (err) {
      console.error('create memory error', err)
      toast.error(toHumanError(err))
    }
  }

  return (
    <Shell>
      <div className="max-w-2xl mx-auto px-4 sm:px-6 pt-6 sm:pt-10 pb-32 lg:pb-16 safe-top">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-1 text-dark/60 hover:text-dark mb-4 -ml-1 text-sm"
        >
          <ChevronLeft size={18} /> Volver
        </button>
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-dark mb-2">Guardemos este momento</h1>
        <p className="text-sm text-dark/55 mb-6">Solo vivimos una vez de cada día 💕</p>
        <MemoryForm onSubmit={submit} submitting={create.isPending} />
      </div>
    </Shell>
  )
}
