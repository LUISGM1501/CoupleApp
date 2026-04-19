import { useState } from 'react'
import toast from 'react-hot-toast'
import { Mail, Lock, User, Users, Calendar } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { Modal } from '@/shared/ui/Modal'
import { useSignUp, useCreateCouple } from '../hooks'
import { toHumanError } from '@/shared/lib/async'
import { supabase } from '@/shared/lib/supabase'
import { todayISO } from '@/shared/lib/dates'
import { Share2, Copy } from 'lucide-react'

export function RegisterForm({ onBack, onDone }: { onBack?: () => void; onDone: () => void }) {
  const signUp = useSignUp()
  const createCouple = useCreateCouple()
  const [email, setEmail]           = useState('')
  const [password, setPassword]     = useState('')
  const [myName, setMyName]         = useState('')
  const [partnerName, setPartnerName] = useState('')
  const [startDate, setStartDate]   = useState(todayISO())
  const [createdCode, setCreatedCode] = useState<string | null>(null)

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    try {
      const { session } = await signUp.mutateAsync({ email, password, displayName: myName })
      // En Supabase con "confirm email" off, session viene en el signUp.
      // Si la confirmación está activa, autenticamos manualmente:
      if (!session) {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (error) throw error
      }
      const res = await createCouple.mutateAsync({
        user1Name: myName, user2Name: partnerName, startDate,
      })
      setCreatedCode(res.couple_code)
    } catch (err) {
      console.error('register error', err)
      toast.error(toHumanError(err))
    }
  }

  async function shareCode() {
    if (!createdCode) return
    const text = `Nuestro código de pareja en Nosotros: ${createdCode} 💕`
    try {
      if (navigator.share) {
        await navigator.share({ title: 'Nosotros 💕', text })
      } else {
        await navigator.clipboard.writeText(createdCode)
        toast.success('Código copiado')
      }
    } catch (err) {
      console.error('share error', err)
    }
  }

  async function copyCode() {
    if (!createdCode) return
    try {
      await navigator.clipboard.writeText(createdCode)
      toast.success('Copiado')
    } catch (err) {
      console.error('copy error', err)
      toast.error('No se pudo copiar')
    }
  }

  const loading = signUp.isPending || createCouple.isPending

  return (
    <>
      <form onSubmit={submit} className="space-y-4">
        <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
          required autoComplete="email" icon={<Mail size={18} />} />
        <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
          required autoComplete="new-password" minLength={6} icon={<Lock size={18} />} />
        <Input label="Tu nombre" value={myName} onChange={(e) => setMyName(e.target.value)}
          required icon={<User size={18} />} placeholder="Cómo te llamo yo" />
        <Input label="Nombre de tu pareja" value={partnerName} onChange={(e) => setPartnerName(e.target.value)}
          required icon={<Users size={18} />} placeholder="Cómo llamas a tu persona" />
        <Input label="Fecha en que empezaron" type="date" value={startDate}
          onChange={(e) => setStartDate(e.target.value)} required icon={<Calendar size={18} />}
          max={todayISO()} />
        <div className="pt-2 space-y-3">
          <Button type="submit" loading={loading} fullWidth>Empezar juntos 💕</Button>
          {onBack && (
            <Button type="button" variant="ghost" fullWidth onClick={onBack}>Volver</Button>
          )}
        </div>
      </form>

      <Modal open={!!createdCode} onClose={onDone} size="sm" hideClose>
        <div className="text-center py-2">
          <h3 className="font-serif font-bold text-2xl text-dark mb-2">¡Listo! 💕</h3>
          <p className="text-sm text-dark/70 mb-4">
            Compartí este código con tu pareja para que se una:
          </p>
          <div className="bg-gradient-blush rounded-3xl py-6 mb-4">
            <div className="font-serif font-bold text-4xl tracking-[0.25em] text-primary">
              {createdCode}
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            <Button variant="secondary" fullWidth onClick={copyCode}>
              <Copy size={16} /> Copiar
            </Button>
            <Button variant="primary" fullWidth onClick={shareCode}>
              <Share2 size={16} /> Compartir
            </Button>
          </div>
          <Button variant="ghost" fullWidth onClick={onDone}>Listo, ir al inicio</Button>
        </div>
      </Modal>
    </>
  )
}
