import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Camera, Copy, LogOut, Pencil, Bell, BellOff } from 'lucide-react'
import { Shell } from '@/shared/ui/Shell'
import { Avatar } from '@/shared/ui/Avatar'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { MoodBadge } from '@/features/mood/components/MoodBadge'
import { useMyProfile, useSignOut } from '@/features/auth/hooks'
import { useCouple, useUpdateProfile, useUploadAvatar } from '@/features/couple/hooks'
import { useMemories } from '@/features/memories/hooks'
import { daysTogether, monthsTogether } from '@/shared/lib/dates'
import { pickPhotos, compressPhoto } from '@/shared/lib/images'
import { toHumanError } from '@/shared/lib/async'
import { notificationsEnabled, requestPermission, setNotificationsEnabled } from '@/shared/lib/notifications'

export default function Profile() {
  const { data: me } = useMyProfile()
  const { couple } = useCouple()
  const memories = useMemories(me?.couple_id)
  const upload = useUploadAvatar()
  const update = useUpdateProfile()
  const signOut = useSignOut()
  const navigate = useNavigate()

  const [editOpen, setEditOpen] = useState(false)
  const [name, setName] = useState(me?.display_name ?? '')
  const [notif, setNotif] = useState(notificationsEnabled())

  const stats = useMemo(() => {
    if (!couple.data) return null
    return {
      days: daysTogether(couple.data.start_date),
      months: monthsTogether(couple.data.start_date),
      count: memories.data?.length ?? 0,
    }
  }, [couple.data, memories.data])

  async function changeAvatar() {
    try {
      const [f] = await pickPhotos(false)
      if (!f) return
      const small = await compressPhoto(f)
      const url = await upload.mutateAsync(small)
      await update.mutateAsync({ photo_url: url })
      toast.success('Foto actualizada')
    } catch (err) {
      console.error('avatar error', err)
      toast.error(toHumanError(err))
    }
  }

  async function saveName() {
    try {
      await update.mutateAsync({ display_name: name.trim() })
      toast.success('Listo 💕')
      setEditOpen(false)
    } catch (err) {
      console.error('name error', err)
      toast.error(toHumanError(err))
    }
  }

  async function toggleNotif() {
    if (!notif) {
      const ok = await requestPermission()
      setNotif(ok)
      if (ok) toast.success('Notificaciones activadas')
      else toast.error('No se pudo activar. Revisá permisos del navegador.')
    } else {
      setNotificationsEnabled(false)
      setNotif(false)
      toast('Notificaciones silenciadas', { icon: '🔕' })
    }
  }

  async function copyCode() {
    if (!me?.couple_code) return
    try { await navigator.clipboard.writeText(me.couple_code); toast.success('Copiado') }
    catch (err) { console.error(err) }
  }

  async function logout() {
    try { await signOut.mutateAsync(); navigate('/login', { replace: true }) }
    catch (err) { console.error(err); toast.error(toHumanError(err)) }
  }

  if (!me) return null

  return (
    <Shell>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 pt-10 sm:pt-14 pb-32 lg:pb-16 safe-top">
        <h1 className="font-serif font-bold text-3xl sm:text-4xl text-dark mb-6">Mi perfil</h1>

        {/* Usuario */}
        <section className="bg-white rounded-5xl p-6 sm:p-8 shadow-card border border-primary/10 flex items-center gap-5 mb-4">
          <button onClick={changeAvatar} className="relative shrink-0">
            <Avatar src={me.photo_url} name={me.display_name} size={88} ring />
            <span className="absolute bottom-0 right-0 w-9 h-9 bg-primary text-white rounded-full flex items-center justify-center shadow-soft">
              <Camera size={15} />
            </span>
          </button>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-serif font-bold text-2xl text-dark truncate">{me.display_name}</h2>
              <button
                onClick={() => { setName(me.display_name); setEditOpen(true) }}
                className="text-dark/40 hover:text-primary p-1"
                aria-label="Editar nombre"
              ><Pencil size={15} /></button>
            </div>
            <p className="text-xs text-dark/50 truncate">{me.email}</p>
            {me.mood && <div className="mt-3"><MoodBadge mood={me.mood} size="sm" showLabel /></div>}
          </div>
        </section>

        {/* Estadísticas */}
        {stats && (
          <section className="bg-gradient-card rounded-5xl p-6 shadow-card border border-primary/10 mb-4">
            <div className="text-xs text-dark/50 uppercase tracking-wider font-sans mb-4">Nosotros</div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Stat value={stats.days} label="días" />
              <Stat value={stats.months} label="meses" />
              <Stat value={stats.count} label="recuerdos" />
            </div>
          </section>
        )}

        {/* Código si la pareja no está completa */}
        {couple.data && !couple.data.user2_id && me.couple_code && (
          <section className="bg-gradient-blush rounded-4xl p-5 shadow-card mb-4">
            <div className="text-xs text-dark/60 uppercase tracking-wider font-sans mb-2">
              Código de pareja
            </div>
            <div className="flex items-center gap-3">
              <div className="font-serif font-bold text-2xl tracking-[0.25em] text-primary flex-1">
                {me.couple_code}
              </div>
              <Button size="sm" variant="secondary" onClick={copyCode}>
                <Copy size={14} /> Copiar
              </Button>
            </div>
          </section>
        )}

        {/* Toggle notif */}
        <section className="bg-white rounded-4xl p-4 shadow-card border border-primary/10 mb-4">
          <button onClick={toggleNotif} className="flex items-center gap-3 w-full">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center ${notif ? 'bg-primary text-white' : 'bg-primary/10 text-primary'}`}>
              {notif ? <Bell size={18} /> : <BellOff size={18} />}
            </div>
            <div className="flex-1 text-left">
              <div className="font-sans font-semibold text-dark text-sm">Notificaciones</div>
              <div className="text-xs text-dark/50">
                {notif ? 'Activas — te avisamos cuando pase algo.' : 'Activar para saber de tu pareja.'}
              </div>
            </div>
            <div className={`w-11 h-6 rounded-full transition-colors relative ${notif ? 'bg-primary' : 'bg-dark/15'}`}>
              <div className={`absolute top-0.5 w-5 h-5 bg-white rounded-full shadow transition-all ${notif ? 'left-[22px]' : 'left-0.5'}`} />
            </div>
          </button>
        </section>

        {/* Cerrar sesión */}
        <Button variant="danger" fullWidth onClick={logout} loading={signOut.isPending}>
          <LogOut size={16} /> Cerrar sesión
        </Button>
      </div>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Tu nombre" size="sm">
        <div className="space-y-4">
          <Input value={name} onChange={(e) => setName(e.target.value)} autoFocus maxLength={40} />
          <div className="flex gap-2">
            <Button variant="secondary" fullWidth onClick={() => setEditOpen(false)}>Cancelar</Button>
            <Button fullWidth onClick={saveName} loading={update.isPending}>Guardar</Button>
          </div>
        </div>
      </Modal>
    </Shell>
  )
}

function Stat({ value, label }: { value: number; label: string }) {
  return (
    <div>
      <div className="font-serif font-bold text-3xl text-primary tabular-nums">{value.toLocaleString('es')}</div>
      <div className="text-[10px] text-dark/50 uppercase tracking-wider mt-0.5">{label}</div>
    </div>
  )
}
