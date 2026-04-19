import type { MoodKey } from '@/types/database'

interface Props {
  mood: MoodKey
  size?: number
  className?: string
}

/** Ícono SVG propio por mood. Sin emojis. */
export function MoodIcon({ mood, size = 24, className }: Props) {
  const s = size
  const common = {
    width: s,
    height: s,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
  }

  switch (mood) {
    case 'enamorado':
      // Dos corazoncitos entrelazados
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M8.5 5C6.5 5 5 6.5 5 8.5c0 3 3.5 5.5 4.5 6.2.3.2.7.2 1 0 1-.7 4.5-3.2 4.5-6.2C15 6.5 13.5 5 11.5 5c-.9 0-1.7.4-2 1-.3-.6-1.1-1-2-1z" opacity=".55"/>
          <path d="M14.5 9c-2 0-3.5 1.5-3.5 3.5 0 3 3.5 5.5 4.5 6.2.3.2.7.2 1 0 1-.7 4.5-3.2 4.5-6.2 0-2-1.5-3.5-3.5-3.5-.9 0-1.7.4-2 1-.3-.6-1.1-1-2-1z"/>
        </svg>
      )
    case 'feliz':
      // Solecito con rayos
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="4" fill="currentColor" stroke="none" />
          <line x1="12" y1="2.5" x2="12" y2="5" />
          <line x1="12" y1="19" x2="12" y2="21.5" />
          <line x1="2.5" y1="12" x2="5" y2="12" />
          <line x1="19" y1="12" x2="21.5" y2="12" />
          <line x1="5.2" y1="5.2" x2="7" y2="7" />
          <line x1="17" y1="17" x2="18.8" y2="18.8" />
          <line x1="18.8" y1="5.2" x2="17" y2="7" />
          <line x1="7" y1="17" x2="5.2" y2="18.8" />
        </svg>
      )
    case 'tranquilo':
      // Tres ondas suaves
      return (
        <svg {...common}>
          <path d="M3 8c2 0 2.5-2 4.5-2S10 8 12 8s2.5-2 4.5-2 2.5 2 4.5 2" />
          <path d="M3 13c2 0 2.5-2 4.5-2S10 13 12 13s2.5-2 4.5-2 2.5 2 4.5 2" opacity=".55" />
          <path d="M3 18c2 0 2.5-2 4.5-2s2.5 2 4.5 2 2.5-2 4.5-2 2.5 2 4.5 2" opacity=".3" />
        </svg>
      )
    case 'extrano':
      // Medio corazón (te extraño)
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M12 20.5S3 14.5 3 9a5 5 0 0 1 9-3v14.5z" />
          <path d="M12 6a5 5 0 0 1 9 3c0 5.5-9 11.5-9 11.5" opacity=".35" />
          <path d="M12 6v14.5" stroke="currentColor" strokeWidth="1.5" opacity=".6" />
        </svg>
      )
    case 'horny':
      // Llamita estilizada (forma orgánica)
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M12 3c0 2-3 3.5-3 7 0 1.2.6 2.3 1.5 2.9-.7-.9-.5-2.4.5-3.2.5 2.3 2.5 2.5 2.5 4.8 0 1.2-.8 2.3-2 2.5 2-.1 4-1.5 4.5-3.5.6-2.5-1.2-4.1-2-5.5-1.1-2-1.5-3.5-2-5z" />
          <path d="M9 15.5c-1 .5-2 2-2 3.5 0 1.7 1.8 3 4 3 2.5 0 5-1.5 5-3.5 0-1.5-1-2.5-2-3" opacity=".5" />
        </svg>
      )
    case 'ocupado':
      // Reloj simple
      return (
        <svg {...common}>
          <circle cx="12" cy="12" r="8.5" fill="currentColor" stroke="none" opacity=".18" />
          <circle cx="12" cy="12" r="8.5" />
          <polyline points="12,7 12,12 15.5,14" />
        </svg>
      )
    case 'cansado':
      // Luna creciente
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z" />
          <circle cx="16" cy="7" r="1" opacity=".6" />
          <circle cx="19" cy="10" r=".7" opacity=".6" />
        </svg>
      )
    case 'pensativo':
      // Nubecita de pensamiento
      return (
        <svg {...common} fill="currentColor" stroke="none">
          <path d="M8 9.5a3.5 3.5 0 0 1 6.5-1.8A4 4 0 1 1 16 16H8.5A3.5 3.5 0 0 1 8 9.5z" />
          <circle cx="6" cy="18" r="1.2" opacity=".55" />
          <circle cx="4" cy="20.5" r=".8" opacity=".4" />
        </svg>
      )
  }
}
