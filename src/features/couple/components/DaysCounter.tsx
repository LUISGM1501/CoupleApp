import { motion } from 'framer-motion'
import { daysTogether } from '@/shared/lib/dates'
import { Heart } from 'lucide-react'

export function DaysCounter({ startDate }: { startDate: string }) {
  const days = daysTogether(startDate)
  return (
    <motion.div
      initial={{ scale: 0.96, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="bg-gradient-romantic rounded-5xl p-8 text-center text-white shadow-card"
    >
      <div className="flex items-center justify-center gap-2 mb-1 opacity-90">
        <Heart size={16} className="fill-white" />
        <span className="text-xs uppercase tracking-widest font-sans">Juntos</span>
        <Heart size={16} className="fill-white" />
      </div>
      <div className="font-serif font-bold text-6xl tabular-nums">{days.toLocaleString('es')}</div>
      <div className="font-sans text-sm opacity-90 mt-1">días de nosotros</div>
    </motion.div>
  )
}
