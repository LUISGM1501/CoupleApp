import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { HeartMark } from '@/shared/ui/HeartMark'
import { Button } from '@/shared/ui/Button'
import { LoginForm } from '@/features/auth/components/LoginForm'
import { RegisterForm } from '@/features/auth/components/RegisterForm'
import { JoinForm } from '@/features/auth/components/JoinForm'
import { useNavigate } from 'react-router-dom'

type Screen = 'landing' | 'login' | 'register' | 'join'

export default function Login() {
  const [screen, setScreen] = useState<Screen>('landing')
  const navigate = useNavigate()
  const done = () => navigate('/', { replace: true })

  return (
    <div className="min-h-screen relative flex items-center justify-center p-4 sm:p-8 overflow-hidden">
      {/* Decoración ambiental */}
      <div
        className="absolute -top-32 -right-32 w-[480px] h-[480px] rounded-full blur-3xl opacity-50 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ef7680, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-40 -left-24 w-[420px] h-[420px] rounded-full blur-3xl opacity-45 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #c3a9d5, transparent 70%)' }}
      />
      <FloatingHearts />

      {/* Card contenedor principal */}
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="relative w-full max-w-md bg-white/80 backdrop-blur-xl rounded-5xl shadow-card-hover border border-white overflow-hidden"
      >
        {/* Banda decorativa arriba */}
        <div className="h-24 bg-gradient-romantic relative">
          <div className="absolute inset-0 flex items-center justify-center">
            <HeartMark size={72} className="!bg-white/25 ring-4 ring-white/30" animate />
          </div>
        </div>

        <div className="px-6 sm:px-8 pt-14 pb-8 safe-bottom">
          <div className="text-center mb-7">
            <h1 className="font-serif font-bold text-3xl sm:text-4xl text-dark">Nosotros</h1>
            <p className="font-sans text-sm text-dark/55 mt-2 text-balance">
              Un lugar pequeñito, solo para los dos 💕
            </p>
          </div>

          <AnimatePresence mode="wait">
            <motion.div
              key={screen}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
            >
              {screen === 'landing' && (
                <div className="space-y-3">
                  <Button fullWidth size="lg" onClick={() => setScreen('register')}>
                    Empezamos juntos 💕
                  </Button>
                  <Button fullWidth size="lg" variant="secondary" onClick={() => setScreen('join')}>
                    Tengo un código
                  </Button>
                  <Button fullWidth size="lg" variant="ghost" onClick={() => setScreen('login')}>
                    Ya tengo cuenta
                  </Button>
                </div>
              )}
              {screen === 'login'    && <LoginForm    onBack={() => setScreen('landing')} />}
              {screen === 'register' && <RegisterForm onBack={() => setScreen('landing')} onDone={done} />}
              {screen === 'join'     && <JoinForm     onBack={() => setScreen('landing')} onDone={done} />}
            </motion.div>
          </AnimatePresence>
        </div>

        <div className="px-6 pb-6 text-center">
          <p className="text-[11px] text-dark/40">
            Hecho con cariño, para nosotros dos.
          </p>
        </div>
      </motion.div>
    </div>
  )
}

/** Corazoncitos flotantes de decoración */
function FloatingHearts() {
  const hearts = [
    { left: '8%',  top: '15%', size: 18, delay: 0,   dur: 7 },
    { left: '90%', top: '22%', size: 14, delay: 1.5, dur: 6.5 },
    { left: '12%', top: '78%', size: 22, delay: 0.8, dur: 8 },
    { left: '82%', top: '72%', size: 16, delay: 2.2, dur: 7.2 },
    { left: '50%', top: '10%', size: 12, delay: 3,   dur: 6 },
  ]
  return (
    <>
      {hearts.map((h, i) => (
        <motion.svg
          key={i}
          viewBox="0 0 24 24"
          width={h.size}
          height={h.size}
          fill="#e05763"
          className="absolute pointer-events-none opacity-35"
          style={{ left: h.left, top: h.top }}
          animate={{ y: [0, -14, 0], opacity: [0.2, 0.5, 0.2] }}
          transition={{ duration: h.dur, delay: h.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M12 21s-7.5-4.5-9.5-9.5C1 7.5 4 4.5 7.5 4.5c2 0 3.5 1 4.5 2.5 1-1.5 2.5-2.5 4.5-2.5 3.5 0 6.5 3 5 7C19.5 16.5 12 21 12 21z" />
        </motion.svg>
      ))}
    </>
  )
}
