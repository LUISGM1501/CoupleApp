import { isNative } from './platform'

const FLAG_KEY = 'nosotros-notif-enabled'

export function notificationsEnabled(): boolean {
  return localStorage.getItem(FLAG_KEY) === '1'
}

export function setNotificationsEnabled(v: boolean) {
  localStorage.setItem(FLAG_KEY, v ? '1' : '0')
}

export async function requestPermission(): Promise<boolean> {
  if (isNative()) {
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications')
      const res = await LocalNotifications.requestPermissions()
      const ok = res.display === 'granted'
      setNotificationsEnabled(ok)
      return ok
    } catch (e) {
      console.error('native notif perm error', e)
      return false
    }
  }
  if (!('Notification' in window)) return false
  if (Notification.permission === 'granted') {
    setNotificationsEnabled(true)
    return true
  }
  const p = await Notification.requestPermission()
  const ok = p === 'granted'
  setNotificationsEnabled(ok)
  return ok
}

export async function notify(title: string, body: string) {
  if (!notificationsEnabled()) return
  if (document.visibilityState === 'visible') return // solo si app no está abierta en foco

  if (isNative()) {
    try {
      const { LocalNotifications } = await import('@capacitor/local-notifications')
      await LocalNotifications.schedule({
        notifications: [
          {
            id: Date.now() % 2_000_000_000,
            title,
            body,
            schedule: { at: new Date(Date.now() + 500) },
          },
        ],
      })
    } catch (e) {
      console.error('native notify error', e)
    }
    return
  }

  try {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.svg' })
    }
  } catch (e) {
    console.error('web notify error', e)
  }
}
