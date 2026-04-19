import { ReactNode } from 'react'
import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { cn } from '@/shared/lib/utils'

interface HeaderProps {
  title?: string
  back?: boolean
  action?: ReactNode
  className?: string
}

export function Header({ title, back, action, className }: HeaderProps) {
  const navigate = useNavigate()
  return (
    <header className={cn('px-4 pt-6 pb-3 sm:pt-10 flex items-center gap-2 safe-top', className)}>
      {back && (
        <button
          onClick={() => navigate(-1)}
          className="p-2 -ml-2 rounded-full hover:bg-primary/10 text-dark/70"
          aria-label="Volver"
        >
          <ChevronLeft size={24} />
        </button>
      )}
      {title && (
        <h1 className="font-serif font-bold text-xl text-dark truncate flex-1">{title}</h1>
      )}
      {!title && <span className="flex-1" />}
      {action && <div className="flex items-center">{action}</div>}
    </header>
  )
}
