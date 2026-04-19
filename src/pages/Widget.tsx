import { useMyProfile } from '@/features/auth/hooks'
import { useCouple } from '@/features/couple/hooks'
import { daysTogether } from '@/shared/lib/dates'

/**
 * Vista para iframe embebible. Corazones entrelazados + días juntos.
 * URL: /widget  (sin Shell, ocupa toda la pantalla, fondo transparente-compatible)
 */
export default function Widget() {
  const { data: me } = useMyProfile()
  const { couple } = useCouple()
  const days = couple.data ? daysTogether(couple.data.start_date) : null

  return (
    <div className="min-h-full flex items-center justify-center p-6">
      <div className="bg-gradient-romantic rounded-5xl p-8 sm:p-10 shadow-card-hover w-full max-w-sm flex flex-col items-center">

        {/* Dos corazones entrelazados */}
        <svg
          viewBox="0 0 200 120"
          className="w-40 h-24 sm:w-48 sm:h-28 drop-shadow-lg"
          aria-hidden
        >
          <defs>
            <linearGradient id="h1" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity=".95" />
              <stop offset="100%" stopColor="#fff" stopOpacity=".75" />
            </linearGradient>
            <linearGradient id="h2" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#fff" stopOpacity=".65" />
              <stop offset="100%" stopColor="#fff" stopOpacity=".45" />
            </linearGradient>
          </defs>
          {/* corazón izquierdo (atrás, más grande) */}
          <path
            fill="url(#h2)"
            d="M72 108 C 20 80, 4 52, 18 30 C 32 8, 64 10, 72 34 C 80 10, 112 8, 126 30 C 140 52, 124 80, 72 108 Z"
          />
          {/* corazón derecho (adelante) */}
          <path
            fill="url(#h1)"
            d="M128 108 C 76 80, 60 52, 74 30 C 88 8, 120 10, 128 34 C 136 10, 168 8, 182 30 C 196 52, 180 80, 128 108 Z"
          />
        </svg>

        <div className="text-center mt-2">
          <div className="font-serif font-bold text-6xl sm:text-7xl text-white tabular-nums leading-none">
            {days?.toLocaleString('es') ?? '—'}
          </div>
          <div className="text-[11px] sm:text-xs text-white/85 uppercase tracking-[0.3em] mt-3">
            días juntos
          </div>
        </div>

        {me && couple.data && (
          <div className="mt-6 pt-5 border-t border-white/25 w-full text-center">
            <div className="font-serif text-white/95 text-sm">
              {couple.data.user1_name} &amp; {couple.data.user2_name}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
