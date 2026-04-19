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
    <div className="min-h-screen relative overflow-hidden lg:grid lg:grid-cols-2">
      {/* Blobs ambientales globales */}
      <div
        className="absolute -top-32 -right-32 w-[560px] h-[560px] rounded-full blur-3xl opacity-45 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #ef7680, transparent 70%)' }}
      />
      <div
        className="absolute -bottom-40 -left-24 w-[480px] h-[480px] rounded-full blur-3xl opacity-40 pointer-events-none"
        style={{ background: 'radial-gradient(circle, #c3a9d5, transparent 70%)' }}
      />
      <FloatingHearts />

      {/* Panel izquierdo (solo desktop) */}
      <HeroPanel />

      {/* Panel derecho — formulario */}
      <div className="relative flex items-center justify-center p-4 sm:p-8 min-h-screen">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
          className="relative w-full max-w-md bg-white/85 backdrop-blur-xl rounded-5xl shadow-card-hover border border-white overflow-hidden"
        >
          {/* Banda decorativa (solo mobile: reemplaza al hero) */}
          <div className="h-24 bg-gradient-romantic relative lg:hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <HeartMark size={72} className="!bg-white/25 ring-4 ring-white/30" animate />
            </div>
          </div>

          <div className="px-6 sm:px-10 pt-12 lg:pt-10 pb-8 safe-bottom">
            <div className="text-center lg:text-left mb-7">
              <h1 className="font-serif font-bold text-3xl sm:text-4xl text-dark">
                {screen === 'landing'  ? 'Nosotros' :
                 screen === 'login'    ? 'Bienvenidos de nuevo' :
                 screen === 'register' ? 'Empezamos aquí' :
                                         'Un código, y juntos'}
              </h1>
              <p className="font-sans text-sm text-dark/55 mt-2 text-balance">
                {screen === 'landing'  ? 'Un lugar pequeñito, solo para los dos 💕' :
                 screen === 'login'    ? 'Qué lindo volver a vernos.' :
                 screen === 'register' ? 'Contame un poquito de nosotros dos.' :
                                         'Pegá el código que te mandó tu persona.'}
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
    </div>
  )
}

/** Panel izquierdo visible solo en lg+: ilustración con dos corazones */
function HeroPanel() {
  return (
    <aside className="hidden lg:flex relative items-center justify-center p-12 overflow-hidden bg-gradient-romantic">
      {/* Textura de círculos suaves */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-10 left-16 w-48 h-48 rounded-full border-2 border-white" />
        <div className="absolute bottom-24 right-10 w-72 h-72 rounded-full border-2 border-white" />
        <div className="absolute top-1/2 left-1/3 w-32 h-32 rounded-full border-2 border-white" />
      </div>

      <div className="relative text-center text-white max-w-md">
        {/* Dos corazones entrelazados, grande */}
        <svg viewBox="0 0 200 120" className="w-56 h-36 mx-auto drop-shadow-2xl" aria-hidden>
          <defs>
            <linearGradient id="lh1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity=".95" />
              <stop offset="100%" stopColor="#fff" stopOpacity=".75" />
            </linearGradient>
            <linearGradient id="lh2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity=".6" />
              <stop offset="100%" stopColor="#fff" stopOpacity=".4" />
            </linearGradient>
          </defs>
          <path fill="url(#lh2)" d="M72 108 C 20 80, 4 52, 18 30 C 32 8, 64 10, 72 34 C 80 10, 112 8, 126 30 C 140 52, 124 80, 72 108 Z" />
          <path fill="url(#lh1)" d="M128 108 C 76 80, 60 52, 74 30 C 88 8, 120 10, 128 34 C 136 10, 168 8, 182 30 C 196 52, 180 80, 128 108 Z" />
        </svg>

        <h2 className="font-serif font-bold text-5xl mt-6">Nosotros</h2>
        <p className="text-white/85 mt-4 text-lg leading-relaxed">
          Guardemos lo bonito de nuestros días en un lugar que es solo nuestro.
        </p>

        <div className="mt-10 grid grid-cols-3 gap-6 text-left">
          <FeatureDot title="Recuerdos" subtitle="Fotos con historia" />
          <FeatureDot title="Cómo nos sentimos" subtitle="En tiempo real" />
          <FeatureDot title="Días juntos" subtitle="Cada uno cuenta" />
        </div>
      </div>
    </aside>
  )
}

function FeatureDot({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <div className="w-2 h-2 rounded-full bg-white mb-2" />
      <div className="font-serif font-semibold text-sm">{title}</div>
      <div className="text-xs text-white/70 leading-snug mt-0.5">{subtitle}</div>
    </div>
  )
}

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
          className="absolute pointer-events-none opacity-30 lg:hidden"
          style={{ left: h.left, top: h.top }}
          animate={{ y: [0, -14, 0], opacity: [0.2, 0.45, 0.2] }}
          transition={{ duration: h.dur, delay: h.delay, repeat: Infinity, ease: 'easeInOut' }}
        >
          <path d="M12 21s-7.5-4.5-9.5-9.5C1 7.5 4 4.5 7.5 4.5c2 0 3.5 1 4.5 2.5 1-1.5 2.5-2.5 4.5-2.5 3.5 0 6.5 3 5 7C19.5 16.5 12 21 12 21z" />
        </motion.svg>
      ))}
    </>
  )
}
