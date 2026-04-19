import { ReactNode } from 'react'
import { NavLink } from 'react-router-dom'
import { Home, Images, User } from 'lucide-react'
import { HeartMark } from './HeartMark'
import { cn } from '@/shared/lib/utils'
import { Avatar } from './Avatar'
import { useMyProfile } from '@/features/auth/hooks'
import { useCouple } from '@/features/couple/hooks'
import { daysTogether } from '@/shared/lib/dates'
import { useMemo } from 'react'

const tabs = [
  { to: '/',          label: 'Inicio',    icon: Home,   end: true },
  { to: '/recuerdos', label: 'Recuerdos', icon: Images, end: false },
  { to: '/perfil',    label: 'Perfil',    icon: User,   end: false },
] as const

export function Shell({ children }: { children: ReactNode }) {
  return (
    <div className="lg:grid lg:grid-cols-[300px_1fr] min-h-screen">
      <DesktopSideNav />
      <main className="relative min-w-0">
        {/* Decoración ambiental en desktop */}
        <div className="hidden lg:block pointer-events-none absolute -top-20 -right-20 w-96 h-96 rounded-full blur-3xl opacity-30"
             style={{ background: 'radial-gradient(circle, #ef7680, transparent 70%)' }} />
        <div className="hidden lg:block pointer-events-none absolute bottom-40 -left-10 w-72 h-72 rounded-full blur-3xl opacity-25"
             style={{ background: 'radial-gradient(circle, #c3a9d5, transparent 70%)' }} />
        <div className="relative">
          {children}
        </div>
      </main>
      <MobileBottomNav />
    </div>
  )
}

function DesktopSideNav() {
  const { data: me } = useMyProfile()
  const { couple, members } = useCouple()
  const partner = useMemo(
    () => members.data?.find((m) => m.id !== me?.id) ?? null,
    [members.data, me?.id],
  )
  const days = couple.data ? daysTogether(couple.data.start_date) : null

  return (
    <aside className="hidden lg:flex lg:flex-col lg:sticky lg:top-0 lg:h-screen bg-white/70 backdrop-blur-sm border-r border-primary/10 p-6">
      <div className="flex items-center gap-3 mb-10">
        <HeartMark size={44} />
        <div>
          <div className="font-serif font-bold text-xl text-dark leading-tight">Nosotros</div>
          <div className="text-[11px] text-dark/50">solo para los dos</div>
        </div>
      </div>

      {me && couple.data && (
        <div className="bg-gradient-blush rounded-3xl p-4 mb-6 shadow-card">
          <div className="flex items-center gap-3 mb-3">
            <div className="flex -space-x-2">
              <Avatar src={me.photo_url} name={me.display_name} size={40} ring />
              <Avatar src={partner?.photo_url} name={partner?.display_name} size={40} ring />
            </div>
            <div className="flex-1 min-w-0">
              <div className="font-serif font-semibold text-sm text-dark truncate">
                {couple.data.user1_name} &amp; {couple.data.user2_name}
              </div>
              <div className="text-[11px] text-dark/55">{days?.toLocaleString('es')} días juntos</div>
            </div>
          </div>
        </div>
      )}

      <nav className="space-y-1">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              cn(
                'flex items-center gap-3 px-4 py-3 rounded-2xl font-sans font-medium transition-colors',
                isActive
                  ? 'bg-gradient-warm text-white shadow-soft'
                  : 'text-dark/70 hover:bg-primary/5 hover:text-dark',
              )
            }
          >
            <Icon size={20} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="mt-auto text-center">
        <p className="text-[11px] text-dark/40 leading-relaxed">
          Hecho con cariño,<br />para nosotros dos 💕
        </p>
      </div>
    </aside>
  )
}

function MobileBottomNav() {
  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/90 backdrop-blur-md border-t border-primary/10 safe-bottom">
      <ul className="max-w-md mx-auto flex justify-around py-1.5 px-2">
        {tabs.map(({ to, label, icon: Icon, end }) => (
          <li key={to}>
            <NavLink
              to={to}
              end={end}
              className={({ isActive }) =>
                cn(
                  'relative flex flex-col items-center gap-0.5 px-5 py-2 rounded-2xl transition-colors',
                  isActive ? 'text-primary' : 'text-dark/50 hover:text-dark/80',
                )
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute -top-1.5 left-1/2 -translate-x-1/2 w-8 h-1 bg-primary rounded-full" />
                  )}
                  <Icon size={22} strokeWidth={isActive ? 2.4 : 1.8} />
                  <span className="text-[11px] font-sans font-medium">{label}</span>
                </>
              )}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  )
}
