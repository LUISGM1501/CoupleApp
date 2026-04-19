// Tokens replicados en TS para uso desde JS (framer-motion, inline styles, canvas, etc.)
export const tokens = {
  colors: {
    primary: '#e05763',
    primaryDark: '#c83e4b',
    blush: '#d65638',
    secondary: '#c3a9d5',
    accent: '#efc178',
    cream: '#FFF8F5',
    dark: '#2B1E22',
  },
  mood: {
    enamorado: '#d94560',
    feliz:     '#e8a045',
    tranquilo: '#8fb4a8',
    extrano:   '#c073a5',
    horny:     '#b91c4f',
    ocupado:   '#7d8ca8',
    cansado:   '#a080c4',
    pensativo: '#6d9cc4',
  } as const,
  motion: {
    fast:   0.18,
    base:   0.24,
    slow:   0.32,
  },
}

export type MoodKey = keyof typeof tokens.mood
