import { useState } from 'react'
import toast from 'react-hot-toast'
import { motion } from 'framer-motion'
import { MOODS } from '../types'
import { useChangeMood } from '../hooks'
import { MoodIcon } from '@/shared/ui/MoodIcon'
import { Button } from '@/shared/ui/Button'
import { Textarea } from '@/shared/ui/Input'
import { cn } from '@/shared/lib/utils'
import { toHumanError } from '@/shared/lib/async'
import type { MoodKey } from '@/types/database'

interface Props {
  currentMood?: MoodKey | null
  currentMessage?: string | null
  onDone?: () => void
}

export function MoodPicker({ currentMood, currentMessage, onDone }: Props) {
  const [mood, setMood] = useState<MoodKey | null>(currentMood ?? null)
  const [message, setMessage] = useState(currentMessage ?? '')
  const change = useChangeMood()

  async function save() {
    if (!mood) return toast.error('Elegí cómo te sientes primero')
    try {
      await change.mutateAsync({ mood, message: message.trim() || null })
      toast.success('Listo 💕')
      onDone?.()
    } catch (err) {
      console.error('mood error', err)
      toast.error(toHumanError(err))
    }
  }

  return (
    <div className="space-y-6 pb-2">
      <div className="grid grid-cols-4 gap-3 sm:gap-4">
        {MOODS.map((m) => {
          const active = mood === m.key
          return (
            <motion.button
              key={m.key}
              type="button"
              onClick={() => setMood(m.key)}
              whileTap={{ scale: 0.92 }}
              className={cn(
                'flex flex-col items-center gap-1.5 p-2 pb-2.5 rounded-3xl transition-all',
                active ? 'bg-white shadow-soft ring-2 ring-primary/30' : 'hover:bg-white/60',
              )}
            >
              <div
                className="w-14 h-14 rounded-full flex items-center justify-center ring-2 ring-white shadow-soft"
                style={{ backgroundColor: m.bg, color: m.color }}
              >
                <MoodIcon mood={m.key} size={26} />
              </div>
              <span className="text-[11px] font-sans text-dark/80 truncate max-w-[70px]">{m.label}</span>
            </motion.button>
          )
        })}
      </div>

      <div className="space-y-1">
        <Textarea
          label="Un mensaje corto (opcional)"
          value={message}
          onChange={(e) => setMessage(e.target.value.slice(0, 140))}
          rows={2}
          placeholder="Cómo me siento hoy…"
          maxLength={140}
        />
        <div className="text-right text-[11px] text-dark/40 px-1">{message.length}/140</div>
      </div>

      <div className="pt-2">
        <Button fullWidth onClick={save} loading={change.isPending}>Guardar 💕</Button>
      </div>
    </div>
  )
}
