import { useState } from 'react'
import toast from 'react-hot-toast'
import { Mail, Lock, User, KeyRound } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useSignUp, useJoinCouple, useValidateCode } from '../hooks'
import { toHumanError } from '@/shared/lib/async'
import { supabase } from '@/shared/lib/supabase'

export function JoinForm({ onBack, onDone }: { onBack?: () => void; onDone: () => void }) {
  const [step, setStep] = useState<'code' | 'account'>('code')
  const [code, setCode] = useState('')
  const [codeInfo, setCodeInfo] = useState<{ user1_name?: string } | null>(null)

  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [myName, setMyName]     = useState('')

  const validate = useValidateCode()
  const signUp = useSignUp()
  const join = useJoinCouple()

  async function checkCode(e: React.FormEvent) {
    e.preventDefault()
    try {
      const res = await validate.mutateAsync(code)
      if (!res.valid) return toast.error('Código no válido. Pedíle a tu pareja que te lo reenvíe.')
      if (res.already_full) return toast.error('Esa pareja ya tiene dos miembros.')
      setCodeInfo({ user1_name: res.user1_name })
      setStep('account')
    } catch (err) {
      console.error('validate error', err)
      toast.error(toHumanError(err))
    }
  }

  async function createAccount(e: React.FormEvent) {
    e.preventDefault()
    try {
      const { session } = await signUp.mutateAsync({ email, password, displayName: myName })
      if (!session) {
        const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password })
        if (error) throw error
      }
      await join.mutateAsync({ code, myName })
      toast.success('¡Se unieron! 💕')
      onDone()
    } catch (err) {
      console.error('join error', err)
      toast.error(toHumanError(err))
    }
  }

  if (step === 'code') {
    return (
      <form onSubmit={checkCode} className="space-y-4">
        <div className="text-center mb-2">
          <p className="text-sm text-dark/70">Pegá el código que te compartió tu pareja.</p>
        </div>
        <Input
          label="Código de pareja"
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase())}
          maxLength={6}
          required
          icon={<KeyRound size={18} />}
          placeholder="ABC123"
          className="uppercase tracking-[0.25em] font-serif text-center text-lg"
        />
        <div className="pt-2 space-y-3">
          <Button type="submit" loading={validate.isPending} fullWidth>Continuar</Button>
          {onBack && (
            <Button type="button" variant="ghost" fullWidth onClick={onBack}>Volver</Button>
          )}
        </div>
      </form>
    )
  }

  const loading = signUp.isPending || join.isPending

  return (
    <form onSubmit={createAccount} className="space-y-4">
      {codeInfo?.user1_name && (
        <div className="bg-gradient-blush rounded-3xl p-4 text-center">
          <p className="text-sm text-dark/80">
            <strong className="font-serif">{codeInfo.user1_name}</strong> te está esperando 💕
          </p>
        </div>
      )}
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        required autoComplete="email" icon={<Mail size={18} />} />
      <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
        required autoComplete="new-password" minLength={6} icon={<Lock size={18} />} />
      <Input label="Tu nombre" value={myName} onChange={(e) => setMyName(e.target.value)}
        required icon={<User size={18} />} placeholder="Cómo te llamo yo" />
      <div className="pt-2 space-y-3">
        <Button type="submit" loading={loading} fullWidth>Unirme 💕</Button>
        <Button type="button" variant="ghost" fullWidth onClick={() => setStep('code')}>
          Volver al código
        </Button>
      </div>
    </form>
  )
}
