// Detección de plataforma. Se mantiene ligero: no importamos @capacitor/core en el bundle web
// a menos que realmente estemos corriendo nativo.

declare global {
  interface Window {
    Capacitor?: { isNativePlatform?: () => boolean; getPlatform?: () => string }
  }
}

export function isNative(): boolean {
  return !!(typeof window !== 'undefined' && window.Capacitor?.isNativePlatform?.())
}

export function platformName(): 'web' | 'ios' | 'android' {
  const p = window.Capacitor?.getPlatform?.() || 'web'
  return p as 'web' | 'ios' | 'android'
}

export function isIOSWeb(): boolean {
  const ua = navigator.userAgent
  return /iPad|iPhone|iPod/.test(ua) && !isNative()
}

export function isStandaloneWeb(): boolean {
  return (
    window.matchMedia?.('(display-mode: standalone)').matches ||
    (navigator as unknown as { standalone?: boolean }).standalone === true
  )
}
