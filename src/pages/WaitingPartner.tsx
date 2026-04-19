import { useEffect } from 'react'
import { Navigate, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Copy, LogOut, Share2 } from 'lucide-react'
import { HeartMark } from '@/shared/ui/HeartMark'
import { Button } from '@/shared/ui/Button'
import { useMyProfile, useSession, useSignOut } from '@/features/auth/hooks'
import { useCouple, usePartnerRealtime } from '@/features/couple/hooks'
import { useQueryClient } from '@tanstack/react-query'

export default function WaitingPartner() {
  const { session, loading } = useSession()
  const { data: me, isLoading } = useMyProfile()
  const { couple } = useCouple()
  const signOut = useSignOut()
  const navigate = useNavigate()
  const qc = useQueryClient()

  usePartnerRealtime(me?.couple_id)

  // polling suave como fallback al realtime
  useEffect(() => {
    if (!me?.couple_id) return
    const t = setInterval(() => {
      qc.invalidateQueries({ queryKey: ['couple', me.couple_id] })
    }, 5000)
    return () => clearInterval(t)
  }, [me?.couple_id, qc])

  if (loading || isLoading) return null
  if (!session) return <Navigate to="/login" replace />
  if (!me) return null

  // si ya tiene pareja Y la pareja está completa → home
  if (me.couple_id && couple.data?.user2_id) {
    return <Navigate to="/" replace />
  }

  // si no tiene couple_id en absoluto → al login para elegir flujo
  if (!me.couple_id) {
    return <Navigate to="/login" replace />
  }

  const code = me.couple_code || couple.data?.couple_code || ''

  async function copy() {
    if (!code) return
    try {
      await navigator.clipboard.writeText(code)
      toast.success('Copiado')
    } catch (err) {
      console.error(err); toast.error('No se pudo copiar')
    }
  }

  async function share() {
    if (!code) return
    const text = `Únete a nuestra app en Nosotros con este código: ${code} 💕`
    try {
      if (navigator.share) await navigator.share({ title: 'Nosotros 💕', text })
      else { await navigator.clipboard.writeText(code); toast.success('Código copiado') }
    } catch (err) { console.error(err) }
  }

  async function logout() {
    try { await signOut.mutateAsync(); navigate('/login', { replace: true }) }
    catch (err) { console.error(err) }
  }

  return (
    <div className="min-h-full flex flex-col items-center justify-center max-w-md mx-auto px-6 py-10 safe-top safe-bottom">
      <HeartMark size={72} animate />
      <h1 className="font-serif font-bold text-2xl text-dark mt-6 text-center">
        Esperando a tu persona 💕
      </h1>
      <p className="text-sm text-dark/60 mt-2 text-center text-balance">
        Compartí este código con tu pareja para que se una.
      </p>

      <div className="bg-gradient-blush rounded-4xl py-6 px-10 mt-8">
        <div className="font-serif font-bold text-4xl tracking-[0.25em] text-primary">
          {code || '------'}
        </div>
      </div>

      <div className="flex gap-2 w-full mt-6">
        <Button variant="secondary" fullWidth onClick={copy}><Copy size={16} /> Copiar</Button>
        <Button variant="primary" fullWidth onClick={share}><Share2 size={16} /> Compartir</Button>
      </div>

      <button onClick={logout} className="mt-8 inline-flex items-center gap-1 text-sm text-dark/50 hover:text-dark">
        <LogOut size={14} /> Cerrar sesión
      </button>
    </div>
  )
}
