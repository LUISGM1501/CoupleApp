import type { MoodKey } from '@/types/database'

export interface MoodDef {
  key: MoodKey
  label: string
  color: string
  bg: string // fondo pastel para la card
}

export const MOODS: MoodDef[] = [
  { key: 'enamorado', label: 'Enamorado',  color: '#d94560', bg: '#ffe4ea' },
  { key: 'feliz',     label: 'Feliz',      color: '#e8a045', bg: '#fdecd3' },
  { key: 'tranquilo', label: 'Tranquilo',  color: '#8fb4a8', bg: '#e1efe9' },
  { key: 'extrano',   label: 'Te extraño', color: '#c073a5', bg: '#f5e1ee' },
  { key: 'horny',     label: 'Horny',      color: '#b91c4f', bg: '#fcd9e4' },
  { key: 'ocupado',   label: 'Ocupado',    color: '#7d8ca8', bg: '#e0e6ef' },
  { key: 'cansado',   label: 'Cansado',    color: '#a080c4', bg: '#ebe3f5' },
  { key: 'pensativo', label: 'Pensativo',  color: '#6d9cc4', bg: '#dceaf5' },
]

export function moodDef(key: MoodKey | null | undefined): MoodDef | null {
  if (!key) return null
  return MOODS.find((m) => m.key === key) ?? null
}
