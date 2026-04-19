import { NavLink } from 'react-router-dom'
import { Home, Images, User } from 'lucide-react'
import { cn } from '@/shared/lib/utils'

const tabs = [
  { to: '/', label: 'Inicio',    icon: Home,   end: true },
  { to: '/recuerdos', label: 'Recuerdos', icon: Images, end: false },
  { to: '/perfil', label: 'Perfil',    icon: User,   end: false },
] as const

export function BottomNav() {
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40 bg-white/85 backdrop-blur-md border-t border-primary/10 safe-bottom">
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
