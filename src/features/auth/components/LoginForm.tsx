import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Mail, Lock } from 'lucide-react'
import { Button } from '@/shared/ui/Button'
import { Input } from '@/shared/ui/Input'
import { useSignIn } from '../hooks'
import { toHumanError } from '@/shared/lib/async'

export function LoginForm({ onBack }: { onBack?: () => void }) {
  const signIn = useSignIn()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    try {
      await signIn.mutateAsync({ email, password })
      navigate('/', { replace: true })
    } catch (err) {
      console.error('login error', err)
      toast.error(toHumanError(err))
    }
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
        required autoComplete="email" icon={<Mail size={18} />} placeholder="tu@email.com" />
      <Input label="Contraseña" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
        required autoComplete="current-password" icon={<Lock size={18} />} placeholder="••••••••" />
      <div className="pt-2 space-y-3">
        <Button type="submit" loading={signIn.isPending} fullWidth>Entrar</Button>
        {onBack && (
          <Button type="button" variant="ghost" fullWidth onClick={onBack}>Volver</Button>
        )}
      </div>
    </form>
  )
}
